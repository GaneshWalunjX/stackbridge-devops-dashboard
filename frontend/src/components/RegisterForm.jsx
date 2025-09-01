import { useState } from 'react'

const RegisterForm = () => {
  const [form, setForm] = useState({ username: '', email: '', password: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Registering:', form)
    alert('✅ Registered (mock)')
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-80">
      <h2 className="text-xl font-bold mb-4">Register</h2>
      <input type="text" placeholder="Username" className="input" onChange={e => setForm({ ...form, username: e.target.value })} />
      <input type="email" placeholder="Email" className="input" onChange={e => setForm({ ...form, email: e.target.value })} />
      <input type="password" placeholder="Password" className="input" onChange={e => setForm({ ...form, password: e.target.value })} />
      <button type="submit" className="btn">Sign Up</button>
    </form>
  )
}

export default RegisterForm
