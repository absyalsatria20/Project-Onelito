// src/App.jsx
import React, { useEffect, useState } from 'react';
import OnelitoPreloader from './components/OnelitoPreloader';

export default function App() {
  const [progress, setProgress] = useState(0);
  const [isDbLoaded, setIsDbLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function initDatabaseSync() {
      try {
        setProgress(25);

        // Contoh pemanggilan API database Anda (misal endpoint Laravel / REST API):
        // const res = await fetch('/api/koi-collections');
        // const data = await res.json();

        // Simulasi waktu tunggu query database:
        await new Promise((r) => setTimeout(r, 1200));
        if (isMounted) setProgress(70);

        await new Promise((r) => setTimeout(r, 1000));
        if (isMounted) {
          setProgress(100);
          setIsDbLoaded(true);
        }
      } catch (err) {
        console.error('Gagal memuat database:', err);
      }
    }

    initDatabaseSync();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-[#0B0C0E] text-neutral-900 dark:text-white">
      {/* Preloader otomatis menutup & unmount setelah isDbLoaded === true */}
      <OnelitoPreloader
        progress={progress}
        isLoaded={isDbLoaded}
        logoSrc="/logo-vertical.png"
      />

      {/* Konten Utama Web Project Anda */}
      <main className="p-8 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold">Dashboard ONELITO KOI</h1>
      </main>
    </div>
  );
}