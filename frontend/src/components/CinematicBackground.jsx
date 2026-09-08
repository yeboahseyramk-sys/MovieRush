// Fixed, full-viewport cinematic backdrop shared by every screen.
// Pure CSS/SVG - no canvas, no JS animation loop, so it stays lightweight.
export default function CinematicBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-cinebase">
      {/* Base layered gradient wash */}
      <div className="absolute inset-0 bg-cinema-gradient" />

      {/* Large soft glow orbs - the "spotlight" effect behind key areas */}
      <div className="glow-orb absolute -top-32 -left-24 h-[420px] w-[420px] rounded-full bg-accent/30 blur-[110px]" />
      <div className="glow-orb-slow absolute top-1/3 -right-32 h-[480px] w-[480px] rounded-full bg-accent-pink/25 blur-[130px]" />
      <div className="glow-orb-reverse absolute bottom-[-140px] left-1/4 h-[380px] w-[380px] rounded-full bg-amber-500/15 blur-[120px]" />
      <div className="glow-orb-slow absolute bottom-1/4 right-1/4 h-[300px] w-[300px] rounded-full bg-indigo-500/20 blur-[100px]" />

      {/* Faint film-reel silhouette, upper right */}
      <svg
        className="absolute -right-16 -top-16 h-64 w-64 opacity-[0.05] sm:h-80 sm:w-80"
        viewBox="0 0 200 200"
        fill="none"
      >
        <circle cx="100" cy="100" r="90" stroke="white" strokeWidth="6" />
        <circle cx="100" cy="100" r="22" stroke="white" strokeWidth="6" />
        <circle cx="100" cy="40" r="14" stroke="white" strokeWidth="5" />
        <circle cx="152" cy="72" r="14" stroke="white" strokeWidth="5" />
        <circle cx="152" cy="128" r="14" stroke="white" strokeWidth="5" />
        <circle cx="100" cy="160" r="14" stroke="white" strokeWidth="5" />
        <circle cx="48" cy="128" r="14" stroke="white" strokeWidth="5" />
        <circle cx="48" cy="72" r="14" stroke="white" strokeWidth="5" />
      </svg>

      {/* Faint cinema-screen silhouette, lower left */}
      <svg
        className="absolute -left-10 bottom-0 h-56 w-72 opacity-[0.04] sm:h-72 sm:w-96"
        viewBox="0 0 300 180"
        fill="none"
      >
        <rect x="10" y="10" width="280" height="140" rx="10" stroke="white" strokeWidth="5" />
        <path d="M10 150 L150 178 L290 150" stroke="white" strokeWidth="5" />
      </svg>

      {/* Soft diagonal light rays */}
      <div className="light-rays absolute inset-0" />

      {/* Floating particles */}
      <div className="particle particle-1" />
      <div className="particle particle-2" />
      <div className="particle particle-3" />
      <div className="particle particle-4" />
      <div className="particle particle-5" />
      <div className="particle particle-6" />

      {/* Gentle vignette so content stays readable at the edges */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(6,4,16,0.55)_100%)]" />
    </div>
  );
}
