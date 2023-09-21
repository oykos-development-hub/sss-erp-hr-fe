import {Typography} from '@oykos-development/devkit-react-ts-styled-components';
import styled from 'styled-components';

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 30px;
  margin-bottom: 30px;
`;

export const Badge = styled(Typography)<{$status?: number}>`
  display: flex;
  flex-direction: row;
  -webkit-box-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  align-items: center;
  padding: 0.125rem 0.625rem;
  background-color: ${props => (props.$status === 1 ? '#ffebee' : props.$status === 2 ? '#e8f5e9' : '#ffe3b9')};
  color: rgb(33, 26, 26);
  font-family: Merriweather, sans-serif;
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.25rem;
  border-radius: 1rem;
  mix-blend-mode: multiply;
`;
