import React from 'react'
import AdminNavbar from '../component/AdminNavbar'
import AdminMainLayout from '../component/AdminMainLayout'
import AdminHome from '../component/AdminHome'
import StudentAdmin from '../component/StudentAdmin'

const page = () => {
    return (
        <AdminMainLayout>
            <StudentAdmin/>
        </AdminMainLayout>
    )
}

export default page