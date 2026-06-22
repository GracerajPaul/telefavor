import "./globals.css";
import Providers from "./providers";

export const metadata = {
  title: "Telefavor - referral exchange",
  description: "Find and connect with people for referral exchanges on Telegram",
};

export const viewport = {
  themeColor: "#0D0B1A",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo.jpeg" type="image/jpeg" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="bg-[#0D0B1A] text-white antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
