import Cookies from 'js-cookie';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../redux/store'
import { deleteAccountFulfilled, deleteAccountPending, deleteAccountRejected, editAccountFulfilled, editAccountPending, editAccountRejected } from '../redux/userSlice';
import { IUser, IUserEdit, IUserResponseData } from '../types';

const EditProfilePage = () => {

    // redux
    const userState = useAppSelector(state => state.user);
    const dispatch = useAppDispatch();

    // Router
    const navigate = useNavigate();

    // Cookies
    const token = Cookies.get('token');

    // libs
    const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    }
    const baseUrl = 'http://localhost:6060/users/'

    // component state
    const { user } = userState;

    const initialState: IUserEdit = {
        name: user.name,
        surname: user.surname,
        phoneNumber: user.phoneNumber,
        email: user.email
    };
    const [form, setForm] = useState<IUserEdit>(initialState);

    // Functions
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const url = baseUrl + user._id;
        dispatch(editAccountPending());

        try {
            
            const response = await fetch(url, {
                method: 'PATCH',
                headers,
                body: JSON.stringify(form)
            });

            const responseData: IUserResponseData = await response.json();

            if (response.status === 200) {
                dispatch(editAccountFulfilled(responseData.data as IUser));
                navigate(`/dashboard`);
            } else {
                dispatch(editAccountRejected(responseData.message as string));
                alert(responseData.message as string);
            };

        } catch (error) {
            console.log(error);
        };
    };

    const handleDeleteAccount = async () => {

        const url =baseUrl + user._id;
        dispatch(deleteAccountPending());

        try {

            const response = await fetch(url, {
                method: 'DELETE',
                headers
            });

            if (response.status === 204) {
                dispatch(deleteAccountFulfilled());
                navigate('/');
                Cookies.remove('token');
            } else {
                const responseData: IUserResponseData = await response.json();
                dispatch(deleteAccountRejected(responseData.message as string));
                navigate('/');
                Cookies.remove('token');
            }
            
        } catch (error) {
            console.log(error);
        }
    };

  return (
    <div className='w-full h-full flex flex-col items-center'>    
        <div className='w-full flex justify-end text-blue-500'><button onClick={() => {navigate(-1) }}>Cancel Edit</button></div>      
        <form onSubmit={e => handleSave(e)} className='w-full flex flex-col items-center gap-4'>
            <h4 className='text-2xl'>Edit Profile</h4>
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
          <button className='mt-4 bg-green-500 hover:bg-green-400 px-4 py-0.5 rounded-2xl text-white'>Save Changes!</button>
        </form>
        <button className='mt-8 bg-red-500 hover:bg-red-400 px-4 py-0.5 rounded-2xl text-white' onClick={handleDeleteAccount}>Delete Your Account</button>  
    </div>
  )
}

export default EditProfilePage