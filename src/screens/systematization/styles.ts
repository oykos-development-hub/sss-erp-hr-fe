import {Typography, Theme} from 'client-library';
import styled, {css} from 'styled-components';

const {success50, error50, warning100} = Theme.palette;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 30px;
  margin-bottom: 30px;
`;

export const Badge = styled(Typography)(
  ({status}: {status?: number}) => css`
    text-align: center;
    padding: 0.25em 0.5em;
    background-color: ${status === 1 ? error50 : status === 2 ? success50 : warning100};
    font-size: 16px;
    font-weight: 500;
    border-radius: 1em;
  `,
);
