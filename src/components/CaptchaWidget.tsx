import { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';

const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function makeCode() {
  let r = '';
  for (let i = 0; i < 6; i++) r += chars[Math.floor(Math.random() * chars.length)];
  return r;
}

function makeMathChallenge() {
  const num1 = Math.floor(Math.random() * 9) + 1;
  const num2 = Math.floor(Math.random() * 9) + 1;
  return { num1, num2, answer: num1 + num2 };
}

export interface CaptchaWidgetProps {
  valid: boolean;
  onValidityChange: (valid: boolean) => void;
}

export function CaptchaWidget({ valid, onValidityChange }: CaptchaWidgetProps) {
  const [code, setCode] = useState(makeCode);
  const [visualInput, setVisualInput] = useState('');
  const [{ num1, num2, answer }, setMathChallenge] = useState(makeMathChallenge);
  const [accessibleInput, setAccessibleInput] = useState('');

  useEffect(() => {
    const visualValid = visualInput.trim().toUpperCase() === code;
    const accessibleValid = parseInt(accessibleInput.trim(), 10) === answer;
    onValidityChange(visualValid || accessibleValid);
  }, [visualInput, accessibleInput, code, answer, onValidityChange]);

  const refresh = () => {
    setCode(makeCode());
    setVisualInput('');
    setMathChallenge(makeMathChallenge());
    setAccessibleInput('');
  };

  return (
    <div className="space-y-2">
      <p className="sr-only">
        Complete cualquiera de los dos desafíos siguientes para verificar que es una persona.
        Puede ingresar el código visual o resolver la pregunta alternativa accesible.
      </p>

      <div className="flex items-center gap-1 text-sm font-semibold text-sis-navy">
        <span>Verificación de Seguridad (CAPTCHA)</span>
        <span
          className="inline-flex items-center justify-center w-4 h-4 rounded-full border border-sis-navy text-[10px] cursor-help"
          title="Ingrese el código mostrado o responda la alternativa accesible"
          role="img"
          aria-label="Información: ingrese el código mostrado en la imagen o responda la pregunta alternativa accesible"
        >
          i
        </span>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="bg-gray-200 rounded px-3 py-2 select-none" role="img" aria-label={`Código CAPTCHA visual: ${code}`}>
            <span
              className="font-mono text-lg font-bold tracking-widest text-gray-700"
              style={{ textShadow: '1px 1px 0 #bbb, -1px -1px 0 #fff' }}
            >
              {code.split('').map((ch, i) => (
                <span
                  key={`${code}-${i}`}
                  className="inline-block"
                  style={{
                    transform: `rotate(${((i * 7 + 3) % 30) - 15}deg) translateY(${((i * 5) % 6) - 3}px)`,
                    color: ['#374151', '#1a3a5c', '#6b7280', '#4b5563'][i % 4],
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
            aria-label="Generar nuevo código y nuevo desafío accesible"
            title="Refrescar CAPTCHA"
          >
            <RefreshCw className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        <input
          id="captcha-input"
          type="text"
          value={visualInput}
          onChange={(e) => setVisualInput(e.target.value)}
          placeholder="Ingrese el código CAPTCHA"
          aria-label="Código CAPTCHA visual"
          aria-invalid={!valid}
          className="flex-1 min-w-[220px] border border-sis-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sis-navy/30"
        />
      </div>

      <div className="flex items-center gap-2 flex-wrap sr-only">
        <span className="text-sm text-sis-text">
          Alternativa accesible: ¿Cuánto es {num1} + {num2}?
        </span>
        <input
          id="captcha-accessible-input"
          type="text"
          inputMode="numeric"
          value={accessibleInput}
          onChange={(e) => setAccessibleInput(e.target.value)}
          placeholder="Respuesta"
          aria-label="Respuesta del desafío accesible"
          aria-invalid={!valid}
          className="w-24 border border-sis-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sis-navy/30"
        />
      </div>
    </div>
  );
}
