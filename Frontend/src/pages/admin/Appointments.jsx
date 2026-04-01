import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import API from '../../api/axios';
import { useTranslation } from 'react-i18next';

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const { t } = useTranslation();

  useEffect(() => { fetchAppointments(); }, []);

  const fetchAppointments = async () => {
    try {
      const { data } = await API.get('/appointments');
      setAppointments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await API.patch(`/appointments/${id}/status`, { status });
      setAppointments(prev => prev.map(a => a._id === id ? { ...a, status } : a));
    } catch (err) {
      console.error(err);
    }
  };

  const filters = [
    { val: 'all', label: t('appointments.all') },
    { val: 'pending', label: t('appointments.pending') },
    { val: 'confirmed', label: t('appointments.confirmed') },
    { val: 'completed', label: t('appointments.completed') },
    { val: 'cancelled', label: t('appointments.cancelled') },
  ];

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
    completed: 'bg-blue-100 text-blue-700',
  };

  const filtered = filter === 'all' ? appointments : appointments.filter(a => a.status === filter);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">{t('appointments.title')}</h1>

        <div className="flex gap-2 mb-6 flex-wrap">
          {filters.map(f => (
            <button key={f.val} onClick={() => setFilter(f.val)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                filter === f.val ? 'bg-sky-500 text-white' : 'bg-white text-gray-600 hover:bg-sky-50'
              }`}>
              {f.label}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div>
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-center text-gray-400 py-12">{t('appointments.no_appointments')}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr className="text-left text-gray-500">
                    <th className="px-6 py-4 font-medium">{t('appointments.patient')}</th>
                    <th className="px-6 py-4 font-medium">{t('appointments.date')}</th>
                    <th className="px-6 py-4 font-medium">{t('appointments.time')}</th>
                    <th className="px-6 py-4 font-medium">{t('appointments.type')}</th>
                    <th className="px-6 py-4 font-medium">{t('appointments.status')}</th>
                    <th className="px-6 py-4 font-medium">{t('appointments.actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((apt) => (
                    <tr key={apt._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-800">{apt.patient?.name}</p>
                        <p className="text-gray-400 text-xs">{apt.patient?.phone}</p>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{new Date(apt.date).toLocaleDateString('fr-FR')}</td>
                      <td className="px-6 py-4 text-gray-600">{apt.time}</td>
                      <td className="px-6 py-4 text-gray-600">{t(`types.${apt.type}`)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[apt.status]}`}>
                          {t(`status.${apt.status}`)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          {apt.status === 'pending' && (
                            <>
                              <button onClick={() => updateStatus(apt._id, 'confirmed')}
                                className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-medium hover:bg-green-200">
                                ✅ {t('appointments.confirm')}
                              </button>
                              <button onClick={() => updateStatus(apt._id, 'cancelled')}
                                className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-xs font-medium hover:bg-red-200">
                                ❌ {t('appointments.cancel')}
                              </button>
                            </>
                          )}
                          {apt.status === 'confirmed' && (
                            <button onClick={() => updateStatus(apt._id, 'completed')}
                              className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-200">
                              ✔️ {t('appointments.complete')}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}