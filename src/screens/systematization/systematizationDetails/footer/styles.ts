import styled from 'styled-components';
import {Datepicker, Theme} from 'client-library';

export const FooterWrapper = styled.div`
  display: flex;
  align-items: flex-end;
  margin-top: 2em;
  background-color: ${Theme?.palette?.gray50};
  padding: 1.5em 0.75em;
  border-radius: 0 0 0.5em 0.5em;
  border-top: 2px solid ${Theme?.palette?.primary500};
  & button {
    margin-left: auto;
  }
`;

export const Activation = styled.div`
  display: flex;
  align-items: stretch;
  gap: 1.25em;

  & > div:first-child > div > div > div > div {
    background-color: transparent;
  }
`;

export const DatepickerElement = styled(Datepicker)`
  .react-datepicker__navigation--previous {
    margin-top: 0;
  }

  .react-datepicker__navigation--next {
    margin-top: 0;
  }
`;

export const SwitchWrapper = styled.div`
  display: flex;
  gap: 0.5em;
  align-items: center;
`;
