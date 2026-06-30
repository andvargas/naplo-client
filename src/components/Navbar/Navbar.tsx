import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FiLogOut, FiMenu, FiX } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import Tooltip from "../Tooltip/Tooltip";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `px-3 py-2 rounded text-sm font-bold whitespace-nowrap transition-colors no-underline
  ${isActive ? "bg-teal-300 text-indigo-900" : "text-amber-100 hover:bg-teal-400 hover:text-white"}`;

// Same styling but full-width, for the mobile dropdown
const mobileNavLinkClass = ({ isActive }: { isActive: boolean }) =>
  `block px-4 py-3 rounded text-sm font-bold transition-colors no-underline
  ${isActive ? "bg-teal-300 text-indigo-900" : "text-amber-100 hover:bg-teal-400 hover:text-white"}`;

const Navbar = () => {
  const { state, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    setMenuOpen(false);
    logout();
    navigate("/login");
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="relative w-full bg-gray-900">
      <div className="flex flex-row justify-between items-center px-14 py-3 max-w-screen-xl mx-auto">
        <NavLink to="/" className="shrink-0" onClick={closeMenu}>
          <span className="text-amber-100 font-bold text-lg tracking-wide">NAPLO</span>
        </NavLink>

        {/* Desktop links */}
        <ul className="hidden md:flex flex-row items-center gap-1 justify-end list-none m-0 p-0">
          <li>
            <NavLink to="/projects" className={navLinkClass}>
              PROJECTS
            </NavLink>
          </li>
          <li>
            <NavLink to="/journal" className={navLinkClass}>
              JOURNAL
            </NavLink>
          </li>
          <li>
            <Tooltip label="Weekly Hours">
              <NavLink to="/weekly-stats" className={navLinkClass}>
                WEEK
              </NavLink>
            </Tooltip>
          </li>
          <li>
            <Tooltip label="List Hours">
              <NavLink to="/dashboard" className={navLinkClass}>
                DASHBOARD
              </NavLink>
            </Tooltip>
          </li>
          <li className="ml-2 border-l border-gray-700 pl-2">
            <Tooltip label={`Logout ${state.user?.username ?? ""}`}>
              <button onClick={handleLogout} className="px-3 py-2 rounded text-amber-100 hover:bg-red-600 hover:text-white transition-colors">
                <FiLogOut />
              </button>
            </Tooltip>
          </li>
        </ul>

        {/* Mobile hamburger toggle */}
        <button className="md:hidden text-amber-100 p-2" onClick={() => setMenuOpen((o) => !o)} aria-label="Toggle menu">
          {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <ul className="md:hidden flex flex-col list-none m-0 p-2 gap-1 bg-gray-900 border-t border-gray-700">
          <li>
            <NavLink to="/projects" className={mobileNavLinkClass} onClick={closeMenu}>
              PROJECTS
            </NavLink>
          </li>
          <li>
            <NavLink to="/journal" className={mobileNavLinkClass} onClick={closeMenu}>
              JOURNAL
            </NavLink>
          </li>
          <li>
            <NavLink to="/weekly-stats" className={mobileNavLinkClass} onClick={closeMenu}>
              WEEK
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard" className={mobileNavLinkClass} onClick={closeMenu}>
              DASHBOARD
            </NavLink>
          </li>
          <li className="border-t border-gray-700 pt-1 mt-1">
            <button
              onClick={handleLogout}
              className="w-full text-left flex items-center gap-2 px-4 py-3 rounded text-amber-100 hover:bg-red-600 hover:text-white transition-colors"
            >
              <FiLogOut /> Logout {state.user?.username ?? ""}
            </button>
          </li>
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
