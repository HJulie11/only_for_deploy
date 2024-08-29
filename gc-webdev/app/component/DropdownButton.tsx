import React, { MouseEventHandler, useState } from 'react';

interface DropdownButtonProps {
  buttonText: string;
  items: { label: string; href: string; onClick?: MouseEventHandler<HTMLAnchorElement>; }[];
}

const DropdownButton: React.FC<DropdownButtonProps> = ({ buttonText, items }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center text-gray-800 hover:text-gray-900 focus:outline-none"
      >
        <span className="mr-2">{buttonText}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-md shadow-lg">
          {/* Dropdown items */}
          {items.map((item, index) => (
            <a
              key={index}
              href={item.href}
              onClick={item.onClick}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              {item.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropdownButton;
