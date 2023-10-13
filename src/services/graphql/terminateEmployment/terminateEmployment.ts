const terminateEmployment = `query TerminateEmployment($user_profile_id: Int!){
    terminateEmployment(user_profile_id: $user_profile_id) {
        message
        status
    }
}`;

export default terminateEmployment;
