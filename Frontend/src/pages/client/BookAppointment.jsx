import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import API from '../../api/axios';
import { useTranslation } from 'react-i18next';

const timeSlots = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30',
];

export default function BookAppointment() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [form, setForm] = useState({ date: '', time: '', type: 'consultation', notes: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  const typeOptions = [
    'consultation', 'detartrage', 'extraction', 'implant', 'blanchiment', 'autre'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await API.post('/appointments', form);
      setSuccess(true);
      setTimeout(() => navigate('/client/appointments'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la réservation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">{t('book.title')}</h1>
        <p className="text-gray-500 mb-8">{t('book.subtitle')}</p>

        <div className="bg-white rounded-2xl shadow-sm p-8 max-w-lg">
          {success ? (
            <div className="text-center py-8">
              <span className="text-5xl">✅</span>
              <h3 className="text-xl font-semibold text-gray-800 mt-4">{t('book.success_title')}</h3>
              <p className="text-gray-500 mt-2">{t('book.success_sub')}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                  ❌ {error}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('book.type')}</label>
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 text-sm">
                  {typeOptions.map(val => (
                    <option key={val} value={val}>{t(`types.${val}`)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('book.date')}</label>
                <input type="date" min={today} value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 text-sm"
                  required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('book.time')}</label>
                <div className="grid grid-cols-4 gap-2">
                  {timeSlots.map((slot) => (
                    <button key={slot} type="button" onClick={() => setForm({ ...form, time: slot })}
                      className={`py-2 rounded-xl text-sm font-medium transition-all ${
                        form.time === slot ? 'bg-sky-500 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-sky-100'
                      }`}>
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('book.notes')}</label>
                <textarea rows={3} placeholder={t('book.notes_placeholder')} value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 text-sm resize-none" />
              </div>
              <button type="submit" disabled={loading || !form.date || !form.time}
                className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-50">
                {loading ? t('book.loading') : `📅 ${t('book.submit')}`}
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}