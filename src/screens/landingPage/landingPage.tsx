import {AdsIcon, BookIcon, JudgeIcon, ReportIcon, SystemIcon, SystematizationIcon, Typography} from 'client-library';
import React from 'react';
import useAppContext from '../../context/useAppContext';
import {ScreenWrapper} from '../../shared/screenWrapper/screenWrapper';
import {Container, ContentBox, IconWrapper, LandingPageTitle, Title, TitleWrapper} from './styles';

export const LandingPage: React.FC = () => {
  const {
    navigation: {navigate},
    breadcrumbs,
  } = useAppContext();

  return (
    <ScreenWrapper showBreadcrumbs={false}>
      <div>
        <LandingPageTitle>
          <Typography variant="bodyLarge" style={{fontWeight: 600}} content="LJUDSKI RESURSI" />
        </LandingPageTitle>
        <Container>
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
          <ContentBox
            onClick={() => {
              navigate('/hr/revision-recommendations');
              breadcrumbs.add({name: 'Preporuke interne revizije', path: '/hr/revision-recommendations'});
            }}>
            <TitleWrapper>
              <Title variant="bodyLarge" content="Preporuke interne revizije" />
            </TitleWrapper>
            <IconWrapper>
              <BookIcon />
            </IconWrapper>
          </ContentBox>
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
        </Container>
      </div>
    </ScreenWrapper>
  );
};
