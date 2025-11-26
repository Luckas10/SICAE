export default function SportsStrip({ icons }) {
    return (
        <div className="sports-content">
            {icons.map((src, index) => (
                <img src={src} alt="" key={index} />
            ))}
        </div>
    );
}
