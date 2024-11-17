import CarouselPhoto1 from "../../../images/newarrival_1.png";
import CarouselPhoto2 from "../../../images/newarrival_2.png";

function Home() {
  return (
    <div className="user_home_carousel">
      <div id="carouselExample" class="carousel slide" data-bs-ride="carousel">
        <div class="carousel-inner">
          <div class="carousel-item active" data-bs-interval="5000">
            <div>
              <img src={CarouselPhoto1} alt="Photo1" />
              <div class="carousel-caption left d-none d-md-block">
                <h5>SHOES</h5>
              </div>
            </div>
          </div>
          <div class="carousel-item" data-bs-interval="5000">
            <div>
              <img src={CarouselPhoto2} alt="Photo2" />
              <div class="carousel-caption d-none d-md-block">
                <h5>RACKET</h5>
              </div>
            </div>
          </div>
        </div>
        <button
          class="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExample"
          data-bs-slide="prev"
        >
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Previous</span>
        </button>
        <button
          class="carousel-control-next"
          type="button"
          data-bs-target="#carouselExample"
          data-bs-slide="next"
        >
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Next</span>
        </button>
      </div>
    </div>
  );
}

export default Home;
