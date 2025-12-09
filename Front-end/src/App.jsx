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
import GameDetails from "./pages/GameDetails.jsx";   // 🔥 IMPORT FALTANDO

import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import PublicRoute from "./routes/PublicRoute.jsx";

export default function App() {
  return (
    <Router>
      <Routes>

        {/* PUBLIC ROUTES */}
        <Route element={<PublicRoute />}>
          <Route path="/auth" element={<LoginRegister />} />
        </Route>

        {/* PROTECTED ROUTES */}
        <Route element={<ProtectedRoute />}>

          <Route path="/" element={<Dashboard />} />

          {/* EVENTS */}
          <Route path="/events" element={<Events />} />
          <Route path="/events/add" element={<AddEvent />} />
          <Route path="/events/edit/:id" element={<EditEvent />} />
          <Route path="/events/:id" element={<EventDetails />} />
          <Route path="/events/:id/games" element={<EventGame />} />

          {/* GAMES */}
          <Route path="/games/:id" element={<GameDetails />} />  {/* 🔥 ROTA CERTA */}

          {/* NEWS */}
          <Route path="/news" element={<News />} />
          <Route path="/news/add" element={<AddNews />} />
          <Route path="/news/edit/:id" element={<EditNews />} />
          <Route path="/news/:id" element={<NewsDetails />} />

          {/* ATHLETES */}
          <Route path="/athletes" element={<Athletes />} />
          <Route path="/athletes/manage" element={<ManageAthletes />} />

          {/* PROFILE & SETTINGS */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />

        </Route>
      </Routes>
    </Router>
  );
}
