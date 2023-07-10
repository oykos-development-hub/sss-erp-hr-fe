import {GraphQL} from '..';

const foreignerPermitDelete = async (id: number): Promise<any> => {
  const response = await GraphQL.fetch(`mutation {
    userProfile_Foreigner_Delete(id: ${id}) {
        message
        status
    }
}`);

  return response.data?.userProfile_Foreigner_Delete || {};
};

export default foreignerPermitDelete;
