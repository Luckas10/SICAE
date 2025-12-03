export default function EventInitiationToggle({ checked, onChange }) {
    return (
        <div className="initiation-flag">
            <input
                type="checkbox"
                id="isInitiation"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
            />
            <label htmlFor="isInitiation">
                Evento de iniciação esportiva
            </label>
        </div>
    );
}
