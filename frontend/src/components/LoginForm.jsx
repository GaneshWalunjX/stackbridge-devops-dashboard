import React, { useState } from 'react';

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Login</h2>

      {/* Email Field */}
      <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-1 uppercase">
        Email
      </label>
      <input
        type="email"
        id="email"
        placeholder="Enter your email"
        className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Password Field */}
      <label htmlFor="password" className="block text-sm font-bold text-gray-700 mb-1 uppercase">
        Password
      </label>
      <div className="relative mb-4">
        <input
          type={showPassword ? 'text' : 'password'}
          id="password"
          placeholder="Enter your password"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-2 text-blue-600 font-semibold text-sm"
        >
          {showPassword ? 'Hide' : 'Show'}
        </button>
      </div>

      {/* Options Row */}
      <div className="flex justify-between items-center mb-6 text-sm">
        <label className="flex items-center gap-2 text-gray-700">
          <input type="checkbox" />
          Remember me
        </label>
        <a href="#" className="text-blue-600 hover:underline">
          Forgot password?
        </a>
      </div>

      {/* Sign In Button */}
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition font-bold uppercase"
      >
        Sign in
      </button>
    </form>
  );
};

export default LoginForm;
