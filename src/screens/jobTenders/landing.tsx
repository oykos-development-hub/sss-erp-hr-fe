import {SystemIcon, AdsIcon, Typography} from 'client-library';
import React from 'react';
import useAppContext from '../../context/useAppContext';
import {ScreenWrapper} from '../../shared/screenWrapper/screenWrapper';
import {Container, ContentBox, IconWrapper, LandingPageTitle, Title, TitleWrapper} from '../landingPage/styles';

export const JobTenders: React.FC = () => {
  const {
    navigation: {navigate},
    breadcrumbs,
  } = useAppContext();

  return (
    <ScreenWrapper showBreadcrumbs={false}>
      <div>
        <LandingPageTitle>
          <Typography variant="bodyLarge" style={{fontWeight: 600}} content="OGLASI" />
        </LandingPageTitle>
        <Container>
          <ContentBox
            onClick={() => {
              navigate('/hr/job-tenders/job-tenders-list');
              breadcrumbs.add({name: 'Pregled svih oglasa', path: '/hr/job-tenders/job-tenders-list'});
            }}>
            <TitleWrapper>
              <Title variant="bodyLarge" content="Pregled svih oglasa" />
            </TitleWrapper>
            <IconWrapper>
              <AdsIcon />
            </IconWrapper>
          </ContentBox>
          <ContentBox
            onClick={() => {
              navigate('/hr/job-tenders/job-tender-applications');
              breadcrumbs.add({name: 'Pregled svih kandidata', path: '/hr/job-tenders/job-tender-applications'});
            }}>
            <TitleWrapper>
              <Title variant="bodyLarge" content="Pregled svih kandidata" />
            </TitleWrapper>
            <IconWrapper>
              <SystemIcon />
            </IconWrapper>
          </ContentBox>
        </Container>
      </div>
    </ScreenWrapper>
  );
};
