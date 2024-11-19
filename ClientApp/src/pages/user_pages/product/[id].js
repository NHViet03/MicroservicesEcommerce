import React, { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../../../App";
import { Link } from "react-router-dom";
import { getDataAPI, postDataAPI } from "../../../utils/fetchData";
import Loading from "../../../components/Loading";

import Carousel from "../../../components/user_components/product/Carousel";

const ProductDetail = () => {
  const { id } = useParams();
  const { setAlert, auth, setAuth } = useContext(AppContext);
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;

    getDataAPI(`product/user/getProduct/${id || 0}`)
      .then((res) => {
        setProduct(res.data);
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
        setAlert({
          title: "Error",
          data: err.response.data.message,
          type: "error",
        });
      });
  }, [id]);

  const renderProductAlert = (product) => {
    return (
      <div>
        <div className="d-flex align-items-center gap-3 mb-2">
          <img
            src={product?.ProductImage[0]}
            alt=""
            style={{ width: "100px" }}
          />
          <div>
            <p
              style={{
                fontSize: "24px",
                fontWeight: "500",
                fontFamily: "var(--title-font)",
                marginBottom: "8px",
              }}
            >
              {product?.ProductName}
            </p>
            <p
              className="mb-0"
              style={{
                fontFamily: "var(--content-font)",
              }}
            >
              {product.Description.slice(0, 20) + "..."}
            </p>
          </div>
        </div>
        <Link
          to="/cart"
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
          VIEW CART
        </Link>
      </div>
    );
  };

  const handleAddToCart = async () => {
    if (!auth) {
      setAlert({
        title: "Error",
        data: "Please login to add product to cart",
        type: "error",
      });

      return;
    }

    if (!product || !product.ProductId) {
      setAlert({
        title: "Error",
        data: "Product not found",
        type: "error",
      });

      return;
    }

    if (loading) return;

    const newProduct = {
      id: product.ProductId,
      ProductName: product.ProductName,
      ProductImages: product.ProductImage[0],
    };

    try {
      setLoading(true);
      const res = await postDataAPI("customer/user/addToCart", {
        CustomerId: auth.CustomerId,
        ProductId: id,
      });

      const processCart = (cart) => {
        let isExist = false;
        cart.forEach((item) => {
          if (item.ProductId === newProduct.ProductId) {
            isExist = true;
            item.Quantity += 1;
          }
        });

        if (!isExist) {
          cart.push({ ...newProduct, Quantity: 1 });
        }

        return cart;
      };

      setAuth((prev) => {
        return {
          ...prev,
          cart: processCart(prev.cart),
        };
      });

      setAlert({
        title: "Add Product to Cart Successfully",
        data: renderProductAlert(product),
        type: "success",
      });

      setLoading(false);
    } catch (error) {
      console.log(error);
      setAlert({
        title: "Error",
        data: error.response?.error,
        type: "error",
      });

      setLoading(false);
    }
  };

  return (
    <div className="user_product_detail">
      {product.ProductId && (
        <>
          {loading && <Loading />}
          <div className="user_product_detail_images">
            <Carousel
              productImages={product.ProductImage}
              id={product.ProductId}
            />
          </div>

          <div className="user_product_detail_info">
            <h2>{product.ProductName}</h2>
            <div className="user_product_detail_info_price">
              <p>${product.Price}</p>
              {product.SalePrice && <p>${product.SalePrice}</p>}
            </div>
            <p className="user_product_detail_info_desc">
              {product.Description}
            </p>
            <div className="user_product_detail_info_actions">
              <p className={`mb-0 ${product.Quantity == 0 && "sell_out"}`}>
                {product.Quantity > 0 ? "Quantity in stock: " : "Out of stock"}

                {product.Quantity > 0 && <span>{product.Quantity}</span>}
              </p>
              <button
                className={`btn ${product.Quantity == 0 && "disable"}`}
                disabled={product.Quantity == 0 ? true : false}
                onClick={handleAddToCart}
              >
                <i className="fa-solid fa-cart-plus" />
                ADD TO CART
              </button>
            </div>
            <p
              style={{
                fontSize: "14px",
                fontWeight: "500",
                color: "var(--text-color)",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  marginRight: "8px",
                }}
              >
                Category:
              </span>{" "}
              {product.CategoryName}
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductDetail;
