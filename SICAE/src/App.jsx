import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Login from './pages/Login.jsx';
// import Register from './pages/Register.jsx';
import Events from './pages/Events.jsx';
import { LoginRegister } from "./pages/LoginRegister.jsx";

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/events" element={<Events />} />
          <Route path="/login" element={<LoginRegister />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
