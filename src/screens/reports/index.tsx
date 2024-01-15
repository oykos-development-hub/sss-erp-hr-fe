import {Tab} from '@oykos-development/devkit-react-ts-styled-components';
import {Typography, Divider, Theme, Dropdown, Button} from 'client-library';
import {ScreenWrapper} from '../../shared/screenWrapper/screenWrapper';
import {reportsTabs} from './types';
import {useState} from 'react';
import {FormContainer, TitleWrapper, Option} from './styles';
import {OverviewBox} from '../../components/employeesList/styles';
import {StyledTabs} from '../../components/employeeDetails/styles';
import {useForm, Controller} from 'react-hook-form';

export const ReportsScreen: React.FC = () => {
  const {
    control,
    formState: {errors},
    handleSubmit,
  } = useForm();
  const [activeTab, setActiveTab] = useState(1);
  const onTabChange = (tab: Tab) => {
    setActiveTab(tab.id as number);
  };
  return (
    <ScreenWrapper>
      <OverviewBox>
        <TitleWrapper>
          <Typography
            style={{fontWeight: 600}}
            variant="bodyMedium"
            content={activeTab === 1 ? 'Izvještaji' : 'Šabloni'}
          />
          <StyledTabs
            tabs={reportsTabs}
            activeTab={activeTab}
            onChange={onTabChange}
            //TODO: change in devkit/library
            style={{borderWidth: '1px', borderRadius: '0.5em 0.5em 0 0', whiteSpace: 'nowrap'}}
          />
        </TitleWrapper>
        <Divider color={Theme?.palette?.gray200} height="1px" style={{margin: 0}} />
        <FormContainer>
          <>
            <Option>
              <Controller
                control={control}
                name="report_type"
                rules={{required: 'Ovo polje je obavezno!'}}
                render={({field: {onChange, value}}) => (
                  <Dropdown
                    label={activeTab === 1 ? 'TIP IZVJEŠTAJA:' : 'TIP ŠABLONA:'}
                    value={value}
                    onChange={onChange}
                    options={[]}
                    isRequired
                    error={errors.report_type?.message as string}
                  />
                )}
              />
            </Option>

            <Button
              content={activeTab === 1 ? 'Generiši izvještaj' : 'Generiši šablon'}
              style={{width: 'fit-content'}}
              type="submit"
            />
          </>
        </FormContainer>
      </OverviewBox>
    </ScreenWrapper>
  );
};
