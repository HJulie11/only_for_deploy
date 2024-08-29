import Image from 'next/image'
import React from 'react'
import dication_screenshot from '@/public/dictation example.png'
import correction_screenshot from '@/public/correction example.png'
import read_out_loud_screenshot from '@/public/read out loud example.png'

const How_it_works = () => {
  return (
    <div className='flex flex-col center justify-center items-center'>
      <div className='center items-center'>
        <p className='font-semi-bold text-[40px] text-purple-heavy mb-5'>How does it work?</p>
      </div>
      <div className='flex flex-col center items-center mb-5'>
        <div className='center rounded-full bg-purple-light w-[262px] h-[56px]'>
          <div className='flex justify-center items-center rounded-full bg-purple-light w-[262px] h-[56px]'>
            <div className='font-semi-bold text-[23px] text-white'>DICTATION</div>
          </div>
        </div>
        <div className='flex flex-col center items-center'>
          <div className='w-full h-[10px]'></div>
          <Image src={dication_screenshot} alt='dication_screenshot' />
        </div>
      </div>
      <div className='flex flex-col center items-center mb-5'>
        <div className='center rounded-full bg-purple-light w-[262px] h-[56px]'>
          <div className='flex justify-center items-center rounded-full bg-purple-middle w-[262px] h-[56px]'>
            <div className='font-semi-bold text-[23px] text-white'>CORRECTION</div>
          </div>
        </div>
        <div className='flex flex-col center items-center'>
          <div className='w-full h-[10px]'></div>
          <Image src={correction_screenshot} alt='correction_screenshot' />
        </div>
      </div>
      <div className='flex flex-col center items-center mb-5'>
        <div className='center rounded-full bg-purple-light w-[262px] h-[56px]'>
          <div className='flex justify-center items-center rounded-full bg-purple-heavy w-[262px] h-[56px]'>
            <div className='font-semi-bold text-[23px] text-white'>READ OUT LOUD</div>
          </div>
        </div>
        <div className='flex flex-col center items-center'>
          <div className='w-full h-[10px]'></div>
          <Image src={read_out_loud_screenshot} alt='read_out_loud_screenshot'/>
        </div>
      </div>
    </div>
  )
}

export default How_it_works