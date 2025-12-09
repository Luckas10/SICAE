import { useParams } from "react-router-dom";
import SingleGame from "../components/events/eventdetails/SingleGame";

export default function GameDetails() {
    const { id } = useParams();

    return <SingleGame gameId={id} />;
}
