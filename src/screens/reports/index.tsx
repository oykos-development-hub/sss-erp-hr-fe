import {Tab} from '@oykos-development/devkit-react-ts-styled-components';
import {Button, Divider, Dropdown, Theme, Typography} from 'client-library';
import {saveAs} from 'file-saver';
import {useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {StyledTabs} from '../../components/employeeDetails/styles';
import {OverviewBox} from '../../components/employeesList/styles';
import {patterns} from '../../constants.ts';
import useAppContext from '../../context/useAppContext';
import useGetOrganizationUnits from '../../services/graphql/organizationUnits/useGetOrganizationUnits';
import useGetUserProfiles from '../../services/graphql/userProfile/useGetUserProfiles';
import useVacationReport from '../../services/graphql/vacationReport/useVacationReport';
import {ScreenWrapper} from '../../shared/screenWrapper/screenWrapper';
import {DropdownDataNumber} from '../../types/dropdownData.ts';
import {Column, FormContainer, Option, RowWrapper, TitleWrapper} from './styles';
import {HrReportType, reportsTabs, reportTypeOptions} from './types';
import {VacationReportResponse} from '../../types/graphql/vacationReport.ts';
import useGetJudges from '../../services/graphql/judges/useGetJudges.ts';
import {JudgesListFilters} from '../judges/judgeNorms/judges.tsx';

interface ReportsScreenProps {
  report_type: DropdownDataNumber;
  employee: DropdownDataNumber;
  organization_unit: DropdownDataNumber;
}
export const ReportsScreen: React.FC = () => {
  const {
    control,
    formState: {errors},
    handleSubmit,
    watch,
  } = useForm<ReportsScreenProps>();

  const {
    reportService: {generatePdf},
    contextMain,
    alert,
  } = useAppContext();

  const [activeTab, setActiveTab] = useState(1);
  const onTabChange = (tab: Tab) => {
    setActiveTab(tab.id as number);
  };

  const getTitle = reportsTabs.find(tab => tab.id === activeTab)?.title ?? '';

  const downloadReport = (data: ReportsScreenProps) => {
    const fileName = data.report_type.id.toString();
    const downloadPath = `/patterns/${fileName}`;

    saveAs(downloadPath, fileName);
  };

  const getOptions = () => {
    switch (activeTab) {
      case 1:
        // izvještaji
        return reportTypeOptions;
      case 2:
        // šabloni
        return patterns;
      default:
        return [];
    }
  };

  const {organizationUnits} = useGetOrganizationUnits(undefined, {allOption: true});
  const filteredOrganizationUnits = organizationUnits?.filter(unit => unit?.id !== 3);

  const reportTypeID = watch('report_type')?.id;
  const organizationUnit = watch('organization_unit');
  const emloyeeId = watch('employee')?.id;
  const {userProfiles} = useGetUserProfiles({page: 1, size: 100000, organization_unit_id: organizationUnit});

  const {fetch} = useVacationReport();
  const {judges} = useGetJudges({
    page: 1,
    size: 1000,
    user_profile: null,
    organization_unit: null,
  });

  const generateVacationReport = async (data: ReportsScreenProps) => {
    if (activeTab === 1) {
      const vacationReportData = await fetch({
        employee_id: emloyeeId ? emloyeeId : null,
        organization_unit_id: organizationUnit?.id,
        type: 1,
      });

      const data = vacationReportData?.items?.map((item: any) => {
        return {
          full_name: item.full_name,
          organization_unit: item.organization_unit,
          total_days: item.total_days,
          used_days: item.used_days,
          left_days: item.left_days,
        };
      });

      if (data !== undefined) {
        generatePdf('VACATION_REPORT', {
          data,
        });
      } else {
        alert.error('Greška prilikom generisanja izvještaja.');
      }
    } else if (activeTab === 2) {
      downloadReport(data);
    }
  };

  const generateNumberofJudgesReport = async (data: ReportsScreenProps) => {
    if (activeTab === 1) {
      const reportData = filteredOrganizationUnits
        ?.filter(unit => (data?.organization_unit.id === 0 ? unit?.id !== 0 : unit?.id === data?.organization_unit.id))
        ?.map((item: any) => {
          const filteredJudges = judges
            ?.filter((judge: any) => judge.organization_unit.id === item.id)
            .map(judge => judge.full_name);
          return {
            organization_unit: item.title,
            judges: filteredJudges,
          };
        });
      generatePdf('NUMBER_OF_JUDGES_REPORT', {reportData});
    } else {
      //TODO: download pattern
    }
  };

  const onSubmit = async (data: ReportsScreenProps) => {
    switch (reportTypeID) {
      case HrReportType.UsedVacationDays:
        generateVacationReport(data);
        break;
      case HrReportType.NumberOfJudges:
        generateNumberofJudgesReport(data);
        break;
    }
  };

  return (
    <ScreenWrapper>
      <OverviewBox>
        <TitleWrapper>
          <Typography style={{fontWeight: 600}} variant="bodyMedium" content={getTitle} />
          <StyledTabs
            tabs={reportsTabs}
            activeTab={activeTab}
            onChange={onTabChange}
            //TODO: change in devkit/library
            style={{borderWidth: '1px', borderRadius: '0.5em 0.5em 0 0', whiteSpace: 'nowrap'}}
          />
        </TitleWrapper>
        <Divider color={Theme?.palette?.gray200} height="1px" style={{margin: 0}} />
        <FormContainer onSubmit={handleSubmit(onSubmit)}>
          <>
            <Option>
              <Controller
                control={control}
                name="report_type"
                rules={{required: 'Ovo polje je obavezno!'}}
                render={({field: {onChange, value}}) => (
                  <Dropdown
                    label={`TIP ${getTitle.slice(0, -1).toUpperCase()}A`}
                    value={value}
                    onChange={onChange}
                    options={getOptions()}
                    isRequired
                    error={errors.report_type?.message as string}
                  />
                )}
              />
            </Option>
            <RowWrapper>
              {(reportTypeID === HrReportType.NumberOfJudges || reportTypeID === HrReportType.UsedVacationDays) && (
                <Column>
                  <Controller
                    control={control}
                    name="organization_unit"
                    rules={{required: 'Ovo polje je obavezno!'}}
                    render={({field: {onChange, value}}) => (
                      <Dropdown
                        label="ORGANIZACIONA JEDINICA:"
                        value={value}
                        onChange={onChange}
                        options={
                          reportTypeID === HrReportType.NumberOfJudges ? filteredOrganizationUnits : organizationUnits
                        }
                        isRequired
                        error={errors.organization_unit?.message as string}
                      />
                    )}
                  />
                </Column>
              )}

              {reportTypeID === HrReportType.UsedVacationDays && (
                <Column>
                  <Controller
                    control={control}
                    name="employee"
                    render={({field: {onChange, value}}) => (
                      <Dropdown
                        label="ZAPOSLENI:"
                        value={value}
                        onChange={onChange}
                        options={userProfiles.map(user => ({
                          id: user.id,
                          title: ` ${user.first_name} ${user.last_name} `,
                        }))}
                        error={errors.employee?.message as string}
                      />
                    )}
                  />
                </Column>
              )}
            </RowWrapper>

            <Button
              content={`Generiši ${getTitle.slice(0, -1).toLowerCase()}`}
              style={{width: 'fit-content'}}
              type="submit"
            />
          </>
        </FormContainer>
      </OverviewBox>
    </ScreenWrapper>
  );
};
