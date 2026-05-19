import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AuthCallback() {
  const [params] = useSearchParams();
  const { loginWithCode } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  useEffect(() => {
    const code = params.get('code');
    const err = params.get('error');

    if (err || !code) {
      setError('Error al autenticar con Google. Intentá de nuevo.');
      setTimeout(() => navigate('/login'), 3000);
      return;
    }

    loginWithCode(code)
      .then(() => navigate('/plants'))
      .catch(() => {
        setError('Código inválido o expirado. Intentá de nuevo.');
        setTimeout(() => navigate('/login'), 3000);
      });
  }, []);

  return (
    <div className="min-h-screen bg-canvas-ice flex items-center justify-center">
      <div className="text-center">
        {error ? (
          <>
            <p className="text-[14px] text-red-500">{error}</p>
            <p className="text-[13px] text-slate-mist mt-2">Redirigiendo...</p>
          </>
        ) : (
          <>
            <div className="w-10 h-10 border-2 border-valley-green border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-[14px] text-slate-mist">Autenticando con Google...</p>
          </>
        )}
      </div>
    </div>
  );
}
