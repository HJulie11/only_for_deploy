import React from 'react'
import AdminNavbar from '../component/AdminNavbar'
import AdminMainLayout from '../component/AdminMainLayout'
import AdminAccount from '../component/AdminAccount'

const page = () => {
    return (
        <AdminMainLayout>
                <AdminAccount />
        </AdminMainLayout>
    )
}

export default page