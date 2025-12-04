import futsalImg from "../assets/eventsIcons/eventDefault.jpg";
import basketballImg from "../assets/eventsIcons/eventDefault.jpg";
import tabletennisImg from "../assets/eventsIcons/eventTableTennis.png";
import fightingImg from "../assets/eventsIcons/eventDefault.jpg";
import athleticsImg from "../assets/eventsIcons/eventAthletics.png";
import volleyballImg from "../assets/eventsIcons/eventVolleyball.png";
import swimmingImg from "../assets/eventsIcons/eventDefault.jpg";
import chessImg from "../assets/eventsIcons/eventChess.png";
import esportsImg from "../assets/eventsIcons/eventDefault.jpg";

import { fas } from "@fortawesome/free-solid-svg-icons";

export const CATEGORY_CONFIG = {
    futsal: {
        label: "FUTSAL",
        icon: fas.faFutbol,
        image: futsalImg,
        className: "futsalIcon",
    },
    basketball: {
        label: "BASQUETE",
        icon: fas.faBasketball,
        image: basketballImg,
        className: "basketballIcon",
    },
    tabletennis: {
        label: "TÊNIS DE MESA",
        icon: fas.faTableTennis,
        image: tabletennisImg,
        className: "tabletennisIcon",
    },
    fighting: {
        label: "LUTAS",
        icon: fas.faHandBackFist,
        image: fightingImg,
        className: "fightingIcon",
    },
    athletics: {
        label: "ATLETISMO",
        icon: fas.faPersonRunning,
        image: athleticsImg,
        className: "athleticsIcon",
    },
    volleyball: {
        label: "VOLEIBOL",
        icon: fas.faVolleyball,
        image: volleyballImg,
        className: "volleyballIcon",
    },
    swimming: {
        label: "NATAÇÃO",
        icon: fas.faWater,
        image: swimmingImg,
        className: "swimmingIcon",
    },
    chess: {
        label: "XADREZ",
        icon: fas.faChess,
        image: chessImg,
        className: "chessIcon",
    },
    esports: {
        label: "E-SPORTS",
        icon: fas.faGamepad,
        image: esportsImg,
        className: "esportsIcon",
    },
};


export const DEFAULT_CATEGORY = {
    label: "EVENTO",
    icon: fas.faCalendarDays,
    image: athleticsImg,
    className: "athleticsIcon",
};
