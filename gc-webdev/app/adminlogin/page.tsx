"use client"
import React, { useState } from 'react'
import AdminLogin from '../component/AdminLogin';
import StoreContextProvider from '../context/storeContext';


const AdminLogInPage: React.FC = () => {
    const [email, setEmail] = useState<string>(""); // Initialize with an empty string
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    return (
        <StoreContextProvider>
            <div className='flex center items-center justify-center h-screen'>
                <AdminLogin />
            </div>
        </StoreContextProvider>
    )
}

export default AdminLogInPage;