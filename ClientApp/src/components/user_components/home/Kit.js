import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";

// Import Images
import KitBanner1 from "../../../images/cat.racquet.jpg";
import KitBanner2 from "../../../images/cat.shoes.png";
import KitBanner3 from "../../../images/cat.accessories.jpg";
import Kit1Img from "../../../images/kit_1.png";
import Kit2Img from "../../../images/kit_2.png";
import Kit3Img from "../../../images/kit_3.png";
import KitBgImg from "../../../images/footwear-bg.jpg";

function Kit() {
  const catogoryDatas = [
    {
      id: 1,
      name: "Rackets",
      img: Kit1Img,
    },
    {
      id: 2,
      name: "Shoes",
      img: Kit2Img,
    },
    {
      id: 3,
      name: "Accessories",
      img: Kit3Img,
    },
  ];

  const [isShowBanner, setIsShowBanner] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting === isShowBanner) return;
        setIsShowBanner(entry.isIntersecting);
      },
      {
        threshold: 0.5,
      }
    );
    observer.observe(ref.current);
  }, []);
  return (
    <div
      className="user_home_kit"
      style={{
        backgroundImage: `url(${KitBgImg})`,
      }}
      ref={ref}
    >
      <h2>CHOOSE TO BE THE WINNER</h2>
      <div className="user_home_kit_container">
        {catogoryDatas.map((data, index) => (
          <Link
            className="user_home_kit_card"
            key={index}
            to={`/product?categoryId=${data.id}`}
            onClick={() => window.scrollTo({ top: 0, behavior: "instant" })}
          >
            <img src={data.img} alt="kit" />
            <h3>{data.name}</h3>
          </Link>
        ))}
      </div>
      <div
        className="user_home_kit_banner"
        style={{
          display: isShowBanner ? "flex" : "none",
        }}
      >
        <Link
          to="/product?categoryId=1"
          onClick={() => window.scrollTo({ top: 0, behavior: "instant" })}
        >
          <img src={KitBanner1} alt="kit-banner" />
        </Link>
        <Link
          to="/product?categoryId=2"
          onClick={() => window.scrollTo({ top: 0, behavior: "instant" })}
        >
          <img src={KitBanner2} alt="kit-banner" />
        </Link>
        <Link
          to="/product?categoryId=3"
          onClick={() => window.scrollTo({ top: 0, behavior: "instant" })}
        >
          <img src={KitBanner3} alt="kit-banner" />
        </Link>
      </div>
    </div>
  );
}

export default Kit;
