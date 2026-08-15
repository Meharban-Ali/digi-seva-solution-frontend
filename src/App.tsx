import { AppRouter } from "@/routes/AppRouter";
import { Toaster } from "sonner";

export function App() {
  return (
    <>
      <AppRouter />
      <Toaster position="top-right" richColors closeButton />
    </>
  );
}

export default App;
