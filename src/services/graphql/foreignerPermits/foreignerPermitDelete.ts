import {GraphQL} from '..';

const foreignerPermitDelete = async (id: number): Promise<any> => {
  const mutation = `mutation($id: Int!) {
    userProfile_Foreigner_Delete(id: $id) {
        message
        status
    }
}`;

  const response = await GraphQL.fetch(mutation, {id});

  return response.data?.userProfile_Foreigner_Delete || {};
};

export default foreignerPermitDelete;
