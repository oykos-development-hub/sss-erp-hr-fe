import styled from 'styled-components';

export const ControlsWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
  position: relative;
  overflow: visible;
`;

export const ControlIcon = styled.div`
  cursor: pointer;
  transition: all 0.3s ease;
  transform-origin: center;
  display: inline-block;
  width: 30px;
  height: 30px;
  
  &:hover {
    transform: scale(1.1);
  }
`;

export const FileNameWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 6px;
`;