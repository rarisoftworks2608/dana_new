export default function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-white focus:text-primary-dark focus:font-bold focus:px-4 focus:py-2 focus:rounded-lg focus:shadow-lg"
    >
      Skip to main content
    </a>
  );
}
