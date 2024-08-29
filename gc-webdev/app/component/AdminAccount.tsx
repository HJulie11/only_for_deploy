"use client"
import React, { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { storeContext } from '../context/storeContext'
import LocalStorage from '@/constants/localstorage'

const AdminAccount = () => {
    const [position, setPosition] = useState(0);
    const { url, setToken } = useContext(storeContext);
    const router = useRouter();
    const [data, setData] = useState({
        adminname: '',
        email: '',
        password: '',
        mobilenumber: '',
        address: '',
        position: '',
        registerDate: '',
        institute: '',
        group: '',
        studentlist: '',
        studentnumber: 0,
        groupadmin: ''
    });
    // useEffect(() => {
    //     const handleScroll = () => {
    //         setPosition(window.scrollY);
    //     };
        
    //     window.addEventListener('scroll', handleScroll);
        
    //     return () => {
    //         window.removeEventListener('scroll', handleScroll);
    //     };
    // }, []);
    useEffect (() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.error('Token not found');
                    return;
                }
    
                const response = await axios.get(`${url}/api/admin/myaccount`, {
                    headers: {
                        'token': token
                    },
                });
    
                console.log('Response data:', response.data);
    
                const adminData = {
                    adminname: response.data.adminname,
                    email: response.data.email,
                    password: response.data.password,
                    mobilenumber: response.data.mobilenumber,
                    address: response.data.address,
                    position: response.data.position,
                    registerDate: response.data.registerDate,
                    institute: response.data.institute,
                    group: response.data.group,
                    studentlist: response.data.studentlist,
                    studentnumber: response.data.studentnumber,
                    groupadmin: response.data.groupadmin
                }
    
                setData(adminData);
                //image
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        }
        fetchData();
    }, []);

    //onsubmithandler

    return (
        <div className='flex flex-col center items-center p-10'>
            <div className='flex flex-col center justify-start w-[75%] ml-0'>
                <h1 className='text-4xl font-bold text-purple-heavy mb-2'>@{data.adminname} <span className='text-4xl font-bold text-gray-20 mb-2'>님의 계정</span></h1>
                <p className='text-[23px] text-gray-30'>Admin Profile</p>
            </div>
            <div className='flex flex-row center justify-center w-[80%] ml-0 mt-10'>
                <div className='flex flex-col w-[35%] p-2'>
                    <div className='flex flex-col center items-center justify-center w-full'>
                        <div className='w-[100px] h-[100px] bg-gray-20 rounded-full'>
                        </div>
                        <div className='mt-5 flex flex-row center items-center justify-center'>
                            <h1 className='text-purple-heavy text-[20px] mr-2'>{data.adminname}</h1>
                            <button className='text-gray-30 text-[20px]'>✐</button>
                        </div>
                        <div className='text-[14px] text-gray-30 mt-2'>{/* TODO */}가입일자: {data.registerDate} {/* registration date */}</div>
                    </div>
                </div>
                <div className='w-[65%] p-3'>
                    <div>
                        <div className='mt-0 ml-0 text-[25px] font-bold text-purple-heavy'>
                            계정 정보 {/** Translation: account Information */}
                        </div>
                        <table className='w-full mt-5 ml-5 text-[18px]'>
                            <tbody>
                                <tr>
                                    <td className='mb-5 w-[30%] p-3 ml-0 text-gray-50'>사용자 ID {/* TODO: User ID */}</td>
                                    <td className='mb-5 w-[70%] p-3 ml-0'>abcd03$$</td>
                                </tr>
                                <tr>
                                    <td className='mb-5 w-[30%] p-3 ml-0 text-gray-50'>비밀번호 {/** Password */}</td>
                                    <td className='mb-5 w-[70%] p-3 ml-0'>
                                        <button className='text-purple-middle underline text-[18px]'>비밀번호 변경 {/** Change password */}</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className='mt-10'>
                        <div className='mt-0 ml-0 text-[25px] font-bold text-purple-heavy'>
                            가입 정보 {/** Translation: user Information */}
                        </div>
                        <table className='w-full mt-5 ml-5 text-[18px]'>
                            <tbody>
                                <tr>
                                    <td className='mb-5 w-[30%] p-3 ml-0 text-gray-50'>기관이름{/** institute Name */}</td>
                                    <td className='mb-5 w-[70%] p-3 ml-0'>{data.institute}</td>
                                </tr>
                                <tr>
                                    <td className='mb-5 w-[30%] p-3 ml-0 text-gray-50'>직책{/** TODO: position */}</td>
                                    <td className='mb-5 w-[70%] p-3 ml-0'>{data.position}</td>
                                </tr>
                                <tr>
                                    <td className='mb-5 w-[30%] p-3 ml-0 text-gray-50'>담당자 이름{/** person in charge (institute admin) Name */}</td>
                                    <td className='mb-5 w-[70%] p-3 ml-0'>{data.adminname}</td>
                                </tr>
                                <tr>
                                    <td className='mb-5 w-[30%] p-3 ml-0 text-gray-50'>담당자 전화번호 {/** Phone number (contact)*/}</td>
                                    <td className='mb-5 w-[70%] p-3 ml-0'>{data.mobilenumber}</td>
                                </tr>
                                <tr>
                                    <td className='mb-5 w-[30%] p-3 ml-0 text-gray-50'>이메일 {/** Email */}</td>
                                    <td className='mb-5 w-[70%] p-3 ml-0'>{data.email}</td>
                                </tr>
                                <tr>
                                    <td className='mb-5 w-[30%] p-3 ml-0 text-gray-50'>주소 {/** Address */}</td>
                                    <td className='mb-5 w-[70%] p-3 ml-0'>{data.address}</td>
                                </tr>
                                <tr>
                                    <td className='mb-5 w-[30%] p-3 ml-0 text-gray-50'>가입학생 수 {/** number of student registered*/}</td>
                                    <td className='flex flex-row w-[70%] p-3'><div>{data.studentnumber}</div><a href='\studentadmin' className='flex text-[15px] text-gray-30 ml-5 center items-center'> ▶︎ 학생 관리 바로가기 {/* go to student admin page */}</a> </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminAccount