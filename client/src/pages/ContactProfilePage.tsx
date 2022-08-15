import React, { useEffect } from 'react'
import { MdMail, MdMessage, MdLocalPhone } from 'react-icons/md';
import { ImUser } from 'react-icons/im';
import { useNavigate, useParams } from 'react-router-dom'
import { deleteContactFulfilled, deleteContactPending, deleteContactRejected, fetchSelectedContactFulfilled, fetchSelectedContactRejected, fetchSelectedContactSending } from '../redux/contactsSlice';
import { useAppDispatch, useAppSelector } from '../redux/store';
import { IContact, IContactsResponseData } from '../types';
import { getTokenFromCookies } from '../utils';

const ContactProfilePage = () => {

  // Redux
  const contactsState = useAppSelector(state => state.contacts);
  const dispatch = useAppDispatch();

  // Router
  const { _id } = useParams();
  const navigate = useNavigate();

  // Cookies
  const token = getTokenFromCookies();

  // Functions
  const fetchSelectedContact = async () => {

    const url = `http://localhost:6060/contacts/${_id}`
    dispatch(fetchSelectedContactSending());

    try {

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      const responseData: IContactsResponseData = await response.json();
      
      if (response.status === 200) {
        dispatch(fetchSelectedContactFulfilled(responseData.data as IContact));

      } else {
        dispatch(fetchSelectedContactRejected(responseData.message as string));
        navigate(-1);
      }
      
    } catch (error) {
      console.log(error);
    };
  };

  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    const url = `http://localhost:6060/contacts/${_id}`
    dispatch(deleteContactPending());
    
    try {
      
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      })

      const responseData: IContactsResponseData = await response.json();

      if (response.status === 202) {
        navigate('/dashboard/contacts');
        dispatch(deleteContactFulfilled());
        alert('Contact deleted!');
      } else {
        dispatch(deleteContactRejected(responseData.message as string));
      };

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchSelectedContact();
  }, [_id])

  return (
      <div className='w-full h-full max-h-full flex flex-col items-center'>
        <div className='w-full flex justify-end text-blue-500'><button onClick={() => {navigate('edit') }} className=''>Edit</button></div>  
        <form className='w-full flex flex-col items-center'>
          <div className='w-full flex flex-col items-center justify-center gap-4 pb-4 mb-4 border-b border-slate-300 border-solid'>
            <div className='rounded-full bg-slate-300 p-4 border border-solid border-slate-500'><ImUser size='4em' className='fill-slate-500' /></div>
             <div className='w-full flex justify-center'>
              <div className='text-2xl'>{contactsState.selectedContact.name} { contactsState.selectedContact.surname }</div>
            </div>
            <div className='w-full flex justify-center items-center gap-12'>
              <span className=' text-slate-500 hover:text-blue-500 cursor-pointer text-center' ><a className='flex flex-col justify-center items-center' href={`tel:${contactsState.selectedContact.phoneNumber}`}><MdLocalPhone size='1.5em' /> <p className='text-sm text-center'>Call</p></a></span>
              <span className=' text-slate-500 hover:text-blue-500 cursor-pointer text-center' ><a className='flex flex-col justify-center items-center' href={`sms:${contactsState.selectedContact.phoneNumber}`}><MdMessage size='1.5em' /> <p className='text-sm text-center'>Message</p></a></span>
              <span className=' text-slate-500 hover:text-blue-500 cursor-pointer text-center' ><a className='flex flex-col justify-center items-center' href={`mailto:${contactsState.selectedContact.email}`}><MdMail size='1.5em' /> <p className='text-sm text-center'>Mail</p></a></span>
            </div>
          </div>
          <ul className='w-full flex flex-col items-center gap-4'>
            <li className='flex flex-col items-start justify-center gap-0.5 w-full border-b border-slate-300 border-solid pb-0.5'>
              <label className='text-xs'>Phone Number:</label>
              <p className='min-h-fit h-7'>{ contactsState.selectedContact.phoneNumber }</p>
            </li>
            <li className='flex-col items-start justify-center gap-0.5 w-full border-b border-slate-300 border-solid pb-0.5'>
              <label className='text-xs'>E-Mail:</label>
              <p className='min-h-fit h-7' >{ contactsState.selectedContact.email }</p>
            </li> 
          </ul>
          <button className='mt-8 bg-red-500 hover:bg-red-400 px-4 py-0.5 rounded-2xl text-white' onClick={e => handleDelete(e)}>Delete Contact</button>
        </form>
    </div>
  )
}

export default ContactProfilePage