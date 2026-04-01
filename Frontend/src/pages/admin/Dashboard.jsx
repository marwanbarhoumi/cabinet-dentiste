import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import API from '../../api/axios';
import { useTranslation } from 'react-i18next';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ patients: 0, appointments: 0, pending: 0, today: 0 });
  const [recentAppointments, setRecentAppointments] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [patientsRes, appointmentsRes] = await Promise.all([
          API.get('/patients'),
          API.get('/appointments'),
        ]);
        const appointments = appointmentsRes.data;
        const today = new Date().toDateString();
        setStats({
          patients: patientsRes.data.length,
          appointments: appointments.length,
          pending: appointments.filter(a => a.status === 'pending').length,
          today: appointments.filter(a => new Date(a.date).toDateString() === today).length,
        });
        setRecentAppointments(appointments.slice(0, 5));
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
    completed: 'bg-blue-100 text-blue-700',
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">{t('dashboard.title')}</h1>
        <p className="text-gray-500 mb-8">{t('dashboard.subtitle')}</p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: t('dashboard.total_patients'), value: stats.patients, icon: '👥', color: 'bg-blue-500' },
            { label: t('dashboard.total_rdv'), value: stats.appointments, icon: '📅', color: 'bg-green-500' },
            { label: t('dashboard.pending'), value: stats.pending, icon: '⏳', color: 'bg-yellow-500' },
            { label: t('dashboard.today'), value: stats.today, icon: '📆', color: 'bg-purple-500' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl shadow-sm p-6 flex items-center gap-4">
              <div className={`${stat.color} w-12 h-12 rounded-xl flex items-center justify-center text-2xl`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">{t('dashboard.recent')}</h2>
          {recentAppointments.length === 0 ? (
            <p className="text-gray-400 text-center py-8">{t('dashboard.no_appointments')}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b">
                    <th className="pb-3 font-medium">{t('appointments.patient')}</th>
                    <th className="pb-3 font-medium">{t('appointments.date')}</th>
                    <th className="pb-3 font-medium">{t('appointments.time')}</th>
                    <th className="pb-3 font-medium">{t('appointments.type')}</th>
                    <th className="pb-3 font-medium">{t('appointments.status')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recentAppointments.map((apt) => (
                    <tr key={apt._id} className="hover:bg-gray-50">
                      <td className="py-3 font-medium text-gray-800">{apt.patient?.name}</td>
                      <td className="py-3 text-gray-600">{new Date(apt.date).toLocaleDateString('fr-FR')}</td>
                      <td className="py-3 text-gray-600">{apt.time}</td>
                      <td className="py-3 text-gray-600">{t(`types.${apt.type}`)}</td>
                      <td className="py-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[apt.status]}`}>
                          {t(`status.${apt.status}`)}
                        </span>
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