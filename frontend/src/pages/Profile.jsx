import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";

const Profile = () => {
  const { backendUrl, token } = useContext(ShopContext);
  const [form, setForm] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchUser = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/user/profile`, {
        headers: { token },
      });

      if (response.data.success) {
        setForm({
          name: response.data.user.name || "",
          email: response.data.user.email || "",
        });
      } else {
        setError(response.data.message || "Failed to fetch user data.");
      }
    } catch (err) {
      console.error(err);
      setError("Error fetching user data.");
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    setSaving(true);
    try {
      const response = await axios.post(`${backendUrl}/api/user/update`, form, {
        headers: { token },
      });

      if (response.data.success) {
        toast.success("Profile updated successfully");
        fetchUser();
      } else {
        toast.error(response.data.message || "Failed to update profile");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error updating profile");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUser();
     }
  }, [token]);

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-4 max-w-md mx-auto bg-white shadow rounded-lg mt-6">
      <h2 className="text-xl font-semibold text-center mb-4">Your Profile</h2>

      {/* Editable Name & Email */}
      <div className="border-b pb-4 mb-4">
        <label className="block text-sm font-medium">Name</label>
        <input
          type="text"
          className="w-full mt-1 p-2 border rounded"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <label className="block text-sm font-medium mt-3">Email</label>
        <input
          type="email"
          className="w-full mt-1 p-2 border rounded"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <button 
          onClick={updateProfile} 
          disabled={saving} 
          className="mt-3 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
          {saving ? "Updating..." : "Update"}
        </button>
      </div>
    </div>
  );
};

export default Profile;