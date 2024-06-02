import 'styles/globals.css';
import { Red_Hat_Display, Roboto_Serif } from 'next/font/google';

const redHatDisplay = Red_Hat_Display({
  subsets: ['latin'],
  variable: '--font-red-hat-display',
});
const robotoSerif = Roboto_Serif({
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
        className={`${redHatDisplay.variable} ${robotoSerif.variable} theme-dark`}
      >
        {children}
      </body>
    </html>
  );
}
