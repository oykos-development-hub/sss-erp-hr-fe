import {GraphQL} from '..';

import {SuppliersOverviewResponse} from '../../../types/graphql/suppliersOverviewTypes';

const getSuppliersOverview = async (
  id?: number,
  search?: string,
): Promise<SuppliersOverviewResponse['data']['suppliers_Overview']> => {
  const query = `query Suppliers($id: Int, $search: String, $page: Int, $size: Int) {
    suppliers_Overview(id: $id, search: $search, page: $page, size: $size) {
        status 
        message
        total
        items {
            id
            title
            abbreviation
            official_id
            address
            description
            folder_id
        }
    }
}`;

  const response = await GraphQL.fetch(query, {id, search});

  return response?.data?.suppliers_Overview || {};
};

export default getSuppliersOverview;
