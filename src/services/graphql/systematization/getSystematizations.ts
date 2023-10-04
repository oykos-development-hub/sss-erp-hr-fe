const getSystematizations = `query SystematizationOverview($page: Int, $size: Int, $id: Int, $organization_unit_id: Int, $year: String, $search: String){
      systematizations_Overview(
      page:$page,
      size:$size, 
      id: $id, 
      organization_unit_id: $organization_unit_id,
      year:$year,
      search: $search 
      ) {
          message
          status
          items {
              id 
              organization_unit { 
                  id 
                  title
              }
              description
              serial_number 
              active 
              date_of_activation 
              created_at 
              updated_at    
          } 
          total
      }
    }`;

export default getSystematizations;
