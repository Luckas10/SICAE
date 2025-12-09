import "./Profile.css";
import Header from "../components/general/Header.jsx";
import Sidebar from "../components/general/Sidebar.jsx";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useUser } from "../context/UserContext.jsx";

import AvatarEditor from "../components/profile/AvatarEditor.jsx";
import ProfileInfoGrid from "../components/profile/ProfileInfoGrid.jsx";

import api from "../services/api";

export default function ProfileID() {
    const { id } = useParams();

    const [profileUser, setProfileUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadProfileUser();
    }, [id]);

    const loadProfileUser = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/users/${id}`);
            setProfileUser(res.data);
        } catch (err) {
            console.error("Erro ao carregar perfil:", err);
        } finally {
            setLoading(false);
        }
    };

    const profileInfoItems = profileUser
        ? [
            { label: "Email", value: profileUser.email },
            { label: "Matrícula", value: profileUser.matricula || "—" },
            {
                label: "Comentários feitos",
                value: profileUser.total_comments || 0,
            },
            {
                label: "Eventos participados",
                value: profileUser.total_events || 0,
            },
            { label: "Status", value: profileUser.role },
        ]
        : [];

    return (
        <>
            <Header />

            <div className="profile-page">
                <Sidebar />

                <div className="profile-container">
                    <div className="profile-card">

                        <div className="avatar-wrapper">
                            <img
                                src={profileUser?.profile_image || "/img/profile.png"}
                                className="profile-avatar"
                                alt="Foto de perfil"
                            />
                        </div>

                        <h2 className="profile-name">
                            {loading
                                ? "Carregando..."
                                : profileUser?.full_name}
                        </h2>

                        <ProfileInfoGrid items={profileInfoItems} />
                    </div>
                </div>
            </div>
        </>
    );
}
