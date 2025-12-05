export function timeAgo(dateString) {
    const created = new Date(dateString); // data REAL, sem correção manual
    const now = new Date();

    const diffMs = now - created;

    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return "agora mesmo";
    if (minutes < 60) return `${minutes} min atrás`;
    if (hours < 24) return `${hours} h atrás`;
    if (days < 7) return `${days} d atrás`;

    return created.toLocaleDateString("pt-BR");
}
