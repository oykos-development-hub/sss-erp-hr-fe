const insertJudgeNorm = `mutation($data: JudgeNormInsertMutation!) {
      judgeNorms_Insert(data: $data) {
          status 
          data
          message 
          item {
            id
            user_profile_id
            topic
            title
            percentage_of_norm_decrease
            number_of_norm_decrease
            number_of_items
            number_of_items_solved
            norm_start_date
            norm_end_date
            evaluation {
                id
                date_of_evaluation
                evaluation_type {
                    id
                    title
                }
                score
                evaluator
                is_relevant
            }
            date_of_evaluation_validity
            file_id
            relocation {
                id
                location
                date_of_start
                date_of_end
                absent_type {
                    id
                    title
                }
                target_organization_unit {
                    id
                    title
                }
            }
        }
      }
  }`;

export default insertJudgeNorm;
