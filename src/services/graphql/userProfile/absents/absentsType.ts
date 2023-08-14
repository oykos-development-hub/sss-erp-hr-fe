import {GraphQL} from '../..';
import {AbsentTypeResponse} from '../../../../types/graphql/profileAbsentsTypes';

const absentTypesOverview = async (page?: number, size?: number): Promise<AbsentTypeResponse['data']['absentType']> => {
  const query = `query AbsentType($page: Int, $size: Int) {
    absentType(page: $page, size: $size) {
        status 
        message
        total
        items {
            id
            title
            abbreviation
            accounting_days_off
            description
            color
            icon
        }
    }
}`;

  const response = await GraphQL.fetch(query, {page, size});

  return response?.data?.absentType || {};
};

export default absentTypesOverview;
