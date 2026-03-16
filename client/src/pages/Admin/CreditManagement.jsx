import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import LoadingScreen from "../../components/LoadingScreen";
import { api } from "../../config/api";
import toast from "react-hot-toast";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";

export const CreditManagement = () => {
  useDocumentTitle("Credit Management");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [creditAmount, setCreditAmount] = useState(100);
  const [assigning, setAssigning] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/admin/users?limit=50&search=${search}`);
      setUsers(res.data.data?.users || []);
    } catch (e) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search]);

  const handleAssignCredits = async () => {
    if (!selectedUser || creditAmount <= 0) return;
    try {
      setAssigning(true);
      await api.post("/admin/assign-credits", {
        userId: selectedUser._id,
        credits: creditAmount,
      });
      toast.success(`${creditAmount} credits assigned to ${selectedUser.name}`);
      setSelectedUser(null);
      setCreditAmount(100);
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to assign credits");
    } finally {
      setAssigning(false);
    }
  };

  if (loading && users.length === 0) return <LoadingScreen />;

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Credit Management</h1>
            <p className="text-sm text-gray-400 mt-1">Assign credits to users</p>
          </div>
          <Link to="/admin" className="inline-flex items-center gap-2 bg-white text-gray-700 border border-gray-200 text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-all">
            ← Dashboard
          </Link>
        </div>

        {/* Search */}
        <div className="mb-6 max-w-md">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-4 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition"
          />
        </div>

        {/* Assign Credits Dialog */}
        {selectedUser && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                Assign Credits
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                to <span className="font-medium text-gray-700">{selectedUser.name}</span> ({selectedUser.email})
              </p>

              <div className="space-y-3 mb-5">
                <div className="flex gap-2">
                  {[50, 100, 250, 500, 1000].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => setCreditAmount(amt)}
                      className={`flex-1 py-2 rounded-xl text-sm font-medium transition ${
                        creditAmount === amt
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {amt}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  min="1"
                  value={creditAmount}
                  onChange={(e) => setCreditAmount(Number(e.target.value))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                  placeholder="Custom amount"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition"
                  onClick={() => setSelectedUser(null)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition disabled:opacity-50"
                  disabled={assigning || creditAmount <= 0}
                  onClick={handleAssignCredits}
                >
                  {assigning ? "Assigning..." : `Assign ${creditAmount} Credits`}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Users Table */}
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-6 py-3.5 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3.5 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3.5 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Credits</th>
                  <th className="px-6 py-3.5 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center shrink-0">
                          <span className="text-xs font-semibold text-white">
                            {user.name?.charAt(0)?.toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{user.name}</p>
                          <p className="text-xs text-gray-400">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                        user.role === "admin" ? "bg-violet-50 text-violet-700" : "bg-emerald-50 text-emerald-700"
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-gray-900 tabular-nums">
                        {user.credits ?? 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setCreditAmount(100);
                        }}
                        className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-lg hover:bg-indigo-200 transition font-medium"
                      >
                        + Assign Credits
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
