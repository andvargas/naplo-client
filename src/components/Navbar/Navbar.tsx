import { NavLink, useNavigate } from 'react-router-dom'
import { FiLogOut } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import Tooltip from "../Tooltip/Tooltip";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `px-3 py-2 rounded text-sm font-bold whitespace-nowrap transition-colors no-underline
  ${isActive ? 'bg-teal-300 text-indigo-900' : 'text-amber-100 hover:bg-teal-400 hover:text-white'}`

const Navbar = () => {
  const { state, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="flex flex-row justify-between items-center w-full px-4 py-3 bg-gray-900">
      <NavLink to="/" className="w-1/3">
        <span className="text-amber-100 font-bold text-lg tracking-wide">NAPLO</span>
      </NavLink>

      <ul className="flex flex-row items-center gap-1 justify-end w-2/3 list-none m-0 p-0">
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
    </nav>
  );
}

export default Navbar