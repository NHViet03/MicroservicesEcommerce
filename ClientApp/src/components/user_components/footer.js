import { Link } from "react-router-dom";

function Footer() {
  const catogoryDatas = [
    {
      id: 1,
      name: "Rackets",
    },
    {
      id: 2,
      name: "Shoes",
    },
    {
      id: 3,
      name: "Accessories",
    },
  ];

  return (
    <footer class="footer">
      <div class="footer-section">
        <h3>Contact Info</h3>
        <p>
          Address: 720A Dien Bien Phi, Vinhomes Tan Cang, Binh Thanh, Ho Chi
          Minh 72300.
        </p>
        <p>Email: victory@kingofsport.com</p>
        <p>Fax: (+100) 123 456 7890</p>
        <h3 className="mt-4">Follow Us On</h3>
        <div class="social-icons">
          <a href="/">
            <i className="fa-brands fa-facebook-f" />
          </a>
          <a href="/">
            <i className="fa-brands fa-twitter" />
          </a>
          <a href="/">
            <i className="fa-brands fa-instagram" />
          </a>
          <a href="/">
            <i className="fa-brands fa-google-plus-g" />
          </a>
        </div>
      </div>

      <div class="footer-section">
        <h3>Get Help</h3>
        <a href="/">Contact Us</a>
        <a href="/">Delivery Information</a>
        <a href="/">Sale Terms & Conditions</a>
        <a href="/">Privacy Notice</a>
        <a href="/">Shopping FAQs</a>
        <a href="/">Returns & Refunds</a>
      </div>

      <div class="footer-section">
        <h3>Popular Categories</h3>
        {catogoryDatas.map((data) => (
          <Link
            key={data.id}
            to={`/product?category=${data.name}`}
            onClick={() => window.scrollTo({ top: 0, behavior: "instant" })}
          >
            {data.name}
          </Link>
        ))}
      </div>

      <div class="footer-section subscribe-section">
        <h3>Get In Touch</h3>
        <p>
          Sign up for all the news about our latest arrivals and get an
          exclusive early access shopping.
        </p>
        <p>
          <strong>60.000+ Subscribers</strong> and get a new discount coupon on
          every Saturday.
        </p>

        <iframe
          title="googlemap"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.109481512901!2d106.7205370152605!3d10.794187692312134!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317528ebbe6634b1%3A0x305ebec9a3e1b02c!2sLandmark%2081!5e0!3m2!1sen!2s!4v1602040522098!5m2!1sen!2s"
          width="100%"
          height="100%"
          frameborder="0"
          allowfullscreen=""
          aria-hidden="false"
          tabindex="0"
          style={{
            marginTop: "24px",
            borderRadius: "2px",
          }}
        ></iframe>
      </div>
    </footer>
  );
}

export default Footer;
