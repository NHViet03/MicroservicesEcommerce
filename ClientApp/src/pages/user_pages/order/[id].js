import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getDataAPI } from "../../../utils/fetchData";
import { AppContext } from "../../..//App";
import Banner from "../../../images/banner_cart.jpg";
import moment from "moment";

const OrderDetail = () => {
  const { id } = useParams();
  const { auth } = useContext(AppContext);
  const [order, setOrder] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth || !auth.CustomerId || !id) return;

    getDataAPI(`order/user/getOrder/${id}`)
      .then((res) => {
        setOrder(res.data.order);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [auth, id]);

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
    <div className="user_cart">
      <div className="user_cart_banner">
        <img src={Banner} alt="Banner" />
        <div>
          <h1>Order Detail</h1>
          <p>Home / Order / {id}</p>
        </div>
      </div>
      <div className="user_cart_container">
        <div className="user_cart_table user_orderDetail_table">
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
                <th scope="col">Price</th>
                <th scope="col" className="col_quantity">
                  Quantity
                </th>
                <th scope="col" className="col_total">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {order.OrderDetails &&
                order.OrderDetails.map((orderDetail, index) => (
                  <tr>
                    <td>#{index + 1}</td>
                    <td>
                      <div className="user_cart_table_product">
                        <img src={orderDetail.Image} alt="Product" />
                        <p>{orderDetail.Name}</p>
                      </div>
                    </td>
                    <td>{"$" + orderDetail.Price}</td>
                    <td>{orderDetail.Quantity}</td>
                    <td className="fw-bold">${orderDetail.Total}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <div className="user_cart_total user_order_total">
          <h4>Delivery Information</h4>
          <div className="user_cart_total_table">
            <table class="table">
              <tbody>
                <tr>
                  <th>Customer Name</th>
                  <td>{order.Name}</td>
                </tr>
                <tr>
                  <th>Shipping Address</th>
                  <td>{order.Address}</td>
                </tr>
                <tr>
                  <th>Phone Number</th>
                  <td>{order.PhoneNumber}</td>
                </tr>
                <tr>
                  <th>Order Date</th>
                  <td>{moment(order.OrderDate).format("DD/MM/YYYY HH:mm")}</td>
                </tr>
                <tr>
                  <th>Order Status</th>
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
                </tr>
                <tr>
                  <th>Total</th>
                  <td className="col_price">{"$" + order.Total}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
