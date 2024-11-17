import React, { useRef, useEffect } from "react";
import ArrivalBg from "../../../images/arrival_bg.jpg";
import ArrivalArticle1 from "../../../images/article_2.png";
import ArrivalArticle2 from "../../../images/article_1.png";

const Arrival = () => {
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          document.getElementById("user_home_arrival_container").style.display =
            "flex";
        }
      },
      {
        threshold: 0.5,
      }
    );
    observer.observe(ref.current);
  }, []);

  const arirval_contents = [
    {
      title:
        "AURASPEED 90K II COMING BACK WITH BETTER ACCELERATION AND FAST LANE",
      description:
        "Built on the features of the first-generation ARS-90K, ARS-90K II is further equipped with WES2.0 to enable quick recovery, efficient force transmission, and sharper downward angles for attack play.",
      img: ArrivalArticle1,
    },
    {
      title: "P8500II—THE LEGEND RISES AGAIN WITH UPGRADED STABILITY",
      description:
        "P8500II not only features all the signature elements of VICTOR P8500, P8500ACE, and P8510, including the eye-catching tri-claw design and unique ankle protection system, but it also comes equipped with an upgraded full-foot HYPEREVA.",
      img: ArrivalArticle2,
    },
  ];

  return (
    <div
      className="user_home_kit user_home_arrival"
      style={{
        backgroundImage: `url(${ArrivalBg})`,
      }}
      ref={ref}
    >
      <h2>NEW ARRIVAL</h2>
      <div
        id="user_home_arrival_container"
        className="user_home_arrival_container"
      >
        {arirval_contents.map((content, index) => (
          <div
            className={`user_home_arrival_article ${
              index % 2 === 1 && "right"
            }`}
            key={index}
          >
            <img src={content.img} alt="article" />
            <div className="user_home_arrival_article_content">
              <h3>{content.title}</h3>
              <p>{content.description}</p>
              <button className="btn">MORE</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Arrival;
