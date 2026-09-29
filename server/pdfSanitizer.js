import http from 'http';
import { execFile } from 'child_process';
import path from 'path';
import fs from 'fs';
import os from 'os';
import crypto from 'crypto';

const PYTHON_API_PORT = 8001;
const PYTHON_API_HOST = '127.0.0.1';
const VENV_PYTHON = path.resolve(process.cwd(), '.venv/bin/python');
const REDACTOR_SCRIPT = path.resolve(process.cwd(), 'python_service/redactor.py');

// In-memory cache for sanitized PDF buffers (key: hash(pdfBuffer + candidateName))
const sanitizedCache = new Map();

/**
 * Calculates a quick SHA-256 hash of a buffer + name
 */
function getHash(buffer, name = '') {
  return crypto.createHash('sha256').update(buffer).update(name).digest('hex');
}

/**
 * Sends a PDF buffer to the FastAPI server running on port 8001
 */
function sendToPythonApi(pdfBuffer, candidateName = '') {
  return new Promise((resolve, reject) => {
    const query = candidateName ? `?name=${encodeURIComponent(candidateName)}` : '';
    const req = http.request(
      {
        hostname: PYTHON_API_HOST,
        port: PYTHON_API_PORT,
        path: `/sanitize${query}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Length': pdfBuffer.length
        },
        timeout: 8000 // 8 second timeout before fallback
      },
      res => {
        if (res.statusCode !== 200) {
          return reject(new Error(`Python API returned status ${res.statusCode}`));
        }
        const chunks = [];
        res.on('data', chunk => chunks.push(chunk));
        res.on('end', () => resolve(Buffer.concat(chunks)));
      }
    );

    req.on('error', err => reject(err));
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Python API request timed out'));
    });

    req.write(pdfBuffer);
    req.end();
  });
}

/**
 * Fallback: Executes python_service/redactor.py directly via child_process
 */
function runPythonCliFallback(pdfBuffer, candidateName = '') {
  return new Promise((resolve, reject) => {
    const tmpDir = os.tmpdir();
    const id = crypto.randomBytes(8).toString('hex');
    const inPath = path.join(tmpDir, `res_in_${id}.pdf`);
    const outPath = path.join(tmpDir, `res_out_${id}.pdf`);

    fs.writeFile(inPath, pdfBuffer, writeErr => {
      if (writeErr) return reject(writeErr);

      const pythonBin = fs.existsSync(VENV_PYTHON) ? VENV_PYTHON : 'python3';
      const args = [REDACTOR_SCRIPT, inPath, outPath];
      if (candidateName) {
        args.push(candidateName);
      }

      execFile(pythonBin, args, (execErr, stdout, stderr) => {
        // Clean up input file
        try { fs.unlinkSync(inPath); } catch (_) {}

        if (execErr) {
          try { fs.unlinkSync(outPath); } catch (_) {}
          console.error('[PDF Sanitizer CLI Error]', stderr || execErr.message);
          return reject(execErr);
        }

        fs.readFile(outPath, (readErr, sanitizedBuffer) => {
          try { fs.unlinkSync(outPath); } catch (_) {}
          if (readErr) return reject(readErr);
          resolve(sanitizedBuffer);
        });
      });
    });
  });
}

export function clearSanitizerCache() {
  sanitizedCache.clear();
  console.log('[PDF Sanitizer] In-memory cache cleared.');
}

/**
 * Main PDF Sanitizer Entry Point
 * Pipes raw resume PDF through the Python PyMuPDF + OpenCV engine.
 */
export async function sanitizePdf(pdfBuffer, candidateName = '') {
  if (!pdfBuffer || pdfBuffer.length < 50) {
    return pdfBuffer;
  }

  let redactorVersion = '';
  try {
    if (fs.existsSync(REDACTOR_SCRIPT)) {
      redactorVersion = String(fs.statSync(REDACTOR_SCRIPT).mtimeMs);
    }
  } catch (_) {}

  const cacheKey = getHash(pdfBuffer, `${candidateName}_v${redactorVersion}`);
  if (sanitizedCache.has(cacheKey)) {
    console.log(`[PDF Sanitizer] Serving cached sanitized PDF for "${candidateName || 'Unknown'}" (${sanitizedCache.get(cacheKey).length} bytes)`);
    return sanitizedCache.get(cacheKey);
  }

  let sanitized;
  try {
    // 1. Try high-performance FastAPI microservice
    sanitized = await sendToPythonApi(pdfBuffer, candidateName);
    console.log(`[PDF Sanitizer] Sanitized via Python FastAPI service for "${candidateName || 'Unknown'}" (${sanitized.length} bytes)`);
  } catch (apiErr) {
    console.warn(`[PDF Sanitizer] FastAPI microservice offline (${apiErr.message}). Using Python CLI engine fallback.`);
    // 2. Seamless CLI fallback
    try {
      sanitized = await runPythonCliFallback(pdfBuffer, candidateName);
      console.log(`[PDF Sanitizer] Sanitized via Python CLI fallback for "${candidateName || 'Unknown'}" (${sanitized.length} bytes)`);
    } catch (cliErr) {
      console.error('[PDF Sanitizer] Both Python API and CLI failed:', cliErr.message);
      // If Python fails completely, return original buffer so user isn't blocked
      return pdfBuffer;
    }
  }

  if (sanitized && sanitized.length > 50) {
    // Cache up to 100 sanitized PDFs
    if (sanitizedCache.size > 100) {
      const firstKey = sanitizedCache.keys().next().value;
      sanitizedCache.delete(firstKey);
    }
    sanitizedCache.set(cacheKey, sanitized);
    return sanitized;
  }

  return pdfBuffer;
}
