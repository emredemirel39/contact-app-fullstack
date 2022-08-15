export interface ILoginForm {
    phoneNumber: string | null,
    password: string | null
};

export interface IRegisterForm {
    name: string | null,
    surname?: string | null,
    password: string | null,
    email?: string | null,
    phoneNumber: string | null
};

export interface IAddContactForm {
    name: string | null,
    surname?: string | null,
    email?: string | null,
    phoneNumber: string | null,
    ownerId: string | null,
};

export interface IPasswordController {
    first: string,
    second: string
};

export interface IUser {
    name: string | null,
    surname?: string | null,
    password: string | null,
    email?: string | null,
    phoneNumber: string | null,
    _id?: string | null,
    __v?: number | null
};

export interface IUserEdit {
    name?: string | null,
    surname?: string | null,
    password?: string | null,
    email?: string | null,
    phoneNumber?: string | null,
};

export interface IContact {
    name: string | null,
    surname?: string | null,
    email?: string | null,
    phoneNumber: string | null,
    _id?: string | null,
    ownerId?: string | null,
};

export interface IUserResponseData {
    status: boolean,
    data?: IUser,
    message?: string,
    token?: string
};

export interface IContactsResponseData {
    status: boolean,
    data?: IContact | IContact [],
    message?: string 
};