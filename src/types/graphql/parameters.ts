import {GetResponse} from './response.ts';

export type Parameter = {
  id: number;
  description: string;
  title: string;
};

export type ParameterResponse = {
  get: {listOfParameters_Overview: GetResponse<Parameter>};
};

export type ParameterValuesResponse = {
  get: {
    dataForTemplate_Overview: {
      status: string;
      message: string;
      item: [string: string][];
    };
  };
};
