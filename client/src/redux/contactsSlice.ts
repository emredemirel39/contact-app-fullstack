import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import { IContact } from "../types";

export interface IContactsState {
    contacts: IContact[] | null;
    selectedContact: IContact,
    isLoading: boolean,
    err: string | null,
    isChanging: boolean
};

const initialState: IContactsState = {
    selectedContact: {
        name: '',
        surname: '',
        email: '',
        phoneNumber: '',
        _id: '',
        ownerId: ''
    },
    contacts: null,
    isLoading: false,
    err: '',
    isChanging: false
};

export const getOneContact = createAsyncThunk('getOneContact', async (id) => {
    const url = `http://localhost:6060/contacts/${id}`
    const token = Cookies.get('token');

    try {

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      const responseData = await response.json();
      
      if (response.status === 200) {
        return responseData.data;

      } else {
        return responseData.message;
      }
      
    } catch (error) {
      console.log(error);
    };
})

const contactsSlice = createSlice({
    name: 'contactsSlice',
    initialState,
    reducers: {
        fetchContactsSending: (state) => {
            state.contacts = null;
            state.err = '';
            state.isLoading = true;
        },
        fetchContactsFulfilled: (state, action: PayloadAction<IContact []>) => {
            state.isLoading = false;
            state.err = '';
            const allContacts = action.payload;
            const sortedAllContacts = allContacts.sort((a: IContact, b: IContact) => a.name!.localeCompare(b.name!));
            state.contacts = sortedAllContacts;
        },
        fetchContactsRejected: (state, action: PayloadAction<string>) => {
            state.isLoading = false;
            state.contacts = null;
            state.err = action.payload;
        },
        fetchSelectedContactSending: (state) => {
            state.err = '';
            state.isLoading = true;
        },
        fetchSelectedContactFulfilled: (state, action: PayloadAction<IContact>) => {
            state.isLoading = false;
            state.err = '';
            state.selectedContact = action.payload;
        },
        fetchSelectedContactRejected: (state, action: PayloadAction<string>) => {
            state.isLoading = false;
            //state.selectedContact = initialState.selectedContact;
            state.err = action.payload;
        },
        addNewContactPending: (state) => {
            state.isLoading = true;
            state.err = '';
        },
        addNewContactFulfilled: (state) => {
            state.isLoading = false;
            state.err = '';
            state.isChanging = !state.isChanging;
        },
        addNewContactRejected: (state, action: PayloadAction<string>) => {
            state.isLoading = false;
            state.err = action.payload;
        },
        deleteContactPending: (state) => {
            state.isLoading = true;
            state.err = '';
        },
        deleteContactFulfilled: (state) => {
            state.isLoading = false;
            state.err = '';
            state.selectedContact = initialState.selectedContact;
            state.isChanging = !state.isChanging;
        },
        deleteContactRejected: (state, action: PayloadAction<string>) => {
            state.isLoading = false;
            state.err = action.payload;
        },
        updateContactPending: (state) => {
            state.isLoading = true;
            state.err = '';
        },
        updateContactFulfilled: (state, action: PayloadAction<IContact>) => {
            state.isLoading = false;
            state.err = '';
            state.selectedContact = action.payload;
            state.isChanging = !state.isChanging;
        },
        updateContactRejected: (state, action: PayloadAction<string>) => {
            state.isLoading = false;
            state.err = action.payload;
        }
    }
});

export default contactsSlice.reducer;
export const {
    fetchContactsSending,
    fetchContactsFulfilled,
    fetchContactsRejected,
    fetchSelectedContactSending,
    fetchSelectedContactFulfilled,
    fetchSelectedContactRejected,
    addNewContactPending,
    addNewContactFulfilled,
    addNewContactRejected,
    deleteContactPending,
    deleteContactFulfilled,
    deleteContactRejected,
    updateContactPending,
    updateContactFulfilled,
    updateContactRejected
} = contactsSlice.actions;