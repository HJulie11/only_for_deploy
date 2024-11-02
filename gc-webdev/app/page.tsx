"use client";
import React, { useEffect, useState } from "react";
import NewsSection from "./component/News_home";
import How_it_works from "./component/How_it_works";
import FAQ from "./component/FAQ";
import InfoBoard from "./component/InfoBoard";
import Navbar from "./component/Navbar";
import Footer from "./component/Footer";
import LocalStorage from '@/constants/localstorage';

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = LocalStorage.getItem("token");
    setIsLoggedIn(!!token);  // Set logged-in state based on token existence
  }, []);

  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} />
      <NewsSection />
      <How_it_works />
      <FAQ />
      <InfoBoard />
      <Footer />
    </>
  );
};

export default Home;
