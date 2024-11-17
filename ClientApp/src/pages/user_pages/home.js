import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

// Import Components
import Carousel from "../../components/user_components/home/Carousel";
import Kit from "../../components/user_components/home/Kit";
import AboutUs from "../../components/user_components/home/AboutUs";
import Arrival from "../../components/user_components/home/Arrival";
import News from "../../components/user_components/home/News";

// Image Imports
import PlayerTopImg from "../../images/player-top.png";
import KitTopImg from "../../images/kit-top.png";
import BannerImg from "../../images/banner.jpg";
import FooterTopImg from "../../images/footer-top.png";

function Home() {
  return (
    <div className="user_home">
      <Carousel />
      <div
        className="user-home_banner"
        style={{
          backgroundImage: `url(${BannerImg})`,
        }}
      >
        <h1>READY TO WIN</h1>
      </div>
      <div className="user_home_separator">
        <img src={PlayerTopImg} alt="player-top" />
      </div>
      <AboutUs />
      <div className="user_home_separator">
        <img src={PlayerTopImg} alt="player-top" />
      </div>
      <Arrival />

      <div className="user_home_separator">
        <img src={KitTopImg} alt="kit-top" />
      </div>

      <Kit />

      <div className="user_home_separator">
        <img src={PlayerTopImg} alt="player-top" />
      </div>

      <News />

      <div className="user_home_separator">
        <img src={FooterTopImg} alt="kit-top" />
      </div>
    </div>
  );
}

export default Home;
