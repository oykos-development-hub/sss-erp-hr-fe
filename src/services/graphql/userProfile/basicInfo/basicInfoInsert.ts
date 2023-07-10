import {GraphQL} from '../..';
import {UserProfileInsertBasicInfoResponse} from '../../../../types/graphql/userProfileInsertBasicInfo';
import {UserProfileBasicInfo} from '../../../../types/graphql/userProfiles';

const basicInfoInsert = async (
  data: UserProfileBasicInfo,
): Promise<UserProfileInsertBasicInfoResponse['data']['userProfile_Basic_Insert']> => {
  const response = await GraphQL.fetch(`mutation {
    userProfile_Basic_Insert(data: {
      id: ${data.id},
      first_name: "${data?.first_name}",
      last_name: "${data?.last_name}",
      date_of_birth: "${data?.date_of_birth}",
      birth_last_name: "${data?.birth_last_name}",
      country_of_birth:"${data?.country_of_birth}",
      city_of_birth: "${data?.city_of_birth}",
      nationality: "${data?.nationality}",
      citizenship: "${data?.citizenship}",
      address: "${data?.address}",
      father_name: "${data?.father_name}",
      mother_name: "${data?.mother_name}",
      mother_birth_last_name: "${data?.mother_birth_last_name}",
      bank_account: "${data?.bank_account}",
      bank_name: "${data?.bank_name}",
      official_personal_id: "${data?.official_personal_id}",
      official_personal_document_number: "${data?.official_personal_document_number}",
      official_personal_document_issuer: "${data?.official_personal_document_issuer}",
      gender: "${data?.gender}",
      single_parent: ${data?.single_parent ?? null},
      housing_done: ${data?.housing_done ?? null},
      revisor_role: ${data?.revisor_role ?? null},
      housing_description: "${data?.housing_description}",
      marital_status: "${data?.marital_status}",
      date_of_taking_oath: "${data?.date_of_taking_oath}",
      date_of_start: "${data?.date_of_start}",
      date_of_end: "${data?.date_of_end}",
      date_of_becoming_judge: "${data?.date_of_becoming_judge}",
      email: "${data?.email}",
      phone: "${data?.phone}",
      organization_unit_id: ${data?.organization_unit_id},
      job_position_id: ${data?.job_position_id},
      contract_type_id: ${data?.contract_type_id},
    }
    ) {
      message
      status
      item {
          id
          first_name
          last_name
          date_of_birth
          birth_last_name
          country_of_birth
          city_of_birth
          nationality
          citizenship
          address
          father_name
          mother_name
          mother_birth_last_name
          bank_account
          bank_name
          official_personal_id
          official_personal_document_number
          official_personal_document_issuer
          gender
          single_parent
          housing_done
          revisor_role
          housing_description
          marital_status
          date_of_taking_oath
          date_of_start
          date_of_end
          date_of_becoming_judge
          email
          phone
          organization_unit {
            id
            title
          }
          job_position {
            id
            title
          }
          contract_type {
            id
            title
          }
          updated_at
      }
  }
}
`);

  return response?.data?.userProfile_Basic_Insert || {};
};

export default basicInfoInsert;
