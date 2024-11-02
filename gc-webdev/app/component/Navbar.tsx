"use client";
import React, { useState, useEffect } from "react";
import { NAV_LINKS } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import Button from "./Button";
import Logo from "@/public/Logo.svg";
import MenuBars from "@/public/menu.svg";
import DropdownButton from "./DropdownButton";

interface NavbarProps {
  isLoggedIn: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ isLoggedIn }) => {
  const [isNavVisible, setIsNavVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const toggleNav = () => {
    setIsNavVisible(!isNavVisible);
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  if (!isMounted) return null;

  return (
    <>
      {isNavVisible && (
        <div
          className="fixed w-full h-full right-0 bg-black opacity-50 z-30"
          onClick={toggleNav}
        ></div>
      )}
      <nav className="flexBetween max-container padding-container relative z-30">
        <Link href="/" className="mt-3">
          <Image src={Logo} width={200} height={32} alt="logo" />
        </Link>

        <div
          className={`${
            isNavVisible ? "" : "hidden"
          } fixed right-0 top-0 h-screen w-2/3 bg-white rounded shadow-lg z-30`}
        >
          <ul className="h-full gap-12 lg:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                className="regular-16 text-gray-50 mt-28 flexCenter cursor-pointer pb-1.5 transition-all hover:font-bold"
                href={link.href}
              >
                {link.label}
              </Link>
            ))}

            {isLoggedIn ? (
              <div>
                <Link
                  href="/profile"
                  className="regular-16 text-gray-50 mt-28 flexCenter cursor-pointer pb-1.5 transition-all hover:font-bold"
                >
                  Profile
                </Link>
                <Link
                  href="/"
                  className="regular-16 text-gray-50 mt-28 flexCenter cursor-pointer pb-1.5 transition-all hover:font-bold"
                  onClick={logout}
                >
                  Logout
                </Link>
              </div>
            ) : (
              <div className="mt-28 flexCenter regular-16 text-gray-50 cursor-pointer pb-1.5 transition-all hover:font-bold">
                <Link href="/login">
                  <button type="button">Log in</button>
                </Link>
              </div>
            )}
          </ul>
        </div>

        <div className={`sm:${!isNavVisible ? "" : "hidden"} center items-center h-[100px]`}>
          <ul className="hidden h-full gap-12 lg:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                className="regular-16 text-gray-50 mt-3 flexCenter cursor-pointer pb-1.5 transition-all hover:font-bold"
                href={link.href}
              >
                {link.label}
              </Link>
            ))}

            {isLoggedIn ? (
              <div className="regular-16 mt-3 flexCenter cursor-pointer pb-1.5 transition-all hover:font-bold">
                <DropdownButton
                  buttonText="My Account"
                  items={[
                    { label: "Profile", href: "/profile" },
                    { label: "Log out", href: "#", onClick: logout },
                  ]}
                />
              </div>
            ) : (
              <div className="lg:flexCenter hidden">
                <Link href="/login">
                  <Button type="button" title="Login" variant="btn_dark_green" />
                </Link>
              </div>
            )}
          </ul>
        </div>

        <Image
          src={MenuBars}
          alt="menu"
          width={32}
          height={32}
          className="inline-block cursor-pointer lg:hidden mt-3"
          onClick={toggleNav}
        />
      </nav>
    </>
  );
};

export default Navbar;
