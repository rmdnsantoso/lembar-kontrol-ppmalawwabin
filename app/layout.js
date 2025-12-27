import "./globals.css"; // <--- INI YANG TADI KETINGGALAN, PENTING BANGET!

export const metadata = {
  title: 'SIANDRE - PPM Al-Awwabin',
  description: 'Santri Idaman Anti Drama Rajin Evaluasi. Generator Lembar Kontrol Hafalan & Belajar.',
  icons: {
    icon: '/icon.png', // Pastikan file icon.png ada di folder app
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="antialiased">{children}</body>
    </html>
  );
}