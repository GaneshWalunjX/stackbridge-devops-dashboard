import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">DevOps Dashboard</h1>
      <button
        onClick={handleLogout}
        className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-100"
      >
        Logout
      </button>
    </nav>
  );
}
