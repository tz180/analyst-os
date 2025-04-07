import '../styles/globals.css';

export const metadata = {
  title: 'Analyst OS',
  description: 'Modern hedge fund analyst toolkit',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 font-sans">
        {children}
      </body>
    </html>
  );
}
