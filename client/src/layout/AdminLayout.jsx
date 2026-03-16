import { Outlet, useNavigate } from "react-router";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import LoadingScreen from "../components/LoadingScreen";

export const AdminLayout = () => {
  const { user, loading } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/admin/login");
    } else if (!loading && user && user.user?.role !== "admin") {
      navigate("/");
    }
  }, [loading, user, navigate]);

  if (loading) return <LoadingScreen />;

  if (!user || user.user?.role !== "admin") return null;

  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
};