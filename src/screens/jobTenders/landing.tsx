import React from 'react';
import {AnimationWrapper, ParentContainer, RedDiv, Title} from '../../components/landingPage/styles';
import Animation from '../../components/landingPage/animation';

const JobTenders: React.FC = () => {
  return (
    <ParentContainer>
      <RedDiv>
        <Title>
          <h1>OGLASI</h1>
        </Title>
      </RedDiv>
      <AnimationWrapper>
        <Animation />
      </AnimationWrapper>
    </ParentContainer>
  );
};

export default JobTenders;