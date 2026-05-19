import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handle(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate('/plants');
    } catch (err) {
      setError(err.response?.data?.error || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-canvas-ice flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-[47px] font-bold text-adaline-ink leading-none">🌿</h1>
          <h2 className="text-[28px] font-bold text-adaline-ink mt-2">Crear cuenta</h2>
          <p className="text-[14px] text-mist-gray mt-1">Empezá a organizar tus plantas.</p>
        </div>

        <div className="bg-canvas-ice border border-stone-moss rounded-lg p-6 flex flex-col gap-4">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {[
              { field: 'name', label: 'Nombre', type: 'text', placeholder: 'Tu nombre' },
              { field: 'email', label: 'Email', type: 'email', placeholder: 'tu@email.com' },
              { field: 'password', label: 'Contraseña', type: 'password', placeholder: '••••••••' },
            ].map(({ field, label, type, placeholder }) => (
              <div key={field} className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-adaline-ink">{label}</label>
                <input
                  className="input"
                  type={type}
                  placeholder={placeholder}
                  value={form[field]}
                  onChange={handle(field)}
                  required
                  minLength={field === 'password' ? 6 : undefined}
                />
              </div>
            ))}

            {error && <p className="text-[13px] text-red-500">{error}</p>}

            <button type="submit" disabled={loading} className="btn-primary disabled:opacity-40">
              {loading ? 'Creando cuenta...' : 'Crear cuenta'}
            </button>
          </form>
        </div>

        <p className="text-center text-[13px] text-mist-gray mt-4">
          ¿Ya tenés cuenta?{' '}
          <Link to="/login" className="text-valley-green hover:underline">
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
