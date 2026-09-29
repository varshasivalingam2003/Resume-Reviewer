"""
FastAPI Microservice for Dynamic Resume Personal Information Privacy Redaction
Receives resume PDF bytes, applies permanent redaction and natural Gaussian blur,
and streams back the sanitized PDF.
"""

from fastapi import FastAPI, Request, Response, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from python_service.redactor import sanitize_resume_pdf, validate_sanitized_pdf

app = FastAPI(
    title="Resume Privacy Redactor API",
    description="Dynamically redacts candidate personal info (email, phone, address, social links, profile photo) while preserving candidate name and professional content.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health_check():
    return {
        "status": "ok",
        "service": "resume-privacy-redactor",
        "engine": "PyMuPDF + OpenCV"
    }


@app.post("/sanitize")
async def sanitize_pdf_endpoint(
    request: Request,
    name: str = Query(None, description="Candidate name to protect from redaction")
):
    try:
        content_type = request.headers.get("content-type", "")
        
        # Support multipart form-data or raw application/pdf stream
        if "multipart/form-data" in content_type:
            form = await request.form()
            file = form.get("file")
            if not file:
                raise HTTPException(status_code=400, detail="No file uploaded in form")
            input_bytes = await file.read()
            if not name and "name" in form:
                name = str(form.get("name"))
        else:
            input_bytes = await request.body()
            
        if not input_bytes or len(input_bytes) < 30:
            raise HTTPException(status_code=400, detail="Invalid or empty PDF payload")

        sanitized_bytes, redact_count = sanitize_resume_pdf(input_bytes, candidate_name=name)
        
        return Response(
            content=sanitized_bytes,
            media_type="application/pdf",
            headers={
                "X-Redaction-Count": str(redact_count),
                "Content-Disposition": 'inline; filename="Sanitized_Resume.pdf"',
                "Access-Control-Allow-Origin": "*"
            }
        )
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"PDF Redaction failed: {str(e)}")


if __name__ == '__main__':
    uvicorn.run(app, host="127.0.0.1", port=8001)
