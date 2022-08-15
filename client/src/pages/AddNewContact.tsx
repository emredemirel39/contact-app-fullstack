import Cookies from 'js-cookie';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { addNewContactFulfilled, addNewContactPending, addNewContactRejected } from '../redux/contactsSlice';
import { useAppDispatch, useAppSelector } from '../redux/store';
import { IAddContactForm, IContact, IContactsResponseData } from '../types';

const AddNewContact = () => {

    // Redux
    const userState = useAppSelector(state => state.user);
    const dispatch = useAppDispatch();

    //Router
    const navigate = useNavigate();

    // Component States
    const initialState: IAddContactForm = {
        name: '',
        surname: '',
        phoneNumber: '',
        email: '',
        ownerId: userState.user._id as string
    };
    const [form, setForm] = useState<IAddContactForm>(initialState);

    // Cookies
    const token = Cookies.get('token');

    // Functions
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const url = 'http://localhost:6060/contacts';
        dispatch(addNewContactPending());

        try {

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(form)
            });
            const responseData: IContactsResponseData = await response.json();

            if (response.status === 201) {
                const newContact = responseData.data as IContact;
                dispatch(addNewContactFulfilled());
                navigate(`/dashboard/contact/${newContact._id}`);
            } else {
                dispatch(addNewContactRejected(responseData.message as string));
                alert(responseData.message);
            }
            
        } catch (error) {
            console.log(error);
        };

    };

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setForm({ ...form, [e.target.name]: e.target.value });
    };

  return (
    <div>
        <div className='w-full flex justify-end text-blue-500'><button onClick={() => {navigate('/dashboard/contacts') }}>Cancel</button></div>      
        <form className='w-full flex flex-col items-center gap-4' onSubmit={e => handleSubmit(e)}>
          <h4 className='text-2xl'>Add New Contact</h4>
          <div className='flex flex-col items-start justify-center gap-0.5 w-full border-b border-slate-300 border-solid pb-0.5'>
              <label className='text-xs'>Name<sup>*</sup>:</label>
              <input className='min-h-fit h-7 w-full outline-none focus:text-blue-500' name='name' type="text" placeholder='Required' onChange={e => handleChange(e)}/>
          </div>
          <div className='flex flex-col items-start justify-center gap-0.5 w-full border-b border-slate-300 border-solid pb-0.5'>
              <label className='text-xs'>Surname:</label>
              <input className='min-h-fit h-7 w-full outline-none focus:text-blue-500' type="text" name='surname' onChange={e => handleChange(e)}/>
          </div>
          <div className='flex flex-col items-start justify-center gap-0.5 w-full border-b border-slate-300 border-solid pb-0.5'>
              <label className='text-xs'>Phone Number<sup>*</sup>:</label>
              <input className='min-h-fit h-7 w-full outline-none focus:text-blue-500' type="text" placeholder='Required' name='phoneNumber' onChange={e => handleChange(e)}/>
          </div>
          <div className='flex flex-col items-start justify-center gap-0.5 w-full border-b border-slate-300 border-solid pb-0.5'>
              <label className='text-xs'>Email:</label>
              <input className='min-h-fit h-7 w-full outline-none focus:text-blue-500' type="text" name='email' onChange={e => handleChange(e)}/>
          </div>
          
          <button className='mt-8 bg-green-500 hover:bg-green-400 px-4 py-0.5 rounded-2xl text-white'>Add Contact!</button>
          </form>
    </div>
  )
}

export default AddNewContact