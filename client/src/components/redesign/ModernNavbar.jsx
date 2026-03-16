import { useEffect, useState, useCallback } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { logout } from "../../store/auth/authSlice";
import { usePrefetchHandlers } from "../../hooks/useAuction.js";
import {
  MdOutlineCreate,
  MdOutlineDashboard,
  MdMailOutline,
  MdAttachMoney,
  MdOutlineAccountCircle,
  MdOutlineHome,
  MdOutlinePrivacyTip,
  MdAdminPanelSettings,
} from "react-icons/md";
import {
  IoCloseSharp,
  IoDocumentTextOutline,
  IoLogOutOutline,
} from "react-icons/io5";
import { RiAuctionLine } from "react-icons/ri";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { FiTarget } from "react-icons/fi";

/**
 * ModernNavbar Component
 * 
 * A redesigned navigation bar with modern SaaS aesthetics featuring:
 * - Sticky positioning with frosted glass backdrop effect
 * - Smooth slide-in drawer animation using Framer Motion
 * - Integration with Redux auth state (preserved from original)
 * - Mobile-responsive hamburger menu
 * 
 * Validates Requirements: 1.1, 12.1, 12.2, 7.1
 * 
 * This component wraps the original Navbar functionality while adding
 * modern visual enhancements. All existing logic and state management
 * is preserved to maintain functionality.
 */
