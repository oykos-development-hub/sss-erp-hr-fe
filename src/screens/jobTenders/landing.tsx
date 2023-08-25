import React from 'react';
import {AnimationWrapper, ParentContainer, RedDiv, Title} from '../../components/underConstruction/styles';
import Animation from '../../components/underConstruction/animation';

const JobTenders: React.FC = () => {
  return (
    <ParentContainer>
      <RedDiv>
        <Title>
          <h1>OGLASI</h1>
          <h6>STRANICA JE U FAZI IZRADE</h6>
        </Title>
      </RedDiv>
      <AnimationWrapper>
        <Animation />
      </AnimationWrapper>
    </ParentContainer>
  );
};

export default JobTenders;
