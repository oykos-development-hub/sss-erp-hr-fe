import {GraphQL} from '..';
import {SystematizationsDeleteResponse} from '../../../types/graphql/systematizationsDeleteTypes';

const systematizationDelete = async (
  id: number,
): Promise<SystematizationsDeleteResponse['data']['systematizations_Delete']> => {
  const response = await GraphQL.fetch(`mutation {
    systematizations_Delete(id: ${id}) {
        message
        status
    }
}`);

  return response?.data?.systematizations_Delete || {};
};

export default systematizationDelete;
