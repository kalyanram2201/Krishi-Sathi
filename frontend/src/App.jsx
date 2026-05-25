import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import DiseaseDetection from "./pages/DiseaseDetection";
import CropSuggestion from "./pages/CropSuggestion";
import Weather from "./pages/Weather";
import Marketplace from "./pages/Marketplace";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";

import { CartProvider } from "./context/CartContext";
import { useAuth } from "./context/AuthContext";

function App() {
  const { user } = useAuth();

  return (
    <CartProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Show Navbar only after login */}
        {user && <Navbar />}

        <Routes>
          {/* AUTH */}
          <Route
            path="/login"
            element={user ? <Navigate to="/dashboard" /> : <Login />}
          />

          <Route
            path="/register"
            element={user ? <Navigate to="/dashboard" /> : <Register />}
          />

          {/* HOME */}
          <Route
            path="/"
            element={user ? <Home /> : <Navigate to="/login" />}
          />

          {/* DASHBOARD */}
          <Route
            path="/dashboard"
            element={user ? <Dashboard /> : <Navigate to="/login" />}
          />

          {/* DISEASE DETECTION */}
          <Route
            path="/disease-detection"
            element={user ? <DiseaseDetection /> : <Navigate to="/login" />}
          />

          {/* CROP SUGGESTION */}
          <Route
            path="/crop-suggestion"
            element={user ? <CropSuggestion /> : <Navigate to="/login" />}
          />

          {/* WEATHER */}
          <Route
            path="/weather"
            element={user ? <Weather /> : <Navigate to="/login" />}
          />

          {/* MARKETPLACE */}
          <Route
            path="/marketplace"
            element={user ? <Marketplace /> : <Navigate to="/login" />}
          />

          {/* PRODUCT DETAIL */}
          <Route
            path="/product/:id"
            element={user ? <ProductDetail /> : <Navigate to="/login" />}
          />

          {/* CART */}
          <Route
            path="/cart"
            element={user ? <Cart /> : <Navigate to="/login" />}
          />

          {/* PROFILE */}
          <Route
            path="/profile"
            element={user ? <Profile /> : <Navigate to="/login" />}
          />

          {/* FALLBACK */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </CartProvider>
  );
}

export default App;
