import {
  CheckIcon,
  Dropdown,
  EditIconTwo,
  Input,
  MinusCircleIcon,
  TableHead,
  Theme,
  TrashIcon,
  Typography,
  XIcon,
} from 'client-library';
import React, {useEffect, useMemo, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {ConfirmModal} from '../../shared/confirmModal/confirmModal';
import {DropdownDataNumber} from '../../types/dropdownData';
import {JobPosition} from '../../types/graphql/jobPositions';
import {ActiveEmployee, SectorJobPosition} from '../../types/graphql/systematizationsTypes';
import {jobPositionTableHeads} from './constants';
import {EmployeeDropdownWrapper, EmployeeItem, EmployeeList, StyledTable} from './styles';
import {JobPositionTableProps} from './types';
import {UserProfile} from '../../types/graphql/userProfiles';
import {requiredError} from '../../constants';
import useAppContext from '../../context/useAppContext';
import useInsertJobPositionInOrgUnit from '../../services/graphql/jobPositionsInOrgUnit/useOrganizationUnitInsertJobPosition';
import useDeleteJobPositionInOrgUnit from '../../services/graphql/jobPositionsInOrgUnit/useDeleteJobPositionInOrgUnit';

// !!! You will see that one prop inside of jobPositions is names job_positions instead of job_position, that is a typo in the backend

export const JobPositionTable: React.FC<JobPositionTableProps> = ({
  data,
  sectorID,
  systematizationID,
  refetchDetails,
  jobPositionData = [],
  allEmployees = [],
  activeEmployees = [],
  cancel,
  isInactive,
}) => {
  const {mutate: insertJobPosition} = useInsertJobPositionInOrgUnit();
  const {mutate: deleteJobPosition} = useDeleteJobPositionInOrgUnit();

  const {
    register,
    formState: {errors, isValid},
    control,
    reset,
    watch,
    setValue,
    clearErrors,
    trigger,
  } = useForm();

  const {jobPositions} = watch();

  const {alert} = useAppContext();

  const jobPositionOptions = jobPositionData
    ?.filter((item: JobPosition) => !item.is_judge)
    .map((item: JobPosition) => ({id: item.id, title: item.title}));

  const [editTableRow, setEditTableRow] = useState<null | number>(null);
  const [deleteItemId, setDeleteItemId] = useState<null | number>(null);

  const selectRow = (id: number) => {
    setEditTableRow(id);
  };

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const deleteIconClick = (id: number) => {
    setShowDeleteModal(true);
    setDeleteItemId(id);
  };

  const onRemoveEmployee = (id: number) => {
    if (!editTableRow) return;

    setValue(
      `jobPositions[${editTableRow}].employees`,
      jobPositions[editTableRow].employees.filter((i: ActiveEmployee) => i.id !== id),
    );
  };

  const handleDelete = () => {
    deleteJobPosition(
      Number(deleteItemId),
      () => {
        refetchDetails();
        setShowDeleteModal(false);
        setDeleteItemId(null);

        alert.success('Uspješno obrisano.');
      },
      () => {
        alert.error('Greška. Brisanje nije moguće.');
      },
    );
  };

  const handleSave = async (data: SectorJobPosition) => {
    trigger(`jobPositions[${data.id}]`);

    if (isValid || Object.keys(errors).length === 0) {
      const payload = {
        id: data.id ? data.id : 0,
        systematization_id: systematizationID,
        parent_organization_unit_id: sectorID,
        job_position_id: data?.job_positions?.id,
        available_slots: +data?.available_slots,
        employees: data.employees?.map((item: any) => item.id),
        description: data.description,
        requirements: data.requirements,
      };

      insertJobPosition(
        payload,
        () => {
          refetchDetails();
          alert.success('Radna pozicija uspješno sačuvana.');
          clearErrors();
        },
        () => {
          alert.error('Greška. Promjene nisu sačuvane.');
        },
      );

      setEditTableRow(null);
    }
  };

  useEffect(() => {
    const initialData: {[key: string]: SectorJobPosition} = {};

    data?.forEach((item: SectorJobPosition) => {
      if (item.id === 0) setEditTableRow(0);

      initialData[item.id] = {
        id: item.id,
        description: item?.description,
        requirements: item?.requirements,
        serial_number: item?.serial_number || '',
        job_positions: item?.job_positions,
        employees: item?.employees,
        available_slots: item?.available_slots,
      };
    });

    reset({jobPositions: initialData});
  }, [data, jobPositionData]);

  const onChangeEmployees = (value: DropdownDataNumber, position: SectorJobPosition) => {
    const index = activeEmployees.findIndex(item => item.id === value.id);
    const is_judge_president = jobPositionData.find(item => item.id === position?.id)?.is_judge_president;

    if (index > -1 && !is_judge_president) {
      alert.error(
        `Zaposleni ${activeEmployees[index].full_name} već pokriva radno mjesto ${activeEmployees[index]?.job_position?.title} u odjeljenju ${activeEmployees[index]?.sector}!`,
      );
    } else {
      setValue(`jobPositions[${position?.id}].employees`, [value, ...position.employees]);
    }
  };

  // adding renderContents method to each of the tableHeads to render the corresponding input field
  const updatedTableHeads = useMemo(() => {
    const tableHeads = jobPositionTableHeads;

    const activeEmployeeIds = activeEmployees.map((employee: ActiveEmployee) => employee?.id);

    const employeeOptions = allEmployees
      ?.filter(emp => !emp.is_judge && !emp.is_judge_president)
      .map((item: UserProfile) => ({
        id: item.id,
        title: `${item.first_name} ${item.last_name}`,
      }));

    const options = employeeOptions.filter(employee => !activeEmployeeIds.includes(employee.id));

    const positionErrors = errors.jobPositions as any;

    tableHeads.forEach((head: TableHead) => {
      switch (head.accessor) {
        case 'job_position':
          head.renderContents = (_, position: JobPosition) => {
            const isDisabled = position?.id !== editTableRow || Number(position.id) > 0;
            return (
              <div key={`item-job-position-${position.id}`}>
                <Controller
                  control={control}
                  rules={{required: requiredError, min: 1}}
                  name={`jobPositions[${position.id}].job_positions`}
                  render={({field: {name, value, onChange}}) => (
                    <Dropdown
                      value={value}
                      name={name}
                      onChange={onChange}
                      options={jobPositionOptions}
                      style={{width: '235px'}}
                      isDisabled={isDisabled}
                      error={positionErrors?.[`${position.id}`]?.job_positions?.message}
                    />
                  )}
                />
              </div>
            );
          };
          break;
        case 'requirements':
          head.renderContents = (_, position: JobPosition) => (
            <Input
              {...register(`jobPositions[${position.id}].requirements`, {required: requiredError})}
              textarea
              disabled={position?.id !== editTableRow}
              error={positionErrors?.[`${position.id}`]?.requirements?.message}
            />
          );
          break;
        case 'available_slots':
          head.renderContents = (_, position: JobPosition) => (
            <Input
              {...register(`jobPositions[${position.id}].available_slots`, {required: requiredError})}
              disabled={position?.id !== editTableRow || isInactive || position.is_judge_president}
              error={positionErrors?.[`${position.id}`]?.available_slots?.message}
            />
          );
          break;
        case 'description':
          head.renderContents = (_, position: JobPosition) => (
            <Input
              {...register(`jobPositions[${position.id}].description`, {required: requiredError})}
              textarea
              disabled={position?.id !== editTableRow}
              error={positionErrors?.[`${position.id}`]?.description?.message}
            />
          );
          break;
        case 'employees':
          head.renderContents = (value: DropdownDataNumber[], position: SectorJobPosition) => (
            <div>
              {position?.id === editTableRow && value.length < position?.available_slots && (
                <EmployeeDropdownWrapper>
                  <Controller
                    control={control}
                    name={`jobPositions[${position?.id}].employees`}
                    render={({field: {value}}) => (
                      <Dropdown
                        value={value}
                        options={options}
                        onChange={(value: any) => onChangeEmployees(value, position) as any}
                        isSearchable
                      />
                    )}
                  />
                </EmployeeDropdownWrapper>
              )}
              {Array.isArray(value) && (
                <EmployeeList>
                  {value?.map((employee: DropdownDataNumber) => {
                    return (
                      <EmployeeItem key={`employee-${employee?.id}`}>
                        <Typography variant="bodyMedium" content={employee.title} />
                        <MinusCircleIcon
                          stroke={Theme?.palette?.gray500}
                          onClick={() => onRemoveEmployee(employee?.id)}
                        />
                      </EmployeeItem>
                    );
                  })}
                </EmployeeList>
              )}
            </div>
          );
      }
    });

    return tableHeads;
  }, [jobPositionOptions, allEmployees, activeEmployees, errors]);

  return (
    <>
      <StyledTable
        tableHeads={updatedTableHeads}
        data={jobPositions ? Object.values(jobPositions) : []}
        tableActions={[
          {
            name: 'edit',
            onClick: item => selectRow(item.id),
            icon: <EditIconTwo stroke={Theme?.palette?.gray800} />,
            shouldRender: item => editTableRow !== item.id && !isInactive,
          },
          {name: 'save', onClick: handleSave, icon: <CheckIcon />, shouldRender: item => editTableRow === item.id},
          {
            name: 'delete',
            onClick: item => deleteIconClick(item.id),
            icon: <TrashIcon stroke={Theme?.palette?.gray800} style={{height: 18}} />,
            shouldRender: item => editTableRow !== item.id && !isInactive,
          },
          {
            name: 'cancel',
            onClick: () => {
              if (cancel) cancel();
              setEditTableRow(null);
            },
            icon: <XIcon />,
            shouldRender: item => editTableRow === item.id,
          },
        ]}
      />
      <ConfirmModal open={showDeleteModal} onClose={() => setShowDeleteModal(false)} handleConfirm={handleDelete} />
    </>
  );
};
