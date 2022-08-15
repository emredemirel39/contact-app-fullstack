import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser } from "../types";

export interface IUserState {
    user: IUser;
    isLoggedIn: boolean,
    isLoading: boolean,
    err: string | null,
    isChanging: boolean
};

const initialState: IUserState = {
    user: {
        name: '',
        surname: '',
        password: '',
        email: '',
        phoneNumber: '',
        _id: '',
        __v: null
    },
    isLoggedIn: false,
    isLoading: false,
    err: '',
    isChanging: false
};

const userSlice = createSlice({
    name: 'userSlice',
    initialState,
    reducers: {
        logoutUserPending: (state) => {
            state.isLoading = true;
            state.err = '';
            state.user = initialState.user
            state.isLoggedIn = false;
        },
        logoutUserFulfilled: (state) => {
            state.isLoading = false;
            state.err = '';
            state.user = initialState.user
            state.isLoggedIn = false;
        },
        logoutUserRejected: (state, action: PayloadAction<string>) => {
            state.isLoading = false;
            state.err = action.payload;
            state.user = initialState.user
            state.isLoggedIn = false;
        },
        handleLoggedInState: (state, action: PayloadAction<boolean>) => {
            state.isLoggedIn = action.payload
        },
        fetchUserSending: (state) => {
            state.user = initialState.user;
            state.isLoggedIn = false;
            state.err = '';
            state.isLoading = true;
        },
        fetchUserFulfilled: (state, action: PayloadAction<IUser>) => {
            state.isLoading = false;
            state.err = '';
            state.user = action.payload;
            state.isLoggedIn = true;
        },
        fetchUserRejected: (state, action: PayloadAction<string>) => {
            state.isLoading = false;
            state.isLoggedIn = false;
            state.user = initialState.user;
            state.err = action.payload;
        },
        deleteAccountPending: (state) => {
            state.isLoading = true;
            state.err = '';
        },
        deleteAccountFulfilled: (state) => {
            state.isLoading = false;
            state.err = '';
            state.isLoggedIn = false;
            state.user = initialState.user;
        },
        deleteAccountRejected: (state, action: PayloadAction<string>) => {
            state.isLoading = false;
            state.err = action.payload;
            state.isLoggedIn = false;
            state.user = initialState.user;
        },
        editAccountPending: (state) => {
            state.isLoading = true;
            state.err = '';
        },
        editAccountFulfilled: (state, action: PayloadAction<IUser>) => {
            state.isLoading = false;
            state.err = '';
            state.user = action.payload;
            state.isChanging = !state.isChanging;
        },
        editAccountRejected: (state, action: PayloadAction<string>) => {
            state.isLoading = false;
            state.err = action.payload;
        },
        changePasswordPending: (state) => {
            state.isLoading = true;
            state.err = '';
        },
        changePasswordFulfilled: (state, action: PayloadAction<IUser | string>) => {
            state.isLoading = false;
            state.err = '';
            state.user = action.payload as IUser;
        },
        changePasswordRejected: (state, action: PayloadAction<string>) => {
            state.isLoading = false;
            state.err = action.payload;
        }
    }
});

export default userSlice.reducer;
export const {
    logoutUserPending,
    logoutUserFulfilled,
    logoutUserRejected,
    handleLoggedInState,
    fetchUserSending,
    fetchUserRejected,
    fetchUserFulfilled,
    deleteAccountPending,
    deleteAccountFulfilled,
    deleteAccountRejected,
    editAccountPending,
    editAccountFulfilled,
    editAccountRejected,
    changePasswordPending,
    changePasswordFulfilled,
    changePasswordRejected
} = userSlice.actions;