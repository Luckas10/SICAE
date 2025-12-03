export default function ProfileInfoCard({ label, value }) {
    return (
        <div className="profile-info-card">
            <span className="profile-info-label">{label}</span>
            <span className="profile-info-value">{value}</span>
        </div>
    );
}
