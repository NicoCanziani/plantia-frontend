import NotificationSettings from '../components/NotificationSettings';

export default function Settings() {
  return (
    <div className="flex flex-col gap-6 max-w-lg">
      <h1 className="text-[28px] font-bold text-adaline-ink">Configuración</h1>

      <div className="bg-canvas-ice border border-stone-moss rounded-lg p-6">
        <h2 className="text-[16px] font-bold text-adaline-ink mb-5">Notificaciones</h2>
        <NotificationSettings />
      </div>
    </div>
  );
}
