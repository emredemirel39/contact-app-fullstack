import Cookies from 'js-cookie';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../redux/store';
import { changePasswordFulfilled, changePasswordPending, changePasswordRejected } from '../redux/userSlice';
import { IPasswordController, IUser, IUserResponseData } from '../types';
import { checkPasswords } from '../utils';

const ChangePasswordPage = () => {

    // Redux
    const userState = useAppSelector(state => state.user);
    const dispatch = useAppDispatch();
    const { user } = userState;

    // router
    const navigate = useNavigate();

    // Cookies
    const token = Cookies.get('token');

    // component states
    const initialState = {
        password: ""
    };
    const initialPasswordController: IPasswordController = {
        first: '',
        second: ''
    };
    const [newPassword, setNewPassword] = useState<typeof initialState>(initialState);
    const [passwordControl, setPasswordControl] = useState<IPasswordController>(initialPasswordController);

    // Functions
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewPassword({...newPassword, [e.target.name]: e.target.value})
    };

    const handlePasswordControl = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.name === 'password') {
            setPasswordControl({...passwordControl, first: e.target.value});
        } else if (e.target.name === 'password2') {
            setPasswordControl({...passwordControl, second: e.target.value});
        }
    }

    const handleNewPassword = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const isPasswordsAreSame: boolean = checkPasswords(passwordControl);

        if (isPasswordsAreSame) {
            const url = `http://localhost:6060/users/${user._id}/change-password`;
            dispatch(changePasswordPending());

            try {
                
                const response = await fetch(url, {
                    method: 'PATCH',
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(newPassword)
                });

                const responseData: IUserResponseData = await response.json();

                if (response.status === 200) {
                    changePasswordFulfilled(responseData.data as IUser);
                    alert(responseData.message as string)
                    navigate('/dashboard')
                } else {
                    dispatch(changePasswordRejected(responseData.message as string));
                    alert(responseData.message);
                }

            } catch (error) {
                console.log(error);
                dispatch(changePasswordRejected('Error while fetching data'));
            }
        }
    }

  return (
    <div>
        <div className='w-full flex justify-end text-blue-500'><button onClick={() => {navigate(-1) }}>Cancel Edit</button></div>
        <h4 className='w-full text-center text-2xl'>Change Password</h4>
        <form className='w-full flex flex-col items-center gap-4' onSubmit={e => handleNewPassword(e)}>
            <div className='flex flex-col items-start justify-center gap-0.5 w-full border-b border-slate-300 border-solid pb-0.5'>
              <label className='text-xs'>Enter Your New Password<sup>*</sup>:</label>
                <input
                    className='min-h-fit h-7 w-full outline-none focus:text-blue-500'
                    type="password"
                    placeholder='Required'
                    name='password'
                    onChange={e => {
                        handlePasswordControl(e)
                        handleChange(e)
                    }}  
                />
            </div>
          <div className='flex flex-col items-start justify-center gap-0.5 w-full border-b border-slate-300 border-solid pb-0.5'>
             <label className='text-xs'>Enter Your New Password Again <sup>*</sup>:</label>
             <input
                className='min-h-fit h-7 w-full outline-none focus:text-blue-500'
                    type="password"
                    placeholder='Required'
                    name='password2'
                    onChange={e => {
                        handlePasswordControl(e)
                    }}  
             />
            </div>
            <button className='mt-8 bg-green-500 hover:bg-green-400 px-4 py-0.5 rounded-2xl text-white'>Save New Password!</button>
        </form>      
    </div>
  )
}

export default ChangePasswordPage