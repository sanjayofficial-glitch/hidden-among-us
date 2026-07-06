import React, { useState, useEffect, useRef } from 'react';
import type { Role } from '../../shared/types';

// ─── Custom Styles ────────────────────────────────────────────────

export const CustomStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700;800&display=swap');

    :root {
      --reddit-orange: #FF4500;
      --spy-red: #EF4444;
      --det-blue: #0EA5E9;
      --cit-green: #10B981;
      --dark-navy: #050B14;
      --glass-bg: rgba(13, 20, 36, 0.6);
      --glass-border: rgba(255, 255, 255, 0.08);
      --spring: cubic-bezier(0.175, 0.885, 0.32, 1.275);
      --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
    }

    * {
      font-family: 'Manrope', sans-serif;
      -webkit-tap-highlight-color: transparent;
      box-sizing: border-box;
    }

    .font-display { font-family: 'Space Grotesk', sans-serif; }

    @keyframes ambient-drift {
      0% { transform: translate(0, 0) rotate(0deg); }
      33% { transform: translate(15px, -15px) rotate(1deg); }
      66% { transform: translate(-10px, 15px) rotate(-1deg); }
      100% { transform: translate(0, 0) rotate(0deg); }
    }

    @keyframes breathe {
      0%, 100% { transform: scale(1); filter: drop-shadow(0 0 10px rgba(255,255,255,0.1)); }
      50% { transform: scale(1.02); filter: drop-shadow(0 0 25px rgba(255,255,255,0.3)); }
    }

    @keyframes slide-up-fade {
      from { opacity: 0; transform: translateY(30px) scale(0.95); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }

    @keyframes stamp-slam {
      0% { transform: scale(3) rotate(-15deg); opacity: 0; filter: blur(10px); }
      50% { transform: scale(0.9) rotate(2deg); opacity: 1; filter: blur(0px); }
      100% { transform: scale(1) rotate(-5deg); opacity: 1; }
    }

    @keyframes cinematic-shake {
      0%, 100% { transform: translate(0, 0) rotate(0); }
      10% { transform: translate(-5px, -5px) rotate(-1deg); }
      20% { transform: translate(5px, -5px) rotate(1deg); }
      30% { transform: translate(-5px, 5px) rotate(0deg); }
      40% { transform: translate(5px, 5px) rotate(1deg); }
      50% { transform: translate(-2px, -2px) rotate(-0.5deg); }
    }

    @keyframes radar-sweep {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    @keyframes heartbeat {
      0% { transform: scale(1); }
      15% { transform: scale(1.3); box-shadow: 0 0 40px var(--spy-red); }
      30% { transform: scale(1); }
      45% { transform: scale(1.3); box-shadow: 0 0 60px var(--spy-red); }
      60% { transform: scale(1); }
    }

    .glass-panel {
      background: var(--glass-bg);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid var(--glass-border);
      box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255,255,255,0.1);
    }

    .glass-card-hover {
      transition: all 0.4s var(--ease-out-expo);
    }
    .glass-card-hover:hover {
      transform: translateY(-5px) scale(1.02);
      background: rgba(25, 30, 50, 0.8);
      border-color: rgba(255,255,255,0.2);
      box-shadow: 0 15px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.2);
    }

    .perspective-container { perspective: 1200px; }
    .card-3d-wrapper {
      position: relative;
      width: 100%;
      height: 100%;
      transform-style: preserve-3d;
      transition: transform 0.6s var(--spring);
    }
    .card-3d-wrapper.is-flipped { transform: rotateY(180deg); }
    .card-face {
      position: absolute;
      width: 100%;
      height: 100%;
      backface-visibility: hidden;
      -webkit-backface-visibility: hidden;
    }
    .card-face-back {
      transform: rotateY(180deg);
    }

    .bg-aurora {
      background:
        radial-gradient(circle at 15% 50%, rgba(255, 69, 0, 0.15), transparent 50%),
        radial-gradient(circle at 85% 30%, rgba(14, 165, 233, 0.15), transparent 50%);
      background-size: 200% 200%;
      animation: ambient-drift 15s ease-in-out infinite alternate;
    }

    .stagger-1 { animation: slide-up-fade 0.6s var(--ease-out-expo) 0.1s both; }
    .stagger-2 { animation: slide-up-fade 0.6s var(--ease-out-expo) 0.2s both; }
    .stagger-3 { animation: slide-up-fade 0.6s var(--ease-out-expo) 0.3s both; }
    .stagger-4 { animation: slide-up-fade 0.6s var(--ease-out-expo) 0.4s both; }
    .stagger-5 { animation: slide-up-fade 0.6s var(--ease-out-expo) 0.5s both; }

    .glow-text-orange { text-shadow: 0 0 20px rgba(255, 69, 0, 0.6); }
    .glow-text-red { text-shadow: 0 0 20px rgba(239, 68, 68, 0.6); }
    .glow-text-blue { text-shadow: 0 0 20px rgba(14, 165, 233, 0.6); }
    .glow-text-green { text-shadow: 0 0 20px rgba(16, 185, 129, 0.6); }
    .glow-text-purple { text-shadow: 0 0 20px rgba(139, 92, 246, 0.6); }

    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
    ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
  `}</style>
);

// ─── Living Background ────────────────────────────────────────────

type AtmosphereConfig = {
  color1: string;
  color2: string;
  speed: number;
  particleCount: number;
};

const PHASE_ATMOSPHERE: Record<string, AtmosphereConfig> = {
  lobby: { color1: '#0EA5E9', color2: '#3B82F6', speed: 1, particleCount: 60 },
  role_reveal: { color1: '#050B14', color2: '#000000', speed: 0.1, particleCount: 20 },
  night: { color1: '#EF4444', color2: '#4C1D95', speed: 0.3, particleCount: 40 },
  discussion: { color1: '#F59E0B', color2: '#FF4500', speed: 1.5, particleCount: 80 },
  voting: { color1: '#1E3A8A', color2: '#0F172A', speed: 0.5, particleCount: 30 },
  elimination_reveal: { color1: '#000000', color2: '#000000', speed: 0, particleCount: 0 },
  reveal: { color1: '#000000', color2: '#000000', speed: 0, particleCount: 0 },
  ended: { color1: '#10B981', color2: '#059669', speed: 3, particleCount: 120 },
  default: { color1: '#FF4500', color2: '#0EA5E9', speed: 1, particleCount: 50 },
};

export const LivingBackground = ({ phase }: { phase: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let animationId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      alpha: number;
      constructor(config: AtmosphereConfig) {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.vx = (Math.random() - 0.5) * config.speed;
        this.vy = (Math.random() - 0.5) * config.speed;
        this.radius = Math.random() * 2 + 0.5;
        this.alpha = Math.random() * 0.5 + 0.1;
      }
      update(config: AtmosphereConfig) {
        this.x += this.vx * config.speed;
        this.y += this.vy * config.speed;
        if (this.x < 0) this.x = canvas!.width;
        if (this.x > canvas!.width) this.x = 0;
        if (this.y < 0) this.y = canvas!.height;
        if (this.y > canvas!.height) this.y = 0;
      }
      draw(c: CanvasRenderingContext2D) {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        c.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
        c.fill();
      }
    }

    const defaultConfig: AtmosphereConfig = PHASE_ATMOSPHERE['default'] as AtmosphereConfig;
    const config: AtmosphereConfig = (PHASE_ATMOSPHERE[phase] as AtmosphereConfig) ?? defaultConfig;
    const particles = Array.from({ length: config.particleCount }, () => new Particle(config));

    resize();
    let gradientOffset = 0;

    const animate = () => {
      const cfg: AtmosphereConfig = (PHASE_ATMOSPHERE[phase] as AtmosphereConfig) ?? defaultConfig;
      ctx.fillStyle = 'rgba(5, 11, 20, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      gradientOffset += 0.005 * cfg.speed;
      const cx = canvas.width / 2 + Math.sin(gradientOffset) * 200;
      const cy = canvas.height / 2 + Math.cos(gradientOffset) * 200;

      const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, canvas.width);
      gradient.addColorStop(0, `${cfg.color1}33`);
      gradient.addColorStop(0.5, `${cfg.color2}1A`);
      gradient.addColorStop(1, 'transparent');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.update(cfg);
        p.draw(ctx!);
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();
    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, [phase]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none transition-all duration-1000 ease-in-out"
      style={{ zIndex: -20, background: '#050B14' }}
    />
  );
};

// ─── Premium Button ───────────────────────────────────────────────

type ButtonVariant = 'primary' | 'secondary' | 'spy' | 'det' | 'disabled';

const BUTTON_VARIANTS: Record<ButtonVariant, string> = {
  primary:
    'bg-gradient-to-br from-orange-500 to-red-600 text-white shadow-[0_0_20px_rgba(255,69,0,0.4)] border border-orange-400/50 hover:shadow-[0_0_30px_rgba(255,69,0,0.6)] hover:brightness-110',
  secondary:
    'glass-panel text-gray-300 hover:text-white hover:bg-white/10 hover:border-white/20',
  spy: 'bg-gradient-to-br from-red-600 to-red-900 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)] border border-red-500/50 hover:shadow-[0_0_30px_rgba(239,68,68,0.6)]',
  det: 'bg-gradient-to-br from-blue-500 to-blue-800 text-white shadow-[0_0_20px_rgba(14,165,233,0.4)] border border-blue-400/50 hover:shadow-[0_0_30px_rgba(14,165,233,0.6)]',
  disabled: 'glass-panel opacity-50 cursor-not-allowed text-gray-500',
};

export const PremiumButton = ({
  children,
  variant = 'primary',
  onClick,
  className = '',
  disabled,
  icon,
}: {
  children: React.ReactNode;
  variant?: ButtonVariant;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  icon?: string;
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`relative w-full font-display font-bold text-sm tracking-widest uppercase rounded-2xl py-4 px-6 overflow-hidden transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-3 ${
      disabled ? BUTTON_VARIANTS.disabled : BUTTON_VARIANTS[variant]
    } ${className} group`}
  >
    {!disabled && (
      <div className="absolute inset-0 -translate-x-[150%] bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:translate-x-[150%] transition-transform duration-700 skew-x-12" />
    )}
    <span className="relative z-10 flex items-center gap-2">
      {icon && <span className="text-lg">{icon}</span>}
      {children}
    </span>
  </button>
);

// ─── Avatar ───────────────────────────────────────────────────────

const EMOJI_MAP: Record<string, string> = {
  Sherlock: '🕵️',
  Kitty: '😸',
  Noir: '🕶️',
  Fan: '🤔',
  Cool: '😎',
  Pro: '🤖',
  Ghost: '👻',
  Alien: '👽',
};

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

const AVATAR_SIZES: Record<AvatarSize, string> = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-12 h-12 text-xl',
  lg: 'w-20 h-20 text-3xl',
  xl: 'w-32 h-32 text-6xl',
};

export const Avatar = ({
  seed,
  role,
  size = 'md',
  isHost,
  isDead,
  isReady,
  glow,
}: {
  seed: string;
  role?: Role;
  size?: AvatarSize;
  isHost?: boolean;
  isDead?: boolean;
  isReady?: boolean;
  glow?: 'orange' | 'red' | 'blue' | 'green';
}) => {
  const emoji = EMOJI_MAP[seed] ?? '🙂';

  let borderStyle = 'border-white/10 bg-slate-800/80';
  let shadowStyle = '';

  if (role === 'spy') {
    borderStyle = 'border-red-500 bg-red-950';
    shadowStyle = 'shadow-[0_0_15px_rgba(239,68,68,0.5)]';
  } else if (role === 'detective') {
    borderStyle = 'border-blue-500 bg-blue-950';
    shadowStyle = 'shadow-[0_0_15px_rgba(14,165,233,0.5)]';
  } else if (role === 'citizen') {
    borderStyle = 'border-green-500 bg-green-950';
    shadowStyle = 'shadow-[0_0_15px_rgba(16,185,129,0.5)]';
  } else if (glow === 'orange') {
    borderStyle = 'border-orange-500 bg-orange-950';
    shadowStyle = 'shadow-[0_0_15px_rgba(255,69,0,0.5)]';
  }

  if (isDead) {
    borderStyle = 'border-slate-800 bg-slate-900 grayscale opacity-60';
    shadowStyle = '';
  }

  return (
    <div className="relative group">
      <div
        className={`${AVATAR_SIZES[size]} rounded-2xl flex items-center justify-center border-2 ${borderStyle} ${shadowStyle} ${
          !isDead && 'group-hover:scale-105 transition-transform duration-300'
        }`}
      >
        <span className={`${isDead ? 'opacity-50' : ''} filter drop-shadow-md`}>
          {emoji}
        </span>
      </div>
      {isHost && (
        <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow-lg border border-orange-300 z-10 rotate-12">
          HOST
        </div>
      )}
      {isReady && !isDead && (
        <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-[#050B14] shadow-[0_0_8px_rgba(16,185,129,0.8)] z-10 animate-pulse" />
      )}
      {isDead && (
        <div className="absolute -bottom-2 -right-2 text-xl filter drop-shadow-md z-10">
          💀
        </div>
      )}
    </div>
  );
};

// ─── Loading Text ─────────────────────────────────────────────────

const LOADING_MESSAGES = [
  'Searching suspicious comment history...',
  'The mods are investigating...',
  'Checking deleted posts...',
  'Someone edited their alibi...',
  'Bribing the automod...',
  'Scanning for alt accounts...',
];

export const LoadingText = () => {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const int = setInterval(() => setIndex((i) => (i + 1) % LOADING_MESSAGES.length), 3000);
    return () => clearInterval(int);
  }, []);
  return (
    <div className="flex items-center justify-center gap-3 text-xs text-orange-400 font-medium tracking-widest uppercase h-6">
      <span className="w-4 h-4 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
      <span className="animate-pulse">{LOADING_MESSAGES[index]}</span>
    </div>
  );
};
