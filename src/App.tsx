import { useState, useMemo, useRef, useEffect } from 'react';
import { Heart, DollarSign, Smile, GraduationCap, ChevronDown, ChevronUp, CheckCircle2, Info } from 'lucide-react';

interface Benefit {
  id: string;
  label: string;
  saving: number;
  defaultChecked: boolean;
  variable?: boolean;
  variableLabel?: string;
  variableDisplay?: string;
}

interface BenefitGroup {
  id: string;
  title: string;
  icon: React.ReactNode;
  benefits: Benefit[];
}

const GROUPS: BenefitGroup[] = [
  {
    id: 'salud',
    title: 'Salud',
    icon: <Heart className="w-5 h-5" />,
    benefits: [
      { id: 's1',  label: 'Consulta medicina general (aporte Los Héroes)',                 saving: 6890,   defaultChecked: true  },
      { id: 's2',  label: 'Consulta oftalmología (aporte Los Héroes)',                     saving: 16080,  defaultChecked: false },
      { id: 's3',  label: 'Consulta pediatría (aporte Los Héroes)',                        saving: 6700,   defaultChecked: false },
      { id: 's4',  label: 'Consulta ginecología (aporte Los Héroes)',                      saving: 6700,   defaultChecked: false },
      { id: 's5',  label: 'Consulta cardiología (aporte Los Héroes)',                      saving: 6700,   defaultChecked: false },
      { id: 's6',  label: 'Consulta urología (aporte Los Héroes)',                         saving: 16080,  defaultChecked: false },
      { id: 's7',  label: 'Consulta otorrinolaringología (aporte Los Héroes)',             saving: 16080,  defaultChecked: false },
      { id: 's8',  label: 'Consulta geriatría (aporte Los Héroes)',                        saving: 16080,  defaultChecked: false },
      { id: 's9',  label: 'Telemedicina medicina general (Mediclic)',           saving: 6890,   defaultChecked: false },
      { id: 's10', label: 'Telemedicina cardiología (Mediclic)',                saving: 6700,   defaultChecked: false },
      { id: 's11', label: 'Telemedicina psicología (Mediclic)',                 saving: 9260,   defaultChecked: false },
      { id: 's12', label: 'Telemedicina psiquiatría (Mediclic)',                saving: 12395,  defaultChecked: false },
      { id: 's13', label: 'Examen TSH aporte Los Héroes $0 (jun-jul)',                     saving: 5000,   defaultChecked: false },
      { id: 's14', label: 'Limpieza dental gratuita (Everest)',                 saving: 39980,  defaultChecked: false },
      { id: 's15', label: 'Urgencia dental $50.000 (Vidaintegra/Dávila)',       saving: 30000,  defaultChecked: false },
      { id: 's16', label: 'Mamografía gratuita (Camión FALP)',                  saving: 35000,  defaultChecked: false },
      { id: 's17', label: 'Seguro mascotas SomosPawer (10% dscto)',             saving: 1490,   defaultChecked: false },
      { id: 's18', label: 'Medicamentos MarketCare precio laboratorio',         saving: 3000,   defaultChecked: false },
      { id: 's19', label: 'Operativo salud: evaluación cardio-nutricional',     saving: 8000,   defaultChecked: false },
      { id: 's20', label: 'Operativo salud: masoterapia y parafinoterapia',     saving: 10000,  defaultChecked: false },
      { id: 's21', label: 'Camión Estilo & Bienestar (corte de pelo/manicure)', saving: 8000,   defaultChecked: false },
      { id: 's22', label: 'Lentes ópticos y de contacto (reembolso 30%)',      saving: 10000,  defaultChecked: false },
      { id: 's23', label: 'Reembolso farmacias (compra de medicamentos)',        saving: 5000,   defaultChecked: false },
      { id: 's24', label: 'Audífonos Auditron', saving: 0, defaultChecked: false, variable: true, variableLabel: '25% / 20% / 10% según forma de pago', variableDisplay: 'Hasta 25% de descuento en Audífonos Auditron' },
    ],
  },
  {
    id: 'financiero',
    title: 'Descuentos',
    icon: <DollarSign className="w-5 h-5" />,
    benefits: [
      { id: 'f1', label: 'Descuento gas Lipigas cilindro 15kg (LipiApp)',     saving: 7000, defaultChecked: false },
      { id: 'f2', label: 'Descuento gas Lipigas 15kg (web/callcenter)',       saving: 6500, defaultChecked: true  },
      { id: 'f3', label: 'Descuento gas Lipigas cilindro 11kg (uno mensual)', saving: 3000, defaultChecked: false },
      { id: 'f4', label: 'Devolución streaming (Netflix/Amazon/Disney+)',     saving: 2000, defaultChecked: false },
      { id: 'f5', label: 'Devolución música (Spotify/Apple Music)',           saving: 2000, defaultChecked: false },
    ],
  },
  {
    id: 'recreacion',
    title: 'Recreación y Entretención',
    icon: <Smile className="w-5 h-5" />,
    benefits: [
      { id: 'r1',  label: 'Entrada BuinZoo',                                    saving: 7990,  defaultChecked: false },
      { id: 'r2',  label: 'Entrada Fantasilandia',                              saving: 12090, defaultChecked: false },
      { id: 'r3',  label: 'Cine Cinépolis (combo entrada+popcorn+bebida)',       saving: 9500,  defaultChecked: true  },
      { id: 'r4',  label: 'Cine Cinépolis (entrada sola)',                       saving: 2610,  defaultChecked: false },
      { id: 'r5',  label: 'Cine Cineplanet (entrada)',                           saving: 5110,  defaultChecked: false },
      { id: 'r6',  label: 'Cine Cinemark (entrada)',                             saving: 3200,  defaultChecked: false },
      { id: 'r7',  label: 'Experiencias Tur.com (20% dscto)',                    saving: 8000,  defaultChecked: false },
      { id: 'r8',  label: 'Héroes Parques 7x5 noches',                          saving: 20000, defaultChecked: false },
      { id: 'r9',  label: 'Atrápalo (teatro, stand-up, música, ferias)',         saving: 5000,  defaultChecked: false },
      { id: 'r10', label: 'Taller gratuito mensual (manualidades/deporte)',      saving: 8000,  defaultChecked: false },
      { id: 'r11', label: 'Paseo Full Day ($15.000 todo incluido)',              saving: 15000, defaultChecked: false },
      { id: 'r12', label: 'Pasajes EFE Trenes Alameda-Chillán (10% dscto)', saving: 0, defaultChecked: false, variable: true, variableLabel: '10% dscto.', variableDisplay: '10% de descuento en Pasajes EFE Trenes Alameda–Chillán' },
    ],
  },
  {
    id: 'educacion',
    title: 'Apoyo Social y Educación',
    icon: <GraduationCap className="w-5 h-5" />,
    benefits: [
      { id: 'e1', label: 'Beca gastronómica Ñam + Los Héroes (Antofagasta)', saving: 80000,  defaultChecked: false },
      { id: 'e2', label: 'Educación IPP — matrícula gratis (100%)',          saving: 50000,  defaultChecked: false },
      { id: 'e3', label: 'Educación IPP — 10% arancel semestral',            saving: 30000,  defaultChecked: false },
      { id: 'e4', label: 'Plan más Héroes (financiamiento proyecto)',         saving: 500000, defaultChecked: false },
    ],
  },
];

