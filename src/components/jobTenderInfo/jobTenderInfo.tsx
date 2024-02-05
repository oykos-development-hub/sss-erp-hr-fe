import {Divider, Theme} from '@oykos-development/devkit-react-ts-styled-components';
import {JobTender} from '../../types/graphql/jobTenders';
import {parseDate} from '../../utils/dateUtils';
import {MainTitle} from '../employeesList/styles';
import {Column, Container, Details, InfoPreview, StyledLabel, StyledValue, TitleAndButtonContainer} from './styles';
import FileList from '../fileList/fileList';
import {Button} from 'client-library';
import useJobTenderApplications from '../../services/graphql/jobTenderApplications/useGetJobTenderApplications.ts';
import useAppContext from '../../context/useAppContext.ts';

interface JobTenderInfo {
  data: JobTender;
}

const JobTenderInfo = ({data}: JobTenderInfo) => {
  const {
    reportService: {generatePdf},
  } = useAppContext();

  const {jobTenderApplications} = useJobTenderApplications(
    {page: 1, size: 10000, job_tender_id: data?.id},
    {skip: !data?.id},
  );
  const printReport = () => {
    const mappedCandidates = jobTenderApplications.map(item => ({
      name: `${item?.first_name} ${item?.last_name}`,
      organization_unit: item?.organization_unit?.title,
      evaluation: item?.evaluation,
      date: parseDate(item?.date_of_application),
    }));

    generatePdf('JOB_TENDER_CANDIDATES', {
      dataForReport: {
        jobTender: `${data?.type?.title} - ${data?.serial_number}`,
        candidates: mappedCandidates,
      },
    });
  };

  return (
    <Container>
      <TitleAndButtonContainer>
        <MainTitle variant="bodyMedium" content={`BROJ OGLASA: ${data?.serial_number}`} />
        {data?.active === false ? (
          <Button content={'Štampaj'} onClick={() => printReport()} style={{marginBottom: 10}} />
        ) : null}
      </TitleAndButtonContainer>

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
          <InfoPreview>
            <StyledLabel variant="bodyMedium" content="Dokument:" />
            <StyledValue variant="bodyMedium" content={<FileList files={data?.file?.id ? [data?.file] : []} />} />
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
