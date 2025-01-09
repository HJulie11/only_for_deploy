import React, { useContext, useEffect, useState } from 'react';

const AdminHomeComponent: React.FC = () => {
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Update userEmail when user data is available
  useEffect(() => {
    const storedEmail = localStorage.getItem('email');
    if (storedEmail) {
      setUserEmail(storedEmail);
    }
  }, []);

  return (
    <div className='flex flex-col center items-center justify-center h-screen'>
        <h1 className='text-4xl font-bold text-purple-heavy mb-2'>Admin Home</h1>
        <p className='text-[23px] text-gray-30'>관리자 홈</p>

        <div className='flex flex-row center justify-center mt-10'>
          {userEmail?.trim() === "adminforall@example.com" ? (
            <>
              <a href="/usersall" className='w-[300px] h-[300px] rounded-lg shadow-md bg-white p-5 mr-10 hover:bg-gray-10'>
                  <h1 className='text-2xl font-bold text-purple-heavy mb-2'>전체 학생 관리</h1>
                  <p className='text-black'>학생 정보를 관리합니다.</p>
              </a>
              <a href="/adminsall" className='w-[300px] h-[300px] rounded-lg shadow-md bg-white p-5 mr-10 hover:bg-gray-10'>
                  <h1 className='text-2xl font-bold text-purple-heavy mb-2'>관리자 회원 관리</h1>
                  <p className='text-black'>관리자 회원 정보를 관리합니다.</p>
              </a>
              <a href="/adminaccount" className='w-[300px] h-[300px] rounded-lg shadow-md bg-white p-5 hover:bg-gray-10'>
                  <h1 className='text-2xl font-bold text-purple-heavy mb-2'>계정 정보</h1>
                  <p className='text-black'>계정 정보를 열람/관리합니다.</p>
              </a>
            </>
          ) : (
            <>
              <a href="/studentadmin" className='w-[300px] h-[300px] rounded-lg shadow-md bg-white p-5 mr-10 hover:bg-gray-10'>
                  <h1 className='text-2xl font-bold text-purple-heavy mb-2'>회원 관리</h1>
                  <p className='text-black'>학생 정보를 관리합니다.</p>
              </a>
              <a href="/adminaccount" className='w-[300px] h-[300px] rounded-lg shadow-md bg-white p-5 hover:bg-gray-10'>
                  <h1 className='text-2xl font-bold text-purple-heavy mb-2'>계정 정보</h1>
                  <p className='text-black'>계정 정보를 열람/관리합니다.</p>
              </a>
            </>
          )}
        </div>
    </div>
  );
};

export default AdminHomeComponent;
