import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import LangSwitcher from '../components/LangSwitcher';
export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      navigate('/client');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur inscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-sky-100 flex items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <LangSwitcher />
      </div>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <span className="text-5xl">🦷</span>
          <h2 className="text-2xl font-bold text-gray-800 mt-3">{t('register.title')}</h2>
          <p className="text-gray-500 text-sm mt-1">{t('register.subtitle')}</p>
        </div>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-4 text-sm">
            ❌ {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('register.name')}</label>
            <input type="text" value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 text-sm"
              required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('register.email')}</label>
            <input type="email" value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 text-sm"
              required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('register.phone')}</label>
            <input type="tel" value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('register.password')}</label>
            <input type="password" value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 text-sm"
              required />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-60">
            {loading ? t('register.loading') : t('register.submit')}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-6">
          {t('register.have_account')}{' '}
          <Link to="/login" className="text-sky-500 font-semibold hover:underline">
            {t('register.login_link')}
          </Link>
        </p>
      </div>
    </div>
  );
}