import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ILoginForm, IUser, IUserResponseData } from '../types'
import Cookies from 'js-cookie';
import { useAppDispatch } from '../redux/store';
import { fetchUserFulfilled, fetchUserRejected, fetchUserSending } from '../redux/userSlice';

const LoginPage: React.FC = () => {

  //Redux
  const dispatch = useAppDispatch();

  // Router
  const navigate = useNavigate();

  // Component states
  const initialState: ILoginForm = {
    phoneNumber: '',
    password: ''
  };
  const [form, setform] = useState<ILoginForm>(initialState);

  // Functions
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setform({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const url = 'http://localhost:6060/users/login';

    dispatch(fetchUserSending());
    Cookies.remove('token');

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      });
      
      const responseData: IUserResponseData = await response.json();

      if (response.status === 200) {
        Cookies.set('token', responseData.token as string, { expires: 1 });
        dispatch(fetchUserFulfilled(responseData.data as IUser));
        navigate('/dashboard');
      } else {
        dispatch(fetchUserRejected(responseData.message as string));
        alert(responseData.message);
      }

    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className='flex flex-col overflow-x-hidden overflow-y-hidden w-full h-screen justify-center items-center'>
      <form className='flex flex-col w-full max-w-2xl gap-4 items-center m-4' onSubmit={e => handleLogin(e)}>
        <h4 className='w-full text-center text-2xl'>Login Form</h4>
        <div className='w-full flex items-stretch gap-1 bg-slate-200 px-4 py-1 rounded-2xl'>
          <label className='min-w-max'>Phone Number<sup>*</sup>:</label>
          <input className='w-full pl-1 outline-none bg-transparent text-blue-600' onChange={e => handleChange(e)} type="text" placeholder='Required' name='phoneNumber'/>
        </div>
        <div className='w-full flex items-stretch gap-1 bg-slate-200 px-4 py-1 rounded-2xl'>
          <label className='min-w-max'>Password<sup>*</sup>:</label>
          <input className='w-full pl-1 outline-none bg-transparent text-blue-600' onChange={e => handleChange(e)} type="password" placeholder='Required' name='password' />
        </div>
        <button className='mt-8 bg-green-500 hover:bg-green-400 px-4 py-0.5 rounded-2xl text-white'>Login!</button>
      </form>
      <div>Don't you have an acount? <Link className='text-blue-700' to='/'>Click here to register!</Link></div>
    </div>
  )
}

export default LoginPage