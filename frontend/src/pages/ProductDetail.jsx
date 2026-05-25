import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Star,
  Plus,
  Minus,
  ShoppingCart,
  ChevronsRight,
  Info,
  FileText,
  MessageSquare,
} from "lucide-react";
import { getProductById, getRelatedProducts } from "../data/products";
import { useCart } from "../context/CartContext";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const item = id ? getProductById(id) : null;
  const related = item
    ? getRelatedProducts(item.category, item.id)
    : [];

  const [imageIndex, setImageIndex] = useState(0);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState("description");

  const { addToCart } = useCart();

  if (!item) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold">Product not found</h1>
        <Link
          to="/marketplace"
          className="text-green-600 hover:underline mt-4 inline-block"
        >
          Back to Marketplace
        </Link>
      </div>
    );
  }

  const addItem = () => {
    addToCart(
      {
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.images[0],
        category: item.category,
      },
      qty
    );
  };

  const buyNow = () => {
    addItem();
    navigate("/cart");
  };

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* IMAGE */}
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }}>
            <div className="sticky top-24">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
                <img
                  src={item.images[imageIndex]}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="grid grid-cols-4 gap-4">
                {item.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setImageIndex(i)}
                    className={`aspect-square rounded-md overflow-hidden ${
                      imageIndex === i
                        ? "ring-2 ring-green-500"
                        : "hover:ring-2 hover:ring-gray-300"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${item.name} ${i}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* INFO */}
          <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }}>
            <div className="text-sm uppercase text-gray-500 mb-2">
              {item.category}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {item.name}
            </h1>

            <div className="flex items-center mb-4">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.floor(item.rating)
                      ? "text-yellow-400 fill-current"
                      : "text-gray-300"
                  }`}
                />
              ))}
              <span className="ml-2 text-sm text-gray-600">
                {item.rating} ({item.reviews} reviews)
              </span>
            </div>

            <p className="text-gray-600 mb-6">
              {item.description.split("\n")[0]}
            </p>

            <div className="mb-6">
              <span className="text-3xl font-bold text-green-600">
                ₹{item.price}
              </span>
              <span className="ml-3 text-xl text-gray-400 line-through">
                ₹{item.originalPrice}
              </span>
              <span className="ml-3 bg-red-100 text-red-700 text-sm font-semibold px-3 py-1 rounded-full">
                {item.discount}% OFF
              </span>
            </div>

            <div className="flex items-center space-x-6 mb-8">
              <div className="flex items-center border rounded-lg">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="p-3 hover:bg-gray-100 rounded-l-lg"
                >
                  <Minus className="h-4 w-4" />
                </button>

                <span className="px-6 py-2 text-lg font-medium">
                  {qty}
                </span>

                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="p-3 hover:bg-gray-100 rounded-r-lg"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <span
                className={`font-medium ${
                  item.inStock ? "text-green-600" : "text-red-600"
                }`}
              >
                {item.inStock ? "In Stock" : "Out of Stock"}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button
                onClick={addItem}
                disabled={!item.inStock}
                className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center text-lg disabled:opacity-50"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </button>

              <button
                onClick={buyNow}
                disabled={!item.inStock}
                className="flex-1 bg-gray-800 text-white py-3 rounded-lg font-semibold flex items-center justify-center text-lg disabled:opacity-50"
              >
                <ChevronsRight className="mr-2 h-5 w-5" />
                Buy Now
              </button>
            </div>

            {/* TABS */}
            <div className="border-t pt-8">
              <div className="flex border-b mb-6">
                <button
                  onClick={() => setTab("description")}
                  className={`flex items-center px-6 py-3 ${
                    tab === "description"
                      ? "border-b-2 border-green-600 text-green-600"
                      : "text-gray-500"
                  }`}
                >
                  <Info className="mr-2 h-4 w-4" />
                  Description
                </button>

                <button
                  onClick={() => setTab("specs")}
                  className={`flex items-center px-6 py-3 ${
                    tab === "specs"
                      ? "border-b-2 border-green-600 text-green-600"
                      : "text-gray-500"
                  }`}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Specifications
                </button>

                <button
                  onClick={() => setTab("reviews")}
                  className={`flex items-center px-6 py-3 ${
                    tab === "reviews"
                      ? "border-b-2 border-green-600 text-green-600"
                      : "text-gray-500"
                  }`}
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Reviews
                </button>
              </div>

              <div className="prose max-w-none text-gray-600">
                {tab === "description" && <p>{item.description}</p>}
                {tab === "specs" && (
                  <ul className="space-y-2">
                    {Object.entries(item.specifications).map(
                      ([key, value]) => (
                        <li key={key}>
                          <strong>{key}:</strong> {value}
                        </li>
                      )
                    )}
                  </ul>
                )}
                {tab === "reviews" && <p>Reviews are coming soon!</p>}
              </div>
            </div>
          </motion.div>
        </div>

        {/* RELATED */}
        <div className="mt-24">
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((p) => (
              <Link
                to={`/product/${p.id}`}
                key={p.id}
                className="bg-white rounded-lg shadow hover:shadow-lg overflow-hidden"
              >
                <div className="aspect-square bg-gray-100 overflow-hidden">
                  <img
                    src={p.images[0]}
                    alt={p.name}
                    className="w-full h-full object-cover hover:scale-105 transition"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold truncate">{p.name}</h3>
                  <p className="text-green-600 font-bold">₹{p.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
