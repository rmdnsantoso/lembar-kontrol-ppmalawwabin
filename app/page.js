'use client'; 

import { useState } from 'react';
import { Download, CheckCircle, BookOpen, Scroll, CheckSquare, XSquare } from 'lucide-react';
import { quranData, hadistData } from '@/data/items';
import { generatePdf } from '@/utils/generatePdf';
import { Toaster, toast } from 'react-hot-toast';

export default function Home() {
  const [nama, setNama] = useState('');
  const [kost, setKost] = useState('');
  const [templateType, setTemplateType] = useState('quran'); 
  const [selectedItems, setSelectedItems] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const activeData = templateType === 'quran' ? quranData : hadistData;

  const toggleItem = (item) => {
    const exists = selectedItems.find((i) => i.id === item.id);
    if (exists) {
      setSelectedItems(selectedItems.filter((i) => i.id !== item.id));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const handleSelectAll = () => {
    setSelectedItems(activeData);
    toast.success('Semua item terpilih', { icon: '✅' });
  };
  
  const handleClearAll = () => {
    setSelectedItems([]);
    toast('Pilihan direset', { icon: '🗑️' });
  };

  const handleDownload = () => {
    if (!nama || !kost) {
      toast.error('Isi identitas dulu ya', {
        style: { borderRadius: '10px', background: '#333', color: '#fff' },
      });
      return;
    }
    if (selectedItems.length === 0) {
      toast.error('Pilih materinya dulu ya', {
        style: { borderRadius: '10px', background: '#333', color: '#fff' },
      });
      return;
    }

    setIsGenerating(true);
    const toastId = toast.loading('Sedang meracik PDF...');

    setTimeout(() => {
        try {
            generatePdf(nama, kost, selectedItems, templateType);
            toast.success('Alhamdulillah Selesai! Semangat evaluasinya!', {
                id: toastId,
                duration: 4000,
            });
            setIsGenerating(false);
        } catch (error) {
            toast.error('Gagal: ' + error.message, { id: toastId });
            setIsGenerating(false);
        }
    }, 800); 
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 font-sans text-slate-800 flex flex-col">
      
      <Toaster position="top-center" reverseOrder={false} />

      {/* --- BAGIAN BRANDING (HEADER ESTETIK) --- */}
      <div className="max-w-3xl mx-auto mb-10 text-center">
        {/* Logo */}
        <div className="flex justify-center mb-6">
             <img 
               src="/logoppm.png" 
               alt="Logo PPM" 
               className="h-28 w-auto object-contain drop-shadow-lg hover:scale-105 transition-transform duration-500" 
               onError={(e) => e.target.style.display = 'none'} 
             />
        </div>
        
        {/* JUDUL UTAMA (Font Serif biar Classy) */}
        <h1 className="text-5xl md:text-6xl font-serif font-medium text-emerald-900 mb-2 tracking-wide">
          SIANDRE
        </h1>
        
        {/* KEPANJANGAN (Simple & Clean) */}
        <p className="text-sm md:text-base font-medium text-emerald-600 tracking-widest uppercase mb-6">
          Santri Idaman Anti Drama Rajin Evaluasi
        </p>

        {/* --- PENJELASAN WEB (SUB-GENERATOR) --- */}
        <div className="max-w-lg mx-auto bg-white/60 border border-emerald-100 rounded-2xl p-4 backdrop-blur-sm">
            <p className="text-slate-500 text-sm leading-relaxed">
               <span className="font-bold text-emerald-700">Platform Generator Lembar Kontrol</span> untuk memantau makna Al-Quran & Al-Hadist secara mandiri. Cukup pilih materi, download PDF, dan cetak.
            </p>
        </div>
      </div>

      {/* --- CARD UTAMA (LAYOUT STANDAR & RAPI) --- */}
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden w-full">
        
        {/* 1. Identitas */}
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">1. Identitas Santri</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-600">Nama Lengkap</label>
              <input type="text" className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all" placeholder="Contoh: Ahmad Fulan" value={nama} onChange={(e) => setNama(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-600">Kost</label>
              <input type="text" className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all" placeholder="Contoh: Asrama Putra" value={kost} onChange={(e) => setKost(e.target.value)} />
            </div>
          </div>
        </div>

        {/* 2. Pilih Program */}
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">2. Pilih Materi</h2>
          <div className="flex gap-4">
            <button onClick={() => { setTemplateType('quran'); setSelectedItems([]); }} className={`flex-1 p-4 rounded-xl border-2 flex items-center justify-center gap-2 transition-all ${templateType === 'quran' ? 'border-emerald-500 bg-emerald-50 text-emerald-800 shadow-sm' : 'border-slate-200 hover:border-slate-300 text-slate-500'}`}>
              <Scroll size={20} /> <span className="font-bold">Al-Quran</span>
            </button>
            <button onClick={() => { setTemplateType('hadist'); setSelectedItems([]); }} className={`flex-1 p-4 rounded-xl border-2 flex items-center justify-center gap-2 transition-all ${templateType === 'hadist' ? 'border-emerald-500 bg-emerald-50 text-emerald-800 shadow-sm' : 'border-slate-200 hover:border-slate-300 text-slate-500'}`}>
              <BookOpen size={20} /> <span className="font-bold">Al-Hadist</span>
            </button>
          </div>
        </div>

        {/* 3. Pilih Materi */}
        <div className="p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">3. Pilih {templateType === 'quran' ? 'Surat' : 'Kitab'}</h2>
            <div className="flex gap-2 text-xs">
                <button onClick={handleSelectAll} className="flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-md hover:bg-emerald-100 font-bold transition-colors"><CheckSquare size={14} /> Pilih Semua</button>
                <button onClick={handleClearAll} className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 rounded-md hover:bg-red-100 font-bold transition-colors"><XSquare size={14} /> Hapus Semua</button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
            {activeData.map((item) => {
              const isSelected = selectedItems.find(i => i.id === item.id);
              return (
                <div key={item.id} onClick={() => toggleItem(item)} className={`cursor-pointer p-3 rounded-lg border flex items-center justify-between transition-all select-none ${isSelected ? 'border-emerald-500 bg-emerald-50 text-emerald-900 shadow-sm' : 'border-slate-200 hover:border-emerald-300 hover:bg-slate-50'}`}>
                  <div><div className="font-bold text-sm">{item.title}</div><div className="text-xs text-slate-400 mt-1">{item.pages} {templateType === 'quran' ? 'Ayat' : 'Hal'}{item.startPage && item.endPage ? ` (${item.startPage} - ${item.endPage})` : ''}</div></div>
                  {isSelected && <CheckCircle size={18} className="text-emerald-600" />}
                </div>
              );
            })}
          </div>
          <div className="mt-4 text-xs text-slate-400 text-right">Terpilih: <span className="font-bold text-slate-800">{selectedItems.length}</span> Item</div>
        </div>

        {/* Tombol Download */}
        <div className="p-6 bg-slate-50 border-t border-slate-200 text-center">
          <button onClick={handleDownload} disabled={isGenerating} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-lg py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:-translate-y-1 transform active:scale-95">
            {isGenerating ? <span className="animate-pulse">Sedang Memproses...</span> : <><Download size={24} /><span>Download PDF SIANDRE</span></>}
          </button>
        </div>
      </div>

      {/* --- INSTRUKSI KHUSUS KERTAS --- */}
      <div className="mt-3 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-50 text-orange-800 border border-orange-200 text-xs font-semibold">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          Format Fixed: Wajib Cetak Kertas A4
        </div>
      </div>
      
      {/* Footer */}
      <div className="mt-auto pt-10 pb-6 text-center">
        <p className="text-xs text-slate-400 font-medium tracking-wide uppercase">
            &copy; 2025 WooZiiMoe &bull; PPM Al-Awwabin
        </p>
      </div>
    </div>
  );
}