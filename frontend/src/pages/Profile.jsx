import React, { useEffect, useMemo, useRef, useState } from "react";

import {
  User,
  Mail,
  Phone,
  MapPin,
  Leaf,
  Shield,
  Camera,
  Edit3,
  Save,
  Activity,
  TrendingUp,
  Droplets,
  Tractor,
  Wheat,
  Lock,
  Clock,
  CheckCircle,
  ChevronRight,
  Sprout,
  BarChart3,
} from "lucide-react";

import { motion } from "framer-motion";

import { useAuth } from "../context/AuthContext";

import userService from "../services/userService";

const Profile = () => {
  const { user } = useAuth();

  const [isEditing, setIsEditing] = useState(false);

  const [loading, setLoading] = useState(false);

  const [previewImage, setPreviewImage] = useState("");

  const overviewRef = useRef(null);

  const analyticsRef = useRef(null);

  const activityRef = useRef(null);

  const securityRef = useRef(null);

  const [activeSection, setActiveSection] = useState("overview");

  const [profile, setProfile] = useState({
    name: user?.name || "",

    email: user?.email || "",

    phone: user?.phone || "",

    address: user?.address || "",

    bio:
      user?.bio ||
      "AI-powered smart farmer focused on sustainable agriculture and intelligent crop management.",

    farmSize: user?.farmSize || "",

    farmUnit: user?.farmUnit || "Acres",

    crops: user?.crops || "",

    soilType: user?.soilType || "",

    irrigation: user?.irrigation || "Drip",

    experience: user?.experience || "",

    livestock: user?.livestock || "",

    profileImage: user?.profileImage || "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);

        const data = await userService.getProfile();

        setProfile(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfile({
      ...profile,

      [e.target.name]: e.target.value,
    });
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);

      const updatedUser = await userService.updateProfile(profile);

      const oldUser = JSON.parse(localStorage.getItem("user"));

      const newUser = {
        ...oldUser,

        ...updatedUser,
      };

      localStorage.setItem(
        "user",

        JSON.stringify(newUser),
      );

      setIsEditing(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    try {
      const file = e.target.files[0];

      if (!file) return;

      setPreviewImage(URL.createObjectURL(file));

      const data = await userService.uploadProfileImage(file);

      const updatedProfile = {
        ...profile,

        profileImage: data.image,
      };

      setProfile(updatedProfile);

      await userService.updateProfile(updatedProfile);
    } catch (error) {
      console.error(error);
    }
  };

  const scrollToSection = (ref, section) => {
    setActiveSection(section);

    const yOffset = -110;

    const element = ref.current;

    const y =
      element.getBoundingClientRect().top + window.pageYOffset + yOffset;

    window.scrollTo({
      top: y,
      behavior: "smooth",
    });
  };

  const completionPercentage = useMemo(() => {
    const fields = [
      profile.name,

      profile.email,

      profile.phone,

      profile.address,

      profile.bio,

      profile.farmSize,

      profile.crops,

      profile.soilType,

      profile.irrigation,

      profile.experience,

      profile.livestock,
    ];

    const completed = fields.filter(Boolean).length;

    return Math.round((completed / fields.length) * 100);
  }, [profile]);

  const stats = [
    {
      title: "Disease Scans",

      value: "148",

      icon: Activity,

      color: "from-red-500 to-orange-500",
    },

    {
      title: "Crop Predictions",

      value: "96",

      icon: TrendingUp,

      color: "from-green-500 to-emerald-500",
    },

    {
      title: "Avg Confidence",

      value: "91%",

      icon: CheckCircle,

      color: "from-blue-500 to-cyan-500",
    },

    {
      title: "Marketplace Orders",

      value: "32",

      icon: Tractor,

      color: "from-purple-500 to-pink-500",
    },
  ];

  const activities = [
    {
      title: "Disease scan completed",

      desc: "Tomato Early Blight detected",

      time: "2 hours ago",

      color: "bg-red-500",
    },

    {
      title: "Crop recommendation generated",

      desc: "Rice suggested for current season",

      time: "5 hours ago",

      color: "bg-green-500",
    },

    {
      title: "Marketplace order placed",

      desc: "Organic fertilizer purchased",

      time: "1 day ago",

      color: "bg-purple-500",
    },

    {
      title: "Weather alert received",

      desc: "Heavy rainfall expected tomorrow",

      time: "2 days ago",

      color: "bg-blue-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <div className="flex">
        {/* SIDEBAR */}

        <div className="hidden lg:block w-80">
          <div className="sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto p-6">
            <motion.div
              initial={{
                x: -20,
                opacity: 0,
              }}
              animate={{
                x: 0,
                opacity: 1,
              }}
              className="bg-white/80 backdrop-blur-xl rounded-3xl border border-green-100 shadow-xl p-6"
            >
              <div className="flex flex-col items-center">
                <div className="relative">
                  <img
                    src={
                      previewImage
                        ? previewImage
                        : profile.profileImage
                          ? `http://localhost:5000${profile.profileImage}`
                          : "https://api.dicebear.com/7.x/fun-emoji/svg?seed=farmer"
                    }
                    alt="avatar"
                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-xl"
                  />

                  <label className="absolute bottom-1 right-1 bg-green-600 p-2 rounded-full cursor-pointer shadow-lg hover:bg-green-700 transition">
                    <Camera className="h-4 w-4 text-white" />

                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                <h2 className="mt-5 text-2xl font-bold text-gray-800">
                  {profile.name || "Farmer"}
                </h2>

                <p className="text-gray-500 text-sm">Smart Agriculture User</p>
              </div>

              {/* COMPLETION */}

              <div className="mt-8">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Profile Completion
                  </span>

                  <span className="text-sm font-bold text-green-700">
                    {completionPercentage}%
                  </span>
                </div>

                <div className="w-full h-3 rounded-full bg-gray-200 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-500"
                    style={{
                      width: `${completionPercentage}%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* SIDEBAR NAV */}

              <div className="mt-10 space-y-3">
                <button
                  onClick={() => scrollToSection(overviewRef, "overview")}
                  className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl transition-all ${
                    activeSection === "overview"
                      ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg"
                      : "hover:bg-green-50 text-gray-700"
                  }`}
                >
                  <div className="flex items-center">
                    <User className="mr-3 h-5 w-5" />
                    Overview
                  </div>

                  <ChevronRight className="h-4 w-4" />
                </button>

                <button
                  onClick={() => scrollToSection(analyticsRef, "analytics")}
                  className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl transition-all ${
                    activeSection === "analytics"
                      ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg"
                      : "hover:bg-green-50 text-gray-700"
                  }`}
                >
                  <div className="flex items-center">
                    <BarChart3 className="mr-3 h-5 w-5" />
                    Analytics
                  </div>

                  <ChevronRight className="h-4 w-4" />
                </button>

                <button
                  onClick={() => scrollToSection(activityRef, "activity")}
                  className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl transition-all ${
                    activeSection === "activity"
                      ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg"
                      : "hover:bg-green-50 text-gray-700"
                  }`}
                >
                  <div className="flex items-center">
                    <Activity className="mr-3 h-5 w-5" />
                    Activity
                  </div>

                  <ChevronRight className="h-4 w-4" />
                </button>

                <button
                  onClick={() => scrollToSection(securityRef, "security")}
                  className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl transition-all ${
                    activeSection === "security"
                      ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg"
                      : "hover:bg-green-50 text-gray-700"
                  }`}
                >
                  <div className="flex items-center">
                    <Shield className="mr-3 h-5 w-5" />
                    Security
                  </div>

                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* MAIN */}

        <div className="flex-1 p-6 lg:p-10">
          {/* HERO */}

          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 p-8 shadow-2xl"
          >
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

            <div className="relative flex flex-col xl:flex-row xl:items-center xl:justify-between">
              <div className="flex items-center">
                <img
                  src={
                    previewImage
                      ? previewImage
                      : profile.profileImage
                        ? `http://localhost:5000${profile.profileImage}`
                        : "https://api.dicebear.com/7.x/fun-emoji/svg?seed=farmer"
                  }
                  alt="avatar"
                  className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-xl"
                />

                <div className="ml-6">
                  <h1 className="text-4xl font-bold text-white">
                    {profile.name || "Farmer"}
                  </h1>

                  <div className="flex items-center mt-3">
                    <span className="px-4 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-sm">
                      Smart Agriculture Expert
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  if (isEditing) {
                    handleSaveProfile();
                  } else {
                    setIsEditing(true);
                  }
                }}
                className="mt-6 xl:mt-0 flex items-center justify-center bg-white text-green-700 px-8 py-4 rounded-2xl font-semibold shadow-lg hover:scale-105 transition-all"
              >
                {isEditing ? (
                  <Save className="mr-2 h-5 w-5" />
                ) : (
                  <Edit3 className="mr-2 h-5 w-5" />
                )}

                {loading
                  ? "Saving..."
                  : isEditing
                    ? "Save Profile"
                    : "Edit Profile"}
              </button>
            </div>
          </motion.div>

          {/* ANALYTICS */}

          <section ref={analyticsRef} className="mt-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
              {stats.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: index * 0.1,
                  }}
                  className="relative overflow-hidden bg-white rounded-3xl p-6 border border-green-100 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1"
                >
                  <div
                    className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${item.color} opacity-10 rounded-full blur-2xl`}
                  ></div>

                  <div className="relative flex justify-between items-center">
                    <div>
                      <p className="text-gray-500 text-sm">{item.title}</p>

                      <h3 className="text-4xl font-bold text-gray-800 mt-3">
                        {item.value}
                      </h3>
                    </div>

                    <div
                      className={`bg-gradient-to-r ${item.color} p-4 rounded-2xl shadow-lg`}
                    >
                      <item.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* OVERVIEW */}

          <section ref={overviewRef} className="mt-10">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {/* PERSONAL */}

              <div className="bg-white rounded-[2rem] border border-green-100 shadow-xl p-8">
                <div className="flex items-center mb-8">
                  <div className="bg-green-100 p-3 rounded-2xl">
                    <User className="h-6 w-6 text-green-700" />
                  </div>

                  <div className="ml-4">
                    <h2 className="text-2xl font-bold text-gray-800">
                      Personal Information
                    </h2>

                    <p className="text-gray-500 text-sm mt-1">
                      Manage your personal details
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-gray-600">
                      Full Name
                    </label>

                    <div className="relative mt-2">
                      <User className="absolute left-4 top-4 h-5 w-5 text-gray-400" />

                      <input
                        type="text"
                        name="name"
                        value={profile.name}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-400 outline-none transition"
                        placeholder="Enter full name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Email Address
                    </label>

                    <div className="relative mt-2">
                      <Mail className="absolute left-4 top-4 h-5 w-5 text-gray-400" />

                      <input
                        type="email"
                        name="email"
                        value={profile.email}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 bg-gray-50"
                        placeholder="Enter email"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Phone Number
                    </label>

                    <div className="relative mt-2">
                      <Phone className="absolute left-4 top-4 h-5 w-5 text-gray-400" />

                      <input
                        type="text"
                        name="phone"
                        value={profile.phone}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 bg-gray-50"
                        placeholder="+91 9876543210"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-gray-600">
                      Address
                    </label>

                    <div className="relative mt-2">
                      <MapPin className="absolute left-4 top-4 h-5 w-5 text-gray-400" />

                      <input
                        type="text"
                        name="address"
                        value={profile.address}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 bg-gray-50"
                        placeholder="Enter address"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-gray-600">
                      Bio
                    </label>

                    <textarea
                      rows="4"
                      name="bio"
                      value={profile.bio}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full mt-2 px-5 py-4 rounded-2xl border border-gray-200 bg-gray-50 resize-none"
                      placeholder="Write about yourself"
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* FARM DETAILS */}

              <div className="bg-white rounded-[2rem] border border-green-100 shadow-xl p-8">
                <div className="flex items-center mb-8">
                  <div className="bg-emerald-100 p-3 rounded-2xl">
                    <Sprout className="h-6 w-6 text-emerald-700" />
                  </div>

                  <div className="ml-4">
                    <h2 className="text-2xl font-bold text-gray-800">
                      Farm Details
                    </h2>

                    <p className="text-gray-500 text-sm mt-1">
                      Agriculture & farming information
                    </p>
                  </div>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Farm Size
                    </label>

                    <div className="grid grid-cols-3 gap-3 mt-2">
                      <div className="col-span-2 relative">
                        <Leaf className="absolute left-4 top-4 h-5 w-5 text-gray-400" />

                        <input
                          type="number"
                          name="farmSize"
                          value={profile.farmSize}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 bg-gray-50"
                          placeholder="12"
                        />
                      </div>

                      <select
                        name="farmUnit"
                        value={profile.farmUnit}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="px-4 py-4 rounded-2xl border border-gray-200 bg-gray-50"
                      >
                        <option>Acres</option>

                        <option>Hectares</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Crops Grown
                    </label>

                    <input
                      type="text"
                      name="crops"
                      value={profile.crops}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full mt-2 px-5 py-4 rounded-2xl border border-gray-200 bg-gray-50"
                      placeholder="Rice, Cotton, Tomato"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Soil Type
                      </label>

                      <select
                        name="soilType"
                        value={profile.soilType}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full mt-2 px-5 py-4 rounded-2xl border border-gray-200 bg-gray-50"
                      >
                        <option value="">Select Soil</option>

                        <option>Black Soil</option>

                        <option>Red Soil</option>

                        <option>Clay Soil</option>

                        <option>Sandy Soil</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Irrigation
                      </label>

                      <select
                        name="irrigation"
                        value={profile.irrigation}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full mt-2 px-5 py-4 rounded-2xl border border-gray-200 bg-gray-50"
                      >
                        <option>Drip</option>

                        <option>Sprinkler</option>

                        <option>Flood</option>

                        <option>Rain-fed</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Farming Experience
                      </label>

                      <input
                        type="number"
                        name="experience"
                        value={profile.experience}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full mt-2 px-5 py-4 rounded-2xl border border-gray-200 bg-gray-50"
                        placeholder="8 Years"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Livestock
                      </label>

                      <input
                        type="text"
                        name="livestock"
                        value={profile.livestock}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full mt-2 px-5 py-4 rounded-2xl border border-gray-200 bg-gray-50"
                        placeholder="Cows, Goats"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ACTIVITY + SECURITY */}

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-10">
            {/* ACTIVITY */}

            <section
              ref={activityRef}
              className="bg-white rounded-[2rem] border border-green-100 shadow-xl p-8"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-8">
                Recent Activity
              </h2>

              <div className="space-y-8">
                {activities.map((item, index) => (
                  <div key={index} className="relative flex">
                    <div className="flex flex-col items-center">
                      <div
                        className={`${item.color} w-5 h-5 rounded-full shadow-lg`}
                      ></div>

                      {index !== activities.length - 1 && (
                        <div className="w-1 h-20 bg-gray-200 rounded-full mt-2"></div>
                      )}
                    </div>

                    <div className="ml-5 bg-gray-50 rounded-2xl p-5 flex-1">
                      <h4 className="font-semibold text-gray-800">
                        {item.title}
                      </h4>

                      <p className="text-gray-500 text-sm mt-2">{item.desc}</p>

                      <div className="flex items-center text-xs text-gray-400 mt-3">
                        <Clock className="h-3 w-3 mr-1" />

                        {item.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* SECURITY */}

            <section
              ref={securityRef}
              className="bg-white rounded-[2rem] border border-green-100 shadow-xl p-8"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-8">
                Security Settings
              </h2>

              <div className="space-y-5">
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Current Password
                  </label>

                  <div className="relative mt-2">
                    <Lock className="absolute left-4 top-4 h-5 w-5 text-gray-400" />

                    <input
                      type="password"
                      placeholder="Enter current password"
                      className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 bg-gray-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">
                    New Password
                  </label>

                  <div className="relative mt-2">
                    <Shield className="absolute left-4 top-4 h-5 w-5 text-gray-400" />

                    <input
                      type="password"
                      placeholder="Enter new password"
                      className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 bg-gray-50"
                    />
                  </div>
                </div>

                <button className="w-full bg-gradient-to-r from-green-600 to-emerald-500 text-white py-4 rounded-2xl font-semibold shadow-lg hover:scale-[1.01] transition-all">
                  Update Password
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
