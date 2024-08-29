// LogInPage.tsx
"use client"
import React, { useState } from 'react'
import LogIn from '../component/LogIn'
import StoreContextProvider from '../context/storeContext'

const LogInPage: React.FC = () => {
    const [email, setEmail] = useState<string>(""); // Initialize with an empty string
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    
    return (
        <StoreContextProvider>
            <div className='flex center items-center justify-center h-screen'>
                <LogIn />
            </div>
        </StoreContextProvider>
    )
}

export default LogInPage;