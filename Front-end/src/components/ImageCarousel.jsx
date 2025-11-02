import { useState, useEffect, useCallback } from "react";
import "./ImageCarousel.css";

export default function ImageCarousel({
    images = [],
    autoPlay = true,
    interval = 4000,
    showIndicators = true,
    showArrows = true,
}) {
    const [current, setCurrent] = useState(0);

    const goNext = useCallback(() => {
        setCurrent((prev) => (prev + 1) % images.length);
    }, [images.length]);

    const goPrev = () => {
        setCurrent((prev) => (prev - 1 + images.length) % images.length);
    };

    const goTo = (index) => {
        setCurrent(index);
    };

    // autoplay
    useEffect(() => {
        if (!autoPlay || images.length <= 1) return;
        const id = setInterval(goNext, interval);
        return () => clearInterval(id);
    }, [autoPlay, interval, goNext, images.length]);

    if (!images || images.length === 0) {
        return (
            <div className="carousel-empty">
                Nenhuma imagem
            </div>
        );
    }

    return (
        <div className="carousel">
            {/* Área de slides */}
            <div
                className="carousel-track"
                style={{
                    transform: `translateX(-${current * 100}%)`,
                }}
            >
                {images.map((src, index) => (
                    <div className="carousel-slide" key={index}>
                        <img
                            src={src}
                            alt={`slide-${index}`}
                            className="carousel-image"
                            draggable={false}
                        />
                    </div>
                ))}
            </div>

            {/* Botão anterior */}
            {showArrows && images.length > 1 && (
                <button className="carousel-btn carousel-btn-prev" onClick={goPrev} aria-label="Anterior">
                    <span className="carousel-btn-icon">‹</span>
                </button>
            )}

            {/* Botão próximo */}
            {showArrows && images.length > 1 && (
                <button className="carousel-btn carousel-btn-next" onClick={goNext} aria-label="Próximo">
                    <span className="carousel-btn-icon">›</span>
                </button>
            )}

            {/* Indicadores (bolinhas) */}
            {showIndicators && images.length > 1 && (
                <div className="carousel-indicators">
                    {images.map((_, index) => (
                        <button
                            key={index}
                            className={
                                "carousel-indicator-dot" +
                                (index === current ? " active" : "")
                            }
                            onClick={() => goTo(index)}
                            aria-label={`Ir para slide ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
