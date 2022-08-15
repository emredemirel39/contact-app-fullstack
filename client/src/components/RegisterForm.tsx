import Cookies from 'js-cookie';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../redux/store';
import { fetchUserFulfilled, fetchUserRejected, fetchUserSending } from '../redux/userSlice';
import { IPasswordController, IRegisterForm, IUser, IUserResponseData } from '../types';
import { checkPasswords } from '../utils';

const RegisterForm = () => {

    // Redux
    const dispatch = useAppDispatch();

    // Router
    const navigate = useNavigate();

    // Component states
    const initialState: IRegisterForm = {
        name: '',
        surname: "",
        password: "",
        email: "",
        phoneNumber: ""
    };
    const initialPasswordController: IPasswordController = {
        first: '',
        second: ''
    };
    const [form, setForm] = useState<IRegisterForm>(initialState);
    const [passwordControl, setPasswordControl] = useState<IPasswordController>(initialPasswordController);

    // Functions
    const handlePasswordControl = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.name === 'password') {
            setPasswordControl({...passwordControl, first: e.target.value});
        } else if (e.target.name === 'password2') {
            setPasswordControl({...passwordControl, second: e.target.value});
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        let isPasswordsAreSame: boolean = checkPasswords(passwordControl);
        
        // POST REGISTER
        if (isPasswordsAreSame) {

            const url = 'http://localhost:6060/users/register';
            Cookies.remove('token');
            dispatch(fetchUserSending());

            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(form)
                });

                const responseData: IUserResponseData = await response.json();

                if (response.status === 201) {
                    Cookies.set('token', responseData.token as string);
                    dispatch(fetchUserFulfilled(responseData.data as IUser));
                    navigate('/dashboard');
                } else {
                    fetchUserRejected(responseData.message as string);
                    alert(responseData.message);
                }

            } catch (error) {
                console.log(error);
            };
        };
    };

  return (
    <div className='flex flex-col gap-12 justify-center items-center overflow-x-hidden overflow-y-hidden m-4 w-full'>
        <form className='flex flex-col w-full max-w-2xl gap-4 items-center mx-4' onSubmit={e => handleRegister(e)}>
          <h4 className='w-full text-center text-2xl'>Register Form</h4>
          <div className='w-full flex items-stretch gap-1 bg-slate-200 px-4 py-1 rounded-2xl'>
              <label className='min-w-max'>Name<sup>*</sup>:</label>
              <input className='w-full pl-1 outline-none bg-transparent text-blue-600' name='name' type="text" placeholder='Required' onChange={e => handleChange(e)}/>
          </div>
          <div className='w-full flex gap-1 items-stretch bg-slate-200 px-4 py-1 rounded-2xl'>
              <label className='min-w-max'>Surname:</label>
              <input className='w-full pl-1 outline-none bg-transparent text-blue-600' type="text" name='surname' onChange={e => handleChange(e)}/>
          </div>
          <div className='w-full flex gap-1 items-stretch bg-slate-200 px-4 py-1 rounded-2xl'>
              <label className='min-w-max'>Phone Number<sup>*</sup>:</label>
              <input className='w-full pl-1 outline-none bg-transparent text-blue-600' type="text" placeholder='Required' name='phoneNumber' onChange={e => handleChange(e)}/>
          </div>
          <div className='w-full flex gap-1 items-stretch bg-slate-200 px-4 py-1 rounded-2xl'>
              <label className='min-w-max'>Email:</label>
              <input className='w-full pl-1 outline-none bg-transparent text-blue-600' type="text" name='email' onChange={e => handleChange(e)}/>
          </div>
          <div className='w-full flex gap-1 items-stretch bg-slate-200 px-4 py-1 rounded-2xl'>
              <label className='min-w-max'>Password<sup>*</sup>:</label>
                <input
                    className='w-full pl-1 outline-none bg-transparent text-blue-600'
                    type="password"
                    placeholder='Required'
                    name='password'
                    onChange={e => {
                        handlePasswordControl(e)
                        handleChange(e)
                    }}  
                />
          </div>
          <div className='w-full flex gap-1 items-stretch bg-slate-200 px-4 py-1 rounded-2xl'>
              <label className='min-w-max'>Enter Your Password Again <sup>*</sup>:</label>
                <input
                    className='w-full pl-1 outline-none bg-transparent text-blue-600'
                    type="password"
                    placeholder='Required'
                    name='password2'
                    onChange={e => {
                        handlePasswordControl(e)
                    }}  
                />
          </div>
          <button className='mt-8 bg-green-500 hover:bg-green-400 px-4 py-0.5 rounded-2xl text-white'>Register!</button>
          </form>
          <div>Do you already have an account? <Link className='text-blue-700' to='/login' >Click here to login!</Link></div>
    </div>
  )
}

export default RegisterForm