import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const generatePdf = (namaSantri, kost, selectedItems, templateType) => {
  // 1. Setup Dokumen A4 Portrait
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const isQuran = templateType === 'quran';
  const satuan = isQuran ? 'Ayat' : 'Hal';
  const judulProgram = isQuran ? 'LEMBAR KONTROL MAKNA AL-QURAN' : 'LEMBAR KONTROL MAKNA HADIST HIMPUNAN';

  // --- CONFIG ---
  const colorGreen = [0, 100, 50]; // RGB Hijau PPM
  const colorGold = [218, 165, 32]; // RGB Emas
  let currentY = 15; 
  const marginX = 15;
  const pageWidth = 210;
  const contentWidth = pageWidth - (marginX * 2);

  // --- FUNGSI HEADER ---
  const drawHeader = () => {
    // 1. Logo (Ambil dari folder public)
    const logoImg = new Image();
    logoImg.src = '/logoppm.png'; 
    try {
        // Gambar logo di kiri
        doc.addImage(logoImg, 'PNG', marginX, currentY, 22, 22); 
    } catch (e) {
        // Skip jika error
    }

    // Posisi Tengah Halaman
    const textCenter = pageWidth / 2;
    
    // 2. Baris 1: PONDOK PESANTREN...
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0); // Hitam
    doc.text('PONDOK PESANTREN MAHASISWA (PPM)', textCenter, currentY + 5, { align: 'center' });
    
    // 3. Baris 2: AL-AWWABIN (Hijau Besar)
    doc.setFontSize(18);
    doc.setTextColor(...colorGreen);
    doc.text('AL-AWWABIN', textCenter, currentY + 12, { align: 'center' });

    // 4. Baris 3: ALAMAT (Tambahan Baru)
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal'); // Font biasa (tidak bold)
    doc.setTextColor(80, 80, 80); // Abu-abu gelap elegan
    doc.text('Sukarame, Bandar Lampung', textCenter, currentY + 17, { align: 'center' });

    // 5. Kotak Judul Program
    // Kita turunkan Y sedikit lebih jauh (28mm) biar ga nabrak alamat
    currentY += 28; 
    
    doc.setFillColor(235, 245, 235); // Hijau muda banget
    doc.setDrawColor(...colorGreen); // Border Hijau
    doc.setLineWidth(0.5);
    doc.rect(marginX, currentY, contentWidth, 10, 'FD'); 
    
    doc.setFont('helvetica', 'bold'); // Balikin jadi Bold
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0); // Balik Hitam
    doc.text(judulProgram, textCenter, currentY + 7, { align: 'center' });

    // 6. Garis Pembatas
    currentY += 15;
    doc.setLineWidth(1);
    doc.setDrawColor(0, 0, 0); // Garis hitam tegas
    doc.line(marginX, currentY, pageWidth - marginX, currentY); 
    
    // 7. Identitas
    currentY += 8;
    doc.setFontSize(11);
    doc.text(`Nama Santri :  ${namaSantri}`, marginX, currentY);
    // Trik manual spacing untuk Kost
    doc.text(`Kost :  ${kost}`, pageWidth - marginX - 50, currentY); 
    
    currentY += 3;
    doc.setLineWidth(0.5);
    doc.line(marginX, currentY, pageWidth - marginX, currentY); // Garis bawah identitas
    currentY += 10; // Jarak ke konten
  };

  // --- RENDER HEADER PERTAMA ---
  drawHeader();

  // --- LOOPING KOTAK ---
  let patternCount = 0; 

  selectedItems.forEach((item) => {
    // Cek ganti halaman 
    if (currentY > 250) {
      doc.addPage();
      currentY = 20;
      // drawHeader(); // Uncomment kalau mau header di tiap halaman
    }

    // Warna Header Item
    patternCount++;
    let headerColor = colorGreen;
    if (patternCount % 3 === 0) headerColor = colorGold; 

    // Header Item (Judul Surat)
    doc.setFillColor(...headerColor);
    doc.setDrawColor(...headerColor); // Hilangkan border abu-abu sisa
    doc.rect(marginX, currentY, contentWidth, 8, 'F'); 
    
    doc.setTextColor(255, 255, 255); // Putih
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(item.title, marginX + 3, currentY + 5.5);
    doc.setFontSize(8);
    doc.text(`Target: ${item.pages} ${satuan}`, pageWidth - marginX - 3, currentY + 5.5, { align: 'right' });

    currentY += 9; 

    // Grid System
    const boxSize = 6.5; 
    const gap = 1;       
    const boxesPerRow = Math.floor(contentWidth / (boxSize + gap));
    
    let xPos = marginX;
    
    doc.setTextColor(0, 0, 0); // Hitam
    doc.setFontSize(8);
    doc.setDrawColor(150, 150, 150); // Border Abu-abu
    doc.setLineWidth(0.1);

    for (let i = 1; i <= item.pages; i++) {
      doc.rect(xPos, currentY, boxSize, boxSize);
      
      const textWidth = doc.getTextWidth(String(i));
      const xText = xPos + (boxSize - textWidth) / 2;
      doc.text(String(i), xText, currentY + 4.5);

      xPos += (boxSize + gap);

      if (i % boxesPerRow === 0) {
        xPos = marginX;
        currentY += (boxSize + gap);
      }
    }

    if (item.pages % boxesPerRow !== 0) {
        currentY += (boxSize + gap);
    }
    
    currentY += 5; 
  });

  // --- FOOTER TANDA TANGAN ---
  if (currentY > 240) {
    doc.addPage();
    currentY = 20;
  }
  
  currentY += 10;
  doc.setFontSize(10);
  doc.setTextColor(0,0,0);
  const signX = pageWidth - marginX - 50;
  
  doc.text('Mengetahui,', signX, currentY);
  currentY += 5;
  doc.text('Pengurus PPM Al-Awwabin', signX, currentY);
  currentY += 20;
  doc.text('( ..................................... )', signX, currentY);

  const safeNama = namaSantri.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'santri';
  doc.save(`Lembar_Kontrol_${safeNama}_${templateType}.pdf`);
};