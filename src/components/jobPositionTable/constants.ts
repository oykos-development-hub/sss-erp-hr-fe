import {TableHead} from 'client-library';

export const jobPositionTableHeads: TableHead[] = [
  {
    title: 'Naziv radnog mjesta',
    accessor: 'job_position',
    type: 'custom',
  },
  {
    title: 'Uslovi',
    accessor: 'requirements',
    type: 'custom',
  },
  {
    title: 'Broj izvršilaca',
    accessor: 'available_slots',
    type: 'custom',
  },
  {
    title: 'Opis poslova',
    accessor: 'description',
    type: 'custom',
  },
  {
    title: 'Zaposleni',
    accessor: 'employees',
    type: 'custom',
  },
  {title: '', accessor: 'TABLE_ACTIONS', type: 'tableActions'},
];

// const tableHeads: TableHead[] = [
//   {
//     title: 'Naziv radnog mjesta',
//     accessor: 'job_position',
//     type: 'custom',
//     renderContents: (item: any, row) => {
//       const isDisabled = row?.id !== editTableRow || Number(row.id) > 0;
//       return (
//         <div key={`item-job-position-${item.id}`}>
//           <Dropdown
//             value={item}
//             name="job_position"
//             onChange={handleChange}
//             options={jobPositionOptions}
//             // @TODO remove ts-ignore
//             //eslint-disable-next-line @typescript-eslint/ban-ts-comment
//             //@ts-ignore
//             maxMenuHeight={200}
//             style={{width: '235px'}}
//             isDisabled={isDisabled}
//           />
//         </div>
//       );
//     },
//   },
//   {
//     title: 'Uslovi',
//     accessor: 'requirements',
//     type: 'custom',
//     renderContents: (item: any, row) => {
//       return (
//         <Input
//           textarea
//           value={item}
//           name="requirements"
//           disabled={row?.id !== editTableRow}
//           onChange={ev => handleChange(ev.target.value, 'requirements')}
//         />
//       );
//     },
//   },
//   {
//     title: 'Broj izvršilaca',
//     accessor: 'available_slots',
//     type: 'custom',
//     renderContents: (item: any, row) => {
//       return (
//         <Input
//           value={item.value}
//           name="available_slots"
//           disabled={item?.row_id !== editTableRow || isInactive || row.is_judge_president}
//           onChange={ev => handleChange(ev.target.value, 'available_slots')}
//         />
//       );
//     },
//   },
//   {
//     title: 'Opis poslova',
//     accessor: 'description',
//     type: 'custom',
//     renderContents: (item: any, row) => {
//       return (
//         <Input
//           textarea
//           value={item}
//           name="description"
//           disabled={row?.id !== editTableRow}
//           onChange={ev => handleChange(ev.target.value, 'description')}
//         />
//       );
//     },
//   },
//   {
//     title: 'Zaposleni',
//     accessor: 'employees',
//     type: 'custom',
//     renderContents: (item: any, row) => {
//       const selectedItem = tableDataState.find((i: any) => i.id === editTableRow);

//       return (
//         <div>
//           {row?.id === editTableRow && item.length < selectedItem?.available_slots?.value && (
//             <EmployeeDropdownWrapper>
//               <Dropdown
//                 value={selectedEmployee}
//                 name="employees"
//                 options={getEmployeesForDropdown(item)}
//                 onChange={handleChange}
//                 // @TODO remove ts-ignore
//                 //eslint-disable-next-line @typescript-eslint/ban-ts-comment
//                 //@ts-ignore
//                 maxMenuHeight={200}
//                 style={{width: '235px'}}
//                 isSearchable
//               />
//               {selectedEmployee && item.length < selectedItem?.available_slots?.value && (
//                 <PlusCircleIcon
//                   stroke={Theme?.palette?.gray500}
//                   height="17px"
//                   width="17px"
//                   onClick={() => handleEditEmployees()}
//                 />
//               )}
//             </EmployeeDropdownWrapper>
//           )}
//           {Array.isArray(item) &&
//             item?.map((employee: any) => {
//               return (
//                 <div key={`employee-${employee?.id}`}>
//                   <Input
//                     value={employee.title}
//                     rightContent={
//                       <MinusCircleIcon
//                         stroke={Theme?.palette?.gray500}
//                         onClick={() => handleEditEmployees(employee?.id)}
//                       />
//                     }
//                     style={{width: '235px'}}
//                     disabled={employee?.row_id !== editTableRow}
//                   />
//                 </div>
//               );
//             })}
//         </div>
//       );
//     },
//   },
//   {title: '', accessor: 'TABLE_ACTIONS', type: 'tableActions'},
// ];
