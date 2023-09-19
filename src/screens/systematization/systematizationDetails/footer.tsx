import {Button, Switch, Typography, Modal} from 'client-library';
import React, {useState} from 'react';
import {Controller, useFormContext} from 'react-hook-form';
import {FooterProps} from '../types';
import {Activation, DatepickerElement, FooterWrapper} from './styles';

export const Footer: React.FC<FooterProps> = ({activeTab, handleSaveButton, id = 0, active = false}) => {
  const {
    control,
    watch,
    setValue,
    formState: {errors},
  } = useFormContext();

  const isActive = watch('active');
  const [isModalOpen, setIsModalOpen] = useState(false);

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
                selected={value}
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
                  setIsModalOpen(true);
                }}
                checked={value}
                // @TODO remove ts-ignore
                //eslint-disable-next-line @typescript-eslint/ban-ts-comment
                //@ts-ignore
                content={
                  <Typography variant="bodyMedium" content="Aktiviraj sistematizaciju" style={{marginLeft: 10}} />
                }
                style={{margin: '20px 0 0 10px'}}
                disabled={!watch('date_of_activation') || active}
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

      <Modal
        open={isModalOpen}
        content="Da li ste sigurni da želite da aktivirate sistematizaciju? Prethodna sistematizacija će biti deaktivirana!"
        onClose={() => setIsModalOpen(false)}
        leftButtonOnClick={() => setIsModalOpen(false)}
        leftButtonText="Otkaži"
        rightButtonOnClick={() => {
          setValue('active', !isActive);
          setIsModalOpen(false);
        }}
        rightButtonText="Aktiviraj"
      />
    </FooterWrapper>
  );
};
