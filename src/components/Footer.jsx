function Footer() {
  return (
    <footer 
      className="py-6 text-center text-xs relative overflow-hidden"
      style={{
        background: 'rgba(0, 0, 0, 0.95)',
        borderTop: '1px solid rgba(0, 240, 255, 0.15)',
        boxShadow: '0 -10px 40px rgba(0, 240, 255, 0.03)',
        backdropFilter: 'blur(10px)'
      }}
    >
      {/* Línea de escaneo neón en la parte superior */}
      <div 
        className="absolute top-0 left-0 w-full h-px"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(0, 240, 255, 0.4), rgba(255, 0, 200, 0.4), transparent)',
          boxShadow: '0 0 20px rgba(0, 240, 255, 0.2)'
        }}
      />
      
      {/* Partículas decorativas */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-pulse"
            style={{
              width: Math.random() * 2 + 1 + 'px',
              height: Math.random() * 2 + 1 + 'px',
              background: ['#00f0ff', '#ff00c8', '#b400ff', '#00ff41'][i % 4],
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              animationDuration: Math.random() * 6 + 3 + 's',
              animationDelay: Math.random() * 3 + 's',
              opacity: 0.15
            }}
          />
        ))}
      </div>
      
      <div className="relative z-10 mx-auto max-w-7xl px-4 space-y-1">
        {/* Logo o marca con efecto neón */}
        <p 
          className="font-bold tracking-wider text-sm"
          style={{
            fontFamily: "'Orbitron', monospace",
            color: '#00f0ff',
            textShadow: '0 0 30px rgba(0, 240, 255, 0.3)',
            letterSpacing: '2px'
          }}
        >
          ALIXXPRESS
        </p>
        
        {/* Línea decorativa */}
        <div 
          className="w-12 h-px mx-auto my-2"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255, 0, 200, 0.4), transparent)'
          }}
        />
        
        {/* Texto legal */}
        <p style={{ color: '#8a8aaa', fontFamily: "'Rajdhani', sans-serif", letterSpacing: '0.5px' }}>
          © 2026 Alixxpress.
          <br className="sm:hidden" />
          <span className="hidden sm:inline"> </span>
          Todos los derechos reservados.
        </p>
        
        {/* Desarrollador con glow */}
        <p 
          className="text-[10px]"
          style={{ 
            color: '#6a6a8a',
            fontFamily: "'Rajdhani', sans-serif",
            letterSpacing: '1px'
          }}
        >
          DESARROLLADO POR{' '}
          <span 
            style={{
              color: '#ff00c8',
              textShadow: '0 0 20px rgba(255, 0, 200, 0.2)',
              fontWeight: '600'
            }}
          >
            JAHM
          </span>
        </p>
        
        {/* Versión o código */}
        <div 
          className="text-[8px] mt-1 opacity-30"
          style={{ 
            color: '#6a6a8a',
            fontFamily: "'Orbitron', monospace",
            letterSpacing: '1px'
          }}
        >
          v2.0.1 • CYBER EDITION
        </div>
      </div>
    </footer>
  );
}

export default Footer;