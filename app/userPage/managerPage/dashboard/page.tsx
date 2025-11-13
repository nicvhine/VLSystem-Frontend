'use client';

import { useState, useEffect } from 'react';
import { FiDownload } from 'react-icons/fi';
import LoanStatistics from "@/app/commonComponents/statistics/loanStatistics";
import LoanStatisticsTops from "@/app/commonComponents/statistics/loanStatisticsTops";
import LoanStatisticsCharts from "@/app/commonComponents/statistics/loanStatisticsCharts";
import translations from "@/app/commonComponents/translation";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function ManagerDashboard() {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleExportPDF = async () => {
    console.log('Export PDF clicked');
    setIsGenerating(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const leftColumn = document.getElementById('left-column');
      const rightColumn = document.getElementById('right-column');

      if (!leftColumn || !rightColumn) {
        alert('Error: Dashboard sections not found');
        return;
      }

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;

      // Capture left column
      const canvas1 = await html2canvas(leftColumn, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        ignoreElements: (element) => {
          return false;
        },
        onclone: (clonedDoc) => {
          // Remove problematic color formats from cloned document
          const style = clonedDoc.createElement('style');
          style.textContent = `
            * {
              color: inherit !important;
              background-color: inherit !important;
              border-color: inherit !important;
            }
          `;
          clonedDoc.head.appendChild(style);
        }
      });

      const imgWidth = pageWidth - (margin * 2);
      const imgHeight = (canvas1.height * imgWidth) / canvas1.width;
      
      const finalHeight = imgHeight > (pageHeight - margin * 2) 
        ? pageHeight - margin * 2 
        : imgHeight;
      const finalWidth = (canvas1.width * finalHeight) / canvas1.height;

      pdf.addImage(
        canvas1.toDataURL('image/png'),
        'PNG',
        margin,
        margin,
        finalWidth,
        finalHeight
      );

      // Capture right column
      pdf.addPage();
      const canvas2 = await html2canvas(rightColumn, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        ignoreElements: (element) => {
          return false;
        },
        onclone: (clonedDoc) => {
          const style = clonedDoc.createElement('style');
          style.textContent = `
            * {
              color: inherit !important;
              background-color: inherit !important;
              border-color: inherit !important;
            }
          `;
          clonedDoc.head.appendChild(style);
        }
      });

      const imgWidth2 = pageWidth - (margin * 2);
      const imgHeight2 = (canvas2.height * imgWidth2) / canvas2.width;
      
      const finalHeight2 = imgHeight2 > (pageHeight - margin * 2) 
        ? pageHeight - margin * 2 
        : imgHeight2;
      const finalWidth2 = (canvas2.width * finalHeight2) / canvas2.height;

      pdf.addImage(
        canvas2.toDataURL('image/png'),
        'PNG',
        margin,
        margin,
        finalWidth2,
        finalHeight2
      );

      const timestamp = new Date().toISOString().split('T')[0];
      pdf.save(`analytics-dashboard-${timestamp}.pdf`);
      console.log('PDF saved successfully');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100 p-6 overflow-auto">
      <div className="max-w-7xl mx-auto">
        {/* Header with Export Button */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Analytics Dashboard</h1>
          <button
            onClick={handleExportPDF}
            disabled={isGenerating}
            className="export-button flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiDownload className="w-4 h-4" />
            {isGenerating ? 'Generating PDF...' : 'Export to PDF'}
          </button>
        </div>

        {/* Dashboard Content */}
        <div className="flex flex-col lg:flex-row gap-6" id="dashboardContent">

        {/* Left Column: Stats + Tops */}
        <div id="left-column" className="flex flex-col gap-6 w-full lg:w-1/2">
          <LoanStatistics />
          <LoanStatisticsTops />
        </div>

        {/* Right Column: Charts */}
        <div id="right-column" className="w-full lg:w-1/2 flex flex-col gap-6">
          <LoanStatisticsCharts />
        </div>

        </div>
      </div>
    </div>
    </>
  );
}
