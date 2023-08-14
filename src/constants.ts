import {EditIconTwo, Theme, TrashIconTwo} from '@oykos-development/devkit-react-ts-styled-components';
import {DropdownDataNumber, DropdownDataString} from './types/dropdownData';

export const cityData: DropdownDataString[] = [
  {id: 'PJ Andrijevica', title: 'PJ Andrijevica'},
  {id: 'PJ Bar', title: 'PJ Bar'},
  {id: 'PJ Berane', title: 'PJ Berane'},
  {id: 'PJ Bijelo Polje', title: 'PJ Bijelo Polje'},
  {id: 'PJ Budva', title: 'PJ Budva'},
  {id: 'PJ Cetinje', title: 'PJ Cetinje'},
  {id: 'PJ Danilovgrad', title: 'PJ Danilovgrad'},
  {id: 'PJ Gusinje', title: 'PJ Gusinje'},
  {id: 'PJ Herceg Novi', title: 'PJ Herceg Novi'},
  {id: 'PJ Kolašin', title: 'PJ Kolašin'},
  {id: 'PJ Kotor', title: 'PJ Kotor'},
  {id: 'PJ Mojkovac', title: 'PJ Mojkovac'},
  {id: 'PJ Nikšić', title: 'PJ Nikšić'},
  {id: 'PJ Petnjica', title: 'PJ Petnjica'},
  {id: 'PJ Plav', title: 'PJ Plav'},
  {id: 'PJ Plužine', title: 'PJ Plužine'},
  {id: 'PJ Pljevlja', title: 'PJ Pljevlja'},
  {id: 'PJ Podgorica', title: 'PJ Podgorica'},
  {id: 'PJ Rožaje', title: 'PJ Rožaje'},
  {id: 'PJ Šavnik', title: 'PJ Šavnik'},
  {id: 'PJ Tivat', title: 'PJ Tivat'},
  {id: 'PJ Tuzi', title: 'PJ Tuzi'},
  {id: 'PJ Ulcinj', title: 'PJ Ulcinj'},
  {id: 'PJ Zeta', title: 'PJ Zeta'},
  {id: 'PJ Žabljak', title: 'PJ Žabljak'},
];

export const countriesData: DropdownDataString[] = [
  {id: 'Crna Gora', title: 'Crna Gora'},
  {id: 'Srbija', title: 'Srbija'},
  {id: 'Hrvatska', title: 'Hrvatska'},
];

export const maleMaritalStatusOptions: DropdownDataString[] = [
  {id: 'ozenjen', title: 'Oženjen'},
  {id: 'neozenjen', title: 'Neoženjen'},
];

export const femaleMaritalStatusOptions: DropdownDataString[] = [
  {id: 'udata', title: 'Udata'},
  {id: 'neudata', title: 'Neudata'},
];

export const genderOptions: DropdownDataString[] = [
  {id: 'muski', title: 'Muški'},
  {id: 'zenski', title: 'Ženski'},
];

export const nationalMinorities: DropdownDataString[] = [
  {id: 'albanska', title: 'Albanska'},
  {id: 'bosnjačka', title: 'Bošnjačka'},
  {id: 'hrvatska', title: 'Hrvatska'},
  {id: 'romska', title: 'Romska'},
  {id: 'srpska', title: 'Srpska'},
];

export const yesAndNoOptions = [
  {id: null, title: 'Svi'},
  {id: true, title: 'Da'},
  {id: false, title: 'Ne'},
];

export const yesOrNoOptionsBoolean = [
  {id: true, title: 'Da'},
  {id: false, title: 'Ne'},
];

export const yesOrNoOptionsNumber = [
  {id: 1, title: 'Da'},
  {id: 2, title: 'Ne'},
];

export const yesOrNoOptionsString = [
  {id: 'Da', title: 'Da'},
  {id: 'Ne', title: 'Ne'},
];

//TODO: remove this later
export const departmentOptions = [{id: 'Odjeljenje za lkt', title: 'Odjeljenje za lkt'}];

export const EMAIL_REGEX = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;

export const contractTypes: DropdownDataNumber[] = [
  {id: 1, title: 'Ugovor o radu na neodređeno vrijeme'},
  {id: 2, title: 'Ugovor o radu na određeno vrijeme'},
  {id: 3, title: 'Ugovor o privremeno povremenim poslovima'},
  {id: 4, title: 'Ugovor o radu sa nepunim radnim vremenom'},
  {id: 5, title: 'Ugovor o djelu'},
  {id: 6, title: 'Ugovor o radu sa strancem'},
  {
    id: 7,
    title: 'Ugovor o radu za obavljanje poslova van prostorija poslodavca',
  },
  {id: 8, title: 'Radni odnos u svojstvu pripravnika'},
  {
    id: 9,
    title: 'Ugovor o radu za obavljanje poslova van prostorija poslodavca',
  },
];

export const quarterOptions = [
  {id: '1/4', title: '1/4'},
  {id: '2/4', title: '2/4'},
  {id: '3/4', title: '3/4'},
  {id: '4/4', title: '4/4'},
];

export const revisionPriorityOptions: DropdownDataString[] = [
  {id: 'low', title: 'Nizak'},
  {id: 'normal', title: 'Srednji'},
  {id: 'high', title: 'Visok'},
];

export const revisionDeadlineOptions: DropdownDataString[] = [
  {id: '1', title: '1 mjesec'},
  {id: '2', title: '2 mjeseca'},
  {id: '3', title: '3 mjeseca'},
  {id: '4', title: '4 mjeseca'},
  {id: '5', title: '5 mjeseci'},
  {id: '6', title: '6 mjeseci'},
  {id: '7', title: '7 mjeseci'},
  {id: '8', title: '8 mjeseci'},
  {id: '9', title: '9 mjeseci'},
  {id: '10', title: '10 mjeseci'},
  {id: '11', title: '11 mjeseci'},
  {id: '12', title: '12 mjeseci'},
];

export const revisionStatusOptions: DropdownDataString[] = [
  {id: 'implemented', title: 'Sprovedena'},
  {id: 'failed', title: 'Neuspješna'},
  {id: 'waiting', title: 'Na čekanju'},
];

export const revisionTypeOptions: DropdownDataNumber[] = [
  {id: 1, title: 'Redovna'},
  {id: 2, title: 'Ad Hoc'},
  {id: 3, title: 'Sporazum'},
];
