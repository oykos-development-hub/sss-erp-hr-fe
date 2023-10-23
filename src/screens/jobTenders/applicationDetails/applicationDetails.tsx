import {Divider, Theme} from 'client-library';
import useAppContext from '../../../context/useAppContext';
import useGetJobTenderApplications from '../../../services/graphql/jobTenderApplications/useGetJobTenderApplications';
import InfoPreview from '../../../shared/infoPreview/infoPreview';
import {MainTitle} from '../../../shared/mainTitle';
import {ScreenWrapper} from '../../../shared/screenWrapper/screenWrapper';
import SectionBox from '../../../shared/sectionBox';
import {ScreenProps} from '../../../types/screen-props';
import {parseDate} from '../../../utils/dateUtils';
import {Details, Row} from './styles';

const ApplicationDetailsScreen = (props: ScreenProps) => {
  const {jobTenderApplications} = useGetJobTenderApplications({
    page: 1,
    size: 10,
    id: props.context.navigation.location.pathname.split('/')[4],
  });

  const {countries} = useAppContext();

  const application = jobTenderApplications[0];

  return (
    <ScreenWrapper>
      <SectionBox style={{marginTop: 25}}>
        <MainTitle content={`KANDIDAT: ${application?.first_name} ${application?.last_name}`} />
        <Divider color={Theme?.palette?.gray200} height="1px" />

        <Details>
          <Row>
            <InfoPreview label="Tip Kandidata:" value={application?.type} />
            <InfoPreview label="JMBG:" value={application?.official_personal_id} />
          </Row>
          <InfoPreview label="Ime:" value={application?.first_name} />
          <InfoPreview label="Prezime:" value={application?.last_name} />
          <InfoPreview label="Broj lične karte:" value={application?.official_personal_id} />
          <InfoPreview label="Datum rođenja:" value={parseDate(application?.date_of_birth)} />
          <InfoPreview
            label="Državljanstvo:"
            value={countries.find((country: any) => country.alpha3 === application?.citizenship)?.name ?? ''}
          />
        </Details>
      </SectionBox>
    </ScreenWrapper>
  );
};

export default ApplicationDetailsScreen;
