import { FOOTER_CONTACT_INFO, FOOTER_LINKS, SOCIALS } from '@/constants';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import Logo from '@/public/Logo.svg';

const Footer = () => {
  return (
    <footer className="bg-gray-100 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <Link href="/" className="mb-10 mr-0 md:mr-10">
            <Image src={Logo} width={250} alt="logo"/>
          </Link>

          <div className='flex flex-wrap gap-10 sm:justify-between md:flex-1'>
            {FOOTER_LINKS.map((columns, columnIndex) => (
              <FooterColumn key={columnIndex} title={columns.title}>
                <ul className="text-sm text-gray-600">
                  {columns.links.map((link, index) => (
                    <li key={index} className="mb-2">
                      <Link href={columns.urls[index]} key={index}>{link}</Link>
                    </li>
                  ))}
                </ul>
              </FooterColumn>
            ))}

            <div className="flex flex-col gap-5">
              <FooterColumn title={FOOTER_CONTACT_INFO.title}>
                {FOOTER_CONTACT_INFO.links.map((link, index) => (
                  <Link
                    href="/"
                    key={index}
                    className="flex gap-4 md:flex-col lg:flex-row"
                  >
                    <p className="whitespace-nowrap">
                      {link.label}:
                    </p>
                    <p className="medium-14 whitespace-nowrap text-blue-70">
                      {link.value}
                    </p>
                  </Link>
                ))}
              </FooterColumn>
            </div>
          </div>
        </div>

        <hr className="my-8 border-gray-300" />

        <p className="text-center text-sm text-gray-600">2024 Lucky 13 | All rights reserved</p>
      </div>
    </footer>
  );
};

type FooterColumnProps = {
  title: string;
  children: React.ReactNode;
};

const FooterColumn = ({ title, children }: FooterColumnProps) => {
  return (
    <div className="flex flex-col gap-5">
      <h4 className="text-lg font-semibold">{title}</h4>
      {children}
    </div>
  );
};

export default Footer;