

export interface LoginInformation{
    username: string,
    password: string
};

export interface KeyValuePair{
    key: string,
    value: any
};

export interface JWTReceived{
    status: string,
    token: string
};