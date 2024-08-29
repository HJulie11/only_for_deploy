 // Use the client directive for using usePathname hook.
 'use client'

 // Use usePathname for catching route name.
 import { usePathname } from 'next/navigation';
import Navbar from './component/Navbar';
import Footer from './component/Footer';
import React from 'react';
 
 export const LayoutProvider = ({ children }: { children: React.ReactNode }) => {
     const pathname = usePathname();
     const [isLoggedIn, setIsLoggedIn] = React.useState(false);

     // Simulate a login action
     const handleLogin = () => {
         setIsLoggedIn(true);
     };
     return (
        <>
        {/* {pathname === "/posts" && <Navbar isLoggedIn={isLoggedIn}/>} */}
        {/* {pathname === "/posts" && <Navbar isLoggedIn={isLoggedIn}/>} */}
        {/* <Navbar isLoggedIn={isLoggedIn} /> */}
        {children}
        {/* <Footer /> */}
        {/* {pathname === "/posts" && <Footer />} */}
        </>
     )
 };