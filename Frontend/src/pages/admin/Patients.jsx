import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import API from '../../api/axios';
import { useTranslation } from 'react-i18next';

export default function AdminPatients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [record, setRecord] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const { data } = await API.get('/patients');
        setPatients(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  const openRecord = async (patient) => {
    setSelected(patient);
    setRecord(null);
    try {
      const { data } = await API.get(`/patients/${patient._id}/record`);
      setRecord(data);
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = patients.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">{t('patients.title')}</h1>

        <input
          type="text"
          placeholder={`🔍 ${t('patients.search')}`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 text-sm mb-6"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b">
              <h2 className="font-semibold text-gray-800">{t('patients.list')} ({filtered.length})</h2>
            </div>
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div>
              </div>
            ) : filtered.length === 0 ? (
              <p className="text-center text-gray-400 py-8">{t('patients.no_patients')}</p>
            ) : (
              <div className="divide-y max-h-96 overflow-y-auto">
                {filtered.map((patient) => (
                  <div key={patient._id} onClick={() => openRecord(patient)}
                    className={`px-6 py-4 cursor-pointer hover:bg-sky-50 transition-all ${
                      selected?._id === patient._id ? 'bg-sky-50 border-l-4 border-sky-500' : ''
                    }`}>
                    <p className="font-medium text-gray-800">{patient.name}</p>
                    <p className="text-sm text-gray-500">{patient.email}</p>
                    <p className="text-sm text-gray-400">{patient.phone || t('patients.no_phone')}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6">
            {!selected ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 py-12">
                <span className="text-4xl mb-3">📋</span>
                <p>{t('patients.select')}</p>
              </div>
            ) : !record ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-sky-500"></div>
              </div>
            ) : (
              <div>
                <h2 className="font-semibold text-gray-800 mb-4">{t('patients.record')} — {selected.name}</h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{t('patients.allergies')}</p>
                    <p className="text-sm text-gray-500">
                      {record.allergies?.length > 0 ? record.allergies.join(', ') : t('patients.no_allergies')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-2">{t('patients.treatments')}</p>
                    {record.treatments?.length === 0 ? (
                      <p className="text-sm text-gray-400">{t('patients.no_treatments')}</p>
                    ) : (
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {record.treatments?.map((tr, i) => (
                          <div key={i} className="bg-gray-50 rounded-xl p-3">
                            <p className="text-sm font-medium">{tr.description}</p>
                            <p className="text-xs text-gray-400">
                              {new Date(tr.date).toLocaleDateString('fr-FR')} — {tr.cost} TND
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}