import {Button, Switch, Typography, Modal, Tooltip} from 'client-library';
import React, {useEffect, useState} from 'react';
import {Controller, useFormContext} from 'react-hook-form';
import {FooterProps} from '../types';
import {Activation, DatepickerElement, FooterWrapper, SwitchWrapper} from './styles';
import {TooltipPositions, TooltipVariants} from '@oykos-development/devkit-react-ts-styled-components';

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

  const handleSwitch = () => {
    if (!isSwitchChecked) setIsModalOpen(true); // if it was previously unchecked, open confirmation modal
    else {
      // uncheck and set active to previous status(inactive(1), or draft(0))
      setIsSwitchChecked(false);
      setValue('active', active);
    }
  };

  const switchElement = (name: string) => (
    <Switch
      name={name}
      onChange={handleSwitch}
      checked={isSwitchChecked}
      disabled={!watch('date_of_activation') || !!active}
    />
  );

  const buttonContent = id > 0 ? (isOverViewTab ? 'Sačuvaj' : 'Ispis') : 'Nastavi';

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
                error={errors.date_of_activation?.message as string}
              />
            )}
          />

          <Controller
            name="active"
            control={control}
            render={({field: {name}}) => (
              <SwitchWrapper>
                <Typography content="Aktiviraj sistematizaciju" variant="bodySmall" />
                {isDraft && !watch('date_of_activation') ? (
                  <Tooltip
                    arrow
                    variant={TooltipVariants.standard}
                    position={TooltipPositions.top}
                    content={'Za aktivaciju sistematizacije neophodno je unijeti datum usvajanja sistematizacije.'}>
                    {switchElement(name)}
                  </Tooltip>
                ) : (
                  <> {switchElement(name)}</>
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
