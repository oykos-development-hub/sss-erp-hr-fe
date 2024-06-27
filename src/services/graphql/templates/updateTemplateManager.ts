const updateTemplateManager = `mutation($data: TemplateInsertMutation!) {
    templateItem_Update(data: $data) {
        message
        status
    }
}`;

export default updateTemplateManager;
