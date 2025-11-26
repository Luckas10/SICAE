export default function Background({
    as: Tag = "div",
    src,
    blur = 0,
    dark = 0,
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
            <img
                className="ib-media"
                src={src}
                alt=""
                aria-hidden="true"
                draggable="false"
            />

            <div className="ib-content">{children}</div>
        </Tag>
    );
}
