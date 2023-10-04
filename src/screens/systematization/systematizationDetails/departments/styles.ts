import styled from 'styled-components';
import {Theme, MoreVerticalIcon} from 'client-library';

export const SectorsContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const AccordionWrapper = styled.div<{isOpen: boolean}>`
  & > div {
    & > div:last-child {
      max-height: ${({isOpen}) => (isOpen ? '1000000px' : '0px')};
    }
  }
`;

export const JobPositionTableWrapper = styled.div`
  overflow-y: auto;
  padding-inline: 0.75rem;
`;

export const AccordionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${Theme?.palette.gray50};
  padding: 0.75em 1em;
  border-bottom: none;
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
      background-color: ${Theme?.palette.gray100};
    }
  }

  & svg:first-child {
    transition: transform 0.3s ease-in-out;
    transform: rotate(${props => (props.isOpen ? '180deg' : '0deg')});
  }
`;

export const Menu = styled.div<{open: boolean}>`
  display: flex;
  flex-direction: column;
  gap: 0.75em;
  background-color: ${Theme?.palette.white};
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
    background-color: ${Theme?.palette.gray100};
  }
`;

export const OptionsIcon = styled(MoreVerticalIcon)`
  padding: 10px;
  width: 5px;
  height: 16px;
`;
