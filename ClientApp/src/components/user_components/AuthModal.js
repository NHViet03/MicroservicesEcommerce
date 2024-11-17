import React, { useState, useContext } from "react";
import { AppContext } from "../../App";
import { getDataAPI, postDataAPI } from "../../utils/fetchDataAccount";

function AuthenticationModal({ showAuthModal, setShowAuthModal }) {
  const { setAlert, auth, setAuth } = useContext(AppContext);

  const [activeTab, setActiveTab] = useState("login");

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

  const [typePass, setTypePass] = useState(false);

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    if (activeTab === "login") {
      setLoginData({
        ...loginData,
        [name]: value,
      });
    } else {
      setRegisterData({
        ...registerData,
        [name]: value,
      });
    }
  };

  const handleClick = (e) => {
    if (e.target.classList.contains("modal")) {
      setShowAuthModal(!showAuthModal);
    }
  };

  // Call Register API
  const handleRegister = async (e) => {
    e.preventDefault();

    if (registerData.password !== registerData.confirmPassword) {
      return setAlert({
        title: "Register Error",
        data: "Password and Confirm Password do not match",
        type: "error",
      });
    }

    try {
      const res = await postDataAPI("auth/user/register", registerData);

      setAlert({
        title: "Register Success",
        data: res.data.message,
        type: "success",
      });

      setRegisterData({
        Email: "",
        FirstName: "",
        LastName: "",
        Password: "",
        ConfirmPassword: "",
      });

      setShowAuthModal(false);
      setAuth(res.data.data);

      localStorage.setItem("UserId", res.data.data.UserId);

      
    } catch (error) {
      setAlert({
        title: "Register Error",
        data: error.response.data.message,
        type: "error",
      });
    }
  };

  // Call Login API
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await postDataAPI("auth/user/login", loginData);

      console.log(res);

      setAlert({
        title: "Login Success",
        data: res.data.message,
        type: "success",
      });

      setLoginData({
        Email: "",
        Password: "",
      });

      setShowAuthModal(false);
      setAuth(res.data.data);

      localStorage.setItem("UserId", res.data.data.UserId);
    } catch (error) {
      setAlert({
        title: "Login Error",
        data: error.response.data.message,
        type: "error",
      });
    }
  }

  return (
    <>
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
            </div>
          </div>

          <div
            className="modal_close"
            onClick={() => setShowAuthModal(!showAuthModal)}
          >
            <i class="fa-solid fa-xmark"></i>
          </div>
        </div>
      )}
    </>
  );
}

export default AuthenticationModal;
