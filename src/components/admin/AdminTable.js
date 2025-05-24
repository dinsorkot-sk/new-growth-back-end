"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const AdminTable = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");

  // Fetch admins data
  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const token = Cookies.get("auth-token");
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API}/get-all-admins`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      // Handle nested admins array in response
      const adminData = response.data?.admins || [];
      setAdmins(adminData);
    } catch (err) {
      setError("Failed to fetch admin data");
      console.error("Error fetching admins:", err);
      setAdmins([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  // Open modal for add/edit
  const openModal = (admin = null) => {
    if (admin) {
      setFormData({
        username: admin.username || "",
        email: admin.email || "",
        password: ""
      });
      setEditId(admin.id);
    } else {
      setFormData({
        username: "",
        email: "",
        password: ""
      });
      setEditId(null);
    }
    setShowModal(true);
    setError("");
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setFormData({
      username: "",
      email: "",
      password: ""
    });
    setEditId(null);
    setError("");
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = Cookies.get("auth-token");
      if (editId) {
        await axios.put(`${process.env.NEXT_PUBLIC_API}/${editId}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      } else {
        await axios.post(`${process.env.NEXT_PUBLIC_API}/`, formData, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      }
      fetchAdmins();
      closeModal();
    } catch (err) {
      setError("Failed to save admin data");
      console.error(err);
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this admin?")) return;
    try {
      const token = Cookies.get("auth-token");
      await axios.delete(`${process.env.NEXT_PUBLIC_API}/delete-admin-by-id/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      fetchAdmins();
    } catch (err) {
      setError("Failed to delete admin");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="bg-white flex items-center p-5 w-full drop-shadow-lg rounded-2xl mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 flex-1">จัดการผู้ดูแลระบบ</h1>
        <button
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors shadow"
          onClick={() => openModal()}
        >
          + เพิ่มผู้ดูแลระบบ
        </button>
      </div>

      <div className="bg-white drop-shadow-lg rounded-2xl px-6 py-8">
        {loading ? (
          <div className="text-center py-8 text-gray-500">กำลังโหลดข้อมูล...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-xl text-sm">
              <thead>
                <tr className="bg-gradient-to-r from-green-100 to-green-200 text-green-900">
                  <th className="px-4 py-3 border-b border-gray-200 text-center font-semibold">#</th>
                  <th className="px-4 py-3 border-b border-gray-200 text-center font-semibold">ชื่อผู้ใช้</th>
                  <th className="px-4 py-3 border-b border-gray-200 text-center font-semibold">อีเมล</th>
                  <th className="px-4 py-3 border-b border-gray-200 text-center font-semibold">การจัดการ</th>
                </tr>
              </thead>
              <tbody>
                {admins.map((admin, idx) => (
                  <tr key={admin.id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50 hover:bg-green-50 transition-colors"}>
                    <td className="px-4 py-2 border-b border-gray-100 text-center align-middle">{idx + 1}</td>
                    <td className="px-4 py-2 border-b border-gray-100 align-middle">{admin.username}</td>
                    <td className="px-4 py-2 border-b border-gray-100 align-middle">{admin.email}</td>
                    <td className="px-4 py-2 border-b border-gray-100 text-center align-middle space-x-2">
                      <button
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors shadow-sm text-xs font-medium"
                        onClick={() => openModal(admin)}
                      >
                        แก้ไข
                      </button>
                      <button
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors shadow-sm text-xs font-medium"
                        onClick={() => handleDelete(admin.id)}
                      >
                        ลบ
                      </button>
                    </td>
                  </tr>
                ))}
                {admins.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center py-6 text-gray-400 text-base">ไม่พบข้อมูล</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">
              {editId ? "แก้ไขผู้ดูแลระบบ" : "เพิ่มผู้ดูแลระบบ"}
            </h2>
            
            {error && (
              <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ชื่อผู้ใช้
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  อีเมล
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  รหัสผ่าน
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required={!editId}
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {editId ? "บันทึก" : "เพิ่ม"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTable; 