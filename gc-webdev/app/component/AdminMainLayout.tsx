"use client"
import React, { useEffect } from 'react'
import AdminNavbar from './AdminNavbar'
import AdminFooter from './AdminFooter'
import '../globals.css'

export default function AdminMainLayout({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            console.log('Token found in localStorage:', token);
        }
    }, [])

    return (
        <html>
            <body>
                <div>
                    <AdminNavbar />
                    <main>{children}</main>
                    <AdminFooter />
                </div>
            </body>
        </html>
    )
}