import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LoginRegister } from "./pages/LoginRegister.jsx";
import Events from './pages/Events.jsx';
import Dashboard from './pages/Dashboard.jsx';
import News from './pages/News.jsx';
import Profile from './pages/Profile.jsx';
import Settings from './pages/Settings.jsx';
import AddNews from "./pages/addNews.jsx";
import AddEvent from "./pages/addEvent.jsx";

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/auth" element={<LoginRegister />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/events" element={<Events />} />
          <Route path="/news" element={<News />} />
          <Route path="/user" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/news/add" element={<AddNews />} />
          <Route path="/events/add" element={<AddEvent />} />


        </Routes>
      </Router>
    </>
  )
}

export default App
