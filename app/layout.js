import "./globals.css";

export const metadata = {
  title: "Lembar Kontrol PPM Al-Awwabin",
  description: "Generator Lembar Kontrol Santri",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="antialiased bg-slate-50 text-slate-900">
        {children}
      </body>
    </html>
  );
}