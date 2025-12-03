export default function EventCategorySelect({ value, onChange }) {
    return (
        <>
            <label htmlFor="categorias">Categoria</label>
            <div className="input-icon">
                <select
                    name="categorias"
                    id="categorias"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                >
                    <option value="futsal">Futsal</option>
                    <option value="basketball">Basquete</option>
                    <option value="tabletennis">Tênis de Mesa</option>
                    <option value="fighting">Lutas</option>
                    <option value="athletics">Atletismo</option>
                    <option value="volleyball">Voleibol</option>
                    <option value="swimming">Natação</option>
                    <option value="chess">Xadrez</option>
                    <option value="esports">E-sports</option>
                </select>
            </div>
        </>
    );
}
