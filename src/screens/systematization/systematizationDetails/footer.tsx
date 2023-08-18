import {Button, Switch, Typography} from 'client-library';
import React from 'react';
import {Controller, useFormContext} from 'react-hook-form';
import {parseDate} from '../../../utils/dateUtils';
import {FooterProps} from '../types';
import {Activation, DatepickerElement, FooterWrapper} from './styles';

export const Footer: React.FC<FooterProps> = ({activeTab, handleSaveButton, id = 0}) => {
  const {
    control,
    watch,
    setValue,
    formState: {errors},
  } = useFormContext();

  const isActive = watch('active');

  return (
    <FooterWrapper>
      {activeTab === 1 ? (
        <Activation>
          <Controller
            name="date_of_activation"
            control={control}
            rules={isActive === true ? {required: 'Ovo polje je obavezno'} : {}}
            render={({field: {onChange, name, value}}) => (
              <DatepickerElement
                onChange={onChange}
                label="DATUM USVAJANJA SISTEMATIZACIJE:"
                name={name}
                value={value ? parseDate(value) : ''}
                error={errors.date_of_activation?.message as string}
              />
            )}
          />

          <Controller
            name="active"
            control={control}
            render={({field: {name, value}}) => (
              <Switch
                name={name}
                onChange={() => {
                  setValue('active', !value);
                }}
                checked={value}
                // @TODO remove ts-ignore
                //eslint-disable-next-line @typescript-eslint/ban-ts-comment
                //@ts-ignore
                content={
                  <Typography variant="bodyMedium" content="Aktiviraj sistematizaciju" style={{marginLeft: 10}} />
                }
                style={{margin: '20px 0 0 10px'}}
                disabled={!watch('date_of_activation')}
              />
            )}
          />
        </Activation>
      ) : (
        <div></div>
      )}
      {id > 0 ? (
        <Button content={activeTab === 1 ? 'Sačuvaj' : 'Ispis'} variant="primary" onClick={handleSaveButton} />
      ) : (
        <Button content={'Nastavi'} variant="primary" onClick={handleSaveButton} />
      )}
    </FooterWrapper>
  );
};
