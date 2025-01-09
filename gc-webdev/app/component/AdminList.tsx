"use client";
import React, { useEffect, useState, useContext } from 'react';
import { Switch } from '@nextui-org/switch';
import { storeContext } from '../context/storeContext';

// const fetchUsers = async (url: string) => {
//     try {
//         const response = await fetch(`${url}/api/admin/getallusers`);
//         const data = await response.json();
//         if (Array.isArray(data)) {
//             return data;
//         } else {
//             console.error('Expected an array but got:', data);
//             return [];
//         }
//     } catch (error) {
//         console.error('Error fetching users:', error);
//         return [];
//     }
// };

interface User {
    adminname: '',
    email: '',
    mobilenumber: '',
    address: '',
    position: '',
    registerDate: '',
    institute: '',
    group: '',
    studentlist: [],
    studentnumber: 0,
    groupadmin: []
}

const AdminList = () => {
    const { url } = useContext(storeContext);
    const [users, setUsers] = useState<User[]>([]);
    const [error, setError] = useState(null);

    // useEffect(() => {
    //     const loadUsers = async () => {
    //         const data = await fetchUsers(url);
    //         setUsers(data);
    //     };
    //     loadUsers();
    // }, [url]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch(`${url}/api/admin/getalladmins`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch users, status: ${response.status}`);
            }

            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
            setError((error as any).message);
        }
    };

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className='flex flex-col center items-center p-10'>
            <div className='center items-center text-center'>
                <p className='font-bold text-[30px] text-purple-heavy mb-5'>전체 관리자 관리</p>
                <p className='text-[23px] text-gray-30 mb-2 center text-center'>Admin list</p>
            </div>

            <div className='flex flex-row w-[85%] center items-center px-1 bottom-align'>
                <div className='w-[30%] left-align'>
                    <Switch defaultSelected color="primary" className='mb-2 mt-5 text-[15px] center items-center' size="sm">
                        그룹별 {/* Translation: sort by group */}
                    </Switch>
                </div>

                <div className='w-[50%]'></div>

                <div className='flex flex-row w-[20%]'>
                    <div className='grid w-[50%] pr-0 justify-end bottom-align'>
                        <a className='text-purple-heavy text-[15px]'>+</a>
                    </div>
                    <div className='grid w-[50%] pr-0 justify-end bottom-align'>
                        <a className='text-gray-30 text-[15px]'>⌫</a>
                    </div>
                </div>
            </div>

            <div className='w-[85%] items-center overflow-x-auto whitespace-nowrap'>
                <table className='w-full'>
                    <thead className='bg-gray-10'>
                        <tr>
                            <td className='px-2 pt-3 pb-2 text-[15px]'>이름 {/* name */}</td>
                            <td className='px-2 pt-3 pb-2 text-[15px]'>이메일 {/* email address */}</td>
                            <td className='px-2 pt-3 pb-2 text-[15px]'>전화번호 {/* mobile number */}</td>
                            <td className='px-2 pt-3 pb-2 text-[15px]'>주소 {/* address */}</td>
                            <td className='px-2 pt-3 pb-2 text-[15px]'>직책 {/* position */}</td>
                            <td className='px-2 pt-3 pb-2 text-[15px]'>등록일 {/* register date */}</td>
                            <td className='px-2 pt-3 pb-2 text-[15px]'>기관 {/* institute */}</td>
                            <td className='px-2 pt-3 pb-2 text-[15px]'>그룹 {/* group */}</td>
                            <td className='px-2 pt-3 pb-2 text-[15px]'>학생 수 {/* group */}</td>

                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr key={index} className='border-b-1 border-gray-10'>
                                <td className='px-2 pt-3 pb-2 border-r-1 border-l-1 border-gray-10 text-[15px]'>{user.adminname}</td>
                                <td className='px-2 pt-3 pb-2 border-r-1 border-gray-10 text-[15px]'>{user.email}</td>
                                <td className='px-2 pt-3 pb-2 border-r-1 border-gray-10 text-[15px]'>{user.mobilenumber}</td>
                                <td className='px-2 pt-3 pb-2 border-r-1 border-gray-10 text-[15px]'>{user.address}</td>
                                <td className='px-2 pt-3 pb-2 border-r-1 border-gray-10 text-[15px]'>{user.position}</td>
                                <td className='px-2 pt-3 pb-2 border-r-1 border-gray-10 text-[15px]'>{user.registerDate}</td>
                                <td className='px-2 pt-3 pb-2 border-r-1 border-gray-10 text-[15px]'>{user.institute}</td>
                                <td className='px-2 pt-3 pb-2 border-r-1 border-gray-10 text-[15px]'>{user.group}</td>
                                <td className='px-2 pt-3 pb-2 border-r-1 border-gray-10 text-[15px]'>{user.studentnumber}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminList;
