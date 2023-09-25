import styled from 'styled-components';
import {Theme, Datepicker} from 'client-library';

export const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
export const Row = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1.5em;
  margin-top: 1.5em;
  width: 100%;
`;

export const MainWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 1.5em;
`;

export const SectorsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const AccordionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${Theme?.palette?.gray50};
  padding: 0.75em 1em;
  border-bottom: 0;
`;

export const AccordionIconsWrapper = styled.div<{isOpen: boolean}>`
  display: flex;
  align-items: center;
  gap: 10px;
  > svg {
    padding: 0.25em;
    border-radius: 0.5em;
    height: 1em;
    :hover {
      background-color: ${Theme?.palette?.gray100};
    }
  }
  & svg:first-child {
    transition: transform 0.3s ease-in-out;
    transform: rotate(${props => (props.isOpen ? '180deg' : '0deg')});
  }
`;

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
  align-items: flex-end;
  gap: 1.25em;
  & > div:first-child > div > div > div > div {
    background-color: transparent;
  }
`;

export const PrintPageWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export const SectorTitle = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 3em;
`;

export const JobInfo = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 3em;
  border-bottom: 1px solid ${Theme?.palette?.gray100};
  padding-top: 1.5em;
  justify-content: space-between;
`;

export const Menu = styled.div<{open: boolean}>`
  display: flex;
  flex-direction: column;
  gap: 0.75em;
  background-color: ${Theme?.palette?.white};
  border-radius: 0.5em;
  box-shadow: 0px 12px 16px -4px rgba(16, 24, 40, 0.08), 0px 4px 6px -2px rgba(16, 24, 40, 0.03);
  position: absolute;
  right: 2em;
  top: 0.25em;
  z-index: 99;
  height: ${props => (props.open ? 'auto' : '0')};
  overflow: hidden;
  transition: height 0.3s ease;
  min-width: 200px;
`;

export const MenuItem = styled.div`
  display: flex;
  align-items: center;
  padding: 0.25em 1em;
  z-index: 99;

  :hover {
    background-color: ${Theme?.palette?.gray100};
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

export const FileUploadWrapper = styled.div`
  display: flex;
  align-self: flex-start;
  flex-direction: column;
  gap: 0.25em;
  width: 50%;

  & > p {
    font-weight: 600;
    text-transform: uppercase;
  }

  & > div {
    box-sizing: border-box;
  }

  & > div > div {
    display: flex;
    justify-content: space-between;
    width: 100%;

    & div > p > p {
      font-weight: 600;
    }
  }

  > div > div > div {
    flex-direction: row-reverse;
  }
`;

export const UploadWrapper = styled.div`
  display: flex;
  margin-bottom: 1.5em;
  width: 100%;
  gap: 1.25em;
  & > div > div {
    width: 100%;
  }
`;

export const SwitchWrapper = styled.div`
  display: flex;
  gap: 0.5em;
  align-items: center;
`;
