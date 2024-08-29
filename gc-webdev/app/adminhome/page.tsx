"use client"
import React from 'react'
import AdminNavbar from '../component/AdminNavbar'
import AdminFooter from '../component/AdminFooter'
import AdminHomeComponent from '../component/AdminHome'

const AdminHome = () => {
    const [isLoggedIn, setIsLoggedIn] = React.useState(false);

    // Simulate a login action
    const handleLogin = () => {
        setIsLoggedIn(true);
    };

    return (
        <>
        <AdminNavbar/>
        <AdminHomeComponent />
        <AdminFooter />
        </>
)
}

export default AdminHome;