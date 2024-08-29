"use client"
import React, { ChangeEvent, Dispatch, FormEvent, useContext, useState } from 'react'
import dynamic from 'next/dynamic'
import CSVReader from 'react-csv-reader';
import { useRouter } from 'next/navigation';
import { storeContext } from '../context/storeContext';
import axios from 'axios';

const DaumPostcode = dynamic(() => import('react-daum-postcode'), { ssr: false });

const AdminRegister: React.FC = () => {
    const { url, setToken } = useContext(storeContext);
    const router = useRouter();
    const [formData, setFormData] = useState({
        adminname: '', // 담당자 이름 (기관 총괄 관리자) {/* Manager's name (Institutional overall manager) */}
        email: '', // 이메일 (담당자 - 연락 가능한 이메일) {/* Email (Manager - Contactable email) */}
        password: '', // 비밀번호 {/* Password */}
        confirmPassword: '',
        mobilenumber: '', //전화번호 {/* Mobile number */}
        address: '', //기관 주소 {/* Institution address */}
        institute: '', //기관명 {/* Institution name */}
        group: '', //그룹명 {/* Group name */}
        studentlist: null as File | null, //등록 학생 {/* registered students */}
        groupadmin: null as File | null, //그룹 관리자 등록 {/* admins for each group registered */}
    });
    const [error, setError] = useState('');
    const [isPostcodeOpen, setIsPostcodeOpen] = useState(false);
    const [studentlistFile, setStudentlistFile] = useState<File | null>(null);
    const [groupadminFile, setGroupadminFile] = useState<File | null>(null);

    // const handleChange = (e : ChangeEvent<HTMLInputElement>) => {
    //     const name = e.target.name;
    //     const value = e.target.value;
    //     setFormData(data => ({ ...data, [name]: value }));
    // };
    const handleChange = (e : ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>, setFile: Dispatch<React.SetStateAction<File | null >>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };


    const handleComplete = (data: { address: any; addressType: string; bname: string; buildingName: string; }) => {
        let fullAddress = data.address;
        let extraAddress = '';

        if (data.addressType === 'R') {
            if (data.bname !== '') {
                extraAddress += data.bname;
            }
            if (data.buildingName !== '') {
                extraAddress += (extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName);
            }
            fullAddress += (extraAddress !== '' ? ` (${extraAddress})` : '');
        }

        setFormData({
            ...formData,
            address: fullAddress,
        });
        setIsPostcodeOpen(false);
    };

    // const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    //     if (e.target.files) {
    //         const file = e.target.files[0];
    //         const fileURL = URL.createObjectURL(file);
    //         setFormData({ ...formData, studentlist: fileURL });
    //         setFormData({ ...formData, groupadmin: fileURL });
    //     }
    // };

    const handleSubmit = async (e : FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const newUrl = `${url}/api/admin/register`;

        if (formData.password !== formData.confirmPassword) {
            setError('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
            return;
        }

        console.log('Form data:', formData);
        console.log('Request URL:', newUrl);

        const formDataToSend = new FormData();
        formDataToSend.append('adminname', formData.adminname);
        formDataToSend.append('email', formData.email);
        formDataToSend.append('password', formData.password);
        formDataToSend.append('mobilenumber', formData.mobilenumber);
        formDataToSend.append('address', formData.address);
        formDataToSend.append('institute', formData.institute);
        formDataToSend.append('group', formData.group);

        if (studentlistFile) {
            formDataToSend.append('studentlist', studentlistFile);
        }

        if (groupadminFile) {
            formDataToSend.append('groupadmin', groupadminFile);
        }

        try {
            // const response = await axios.post(newUrl, formData);
            const response = await axios.post(newUrl, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Response:', response);

            if (response.data.success) {
                setToken(response.data.token);
                localStorage.setItem('token', response.data.token);
                console.log('Token set in localStorage:', response.data.token);
                router.push('/adminhome');
            } else {
                setError(response.data.message);
            }
        } catch (error) {
            console.error('Register error:', error);
            setError('회원가입 실패. 다시 시도해주세요.');
        }

    };

    return (
        <div className="flex items-center justify-center w-screen h-screen overflow:mt-[7rem] overflow:mb-[7rem]">
            <div className="flex flex-col w-[60%]">
                <h2 className="text-4xl font-bold mb-[4rem] text-center text-purple-heavy">관리자 등록</h2>
                <form onSubmit={handleSubmit}>
                    <div className='flex flex-row mb-4 w-full'> {/* 기관명, 담당자 이름 */}
                        <div className="w-[50%] pr-5"> {/* 담당자 이름 */}
                            <label className="block text-[18px] mb-2" htmlFor="adminname">
                                담당자 이름 {/*Name*/}
                            </label>
                            <input
                                id="adminname"
                                name="adminname"
                                type="text"
                                value={formData.adminname}
                                onChange={handleChange}
                                required
                                className="appearance-none border-1 shadow-sm rounded py-2 px-3 text-gray-90 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>
                        <div className='w-[50%] px-5'> {/* 기관 이름 */}
                            <label className="block text-[18px] mb-2" htmlFor="institute">
                                기관 이름 {/* Institue name */}
                            </label>
                            <input
                                id="institute"
                                name="institute"
                                type="institute"
                                value={formData.institute}
                                onChange={handleChange}
                                required
                                className="appearance-none border-1 shadow-sm rounded py-2 px-3 text-gray-90 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>
                    </div>
                    <div className='flex flex-row mb-4 w-full'> {/* 담당자 연락처 - 이메일, 전화번호 */}
                        <div className="w-[50%] pr-5"> {/* 이메일 */}
                            <label className="block text-[18px] mb-2" htmlFor="email">
                                이메일 {/*Email*/}
                                <span className="text-[15px] text-gray-20"> (연락 가능한 이메일로 작성해주세요.) {/* Manager - Contactable email */}</span>
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="appearance-none border-1 shadow-sm w-full rounded py-2 px-3 text-gray-90 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>
                        <div className="w-[50%] px-5">
                            <label className="block text-[18px] mb-2" htmlFor="mobilenumber">
                                전화번호 {/*mobile number*/}
                                <span className="text-sm text-gray-20"> (01012345678 형태로 기입 - 번호만 기입) {/* only numbers */}</span>
                            </label>
                            <input
                                id="mobilenumber"
                                name="mobilenumber"
                                type="text"
                                value={formData.mobilenumber}
                                onChange={handleChange}
                                required
                                className="appearance-none border-1 shadow-sm rounded w-full py-2 px-3 text-gray-90 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>
                    </div>
                    
                    <div className="mb-4"> {/* 비밀번호 */}
                        <label className="block text-[18px] mb-2" htmlFor="password">
                            비밀번호 {/*Password*/}
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="appearance-none border-1 shadow-sm rounded w-[40%] py-2 px-3 text-gray-90 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div className="mb-4"> {/* 비밀번호 확인 */}
                        <label className="block text-[18px] mb-2" htmlFor="confirmPassword">
                            비밀번호 확인 {/*Confirm Password*/}
                        </label>
                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            className="appearance-none border-1 shadow-sm rounded w-[40%] py-2 px-3 text-gray-90 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    {error && (
                        <div className="mb-4 text-red-500">
                            {error}
                        </div>
                    )}
                    
                    <div className='mb-4'> {/* 주소 */}
                        <label className="block text-[18px] mb-2" htmlFor="address">주소: {/* address */} </label>
                        <input 
                            id="address" 
                            type="text" 
                            name="address" 
                            value={formData.address} 
                            onChange={handleChange} 
                            readOnly required
                            className="appearance-none border-1 shadow-sm rounded w-[40%] py-2 px-3 text-gray-90 leading-tight focus:outline-none focus:shadow-outline"
                        />
                        <button type="button" className="ml-5 bg-gray-10 text-black text-[15px] py-2 px-4" onClick={() => setIsPostcodeOpen(true)}>주소 찾기 {/* find address */}</button>
                    </div>
                    {isPostcodeOpen && (
                        <DaumPostcode
                            onComplete={handleComplete}
                            autoClose={false}
                            style={{ width: '100%', height: '400px' }}
                        />
                    )}
                    <div className='mb-4'> {/* 학생 파일 업로드 */}
                        <label className="block text-[18px] mb-2" htmlFor="registerStudents">학생 등록하기: <span className='text-[15px] text-gray-20'> 학생 정보를 업로드하려면 CSV 파일을 업로드하십시오. {/* Upload a CSV file to upload student information. */}</span></label>
                        {/* <CSVReader inputName="registerStudent" onFileLoaded={handleFileLoad} /> */}
                        <input
                            type="file"
                            id="registerStudents"
                            name="studentlist"
                            accept=".csv"
                            onChange={(e) => handleFileChange(e, setStudentlistFile)}
                        />
                    </div>
                    <div className='mb-4'> {/* 그룹 관리자 파일 업로드 */}
                        <label className="block text-[18px] mb-2" htmlFor="registerAdmins">그룹별 관리자 등록하기: <span className='text-[15px] text-gray-20'> 그룹별 관리자 정보를 업로드하려면 CSV 파일을 업로드하십시오. {/* Upload a CSV file to upload student information. */}</span></label>
                        {/* <CSVReader inputName="registerAdmins" onFileLoaded={handleFileLoad} /> */}
                        <input
                            type="file"
                            id="registerAdmins"
                            name="groupadmin"
                            accept=".csv"
                            onChange={(e) => handleFileChange(e, setGroupadminFile)}
                        />
                    </div>
                    <div className="mt-10 mb-6">
                        <button
                            type="submit"
                            className="bg-purple-heavy text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                        >
                            관리자로 등록하기 {/* Register; go to login page when the form is filled completely */}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AdminRegister