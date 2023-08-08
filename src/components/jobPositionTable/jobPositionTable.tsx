import React, {useEffect, useState} from 'react';
import useJobPositions from '../../services/graphql/jobPositions/useJobPositionOverview';
import {EmployeeDropdownWrapper, StyledTable} from './styles';
import {JobPositionTableProps} from './types';
import {
  TableHead,
  EditIconTwo,
  TrashIcon,
  Theme,
  Input,
  Dropdown,
  MinusCircleIcon,
  CheckIcon,
  XIcon,
  PlusCircleIcon,
  Typography,
} from 'client-library';
import useUserProfiles from '../../services/graphql/userProfile/useUserProfiles';
import {DropdownDataNumber} from '../../types/dropdownData';
import {formatDataAddJobPosition} from '../../screens/systematization/utils';
import useEmployeeInOrganizationUnitDelete from '../../services/graphql/organizationUnitsEmployees/useOrganizationUnitEmployeeDelete';
import useOrganizationUnitDeleteJobPosition from '../../services/graphql/organizationUnitsJobPositions/useOrganizationUnitDeleteJobPosition';
import {DeleteModal} from '../../shared/deleteModal/deleteModal';
import useOrganizationUnitInsertJobPosition from '../../services/graphql/organizationUnitsJobPositions/useOrganizationUnitInsertJobPosition';
import useOrganizationUnitEmployeeInsert from '../../services/graphql/organizationUnitsEmployees/useOrganizationUnitEmployeeInsert';

