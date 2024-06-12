import 'styles/globals.css';
import { Red_Hat_Display, Red_Hat_Mono, Roboto_Serif } from 'next/font/google';

export const redHatMono = Red_Hat_Mono({
  subsets: ['latin'],
  variable: '--font-red-hat-mono',
});
export const redHatDisplay = Red_Hat_Display({
  subsets: ['latin'],
  variable: '--font-red-hat-display',
});
export const robotoSerif = Roboto_Serif({
  subsets: ['latin'],
  variable: '--font-roboto-serif',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${redHatDisplay.variable} ${robotoSerif.variable} ${redHatMono.variable} theme-dark`}
      >
        {children}
      </body>
    </html>
  );
}
