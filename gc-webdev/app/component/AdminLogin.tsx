"use client"
import Link from 'next/link'
import React, { useContext, useState, ChangeEvent, FormEvent } from 'react'
import { storeContext } from '../context/storeContext'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { error } from 'console'

const AdminLogin: React.FC = () => {
  const { url, setToken } = useContext(storeContext)
  const router = useRouter()
  const [data, setData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState('')

  const onChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data => ({ ...data, [name]: value }))
  }

  const onLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const newUrl = `${url}/api/admin/login`;

    try {
      const response = await axios.post(newUrl, data)
      if (response.data.success) {
        setToken(response.data.token)
        localStorage.setItem('token', response.data.token)
        console.log('Token set in localStorage:', response.data.token)
        router.push('/adminhome')
      } else {
        alert(response.data.message)
      }
    } catch (error) {
      console.error('Login error:', error)
      setError('로그인 실패. 다시 시도해주세요.')
    }
  }

  return (
    <div className='flex flex-col center items-center justify-center h-[500px]'>
        <h1 className='text-4xl font-bold text-purple-heavy mb-5'>로그인 {/* Login */}</h1>
        <form onSubmit={onLogin} className='flex flex-col gap-4 lg:w-[500px]'>
            <input 
              type='email'
              name = 'email'
              placeholder='Email' 
              value = {data.email}
              onChange={onChangeHandler}
              className='p-2 border border-purple-light rounded' 
            />
            <input 
              type='password'
              name = 'password'
              placeholder='Password' 
              value = {data.password}
              onChange={onChangeHandler}
              className='p-2 border border-purple-light rounded' 
            />
            {error && <p className='text-red-500 text-sm'>{error}</p>}
            <button type="submit" className='bg-purple-heavy text-white font-bold p-2 rounded text-center'> 로그인 {/* Login */}</button>
            <div className='flex flex-row center justify-center'>
                <Link href="/adminregister" className='text-sm text-center'>
                    <p className='text-underline text-grey-light'> 관리자 등록 {/* Register admin */} </p>
                </Link>
            </div>
        </form>
    </div>
  )
}

export default AdminLogin