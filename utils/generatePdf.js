import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const generatePdf = (namaSantri, kost, selectedItems, templateType) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const isQuran = templateType === 'quran';
  const satuan = isQuran ? 'Ayat' : 'Hal';
  const judulProgram = isQuran ? 'LEMBAR KONTROL MAKNA AL-QURAN' : 'LEMBAR KONTROL MAKNA HADIST HIMPUNAN';

  // --- CONFIG ---
  const colorGreen = [0, 100, 50]; 
  const colorGold = [218, 165, 32];
  
  let currentY = 15; 
  const marginX = 15;
  const pageWidth = 210;
  const contentWidth = pageWidth - (marginX * 2);

  const footerY = 294;        
  const absoluteLimitY = 291; 

  const boxSize = 6.5; 
  const gap = 1;       

  const drawHeader = () => {
    const logoImg = new Image();
    logoImg.src = '/logoppm.png'; 
    try {
        doc.addImage(logoImg, 'PNG', marginX, currentY, 22, 22); 
    } catch (e) {}

    const textCenter = pageWidth / 2;
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0); 
    doc.text('PONDOK PESANTREN MAHASISWA (PPM)', textCenter, currentY + 5, { align: 'center' });
    
    doc.setFontSize(18);
    doc.setTextColor(...colorGreen);
    doc.text('AL-AWWABIN', textCenter, currentY + 12, { align: 'center' });

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal'); 
    doc.setTextColor(80, 80, 80); 
    doc.text('Sukarame, Bandar Lampung', textCenter, currentY + 17, { align: 'center' });

    currentY += 28; 
    
    doc.setFillColor(235, 245, 235); 
    doc.setDrawColor(...colorGreen); 
    doc.setLineWidth(0.5);
    doc.rect(marginX, currentY, contentWidth, 10, 'FD'); 
    
    doc.setFont('helvetica', 'bold'); 
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0); 
    doc.text(judulProgram, textCenter, currentY + 7, { align: 'center' });

    currentY += 15;
    doc.setLineWidth(1);
    doc.setDrawColor(0, 0, 0); 
    doc.line(marginX, currentY, pageWidth - marginX, currentY); 
    
    currentY += 8;
    doc.setFontSize(11);
    doc.text(`Nama Santri :  ${namaSantri}`, marginX, currentY);
    doc.text(`Kost :  ${kost}`, pageWidth - marginX - 50, currentY); 
    
    currentY += 3;
    doc.setLineWidth(0.5);
    doc.line(marginX, currentY, pageWidth - marginX, currentY); 
    currentY += 10; 
  };

  drawHeader();

  let patternCount = 0; 

  selectedItems.forEach((item) => {
    
    const startPage = item.startPage || 1;
    const endPage = item.endPage || item.pages;
    const totalItemPages = endPage - startPage + 1;

    // --- 1. HITUNG KEBUTUHAN TINGGI SURAT ---
    const boxesPerRow = Math.floor(contentWidth / (boxSize + gap));
    const totalRows = Math.ceil(totalItemPages / boxesPerRow);
    
    const hHeader = 8;
    const hGap = 8; 
    const hBoxes = totalRows * (boxSize + gap);
    
    const totalHeightNeeded = hHeader + hGap + hBoxes;

    // --- 2. CEK SISA KERTAS ---
    const spaceLeft = absoluteLimitY - currentY;

    // --- 3. LOGIKA KEEP TOGETHER ---
    if (totalHeightNeeded > spaceLeft && totalHeightNeeded < 200) {
        doc.addPage();
        currentY = 20; 
    }

    patternCount++;
    let headerColor = colorGreen;
    if (patternCount % 3 === 0) headerColor = colorGold; 

    // Header Surat
    doc.setFillColor(...headerColor);
    doc.setDrawColor(...headerColor); 
    doc.rect(marginX, currentY, contentWidth, 8, 'F'); 
    
    doc.setTextColor(255, 255, 255); 
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(item.title, marginX + 3, currentY + 5.5);
    doc.setFontSize(8);
    doc.text(`Target: ${totalItemPages} ${satuan}`, pageWidth - marginX - 3, currentY + 5.5, { align: 'right' });

    currentY += 8.5; 

    // Loop Kotak
    let xPos = marginX;
    
    doc.setTextColor(0, 0, 0); 
    doc.setFontSize(8);
    doc.setDrawColor(150, 150, 150); 
    doc.setLineWidth(0.1);

    let iterationCount = 0;

    for (let i = startPage; i <= endPage; i++) {
      if (xPos === marginX) {
          if (currentY + boxSize > absoluteLimitY) {
              doc.addPage(); 
              currentY = 20; 
          }
      }

      doc.rect(xPos, currentY, boxSize, boxSize);
      
      const textWidth = doc.getTextWidth(String(i));
      const xText = xPos + (boxSize - textWidth) / 2;
      doc.text(String(i), xText, currentY + 4.5);

      xPos += (boxSize + gap);
      iterationCount++;

      if (iterationCount % boxesPerRow === 0) {
        xPos = marginX;
        currentY += (boxSize + gap);
      }
    }

    if (iterationCount % boxesPerRow !== 0) {
        currentY += (boxSize + gap);
    }
    
    currentY += 3; 
  });

  // Tanda Tangan
  if (currentY + 35 > absoluteLimitY) {
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

  // BRANDING NINJA (Posisi 294mm)
  const totalPages = doc.getNumberOfPages();

  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i); 
    doc.setFontSize(7);
    doc.setTextColor(180, 180, 180); 
    doc.setFont('helvetica', 'italic'); 
    
    const brandingText = 'Generated by SIANDRE • Santri Idaman Anti Drama Rajin Evaluasi';
    doc.text(brandingText, pageWidth / 2, footerY, { align: 'center' }); 
  }

  const safeNama = namaSantri.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'santri';
  doc.save(`Lembar_Kontrol_${safeNama}_${templateType}.pdf`);
};