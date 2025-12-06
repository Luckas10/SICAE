import { createRoot } from 'react-dom/client'
import { UserProvider } from "./context/UserContext";
import App from './App.jsx'
import "./style.css";
import "./DarkTheme.css";


createRoot(document.getElementById('root')).render(
  <UserProvider>
    <App />
  </UserProvider>,
)
