'use client'; 

import { useState } from 'react';
import { Download, CheckCircle, BookOpen, Scroll, CheckSquare, XSquare } from 'lucide-react';
import { quranData, hadistData } from '@/data/items';
import { generatePdf } from '@/utils/generatePdf';

// IMPORT LIBRARY NOTIFIKASI CANTIK
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

  // Notifikasi kecil saat pilih semua/hapus semua
  const handleSelectAll = () => {
    setSelectedItems(activeData);
    toast.success('Semua item dipilih!', { icon: '✅' });
  };
  
  const handleClearAll = () => {
    setSelectedItems([]);
    toast('Pilihan dikosongkan', { icon: '🗑️' });
  };

  const handleDownload = () => {
    // Validasi dengan Toast Error (Warna Merah)
    if (!nama || !kost) {
      toast.error('Mohon isi Nama dan Kost dulu ya!', {
        style: { borderRadius: '10px', background: '#333', color: '#fff' },
      });
      return;
    }
    if (selectedItems.length === 0) {
      toast.error('Belum ada materi yang dipilih.', {
        style: { borderRadius: '10px', background: '#333', color: '#fff' },
      });
      return;
    }

    setIsGenerating(true);
    
    // Toast Loading (Akan loading terus sampai sukses/gagal)
    const toastId = toast.loading('Sedang menyiapkan PDF...');

    setTimeout(() => {
        try {
            generatePdf(nama, kost, selectedItems, templateType);
            
            // Ubah Toast Loading jadi Sukses
            toast.success('Alhamdulillah! PDF berhasil didownload.', {
                id: toastId, // Gantikan loading yang tadi
                duration: 4000,
            });
            
            setIsGenerating(false);
        } catch (error) {
            // Ubah Toast Loading jadi Error
            toast.error('Gagal membuat PDF: ' + error.message, {
                id: toastId,
            });
            setIsGenerating(false);
        }
    }, 800); // Sedikit delay biar kerasa prosesnya
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 font-sans text-slate-800 flex flex-col">
      
      {/* --- KOMPONEN TOASTER (Wajib Ada) --- */}
      {/* Kita taruh di posisi atas tengah biar kelihatan jelas */}
      <Toaster position="top-center" reverseOrder={false} />

      <div className="max-w-2xl mx-auto mb-10 text-center">
        <div className="flex justify-center mb-4">
             <img src="/logoppm.png" alt="Logo PPM" className="h-24 w-auto object-contain drop-shadow-md" onError={(e) => e.target.style.display = 'none'} />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">PPM Al-Awwabin</h1>
        <p className="text-slate-500">Generator Lembar Kontrol Hafalan & Belajar</p>
      </div>

      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden w-full">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">1. Identitas Santri</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nama Lengkap</label>
              <input type="text" className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-green-500 outline-none transition-all" placeholder="Contoh: Ahmad Fulan" value={nama} onChange={(e) => setNama(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Kost</label>
              <input type="text" className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-green-500 outline-none transition-all" placeholder="Contoh: Asrama Putra 1" value={kost} onChange={(e) => setKost(e.target.value)} />
            </div>
          </div>
        </div>

        <div className="p-6 border-b border-slate-100">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">2. Pilih Materi</h2>
          <div className="flex gap-4">
            <button onClick={() => { setTemplateType('quran'); setSelectedItems([]); }} className={`flex-1 p-4 rounded-lg border-2 flex items-center justify-center gap-2 transition-all ${templateType === 'quran' ? 'border-green-600 bg-green-50 text-green-700 shadow-sm' : 'border-slate-200 hover:border-slate-300 text-slate-600'}`}>
              <Scroll size={20} /> <span className="font-medium">Al-Quran</span>
            </button>
            <button onClick={() => { setTemplateType('hadist'); setSelectedItems([]); }} className={`flex-1 p-4 rounded-lg border-2 flex items-center justify-center gap-2 transition-all ${templateType === 'hadist' ? 'border-green-600 bg-green-50 text-green-700 shadow-sm' : 'border-slate-200 hover:border-slate-300 text-slate-600'}`}>
              <BookOpen size={20} /> <span className="font-medium">Al-Hadist</span>
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">3. Pilih {templateType === 'quran' ? 'Surat' : 'Kitab'}</h2>
            <div className="flex gap-2 text-xs">
                <button onClick={handleSelectAll} className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 font-medium transition-colors"><CheckSquare size={14} /> Pilih Semua</button>
                <button onClick={handleClearAll} className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 rounded-md hover:bg-red-100 font-medium transition-colors"><XSquare size={14} /> Hapus Semua</button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
            {activeData.map((item) => {
              const isSelected = selectedItems.find(i => i.id === item.id);
              return (
                <div key={item.id} onClick={() => toggleItem(item)} className={`cursor-pointer p-3 rounded-lg border flex items-center justify-between transition-all select-none ${isSelected ? 'border-green-500 bg-green-50 text-green-800 shadow-sm' : 'border-slate-200 hover:border-green-200 hover:bg-slate-50'}`}>
                  <div><div className="font-medium text-sm">{item.title}</div><div className="text-xs text-slate-500">{item.pages} {templateType === 'quran' ? 'Ayat' : 'Hal'}</div></div>
                  {isSelected && <CheckCircle size={18} className="text-green-600" />}
                </div>
              );
            })}
          </div>
          <div className="mt-4 text-xs text-slate-400 text-right">Terpilih: <span className="font-bold text-slate-700">{selectedItems.length}</span> Item</div>
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-200 text-center">
          <button onClick={handleDownload} disabled={isGenerating} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-4 px-6 rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transform active:scale-95">
            {isGenerating ? <span className="animate-pulse">Sedang Memproses...</span> : <><Download size={20} /><span>Download PDF Siap Cetak</span></>}
          </button>
        </div>
      </div>
      <div className="mt-auto pt-10 pb-4 text-center"><p className="text-sm text-slate-400 font-medium">&copy; 2025 WooZiiMoe. All Rights Reserved.</p></div>
    </div>
  );
}