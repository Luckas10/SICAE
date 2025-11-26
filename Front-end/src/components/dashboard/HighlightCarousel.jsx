import Carousel from "react-bootstrap/Carousel";
import "bootstrap/dist/css/bootstrap.min.css";

export default function HighlightCarousel({ slides }) {
    return (
        <Carousel>
            {slides.map((slide) => (
                <Carousel.Item key={slide.id}>
                    <img className="d-block" src={slide.image} alt={slide.alt} />
                    <Carousel.Caption>
                        <h3>{slide.title}</h3>
                        <p>{slide.description}</p>
                        <span className="carousel-date">{slide.date}</span>
                    </Carousel.Caption>
                </Carousel.Item>
            ))}
        </Carousel>
    );
}
