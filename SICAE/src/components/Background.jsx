import React from "react";

export default function Background({
    as: Tag = "div",
    src,
    blur = 0,        // em px
    dark = 0,        // 0 a 1 (0 = sem escurecer, 0.2 = 20% mais escuro, etc.)
    className = "",
    children,
    ...rest
}) {
    return (
        <Tag
            className={`ib-shell ${className}`}
            style={{ "--ib-blur": `${blur}px`, "--ib-dark": dark }}
            {...rest}
        >
            {/* Imagem de fundo */}
            <img
                className="ib-media"
                src={src}
                alt=""
                aria-hidden="true"
                draggable="false"
            />

            {/* Conteúdo por cima */}
            <div className="ib-content">{children}</div>
        </Tag>
    );
}
