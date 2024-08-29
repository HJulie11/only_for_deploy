"use client"
// Import your layout page
import React from 'react';
import { LayoutProvider } from './LayoutProvider'
import './globals.css'

export default function RootLayout({ 
    children 
}: { 
    children: React.ReactNode 
}) {
    const [isLoggedIn, setIsLoggedIn] = React.useState(false);

     // Simulate a login action
     const handleLogin = () => {
         setIsLoggedIn(true);
     };
     return (
     <html lang="en">
        <body>
            <LayoutProvider>
                {children}
            </LayoutProvider>
        </body>
    </html>
  )
}