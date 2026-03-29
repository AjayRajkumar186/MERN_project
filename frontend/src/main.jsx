import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import App from "./App";
import { store } from "./Store/store";
import { CartProvider } from "./components/context/CartContext";
import ScrollToTop from "./components/layout/ScrollToTop";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <CartProvider>
        <BrowserRouter>
          <ScrollToTop />
          <App />
        </BrowserRouter>
    </CartProvider>
  </Provider>
);
