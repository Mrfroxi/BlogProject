

export function messageErrorCreate(message:unknown,field:unknown){

    return [{
        message: `${message}`,
        field:`${field}`
    }]
}