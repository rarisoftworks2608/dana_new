import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-surface text-center px-4">
      <h1 className="font-heading font-extrabold text-6xl text-primary mb-4">404</h1>
      <p className="text-slate-600 mb-6">The page you are looking for doesn&rsquo;t exist.</p>
      <Link to="/" className="btn-primary">Back to Home</Link>
    </div>
  );
}
