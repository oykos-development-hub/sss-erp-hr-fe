import {BookIcon, JudgeIcon, Typography} from 'client-library';
import React from 'react';
import useAppContext from '../../context/useAppContext';
import {ScreenWrapper} from '../../shared/screenWrapper/screenWrapper';
import {Container, ContentBox, IconWrapper, LandingPageTitle, Title, TitleWrapper} from '../landingPage/styles';

export const Judges: React.FC = () => {
  const {
    navigation: {navigate},
    breadcrumbs,
  } = useAppContext();

  return (
    <ScreenWrapper showBreadcrumbs={false}>
      <div>
        <LandingPageTitle>
          <Typography variant="bodyLarge" style={{fontWeight: 600}} content="SUDIJE" />
        </LandingPageTitle>
        <Container>
          <ContentBox
            onClick={() => {
              navigate('/hr/judges/number-decision');
              breadcrumbs.add({name: 'Odlika o broju sudija', path: '/hr/judges/number-decision'});
            }}>
            <TitleWrapper>
              <Title variant="bodyLarge" content="Odlika o broju sudija" />
            </TitleWrapper>
            <IconWrapper>
              <JudgeIcon />
            </IconWrapper>
          </ContentBox>
          <ContentBox
            onClick={() => {
              navigate('/hr/judges/overview-judges-presidents');
              breadcrumbs.add({name: 'Pregled Sudija i predsjednika', path: '/hr/judges/overview-judges-presidents'});
            }}>
            <TitleWrapper>
              <Title variant="bodyLarge" content="Pregled Sudija i predsjednika" />
            </TitleWrapper>
            <IconWrapper>
              <BookIcon />
            </IconWrapper>
          </ContentBox>
        </Container>
      </div>
    </ScreenWrapper>
  );
};
