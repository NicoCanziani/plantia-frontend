import { useState, useEffect } from 'react';
import { notificationsAPI } from '../services/api';
import { usePushNotifications } from '../hooks/usePushNotifications';

export default function NotificationSettings() {
  const [settings, setSettings] = useState(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const { isSupported, permission, subscribe, unsubscribe, loading: pushLoading } = usePushNotifications();

  useEffect(() => {
    notificationsAPI.getSettings().then((r) => setSettings(r.data));
  }, []);

  async function handleChange(field, value) {
    const updated = { ...settings, [field]: value };
    setSettings(updated);
    setSaving(true);
    try {
      await notificationsAPI.updateSettings({ [field]: value });
      setMsg('Guardado');
      setTimeout(() => setMsg(''), 2000);
    } finally {
      setSaving(false);
    }
  }

  async function handlePushToggle() {
    if (settings?.pushEnabled) {
      await unsubscribe();
      handleChange('pushEnabled', false);
    } else {
      const result = await subscribe();
      if (result.ok) {
        handleChange('pushEnabled', true);
      } else if (result.reason === 'denied') {
        setMsg('Permisos de notificación denegados en el browser');
        setTimeout(() => setMsg(''), 3000);
      }
    }
  }

  if (!settings) {
    return <div className="text-[14px] text-slate-mist">Cargando...</div>;
  }

  return (
    <div className="flex flex-col gap-6">
      <Toggle
        label="Notificaciones push"
        description={
          !isSupported
            ? 'Tu browser no soporta push notifications'
            : permission === 'denied'
            ? 'Permisos denegados — habilitá desde el browser'
            : 'Recibí alertas de riego en este dispositivo'
        }
        checked={settings.pushEnabled}
        onChange={handlePushToggle}
        disabled={!isSupported || permission === 'denied' || pushLoading}
      />

      <Toggle
        label="Notificaciones por email"
        description="Recibí un resumen diario de plantas para regar"
        checked={settings.emailEnabled}
        onChange={(v) => handleChange('emailEnabled', v)}
        disabled={saving}
      />

      <div className="flex flex-col gap-1.5">
        <label className="text-[13px] font-bold text-adaline-ink">Hora del recordatorio</label>
        <input
          type="time"
          className="input w-36"
          value={settings.reminderTime}
          onChange={(e) => handleChange('reminderTime', e.target.value)}
          disabled={saving}
        />
        <p className="text-[12px] text-gray">Se enviará a esta hora si tenés plantas que regar.</p>
      </div>

      {msg && <p className="text-[13px] text-valley-green">{msg}</p>}
    </div>
  );
}

function Toggle({ label, description, checked, onChange, disabled }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-[14px] font-bold text-adaline-ink">{label}</p>
        <p className="text-[12px] text-gray mt-0.5">{description}</p>
      </div>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => !disabled && onChange(!checked)}
        disabled={disabled}
        className={[
          'relative w-10 h-6 rounded-full transition-colors shrink-0 disabled:opacity-40',
          checked ? 'bg-valley-green' : 'bg-stone-moss',
        ].join(' ')}
      >
        <span
          className={[
            'absolute top-1 w-4 h-4 rounded-full bg-white transition-transform shadow-sm',
            checked ? 'translate-x-5' : 'translate-x-1',
          ].join(' ')}
        />
      </button>
    </div>
  );
}
