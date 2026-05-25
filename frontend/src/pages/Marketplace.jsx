import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  Star,
  ShoppingCart,
  Heart,
  Package,
  Truck,
  Shield,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { products } from "../data/products";

const Marketplace = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("popular");

  const { addToCart } = useCart();

  const categories = [
    { id: "all", name: "All Products", icon: "🌱" },
    { id: "seeds", name: "Seeds", icon: "🌰" },
    { id: "fertilizers", name: "Fertilizers", icon: "🧪" },
    { id: "tools", name: "Tools", icon: "🔧" },
    { id: "pesticides", name: "Pesticides", icon: "🛡️" },
    { id: "equipment", name: "Equipment", icon: "⚙️" },
  ];

  const filtered = products.filter((item) => {
    const matchSearch = item.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchCategory =
      category === "all" || item.category === category;
    return matchSearch && matchCategory;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sort === "price-low") return a.price - b.price;
    if (sort === "price-high") return b.price - a.price;
    if (sort === "rating") return b.rating - a.rating;
    return b.reviews - a.reviews;
  });

  const addItem = (e, item) => {
    e.preventDefault();
    addToCart(
      {
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.images[0],
        category: item.category,
      },
      1
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Agri Marketplace</h1>
          <p className="text-lg text-gray-600">
            Find all your farming supplies in one place
          </p>
        </div>

        {/* SEARCH */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
            >
              <option value="popular">Most Popular</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* CATEGORIES */}
          <div className="lg:w-64">
            <div className="bg-white rounded-lg shadow p-6 sticky top-24">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Filter className="mr-2 h-5 w-5" />
                Categories
              </h3>

              <div className="space-y-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setCategory(cat.id)}
                    className={`w-full flex items-center px-3 py-2 rounded-lg ${
                      category === cat.id
                        ? "bg-green-100 text-green-700"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <span className="mr-2">{cat.icon}</span>
                    {cat.name}
                  </button>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t">
                <h4 className="font-medium mb-3">Why Shop With Us</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 mr-2 text-green-600" />
                    Quality Guaranteed
                  </div>
                  <div className="flex items-center">
                    <Truck className="h-4 w-4 mr-2 text-blue-600" />
                    Fast Delivery
                  </div>
                  <div className="flex items-center">
                    <Package className="h-4 w-4 mr-2 text-purple-600" />
                    Secure Packaging
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* PRODUCTS */}
          <div className="flex-1">
            <p className="mb-4 text-gray-600">
              Showing {sorted.length} products
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sorted.map((item, i) => (
                <Link to={`/product/${item.id}`} key={item.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-white rounded-lg shadow hover:shadow-lg overflow-hidden h-full flex flex-col"
                  >
                    <div className="relative">
                      <img
                        src={item.images[0]}
                        alt={item.name}
                        className="w-full h-48 object-cover"
                      />
                      <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-xs rounded">
                        {item.discount}% OFF
                      </span>
                      <button className="absolute top-2 right-2 bg-white p-2 rounded-full">
                        <Heart className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="p-4 flex flex-col flex-grow">
                      <span className="text-xs text-green-600 uppercase">
                        {item.category}
                      </span>

                      <h3 className="text-lg font-semibold mt-2 flex-grow">
                        {item.name}
                      </h3>

                      <p className="text-sm text-gray-600">{item.brand}</p>

                      <div className="flex items-center my-2">
                        {[...Array(5)].map((_, j) => (
                          <Star
                            key={j}
                            className={`h-4 w-4 ${
                              j < Math.floor(item.rating)
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                        <span className="ml-2 text-sm">
                          {item.rating} ({item.reviews})
                        </span>
                      </div>

                      <div className="flex justify-between items-center mb-3">
                        <div>
                          <span className="text-lg font-bold">
                            ₹{item.price}
                          </span>
                          <span className="ml-2 text-sm line-through text-gray-500">
                            ₹{item.originalPrice}
                          </span>
                        </div>
                        <span
                          className={`px-2 py-1 text-xs rounded ${
                            item.inStock
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {item.inStock ? "In Stock" : "Out of Stock"}
                        </span>
                      </div>

                      <button
                        onClick={(e) => addItem(e, item)}
                        disabled={!item.inStock}
                        className="mt-auto bg-green-600 text-white py-2 rounded-lg flex items-center justify-center disabled:opacity-50"
                      >
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Add to Cart
                      </button>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>

            {sorted.length === 0 && (
              <div className="text-center py-12">
                <Search className="mx-auto h-8 w-8 text-gray-400 mb-4" />
                <p className="text-gray-500">
                  No products found matching your criteria.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
