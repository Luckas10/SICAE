// src/pages/Profile.jsx (ou onde já estava)
import "./Profile.css";
import Header from "../components/general/Header.jsx";
import Sidebar from "../components/general/Sidebar.jsx";

import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";

import AvatarEditor from "../components/profile/AvatarEditor.jsx";
import ProfileInfoGrid from "../components/profile/ProfileInfoGrid.jsx";

export default function Profile() {
    const { user, loadingUser } = useUser();
    const [commentsCount, setCommentsCount] = useState(0);
    const [username, setUsername] = useState("Nome do usuário");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("")

    useEffect(() => {
        if (!user) return;
        setCommentsCount(user.total_comments || 0);
        setUsername(user.full_name || "Nome do usuário");
        setEmail(user.email || "E-mail do usuário");
        setRole(user.role || "Cargo do usuário");
    }, [user]);

    const profileInfoItems = [
        {
            label: "Email",
            value: email || "email@example.com",
        },
        {
            label: "Matrícula",
            value: "20221101110019",
        },
        {
            label: "Comentários feitos",
            value: commentsCount,
        },
        {
            label: "Eventos participados",
            value: "777",
        },
        {
            label: "Status",
            value: role,
        },
    ];

    return (
        <>
            <Header />

            <main className="profile-page">
                <Sidebar />

                <div className="profile-container">
                    <div className="profile-card">
                        <AvatarEditor />

                        <h2 className="profile-name">
                            {loadingUser ? "Carregando..." : username}
                        </h2>

                        <ProfileInfoGrid items={profileInfoItems} />
                    </div>
                </div>
            </main>
        </>
    );
}
