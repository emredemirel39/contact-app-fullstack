import { useEffect, useRef, useState } from 'react';
import { MdArrowBackIosNew } from 'react-icons/md';
import { RiUserLine } from 'react-icons/ri';
import { AiOutlineContacts } from 'react-icons/ai';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import AllContacts from '../components/AllContacts';
import { fetchContactsFulfilled, fetchContactsRejected, fetchContactsSending } from '../redux/contactsSlice';
import { useAppDispatch, useAppSelector } from '../redux/store'
import { fetchUserFulfilled, fetchUserRejected, fetchUserSending } from '../redux/userSlice';
import { IContact, IContactsResponseData } from '../types';
import { getTokenFromCookies } from '../utils';

const Dashboard = () => {

  // Redux
  const userState = useAppSelector(state => state.user);
  const contactsState = useAppSelector(state => state.contacts);
  const dispatch = useAppDispatch();

  // React Router
  const navigate = useNavigate();

  // Cookies
  const token = getTokenFromCookies();
  const isThereCookies = token !== undefined;

  // Component State
  const [isAuthenticated, setAuthenticated] = useState<boolean>(false);

  //Refs
  const hasFetchedData = useRef(false); // To not allow to fetch data twice

  // Functions
  const fetchContacts = async () => {

    const url = `http://localhost:6060/contacts`;
    
    dispatch(fetchContactsSending());

    try {

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      const responseData: IContactsResponseData = await response.json();

      if (response.status === 200) {
        dispatch(fetchContactsFulfilled(responseData.data as IContact[]));
      } else {
        dispatch(fetchContactsRejected(responseData.message as string));
      }
        
    } catch (error) {
      console.log(error);
    }
  };

  const handlePrivateRoute = async () => {

    if (userState.isLoggedIn) {
      setAuthenticated(true);
    } else if (!isThereCookies) {
      setAuthenticated(false);
      navigate('/');
    } else if (isThereCookies) {

      const url = 'http://localhost:6060/users/login-token';

      dispatch(fetchUserSending());
        
      try {

        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        })

        const responseData = await response.json();

        if (response.status === 200) {
          dispatch(fetchUserFulfilled(responseData.data))
          setAuthenticated(true)
        } else {
          setAuthenticated(false);
          dispatch(fetchUserRejected(responseData.message));
          navigate('/');
        }
 
      } catch (error) {
        console.log(error);
        setAuthenticated(false);
        navigate('/');
      }
    }
  };

  useEffect(() => {
    handlePrivateRoute();

    if (hasFetchedData.current === false) {
      fetchContacts();
      hasFetchedData.current = true;
    } 
  }, []);

  useEffect(() => {
    fetchContacts()
  }, [contactsState.isChanging]);

  return (
    <>
      {isAuthenticated && (
        <div className='flex flex-col w-full h-screen max-h-screen items-center overflow-x-hidden overflow-y-hidden'>
          <header className='flex w-full justify-center items-center shadow py-4'>
            <div className='flex w-full max-w-screen-2xl justify-between items-center mx-4'>
              <div onClick={() => navigate(-1)} className='flex justify-center items-center gap-1 cursor-pointer text-blue-500'><MdArrowBackIosNew size='1.2em' /> Back</div>
              <div className='cursor-pointer uppercase' onClick={() => navigate('/dashboard')}>Logo</div>
              <RiUserLine size='1.5em' onClick={() => navigate('/dashboard')} className='hidden lg:block cursor-pointer fill-blue-500' />
            </div>
          </header>
          <main className='flex w-full max-w-screen-2xl h-full justify-center'>
            <aside className='hidden lg:h-full lg:w-1/3 lg:flex lg:flex-col lg:items-center overflow-y-hidden shadow'>
              <AllContacts />
            </aside>
           <section className='flex flex-col justify-between h-full max-h-full w-full lg:w-2/3 px-4 pt-4' >
            <Outlet />
           </section>
          </main>
          <nav className='flex lg:hidden justify-center items-center w-full border-t border-slate-300 border-solid h-12'>
            <ul className='w-full max-w-screen-2xl flex justify-center items-center mx-4'>
              <li className='w-1/2 flex justify-center items-center'>
                <Link to='/dashboard/contacts'><AiOutlineContacts size='2em' /></Link>
              </li>
              <li className='w-1/2 flex justify-center items-center'>
                <Link to='/dashboard'><RiUserLine size='1.5em' /></Link>
              </li>
            </ul>    
          </nav>
        </div>
      )}
    </>
  )
}

export default Dashboard