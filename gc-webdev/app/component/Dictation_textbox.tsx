"use client";
import { SetStateAction, useState } from 'react';

interface DictationTextboxProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  readOnly?: boolean;
}

const Dictation_textbox: React.FC<DictationTextboxProps> = ({ value = '', onChange }) => {
  const [internalValue, setInternalValue] = useState(value);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setInternalValue(newValue);
    if (onChange) onChange(e);
  };

  return (
    <textarea
      className='w-full h-[90%] rounded-lg border-2 border-grey-30'
      value={value || internalValue}
      onChange={onChange || handleChange}
      placeholder="Enter text here"
    />
  );
};

export default Dictation_textbox;