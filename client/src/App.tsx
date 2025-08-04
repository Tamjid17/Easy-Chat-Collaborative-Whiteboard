//import { Button } from "./components/ui/button"
import AuthPage from "./features/AuthPage"
import { Toaster } from "./components/ui/sonner"

function App() {
  return (
    <div>
      <AuthPage />
      <Toaster richColors position="top-center" />
    </div>
  );
}

export default App