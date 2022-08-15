import Cookies from 'js-cookie'
import { ImUser } from 'react-icons/im';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../redux/store'
import { logoutUserFulfilled, logoutUserPending, logoutUserRejected } from '../redux/userSlice';
import { IUserResponseData } from '../types';

const UserProfile = () => {

    // Redux
    const userState = useAppSelector(state => state.user);
    const dispatch = useAppDispatch();

    // Router
    const navigate = useNavigate();

    // Cookies
    const token = Cookies.get('token');

    // libs
    const paramsId = userState.user._id;
    const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    }
    const baseUrl = 'http://localhost:6060/users/'

    // Functions
    const handleLogout = async () => {


        const url = baseUrl + `${paramsId}/logout`;
        dispatch(logoutUserPending());

        try {
            
            const response = await fetch(url, {
                method: 'POST',
                headers
            })

            
            if (response.status === 204) {
                logoutUserFulfilled();
                navigate('/');
                Cookies.remove('token');
            } else {
                const responseData: IUserResponseData = await response.json();
                logoutUserRejected(responseData.message as string)
                alert(responseData.message);
                navigate('/');
                Cookies.remove('token');
            }

        } catch (error) {
            console.log(error);
            navigate('/');
            Cookies.remove('token');
        }
    }

  return (
    <div className='w-full h-full max-h-full flex flex-col items-center gap-4'>
        <div className='w-full flex justify-end text-blue-500'><button onClick={() => { navigate('edit-profile') }} className=''>Edit</button></div>  
        <div className='rounded-full bg-slate-300 p-4 border border-solid border-slate-500'><ImUser size='4em' className='fill-slate-500' /></div>
        <div className='w-full flex justify-center border-b border-slate-300 border-solid pb-4'>
              <div className='text-2xl'>{userState?.user.name} { userState?.user.surname }</div>
        </div>
        <ul className='w-full flex flex-col items-center gap-4'>
            <li className='flex flex-col items-start justify-center gap-0.5 w-full border-b border-slate-300 border-solid pb-0.5'>
              <label className='text-xs'>Phone Number:</label>
              <p className='min-h-fit h-7'>{ userState?.user.phoneNumber }</p>
            </li>
            <li className='flex-col items-start justify-center gap-0.5 w-full border-b border-slate-300 border-solid pb-0.5'>
              <label className='text-xs'>E-Mail:</label>
              <p className='min-h-fit h-7' >{ userState?.user.email }</p>
            </li>      
        </ul>  
        <button className='mt-4 bg-blue-500 hover:bg-blue-400 px-4 py-0.5 rounded-2xl text-white' onClick={() => navigate('change-password')}>Change Password</button>
        <button className='mt-8 bg-red-500 hover:bg-red-400 px-4 py-0.5 rounded-2xl text-white' onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default UserProfile