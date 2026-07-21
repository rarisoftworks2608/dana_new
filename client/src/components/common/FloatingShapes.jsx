export default function FloatingShapes({ variant = 'light' }) {
  const color = variant === 'light' ? 'bg-white/10' : 'bg-primary/5';
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className={`absolute -top-10 -left-10 w-72 h-72 rounded-full ${color} blur-3xl animate-float-slow`} />
      <div className={`absolute top-1/3 right-0 w-96 h-96 rounded-full ${color} blur-3xl animate-float`} />
      <div className={`absolute bottom-0 left-1/4 w-64 h-64 rounded-full ${color} blur-3xl animate-float-slow`} />
    </div>
  );
}