function buildInitialChecked(): Record<string, boolean> {
  const state: Record<string, boolean> = {};
  for (const group of GROUPS)
    for (const b of group.benefits)
      state[b.id] = b.defaultChecked;
  return state;
}

function formatCLP(n: number): string {
  return '$' + Math.round(n).toLocaleString('es-CL');
}

function parsePension(raw: string): number {
  const digits = raw.replace(/\./g, '').replace(/[^0-9]/g, '');
  return digits === '' ? 0 : parseInt(digits, 10);
}

function formatPensionDisplay(raw: string): string {
  const digits = raw.replace(/\./g, '').replace(/[^0-9]/g, '');
  if (digits === '') return '';
  return parseInt(digits, 10).toLocaleString('es-CL');
}

// ── Animated number counter ────────────────────────────────────────────────────
function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(value);
  const rafRef = useRef<number>(0);
  const prevValue = useRef(value);

  useEffect(() => {
    const start = prevValue.current;
    const end = value;
    prevValue.current = value;
    if (start === end) return;
    const duration = 380;
    const startTime = performance.now();

    const tick = (now: number) => {
      const t = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(start + (end - start) * eased));
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };

    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [value]);

  return <>{Math.round(display).toLocaleString('es-CL')}</>;
}

// ── Collapsible benefit group ──────────────────────────────────────────────────
function GroupSection({
  group,
  checked,
  onToggle,
}: {
  group: BenefitGroup;
  checked: Record<string, boolean>;
  onToggle: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const checkedCount = group.benefits.filter(b => checked[b.id]).length;
  const groupTotal = group.benefits.filter(b => checked[b.id]).reduce((s, b) => s + b.saving, 0);

  return (
    <div className="rounded-2xl border border-gray-100 overflow-hidden shadow-sm bg-white">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
        aria-expanded={open}
        aria-controls={`group-${group.id}`}
      >
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-[#002395]/8 text-[#002395] shrink-0">
            {group.icon}
          </span>
          <span className="font-semibold text-gray-900 text-left">{group.title}</span>
          {checkedCount > 0 && (
            <span className="text-xs font-semibold bg-[#002395]/10 text-[#002395] px-2 py-0.5 rounded-full">
              {checkedCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 shrink-0 ml-2">
          {groupTotal > 0 && (
            <span className="text-sm font-bold text-gray-900">{formatCLP(groupTotal)}</span>
          )}
          {open
            ? <ChevronUp className="w-4 h-4 text-gray-400" />
            : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </div>
      </button>

      {open && (
        <div id={`group-${group.id}`} className="border-t border-gray-50 divide-y divide-gray-50">
          {group.benefits.map(b => (
            <label
              key={b.id}
              className="flex items-center justify-between px-5 py-3 cursor-pointer hover:bg-blue-50/40 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={!!checked[b.id]}
                  onChange={() => onToggle(b.id)}
                  className="w-4 h-4 rounded accent-[#002395] cursor-pointer shrink-0"
                  aria-label={b.label}
                />
                <span className="text-[15px] text-gray-700" style={{ lineHeight: '1.65' }}>{b.label}</span>
              </div>
              {b.variable ? (
                <span className="flex items-center gap-1 text-sm text-[#6B7280] whitespace-nowrap ml-4 shrink-0">
                  <Info className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  {b.variableLabel}
                </span>
              ) : (
                <span className="text-sm font-semibold text-gray-900 whitespace-nowrap ml-4 shrink-0">
                  {formatCLP(b.saving)}
                </span>
              )}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Results panel ──────────────────────────────────────────────────────────────
function ResultsPanel({
  pension,
  cost,
  totalSaving,
  netBenefit,
  multiplier,
  variableItems,
}: {
  pension: number;
  cost: number;
  totalSaving: number;
  netBenefit: number;
  multiplier: number;
  variableItems: string[];
}) {
  const hasResults = pension > 0;

  return (
    <div className={`space-y-4 transition-opacity duration-300 ${!hasResults ? 'opacity-50 pointer-events-none' : ''}`}>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

        {/* Ahorro total — secondary, small, gray */}
        <div className="px-5 pt-5 pb-3 flex items-center justify-between border-b border-gray-50">
          <p className="text-[11px] uppercase font-medium text-[#6B7280]" style={{ letterSpacing: '0.08em' }}>
            Ahorrarías por uso de beneficios
          </p>
          <div className="flex items-baseline gap-1">
            <span className="text-[20px] font-semibold text-[#6B7280]">
              {hasResults ? <>$<AnimatedNumber value={totalSaving} /></> : <span className="text-gray-200">$—</span>}
            </span>
            {hasResults && <span className="text-xs text-gray-400 font-medium">/ mes</span>}
          </div>
        </div>

        {/* Lo que paga — minimal row */}
        <div className="px-5 py-3 border-b border-gray-50 flex items-center justify-between">
          <p className="text-xs text-[#6B7280] font-medium">Lo que pagarías</p>
          <div className="flex items-baseline gap-1">
            <span className="text-sm font-semibold text-[#6B7280]">
              {hasResults ? <>$<AnimatedNumber value={cost} /></> : '—'}
            </span>
            {hasResults && <span className="text-xs text-gray-400">/ mes</span>}
          </div>
        </div>

        {/* Ahorrarías — hero number */}
        <div className="p-5">
          <div
            className="rounded-xl p-5"
            style={{
              background: '#EEF2FF',
              borderLeft: '4px solid #FF4E00',
            }}
          >
            <p
              className="text-[11px] uppercase font-bold text-gray-900 mb-2"
              style={{ letterSpacing: '0.08em' }}
            >
              Ahorrarías
            </p>
            <div className="flex items-baseline gap-1.5">
              <span
                className={`font-bold transition-colors leading-none ${
                  !hasResults ? 'text-gray-300' : 'text-gray-900'
                }`}
                style={{ fontSize: '48px' }}
              >
                {hasResults ? <>$<AnimatedNumber value={netBenefit} /></> : '$—'}
              </span>
              {hasResults && (
                <span className="text-sm text-[#6B7280] font-medium">/ mes</span>
              )}
            </div>
          </div>
        </div>

        {/* Multiplicador — plain caption */}
        <div className="px-5 pb-5">
          {hasResults && multiplier > 0 ? (
            <p className="text-[13px] text-[#6B7280]" style={{ lineHeight: '1.6' }}>
              Cada <span className="font-semibold">$1</span> que paga equivale a{' '}
              <span className="font-semibold text-[#002395]">
                ${multiplier.toFixed(1).replace('.', ',')}
              </span>{' '}
              en beneficios
            </p>
          ) : (
            <p className="text-[13px] text-gray-300">
              {hasResults
                ? 'Selecciona beneficios para ver el multiplicador'
                : 'Ingresa una pensión para comenzar'}
            </p>
          )}
        </div>
      </div>
      <div className="mt-3 flex items-start gap-2.5 bg-[#EEF2FF] border border-[#002395]/15 rounded-xl px-4 py-3">
        <div className="w-5 h-5 rounded-full bg-[#002395] flex items-center justify-center shrink-0 mt-0.5">
          <Info className="w-3 h-3 text-white" />
        </div>
        <p className="text-[12px] text-[#374151]" style={{ lineHeight: '1.6' }}>
          Estimación referencial, sujeta a confirmación según vigencia y condiciones de cada beneficio.
        </p>
      </div>

      {/* Además puedes acceder a */}
      {variableItems.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-5 py-4">
          <p className="text-[11px] uppercase font-medium text-[#6B7280] mb-3" style={{ letterSpacing: '0.08em' }}>
            Además puedes acceder a:
          </p>
          <ul className="space-y-2">
            {variableItems.map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <Info className="w-3.5 h-3.5 text-[#002395] shrink-0 mt-0.5" />
                <span className="text-[13px] text-gray-600" style={{ lineHeight: '1.6' }}>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* CTA */}
      {hasResults && netBenefit > 0 && (
        <div className="space-y-3 animate-fade-in">
          <div className="flex items-start gap-3 bg-[#00B388]/8 border border-[#00B388]/20 rounded-2xl p-4">
            <CheckCircle2 className="w-5 h-5 text-[#00B388] shrink-0 mt-0.5" />
            <p className="text-[15px] text-[#00B388] font-medium" style={{ lineHeight: '1.65' }}>
              <span className="font-black text-[#FF4E00]">¡Ser parte de Los Héroes vale la pena!</span> <span className="text-gray-900">Empieza a disfrutar tus beneficios hoy.</span>
            </p>
          </div>
          <a
            href="https://registro-clientes.losheroes.cl/?origin=SITIO_PRIV&preafiliacion=true"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-[#FF4E00] hover:bg-[#e64600] active:bg-[#cc3f00] text-white font-semibold text-[15px] py-4 rounded-full shadow-lg shadow-orange-100 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-orange-200"
            aria-label="Ingresa tu referido en Los Héroes"
          >
            <span aria-hidden="true">👉</span>
            <span>Quiero afiliarme ahora</span>
          </a>
        </div>
      )}
    </div>
  );
}

// ── App ────────────────────────────────────────────────────────────────────────
export default function App() {
  const [pensionInput, setPensionInput] = useState('');
  const [checked, setChecked] = useState<Record<string, boolean>>(buildInitialChecked);

  const pension = parsePension(pensionInput);
  const cost = pension * 0.01;

  const totalSaving = useMemo(
    () => GROUPS.flatMap(g => g.benefits).filter(b => checked[b.id] && !b.variable).reduce((s, b) => s + b.saving, 0),
    [checked],
  );

  const variableItems = useMemo(
    () => GROUPS.flatMap(g => g.benefits).filter(b => b.variable && checked[b.id]).map(b => b.variableDisplay!),
    [checked],
  );

  const netBenefit = Math.max(0, totalSaving - cost);
  const multiplier = cost > 0 ? totalSaving / cost : 0;

  function handlePensionChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPensionInput(formatPensionDisplay(e.target.value));
  }

  function toggleBenefit(id: string) {
    setChecked(prev => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <div className="min-h-screen bg-[#F4F5F7]" style={{ fontFamily: "'Poppins', sans-serif" }}>

      {/* Main */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 md:pt-10 lg:grid lg:grid-cols-[1fr_340px] lg:gap-8 lg:items-start">

        {/* Left */}
        <div className="space-y-6">

          <div>
            <h1 className="font-bold text-[#FF4E00] text-[24px] leading-tight">Ahorro mensual estimado</h1>
            <p className="mt-1 text-[15px] font-medium text-[#6B7280]" style={{ lineHeight: '1.65' }}>Selecciona los beneficios que usarías y descubre tu ahorro real</p>
          </div>

          {/* Paso 1 */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-7 h-7 rounded-full bg-[#FF4E00] text-white text-sm font-bold flex items-center justify-center shrink-0">1</span>
              <h2 className="font-semibold text-gray-900 text-[18px] leading-tight">Ingresa tu pension mensual</h2>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <label htmlFor="pension-input" className="block text-sm font-medium text-gray-900 mb-2">
                Pensión mensual
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-xl select-none">$</span>
                <input
                  id="pension-input"
                  type="text"
                  inputMode="numeric"
                  value={pensionInput}
                  onChange={handlePensionChange}
                  placeholder="500.000"
                  className="w-full pl-9 pr-4 py-3.5 text-2xl font-black border border-gray-300 rounded-lg focus:outline-none focus:border-[#002395] focus:ring-1 focus:ring-[#002395] transition-colors placeholder:text-gray-300 text-gray-800 bg-white"
                  aria-label="Pensión mensual en pesos chilenos"
                />
              </div>
            </div>
          </div>

          {/* Paso 2 */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-7 h-7 rounded-full bg-[#FF4E00] text-white text-sm font-bold flex items-center justify-center shrink-0">2</span>
              <h2 className="font-semibold text-gray-900 text-[18px] leading-tight">Selecciona los beneficios que usarías</h2>
            </div>
            <div className="space-y-3">
              {GROUPS.map(group => (
                <GroupSection key={group.id} group={group} checked={checked} onToggle={toggleBenefit} />
              ))}
            </div>
          </div>

        </div>

        {/* Right — Results */}
        <aside className="mt-8 lg:mt-0 lg:sticky lg:top-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-7 h-7 rounded-full bg-[#FF4E00] text-white text-sm font-bold flex items-center justify-center shrink-0">3</span>
            <h2 className="font-semibold text-gray-900 text-[18px] leading-tight">Resultado estimado</h2>
          </div>
          <ResultsPanel
            pension={pension}
            cost={cost}
            totalSaving={totalSaving}
            netBenefit={netBenefit}
            multiplier={multiplier}
            variableItems={variableItems}
          />
        </aside>

      </main>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      </footer>

    </div>
  );
}
