"use client"
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import router, { useRouter } from "next/navigation";
import { MouseEventHandler } from "react";

type ButtonProps = {
  type: 'button' | 'submit';
  title: string;
  icon?: StaticImageData;
  variant: string;
  full?: boolean;
}

const Button = ({ type, title, icon, variant, full}: ButtonProps) => {
  // const router = useRouter();
  
  // const handleClick = () => {
  //   router.push(link_to)
  // }
  return (
    <button className={`flexCenter gap-3 rounded-full border ${variant} ${full && 'w-full'}`} type={type}>
      {icon && <Image src={icon} alt={title} width={24} height={24} />}
      <label className="bold-16 whitespace-nowrap cursor-pointer">{title}</label>
    </button>
    
  )
}

export default Button