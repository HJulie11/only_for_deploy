import React from 'react'
// TODO: make props interface to get different progress bars

const NewsCard_page = () => {
  return (
    <>
    <a href='dummyurl' className='flex flex-col w-[320px] shadow-md mr-5 mb-5 rounded-lg'>
            <div className='w-[320px] h-[180px] rounded-top-right-lg round-top-left-lg'>
                <img src='dummysource' alt='newstitle' width={320} height={180} />
            </div>
            <div className='w-[300px] flex flex-col'>
                <div className='font-semi-bold text-[20px] ml-5 mt-5'>News title</div>
                <div className='w-[250px] h-[10px] rounded-full bg-gray-30 mt-5 ml-5'></div>
                <div className='text-[15px] ml-5 mt-5 mb-5'>Not started</div>
            </div>
    </a>
    
    </>
  )
}

export default NewsCard_page