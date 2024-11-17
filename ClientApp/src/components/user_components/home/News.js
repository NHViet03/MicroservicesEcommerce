import React, { useRef, useEffect } from "react";

// Import Images
import NewsBg from "../../../images/new_bg.jpg";
import NewImg1 from "../../../images/news1.jpg";
import NewImg2 from "../../../images/news2.jpg";

const News = () => {
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          document.getElementById("user_home_news_container").style.display =
            "flex";
        }
      },
      {
        threshold: 0.5,
      }
    );
    observer.observe(ref.current);
  }, []);

  const newDatas = [
    {
      title: "DENMARK ACCOMPLISHED FOUR-PEAT IN EMTC!",
      date: "2021-02-22",
      desc: "2021 European Mixed Team Championships was rounded off last week in Vantaa, Finland. The defending champion Danish National Team successfully overcame several difficulties, having a 3-0 win over France in the final to claim the title.",
      img: NewImg1,
      url: "https://www.victorsport.com/news/19439/denmark-accomplished-four-peat-in-european-mixed-team-championships",
    },
    {
      title: "TAI TZU YING CLAIMED HER 4TH TAIPEI OPEN TITLE",
      date: "2022-07-25",
      desc: "After a two-year hiatus, the Super 300 Taipei Open was finally back! Team VICTOR top WS shuttler Tai Tzu Ying took down her opponent in two straight games in the final and won her 4th Taipei Open title.",
      img: NewImg2,
      url: "https://www.victorsport.com/news/20369/tai-tzu-ying-claimed-her-4th-taipei-open-title",
    },
  ];

  return (
    <div
      className="user_home_kit user_home_news"
      style={{
        backgroundImage: `url(${NewsBg})`,
      }}
      ref={ref}
    >
      <h2>NEWS</h2>

      <div  id="user_home_news_container" className="user_home_news_container">
        {newDatas.map((data, index) => (
          <a
            href={data.url}
            target="_blank"
            rel="noreferrer"
            className="user_home_news_card"
            key={index}
          >
            <img src={data.img} alt="news" />
            <div className="user_home_news_card_content">
              <h3>{data.title}</h3>
              <p className="user_home_news_card_content_date">{data.date}</p>
              <p className="user_home_news_card_content_desc">{data.desc}</p>
              <button className="btn">More</button>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default News;
