const terminateEmployment = `query TerminateEmployment($user_profile_id: Int!, $file_id: Int!){
    terminateEmployment(user_profile_id: $user_profile_id, file_id: $file_id) {
        message
        status
    }
}`;

export default terminateEmployment;
