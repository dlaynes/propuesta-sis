import { useState } from 'react';
import { RefreshCw } from 'lucide-react';

const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function makeCode() {
  let r = '';
  for (let i = 0; i < 6; i++) r += chars[Math.floor(Math.random() * chars.length)];
  return r;
}

interface CaptchaWidgetProps {
  value: string;
  onChange: (value: string) => void;
}

export function CaptchaWidget({ value, onChange }: CaptchaWidgetProps) {
  const [code, setCode] = useState(makeCode);

  const refresh = () => {
    setCode(makeCode());
    onChange('');
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1 text-sm font-semibold text-sis-navy">
        <span>Verificación de Seguridad (CAPTCHA)</span>
        <span className="inline-flex items-center justify-center w-4 h-4 rounded-full border border-sis-navy text-[10px] cursor-help" title="Ingrese el código mostrado">i</span>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="bg-gray-200 rounded px-3 py-2 select-none">
            <span className="font-mono text-lg font-bold tracking-widest text-gray-700"
              style={{ textShadow: '1px 1px 0 #bbb, -1px -1px 0 #fff' }}
            >
              {code.split('').map((ch, i) => (
                <span
                  key={`${code}-${i}`}
                  className="inline-block"
                  style={{
                    transform: `rotate(${((i * 7 + 3) % 30) - 15}deg) translateY(${((i * 5) % 6) - 3}px)`,
                    color: ['#374151','#1a3a5c','#6b7280','#4b5563'][i % 4],
                  }}
                >
                  {ch}
                </span>
              ))}
            </span>
          </div>

          <button
            type="button"
            onClick={refresh}
            className="p-2 rounded bg-sis-navy text-white hover:bg-sis-navy-light transition-colors"
            title="Refrescar CAPTCHA"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Ingrese el código captcha de la izquierda"
          className="flex-1 min-w-[220px] border border-sis-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sis-navy/30"
        />
      </div>
    </div>
  );
}
