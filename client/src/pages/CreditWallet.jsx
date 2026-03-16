import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import { useSelector } from "react-redux";
import LoadingScreen from "../components/LoadingScreen";
import { api } from "../config/api";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

const CreditWallet = () => {
  useDocumentTitle("My Credits");
  const { user } = useSelector((state) => state.auth);
  const [history, setHistory] = useState([]);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCredits = async () => {
      try {
        const [balRes, histRes] = await Promise.all([
          api.get("/credits/balance"),
          api.get("/credits/history"),
        ]);
        setBalance(balRes.data.credits ?? user?.user?.credits ?? 0);
        setHistory(histRes.data.history || []);
      } catch (e) {
        console.error("Error fetching credits", e);
        setBalance(user?.user?.credits ?? 0);
      } finally {
        setLoading(false);
      }
    };
    fetchCredits();
  }, []);

  const getTypeInfo = (type) => {
    switch (type) {
      case "assigned":
        return { label: "Received", color: "text-emerald-600", bg: "bg-emerald-50", icon: "+" };
      case "deducted":
        return { label: "Deducted", color: "text-red-600", bg: "bg-red-50", icon: "−" };
      case "returned":
        return { label: "Returned", color: "text-sky-600", bg: "bg-sky-50", icon: "+" };
      case "won":
        return { label: "Won (Settled)", color: "text-amber-600", bg: "bg-amber-50", icon: "−" };
      default:
        return { label: type, color: "text-gray-600", bg: "bg-gray-50", icon: "•" };
    }
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {/* Balance Card */}
        <div className="bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl p-8 mb-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mt-20 -mr-20" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full -mb-16 -ml-16" />
          <div className="relative">
            <p className="text-sm text-white/70 font-medium uppercase tracking-wider">
              Available Credits
            </p>
            <p className="text-5xl font-bold mt-2 tabular-nums">{balance}</p>
            <p className="text-sm text-white/50 mt-2">
              Credits are used to place bids on auctions
            </p>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-4 mb-6">
          <p className="text-sm text-amber-800">
            <strong>How credits work:</strong> You get 100 starter credits on signup. Admin can assign more.
            Credits are deducted when you bid, returned if you're outbid, and permanently deducted if you win.
          </p>
        </div>

        {/* History */}
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-700">Transaction History</h2>
          </div>
          {history.length === 0 ? (
            <div className="px-6 py-16 text-center text-gray-400">
              <p className="text-3xl mb-3">💳</p>
              <p>No transactions yet.</p>
              <p className="text-sm mt-1">Your credit history will appear here after your first bid.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {history.map((entry) => {
                const info = getTypeInfo(entry.type);
                return (
                  <div key={entry._id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl ${info.bg} flex items-center justify-center ${info.color} font-bold text-sm`}>
                        {info.icon}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{info.label}</p>
                        <p className="text-xs text-gray-400">{entry.reason || "—"}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-semibold tabular-nums ${info.color}`}>
                        {info.icon}{entry.amount}
                      </p>
                      <p className="text-[11px] text-gray-400">
                        {new Date(entry.createdAt).toLocaleDateString()} {new Date(entry.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreditWallet;
