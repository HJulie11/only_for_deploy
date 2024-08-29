"use client"
import NewsSection from "./component/News_home";
import How_it_works from "./component/How_it_works";
import FAQ from "./component/FAQ";
import InfoBoard from "./component/InfoBoard";
import Navbar from "./component/Navbar";
import Footer from "./component/Footer";
import React from "react";


const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  // Simulate a login action
  const handleLogin = () => {
      setIsLoggedIn(true);
  };

  return (
    <>
      <Navbar/>
      <NewsSection/>
      <How_it_works/>
      <FAQ/>
      <InfoBoard/>
      <Footer/>
    </>
  );
}

export default Home;