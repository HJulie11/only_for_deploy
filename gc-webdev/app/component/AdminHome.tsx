import React from 'react'

const AdminHome = () => {
  return (
    <div className='flex flex-col center items-center justify-center h-screen'>
        <h1 className='text-4xl font-bold text-purple-heavy mb-2'>Admin Home</h1>
        <p className='text-[23px] text-gray-30'>관리자 홈</p>

        <div className='flex flex-row center justify-center mt-10'>
            <a href="\studentadmin" className='w-[300px] h-[300px] rounded-lg shadow-md bg-white p-5 mr-10 hover:bg-gray-10'>
                <h1 className='text-2xl font-bold text-purple-heavy mb-2'>회원 관리</h1>
                <p className='text-black'>학생 정보를 관리합니다.</p>
            </a>
            <a href="\adminaccount" className='w-[300px] h-[300px] rounded-lg shadow-md bg-white p-5 hover:bg-gray-10'>
                <h1 className='text-2xl font-bold text-purple-heavy mb-2'>계정 정보</h1>
                <p className='text-black'>계정 정보를 열람/관리합니다.</p>
            </a>
        </div>
    </div>
  )
}

export default AdminHome