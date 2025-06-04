'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { login } from '@/utils/auth'
import { serialize } from "cookie";
import { usePathname, useRouter } from "next/navigation";

const FormLogin = () => {
  const [loading, setLoading] = useState(false); // Estado de carga
  const [error, setError] = useState(""); // Estado de error
  const router = useRouter();
  // Estados para el formulario
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const validate = () => {
    if (!email || !password) {
      setError('the email and password are required');
      return false;
    }

    const emailRegex = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;
    if (!emailRegex.test(email)) {
      setError('Email error format');
      return false;
    }

    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
    if (!passwordRegex.test(password)) {
      setError('the password must contain at least 8 characters, one uppercase letter, one lowercase letter, and one number');
      return false;
    }

    setError("");
    return true;
  };
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // Evita la recarga de la página al enviar el formulario

    if (!validate()) {
      return;
    }

    setLoading(true); // Activa el estado de carga

    try {
      // Llama a la función de autenticación
      const { access_token } = await login(email, password);

      // Guardar el token en una cookie
      document.cookie = serialize("token", access_token, {
        path: "/",
        maxAge: 3600,
      });

      // Redirige a la página de dashboard
      router.push("/");
    } catch (error) {
      console.error(error);
      setError('Error in login, please check your credentials and try again.');
    } finally {
      setLoading(false); // Desactiva el estado de carga
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
        {/* Logo */}
        <div className="mb-6 text-center">
          <div className="mx-auto h-24 w-24  rounded-full flex items-center justify-center text-white font-bold text-lg">
            <Image src="/assets/logo-brand.png" alt="Logo" width={200} height={200} />
          </div>
          <h2 className="mt-4 text-2xl font-bold text-gray-800">Sign in to your account</h2>
          <p className="text-sm text-gray-500">Welcome back 👋</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#7a02fa]"
              placeholder="you@example.com"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#7a02fa]"
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </div>

          <div className="flex justify-between items-center text-sm">
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="accent-[#7a02fa]" />
              <span>Remember me</span>
            </label>
            <Link href="/forgot-password" className="text-[#7a02fa] hover:underline">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full bg-[#7a02fa] hover:bg-[#6900da] text-white font-semibold py-2 rounded-md transition-colors duration-200"
          >
            Sign in
          </button>
        </form>

        {/* Register CTA */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-[#7a02fa] hover:underline font-medium">
            Create one
          </Link>
        </p>
      </div>
    </div>
  )
}

export default FormLogin
