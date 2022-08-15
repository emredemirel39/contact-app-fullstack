import Cookies from 'js-cookie';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { updateContactFulfilled, updateContactPending, updateContactRejected } from '../redux/contactsSlice';
import { useAppDispatch, useAppSelector } from '../redux/store'
import { IContact, IContactsResponseData } from '../types';

const EditContactPage = () => {

    // redux
    const contactsState = useAppSelector(state => state.contacts);
    const dispatch = useAppDispatch();

    // Router
    const navigate = useNavigate();

    // Cookies
    const token = Cookies.get('token');

    // component state
    const { selectedContact } = contactsState;

    const initialState: IContact = {
        name: selectedContact.name,
        surname: selectedContact.surname,
        phoneNumber: selectedContact.phoneNumber,
        email: selectedContact.email,
        ownerId: selectedContact.ownerId
    };
    const [form, setForm] = useState<IContact>(initialState);

    // Functions
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const url = `http://localhost:6060/contacts/${selectedContact._id}`;
        dispatch(updateContactPending());

        try {
            
            const response = await fetch(url, {
                method: 'PATCH',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(form)
            });

            const responseData: IContactsResponseData = await response.json();

            if (response.status === 200) {
                const updatedUser = responseData.data as IContact
                dispatch(updateContactFulfilled(updatedUser));
                navigate(`/dashboard/contact/${updatedUser._id}`);
            } else {
                dispatch(updateContactRejected(responseData.message as string));
                alert(responseData.message as string);
            };

        } catch (error) {
            console.log(error);
        };
    };

  return (
    <div className='w-full h-full flex flex-col items-center'> 
        <div className='w-full flex justify-end text-blue-500'><button onClick={() => {navigate(-1) }}>Cancel Edit</button></div>
        <form onSubmit={e => handleSave(e)} className='w-full flex flex-col items-center gap-4'>
            <h4 className='w-full text-center text-2xl'>Edit Contact</h4>
          <div className='flex flex-col items-start justify-center gap-0.5 w-full border-b border-slate-300 border-solid pb-0.5'>
              <label className='text-xs'>Name<sup>*</sup>:</label>
              <input className='min-h-fit h-7 w-full outline-none focus:text-blue-500' readOnly={false} defaultValue={initialState.name as string} name='name' type="text" placeholder='Required' onChange={e => handleChange(e)}/>
          </div>
          <div className='flex flex-col items-start justify-center gap-0.5 w-full border-b border-slate-300 border-solid pb-0.5'>
              <label className='text-xs'>Surname:</label>
              <input className='min-h-fit h-7 w-full outline-none focus:text-blue-500' readOnly={false} defaultValue={initialState.surname as string} type="text" name='surname' onChange={e => handleChange(e)}/>
          </div>
          <div className='flex flex-col items-start justify-center gap-0.5 w-full border-b border-slate-300 border-solid pb-0.5'>
              <label className='text-xs'>Phone Number<sup>*</sup>:</label>
              <input className='min-h-fit h-7 w-full outline-none focus:text-blue-500' defaultValue={initialState.phoneNumber as string} readOnly={false} type="text" placeholder='Required' name='phoneNumber' onChange={e => handleChange(e)}/>
          </div>
          <div className='flex flex-col items-start justify-center gap-0.5 w-full border-b border-slate-300 border-solid pb-0.5'>
              <label className='text-xs'>Email:</label>
              <input className='min-h-fit h-7 w-full outline-none focus:text-blue-500' defaultValue={initialState.email as string} readOnly={false} type="text" name='email' onChange={e => handleChange(e)}/>
          </div>
          <button className='mt-8 bg-green-500 hover:bg-green-400 px-4 py-0.5 rounded-2xl text-white'>Save Changes!</button>
        </form>
    </div>
  )
}

export default EditContactPage