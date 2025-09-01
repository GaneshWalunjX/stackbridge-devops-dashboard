import React from 'react';
import LoginForm from '../components/LoginForm';

const Login = () => {
  return (
    <div className="flex h-screen">
      {/* Left Gradient Panel */}
      <div className="w-1/2 flex flex-col justify-center px-16 bg-gradient-to-br from-blue-600 to-purple-700 text-white">
        <h1 className="text-4xl font-bold mb-4">Welcome Back</h1>
        <p className="text-lg leading-relaxed">
          Sign in to access your dashboard and manage deployments.
        </p>
      </div>

      {/* Right Login Form Panel */}
      <div className="w-1/2 flex justify-center items-center bg-white">
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
