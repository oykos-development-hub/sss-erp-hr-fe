const insertTemplate = `mutation($data: TemplateInsertMutation!) {
    template_Insert(data: $data) {
        message
        status
    }
}`;

export default insertTemplate;
