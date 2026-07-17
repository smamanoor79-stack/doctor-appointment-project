"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Edit3,
  Sparkles,
  Stethoscope,
  Syringe,
  ShieldCheck,
  Zap,
  Wand2,
  Loader2,
  X
} from "lucide-react";

// Icon mapping taake database ki string se icon render ho sake
const iconMap = { Stethoscope, Sparkles, Syringe, ShieldCheck, Zap, Wand2 };

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    desc: "",
    price: "",
    icon: "Sparkles",
  });

  // 1. Fetch Services on Load
  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/services");
      const data = await res.json();
      if (Array.isArray(data)) setServices(data);
    } catch (err) {
      console.error("Error fetching services:", err);
    } finally {
      setLoading(false);
    }
  };

  // 2. Open Modal for Add/Edit
  const openModal = (service = null) => {
    if (service) {
      setEditingService(service);
      setFormData({
        title: service.title,
        desc: service.desc,
        price: service.price,
        icon: service.icon || "Sparkles",
      });
    } else {
      setEditingService(null);
      setFormData({ title: "", desc: "", price: "", icon: "Sparkles" });
    }
    setIsModalOpen(true);
  };

  // 3. Handle Form Submit (Add or Edit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingService ? `/api/services/${editingService._id}` : "/api/services";
      const method = editingService ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchServices(); // Refresh list
      }
    } catch (err) {
      console.error("Error saving service:", err);
    }
  };

  // 4. Handle Delete
  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this service?")) {
      try {
        const res = await fetch(`/api/services/${id}`, { method: "DELETE" });
        if (res.ok) {
          setServices(services.filter((s) => s._id !== id));
        }
      } catch (err) {
        console.error("Error deleting service:", err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#fbf9f4] p-6 md:p-10 text-[#162421]">

      {/* ===== Header Bar ===== */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold font-serif text-[#1a3430]">Services Management</h1>
          <p className="text-sm text-[#5e6d6b] mt-1">Manage, edit, or add clinic services for the public page.</p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-[#e88b6f] hover:bg-[#d67a5e] text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition self-start shadow-sm"
        >
          <Plus size={18} /> Add New Service
        </button>
      </div>

      {/* ===== Loader ===== */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-[#1a3430]" size={40} />
        </div>
      ) : (
        /* ===== Services Grid / List ===== */
        <div className="grid grid-cols-1 gap-4">
          {services.map((service) => {
            const IconComponent = iconMap[service.icon] || Sparkles;
            return (
              <div
                key={service._id}
                className="bg-white border border-[#d9e9e5] rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm hover:shadow-md transition"
              >
                <div className="flex items-start gap-4">
                  <div className="bg-[#d9e9e5]/50 text-[#1a3430] rounded-xl p-3 shrink-0">
                    <IconComponent size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-[#1a3430]">{service.title}</h3>
                    <p className="text-sm text-[#5e6d6b] mt-0.5">{service.desc}</p>
                    <span className="inline-block mt-2 bg-[#d9e9e5] text-[#1a3430] text-xs font-semibold px-2.5 py-1 rounded-md">
                      Base Price: {service.price}
                    </span>
                  </div>
                </div>

                {/* ===== Actions ===== */}
                <div className="flex items-center gap-2 sm:self-center self-end border-t sm:border-t-0 pt-3 sm:pt-0 w-full sm:w-auto justify-end">
                  <button
                    onClick={() => openModal(service)}
                    className="p-2 text-[#1a3430] hover:bg-[#d9e9e5]/40 rounded-xl transition"
                    title="Edit Service"
                  >
                    <Edit3 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(service._id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition"
                    title="Delete Service"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            );
          })}

          {services.length === 0 && (
            <p className="text-center text-[#5e6d6b] py-10">No services found. Click 'Add New Service' to create one.</p>
          )}
        </div>
      )}

      {/* ===== Add/Edit Modal Form ===== */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden border border-[#d9e9e5] animate-in fade-in-50 zoom-in-95 duration-200">

            {/* Modal Header */}
            <div className="bg-[#1a3430] text-white px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold font-serif">
                {editingService ? "Edit Clinic Service" : "Add New Clinic Service"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-white/80 hover:text-white transition">
                <X size={20} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#1a3430] uppercase mb-1">Service Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Acne Treatment"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-[#fbf9f4] border border-[#d9e9e5] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#e88b6f] transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1a3430] uppercase mb-1">Description</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe the treatment..."
                  value={formData.desc}
                  onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                  className="w-full bg-[#fbf9f4] border border-[#d9e9e5] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#e88b6f] transition resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1a3430] uppercase mb-1">Price Label</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., $150+ or Rs. 3000"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full bg-[#fbf9f4] border border-[#d9e9e5] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#e88b6f] transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1a3430] uppercase mb-1">Display Icon</label>
                  <select
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full bg-[#fbf9f4] border border-[#d9e9e5] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#e88b6f] transition appearance-none"
                  >
                    <option value="Sparkles">Sparkles ✨</option>
                    <option value="Stethoscope">Stethoscope 🩺</option>
                    <option value="Syringe">Syringe 💉</option>
                    <option value="ShieldCheck">Shield Check 🛡️</option>
                    <option value="Zap">Laser/Zap ⚡</option>
                    <option value="Wand2">Aesthetic Wand 🪄</option>
                  </select>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end gap-3 mt-4 border-t pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-[#5e6d6b] hover:bg-gray-100 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#1a3430] hover:bg-[#11221f] text-white px-5 py-2 rounded-xl text-sm font-semibold transition"
                >
                  {editingService ? "Update Service" : "Create Service"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}