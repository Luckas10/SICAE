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

import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import PublicRoute from "./routes/PublicRoute.jsx";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/auth" element={<LoginRegister />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/add" element={<AddEvent />} />
          <Route path="/events/:id" element={<EventDetails />} />
          <Route path="/news" element={<News />} />
          <Route path="/news/add" element={<AddNews />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
}
