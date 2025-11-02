// 'use client'

// import { useEffect, useState } from 'react'
// import axios from '@/lib/axios'
// import toast from 'react-hot-toast'

// type Admin = {
//   _id: string
//   name: string
//   email: string
//   role: 'admin' | 'superadmin'
// }

// export default function AdminManagePage() {
//   const [admins, setAdmins] = useState<Admin[]>([])
//   const [form, setForm] = useState({ name: '', email: '', password: '', role: 'admin' })
//   const [editingId, setEditingId] = useState<string | null>(null)
//   const [editing, setEditing] = useState({ email: '', role: 'admin' })
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     fetchAdmins()
//   }, [])

//   const fetchAdmins = async () => {
//     try {
//       const { data } = await axios.get('/admins')
//       setAdmins(data)
//     } catch (err) {
//       toast.error('Failed to load admins')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleCreate = async (e: React.FormEvent) => {
//     e.preventDefault()
//     try {
//       await axios.post('/create-admin', form)
//       toast.success('Admin created')
//       setForm({ name: '', email: '', password: '', role: 'admin' })
//       fetchAdmins()
//     } catch (err: any) {
//       toast.error(err.response?.data?.message || 'Create failed')
//     }
//   }

//   const handleDelete = async (id: string) => {
//     if (!confirm('Are you sure you want to delete this admin?')) return
//     try {
//       await axios.delete(`/admins/${id}`)
//       toast.success('Admin deleted')
//       setAdmins((prev) => prev.filter((a) => a._id !== id))
//     } catch (err) {
//       toast.error('Delete failed')
//     }
//   }

//   const handleEdit = (admin: Admin) => {
//     setEditingId(admin._id)
//     setEditing({ email: admin.email, role: admin.role })
//   }

//   const handleUpdate = async (id: string) => {
//     try {
//       await axios.put(`/admins/${id}`, editing)
//       toast.success('Admin updated')
//       setEditingId(null)
//       fetchAdmins()
//     } catch (err) {
//       toast.error('Update failed')
//     }
//   }

//   if (loading) return <p className="p-6">Loading admins...</p>

//   return (
//     <div className="p-6 max-w-5xl mx-auto mt-36 text-black">
//       <h1 className="text-3xl font-bold mb-6 text-white">Manage Admins</h1>

//       {/* Create Form */}
//       <form onSubmit={handleCreate} className="bg-white p-4 rounded-lg shadow mb-8 space-y-4">
//         <h2 className="text-xl font-semibold">Create New Admin</h2>
//         <div className="grid sm:grid-cols-2 gap-4">
//           <input
//             type="text"
//             required
//             placeholder="Name"
//             value={form.name}
//             onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
//             className="input border rounded-2xl p-3 w-full"
//           />
//           <input
//             type="email"
//             required
//             placeholder="Email"
//             value={form.email}
//             onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
//             className="input border rounded-2xl p-3 w-full"
//           />
//           <input
//             type="password"
//             required
//             placeholder="Password"
//             value={form.password}
//             onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
//             className="input border rounded-2xl p-3 w-full"
//           />
//           <select
//             value={form.role}
//             onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
//             className="input border rounded-2xl p-3 w-full"
//           >
//             <option value="admin">admin</option>
//             <option value="superadmin">superadmin</option>
//           </select>
//         </div>
//         <button type="submit" className="bg-blue-500 rounded-2xl text-white px-4 py-2 rounded hover:bg-navy/90">
//           Create Admin
//         </button>
//       </form>

//       {/* Admin List */}
//       <div className="bg-white shadow rounded-lg overflow-x-auto">
//         <table className="min-w-full text-sm text-left">
//           <thead className="bg-navy text-white">
//             <tr>
//               <th className="px-4 py-2">Name</th>
//               <th className="px-4 py-2">Email</th>
//               <th className="px-4 py-2">Role</th>
//               <th className="px-4 py-2">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {admins.map((admin) => (
//               <tr key={admin._id} className="border-b hover:bg-gray-50">
//                 <td className="px-4 py-2">{admin.name}</td>
//                 <td className="px-4 py-2">
//                   {editingId === admin._id ? (
//                     <input
//                       value={editing.email}
//                       onChange={(e) => setEditing((e2) => ({ ...e2, email: e.target.value }))}
//                       className="input w-full"
//                     />
//                   ) : (
//                     admin.email
//                   )}
//                 </td>
//                 <td className="px-4 py-2">
//                   {editingId === admin._id ? (
//                     <select
//                       value={editing.role}
//                       onChange={(e) => setEditing((e2) => ({ ...e2, role: e.target.value }))}
//                       className="input"
//                     >
//                       <option value="admin">admin</option>
//                       <option value="superadmin">superadmin</option>
//                     </select>
//                   ) : (
//                     admin.role
//                   )}
//                 </td>
//                 <td className="px-4 py-2 flex gap-2">
//                   {editingId === admin._id ? (
//                     <button
//                       onClick={() => handleUpdate(admin._id)}
//                       className="text-green-600 hover:underline"
//                     >
//                       Save
//                     </button>
//                   ) : (
//                     <button
//                       onClick={() => handleEdit(admin)}
//                       className="text-blue-600 hover:underline"
//                     >
//                       Edit
//                     </button>
//                   )}
//                   <button
//                     onClick={() => handleDelete(admin._id)}
//                     className="text-red-600 hover:underline"
//                   >
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   )
// }

























"use client";

