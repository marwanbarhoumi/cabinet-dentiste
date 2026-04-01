import { Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';

export default function ClientHome() {
  const { user } = useAuth();
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">
            {t('client.hello')}, {user?.name} 👋
          </h1>
          <p className="text-gray-500 mt-1">{t('client.welcome')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
          <Link to="/client/book"
            className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-all border-2 border-transparent hover:border-sky-200">
            <div className="w-14 h-14 bg-sky-100 rounded-2xl flex items-center justify-center text-3xl mb-4">📅</div>
            <h3 className="font-semibold text-gray-800 text-lg">{t('client.book_title')}</h3>
            <p className="text-gray-500 text-sm mt-1">{t('client.book_subtitle')}</p>
          </Link>

          <Link to="/client/appointments"
            className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-all border-2 border-transparent hover:border-sky-200">
            <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center text-3xl mb-4">📋</div>
            <h3 className="font-semibold text-gray-800 text-lg">{t('client.my_rdv_title')}</h3>
            <p className="text-gray-500 text-sm mt-1">{t('client.my_rdv_subtitle')}</p>
          </Link>
        </div>

        <div className="mt-8 bg-gradient-to-r from-sky-500 to-sky-600 rounded-2xl p-6 text-white max-w-2xl">
          <h3 className="font-semibold text-lg mb-3">🦷 {t('app_name')}</h3>
          <div className="space-y-1 text-sky-100 text-sm">
            <p>🕐 {t('client.hours')}</p>
            <p>📞 +216 XX XXX XXX</p>
            <p>📍 {t('client.address')}</p>
          </div>
        </div>
      </main>
    </div>
  );
}