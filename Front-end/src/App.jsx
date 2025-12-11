import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { LoginRegister } from "./pages/LoginRegister.jsx";

import Events from "./pages/Events.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import News from "./pages/News.jsx";
import Profile from "./pages/Profile.jsx";
import Settings from "./pages/Settings.jsx";
import AddNews from "./pages/addNews.jsx";
import AddEvent from "./pages/addEvent.jsx";
import EventDetails from "./pages/EventDetails.jsx";
import EventGame from "./pages/EventGame.jsx";
import Athletes from "./pages/Athletes.jsx";
import ManageAthletes from "./pages/manageAthletes.jsx";
import NewsDetails from "./pages/NewsDetails.jsx";
import EditNews from "./pages/editNews.jsx";
import EditEvent from "./pages/editEvent.jsx";
import GameDetails from "./pages/GameDetails.jsx";
import Places from "./pages/Places.jsx";
import PlaceDetails from "./pages/PlaceDetails.jsx";

import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import ProtectedRole from "./routes/ProtectedRole.jsx";
import PublicRoute from "./routes/PublicRoute.jsx";
import ProfileID from "./pages/ProfileID.jsx";

export default function App() {
  return (
    <Router>
      <Routes>

        <Route element={<PublicRoute />}>
          <Route path="/auth" element={<LoginRegister />} />
        </Route>

        <Route path="/" element={<Dashboard />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="/games/:id" element={<GameDetails />} />

        <Route element={<ProtectedRole allowedRoles={["Servidor"]} redirectTo="/events" />}>
          <Route path="/events/:id/games" element={<EventGame />} />
        </Route>

        <Route path="/news" element={<News />} />
        <Route path="/news/:id" element={<NewsDetails />} />

        <Route path="/athletes" element={<Athletes />} />

        <Route path="/profile/:id" element={<ProfileID />} />

        <Route element={<ProtectedRole allowedRoles={["Servidor"]} redirectTo="/events" />}>
          <Route path="/events/add" element={<AddEvent />} />
          <Route path="/events/edit/:id" element={<EditEvent />} />
        </Route>

        <Route element={<ProtectedRole allowedRoles={["Servidor"]} redirectTo="/news" />}>
          <Route path="/news/add" element={<AddNews />} />
          <Route path="/news/edit/:id" element={<EditNews />} />
        </Route>

        <Route element={<ProtectedRole allowedRoles={["Servidor"]} redirectTo="/athletes" />}>
          <Route path="/athletes/manage" element={<ManageAthletes />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<Profile />} />
        </Route>

        <Route path="/places" element={<Places />} />

        <Route path="/places/:id" element={<PlaceDetails />} />

        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Router>
  );
}


