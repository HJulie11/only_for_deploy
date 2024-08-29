import React from 'react'

const InfoBoard = () => {
  return (
    <div className='flex flex-col center justify-center items-center'>
        <div className='center items-center'>
            <p className='font-semi-bold text-[40px] text-purple-heavy mb-5'>안내 게시판</p>
        </div>
        <div className='flex flex-col mb-5'>
            <div className='flex center items-center w-[920px] h-[74px] border-t-2 border-purple-light'>
                <div className='ml-10 text-[25px]'>게시 내용</div>
            </div>
            <div className='flex center items-center w-[920px] h-[74px] bg-purple-light'>
                <div className='ml-10 text-[25px]'>게시 내용</div>
            </div>
            <div className='flex center items-center w-[920px] h-[74px]'>
                <div className='ml-10 text-[25px]'>게시 내용</div>
            </div>
            <div className='flex center items-center w-[920px] h-[74px] bg-purple-light'>
                <div className='ml-10 text-[25px]'>게시 내용</div>
            </div>
            <div className='flex center items-center w-[920px] h-[74px] border-b-2 border-purple-light'>
                <div className='ml-10 text-[25px]'>게시 내용</div>
            </div>
        </div>
    </div>
  )
}

export default InfoBoard