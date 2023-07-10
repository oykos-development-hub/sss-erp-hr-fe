import React from 'react';
import {Button} from 'client-library';
import {ScreenProps} from '../types/screen-props';

export const LandingScreen: React.FC<ScreenProps> = (props: ScreenProps) => {
  return (
    <div>
      <h2>HR MICROSERVICE Landing screen</h2>
      <Button content="Back to /" variant="primary" size="xs" onClick={() => props.context.navigation.navigate('/')} />
      <Button
        content="Employees"
        variant="primary"
        size="xs"
        onClick={() => props.context.navigation.navigate('/hr/employees')}
      />
      <Button
        content="Systematization"
        variant="primary"
        size="xs"
        onClick={() => props.context.navigation.navigate('/hr/systematization')}
      />
    </div>
  );
};
