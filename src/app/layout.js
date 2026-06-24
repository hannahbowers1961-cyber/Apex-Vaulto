import { Analytics } from '@vercel/analytics/react';
// import './globals.css'; <-- Uncomment this line if you have a globals.css file!

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}