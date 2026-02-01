import { useAuth } from "./contexts/AuthContext";
import Auth from "./components/Auth";
import Dashboard from "./components/Dashboard";

function App() {
  const { user } = useAuth();

  return user ? <Dashboard /> : <Auth />;
}

export default App;
