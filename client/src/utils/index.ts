import Cookies from "js-cookie";
import { IPasswordController } from "../types";

export const checkPasswords = (state: IPasswordController): boolean => {

    if (state.first === '' && state.second === '') {
        alert('Please enter password!')
        return false;
    } else if (state.first === state.second) {
        return true;
    } else {
        alert('Password must be same!')
        return false;
    }
};

export const getTokenFromCookies = (): string | undefined => Cookies.get('token');