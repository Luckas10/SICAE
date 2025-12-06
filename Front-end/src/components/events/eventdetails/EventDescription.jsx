export default function EventDescription({ description }) {
    const hasDescription =
        description && description.trim().length > 0;

    return (
        <div className="event-details-info">
            <h2>Descrição</h2>
            <p>
                {hasDescription
                    ? description
                    : "Nenhuma descrição foi cadastrada para este evento."}
            </p>
        </div>
    );
}
