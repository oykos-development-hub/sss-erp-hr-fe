import {Button, Modal, Switch, Tooltip, Typography} from 'client-library';
import React, {ReactElement, useEffect, useState} from 'react';
import {Controller, useFormContext} from 'react-hook-form';
import {FooterProps} from '../../types';
import {Activation, DatepickerElement, FooterWrapper, SwitchWrapper} from './styles';

export const Footer: React.FC<FooterProps> = ({activeTab, handleSaveButton, id = 0, active = 0}) => {
  // conditions:
  const isOverViewTab = activeTab === 1;
  const isActive = active === 2; // if active isn't equal to 2, it could be inactive(1), or draft(0)
  const isDraft = active === 0;

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
      setValue('active', active);
    }
  };

  const switchElement = (name: string): ReactElement => (
    <Switch name={name} onChange={handleSwitch} checked={isSwitchChecked} disabled={!date_of_activation || !!active} />
  );

  const buttonContent = id > 0 ? (isOverViewTab ? 'Sačuvaj' : 'Štampaj') : 'Prikaži odjeljenja';

  useEffect(() => {
    setIsSwitchChecked(isActive);
  }, [active]);

  return (
    <FooterWrapper>
      {isOverViewTab ? (
        <Activation>
          <Controller
            name="date_of_activation"
            control={control}
            render={({field: {onChange, name, value}}) => (
              <DatepickerElement
                disabled={!!active}
                onChange={onChange}
                label="DATUM USVAJANJA SISTEMATIZACIJE:"
                name={name}
                selected={value}
                error={errors.date_of_activation?.message}
              />
            )}
          />

          <Controller
            name="active"
            control={control}
            render={({field: {name}}) => (
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
                ) : (
                  switchElement(name)
                )}
              </SwitchWrapper>
            )}
          />
        </Activation>
      ) : null}

      <Button content={buttonContent} variant="primary" onClick={handleSaveButton} />

      <Modal
        open={isModalOpen}
        content="Da li ste sigurni da želite da aktivirate sistematizaciju? Prethodna sistematizacija će biti deaktivirana!"
        onClose={() => setIsModalOpen(false)}
        leftButtonOnClick={() => setIsModalOpen(false)}
        leftButtonText="Otkaži"
        rightButtonOnClick={() => {
          setIsSwitchChecked(!isSwitchChecked);
          setValue('active', 2);
          setIsModalOpen(false);
        }}
        rightButtonText="Aktiviraj"
      />
    </FooterWrapper>
  );
};
