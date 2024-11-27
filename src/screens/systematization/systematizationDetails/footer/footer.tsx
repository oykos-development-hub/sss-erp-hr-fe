import React, {ReactElement, useEffect, useState} from 'react';
import {Button, Modal, Switch, Tooltip, Typography} from 'client-library';
import {FooterProps} from '../../types';
import {Controller, useFormContext} from 'react-hook-form';
import {Activation, DatepickerElement, FooterWrapper, SwitchWrapper} from './styles';
import {SystematizationStatus} from './constants';

export const Footer: React.FC<FooterProps> = ({
  activeTab,
  handleSaveButton,
  id = 0,
  status = 0,
  uploadedFile,
  setError,
  file,
  disableUpdate,
}) => {
  // conditions:
  const isOverViewTab = activeTab === 1;
  const isActive = status === SystematizationStatus.ACTIVE;
  const isDraft = status === SystematizationStatus.DRAFT;

  const {
    control,
    watch,
    setValue,
    formState: {errors},
  } = useFormContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSwitchChecked, setIsSwitchChecked] = useState(isActive);

  const {date_of_activation} = watch();

  const handleSwitch = () => {
    if (!isSwitchChecked) setIsModalOpen(true); // if it was previously unchecked, open confirmation modal
    else {
      // uncheck and set active to previous status(inactive(1), or draft(0))
      setIsSwitchChecked(false);
      setValue('active', status);
    }
  };

  const switchElement = (name: string): ReactElement => (
    <Switch
      name={name}
      onChange={handleSwitch}
      checked={isSwitchChecked}
      disabled={!date_of_activation || !!status || (uploadedFile === undefined && file === 0)}
    />
  );

  const buttonContent = id > 0 ? (isOverViewTab ? 'Sačuvaj' : 'Generiši dokument') : 'Prikaži odjeljenja';

  useEffect(() => {
    setIsSwitchChecked(isActive);
  }, [status]);

  return (
    <FooterWrapper>
      {isOverViewTab ? (
        <Activation>
          <Controller
            name="date_of_activation"
            control={control}
            render={({field: {onChange, name, value}}) => (
              <DatepickerElement
                disabled={!!status || disableUpdate}
                onChange={onChange}
                label="DATUM USVAJANJA SISTEMATIZACIJE:"
                name={name}
                selected={value}
                error={errors.date_of_activation?.message}
              />
            )}
          />

          {!disableUpdate && (
            <Controller
              name="active"
              control={control}
              render={({field: {name}}) => {
                return (
                  <SwitchWrapper>
                    <Typography content="Aktiviraj sistematizaciju" variant="bodyMedium" />
                    {isDraft && !date_of_activation ? (
                      <Tooltip
                        arrow
                        variant="filled"
                        position="top"
                        content="Za aktivaciju sistematizacije neophodno je unijeti datum usvajanja sistematizacije.">
                        {switchElement(name)}
                      </Tooltip>
                    ) : uploadedFile === undefined ? (
                      (setError(true), switchElement(name))
                    ) : (
                      (setError(false), switchElement(name))
                    )}
                  </SwitchWrapper>
                );
              }}
            />
          )}
        </Activation>
      ) : null}

      {!disableUpdate && <Button content={buttonContent} variant="primary" onClick={handleSaveButton} />}

      {!disableUpdate && (
        <Modal
          open={isModalOpen}
          content="Da li ste sigurni da želite da aktivirate sistematizaciju? Prethodna sistematizacija će biti deaktivirana!"
          onClose={() => setIsModalOpen(false)}
          leftButtonOnClick={() => setIsModalOpen(false)}
          leftButtonText="Otkaži"
          rightButtonOnClick={() => {
            setIsSwitchChecked(!isSwitchChecked), setValue('active', 2), setIsModalOpen(false);
          }}
          rightButtonText="Aktiviraj"
        />
      )}
    </FooterWrapper>
  );
};
