import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom';
import AllContacts from '../components/AllContacts'

const AllContactsPage = () => {

    // THIS PAGE HIDDEN ON DESKTOP

    const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth);
    const isDesktop = screenWidth >= 1024;
    
    const updateScreenWidth = () => {
        setScreenWidth(window.innerWidth);
    };

    useEffect(() => {
        window.addEventListener("resize", updateScreenWidth);
    }, []);
    
  return (
    <div className='w-full overflow-y-auto'>
        {
            isDesktop ? <Navigate to='/dashboard' /> : (
                    <AllContacts />
            )
        }
    </div>
  )
}

export default AllContactsPage