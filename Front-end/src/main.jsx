import { createRoot } from 'react-dom/client'
import { UserProvider } from "./context/UserContext";
import App from './App.jsx'
import "./style.css";


createRoot(document.getElementById('root')).render(
  <UserProvider>
    <App />
  </UserProvider>,
)
