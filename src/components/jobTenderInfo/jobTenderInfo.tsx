import React from 'react';
import {Divider, Theme} from '@oykos-development/devkit-react-ts-styled-components';
import {JobTender} from '../../types/graphql/jobTenders';
import {parseDate} from '../../utils/dateUtils';
import {MainTitle} from '../employeesList/styles';
import {Column, Container, Details, InfoPreview, StyledLabel, StyledValue} from './styles';

interface JobTenderInfo {
  data: JobTender;
}

const JobTenderInfo = ({data}: JobTenderInfo) => {
  return (
    <Container>
      <MainTitle variant="bodyMedium" content={`BROJ OGLASA: ${data?.serial_number}`} />
      <Divider color={Theme?.palette?.gray200} height="1px" />

      <Details>
        <Column>
          <InfoPreview>
            <StyledLabel variant="bodyMedium" content="Tip oglasa:" />
            <StyledValue variant="bodyMedium" content={data?.type?.title} />
          </InfoPreview>
          <InfoPreview>
            <StyledLabel variant="bodyMedium" content="Datum objave:" />
            <StyledValue variant="bodyMedium" content={parseDate(data?.date_of_start)} />
          </InfoPreview>
          <InfoPreview>
            <StyledLabel variant="bodyMedium" content="Broj oglasa:" />
            <StyledValue variant="bodyMedium" content={data?.serial_number} />
          </InfoPreview>
        </Column>
        <Column>
          <InfoPreview>
            <StyledLabel variant="bodyMedium" content="Organizaciona jedinica:" />
            <StyledValue variant="bodyMedium" content={data?.organization_unit?.title} />
          </InfoPreview>
          <InfoPreview>
            <StyledLabel variant="bodyMedium" content="Oglas je validan do:" />
            <StyledValue variant="bodyMedium" content={data?.date_of_end ? parseDate(data?.date_of_end) : ''} />
          </InfoPreview>
        </Column>
      </Details>
    </Container>
  );
};

export default JobTenderInfo;
