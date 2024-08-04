const getParameters = `query listOfParameters_Overview {
    listOfParameters_Overview {
        message
        status
        data
        items {
            id
            title
            description
        }
    }
}`;

export default getParameters;
