import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Events from "./pages/Events.jsx";
import { LoginRegister } from "./pages/LoginRegister.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import PublicRoute from "./routes/PublicRoute.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/events"
          element={
            <ProtectedRoute>
              <Events />
            </ProtectedRoute>
          }
        />

        <Route
          path="/auth"
          element={
            <PublicRoute>
              <LoginRegister />
            </PublicRoute>
          }
        />

        {/* opcional: redirecionar raiz */}
        {/* <Route path="/" element={<Navigate to="/login" replace />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