export const ModernNavbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const {
    prefetchAuctions,
    prefetchMyAuctions,
    prefetchMyBids,
    prefetchDashboard,
  } = usePrefetchHandlers();

  const handlePrefetch = useCallback(
    (link) => {
      const prefetchMap = {
        "/": prefetchDashboard,
        "/auction": prefetchAuctions,
        "/myauction": prefetchMyAuctions,
        "/mybids": prefetchMyBids,
      };
      prefetchMap[link]?.();
    },
    [prefetchAuctions, prefetchMyAuctions, prefetchMyBids, prefetchDashboard],
  );

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const navItems = user ? getNavLinks(user.user.role) : navMenu;
  const drawerItems = user ? getAllLinks(user.user.role) : navMenu;

  return (
    <>
      {/* Sticky Navigation Bar with Frosted Glass Effect */}
      <header className="sticky top-0 z-40 border-b border-sky-100/50">
        <div className="bg-white/80 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex justify-between items-center h-16">
              {/* Logo with Sky Blue Accent */}
              <Link to="/" className="flex items-center gap-2.5 group">
                <div className="bg-sky-400 text-white p-1.5 rounded-lg group-hover:bg-sky-500 transition-colors duration-200">
                  <RiAuctionLine className="h-5 w-5" />
                </div>
                <span className="text-lg font-bold text-gray-900 tracking-tight font-heading">
                  Online Auction
                </span>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center gap-1">
                {navItems.map((item) => (
                  <NavLink
                    to={item.link}
                    key={item.link}
                    end={item.link === "/"}
                    onMouseEnter={() => handlePrefetch(item.link)}
                    className={({ isActive }) =>
                      `px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? "text-sky-600 bg-sky-50"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      }`
                    }
                  >
                    {item.name}
                  </NavLink>
                ))}
              </nav>

              {/* Right Section */}
              <div className="flex items-center gap-2">
                {/* Desktop Auth Buttons */}
                {!user && (
                  <div className="hidden md:flex items-center gap-3">
                    <LoginSignup />
                  </div>
                )}
                {user && (
                  <div className="hidden md:flex items-center gap-2">
                    <NavLink
                      to="/profile"
                      className={({ isActive }) =>
                        `flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                          isActive
                            ? "text-sky-600 bg-sky-50"
                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                        }`
                      }
                    >
                      <div className="w-7 h-7 rounded-full bg-sky-100 flex items-center justify-center text-xs font-bold text-sky-600">
                        {user.user.name?.charAt(0)?.toUpperCase()}
                      </div>
                      {user.user.name?.split(" ")[0]}
                    </NavLink>
                    <button
                      onClick={handleLogout}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200 cursor-pointer"
                      title="Sign out"
                      aria-label="Sign out"
                    >
                      <IoLogOutOutline className="h-5 w-5" />
                    </button>
                  </div>
                )}

                {/* Hamburger Menu Button */}
                <button
                  onClick={toggleMenu}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                  aria-expanded={isMenuOpen}
                  aria-label="Toggle menu"
                >
                  <HiOutlineMenuAlt3 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Overlay with Framer Motion */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            onClick={() => setIsMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Drawer with Slide Animation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
            className="fixed top-0 right-0 h-full w-80 bg-white z-50 shadow-2xl"
          >
            {/* Drawer Header */}
            <div className="flex justify-between items-center px-5 h-16 border-b border-gray-100">
              <Link
                to="/"
                className="flex items-center gap-2.5"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="bg-sky-400 text-white p-1.5 rounded-lg">
                  <RiAuctionLine className="h-5 w-5" />
                </div>
                <span className="text-lg font-bold text-gray-900 tracking-tight font-heading">
                  Online Auction
                </span>
              </Link>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                aria-label="Close menu"
              >
                <IoCloseSharp className="h-5 w-5" />
              </button>
            </div>

            {/* User Profile (logged in) */}
            {user && (
              <div className="px-5 py-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-sky-100 flex items-center justify-center overflow-hidden">
                    {user.user.avatar ? (
                      <img
                        src={user.user.avatar}
                        alt={user.user.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-sm font-bold text-sky-600">
                        {user.user.name?.charAt(0)?.toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 text-sm truncate">
                      {user.user.name}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {user.user.email}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Drawer Links */}
            <nav
              className="px-3 py-3 overflow-y-auto"
              style={{ maxHeight: "calc(100vh - 180px)" }}
            >
              <div className="space-y-0.5">
                {drawerItems.map((item) => (
                  <NavLink
                    to={item.link}
                    key={item.link}
                    end={item.link === "/"}
                    onMouseEnter={() => handlePrefetch(item.link)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? "text-sky-600 bg-sky-50"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      }`
                    }
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.icon}
                    {item.name}
                  </NavLink>
                ))}
              </div>

              {user ? (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <button
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors duration-200 cursor-pointer"
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleLogout();
                    }}
                  >
                    <IoLogOutOutline className="h-5 w-5" />
                    Sign out
                  </button>
                </div>
              ) : (
                <div className="mt-4 pt-4 border-t border-gray-100 space-y-2 px-1">
                  <Link
                    to="/login"
                    className="block w-full py-2.5 px-4 text-center text-gray-700 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Log in
                  </Link>
                  <Link
                    to="/signup"
                    className="block w-full py-2.5 px-4 text-center bg-sky-400 text-white rounded-xl text-sm font-medium hover:bg-sky-500 transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

/**
 * LoginSignup Component
 * Sign In CTA button with sky blue accent for unauthenticated users
 * 
 * Features:
 * - Prominent Sign In button with sky blue styling (Requirement 12.5)
 * - Hover states for visual feedback
 * - Focus states for keyboard navigation accessibility (Requirement 6.3)
 * - Links to existing authentication flow (Requirement 7.5)
 */
export const LoginSignup = () => {
  return (
    <>
      <Link
        to="/login"
        className="px-4 py-2 text-gray-700 text-sm font-medium border border-gray-200 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 transition-all duration-200"
      >
        Log in
      </Link>
      <Link
        to="/signup"
        className="px-4 py-2 bg-sky-400 text-white text-sm font-medium rounded-xl hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 shadow-sm hover:shadow-md transition-all duration-200"
      >
        Sign up
      </Link>
    </>
  );
};

// Navigation menu items for unauthenticated users
const navMenu = [
  {
    name: "Home",
    link: "/",
    icon: <MdOutlineHome className="h-5 w-5" />,
  },
  {
    name: "About",
    link: "/about",
    icon: <MdOutlineAccountCircle className="h-5 w-5" />,
  },
  {
    name: "Contact",
    link: "/contact",
    icon: <MdMailOutline className="h-5 w-5" />,
  },
  {
    name: "Legal",
    link: "/legal",
    icon: <IoDocumentTextOutline className="h-5 w-5" />,
  },
];

// Navigation links for authenticated users
const protectedNavLink = [
  {
    name: "Dashboard",
    link: "/",
    icon: <MdOutlineDashboard className="h-5 w-5" />,
  },
  {
    name: "Create Auction",
    link: "/create",
    icon: <MdOutlineCreate className="h-5 w-5" />,
  },
  {
    name: "Auctions",
    link: "/auction",
    icon: <RiAuctionLine className="h-5 w-5" />,
  },
  {
    name: "My Auctions",
    link: "/myauction",
    icon: <MdAttachMoney className="h-5 w-5" />,
  },
  {
    name: "My Bids",
    link: "/mybids",
    icon: <FiTarget className="h-5 w-5" />,
  },
  {
    name: "Contact",
    link: "/contact",
    icon: <MdMailOutline className="h-5 w-5" />,
  },
  {
    name: "Profile",
    link: "/profile",
    icon: <MdOutlineAccountCircle className="h-5 w-5" />,
  },
  {
    name: "Privacy",
    link: "/privacy",
    icon: <MdOutlinePrivacyTip className="h-5 w-5" />,
  },
];

// Navigation links for admin users
const adminNavLink = [
  {
    name: "Admin Panel",
    link: "/admin",
    icon: <MdAdminPanelSettings className="h-5 w-5" />,
  },
  {
    name: "Dashboard",
    link: "/",
    icon: <MdOutlineDashboard className="h-5 w-5" />,
  },
  {
    name: "Create Auction",
    link: "/create",
    icon: <MdOutlineCreate className="h-5 w-5" />,
  },
  {
    name: "Auctions",
    link: "/auction",
    icon: <RiAuctionLine className="h-5 w-5" />,
  },
  {
    name: "My Auctions",
    link: "/myauction",
    icon: <MdAttachMoney className="h-5 w-5" />,
  },
  {
    name: "My Bids",
    link: "/mybids",
    icon: <FiTarget className="h-5 w-5" />,
  },
];

// Get navigation links for desktop navbar based on user role
const getNavLinks = (userRole) => {
  if (userRole === "admin") {
    return adminNavLink;
  }
  return protectedNavLink.slice(0, 5);
};

// Get all links for hamburger drawer based on user role
const getAllLinks = (userRole) => {
  if (userRole === "admin") {
    return [
      ...adminNavLink,
      protectedNavLink[5], // Contact
      protectedNavLink[6], // Profile
      protectedNavLink[7], // Privacy
    ];
  }
  return protectedNavLink;
};
