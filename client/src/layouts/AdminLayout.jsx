import { NavLink, useNavigate } from 'react-router-dom';
import { FiGrid, FiCamera, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import danaAnandLogo from '../assets/logo-dana-anand.webp';

const NAV_ITEMS = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: FiGrid },
  { to: '/admin/scanner', label: 'QR Scanner', icon: FiCamera },
];

export default function AdminLayout({ children, title }) {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-surface flex">
      <aside className="hidden md:flex md:flex-col w-64 bg-primary-dark text-white shrink-0">
        <div className="px-6 py-6 border-b border-white/10">
          <img src={danaAnandLogo} alt="Dana | Anand" className="h-9 w-auto select-none mb-2" />
          <span className="font-heading font-bold text-xs leading-tight text-white/70">
            Dana Supplier Technology Day
          </span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                  isActive ? 'bg-accent-gradient text-primary-dark' : 'text-white/80 hover:bg-white/10'
                }`
              }
            >
              <Icon /> {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-4 py-6 border-t border-white/10">
          <p className="text-xs text-white/50 px-4 mb-2">Signed in as</p>
          <p className="text-sm font-semibold px-4 mb-4 truncate">{admin?.name || admin?.email}</p>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-white/80 hover:bg-white/10 transition-colors w-full"
          >
            <FiLogOut /> Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-slate-200 px-4 sm:px-8 py-4 flex items-center justify-between md:hidden">
          <span className="font-heading font-bold text-primary-dark">{title}</span>
          <button onClick={handleLogout} className="text-slate-500" aria-label="Logout">
            <FiLogOut />
          </button>
        </header>

        <div className="md:hidden flex overflow-x-auto bg-white border-b border-slate-200 px-2">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 ${
                  isActive ? 'border-primary text-primary' : 'border-transparent text-slate-500'
                }`
              }
            >
              <Icon /> {label}
            </NavLink>
          ))}
        </div>

        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          <h1 className="hidden md:block font-heading font-bold text-2xl text-primary-dark mb-6">{title}</h1>
          {children}
        </main>
      </div>
    </div>
  );
}
