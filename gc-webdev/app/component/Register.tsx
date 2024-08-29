"use client";
import { useState, useContext, ChangeEvent, FormEvent } from 'react';
import dynamic from 'next/dynamic';
import { storeContext } from '../context/storeContext';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { group } from 'console';

// Dynamically import DaumPostcode
const DaumPostcode = dynamic(() => import('react-daum-postcode'), { ssr: false });

const Register: React.FC = () => {
  const { url, setToken } = useContext(storeContext);
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    dateofbirth: '',
    mobilenumber: '',
    gender: '',
    address: '',
  });
  const [error, setError] = useState('');
  const [isPostcodeOpen, setIsPostcodeOpen] = useState(false);

//   console.log('Register URL:', url);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    setFormData(data => ({ ...data, [name]: value }));
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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newUrl = `${url}/api/user/register`;

    if (formData.password !== formData.confirmPassword) {
      setError('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
      return;
    }

    console.log('Form data:', formData);
    console.log('Request URL:', newUrl);

    try {
      const response = await axios.post(newUrl, formData);
      console.log('Response:', response);

      if (response.data.success) {
        setToken(response.data.token);
        localStorage.setItem('token', response.data.token);
        console.log('Token set in localStorage:', response.data.token);
        router.push('/');
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      console.error('Register error:', error);
      setError('회원가입 실패. 다시 시도해주세요.');
    }
  };

  return (
    <div className="flex items-center justify-center w-screen mt-[7rem] mb-[7rem]">
      <div className="flex flex-col w-[60%]">
        <h2 className="text-4xl font-bold mb-[4rem] text-center text-purple-heavy">회원가입</h2>
        <form onSubmit={handleSubmit}>
          <div className="ml-0 mb-4">
            <label className="block text-[18px] mb-2" htmlFor="name">
              이름 {/* Name */}
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
              className="appearance-none border-1 shadow-sm rounded w-[30%] py-2 px-3 text-gray-90 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label className="block text-[18px] mb-2" htmlFor="email">
              이메일 {/* Email */}
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="appearance-none border-1 shadow-sm rounded w-[40%] py-2 px-3 text-gray-90 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label className="block text-[18px] mb-2" htmlFor="password">
              비밀번호 {/* Password */}
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
          <div className="mb-4">
            <label className="block text-[18px] mb-2" htmlFor="confirmPassword">
              비밀번호 확인 {/* Confirm Password */}
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
          <div className="mb-4">
            <label className="block text-[18px] mb-2" htmlFor="dateOfBirth">
              생년월일 {/* Date of Birth */}
              <span className="text-sm text-gray-20"> (2000.01.01 형태로 기입) {/* write in yyyy.mm.dd format */}</span>
            </label>
            <input
              id="dateofbirth"
              name="dateofbirth"
              type="text"
              value={formData.dateofbirth}
              onChange={handleChange}
              required
              className="appearance-none border-1 shadow-sm rounded w-[40%] py-2 px-3 text-gray-90 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label className="block text-[18px] mb-2" htmlFor="gender">
              성별 {/* gender */}
            </label>
            <input
              id="male"
              name="gender"
              type="radio"
              value="male"
              checked={formData.gender === 'male'}
              onChange={handleChange}
              className="mr-2"
            />
            <label htmlFor="male" className="mr-4">남 {/* male */} </label>
            <input
              id="female"
              name="gender"
              type="radio"
              value="female"
              checked={formData.gender === 'female'}
              onChange={handleChange}
              className="mr-2"
            />
            <label htmlFor="female" className="mr-4">여 {/* female */}</label>
            <input
              id="other"
              name="gender"
              type="radio"
              value="other"
              checked={formData.gender === 'other'}
              onChange={handleChange}
              className="mr-2"
            />
            <label htmlFor="other">기타 {/* other */}</label>
          </div>
          <div className="mb-4">
            <label className="block text-[18px] mb-2" htmlFor="mobileNumber">
              전화번호 {/* mobile number */}
              <span className="text-sm text-gray-20"> (01012345678 형태로 기입 - 번호만 기입) {/* only numbers */}</span>
            </label>
            <input
              id="mobilenumber"
              name="mobilenumber"
              type="text"
              value={formData.mobilenumber}
              onChange={handleChange}
              required
              className="appearance-none border-1 shadow-sm rounded w-[40%] py-2 px-3 text-gray-90 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className='mb-4'>
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
            <button type="button" className="ml-5 bg-gray-10 text-black text-[15px] py-2 px-4 rounded" onClick={() => setIsPostcodeOpen(true)}>주소 찾기 {/* find address */}</button>
          </div>
          {isPostcodeOpen && (
            <DaumPostcode
              onComplete={handleComplete}
              autoClose={false}
              style={{ width: '100%', height: '400px' }}
            />
          )}
          <div className="mt-10 mb-6">
            <button
              type="submit"
              className="bg-purple-heavy text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            >
              회원가입 {/* Register; go to login page when the form is filled completely */}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;