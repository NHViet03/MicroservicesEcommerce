import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { getDataAPI } from "../../../utils/fetchData";

// Import Images
import Banner from "../../../images/banner2.jpg";

function Products() {
  const location = useLocation();
  const navigate = useNavigate();

  // Create a URLSearchParams object to parse the query string
  const queryParams = new URLSearchParams(location.search);
  // Get the categoryId from the query parameters
  const categoryId = queryParams.get("categoryId");

  const [showFilter, setShowFilter] = useState(false);
  const [catogoryDatas, setCatogoryDatas] = useState([]);
  const [products, setProducts] = useState([]);
  const [numberProducts, setNumberProducts] = useState(0);
  const [page, setPage] = useState(1);

  const [sort, setSort] = useState(0);

  // Get all categories
  useEffect(() => {
    getDataAPI("category/user/getAllCategory")
      .then((res) => {
        console.log(res.data);
        setCatogoryDatas(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // Revert to page 1 when category changes or sort changes
  useEffect(() => {
    setPage(1);
  }, [categoryId, sort]);

  // Get number of products
  useEffect(() => {
    getDataAPI("product/user/countProduct?categoryId=" + (categoryId || ""))
      .then((res) => {
        setNumberProducts(res.data.count);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // Get all products
  useEffect(() => {
    getDataAPI(
      `product/user/getAllProduct?categoryId=${
        categoryId || ""
      }&pageSize=${page}&sortType=${sort}`
    )
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [categoryId, page, sort]);

  const handleClickCategory = (id) => {
    let redirectLocation = "/product";
    if (categoryId !== id.toString()) {
      redirectLocation = `/product?categoryId=${id}`;
    }

    navigate(redirectLocation);
    setShowFilter(false);
    window.location.reload();
  };

  const getNumberPages = () => {
    return Math.ceil(numberProducts / 8);
  };

  console.log(sort);
  return (
    <div className="user_products">
      <div className="user_products_banner">
        <img src={Banner} alt="Banner" />
        <h2>PRODUCTS</h2>
      </div>
      <div className="user-products_container">
        <div className="user_product_category">
          <h2>PRODUCT CATEGORIES</h2>
          <div className="user_product_category_list">
            {catogoryDatas.map((data) => (
              <div
                className={`${data.id == categoryId ? "active" : ""}`}
                onClick={() => handleClickCategory(data.id)}
                key={data.id}
              >
                <div>
                  <p>{`${data.name} (${data.product_count})`}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="user_product_list">
          <div className="user_product_list_filter">
            <p>{`Showing ${(page - 1) * 8 + 1} - ${
              (page - 1) * 8 + products.length
            } of ${numberProducts} results`}</p>
            <div className="user_product_list_filter_options">
              <select
                class="form-select"
                onChange={(e) => setSort(e.target.value)}
              >
                <option selected value="0">
                  Default
                </option>
                <option value="1">Sort by Price: Low to High</option>
                <option value="2">Sort by Price: High to Low</option>
                <option value="3">Sort by Latest</option>
              </select>
              <button
                className="btn"
                onClick={() => setShowFilter(!showFilter)}
              >
                <i class="fa-solid fa-filter"></i>
                Filter
              </button>
            </div>

            <div
              className="user_product_list_filter_modal"
              style={{
                display: showFilter ? "flex" : "none",
              }}
            >
              <div>
                <h5>PRODUCT CATEGORIES</h5>
                <div className="user_product_list_filter_modal_items">
                  {catogoryDatas.map((data) => (
                    <div
                      key={data.id}
                      onClick={() => handleClickCategory(data.id)}
                      className={`${data.id == categoryId ? "active" : ""}`}
                    >
                      <div>
                        <p>{`${data.name} (${data.product_count})`}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="user_product_list_items">
            {products.map((data) => (
              <div className="user_product_list_item" key={data.ProductId}>
                <Link
                  to={`/product/${data.ProductId}`}
                  onClick={() =>
                    window.scrollTo({ top: 0, behavior: "instant" })
                  }
                >
                  <div className="user_product_list_item_image">
                    {data.ProductImage.map((img, index) => (
                      <img src={img} alt="Product" key={index} />
                    ))}
                  </div>
                  <div className="user_product_list_item_details">
                    <p>{data.CategoryName}</p>
                    <h4>{data.ProductName}</h4>

                    <div>
                      <div className="user_product_list_item_price">
                        <p>${data.Price}</p>
                        {data.SalePrice && <p>${data.SalePrice}</p>}
                      </div>
                      <button className="btn">More</button>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          <div className="user_product_list_pagination">
            <button
              className="btn"
              onClick={() => setPage(Math.max(page - 1, 1))}
            >
              <i className="fa-solid fa-arrow-left" />
            </button>
            {Array.from({ length: getNumberPages() }, (_, index) => (
              <button
                className={`btn ${index + 1 === page ? "active" : ""}`}
                key={index}
                onClick={() => setPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}
            <button
              className="btn"
              onClick={() => {
                if (page < getNumberPages()) {
                  setPage(page + 1);
                }
              }}
            >
              <i className="fa-solid fa-arrow-right" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Products;
