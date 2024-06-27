const updateTemplateAdmin = `mutation($data: TemplateInsertMutation!) {
    template_Update(data: $data) {
        message
        status
    }
}`;

export default updateTemplateAdmin;
