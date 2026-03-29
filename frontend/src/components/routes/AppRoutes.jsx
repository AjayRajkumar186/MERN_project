import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../auth/Login";
import Products from "../pages/Products";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import MyOrders from "../pages/MyOrders";
import AddProduct from "../pages/AddProduct";
import MainLayout from "../layout/MainLayout";
import ProtectedRoute from "../routes/ProtectedRoute";
import Banner from "../pages/Banner";
import SignUp from "../auth/SignUp";
import ProductDescription from "../pages/ProductDescription";
import Contact from "../pages/Contact";
import Faq from "../pages/Faq";
import PrivacyPolicy from "../pages/PrivacyPolicy";
import TermsAndConditions from "../pages/TermsAndConditions";
import Notifications from "../pages/Notifications";


const AppRoutes = () => {
  return (
    
    <Routes>
  <Route path="/login" element={<Login />} />
  <Route path="/signup" element={<SignUp />} />

  <Route element={<MainLayout />}>
    <Route path="/" element={<Banner />} />
    <Route path="/product" element={<Products />} />
    <Route path="/product/description/:id" element={<ProductDescription/>}/>
    <Route path="/cart" element={<Cart />} />
    <Route path="/cart/:id" element={<Cart />} />
    <Route path="/contact" element={<Contact />} />
    <Route path="/faq" element={<Faq />} />
    <Route path="/privacy" element={<PrivacyPolicy />} />
    <Route path="/terms" element={<TermsAndConditions />} />


    <Route
      path="/checkout"
      element={
        <ProtectedRoute >
          <Checkout />
        </ProtectedRoute>
      }
    />

    <Route
      path="/my-orders"
      element={
        <ProtectedRoute>
          <MyOrders />
        </ProtectedRoute>
      }
    />

    <Route
      path="/add-product"
      element={
        <ProtectedRoute adminOnly>
          <AddProduct />
        </ProtectedRoute>
      }
    />
    <Route path="/edit-product/:id" 
     element={
        <ProtectedRoute adminOnly>
          <AddProduct />
        </ProtectedRoute>
      }
    />

    <Route
      path="/notifications"
      element={
        <ProtectedRoute adminOnly>
          <Notifications />
        </ProtectedRoute>
      }
    />
  </Route>

  

  <Route path="*" element={<Navigate to="/" replace />} />
</Routes>

  );
};

export default AppRoutes;
