const deleteTemplate = `mutation($id: Int!) {
    template_Delete(id: $id) {
        message
        status
    }
}`;

export default deleteTemplate;
