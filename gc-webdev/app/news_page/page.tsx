import React from 'react'
import NewsCard_page from '../component/NewsCard_page'
import Navbar from '../component/Navbar'
import Footer from '../component/Footer'
import MainLayout from '../component/MainLayout'

const page = () => {
  return (
    <>
    <MainLayout>
      <div className='p-8 flex items-center justify-center'>
        <label htmlFor='check' className='flex bg-gray-100 cursor-pointer relative w-36 h-12 rounded-full'>
          <input type='checkbox' id='check' className='sr-only peer'/>
          <span className='absolute left-4 top-3.5 text-sm font-bold text-purple-heavy'>BBC</span>
          <span className='absolute right-4 top-3.5 text-sm font-bold text-purple-heavy'>CNN</span>
          <span className='w-2/5 h-4/5 bg-white absolute rounded-full left-1 top-1 peer-checked:left-20 transition-all duration-500'></span>
        </label>
      </div>
      <div className='flex center items-center justify-center mt-10 mb-10'>
          <div className='text-[30px] font-semi-bold text-purple-heavy'>뉴스</div>
      </div>
      <div className='flex mt-10 mb-10 ml-[170px] mr-[170px]'>
          <NewsCard_page />   
      </div>
    </MainLayout>
    </>
  )
}

export default page