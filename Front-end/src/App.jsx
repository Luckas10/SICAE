import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Events from './pages/Events.jsx';
import { LoginRegister } from "./pages/LoginRegister.jsx";

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/events" element={<Events />} />
          <Route path="/auth" element={<LoginRegister />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
