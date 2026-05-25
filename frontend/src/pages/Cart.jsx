import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  CreditCard,
  Truck,
  ArrowRight,
} from "lucide-react";
import { useCart } from "../context/CartContext";

const CartPage = () => {
  const {
    cartItems: items,
    updateQuantity: changeQty,
    removeFromCart: removeItem,
    clearCart: clearAll,
    getTotalPrice: calculateTotal,
  } = useCart();

  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const placeOrder = async () => {
    setLoading(true);

    await new Promise((res) => setTimeout(res, 2000));

    alert("Order placed successfully! 🎉");
    clearAll();
    setLoading(false);
    setShowForm(false);
  };

  const shipping =
    items.length > 0 ? (calculateTotal() > 500 ? 0 : 50) : 0;

  const finalTotal = calculateTotal() + shipping;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center py-16">
            <div className="bg-gray-100 rounded-full p-8 w-32 h-32 mx-auto mb-6">
              <ShoppingBag className="h-16 w-16 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">
              Add products to start shopping.
            </p>
            <a
              href="/marketplace"
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold inline-flex items-center"
            >
              Continue Shopping
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">
                Items ({items.length})
              </h2>
            </div>

            {items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 border-b"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded"
                  />

                  <div className="flex-1">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-500">{item.category}</p>
                    <p className="text-green-600 font-bold">
                      ₹{item.price}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex border rounded">
                      <button
                        onClick={() =>
                          changeQty(item.id, item.quantity - 1)
                        }
                        className="p-2"
                      >
                        <Minus size={16} />
                      </button>

                      <span className="px-3 py-2">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          changeQty(item.id, item.quantity + 1)
                        }
                        className="p-2"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-600 p-2"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <h2 className="text-xl font-semibold mb-4">Summary</h2>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{calculateTotal()}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
              </div>
              <hr />
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>₹{finalTotal}</span>
              </div>
            </div>

            <button
              onClick={() => setShowForm(true)}
              className="w-full bg-green-600 text-white py-2 rounded mb-2"
            >
              Checkout
            </button>

            <a
              href="/marketplace"
              className="block text-center border py-2 rounded"
            >
              Continue Shopping
            </a>

            <div className="mt-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Truck size={16} /> Fast delivery
              </div>
              <div className="flex items-center gap-2">
                <CreditCard size={16} /> Secure payment
              </div>
            </div>
          </motion.div>
        </div>

        {/* Checkout Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="bg-white p-6 rounded w-full max-w-md"
            >
              <h3 className="text-lg font-semibold mb-4">
                Checkout
              </h3>

              <input
                placeholder="Full Name"
                className="w-full border p-2 mb-3 rounded"
              />
              <input
                placeholder="Phone Number"
                className="w-full border p-2 mb-3 rounded"
              />
              <textarea
                placeholder="Address"
                rows={3}
                className="w-full border p-2 mb-4 rounded"
              />

              <div className="flex justify-between font-bold mb-4">
                <span>Total</span>
                <span>₹{finalTotal}</span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setShowForm(false)}
                  className="flex-1 border py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={placeOrder}
                  disabled={loading}
                  className="flex-1 bg-green-600 text-white py-2 rounded"
                >
                  {loading ? "Processing..." : "Place Order"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
