import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import moment from "moment";
import { getDataAPI } from "../../../utils/fetchData";
import Banner from "../../../images/banner_cart.jpg";

import { AppContext } from "../../../App";

const Order = () => {
  const { auth } = useContext(AppContext);
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth || !auth.CustomerId) return;

    getDataAPI(`order/user/getAllOrder/${auth.CustomerId}`)
      .then((res) => {
        setOrders(res.data.orders);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [auth]);

  const getOrderStatus = (status) => {
    switch (status) {
      case 0:
        return "Confirmed";
      case 1:
        return "Delivered";
      case -1:
        return "Cancelled";
      default:
        return "Confirmed";
    }
  };

  return (
    <div className="user_orders">
      <div className="user_orders_banner">
        <img src={Banner} alt="Banner" />
        <div>
          <h1>Orders</h1>
          <p>Home / Order</p>
        </div>
      </div>
      <div className="user_order_container">
        <div className="user_order_table">
          <table class="table">
            <thead>
              <tr>
                <th
                  scope="col"
                  style={{
                    maxWidth: "48px",
                    padding: "0 !important",
                  }}
                >
                  Order No.
                </th>
                <th scope="col">Order Date</th>
                <th scope="col">Shipping Address</th>
                <th
                  scope="col"
                  className="col_quantity"
                  style={{
                    maxWidth: "56px",
                    padding: "0 !important",
                  }}
                >
                  Items
                </th>
                <th scope="col">Order Status</th>

                <th scope="col" className="col_total">
                  Total
                </th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.OrderId}
                  onClick={() => navigate(`/order/${order.OrderId}`)}
                >
                  <td>{"#" + order.OrderId}</td>
                  <td>
                    {moment(order.OrderDate).format(
                      window.innerWidth < 768
                        ? "DD/MM/YYYY"
                        : "DD/MM/YYYY HH:mm"
                    )}
                  </td>
                  <td>{order.Address}</td>
                  <td>{order.Items}</td>
                  <td
                    style={{
                      color:
                        order.OrderStatus === 0
                          ? "#f39c12"
                          : order.OrderStatus === 1
                          ? "#2ecc71"
                          : "#e74c3c",
                      fontWeight: "400",
                    }}
                  >
                    {getOrderStatus(order.OrderStatus)}
                  </td>
                  <td className="col_total">{"$" + order.Total}</td>
                  <td className="col_actions">
                    <Link to={`/order/${order.OrderId}`}>
                      <i className="fa-solid fa-circle-info" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Order;
