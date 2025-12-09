import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import CenterCard from "./CenterCard.jsx";

export default function CenterSlider({ news }) {
    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 2,
        swipe: false,

        responsive: [
            {
                breakpoint: 1400,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 2,
                }
            },
            {
                breakpoint: 900,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    swipe: true
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    swipe: true
                }
            }
        ]
    };

    return (
        <div className="center-slider-wrapper">
            <Slider {...settings} className="sliding-cards">
                {news.map((item) => (
                    <div key={item.id}>
                        <CenterCard data={item} />
                    </div>
                ))}
            </Slider>
        </div>
    );
}
