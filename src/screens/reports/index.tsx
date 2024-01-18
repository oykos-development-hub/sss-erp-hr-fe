import {Tab} from '@oykos-development/devkit-react-ts-styled-components';
import {Typography, Divider, Theme, Dropdown, Button} from 'client-library';
import {ScreenWrapper} from '../../shared/screenWrapper/screenWrapper';
import {reportsTabs} from './types';
import {useState} from 'react';
import {FormContainer, TitleWrapper, Option} from './styles';
import {OverviewBox} from '../../components/employeesList/styles';
import {StyledTabs} from '../../components/employeeDetails/styles';
import {useForm, Controller} from 'react-hook-form';
import {patterns} from '../../constants.ts';
import {saveAs} from 'file-saver';
import {DropdownDataString} from '../../types/dropdownData.ts';

interface ReportsScreenProps {
  report_type: DropdownDataString;
}
export const ReportsScreen: React.FC = () => {
  const {
    control,
    formState: {errors},
    handleSubmit,
  } = useForm<ReportsScreenProps>();
  const [activeTab, setActiveTab] = useState(1);
  const onTabChange = (tab: Tab) => {
    setActiveTab(tab.id as number);
  };

  const getTitle = reportsTabs.find(tab => tab.id === activeTab)?.title ?? '';

  const downloadReport = (data: ReportsScreenProps) => {
    const fileName = data.report_type.id;
    const downloadPath = `/patterns/${fileName}`;

    saveAs(downloadPath, fileName);
  };

  const getOptions = () => {
    switch (activeTab) {
      case 1:
        // izvještaji
        return [];
      case 2:
        // šabloni
        return patterns;
      default:
        return [];
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
        <FormContainer onSubmit={handleSubmit(downloadReport)}>
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
