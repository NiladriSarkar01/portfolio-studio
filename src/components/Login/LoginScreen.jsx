import { useState } from 'react'
import { motion } from 'framer-motion'

export default function LoginScreen({ onDone }) {
  const [password, setPassword] = useState('')
  const [shake, setShake]       = useState(false)
  const [loading, setLoading]   = useState(false)

  // Any password works — it's a portfolio, not real auth
  const handleLogin = () => {
    setLoading(true)
    setTimeout(() => onDone(), 600)
  }

  const handleKey = (e) => {
    if (e.key === 'Enter') handleLogin()
  }

  return (
    <div className="relative w-full h-full bg-[#f4ede3] flex flex-col items-center justify-center px-4 font-mono">
      {/* Background grid pattern */}
      <div
        className="absolute inset-0 opacity-50"
        style={{ backgroundImage: 'radial-gradient(circle, #d0bca4 1px, transparent 1px)', backgroundSize: '32px 32px' }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 flex flex-col items-center"
      >
        {/* Portfolio mark */}
        <div className="mb-2 text-[13px] text-[#805239] tracking-widest uppercase">
          Welcome to my portfolio
        </div>
        <div className="w-16 h-16 rounded-[1.4rem] rotate-[-6deg] bg-[#d9b782] border-2 border-[#35271f] flex items-center justify-center mb-3 shadow-[4px_4px_0_#35271f]">
          <svg viewBox="0 0 40 40" width="36" height="36">
            <path d="M7 16h21v10a8 8 0 0 1-8 8h-5a8 8 0 0 1-8-8V16Z" fill="none" stroke="#805239" strokeWidth="2"/>
            <path d="M28 19h2a5 5 0 0 1 0 10h-3M13 12c-2-2 2-3 0-5m8 5c-2-2 2-3 0-5M5 37h30" stroke="#805239" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        <div className="text-xl font-black text-[#35271f] mb-1">Portfolio Studio ☕</div>
        <div className="text-center text-[14px] text-[#786b5f] mb-8">A playful portfolio, powered by curiosity</div>

        {/* Login card */}
        <div className="bg-white border-2 border-[#35271f] rounded-[1.5rem] p-6 w-full max-w-sm shadow-[6px_6px_0_#35271f]">
          {/* User row */}
          <div className="flex items-center gap-3 mb-5 pb-4 border-b-2 border-dashed border-[#d0bca4]">
            <div className="w-10 h-10 rounded-full bg-[#8b5e3c] border-2 border-[#35271f] flex items-center justify-center text-[#35271f] font-bold text-base">
              P
            </div>
            <div>
              <div className="text-[#35271f] text-sm font-bold">Portfolio visitor</div>
              <div className="text-[#786b5f] text-[13px]">Developer &amp; creator</div>
            </div>
          </div>

          {/* Password */}
          <div className="text-[13px] text-[#786b5f] tracking-widest mb-1">PASSWORD</div>
          <motion.input
            animate={shake ? { x: [-6, 6, -4, 4, 0] } : {}}
            transition={{ duration: 0.3 }}
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={handleKey}
            placeholder="••••••••"
            autoFocus
            className="w-full bg-[#f4ede3] border-2 border-[#d0bca4] rounded-xl px-3 py-2 text-[#35271f] text-sm outline-hidden focus:border-[#805239] transition-colors"
          />

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full mt-3 bg-[#805239] hover:brightness-110 text-[#35271f] font-bold text-xs py-2 rounded-xl border-2 border-[#35271f] shadow-[3px_3px_0_#35271f] tracking-widest transition-all disabled:opacity-60"
          >
            {loading ? 'AUTHENTICATING...' : 'LOG IN →'}
          </button>

          <div className="text-center text-[13px] text-[#78766b] mt-3">
            hint: press Enter or click to login
          </div>
        </div>
      </motion.div>
    </div>
  )
}
