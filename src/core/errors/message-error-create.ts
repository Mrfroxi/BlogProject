

export function createErrorMessage(message:unknown,field:unknown){

    return [{
        message: `${message}`,
        field:`${field}`
    }]
}