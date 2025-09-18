import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config/api';

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      setError('Missing token');
      return;
    }

    fetch(`${API_BASE_URL}/dashboard`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load dashboard data');
        return res.json();
      })
      .then((data) => {
        setDashboardData(data);
      })
      .catch((err) => {
        console.error('Dashboard fetch error:', err);
        setError(err.message || 'Unexpected error');
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">DevOps Dashboard</h1>
        <button onClick={handleLogout} className="bg-white text-blue-600 px-4 py-2 rounded">
          Logout
        </button>
      </header>

      <main className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Dashboard</h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}
        {!dashboardData && !error && <p className="text-gray-500">Loading...</p>}

        {dashboardData && (
          <div className="bg-white p-4 rounded shadow">
            <pre>{JSON.stringify(dashboardData, null, 2)}</pre>
          </div>
        )}
      </main>
    </div>
  );
}
