import React, { useState, useRef, useContext, useEffect } from "react";
import emailjs from "@emailjs/browser";
import ContactGif from "../../images/giphy.webp";
import { AppContext } from "../../App";
import Loading from "../../components/Loading";

const Contact = () => {
  const ref = useRef(null);
  const { setAlert, auth } = useContext(AppContext);

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    subject: "",
    firstName: "",
    lastName: "",
    message: "",
  });

  useEffect(() => {
    if (auth){
      setFormData({
        email: auth.Email,
        firstName: auth.FirstName,
        lastName: auth.LastName,
        subject: "",
        message: "",
      });
    }
  }, [auth])


  const handleChangeInput = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);
    await emailjs
      .sendForm("service_hpls698", "template_m1uzpnb", ref.current, {
        publicKey: "zeJiPDed-WHpIVgqf",
      })
      .then(
        () => {
          setLoading(false);
          setFormData({
            email: "",
            firstName: "",
            lastName: "",
            subject: "",
            message: "",
          });

          return setAlert({
            title: "Send Email Success",
            data: "Your message has been sent successfully. Thank for your contact ❤️❤️❤️",
            type: "success",
          });
        },
        (error) => {
          setLoading(false);
          return setAlert({
            title: "Send Email Error",
            data: error,
            type: "error",
          });
        }
      );
  };

  return (
    <div className="user_contact">
      {loading && <Loading />}
      <div className="user_contact_container">
        <div className="user_contact_banner">
          <h1>CONTACT US</h1>
          <p>
            For us, the most important part of improving your game is connecting
            with a community of players who share your passion. Sign up for an
            account on our site or follow us on social media to stay inspired,
            discover new techniques. Share your journey, ask questions, and let
            us help you become the best player you can be!
          </p>
        </div>

        <div className="user_contact_form">
          <div className="user_contact_form_section">
            <p>Contact Us</p>
            <h2>Please contact us quickly if you need help.</h2>
            <img src={ContactGif} alt="Contact Us" />
          </div>
          <form
            className="user_contact_form_section"
            onSubmit={handleSubmitForm}
            ref={ref}
          >
            <p>Write To Us</p>
            <div className="form-group mb-3">
              <label for="email">
                Your Email <span>*</span>
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                required
                placeholder="Your Email Address"
                value={formData.email}
                onChange={handleChangeInput}
              />
            </div>
            <div className="form-group mb-3">
              <label for="subject">
                Subject <span>*</span>
              </label>
              <input
                type="text"
                className="form-control"
                id="subject"
                name="subject"
                required
                placeholder="Subject of Your Message"
                value={formData.subject}
                onChange={handleChangeInput}
              />
            </div>
            <div className="mb-3 double_input">
              <div>
                <label for="firstName" className="form-label">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  className="form-control"
                  id="firstName"
                  placeholder="Your First Name"
                  value={formData.firstName}
                  onChange={handleChangeInput}
                />
              </div>
              <div>
                <label for="lastName" className="form-label">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  className="form-control"
                  id="lastName"
                  placeholder="Your Last Name"
                  value={formData.lastName}
                  onChange={handleChangeInput}
                />
              </div>
            </div>

            <div className="form-group mb-3">
              <label for="message">
                Your Message <span>*</span>
              </label>
              <textarea
                className="form-control mb-4"
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChangeInput}
                rows="5"
                minLength={10}
                required
                placeholder="Write Your Message Here"
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
