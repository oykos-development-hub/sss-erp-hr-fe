const getTemplates = `query templateOverview($template_id: Int, $organization_unit_id: Int, $page: Int, $size:Int) {
    template_Overview(template_id: $template_id, organization_unit_id: $organization_unit_id, page: $page, size:$size) {
        message
        status
        total
        items {
            id
            template{
                id
                title
            }
            organization_unit{
                id
                title
            }
            file{
                id
                name
                type
            }
        }
    }
}`;

export default getTemplates;
