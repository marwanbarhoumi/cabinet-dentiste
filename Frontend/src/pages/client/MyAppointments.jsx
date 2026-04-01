import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import API from '../../api/axios';
import { useTranslation } from 'react-i18next';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  completed: 'bg-blue-100 text-blue-700',
};

export default function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data } = await API.get('/appointments/my');
        setAppointments(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  const cancelAppointment = async (id) => {
    if (!window.confirm(t('my_appointments.cancel_confirm'))) return;
    try {
      await API.patch(`/appointments/${id}/cancel`);
      setAppointments(prev => prev.map(a => a._id === id ? { ...a, status: 'cancelled' } : a));
    } catch (err) {
      console.error(err);
    }
  };

  const upcoming = appointments.filter(a => ['pending', 'confirmed'].includes(a.status));
  const past = appointments.filter(a => ['completed', 'cancelled'].includes(a.status));

  const AppointmentCard = ({ apt }) => (
    <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-all">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-gray-800">{t(`types.${apt.type}`)}</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[apt.status]}`}>
              {t(`status.${apt.status}`)}
            </span>
          </div>
          <p className="text-sm text-gray-500">
            📅 {new Date(apt.date).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          <p className="text-sm text-gray-500">🕐 {apt.time}</p>
          {apt.notes && <p className="text-sm text-gray-400 mt-2 italic">"{apt.notes}"</p>}
        </div>
        {apt.status === 'pending' && (
          <button onClick={() => cancelAppointment(apt._id)}
            className="text-xs text-red-500 hover:bg-red-50 px-3 py-1 rounded-lg transition-all">
            {t('my_appointments.cancel')}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">{t('my_appointments.title')}</h1>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div>
          </div>
        ) : appointments.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <span className="text-5xl block mb-4">📅</span>
            <p className="text-lg">{t('my_appointments.no_appointments')}</p>
            <a href="/client/book" className="text-sky-500 text-sm mt-2 inline-block hover:underline">
              {t('my_appointments.book_link')}
            </a>
          </div>
        ) : (
          <div className="max-w-2xl space-y-8">
            {upcoming.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-700 mb-4">
                  📆 {t('my_appointments.upcoming')} ({upcoming.length})
                </h2>
                <div className="space-y-3">
                  {upcoming.map(apt => <AppointmentCard key={apt._id} apt={apt} />)}
                </div>
              </div>
            )}
            {past.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-700 mb-4">
                  🕐 {t('my_appointments.history')} ({past.length})
                </h2>
                <div className="space-y-3">
                  {past.map(apt => <AppointmentCard key={apt._id} apt={apt} />)}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}