"use client"
import '../globals.css';
import Navbar from './Navbar';
import Footer from './Footer';
import React, { useEffect, useContext } from 'react';
import { storeContext } from '../context/storeContext';

export default function MainLayout({ children }: { children: React.ReactNode }) {

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
          <Navbar />
          <main>{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}