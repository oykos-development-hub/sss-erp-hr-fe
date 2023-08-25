import {
  CheckIcon,
  Dropdown,
  EditIconTwo,
  Input,
  MinusCircleIcon,
  PlusCircleIcon,
  TableHead,
  Theme,
  TrashIcon,
  XIcon,
} from 'client-library';
import React, {useEffect, useState} from 'react';
import useEmployeeInOrganizationUnitDelete from '../../services/graphql/organizationUnitsEmployees/useOrganizationUnitEmployeeDelete';
import useOrganizationUnitEmployeeInsert from '../../services/graphql/organizationUnitsEmployees/useOrganizationUnitEmployeeInsert';
import useOrganizationUnitDeleteJobPosition from '../../services/graphql/organizationUnitsJobPositions/useOrganizationUnitDeleteJobPosition';
import useOrganizationUnitInsertJobPosition from '../../services/graphql/organizationUnitsJobPositions/useOrganizationUnitInsertJobPosition';
import {DeleteModal} from '../../shared/deleteModal/deleteModal';
import {DropdownDataNumber} from '../../types/dropdownData';
import {EmployeeDropdownWrapper, StyledTable} from './styles';
import {JobPositionTableProps} from './types';

export const JobPositionTable: React.FC<JobPositionTableProps> = ({
  data,
  sectorID,
  systematizationID,
  refetch,
  alert,
  jobPositionData,
  allEmployees,
  activeEmployees,
  cancel,
  isActive,
}) => {
  const {mutate: insertJobPosition} = useOrganizationUnitInsertJobPosition();
  const {mutate: deleteJobPosition} = useOrganizationUnitDeleteJobPosition();

  const {mutate: insertEmployee} = useOrganizationUnitEmployeeInsert();
  const {mutate: deleteEmployee} = useEmployeeInOrganizationUnitDelete();

  const jobPositionsForDropdown = jobPositionData?.map((item: any) => ({id: item.id, title: item.title}));
  const employeesForDropdown = allEmployees?.map((item: any) => ({
    id: item.id,
    title: `${item.first_name} ${item.last_name}`,
  }));

  const [selectedEmployee, setSelectedEmployee] = useState<DropdownDataNumber>();
  const [tableDataState, setTableDataState] = useState<any[]>([]);
  const [editTableRow, setEditTableRow] = useState<null | number>(null);
  const [deleteItemId, setDeleteItemId] = useState<null | number>(null);
  const selectRow = (id: number) => {
    setSelectedEmployee(undefined);
    setEditTableRow(id);
  };
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const deleteIconClick = (id: number) => {
    setShowDeleteModal(true);
    setDeleteItemId(id);
  };

  const handleChange = (value: any, name: string) => {
    if (name === 'employees') {
      const index = activeEmployees.findIndex(item => item.id === value.id);
      if (index > -1) {
        alert.error(
          `Zaposleni ${activeEmployees[index].full_name} već pokriva radno mjesto ${activeEmployees[index]?.job_position?.title} u odjeljenju ${activeEmployees[index]?.sector}!`,
        );
        setSelectedEmployee(undefined);
      } else {
        setSelectedEmployee(value);
      }
    } else {
      const updatedTableData = tableDataState.map((item: any) => {
        const jobPosition = jobPositionData?.find((i: any) => i.id === value?.id);
        if (item.id !== editTableRow) return item;
        if (name === 'available_slots') {
          return {
            ...item,
            [name]: {...item[name], value: value},
          };
        } else {
          return {
            ...item,
            description: jobPosition?.description,
            requirements: jobPosition?.requirements,
            is_judge_president: jobPosition?.is_judge_president,
            available_slots: jobPosition?.is_judge_president ? {value: 1} : item.available_slots,
            job_position: {id: jobPosition?.id, title: jobPosition?.title},
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

  const getEmployeesForDropdown = (item: any): DropdownDataNumber[] => {
    const itemIds = item.map((elem: DropdownDataNumber) => elem?.id);
    return employeesForDropdown.filter(emp => !itemIds.includes(emp.id));
  };

  const handleSave = () => {
    const selectedItem = tableDataState.find((item: any) => item.id === editTableRow);

    const payload = {
      id: selectedItem.id ? selectedItem.id : 0,
      systematization_id: systematizationID,
      parent_organization_unit_id: sectorID,
      job_position_id: selectedItem?.job_position?.id,
      available_slots: Number(selectedItem?.available_slots.value),
      employees: selectedItem?.employees?.map((item: any) => item.id),
    };
    insertJobPosition(
      payload,
      jobPositionResponse => {
        let newItem = tableDataState.find(item => item.id === 0);

        if (newItem) {
          const newTableData = tableDataState.filter(item => item.id !== 0);

          const jobPosition = jobPositionData?.find((jobPosition: any) => jobPosition.id === newItem.job_position.id);
          newItem = {
            ...newItem,
            id: jobPositionResponse?.id,
            serial_number: jobPosition?.serial_number || 0,
            description: jobPosition?.description,
            requirements: jobPosition?.requirements,
            job_position: {id: jobPosition?.id, title: jobPosition?.title},
            employees: selectedItem?.employees.map((item: any) => ({
              id: item?.id,
              title: item?.title,
              row_id: jobPositionResponse?.id,
            })),
            available_slots: {value: jobPositionResponse?.available_slots, row_id: jobPositionResponse?.id},
          };
          newTableData.push(newItem);
          setTableDataState([...newTableData]);
          refetch && refetch(true);
        }
      },
      () => {
        alert.error('Greška prilikom čuvanja radnog mjesta!');
      },
    );
    setEditTableRow(null);
  };

  const tableHeads: TableHead[] = [
    {
      title: 'Naziv radnog mjesta',
      accessor: 'job_position',
      type: 'custom',
      renderContents: (item: any, row) => {
        const isDisabled = row?.id !== editTableRow || Number(row.id) > 0;
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
              style={{width: '235px'}}
              isDisabled={isDisabled}
            />
          </div>
        );
      },
    },
    {title: 'Uvjeti', accessor: 'requirements', type: 'text'},
    {
      title: 'Broj izvršilaca',
      accessor: 'available_slots',
      type: 'custom',
      renderContents: (item: any, row) => {
        return (
          <Input
            value={item.value}
            name="available_slots"
            style={{width: 100}}
            disabled={item?.row_id !== editTableRow || isActive || row.is_judge_president}
            onChange={ev => handleChange(ev.target.value, 'available_slots')}
          />
        );
      },
    },
    {title: 'Opis poslova', accessor: 'description', type: 'text'},
    {
      title: 'Zaposleni',
      accessor: 'employees',
      type: 'custom',
      renderContents: (item: any, row) => {
        const selectedItem = tableDataState.find((i: any) => i.id === editTableRow);

        return (
          <div>
            {row?.id === editTableRow && item.length < selectedItem?.available_slots?.value && (
              <EmployeeDropdownWrapper>
                <Dropdown
                  value={selectedEmployee}
                  name="employees"
                  options={getEmployeesForDropdown(item)}
                  onChange={handleChange}
                  // @TODO remove ts-ignore
                  //eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  //@ts-ignore
                  maxMenuHeight={200}
                  style={{width: '235px'}}
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
            )}
            {Array.isArray(item) &&
              item?.map((employee: any) => {
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
                      style={{width: '235px'}}
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
      return {
        ...item,
        serial_number: item?.serial_number || 0,
        job_position: {...item.job_positions},
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
          {
            name: 'edit',
            onClick: item => selectRow(item.id),
            icon: <EditIconTwo stroke={Theme?.palette?.gray800} />,
            shouldRender: item => editTableRow !== item.id,
          },
          {name: 'save', onClick: handleSave, icon: <CheckIcon />, shouldRender: item => editTableRow === item.id},
          {
            name: 'delete',
            onClick: item => deleteIconClick(item.id),
            icon: <TrashIcon stroke={Theme?.palette?.gray800} />,
            shouldRender: item => editTableRow !== item.id,
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
      <DeleteModal open={showDeleteModal} onClose={() => setShowDeleteModal(false)} handleDelete={handleDelete} />
    </>
  );
};
