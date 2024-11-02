"use client"
import '../globals.css';
import Navbar from './Navbar';
import Footer from './Footer';
import React, { useEffect, useContext, useState } from 'react';
import { storeContext } from '../context/storeContext';
// import LocalStorage from '../constants/localstorage';

export default function MainLayout({ children }: { children: React.ReactNode }) {

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);  // Set logged-in state based on token existence
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      console.log('Token found in localStorage:', token);
    }
  }, [])

  console.log('MainLayout mounted'); // Add a log to check if MainLayout mounts

  return (
    <html lang="en">
      <body>
        <div>
          <Navbar isLoggedIn={isLoggedIn} />
          <main>{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}