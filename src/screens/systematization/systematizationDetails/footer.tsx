import React from 'react';
import {FooterProps} from '../types';
import {Activation, FooterWrapper} from './styles';
import {Datepicker, Button, Switch, Typography} from 'client-library';
import {parseDate} from '../../../utils/dateUtils';
import {Controller, useFormContext} from 'react-hook-form';

export const Footer: React.FC<FooterProps> = ({activeTab, handleSaveButton}) => {
  const {
    control,
    watch,
    setValue,
    formState: {errors},
  } = useFormContext();

  return (
    <FooterWrapper>
      {activeTab === 1 ? (
        <Activation>
          <Controller
            name="date_of_activation"
            control={control}
            rules={{required: 'Ovo polje je obavezno'}}
            render={({field: {onChange, name, value}}) => (
              <Datepicker
                onChange={onChange}
                label="POČETAK RADNOG ODNOSA:"
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
                onChange={() => setValue('active', !value)}
                checked={value}
                content={<Typography variant="bodyMedium" content="Aktivan" style={{marginLeft: 10}} />}
                style={{margin: '20px 0 0 10px'}}
                disabled={!watch('date_of_activation')}
              />
            )}
          />
        </Activation>
      ) : (
        <div></div>
      )}
      <Button content={activeTab === 1 ? 'Sačuvaj' : 'Ispis'} variant="primary" onClick={handleSaveButton} />
    </FooterWrapper>
  );
};
