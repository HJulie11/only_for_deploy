// "use client";
// import { SetStateAction, useState } from 'react';

// interface DictationTextboxProps {
//   value?: string;
//   onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
//   readOnly?: boolean;
// }

// const Dictation_textbox: React.FC<DictationTextboxProps> = ({ value = '', onChange }) => {
//   const [internalValue, setInternalValue] = useState(value);

//   const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
//     const newValue = e.target.value;
//     setInternalValue(newValue);
//     if (onChange) onChange(e);
//   };

//   return (
//     <textarea
//       className='w-full p-4 h-full rounded border border-grey-300 text-lg'
//       value={value || internalValue}
//       onChange={onChange || handleChange}
//       placeholder="Enter text here"
//     />
//   );
// };

// export default Dictation_textbox;

import React from 'react';

interface DictationTextboxProps {
  value: string;
  readOnly?: boolean;
}

const Dictation_textbox: React.FC<DictationTextboxProps> = ({ value, readOnly }) => {
  // Render the value with proper styling
  // For simplicity, assume value contains plain text
  return (
    <textarea
      value={value}
      readOnly={readOnly}
      className="w-full h-full resize-none border rounded p-2"
    />
  );
};

export default Dictation_textbox;