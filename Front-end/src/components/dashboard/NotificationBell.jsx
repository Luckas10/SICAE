import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { far } from "@fortawesome/free-regular-svg-icons";

export default function NotificationBell() {
    return (
        <div className="notifications">
            <div className="notifications-upper">
                <FontAwesomeIcon icon={far.faBell} className="bell-icon" />
            </div>
        </div>
    );
}
