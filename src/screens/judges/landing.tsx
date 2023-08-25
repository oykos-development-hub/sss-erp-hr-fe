import React from 'react';
import {AnimationWrapper, ParentContainer, RedDiv, Title} from '../../components/underConstruction/styles';
import Animation from '../../components/underConstruction/animation';

 const Judges: React.FC = () => {

  return (
    <ParentContainer>
        <RedDiv>
          <Title>
            <h1>SUDIJE</h1>
            <h6>STRANICA JE U FAZI IZRADE</h6>
          </Title>
        </RedDiv>
        <AnimationWrapper>
          <Animation />
        </AnimationWrapper>
    </ParentContainer>
  );
};

export default Judges;