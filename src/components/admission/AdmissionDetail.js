"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API + "/admission";

const initialForm = {
  title: "",
  startDate: "",
  endDate: "",
  selectionStartDate: "",
  selectionEndDate: "",
  trainingStartDate: "",
  link_register: "",
};

export default function AdmissionDetail() {
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");
  const router = useRouter();

  // โหลดข้อมูลทั้งหมด
  const fetchAdmissions = async () => {
    setLoading(true);
    try {
      const token = Cookies.get('auth-token');
      const res = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAdmissions(res.data);
    } catch (err) {
      setError("โหลดข้อมูลไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmissions();
  }, []);

  // เปิด modal สำหรับเพิ่ม/แก้ไข
  const openModal = (admission = null) => {
    if (admission) {
      setForm({
        title: admission.title || "",
        startDate: admission.startDate?.slice(0, 10) || "",
        endDate: admission.endDate?.slice(0, 10) || "",
        selectionStartDate: admission.selectionStartDate?.slice(0, 10) || "",
        selectionEndDate: admission.selectionEndDate?.slice(0, 10) || "",
        trainingStartDate: admission.trainingStartDate?.slice(0, 10) || "",
        link_register: admission.link_register || "",
      });
      setEditId(admission.id);
    } else {
      setForm(initialForm);
      setEditId(null);
    }
    setShowModal(true);
    setError("");
  };

  // ปิด modal
  const closeModal = () => {
    setShowModal(false);
    setForm(initialForm);
    setEditId(null);
    setError("");
  };

  // บันทึกข้อมูล (เพิ่ม/แก้ไข)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = Cookies.get('auth-token');
      if (!token) {
        router.push("/admin/login");
      }
      if (editId) {
        await axios.put(`${API_URL}/${editId}`, form, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        await axios.post(API_URL, form, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
      fetchAdmissions();
      closeModal();
    } catch (err) {
      setError("บันทึกข้อมูลไม่สำเร็จ");
    }
  };

  // ลบข้อมูล
  const handleDelete = async (id) => {
    if (!confirm("ยืนยันการลบข้อมูลนี้?")) return;
    try {
      const token = Cookies.get('auth-token');
      await axios.delete(`${API_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchAdmissions();
    } catch (err) {
      setError("ลบข้อมูลไม่สำเร็จ");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="bg-white flex items-center p-5 w-full drop-shadow-lg rounded-2xl mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 flex-1">จัดการ Admission</h1>
        <button
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors shadow"
          onClick={() => openModal()}
        >
          + เพิ่ม Admission
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
                  <th className="px-4 py-3 border-b border-gray-200 text-center font-semibold">หัวข้อ</th>
                  <th className="px-4 py-3 border-b border-gray-200 text-center font-semibold">วันรับสมัคร</th>
                  <th className="px-4 py-3 border-b border-gray-200 text-center font-semibold">วันคัดเลือก</th>
                  <th className="px-4 py-3 border-b border-gray-200 text-center font-semibold">วันเริ่มอบรม</th>
                  <th className="px-4 py-3 border-b border-gray-200 text-center font-semibold">ลิงก์ลงทะเบียน</th>
                  <th className="px-4 py-3 border-b border-gray-200 text-center font-semibold">การจัดการ</th>
                </tr>
              </thead>
              <tbody>
                {admissions.map((adm, idx) => (
                  <tr key={adm.id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50 hover:bg-green-50 transition-colors"}>
                    <td className="px-4 py-2 border-b border-gray-100 text-center align-middle">{idx + 1}</td>
                    <td className="px-4 py-2 border-b border-gray-100 align-middle">{adm.title}</td>
                    <td className="px-4 py-2 border-b border-gray-100 text-center align-middle whitespace-nowrap">
                      <span className="inline-block bg-green-100 text-green-800 rounded px-2 py-0.5 text-xs font-medium">
                        {adm.startDate?.slice(0, 10)}
                      </span>
                      <span className="mx-1 text-gray-400">ถึง</span>
                      <span className="inline-block bg-green-100 text-green-800 rounded px-2 py-0.5 text-xs font-medium">
                        {adm.endDate?.slice(0, 10)}
                      </span>
                    </td>
                    <td className="px-4 py-2 border-b border-gray-100 text-center align-middle whitespace-nowrap">
                      <span className="inline-block bg-yellow-100 text-yellow-800 rounded px-2 py-0.5 text-xs font-medium">
                        {adm.selectionStartDate?.slice(0, 10)}
                      </span>
                      <span className="mx-1 text-gray-400">ถึง</span>
                      <span className="inline-block bg-yellow-100 text-yellow-800 rounded px-2 py-0.5 text-xs font-medium">
                        {adm.selectionEndDate?.slice(0, 10)}
                      </span>
                    </td>
                    <td className="px-4 py-2 border-b border-gray-100 text-center align-middle whitespace-nowrap">
                      <span className="inline-block bg-blue-100 text-blue-800 rounded px-2 py-0.5 text-xs font-medium">
                        {adm.trainingStartDate?.slice(0, 10)}
                      </span>
                    </td>
                    <td className="px-4 py-2 border-b border-gray-100 text-center align-middle break-all">
                      {adm.link_register ? (
                        <a href={adm.link_register} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline break-all hover:text-blue-800 text-xs">{adm.link_register}</a>
                      ) : (
                        <span className="text-gray-400 text-xs">-</span>
                      )}
                    </td>
                    <td className="px-4 py-2 border-b border-gray-100 text-center align-middle space-x-2">
                      <button
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors shadow-sm text-xs font-medium"
                        onClick={() => openModal(adm)}
                      >
                        แก้ไข
                      </button>
                      <button
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors shadow-sm text-xs font-medium"
                        onClick={() => handleDelete(adm.id)}
                      >
                        ลบ
                      </button>
                    </td>
                  </tr>
                ))}
                {admissions.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-6 text-gray-400 text-base">ไม่พบข้อมูล</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal ฟอร์ม */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg relative animate-fadeIn">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl"
              onClick={closeModal}
            >
              ×
            </button>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">{editId ? "แก้ไข" : "เพิ่ม"} Admission</h2>
            {error && <div className="mb-2 text-red-500">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 text-gray-700">หัวข้อ</label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-green-200"
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-gray-700">วันรับสมัคร</label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-green-200"
                    value={form.startDate}
                    onChange={e => setForm({ ...form, startDate: e.target.value })}
                    required
                  />
                  <span>ถึง</span>
                  <input
                    type="date"
                    className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-green-200"
                    value={form.endDate}
                    onChange={e => setForm({ ...form, endDate: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block mb-1 text-gray-700">วันคัดเลือก</label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-green-200"
                    value={form.selectionStartDate}
                    onChange={e => setForm({ ...form, selectionStartDate: e.target.value })}
                    required
                  />
                  <span>ถึง</span>
                  <input
                    type="date"
                    className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-green-200"
                    value={form.selectionEndDate}
                    onChange={e => setForm({ ...form, selectionEndDate: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block mb-1 text-gray-700">วันเริ่มอบรม</label>
                <input
                  type="date"
                  className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-green-200"
                  value={form.trainingStartDate}
                  onChange={e => setForm({ ...form, trainingStartDate: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-gray-700">ลิงก์ลงทะเบียน</label>
                <input
                  type="url"
                  className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-200"
                  value={form.link_register}
                  onChange={e => setForm({ ...form, link_register: e.target.value })}
                  placeholder="https://example.com/register"
                />
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100"
                  onClick={closeModal}
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 shadow"
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
} 