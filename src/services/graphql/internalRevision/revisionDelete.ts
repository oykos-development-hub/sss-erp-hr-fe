import {GraphQL} from '..';
import {InternalRevisionResponse} from '../../../types/graphql/internalRevision';

const revisionDelete = async (id: number): Promise<InternalRevisionResponse['data']['revisions_Delete']> => {
  const response = await GraphQL.fetch(`
    mutation {
      revisions_Delete(id: ${id}) {
        message
        status
      }
    }
    `);

  return response?.data?.revisions_Delete || {};
};

export default revisionDelete;
