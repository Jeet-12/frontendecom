import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { store } from "./store";
import { Provider } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

import Tailwind from "primereact/passthrough/tailwind";
import "./index.css";

import { PrimeReactProvider } from "primereact/api";
// import { AuthProvider } from "./context/AuthContext.jsx";
ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PrimeReactProvider value={{ unstyled: false, pt: Tailwind }}>
      {/* <AuthProvider> */}
        <App />
      {/* </AuthProvider> */}
    </PrimeReactProvider>
  </Provider>
);