import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import toast from "react-hot-toast";
import Navbar from "@/components/Navbar";

type Admin = {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "superadmin";
};

export default function AdminManagePage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "admin",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editing, setEditing] = useState({ email: "", role: "admin" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdmins();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchAdmins = async () => {
    try {
      const { data } = await axios.get("/admins");
      setAdmins(data);
    } catch (err) {
      toast.error("Failed to load admins");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("/create-admin", form);
      toast.success("Admin created");
      setForm({ name: "", email: "", password: "", role: "admin" });
      fetchAdmins();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Create failed");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this admin?")) return;
    try {
      await axios.delete(`/admins/${id}`);
      toast.success("Admin deleted");
      setAdmins((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const handleEdit = (admin: Admin) => {
    setEditingId(admin._id);
    setEditing({ email: admin.email, role: admin.role });
  };

  const handleUpdate = async (id: string) => {
    try {
      await axios.put(`/admins/${id}`, editing);
      toast.success("Admin updated");
      setEditingId(null);
      fetchAdmins();
    } catch (err) {
      toast.error("Update failed");
    }
  };

  // UI helpers (styles only)
  const label = "block text-sm font-medium text-gray-800 mb-1";
  const inputBase =
    "w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#742402]/30 focus:border-[#742402]";
  const selectBase = inputBase;
  const card = "rounded-2xl border border-gray-200 bg-white shadow-sm";

  if (loading) {
    return (
      <>
        <Navbar forceWhite disableScrollEffect />
        <div className="min-h-screen bg-white text-black pt-24 px-6">
          <div className="max-w-5xl mx-auto">
            <div className={`${card} p-6 mb-8`}>
              <div className="h-6 w-48 rounded bg-gray-200 mb-4 animate-pulse" />
              <div className="grid sm:grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-10 rounded bg-gray-200 animate-pulse" />
                ))}
              </div>
              <div className="mt-4 h-10 w-40 rounded bg-gray-200 animate-pulse" />
            </div>

            <div className={`${card} overflow-hidden`}>
              <div className="h-12 bg-[#f5dfd6]" />
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-12 bg-white odd:bg-gray-50 animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Solid white navbar (no transitions/scroll effects) */}
      <Navbar forceWhite disableScrollEffect />

      <div className="min-h-screen bg-white text-black pt-24 px-6 mt-10">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-gray-900">MANAGE ADMINS</h1>

          {/* Create Form */}
          <form onSubmit={handleCreate} className={`${card} p-6 mb-8 space-y-4`}>
            <h2 className="text-xl font-semibold text-gray-900">Create New Admin</h2>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={label}>Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., John Doe"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className={inputBase}
                />
              </div>

              <div>
                <label className={label}>Email</label>
                <input
                  type="email"
                  required
                  placeholder="email@domain.com"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className={inputBase}
                />
              </div>

              <div>
                <label className={label}>Password</label>
                <input
                  type="password"
                  required
                  placeholder="Strong password"
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  className={inputBase}
                />
              </div>

              <div>
                <label className={label}>Role</label>
                <select
                  value={form.role}
                  onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                  className={selectBase}
                >
                  <option value="admin">admin</option>
                  <option value="superadmin">superadmin</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-xl bg-[#742402] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#5c1c01]"
            >
              Create Admin
            </button>
          </form>

          {/* Admin List */}
          {admins.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-gray-300 rounded-2xl text-gray-600">
              No admins found.
            </div>
          ) : (
            <div className={`${card} overflow-hidden`}>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left">
                  <thead className="bg-[#f5dfd6] text-[#742402]">
                    <tr>
                      <th className="px-4 py-3 text-sm font-semibold">Name</th>
                      <th className="px-4 py-3 text-sm font-semibold">Email</th>
                      <th className="px-4 py-3 text-sm font-semibold">Role</th>
                      <th className="px-4 py-3 text-sm font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {admins.map((admin) => (
                      <tr key={admin._id} className="border-b last:border-none hover:bg-gray-50">
                        <td className="px-4 py-3">{admin.name}</td>

                        <td className="px-4 py-3">
                          {editingId === admin._id ? (
                            <input
                              value={editing.email}
                              onChange={(e) =>
                                setEditing((e2) => ({ ...e2, email: e.target.value }))
                              }
                              className={inputBase}
                            />
                          ) : (
                            <span className="text-gray-800">{admin.email}</span>
                          )}
                        </td>

                        <td className="px-4 py-3">
                          {editingId === admin._id ? (
                            <select
                              value={editing.role}
                              onChange={(e) =>
                                setEditing((e2) => ({ ...e2, role: e.target.value }))
                              }
                              className={selectBase}
                            >
                              <option value="admin">admin</option>
                              <option value="superadmin">superadmin</option>
                            </select>
                          ) : (
                            <span
                              className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border ${
                                admin.role === "superadmin"
                                  ? "border-[#742402]/30 text-[#742402] bg-[#f5dfd6]"
                                  : "border-gray-300 text-gray-700 bg-white"
                              }`}
                            >
                              {admin.role}
                            </span>
                          )}
                        </td>

                        <td className="px-4 py-3">
                          {editingId === admin._id ? (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleUpdate(admin._id)}
                                className="rounded-lg bg-[#742402] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#5c1c01]"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setEditingId(null)}
                                className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-100"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEdit(admin)}
                                className="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-[#742402] border border-[#742402]/30 hover:bg-[#f5dfd6]"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(admin._id)}
                                className="rounded-lg border border-red-300 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100"
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
