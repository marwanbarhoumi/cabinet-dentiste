import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import LangSwitcher from './LangSwitcher';
export default function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const adminLinks = [
    { path: '/admin', label: t('sidebar.dashboard'), icon: '📊' },
    { path: '/admin/appointments', label: t('sidebar.appointments'), icon: '📅' },
    { path: '/admin/patients', label: t('sidebar.patients'), icon: '👥' },
  ];

  const clientLinks = [
    { path: '/client', label: t('sidebar.home'), icon: '🏠' },
    { path: '/client/book', label: t('sidebar.book'), icon: '📅' },
    { path: '/client/appointments', label: t('sidebar.my_appointments'), icon: '📋' },
  ];

  const links = user?.role === 'admin' ? adminLinks : clientLinks;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="w-64 min-h-screen bg-white shadow-lg flex flex-col">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🦷</span>
          <div>
            <h1 className="font-bold text-gray-800 text-lg">{t('app_name')}</h1>
            <p className="text-xs text-gray-500">
              {user?.role === 'admin' ? `👨‍⚕️ ${t('sidebar.doctor')}` : `🧑 ${t('sidebar.patient')}`}
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 mx-3 mt-4 bg-sky-50 rounded-xl">
        <p className="font-semibold text-gray-800 text-sm">{user?.name}</p>
        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {links.map((link) => (
          <Link key={link.path} to={link.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              location.pathname === link.path
                ? 'bg-sky-500 text-white shadow-md'
                : 'text-gray-600 hover:bg-sky-50 hover:text-sky-600'
            }`}>
            <span>{link.icon}</span>
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100 space-y-2">
        <LangSwitcher />
        <button onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all">
          <span>🚪</span>
          {t('sidebar.logout')}
        </button>
      </div>
    </div>
  );
}