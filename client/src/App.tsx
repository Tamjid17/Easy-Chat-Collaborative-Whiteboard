import { Outlet } from "react-router-dom";
import { Toaster } from "./components/ui/sonner"

function App() {
  return (
    <div>
      <Outlet />
      <Toaster richColors position="top-center" />
    </div>
  );
}

export default App