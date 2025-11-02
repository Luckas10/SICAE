import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LoginRegister } from "./pages/LoginRegister.jsx";
import  Events  from './pages/Events.jsx';
import  Dashboard  from './pages/Dashboard.jsx';

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/events" element={<Events />} />
          <Route path="/auth" element={<LoginRegister />} />
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
