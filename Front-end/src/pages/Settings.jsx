import Header from "../components/general/Header.jsx";
import Sidebar from "../components/general/Sidebar.jsx";

import SettingsHeader from "../components/settings/SettingsHeader.jsx";
import ThemeCard from "../components/settings/ThemeCard.jsx";

import { useUser } from "../context/UserContext";
import "./Settings.css";

export default function Settings() {
    const { theme, toggleTheme } = useUser();
    const isNight = theme === "dark";

    return (
        <>
            <Header />
            <div className="settings-page">
                <Sidebar />

                <div className="settings-content">
                    <SettingsHeader />

                    <ThemeCard
                        isNight={isNight}
                        toggleTheme={toggleTheme}
                    />
                </div>
            </div>
        </>
    );
}
