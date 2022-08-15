import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { useAppSelector } from '../redux/store';
import { BsPersonPlus } from 'react-icons/bs';
import { FiSearch } from 'react-icons/fi';

const AllContacts = () => {

  //redux
  const contactsState = useAppSelector(state => state.contacts);

  // component states
  const [search, setSearch] = useState<string>('');
  const [screenHeight, setScreenHeight] = useState<number>(window.innerHeight);
  const [isMobile, setMobile] = useState<boolean>(window.innerWidth < 1024)

  // Functions
  const contactsSectionHeight = (): string => isMobile ? (screenHeight - 260) + 'px' :  (screenHeight - 200) + 'px'

  useEffect(() => {
    window.addEventListener('resize', () => {
      setScreenHeight(window.innerHeight);
      setMobile(window.innerWidth < 1024);
    });
  }, [])

  return (
      <div className='w-full h-full lg:h-full flex flex-col items-center'>
        <div className='w-full lg:shadow border-b border-solid border-slate-300 p-4 flex flex-col items-center gap-4'>
          <div className='w-full h-4 flex justify-end items-start'>
            <Link to='../../dashboard/add-contact'><BsPersonPlus className='fill-blue-500' size='1.5em' /></Link>
          </div>
          <h3 className='text-2xl'>Contacts</h3>
          <div className='flex justify-start items-center bg-slate-200 px-2 py-1.5 rounded-3xl gap-3 w-3/4'>
            <FiSearch size='1.5em' />
            <input onChange={e => setSearch(e.target.value)} className='bg-transparent w-full outline-none' type="text" placeholder='Search...' />  
          </div>
        </div>
            {
             contactsState.contacts?.length === 0 ? <p className='px-4'>You have not any contact yet!</p> : (
                <ul style={{height: contactsSectionHeight()}} className={`p-4 w-full h-[400px] lg:h-full overflow-y-auto`}>
                 {
                  contactsState.contacts?.filter(contact => contact.name?.toLowerCase().includes(search.toLowerCase()))
                  .map((contact, i) => (
                    <li key={i} className='border-b border-slate-300 border-solid py-2 w-full px-2 hover:text-blue-500'><Link to={`/dashboard/contact/${contact._id}`}> {contact.name} { contact.surname }</Link></li>
                  ))
                }
               </ul>
              )   
            }      
    </div>
  )
}

export default AllContacts