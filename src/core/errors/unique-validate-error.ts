export class UniqueValidateError extends Error{
    field: 'email' | 'login';

    constructor(field: 'email' | 'login') {
        super(`${field} not unique`);
        this.field = field;
    }
}
