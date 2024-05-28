import Script from 'next/script';
import 'styles/globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <Script src="/wasm/dlang.js" strategy="beforeInteractive"></Script>
      </head>
      <body>{children}</body>
    </html>
  );
}
