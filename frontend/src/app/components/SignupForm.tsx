'use client';
import { useState } from 'react';
import { signUp } from '@/app/lib/auth';

const SignupForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signUp(email, password);
      // Redirect or notify success
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="border px-3 py-2 w-full rounded"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="border px-3 py-2 w-full rounded"
        required
      />
      {error && <p className="text-red-500">{error}</p>}
      <button type="submit" className="bg-green-600 text-white py-2 px-4 rounded">
        Sign Up
      </button>
    </form>
  );
};

export default SignupForm;
