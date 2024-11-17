import React, { useRef, useEffect } from "react";
import AboutUsBg from "../../../images/about_bg.jpg";
import AboutUsImg from "../../../images/about_us.jpg";

function AboutUs() {
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          document.getElementById("user_home_about_container").style.display =
            "flex";
        }
      },
      {
        threshold: 0.8,
      }
    );
    observer.observe(ref.current);
  }, []);

  return (
    <div
      className="user_home_kit user_home_about"
      style={{
        backgroundImage: `url(${AboutUsBg})`,
      }}
      ref={ref}
    >
      <h2>ABOUT US</h2>

      <div id="user_home_about_container" className="user_home_about_container">
        <div className="user_home_about_container_img">
          <img src={AboutUsImg} alt="about-us" />
        </div>
        <div className="user_home_about_container_content">
          <p>
            Victory – accompanying you on the journey to conquer the pinnacle of
            badminton. With each racket and shoe product optimally designed,
            Victory not only brings durability and flexibility but also adds
            strength to every move.
          </p>
          <p>
            Let Victory become a reliable companion, helping you confidently
            overcome all challenges and win glorious victory on the field.
          </p>
          <p>
            VICTORY is the official partner of the Badminton World Federation
            (BWF) and Badminton Asia (BA). Collaborating with top players such
            as Tai Tzu Ying, Ahsan/Setiawan, Naraoka Kodai, Lee Zii Jia, and the
            Danish national badminton team, VICTORY is committed to
            strengthening badminton and fostering its popularity worldwide.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AboutUs;
