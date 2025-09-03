// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch("http://localhost:4000/dashboard");
        const json = await res.json();
        setData(json);
      } catch (err) {
        setError("Failed to load dashboard data");
      }
    };

    fetchDashboard();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {!data ? (
          <p>Loading...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-4 rounded shadow">
              <h2 className="text-lg font-semibold mb-2">Pipelines</h2>
              <ul className="list-disc pl-5">
                {data.pipelines.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-4 rounded shadow">
              <h2 className="text-lg font-semibold mb-2">Containers</h2>
              <ul className="list-disc pl-5">
                {data.containers.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-4 rounded shadow">
              <h2 className="text-lg font-semibold mb-2">Metrics</h2>
              <p>CPU: {data.metrics.cpu}</p>
              <p>Memory: {data.metrics.memory}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
