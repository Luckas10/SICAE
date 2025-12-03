import ProfileInfoCard from "./ProfileInfoCard";

export default function ProfileInfoGrid({ items = [] }) {
    return (
        <div className="profile-info-grid">
            {items.map((item) => (
                <ProfileInfoCard
                    key={item.label}
                    label={item.label}
                    value={item.value}
                />
            ))}
        </div>
    );
}
