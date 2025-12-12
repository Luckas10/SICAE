import Carousel from "react-bootstrap/Carousel";
import "bootstrap/dist/css/bootstrap.min.css";
import { NavLink } from "react-router-dom";

export default function HighlightCarousel({ slides }) {
    const hasSlides = slides && slides.length > 0;

    const placeholder = [
        {
            id: "placeholder",
            image: "/img/placeholder.png",
            alt: "Sem notícias",
            title: "Nenhuma notícia disponível",
            description: "Ainda não há notícias cadastradas. Aguarde atualizações!",
            date: "",
        }
    ];

    const slidesToShow = hasSlides ? slides : placeholder;

    return (
        <Carousel>
            {slidesToShow.map((slide) => (
                <Carousel.Item key={slide.id}>
                    
                    {slide.id !== "placeholder" ? (
                        <NavLink to={`/news/${slide.id}`}>
                            <img className="d-block" src={slide.image} alt={slide.alt} />
                        </NavLink>
                    ) : (
                        <img className="d-block" src={slide.image} alt={slide.alt} />
                    )}

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
