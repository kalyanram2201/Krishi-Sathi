import React, { useEffect, useRef, useState } from "react";

import { Link, useLocation, useNavigate } from "react-router-dom";

import { Menu, X, Leaf, ShoppingCart, User, Bell } from "lucide-react";

import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const [showNotifications, setShowNotifications] = useState(false);

  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const location = useLocation();

  const navigate = useNavigate();

  const { cartItems } = useCart();

  const { logout } = useAuth();

  const profileDropdownRef = useRef(null);

  const navigation = [
    { name: "Home", href: "/", icon: "🏠" },
    { name: "Dashboard", href: "/dashboard", icon: "📊" },
    { name: "Disease Detection", href: "/disease-detection", icon: "🔍" },
    { name: "Crop Suggestion", href: "/crop-suggestion", icon: "🌱" },
    { name: "Weather", href: "/weather", icon: "🌤️" },
    { name: "Marketplace", href: "/marketplace", icon: "🛒" },
  ];

  const notifications = [
    {
      id: 1,
      text: "New crops available for planting!",
      time: "2h ago",
      read: false,
    },

    {
      id: 2,
      text: "Weather alert: Rain expected tomorrow",
      time: "1d ago",
      read: true,
    },

    {
      id: 3,
      text: "Your soil test results are ready",
      time: "2d ago",
      read: false,
    },
  ];

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const unreadNotifications = notifications.filter((n) => !n.read).length;

  const isActivePath = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }

    return location.pathname.startsWith(path);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target)
      ) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();

    navigate("/login");
  };

  return (
    <nav className="bg-gradient-to-r from-white to-green-50 shadow-lg sticky top-0 z-50 backdrop-blur-sm bg-white/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link
              to="/"
              className="flex-shrink-0 flex items-center group"
              onClick={() => setIsOpen(false)}
            >
              <div className="relative">
                <Leaf className="h-8 w-8 text-green-600 group-hover:scale-110 transition-transform duration-300" />

                <div className="absolute inset-0 bg-green-200 rounded-full blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
              </div>

              <span className="ml-3 text-2xl font-bold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">
                KrishiSathi
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActivePath(item.href)
                    ? "text-green-700 bg-gradient-to-r from-green-50 to-emerald-50 shadow-sm border border-green-100"
                    : "text-gray-700 hover:text-green-700 hover:bg-green-50/50 hover:shadow-sm"
                }`}
              >
                <span className="mr-2">{item.icon}</span>

                {item.name}
              </Link>
            ))}

            {/* Notifications */}
            <div className="relative ml-4">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-gray-700 hover:text-green-600 hover:bg-green-50/50 rounded-lg transition-colors"
              >
                <Bell className="h-6 w-6" />

                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                    {unreadNotifications}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50 animate-slideDown">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-900">
                      Notifications
                    </h3>
                  </div>

                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`px-4 py-3 hover:bg-gray-50 transition-colors ${
                          !notification.read ? "bg-green-50/50" : ""
                        }`}
                      >
                        <p className="text-sm text-gray-800">
                          {notification.text}
                        </p>

                        <p className="text-xs text-gray-500 mt-1">
                          {notification.time}
                        </p>
                      </div>
                    ))}
                  </div>

                  <Link
                    to="/notifications"
                    className="block text-center text-sm text-green-600 hover:text-green-700 py-2 border-t border-gray-100 hover:bg-green-50/50 transition-colors"
                    onClick={() => setShowNotifications(false)}
                  >
                    View all notifications
                  </Link>
                </div>
              )}
            </div>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative ml-4 p-2 text-gray-700 hover:text-green-600 hover:bg-green-50/50 rounded-lg transition-colors group"
            >
              <ShoppingCart className="h-6 w-6 group-hover:scale-110 transition-transform" />

              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-bounce">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Profile Dropdown */}
            <div className="relative ml-4" ref={profileDropdownRef}>
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="p-2 text-gray-700 hover:text-green-600 hover:bg-green-50/50 rounded-lg transition-colors"
              >
                <User className="h-6 w-6" />
              </button>

              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50 animate-slideDown">
                  <Link
                    to="/profile"
                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors"
                    onClick={() => setShowProfileDropdown(false)}
                  >
                    Profile
                  </Link>

                  <Link
                    to="#"
                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors"
                    onClick={() => setShowProfileDropdown(false)}
                  >
                    Settings
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <Link
              to="/cart"
              className="relative p-2 text-gray-700 hover:text-green-600 transition-colors"
            >
              <ShoppingCart className="h-6 w-6" />

              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-gray-700 hover:text-green-600 hover:bg-green-50/50 transition-all"
            >
              {isOpen ? (
                <X className="h-6 w-6 animate-spin-in" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <div className="px-4 pt-2 pb-4 space-y-1 bg-white/95 backdrop-blur-sm border-t shadow-inner">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center px-4 py-3 rounded-lg text-base font-medium transition-all ${
                isActivePath(item.href)
                  ? "text-green-700 bg-gradient-to-r from-green-50 to-emerald-50 shadow-sm"
                  : "text-gray-700 hover:text-green-700 hover:bg-green-50/50"
              }`}
              onClick={() => setIsOpen(false)}
            >
              <span className="mr-3 text-lg">{item.icon}</span>

              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
