import React from 'react'
import AdminMainLayout from '../component/AdminMainLayout'
import UserList from '../component/UserList'


const page = () => {
  return (
    <AdminMainLayout>
        <UserList/>
    </AdminMainLayout>
  )
}

export default page