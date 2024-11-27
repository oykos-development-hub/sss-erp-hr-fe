import {AdsIcon, BookIcon, JudgeIcon, ReportIcon, SystemIcon, SystematizationIcon, Typography} from 'client-library';
import React from 'react';
import useAppContext from '../../context/useAppContext';
import {ScreenWrapper} from '../../shared/screenWrapper/screenWrapper';
import {Container, ContentBox, IconWrapper, LandingPageTitle, Title, TitleWrapper} from './styles';
import {checkRoutePermissions} from '../../services/checkRoutePermissions.ts';

export const LandingPage: React.FC = () => {
  const {
    contextMain,
    navigation: {navigate},
    breadcrumbs,
  } = useAppContext();
  const allowedRoutes = checkRoutePermissions(contextMain?.permissions);

  return (
    <ScreenWrapper showBreadcrumbs={false}>
      <div>
        <LandingPageTitle>
          <Typography variant="bodyLarge" style={{fontWeight: 600}} content="LJUDSKI RESURSI" />
        </LandingPageTitle>
        <Container>
          {allowedRoutes.includes('/hr/employees') && (
            <ContentBox
              onClick={() => {
                navigate('/hr/employees');
                breadcrumbs.add({name: 'Kadrovi', path: '/hr/employees'});
              }}>
              <TitleWrapper>
                <Title variant="bodyLarge" content="Kadrovi" />
              </TitleWrapper>
              <IconWrapper>
                <SystemIcon />
              </IconWrapper>
            </ContentBox>
          )}
          {allowedRoutes.includes('/hr/systematization') && (
            <ContentBox
              onClick={() => {
                navigate('/hr/systematization');
                breadcrumbs.add({name: 'Sistematizacija', path: '/hr/systematization'});
              }}>
              <TitleWrapper>
                <Title variant="bodyLarge" content="Sistematizacija" />
              </TitleWrapper>
              <IconWrapper>
                <SystematizationIcon />
              </IconWrapper>
            </ContentBox>
          )}
          {allowedRoutes.includes('/hr/judges') && (
            <ContentBox
              onClick={() => {
                navigate('/hr/judges');
                breadcrumbs.add({name: 'Sudije', path: '/hr/judges'});
              }}>
              <TitleWrapper>
                <Title variant="bodyLarge" content="Sudije" />
              </TitleWrapper>
              <IconWrapper>
                <JudgeIcon />
              </IconWrapper>
            </ContentBox>
          )}
          {allowedRoutes.includes('/hr/job-tenders') && (
            <ContentBox
              onClick={() => {
                navigate('/hr/job-tenders');
                breadcrumbs.add({name: 'Oglasi', path: '/hr/job-tenders'});
              }}>
              <TitleWrapper>
                <Title variant="bodyLarge" content="Oglasi" />
              </TitleWrapper>
              <IconWrapper>
                <AdsIcon />
              </IconWrapper>
            </ContentBox>
          )}
          {allowedRoutes.includes('/hr/revision-recommendations') && (
            <ContentBox
              onClick={() => {
                navigate('/hr/revision-recommendations');
                breadcrumbs.add({name: 'Interne revizije', path: '/hr/revision-recommendations'});
              }}>
              <TitleWrapper>
                <Title variant="bodyLarge" content="Interne revizije" />
              </TitleWrapper>
              <IconWrapper>
                <BookIcon />
              </IconWrapper>
            </ContentBox>
          )}
          {allowedRoutes.includes('/hr/reports') && (
            <ContentBox
              onClick={() => {
                navigate('/hr/reports');
                breadcrumbs.add({name: 'Izvještaji', path: '/hr/reports'});
              }}>
              <TitleWrapper>
                <Title variant="bodyLarge" content="Izvještaji" />
              </TitleWrapper>
              <IconWrapper>
                <ReportIcon />
              </IconWrapper>
            </ContentBox>
          )}
        </Container>
      </div>
    </ScreenWrapper>
  );
};
