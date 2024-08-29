import React from 'react'

interface FAQProps {
    title_button: string;
    title_body: string;
    body: string;
}

const FAQbutton: React.FC<FAQProps> = ({title_button, title_body, body}) => {
  return (
    <>
        <div className='w-[50%] h-full rounded-[30px] bg-white shadow-md pt-[48px] flex flex-col'>
            <div className='flex items-center w-full h-[71px] pl-10 border-t-2 border-b-2 border-purple-light hover:bg-purple-light hover:transition-[1s]'>
                <div className='text-[23px] w-[text-size]'>{title_button}</div>
            </div>
        </div>
        <div className='w-[50%] h-full'>
            <div className='flex flex-col w-full h-full p-10'>
                <div className='text-[23px] w-full mt-5'>{title_body}</div>
                <div className='text-[20px] w-full p-5'>{body}</div>
            </div>
        </div>
    </>

  )
}

export default FAQbutton