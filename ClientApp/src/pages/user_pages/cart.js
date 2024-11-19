import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { getDataAPI, postDataAPI } from "../../utils/fetchData";
import { AppContext } from "../../App";
import Banner from "../../images/banner_cart.jpg";

const Cart = () => {
  const { setAlert, auth } = useContext(AppContext);
  const [carts, setCarts] = useState([]);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.CustomerId || !auth.cart) {
      return;
    }

    getDataAPI(`customer/user/getAllCart/${auth.CustomerId}`, auth.token)
      .then((res) => {
        setCarts(res.data);
        setTotal(res.data.reduce((acc, cart) => acc + cart.Total, 0));
      })
      .catch((err) => {
        console.log(err);
      });
  }, [auth.CustomerId, auth.cart, navigate, setAlert]);

  const handleChangeQty = (e, cart) => {
    const newCarts = carts.map((c) => {
      if (c.CartId === cart.CartId) {
        return {
          ...c,
          Quantity: e.target.value,
          Total: e.target.value * (c.SalePrice || c.Price),
          Status: "UPDATE",
        };
      }
      return c;
    });
    setCarts(newCarts);
  };

  const handleDeleteCart = (cart) => {
    const newCarts = carts.map((c) => {
      if (c.CartId === cart.CartId) {
        return {
          ...c,
          Status: "DELETE",
        };
      }
      return c;
    });
    setCarts(newCarts);
  };

  const handleUpdateCart = async () => {
    const newTotal = carts
      .filter((cart) => cart.Status !== "DELETE")
      .reduce((acc, cart) => acc + cart.Total, 0);
    setTotal(newTotal);

    const postData = carts.map((cart) => ({
      CartId: cart.CartId,
      Quantity: cart.Quantity,
      Status: cart.Status,
    }));

    await postDataAPI("customer/user/updateAllCart", postData, auth.token);
  };

  return (
    <div className="user_cart">
      <div className="user_cart_banner">
        <img src={Banner} alt="Banner" />
        <div>
          <h1>Cart</h1>
          <p>Home / Cart</p>
        </div>
      </div>
      <div className="user_cart_container">
        <div className="user_cart_table">
          <table class="table">
            <thead>
              <tr>
                <th
                  scope="col"
                  style={{
                    padding: "0 !important",
                    maxWidth: "48px",
                  }}
                >
                  No.
                </th>
                <th scope="col" className="col_product">
                  Product
                </th>
                <th scope="col">Original Price</th>
                <th scope="col">Sale Price (Optional)</th>
                <th scope="col" className="col_quantity">
                  Quantity
                </th>
                <th scope="col" className="col_total">
                  Total
                </th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              {carts
                .filter((cart) => cart.Status !== "DELETE")
                .map((cart, index) => (
                  <tr key={cart.CartId}>
                    <td>#{index + 1}</td>
                    <td>
                      <div className="user_cart_table_product">
                        <img src={cart.ProductImage} alt="Product" />
                        <p>{cart.ProductName}</p>
                      </div>
                    </td>
                    <td
                      style={{
                        textDecoration: cart.SalePrice
                          ? "line-through"
                          : "none",
                      }}
                    >
                      ${cart.Price}
                    </td>
                    <td>{cart.SalePrice ? "$" + cart.SalePrice : "..."}</td>
                    <td className="col_quantity">
                      <input
                        type="number"
                        value={cart.Quantity}
                        min={1}
                        max={99}
                        onChange={(e) => handleChangeQty(e, cart)}
                      />
                    </td>
                    <td className="fw-bold">${cart.Total}</td>
                    <td>
                      <div
                        className="col_actions"
                        onClick={() => handleDeleteCart(cart)}
                      >
                        <i class="fa-regular fa-circle-xmark" />
                      </div>
                    </td>
                  </tr>
                ))}
              <tr>
                <td colSpan={7} className="col_span">
                  <button className="btn" onClick={handleUpdateCart}>
                    UPDATE CART
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="user_cart_total">
          <h4>CART TOTALS</h4>
          <div className="user_cart_total_table">
            <table class="table">
              <tbody>
                <tr>
                  <th>Subtotal</th>
                  <td className="col_price">${total}</td>
                </tr>
                <tr>
                  <th>Shipping</th>
                  <td>Free Shipping</td>
                </tr>
                <tr>
                  <th>Total</th>
                  <td className="col_price">${total}</td>
                </tr>
              </tbody>
            </table>
            <button className="btn" onClick={() => navigate("/proceed")}>
              PROCEED TO CHECKOUT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
