import { fas } from "@fortawesome/free-solid-svg-icons";

export const CATEGORY_CONFIG = {
    futsal: {
        label: "FUTSAL",
        icon: fas.faFutbol,
        className: "futsalIcon",
    },
    basketball: {
        label: "BASQUETE",
        icon: fas.faBasketball,
        className: "basketballIcon",
    },
    tabletennis: {
        label: "TÊNIS DE MESA",
        icon: fas.faTableTennis,
        className: "tabletennisIcon",
    },
    fighting: {
        label: "LUTAS",
        icon: fas.faHandBackFist,
        className: "fightingIcon",
    },
    athletics: {
        label: "ATLETISMO",
        icon: fas.faPersonRunning,
        className: "athleticsIcon",
    },
    volleyball: {
        label: "VOLEIBOL",
        icon: fas.faVolleyball,
        className: "volleyballIcon",
    },
    swimming: {
        label: "NATAÇÃO",
        icon: fas.faWater,
        className: "swimmingIcon",
    },
    chess: {
        label: "XADREZ",
        icon: fas.faChess,
        className: "chessIcon",
    },
    esports: {
        label: "E-SPORTS",
        icon: fas.faGamepad,
        className: "esportsIcon",
    },
};

export const DEFAULT_CATEGORY = {
    label: "EVENTO",
    icon: fas.faCalendarDays,
    className: "athleticsIcon",
};
