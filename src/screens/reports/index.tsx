import {Tab} from '@oykos-development/devkit-react-ts-styled-components';
import {Button, Divider, Dropdown, Theme, Typography} from 'client-library';
import {saveAs} from 'file-saver';
import {useEffect, useMemo, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {StyledTabs} from '../../components/employeeDetails/styles';
import {OverviewBox} from '../../components/employeesList/styles';
import {ReasonForAssessment} from '../../components/evaluationModal/constants.ts';
import {patterns} from '../../constants.ts';
import useAppContext from '../../context/useAppContext';
import useGetJudges from '../../services/graphql/judges/useGetJudges.ts';
import useGetOrganizationUnits from '../../services/graphql/organizationUnits/useGetOrganizationUnits';
import useGetUserProfiles from '../../services/graphql/userProfile/useGetUserProfiles';
import useVacationReport from '../../services/graphql/vacationReport/useVacationReport';
import {ScreenWrapper} from '../../shared/screenWrapper/screenWrapper';
import {DropdownDataNumber} from '../../types/dropdownData.ts';
import {Column, FormContainer, Option, RowWrapper, TitleWrapper} from './styles';
import {HrReportType, reportTypeOptions, reportsTabs} from './types';
import useGetSettings from '../../services/graphql/settings/useGetSettings.ts';
import useJudgeEvaluationReport from '../../services/graphql/judgeEvaluationReport/useJudgeEvaluationReport.ts';
import {parseDate} from '../../utils/dateUtils.ts';
import useGetCurrentResolutionNumbers from '../../services/graphql/judges/resolutions/useGetCurrentResolutionNumbers.ts';

interface ReportsScreenProps {
  report_type: DropdownDataNumber;
  employee: DropdownDataNumber;
  organization_unit: DropdownDataNumber;
  reason_for_evaluation: DropdownDataNumber;
  score: DropdownDataNumber;
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
  const [evaluationTypesOption, setEvaluationTypesOption] = useState<DropdownDataNumber[]>([]);
  const {settingsData} = useGetSettings({entity: 'evaluation_types'});
  const {organizationUnits} = useGetOrganizationUnits(undefined, {allOption: true});
  const filteredOrganizationUnits = organizationUnits?.filter(unit => unit?.id !== 3);

  const reportTypeID = watch('report_type')?.id;
  const organizationUnit = watch('organization_unit');
  const emloyeeId = watch('employee')?.id;
  const {userProfiles} = useGetUserProfiles({page: 1, size: 100000, organization_unit_id: organizationUnit});

  const {fetch} = useVacationReport();
  const {fetchJudgeEvaluationReport} = useJudgeEvaluationReport();
  const {judges} = useGetJudges({
    page: 1,
    size: 1000,
    user_profile: null,
    organization_unit: null,
  });
  const {judgesData} = useGetCurrentResolutionNumbers({
    resolution_id: null,
    active: true,
  });

  useMemo(() => {
    const newData = settingsData.map(item => ({id: item.id || 0, title: item.title || ''}));
    setEvaluationTypesOption(newData);
  }, [settingsData]);

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

  const generateJudgeEvaluationReport = async (data: ReportsScreenProps) => {
    if (activeTab === 1) {
      const judgeEvaluationData = await fetchJudgeEvaluationReport({
        reason_for_evaluation: data?.reason_for_evaluation?.title || null,
        organization_unit_id: data?.organization_unit?.id || null,
        score: data?.score?.title || null,
      });

      const dataForReport = judgeEvaluationData?.items?.map((item: any) => {
        return {
          id: item.id,
          full_name: item.full_name,
          judgment: item.judgment,
          reason_for_evaluation: item.reason_for_evaluation,
          date_of_evaluation: parseDate(item.date_of_evaluation),
          score: item.score,
          evaluation_period: item.evaluation_period,
          decision_number: item.decision_number,
        };
      });

      if (dataForReport !== undefined) {
        generatePdf('JUDGE_EVALUATION_REPORT', {
          dataForReport,
        });
      } else {
        alert.error('Greška prilikom generisanja izvještaja.');
      }
    } else {
      downloadReport(data);
    }
  };

  const generateVacantJudgePositionsReport = async () => {
    generatePdf('VACANT_JUDGE_POSITIONS', {
      judgesData,
    });
  };

  const onSubmit = async (data: ReportsScreenProps) => {
    switch (reportTypeID) {
      case HrReportType.UsedVacationDays:
        generateVacationReport(data);
        break;
      case HrReportType.NumberOfJudges:
        generateNumberofJudgesReport(data);
        break;
      case HrReportType.EvaluationsForJudges:
        generateJudgeEvaluationReport(data);
        break;
      case HrReportType.VacantJudgePositions:
        generateVacantJudgePositionsReport();
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
              {(reportTypeID === HrReportType.NumberOfJudges ||
                reportTypeID === HrReportType.UsedVacationDays ||
                reportTypeID === HrReportType.EvaluationsForJudges) && (
                <Column>
                  <Controller
                    control={control}
                    name="organization_unit"
                    rules={{
                      required:
                        reportTypeID !== HrReportType.EvaluationsForJudges ? 'Ovo polje je obavezno!' : undefined,
                    }}
                    render={({field: {onChange, value}}) => (
                      <Dropdown
                        label="ORGANIZACIONA JEDINICA:"
                        value={value}
                        onChange={onChange}
                        options={
                          reportTypeID === HrReportType.NumberOfJudges ? filteredOrganizationUnits : organizationUnits
                        }
                        isRequired={reportTypeID !== HrReportType.EvaluationsForJudges}
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
              {reportTypeID === HrReportType.EvaluationsForJudges && (
                <>
                  <Column>
                    <Controller
                      name="reason_for_evaluation"
                      control={control}
                      render={({field: {onChange, name, value}}) => {
                        return (
                          <Dropdown
                            onChange={onChange}
                            value={value as any}
                            name={name}
                            label="RAZLOG OCJENJIVANJA:"
                            options={ReasonForAssessment}
                          />
                        );
                      }}
                    />
                  </Column>
                  <Column>
                    <Controller
                      name="score"
                      control={control}
                      render={({field: {onChange, name, value}}) => {
                        return (
                          <Dropdown
                            onChange={onChange}
                            value={value as any}
                            name={name}
                            label="OCJENA:"
                            options={evaluationTypesOption}
                            isRequired
                          />
                        );
                      }}
                    />
                  </Column>
                </>
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
