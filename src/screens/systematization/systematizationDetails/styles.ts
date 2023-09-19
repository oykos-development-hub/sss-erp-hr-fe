import styled from 'styled-components';
import {Theme, Datepicker} from 'client-library';

export const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
export const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin: 20px 0;
`;

export const ButtonWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 30px 0;
`;

export const SectorsWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export const AccordionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${Theme?.palette?.gray50};
  padding: 10px 16px;
  border-bottom: 0;
`;

export const AccordionIconsWrapper = styled.div<{isOpen: boolean}>`
  display: flex;
  align-items: center;
  gap: 10px;
  > svg {
    padding: 5px;
    border-radius: 8px;
    height: 16px;
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
  align-items: center;
  margin-top: 30px;
  background-color: ${Theme?.palette?.gray50};
  padding: 20px 10px;
  border-radius: 0px 0px 8px 8px;
  border-top: 2px solid ${Theme?.palette?.primary500};
  & button {
    margin-top: 27px;
    margin-left: auto;
  }
`;

export const Activation = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
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
  margin-top: 50px;
`;

export const JobInfo = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 50px;
  border-bottom: 1px solid ${Theme?.palette?.gray100};
  padding-top: 20px;
  justify-content: space-between;
`;

export const Menu = styled.div<{open: boolean}>`
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: ${Theme?.palette?.white};
  border-radius: 8px;
  box-shadow: 0px 12px 16px -4px rgba(16, 24, 40, 0.08), 0px 4px 6px -2px rgba(16, 24, 40, 0.03);
  position: absolute;
  right: 35px;
  top: 5px;
  z-index: 99;
  height: ${props => (props.open ? 'auto' : '0')};
  overflow: hidden;
  transition: height 0.3s ease;
  min-width: 200px;
`;

export const MenuItem = styled.div`
  display: flex;
  align-items: center;
  padding: 5px 14px;
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
  align-items: center;
  width: 100%;

  > div > div {
    display: flex;
    justify-content: space-between;
    width: 100%;

    & div > p > p {
      font-weight: 600;
      line-height: 20px;
    }
  }

  > div > div > div {
    flex-direction: row-reverse;
  }
`;
