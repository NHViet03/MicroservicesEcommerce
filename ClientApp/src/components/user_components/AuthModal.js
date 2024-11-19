import React, { useState, useContext } from "react";
import { AppContext } from "../../App";
import { postDataAPI } from "../../utils/fetchDataAccount";
import Loading from "../Loading";
import VerifyImg from "../../images/verify.png";

function AuthenticationModal({ showAuthModal, setShowAuthModal }) {
  const { setAlert, auth, setAuth } = useContext(AppContext);

  const [activeTab, setActiveTab] = useState("login");
  const [loading, setLoading] = useState(false);

  const [loginData, setLoginData] = useState({
    Email: "",
    Password: "",
  });

  const [registerData, setRegisterData] = useState({
    Email: "",
    FirstName: "",
    LastName: "",
    Password: "",
    ConfirmPassword: "",
  });

  const [verifyData, setVerifyData] = useState({
    email: "",
    verificationToken: "",
  });

  const [typePass, setTypePass] = useState(false);

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    if (activeTab === "login") {
      setLoginData({
        ...loginData,
        [name]: value,
      });
    } else if (activeTab === "register") {
      setRegisterData({
        ...registerData,
        [name]: value,
      });
    }
  };

  const handleClick = (e) => {
    if (e.target.classList.contains("modal")) {
      setShowAuthModal(!showAuthModal);
      setActiveTab("login");

      setVerifyData({
        email: "",
        verificationToken: "",
      });
    }
  };

  // Call Register API
  const handleRegister = async (e) => {
    e.preventDefault();

    if (loading) return;

    if (registerData.password !== registerData.confirmPassword) {
      return setAlert({
        title: "Register Error",
        data: "Password and Confirm Password do not match",
        type: "error",
      });
    }

    setLoading(true);

    try {
      const res = await postDataAPI("api/register", {
        email: registerData.Email,
        password: registerData.Password,
        firstName: registerData.FirstName,
        lastName: registerData.LastName,
      });

      setLoading(false);

      setVerifyData({
        email: registerData.Email,
        verificationToken: "",
      });

      setActiveTab("verify");

      setAlert({
        title: "Register Success",
        data: res.data.msg,
        type: "success",
      });
    } catch (error) {
      console.log(error);
      setAlert({
        title: "Register Error",
        data: error.response.data.msg,
        type: "error",
      });
      setLoading(false);

      setVerifyData({
        email: "",
        verificationToken: "",
      });
    }
  };

  // Call Verify API
  const handleVerify = async (e) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);

    try {
      const res = await postDataAPI("api/verify_email", verifyData);

      setLoading(false);

      setAlert({
        title: "Verify Success",
        data: res.data.msg,
        type: "success",
      });

      setRegisterData({
        Email: "",
        FirstName: "",
        LastName: "",
        Password: "",
        ConfirmPassword: "",
      });

      setVerifyData({
        email: "",
        verificationToken: "",
      });

      setShowAuthModal(false);

      setActiveTab("login");

      setAuth({
        ...res.data.data,
        token: res.data.access_token,
      });

      localStorage.setItem("firstLogin", true);
    } catch (error) {
      console.log(error);
      setLoading(false);

      setAlert({
        title: "Verify Error",
        data: error.response.data.msg,
        type: "error",
      });

      localStorage.removeItem("firstLogin");
    }
  };

  const handleResendEmail = async (email) => {
    if (loading) return;

    setLoading(true);

    try {
      const res = await postDataAPI("api/resend_email", {
        email,
      });

      setLoading(false);

      setAlert({
        title: "Resend Email Success",
        data: res.data.msg,
        type: "success",
      });
    } catch (error) {
      console.log(error);
      setLoading(false);

      setAlert({
        title: "Resend Email Error",
        data: error.response.data.msg,
        type: "error",
      });
    }
  };

  // Call Login API
  const handleLogin = async (e) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);

    try {
      const res = await postDataAPI("api/login", {
        email: loginData.Email,
        password: loginData.Password,
      });

      setLoading(false);

      setAlert({
        title: "Login Success",
        data: res.data.msg,
        type: "success",
      });

      setLoginData({
        Email: "",
        Password: "",
      });

      setShowAuthModal(false);
      setAuth({
        ...res.data.data,
        token: res.data.access_token,
      });

      localStorage.setItem("firstLogin", true);
    } catch (error) {
      setLoading(false);

      setAlert({
        title: "Login Error",
        data: error.response.data.msg,
        type: "error",
      });

      if (error.response.data.isVerified === false) {
        setVerifyData({
          email: loginData.Email,
          verificationToken: "",
        });

        await handleResendEmail(loginData.Email);

        setActiveTab("verify");
      } else {
        localStorage.removeItem("firstLogin");
      }
    }
  };

  return (
    <>
      {loading && <Loading />}

      {showAuthModal && (
        <div className="modal" onClick={handleClick}>
          <div className={`modal_container ${activeTab}`}>
            <div className="modal_header">
              <h5
                className={`${activeTab === "login" && "active"}`}
                onClick={() => setActiveTab("login")}
              >
                Login
              </h5>
              <h5
                className={`${activeTab === "register" && "active"}`}
                onClick={() => setActiveTab("register")}
              >
                Register
              </h5>
            </div>
            <div className={`modal_tabs_separator ${activeTab}`}>
              <span></span>
            </div>

            <div className="modal_body">
              {activeTab === "login" && (
                <form action="" onSubmit={handleLogin}>
                  <div className="mb-3">
                    <label for="Email" className="form-label">
                      Email Address <span>*</span>
                    </label>
                    <input
                      type="email"
                      name="Email"
                      className="form-control"
                      id="Email"
                      placeholder="youremail@example.com"
                      required
                      onChange={handleChangeInput}
                      value={loginData.Email}
                    />
                  </div>

                  <div className="mb-4">
                    <label for="password" className="form-label">
                      Password <span>*</span>
                    </label>
                    <div className="position-relative">
                      <input
                        type={typePass ? "text" : "password"}
                        name="Password"
                        className="form-control"
                        id="password"
                        placeholder="Your Password"
                        onChange={handleChangeInput}
                        value={loginData.Password}
                        required
                        minLength={6}
                      ></input>
                      <small
                        className="show-hide"
                        onClick={() => setTypePass(!typePass)}
                      >
                        {!typePass ? (
                          <i className="fa-solid fa-eye" />
                        ) : (
                          <i class="fa-solid fa-eye-slash" />
                        )}
                      </small>
                    </div>
                  </div>

                  <div>
                    <button type="submit" className="btn">
                      Log In
                    </button>
                  </div>
                </form>
              )}

              {activeTab === "register" && (
                <form action="" onSubmit={handleRegister}>
                  <div className="mb-3">
                    <label for="email" className="form-label">
                      Email Address <span>*</span>
                    </label>
                    <input
                      type="email"
                      name="Email"
                      className="form-control"
                      id="email"
                      placeholder="youremail@example.com"
                      required
                      onChange={handleChangeInput}
                      value={registerData.Email}
                    />
                  </div>

                  <div className="mb-3 double_input">
                    <div>
                      <label for="firstName" className="form-label">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="FirstName"
                        className="form-control"
                        id="irstName"
                        placeholder="Your First Name"
                        onChange={handleChangeInput}
                        value={registerData.FirstName}
                      />
                    </div>
                    <div>
                      <label for="lastName" className="form-label">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="LastName"
                        className="form-control"
                        id="lastName"
                        placeholder="Your Last Name"
                        onChange={handleChangeInput}
                        value={registerData.LastName}
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label for="password" className="form-label">
                      Password <span>*</span>
                    </label>
                    <div className="position-relative">
                      <input
                        type={typePass ? "text" : "password"}
                        name="Password"
                        className="form-control"
                        id="password"
                        placeholder="Your Password"
                        onChange={handleChangeInput}
                        value={registerData.Password}
                        required
                        minLength={6}
                      ></input>
                      <small
                        className="show-hide"
                        onClick={() => setTypePass(!typePass)}
                      >
                        {!typePass ? (
                          <i className="fa-solid fa-eye" />
                        ) : (
                          <i class="fa-solid fa-eye-slash" />
                        )}
                      </small>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label for="confirmPassword" className="form-label">
                      Confirm Password <span>*</span>
                    </label>
                    <div className="position-relative">
                      <input
                        type={typePass ? "text" : "password"}
                        name="ConfirmPassword"
                        className="form-control"
                        id="confirmPassword"
                        placeholder="Your Confirm Password"
                        onChange={handleChangeInput}
                        value={registerData.ConfirmPassword}
                        required
                        minLength={6}
                      ></input>
                      <small
                        className="show-hide"
                        onClick={() => setTypePass(!typePass)}
                      >
                        {!typePass ? (
                          <i className="fa-solid fa-eye" />
                        ) : (
                          <i class="fa-solid fa-eye-slash" />
                        )}
                      </small>
                    </div>
                  </div>

                  <div>
                    <button type="submit" className="btn">
                      Register
                    </button>
                  </div>
                </form>
              )}

              {activeTab === "verify" && (
                <form action="" onSubmit={handleVerify}>
                  <div className="mb-2 d-flex align-items-center justify-content-center flex-column">
                    <img
                      src={VerifyImg}
                      alt="logo"
                      className="logo"
                      style={{
                        width: "150px",
                        height: "120px",
                        objectFit: "contain",
                      }}
                    />
                    <h3
                      style={{
                        fontFamily: "var(--title-font)",
                        letterSpacing: "2px",
                      }}
                    >
                      Please check your email
                    </h3>
                    <p
                      style={{
                        fontFamily: "var(--content-font)",
                      }}
                    >
                      We've send a code to <strong>{verifyData.email}</strong>
                    </p>
                  </div>
                  <div className="mb-4">
                    <input
                      type="text"
                      name="verificationToken"
                      className="form-control"
                      placeholder="Enter your code"
                      required
                      onChange={(e) =>
                        setVerifyData({
                          ...verifyData,
                          verificationToken: e.target.value,
                        })
                      }
                      value={verifyData.verificationToken}
                    />
                  </div>

                  <div>
                    <button type="submit" className="btn mb-3">
                      VERIFY
                    </button>
                  </div>

                  <div
                    style={{
                      fontFamily: "var(--content-font)",
                      textAlign: "center",
                    }}
                  >
                    <p>
                      Didn't receive an email code ?{" "}
                      <strong
                        style={{
                          cursor: "pointer",
                          color: "var(--primary-color)",
                          textDecoration: "underline",
                        }}
                        onClick={() => handleResendEmail(verifyData.email)}
                      >
                        Resend
                      </strong>
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>

          <div
            className="modal_close"
            onClick={() => {
              setShowAuthModal(!showAuthModal);
              setActiveTab("login");
              setVerifyData({
                email: "",
                verificationToken: "",
              });
            }}
          >
            <i class="fa-solid fa-xmark"></i>
          </div>
        </div>
      )}
    </>
  );
}

export default AuthenticationModal;
