import React from 'react'

interface FAQProps {
    title_button: string;
    title_body: string;
    body: string;
}

const FAQ = () => {
  return (
    <div className='flex flex-col center justify-center items-center mb-5'>
        <div className='center items-center'>
            <p className='font-semi-bold text-[40px] text-purple-heavy mb-5'>Frequenty Asked questions</p>
        </div>
        <div className='center items-center mb-5'>
            <div className='flex flex-row center items-center rounded-[30px] bg-gray-light w-[920px] h-[518px] shadow-sm'>
                <div className='w-[50%] h-full rounded-[30px] bg-white shadow-md pt-[48px] flex flex-col center items-center'>
                    <div className='flex items-center w-[95%] h-[71px] pl-10 border-t-[1px] border-b-[1px] border-purple-light hover:bg-purple-light hover:transition-[1s]'>
                        <div className='text-[23px] w-[text-size]'>Dictation이 뭔가요?</div>
                    </div>
                    <div className='flex items-center w-[95%] h-[71px] pl-10 border-b-[1px] border-purple-light hover:bg-purple-light hover:transition-[1s]'>
                        <div className='text-[23px] w-[text-size]'>어떻게 학습하나요?</div>
                    </div>
                    <div className='flex items-center w-[95%] h-[71px] pl-10 border-b-[1px] border-purple-light hover:bg-purple-light hover:transition-[1s]'>
                        <div className='text-[23px] w-[text-size]'>이 학습법의 효과는 뭔가요?</div>
                    </div>
                    <div className='flex items-center w-[95%] h-[71px] pl-10 border-b-[1px] border-purple-light hover:bg-purple-light hover:transition-[1s]'>
                        <div className='text-[23px] w-[text-size]'>음원 업로드</div>
                    </div>
                    <div className='flex items-center w-[95%] h-[71px] pl-10 border-b-[1px] border-purple-light hover:bg-purple-light hover:transition-[1s]'>
                        <div className='text-[23px] w-[text-size]'>모든 자료를 무료로 사용할 수 있나요?</div>
                    </div>
                    <div className='flex items-center w-[95%] h-[71px] pl-10 border-b-[1px] border-purple-light hover:bg-purple-light hover:transition-[1s]'>
                        <div className='text-[23px] w-[text-size]'>모바일 기기에서 사용이 가능한가요?</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default FAQ