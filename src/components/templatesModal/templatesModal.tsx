import {yupResolver} from '@hookform/resolvers/yup';
import {Dropdown, Modal} from 'client-library';
import React, {useEffect, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import * as yup from 'yup';
import {DropdownDataNumber} from '../../types/dropdownData';
import {FormGroup, ModalContentWrapper} from './styles';
import useAppContext from '../../context/useAppContext.ts';
import {TemplatesModalProps} from '../../screens/reports/types.ts';
import useGetOrganizationUnits from '../../services/graphql/organizationUnits/useGetOrganizationUnits.ts';
import {FileTemplateItem} from '../../types/fileUploadType.ts';
import useGetTemplates from '../../services/graphql/templates/useGetTemplates.ts';
import {Template} from '../../types/graphql/templates.ts';
import generateDynamicTemplate from '../../services/generateDynamicTemplate.ts';
import useGetParameterValues from '../../services/graphql/templates/useGetParameterValues.ts';

const templateSchema = yup.object().shape({
  template_id: yup.number().required(),
  organization_unit_id: yup.number().required(),
  user_profile_id: yup.number().required(),
});

export const TemplatesModal: React.FC<TemplatesModalProps> = ({open, onClose, userProfileId, alert}) => {
  const {
    contextMain: {organization_unit},
    fileService,
  } = useAppContext();

  const {
    control,
    formState: {errors},
    reset,
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(templateSchema),
    defaultValues: {
      organization_unit_id: organization_unit?.id,
      user_profile_id: userProfileId,
    },
  });

  const templateId = watch('template_id');
  const organizationUnitId = watch('organization_unit_id');
  const userProfileId_form = watch('user_profile_id');

  const [templateFile, setTemplateFile] = useState<FileTemplateItem | undefined>(undefined);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [templatesDropdownList, setTemplatesDropdownList] = useState<DropdownDataNumber[]>([]);

  const {parameterValues, refetch: refetchParameterValues} = useGetParameterValues(userProfileId_form);
  const {organizationUnits} = useGetOrganizationUnits(undefined);
  const {templates, refetch: refetchTemplates} = useGetTemplates({organization_unit_id: organizationUnitId});

  const submitButtonHandle = () => {
    if (userProfileId_form && organizationUnitId && templateId && templateFile && parameterValues) {
      setIsGenerating(true);

      generateDynamicTemplate(templateFile, parameterValues, alert, fileService).then(() => {
        setIsGenerating(false);
        onClose();
      });
    } else {
      alert.error('Nije moguće izvršiti generisanje šablona dok se ne popune obavezni podaci.');
    }
  };

  useEffect(() => {
    refetchParameterValues();
  }, [userProfileId_form]);

  useEffect(() => {
    refetchTemplates();
    setValue('template_id', 0);
  }, [organizationUnitId]);

  useEffect(() => {
    if (templates?.length) {
      const newList: DropdownDataNumber[] = [];

      templates.forEach((template: Template) => {
        newList.push(template.template);
      });

      setTemplatesDropdownList(newList);
    }
  }, [templates]);

  useEffect(() => {
    setTemplateFile(templates.find((item: Template) => item?.template?.id === templateId)?.file);
  }, [templateId]);

  useEffect(() => {
    if (userProfileId) setValue('user_profile_id', userProfileId);
    if (organizationUnitId || organization_unit?.id)
      setValue('organization_unit_id', organizationUnitId ?? organization_unit.id);
  }, []);

  return (
    <Modal
      open={open}
      onClose={() => {
        reset();
        onClose();
      }}
      leftButtonText="Otkaži"
      rightButtonText="Generiši"
      rightButtonOnClick={submitButtonHandle}
      buttonLoading={isGenerating}
      content={
        <ModalContentWrapper>
          {!userProfileId && (
            <FormGroup>
              <Controller
                name="user_profile_id"
                control={control}
                render={({field: {onChange, name, value}}) => (
                  <Dropdown
                    label="ZAPOSLENI"
                    name={name}
                    options={[{id: userProfileId_form, title: 'Trenutno odabrani zaposleni'}]}
                    value={{id: value, title: 'Trenutno odabrani zaposleni'}}
                    onChange={data => onChange(data.id)}
                    error={errors.user_profile_id?.message}
                    placeholder="Odabrani zaposleni"
                    isRequired
                    isDisabled={!!userProfileId}
                  />
                )}
              />
            </FormGroup>
          )}
          <FormGroup>
            <Controller
              name="organization_unit_id"
              control={control}
              render={({field: {onChange, name, value}}) => (
                <Dropdown
                  label="ORGANIZACIONA JEDINICA"
                  name={name}
                  options={organizationUnits}
                  value={{
                    id: value,
                    title: organizationUnits.find(unit => unit.id === value)?.title,
                  }}
                  onChange={data => onChange(data.id)}
                  error={errors.organization_unit_id?.message}
                  placeholder="Odabrana Organizaciona jedinica"
                  isRequired
                />
              )}
            />
          </FormGroup>
          <FormGroup>
            <Controller
              name="template_id"
              control={control}
              render={({field: {onChange, name, value}}) => (
                <Dropdown
                  label="ŠABLON"
                  name={name}
                  options={templatesDropdownList}
                  value={{
                    id: value,
                    title: templatesDropdownList.find(unit => unit.id === value)?.title,
                  }}
                  onChange={data => onChange(data.id)}
                  error={errors.template_id?.message}
                  placeholder="Odabrani Šablon"
                  isRequired
                />
              )}
            />
          </FormGroup>
        </ModalContentWrapper>
      }
      title={'GENERIŠI DINAMIČKI POPUNJEN ŠABLON'}
    />
  );
};
