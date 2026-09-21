import React from 'react';
import { VariablesStyles } from './VariablesStyles';
import { MainStyles } from './MainStyles';
import { LoginStyles } from './LoginStyles';
import { DashboardStyles } from './DashboardStyles';
import { WorkspaceStyles } from './WorkspaceStyles';
import { StudentViewStyles } from './StudentViewStyles';
import { ModalsStyles } from './ModalsStyles';
import { CompletedStyles } from './CompletedStyles';
import { MobileStyles } from './MobileStyles';
import { IllustrationAnimationStyles } from './IllustrationAnimationStyles';

export const AppStyles: React.FC = () => {
  return (
    <>
      <VariablesStyles />
      <MainStyles />
      <LoginStyles />
      <DashboardStyles />
      <WorkspaceStyles />
      <StudentViewStyles />
      <ModalsStyles />
      <CompletedStyles />
      <MobileStyles />
      <IllustrationAnimationStyles />
    </>
  );
};