export const JobPositionTable: React.FC<JobPositionTableProps> = ({
  data,
  sectorID,
  systematizationID,
  refetch,
  alert,
}) => {
  const {data: jobPositionData} = useJobPositions(1);
  const {data: allEmployees} = useUserProfiles({
    page: 1,
    size: 100,
    is_active: null,
    organization_unit_id: null,
    job_position_id: null,
    type: null,
  });
  const {mutate: insertJobPosition} = useOrganizationUnitInsertJobPosition();
  const {mutate: deleteJobPosition} = useOrganizationUnitDeleteJobPosition();

  const {mutate: insertEmployee} = useOrganizationUnitEmployeeInsert();
  const {mutate: deleteEmployee} = useEmployeeInOrganizationUnitDelete();

  const jobPositionsForDropdown = jobPositionData?.items?.map((item: any) => ({id: item.id, title: item.title}));
  const employeesForDropdown = allEmployees?.items?.map((item: any) => ({
    id: item.id,
    title: `${item.first_name} ${item.last_name}`,
  }));

  const [selectedEmployee, setSelectedEmployee] = useState<DropdownDataNumber>();
  const [tableDataState, setTableDataState] = useState<any[]>([]);
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

  const handleChange = (value: any, name: string) => {
    if (name === 'employees') {
      setSelectedEmployee(value);
    } else {
      const updatedTableData = tableDataState.map((item: any) => {
        const jobPositon = jobPositionData?.items?.find((i: any) => i.id === value?.id);

        if (item.id !== editTableRow) return item;
        if (name === 'available_slots') {
          return {
            ...item,
            [name]: {...item[name], value: value},
          };
        } else {
          return {
            ...item,
            [name]: {
              ...item[name],
              id: value?.id,
              title: value?.title,
              description: jobPositon?.description,
              requirements: jobPositon?.requirements,
            },
          };
        }
      });
      setTableDataState(updatedTableData);
    }
  };

  const handleEditEmployees = (id?: number) => {
    //if id is passed, we are deleting employee from table otherwise we are adding
    const updatedTableData = tableDataState.map((item: any) => {
      if (item.id !== editTableRow) return item;
      if (item.id === editTableRow) {
        if (editTableRow !== 0) {
          if (id) {
            deleteEmployee(id, () => {
              refetch && refetch();
            });
          } else {
            insertEmployee(
              {
                id: 0,
                user_profile_id: selectedEmployee?.id || 0,
                position_in_organization_unit_id: item?.id,
                active: true,
              },
              () => {
                refetch && refetch();
              },
            );
          }
        }
        return {
          ...item,
          employees: id
            ? item.employees.filter((i: any) => i.id !== id)
            : [...item.employees, {...selectedEmployee, row_id: editTableRow}],
        };
      }
    });
    setTableDataState(updatedTableData);
    setSelectedEmployee(undefined);
  };

  const handleDelete = () => {
    deleteJobPosition(
      Number(deleteItemId),
      () => {
        refetch && refetch(true);
        setShowDeleteModal(false);
        setDeleteItemId(null);
        setTableDataState(tableDataState.filter((item: any) => item.id !== deleteItemId));
        alert.success('Uspješno ste obrisali radno mjesto!');
      },
      () => {
        alert.error('Nije uspješno brisanje radnog mjesta!');
      },
    );
  };

  const handleSave = () => {
    const selectedItem = tableDataState.find((item: any) => item.id === editTableRow);
    const originalItem = data?.find((item: any) => item.id === editTableRow);
    const availableSlotsChanged = Number(selectedItem?.available_slots?.value) !== originalItem?.available_slots;

    const payload = formatDataAddJobPosition({
      ...selectedItem,
      systematization_id: systematizationID,
      parent_organization_unit_id: sectorID,
    });
    insertJobPosition(
      payload,
      jobPositionResponse => {
        if (selectedItem?.id === 0 && selectedItem?.employees?.length !== 0) {
          const employeeInsertPromises = selectedItem?.employees?.map((item: any) => {
            return insertEmployee(
              {
                id: 0,
                user_profile_id: item?.id || 0,
                position_in_organization_unit_id: jobPositionResponse?.id || 0,
                active: true,
              },
              undefined,
              () => {
                alert.error('Greška prilikom čuvanja radnog mjesta!');
              },
            );
          });

          Promise.all(employeeInsertPromises).then(() => {
            alert.success('Uspješno sačuvano radno mjesto!');
            refetch && refetch(availableSlotsChanged);
          });
        } else {
          refetch && refetch(availableSlotsChanged);
          alert.success('Uspješno sačuvano radno mjesto!');
        }
      },
      () => {
        alert.error('Greška prilikom čuvanja radnog mjesta!');
      },
    );
    setEditTableRow(null);
  };

  const tableHeads: TableHead[] = [
    {title: 'Redni Broj', accessor: 'serial_number', type: 'text'},
    {
      title: 'Naziv radnog mjesta',
      accessor: 'job_position',
      type: 'custom',
      renderContents: (item: any) => {
        return (
          <div key={`item-job-position-${item.id}`}>
            <Dropdown
              value={item}
              name="job_position"
              onChange={handleChange}
              options={jobPositionsForDropdown}
              // @TODO remove ts-ignore
              //eslint-disable-next-line @typescript-eslint/ban-ts-comment
              //@ts-ignore
              maxMenuHeight={200}
              isDisabled={item?.row_id !== editTableRow}
            />
          </div>
        );
      },
    },
    {
      title: 'Uvjeti',
      accessor: 'job_position',
      type: 'custom',
      renderContents: (item: any) => {
        return (
          <div key={`item-requirements-${item.id}`}>
            <Typography content={item?.requirements} variant="bodyMedium" />
          </div>
        );
      },
    },
    {
      title: 'Broj izvršilaca',
      accessor: 'available_slots',
      type: 'custom',
      renderContents: (item: any) => {
        return (
          <Input
            value={item.value}
            name="available_slots"
            style={{width: 100}}
            disabled={item?.row_id !== editTableRow}
            onChange={ev => handleChange(ev.target.value, 'available_slots')}
          />
        );
      },
    },

    {
      title: 'Opis poslova',
      accessor: 'job_position',
      type: 'custom',
      renderContents: (item: any) => {
        return (
          <div key={`item-description-${item.id}`}>
            <Typography content={item?.description} variant="bodyMedium" />
          </div>
        );
      },
    },
    {
      title: 'Zaposleni',
      accessor: 'employees',
      type: 'custom',
      renderContents: (item: any, row) => {
        const selectedItem = tableDataState.find((i: any) => i.id === editTableRow);
        const isDisabled = row?.id !== editTableRow;

        return (
          <div>
            <EmployeeDropdownWrapper>
              <Dropdown
                value={selectedEmployee}
                name="employees"
                options={employeesForDropdown}
                onChange={handleChange}
                isDisabled={isDisabled}
                // @TODO remove ts-ignore
                //eslint-disable-next-line @typescript-eslint/ban-ts-comment
                //@ts-ignore
                maxMenuHeight={200}
                isSearchable
              />
              {selectedEmployee && item.length < selectedItem?.available_slots?.value && (
                <PlusCircleIcon
                  stroke={Theme?.palette?.gray500}
                  height="17px"
                  width="17px"
                  onClick={() => handleEditEmployees()}
                />
              )}
            </EmployeeDropdownWrapper>
            {item?.map((employee: any) => {
              return (
                <div key={`employee-${employee?.id}`}>
                  <Input
                    value={employee.title}
                    rightContent={
                      <MinusCircleIcon
                        stroke={Theme?.palette?.gray500}
                        onClick={() => handleEditEmployees(employee?.id)}
                      />
                    }
                    disabled={employee?.row_id !== editTableRow}
                  />
                </div>
              );
            })}
          </div>
        );
      },
    },
    {title: '', accessor: 'TABLE_ACTIONS', type: 'tableActions'},
  ];

  useEffect(() => {
    const transformedData = data?.map((item: any) => {
      if (item.id === 0) setEditTableRow(0);
      const jobPosition = jobPositionData?.items?.find((jobPosition: any) => jobPosition.id === item.job_position.id);
      return {
        ...item,
        serial_number: item?.serial_number || 0,
        job_position: {
          id: jobPosition?.id,
          title: jobPosition?.title,
          requirements: jobPosition?.requirements,
          description: jobPosition?.description,
          row_id: item?.id,
        },
        employees: item?.employees?.map((employee: any) => ({
          ...employee,
          row_id: item?.id,
        })),
        available_slots: {value: item?.available_slots, row_id: item?.id},
      };
    });

    setTableDataState(transformedData);
  }, [data, jobPositionData]);

  return (
    <>
      <StyledTable
        tableHeads={tableHeads}
        data={tableDataState}
        tableActions={[
          {name: 'edit', onClick: item => selectRow(item.id), icon: <EditIconTwo stroke={Theme?.palette?.gray800} />},
          {name: 'save', onClick: handleSave, icon: <CheckIcon />, shouldRender: item => editTableRow !== item.id},
          {
            name: 'delete',
            onClick: item => deleteIconClick(item.id),
            icon: <TrashIcon stroke={Theme?.palette?.gray800} />,
          },
          {
            name: 'cancel',
            onClick: () => setEditTableRow(null),
            icon: <XIcon />,
            shouldRender: item => editTableRow !== item.id,
          },
        ]}
      />
      <DeleteModal open={showDeleteModal} onClose={() => setShowDeleteModal(false)} handleDelete={handleDelete} />
    </>
  );
};
