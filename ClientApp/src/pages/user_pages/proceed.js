import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { getDataAPI, postDataAPI } from "../../utils/fetchData";
import { AppContext } from "../../App";

const Proceed = () => {
  const { auth, setAuth, setAlert } = useContext(AppContext);
  const [orderData, setOrderData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    phoneNumber: "",
    customerId: "",
    cart: [],
    orderSuccess: false,
  });

  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!auth.CustomerId || !auth.cart) {
      return;
    }

    getDataAPI(`customer/user/getAllCart/${auth.CustomerId}`, auth.token)
      .then((res) => {
        setOrderData((pre) => ({
          ...pre,
          cart: res.data,
        }));
        setTotal(res.data.reduce((acc, cart) => acc + cart.Total, 0));
      })
      .catch((err) => {
        console.log(err);
      });
  }, [auth.CustomerId, auth.cart, setAlert]);

  useEffect(() => {
    if (auth) {
      setOrderData((pre) => ({
        ...pre,
        email: auth.Email,
        firstName: auth.FirstName,
        lastName: auth.LastName,
        address: auth.Address,
        phoneNumber: auth.PhoneNumber,
        customerId: auth.CustomerId,
      }));
    }
  }, [auth]);

  const handleChangeInput = (e) => {
    const { name, value } = e.target;

    setOrderData({
      ...orderData,
      [name]: value,
    });
  };

  const renderProductAlert = (orderId) => {
    return (
      <div>
        <p>Your order has been placed successfully</p>
        <Link
          to={`/order/${orderId}`}
          className="btn w-100 mt-3"
          style={{
            borderRadius: "2px",
            backgroundColor: "var(--primary-color)",
            fontFamily: "var(--title-font)",
            fontSize: "20px",
            color: "var(--white-color)",
            letterSpacing: "2px",
          }}
        >
          VIEW ORDER
        </Link>
      </div>
    );
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();

    const postData = {
      customerId: orderData.customerId,
      address: orderData.address,
      phoneNumber: orderData.phoneNumber,
      orderDetails: orderData.cart.map((cart) => ({
        ProductId: cart.ProductId,
        Price: cart.Price,
        Quantity: cart.Quantity,
        Total: cart.Total,
      })),
    };

    try {
      const res = await postDataAPI("order/user/createOrder", postData);
      setOrderData({
        ...orderData,
        orderSuccess: true,
        orderId: res.data.orderId,
      });

      setAlert({
        title: "Order Success",
        data: renderProductAlert(res.data.orderId),
        type: "success",
      });

      setAuth({
        ...auth,
        cart: [],
      });
    } catch (error) {
      console.log(error);
      setAlert({
        title: "Order Error",
        data: error.response.data.error,
        type: "error",
      });
    }
  };

  return (
    <form className="user_proceed" onSubmit={handleSubmitOrder}>
      <div className="user_proceed_container">
        {!orderData.orderSuccess ? (
          <>
            <div className="user_proceed_shippingInfo">
              <h4>SHIPPING INFORMATION</h4>
              <div className="form-group mb-4">
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
                  value={orderData.email}
                  onChange={handleChangeInput}
                />
              </div>
              <div className="form-group mb-4">
                <label for="phoneNumber">
                  Phone Number <span>*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="phoneNumber"
                  name="phoneNumber"
                  required
                  placeholder="Your Phone Number"
                  value={orderData.phoneNumber}
                  onChange={handleChangeInput}
                />
              </div>
              <div className="mb-4 double_input">
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
                    value={orderData.firstName}
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
                    value={orderData.lastName}
                    onChange={handleChangeInput}
                  />
                </div>
              </div>
              <div className="form-group mb-4">
                <label for="address">
                  Shipping Address <span>*</span>
                </label>
                <textarea
                  className="form-control"
                  id="address"
                  name="address"
                  required
                  placeholder="Your Shipping Address"
                  value={orderData.address}
                  onChange={handleChangeInput}
                />
              </div>
            </div>
            <div className="user_proceed_orderInfo">
              <h4>YOUR ORDER</h4>
              <div className="user_proceed_orderInfo_table">
                <table class="table">
                  <tbody>
                    <tr>
                      <th>Products</th>
                      <td>
                        {orderData.cart.map((cart) => (
                          <div>
                            {cart.ProductName} x {cart.Quantity}
                          </div>
                        ))}
                      </td>
                    </tr>
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
                    <tr>
                      <th>Payment Method</th>
                      <td>Cash on Delivery</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p>
                Your personal data will be used to process your order, support
                your experience throughout this website, and for other purposes
                described in our privacy policy.
              </p>
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="checkbox"
                  defaultValue={false}
                  id="orderLicense"
                  required
                />
                <label class="form-check-label" for="orderLicense">
                  I have read and agree to the website terms and conditions{" "}
                  <span>*</span>
                </label>
              </div>
              <button className="btn">PLACE ORDER</button>
            </div>
          </>
        ) : (
          <div className="user_proceed_success">
            <i class="fa-regular fa-circle-check" />
            <h1>Thank you for your purchase</h1>
            <p>We've received your order will ship in 5 - 7 business days.</p>
            <p>Your order number is: #{orderData?.orderId}</p>
          </div>
        )}
      </div>
    </form>
  );
};

export default Proceed;
