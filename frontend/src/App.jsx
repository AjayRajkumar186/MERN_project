import { useLocation } from "react-router-dom";
import AppRoutes from "./components/routes/AppRoutes";
import WhatsAppButton from "./Store/WhatsAppButton";

function App() {

  const location = useLocation();

  const hideWhatsAppRoutes = ["/login", "/signup"];

  const shouldHideWhatsApp = hideWhatsAppRoutes.includes(location.pathname);
  return (
    <>

      <AppRoutes />
      {!shouldHideWhatsApp && <WhatsAppButton />}
    </>
  )
}

export default App;
