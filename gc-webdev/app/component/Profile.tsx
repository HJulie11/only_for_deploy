// pages/profile.tsx
"use client"
import React, { useEffect, useState, useContext, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { storeContext } from '../context/storeContext';
import LocalStorage from '@/constants/localstorage';
import { da } from 'date-fns/locale';
import { input } from '@nextui-org/theme';

const Profile: React.FC = () => {
  const { url, setToken } = useContext(storeContext);
  const router = useRouter();
  const [image, setImage] = useState('');
  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
    dateofbirth: '',
    mobilenumber: '',
    gender: '',
    address: '',
    institute: '',
    group: '',

  });

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    setData((prevData) => ({...prevData, [name]: value}));
  
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('Token is missing');
          return;
        }
        
        const response = await axios.get(`${url}/api/user/myaccount`, { 
          headers: { 'token': token },
        });
        
        console.log('Response data:', response.data); // Debugging line
  
        const userData = {
          name: response.data.name,
          email: response.data.email,
          password: response.data.password,
          dateofbirth: response.data.dateofbirth,
          mobilenumber: response.data.mobilenumber,
          gender: response.data.gender,
          address: response.data.address,
          institute: response.data.institute,
          group: response.data.group,
          image: response.data.image,
        };
  
        setData(userData);
        setImage(userData.image || '');
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
  
    fetchData();
  }, []);
  

  const onSubmitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try { 
      const formData = new FormData();
      Object.keys(data).forEach((key) => formData.append(key, data[key as keyof typeof data]));

      if (image) {
        formData.append('image', image);
        const response = await axios.put(`${url}/user/updateProfile`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        alert('Profile updated successfully');
        window.location.reload();
      } 
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  }

  return (
    <div className='flex center items-center justify-center p-20 bg-purple-light'>
      <div className = 'flex flex-row w-full h-full bg-white shadow-lg rounded-[5px] p-20'>
        <div className = 'flex flex-col center items-center justify-center w-[30%] h-full p-3'>
          <div className='w-[60%] h-[200px] rounded-full bg-purple-light'>
            <label htmlFor='image'>
              <img src={image ? (typeof image === 'object' ? URL.createObjectURL(image) : `${url}/images/${image}`) : ''} className='w-full h-full rounded-full' />
            </label>
          </div>
          <label htmlFor='image' style={{cursor: 'pointer'}}>
            <div className='text-center text-[15px] underline text-purple-heavy mt-3'> 수정 {/** Translation: Upload Profile Picture */}</div>
          </label>
          <input onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              setImage(file.name);
            }
          }} type='file' id='image' className='mt-3 ' style={{display: 'none'}}/>
          {/* <div className='mt-5 flex flex-row center items-center justify-center'>
            < className='regular-24 mr-2'>{user.name}</h1>
            <button className='text-purple-heavy text-[20px]'>✐</button>
          </div> */}
          <div className='mt-5 flex flex-row center items-center justify-center'>
            <h1 className='regular-24 mr-2'>Welcome, <span className='font-bold text-purple-heavy'>@{data.name}</span>!</h1>
          </div>
        </div>
        
        <div className='flex flex-col center items-center justify-center w-[70%] h-full p-10'>
          <form className='flex flex-col w-full ' onSubmit={onSubmitHandler} autoComplete='off'>
            <div className='mt-0 ml-0 text-[25px] font-bold text-purple-heavy'>
              개인정보 {/** Translation: Personal Information */}
            </div>
            <div className='flex flex-col mt-5 text-[15px]'>
              <div className='flex flex-row items-center mb-3'>
                <div className='w-[45%] ml-0'>이름 {/** Translation: Name */}</div>
                {/* <input className="w-[45%] mr-0 rounded flexible-input" autoComplete='off' type='text' name='name' value={data.name} onChange={onChangeHandler} required/> */}
                <div className='w-[45%] mr-0 flexible-input text-gray-50'>{data.name}</div>
              </div>
              <div className='flex flex-row items-center mb-3'>
                <div className='w-[45%] ml-0'>이메일 {/** Translation: Email */}</div>
                {/* <input className="w-[45%] mr-0 rounded flexible-input" autoComplete='off' type='text' name='email' value={data.email} onChange={onChangeHandler} required/> */}
                <div className='w-[45%] mr-0 flexible-input text-gray-50'>{data.email}</div>
              </div>
              <div className='flex flex-row items-center mb-3'>
                <div className="w-[45%] ml-0">비밀번호 {/** Translation: Password */}</div>
                {/* <input className="w-[45%] mr-0 rounded flexible-input" autoComplete='off' type='password' name='password' onChange={onChangeHandler} required/> */}
              </div>
              <div className='flex flex-row items-center mb-3'>
                <div className="w-[45%] ml-0">생년월일 {/** Translation: dateofbirth */}</div>
                {/* <input className="w-[45%] mr-0 rounded flexible-input" autoComplete='off' type='dateofbirth' name='dateofbirth' value={data.dateofbirth} onChange={onChangeHandler} required/> */}
                <div className='w-[45%] mr-0 flexible-input text-gray-50'>{data.dateofbirth}</div>
              </div>
              <div className='flex flex-row items-center mb-3'>
                <div className="w-[45%] ml-0">전화번호 {/** Translation: mobilenumber */}</div>
                {/* <input className="w-[45%] mr-0 rounded flexible-input" autoComplete='off' type='mobilenumber' name='mobilenumber' value={data.mobilenumber} onChange={onChangeHandler} required/> */}
                <div className='w-[45%] mr-0 flexible-input text-gray-50'>{data.mobilenumber}</div>
              </div>
              <div className='flex flex-row items-center mb-3'>
                <div className="w-[45%] ml-0">성별 {/** Translation: gender */}</div>
                {/* <input className="w-[45%] mr-0 rounded flexible-input" autoComplete='off' type='gender' name='gender' value={data.gender} onChange={onChangeHandler} required/> */}
                <div className='w-[45%] mr-0 flexible-input text-gray-50'>{data.gender}</div>
              </div>
              <div className='flex flex-row items-center mb-3'>
                <div className="w-[45%] ml-0">주소 {/** Translation: address */}</div>
                {/* <input className="w-[45%] mr-0 rounded flexible-input" autoComplete='off' type='address' name='address' value={data.address} onChange={onChangeHandler} required/> */}
                <div className='w-[45%] mr-0 flexible-input text-gray-50'>{data.address}</div>
              </div>
              {/* institue and group appear only if they are in one */}
              {data.institute && (
                <div className='flex flex-row items-center mb-3'>
                  <div className="w-[45%] ml-0">소속 {/** Translation: institute */}</div>
                  {/* <input className="w-[45%] mr-0 rounded flexible-input" autoComplete='off' type='text' name='institute' value={data.institute} onChange={onChangeHandler} disabled/> */}
                  <div className='w-[45%] mr-0 flexible-input text-gray-50'>{data.institute}</div>
                </div>
              )}
              {data.group && (
                <div className='flex flex-row items-center mb-3'>
                  <div className="w-[45%] ml-0">그룹 {/** Translation: group */}</div>
                  {/* <input className="w-[45%] mr-0 rounded flexible-input" autoComplete='off' type='text' name='group' value={data.group} onChange={onChangeHandler} disabled/> */}
                  <div className='w-[45%] mr-0 flexible-input text-gray-50'>{data.group}</div>
                </div>
              )}
            </div>
            <div className='w-full flex justify-center'>
              {/* profile update button activated only if there is any changes otherwise, not activated but still visible as faded out component*/}
              <button type="submit" className='w-[70%] h-[50px] mt-5 bg-gray-10 hover:bg-purple-heavy text-white rounded-lg' style={{transition: '0.2s ease' }}>프로필 업데이트 {/** Translation: Update Profile */}</button>
            </div>
          </form>
          <div className="flex flex-col w-full mt-10">
            <div className='mt-0 ml-0 text-[25px] font-bold text-purple-heavy'>
              이용 정보 {/** Translation: Usage Information */}
            </div>
            {/* <div className='flex center items-center ml-0'> */}
            <div className='flex flex-row w-full h-[200px] border-t-1 border-b-1 mt-5 items-center'>
              <div className="w-[15%] flex center items-center justify-center">
                <input type='checkbox' />
              </div>
              <div className='ml-3 mr-3 w-[85%] flex flex-col'>
                <div className = 'mb-5 flex flex-row'>
                  <div className='flex flex-col w-[60%] items-center'>
                    <div className='relative w-full font-bold text-[30px]'>
                      <p style={{
                        position: 'absolute',
                        left: 0,
                        margin: 0
                      }}>
                        Plan Name
                      </p>
                    </div>
                    <div className='relative w-full text-[15px] mt-10 text-gray-30'>
                      <p style={{
                        position: 'absolute',
                        left: 0,
                        margin: 0
                      }}>
                        Start date ~ End date
                      </p>
                    </div>
                  </div>
                  <div className='flex items-center w-[40%]'>
                    <div className='relative w-full text-[20px]'>
                      <p style={{
                        position: 'absolute',
                        right: 0,
                        margin: 0
                      }}>
                        Plan cost
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
