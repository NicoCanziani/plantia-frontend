import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSidebar } from '../context/SidebarContext';

const NAV = [
  { to: '/plants', label: 'Mis Plantas', icon: IconPlant },
  { to: '/calendar', label: 'Calendario', icon: IconCalendar },
  { to: '/settings', label: 'Configuración', icon: IconSettings },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const { open, close } = useSidebar();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <>
      {/* Overlay mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/20 z-20 lg:hidden"
          onClick={close}
        />
      )}

      {/* Sidebar */}
      <aside
        className={[
          'fixed top-0 left-0 h-full w-64 bg-canvas-ice border-r border-stone-moss z-30',
          'flex flex-col transition-transform duration-200',
          'lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        ].join(' ')}
      >
        {/* Logo */}
        <div className="px-6 py-6 border-b border-stone-moss">
          <span className="text-[18px] font-bold text-adaline-ink tracking-[-0.04em]">
            🌿 Plantia
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={close}
              className={({ isActive }) =>
                [
                  'flex items-center gap-3 px-4 py-2.5 rounded-[20px] text-[14px] transition-colors',
                  isActive
                    ? 'bg-forest-dew text-valley-green font-medium'
                    : 'text-adaline-ink hover:bg-forest-dew/50',
                ].join(' ')
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User */}
        <div className="px-3 py-4 border-t border-stone-moss">
          <div className="px-4 py-2 mb-1">
            <p className="text-[13px] font-medium text-adaline-ink truncate">{user?.name}</p>
            <p className="font-mono text-[11px] text-mist-gray truncate">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-[20px] text-[14px] text-adaline-ink hover:bg-stone-moss/50 transition-colors"
          >
            <IconLogout size={16} />
            Cerrar sesión
          </button>
        </div>
      </aside>
    </>
  );
}

function IconPlant({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M10 18V10" strokeLinecap="round" />
      <path d="M10 14C10 14 6 12 6 8C6 5.8 7.8 4 10 4C12.2 4 14 5.8 14 8C14 12 10 14 10 14Z" />
    </svg>
  );
}

function IconCalendar({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="4" width="14" height="13" rx="2" />
      <path d="M3 8h14" strokeLinecap="round" />
      <path d="M7 2v3M13 2v3" strokeLinecap="round" />
    </svg>
  );
}

function IconSettings({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="10" cy="10" r="2.5" />
      <path d="M10 3v1.5M10 15.5V17M3 10h1.5M15.5 10H17M5.05 5.05l1.06 1.06M13.89 13.89l1.06 1.06M5.05 14.95l1.06-1.06M13.89 6.11l1.06-1.06" strokeLinecap="round" />
    </svg>
  );
}

function IconLogout({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M13 10H3M13 10l-3-3M13 10l-3 3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 6V4a1 1 0 011-1h6a1 1 0 011 1v12a1 1 0 01-1 1H9a1 1 0 01-1-1v-2" strokeLinecap="round" />
    </svg>
  );
}
