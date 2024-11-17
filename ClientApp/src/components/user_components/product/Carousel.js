import React from "react";

const Carousel = ({ productImages, id }) => {
  const isActive = (index) => {
    return index === 0 ? "active" : "";
  };

  return (
    <div id={`image${id}`} className="carousel slide">
      <div className="carousel-indicators">
        {productImages?.map((item, index) => (
          <img
            key={index}
            src={item}
            alt="Product"
            data-bs-target={`#image${id}`}
            data-bs-slide-to={index}
            className={`carousel-btn ${isActive(index)}`}
          />
        ))}
      </div>
      <div className="carousel-inner">
        {productImages?.map((item, index) => (
          <div
            key={index}
            className={`carousel-item ${isActive(index)}`}
            style={{
              padding: "8px",
            }}
          >
            <img src={item} className="d-block w-100 h-auto" alt="Post" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Carousel;
