import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { postDataAPI } from "../../utils/fetchDataAccount";

import { AppContext } from "../../App";
import Logo from "../../images/logo.png";

function Header({ showAuthModal, setShowAuthModal }) {
  const { setAlert, auth, setAuth } = useContext(AppContext);

  const navigate = useNavigate();

  const [showMenu, setShowMenu] = useState(false);

  const MenuItems = [
    {
      title: "Home",
      url: "/",
    },
    {
      title: "Products",
      url: "/product",
    },
    {
      title: "Contact Us",
      url: "/contact",
    },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleClickToCart = () => {
    if (auth) {
      window.scrollTo({ top: 0, behavior: "instant" });
      navigate("/cart");
    } else {
      setAlert({
        title: "Login Required",
        data: "Please login to view your cart",
        type: "error",
      });
      setShowAuthModal(true);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await postDataAPI("api/logout");

      setAuth(false);
      navigate("/");
      setAlert({
        title: "Logout Success",
        data: response.data.msg,
        type: "success",
      });

      localStorage.removeItem("firstLogin");
    } catch (err) {
      console.log(err);
      setAlert({
        title: "Error",
        data: err.response.data.msg,
        type: "error",
      });
    }
  };

  return (
    <header className="user_header">
      <Link className="user_header_logo" to="/" onClick={scrollToTop}>
        <img src={Logo} alt="Logo" />
      </Link>

      <nav className="user_header_navigation">
        <ul>
          {MenuItems.map((item, index) => {
            return (
              <li key={index} onClick={scrollToTop}>
                <Link to={item.url}>{item.title}</Link>
                <span />
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="user_header_actions">
        {auth ? (
          <div class="dropdown">
            <div
              class="dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <span>Hello {auth.FirstName || auth.Email?.slice(0, 5)}</span>
              <i className="fa-solid fa-circle-user" />
            </div>
            <ul
              class="dropdown-menu"
              style={{
                right: "8px",
              }}
            >
              <li>
                <Link class="dropdown-item" to="/order">
                  Orders
                </Link>
              </li>
              <li>
                <div class="dropdown-item" onClick={handleLogout}>
                  Logout
                </div>
              </li>
            </ul>
          </div>
        ) : (
          <div onClick={() => setShowAuthModal(!showAuthModal)}>
            <span>Login</span>
            <i className="fa-solid fa-user" />
          </div>
        )}
        <div onClick={handleClickToCart}>
          <span>Cart</span>
          <i
            className="fa-solid fa-cart-shopping"
            style={{
              position: "relative",
            }}
          >
            {auth && auth.cart?.length > 0 && (
              <small
                style={{
                  position: "absolute",
                  top: "-4px",
                  right: "-8px",
                  backgroundColor: "var(--primary-color)",
                  color: "var(--white-color)",
                  fontSize: "12px",
                  fontWeight: "bold",
                  borderRadius: "50%",
                  padding: "1px",
                  width: "18px",
                  lineHeight: "12px",
                  height: "18px",
                  textAlign: "center",
                  border: "1px solid var(--white-color)",
                }}
              >
                {auth.cart.length}
              </small>
            )}
          </i>
        </div>
      </div>

      <div className="user_header_bar" onClick={() => setShowMenu(!showMenu)}>
        {showMenu ? (
          <i className="fa-solid fa-xmark" />
        ) : (
          <i className="fa-solid fa-bars" />
        )}
      </div>

      <div className={`user_header_modal ${showMenu ? "active" : ""}`}>
        <ul>
          {MenuItems.map((item, index) => {
            return (
              <li key={index} onClick={() => setShowMenu(false)}>
                <Link to={item.url}>{item.title}</Link>
              </li>
            );
          })}
        </ul>
      </div>
    </header>
  );
}

export default Header;
