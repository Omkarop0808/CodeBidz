import { useState, useEffect } from "react";
import { Link } from "react-router";
import LoadingScreen from "../../components/LoadingScreen";
import { api } from "../../config/api";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const CHART_COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#ec4899", "#f97316"];

export const Analytics = () => {
  useDocumentTitle("Analytics");
  const [dashData, setDashData] = useState(null);
  const [bidActivity, setBidActivity] = useState([]);
  const [topAuctions, setTopAuctions] = useState([]);
  const [creditFlow, setCreditFlow] = useState([]);
  const [categoryPerf, setCategoryPerf] = useState([]);
  const [topBidders, setTopBidders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [dashRes, bidRes, topRes, creditRes, catRes, bidderRes] = await Promise.allSettled([
          api.get("/admin/dashboard", { withCredentials: true }),
          api.get(`/analytics/bid-activity?days=${days}`, { withCredentials: true }),
          api.get("/analytics/top-auctions?limit=5", { withCredentials: true }),
          api.get(`/analytics/credit-flow?days=${days}`, { withCredentials: true }),
          api.get("/analytics/category-performance", { withCredentials: true }),
          api.get("/analytics/top-bidders?limit=8", { withCredentials: true }),
        ]);

        if (dashRes.status === "fulfilled") setDashData(dashRes.value.data);
        if (bidRes.status === "fulfilled") setBidActivity(bidRes.value.data.data || []);
        if (topRes.status === "fulfilled") setTopAuctions(topRes.value.data.data || []);
        if (creditRes.status === "fulfilled") setCreditFlow(creditRes.value.data.data || []);
        if (catRes.status === "fulfilled") setCategoryPerf(catRes.value.data.data || []);
        if (bidderRes.status === "fulfilled") setTopBidders(bidderRes.value.data.data || []);
      } catch (e) {
        console.error("Analytics fetch error", e);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [days]);

  if (loading) return <LoadingScreen />;

  const stats = dashData?.stats || {};
  const auctions = dashData?.recentAuctions || [];
  const users = dashData?.recentUsersList || [];
  const totalBids = auctions.reduce((sum, a) => sum + (a.bids?.length || 0), 0);
  const soldAuctions = auctions.filter((a) => a.isSold).length;
  const conversionRate = auctions.length > 0 ? ((soldAuctions / auctions.length) * 100).toFixed(0) : 0;

  const kpiCards = [
    { label: "Total Auctions", value: stats.totalAuctions || 0, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Active Auctions", value: stats.activeAuctions || 0, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Total Users", value: stats.totalUsers || 0, color: "text-violet-600", bg: "bg-violet-50" },
    { label: "New Users (7d)", value: stats.recentUsers || 0, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Total Bids", value: totalBids, color: "text-sky-600", bg: "bg-sky-50" },
    { label: "Conversion Rate", value: `${conversionRate}%`, color: "text-rose-600", bg: "bg-rose-50" },
  ];

  // Build pie data from category performance
  const pieData = categoryPerf.length > 0
    ? categoryPerf.map((c) => ({ name: c._id || c.category || "Other", value: c.count || c.totalAuctions || 0 }))
    : Object.entries(
        auctions.reduce((acc, a) => { acc[a.itemCategory || "Other"] = (acc[a.itemCategory || "Other"] || 0) + 1; return acc; }, {})
      ).map(([name, value]) => ({ name, value }));

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
            <p className="text-sm text-gray-400 mt-1">Platform performance overview</p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="bg-white border border-gray-200 text-sm rounded-xl px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
            >
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
            </select>
            <Link to="/admin" className="inline-flex items-center gap-2 bg-white text-gray-700 border border-gray-200 text-sm font-medium px-4 py-2 rounded-xl hover:bg-gray-50 transition-all">
              ← Dashboard
            </Link>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {kpiCards.map((card) => (
            <div key={card.label} className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-5">
              <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">{card.label}</p>
              <p className={`text-2xl font-bold ${card.color} tabular-nums mt-1`}>{card.value}</p>
            </div>
          ))}
        </div>

        {/* Charts Row 1: Bid Activity + Credit Flow */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Bid Activity Area Chart */}
          <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Bid Activity</h3>
            {bidActivity.length > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={bidActivity}>
                  <defs>
                    <linearGradient id="bidGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis dataKey="_id" tick={{ fontSize: 11, fill: "#9ca3af" }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: "12px", border: "1px solid #e5e7eb", fontSize: "12px" }}
                    labelStyle={{ fontWeight: 600 }}
                  />
                  <Area type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#bidGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[260px] flex items-center justify-center text-sm text-gray-400">
                No bid activity data available
              </div>
            )}
          </div>

          {/* Credit Flow Bar Chart */}
          <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Credit Flow</h3>
            {creditFlow.length > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={creditFlow}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis dataKey="_id" tick={{ fontSize: 11, fill: "#9ca3af" }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: "12px", border: "1px solid #e5e7eb", fontSize: "12px" }}
                    labelStyle={{ fontWeight: 600 }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: "12px" }} />
                  <Bar dataKey="assigned" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="deducted" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="returned" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[260px] flex items-center justify-center text-sm text-gray-400">
                No credit flow data available
              </div>
            )}
          </div>
        </div>

        {/* Charts Row 2: Category Pie + Top Bidders */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Category Distribution Pie */}
          <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Category Distribution</h3>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: "12px", border: "1px solid #e5e7eb", fontSize: "12px" }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: "12px" }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[260px] flex items-center justify-center text-sm text-gray-400">
                No category data available
              </div>
            )}
          </div>

          {/* Top Bidders */}
          <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Top Bidders</h3>
            {topBidders.length > 0 ? (
              <div className="space-y-3">
                {topBidders.map((bidder, idx) => (
                  <div key={bidder._id || idx} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition">
                    <span className="text-sm font-bold text-gray-300 w-5 text-center tabular-nums">
                      {idx + 1}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center shrink-0">
                      <span className="text-[10px] font-bold text-white">
                        {(bidder.name || "?").charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{bidder.name || "Unknown"}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-indigo-600 tabular-nums">{bidder.totalBids || bidder.count || 0} bids</p>
                      <p className="text-[11px] text-gray-400">Rs {bidder.totalAmount || 0}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-[260px] flex items-center justify-center text-sm text-gray-400">
                No bidder data available
              </div>
            )}
          </div>
        </div>

        {/* Top Auctions Table */}
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-6 mb-8">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Top Auctions by Bid Count</h3>
          <div className="space-y-2">
            {(topAuctions.length > 0 ? topAuctions : auctions.sort((a, b) => (b.bids?.length || 0) - (a.bids?.length || 0)).slice(0, 5))
              .map((auction, idx) => (
                <div key={auction._id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition">
                  <span className="text-lg font-bold text-gray-300 w-6 text-center tabular-nums">{idx + 1}</span>
                  <div className="w-10 h-10 rounded-xl bg-gray-100 overflow-hidden shrink-0">
                    {auction.itemImage || auction.itemPhoto ? (
                      <img src={auction.itemImage || auction.itemPhoto} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300 text-lg">🖼️</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{auction.itemName || auction.name}</p>
                    <p className="text-xs text-gray-400">{auction.itemCategory || auction.category || "General"}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900 tabular-nums">
                      Rs {auction.currentPrice || auction.highestBid || 0}
                    </p>
                    <p className="text-[11px] text-gray-400">
                      {auction.bids?.length || auction.bidCount || 0} bids
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Recent Users</h3>
          <div className="space-y-3">
            {users.slice(0, 8).map((user) => (
              <div key={user._id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center">
                    <span className="text-[10px] font-semibold text-white">
                      {user.name?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-[11px] text-gray-400">{user.email}</p>
                  </div>
                </div>
                <span className="text-[11px] text-gray-400">
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
