import '../styles/globals.css';

export default function App({ Component, pageProps }) {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 font-sans">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Component {...pageProps} />
      </div>
    </div>
  );
}
