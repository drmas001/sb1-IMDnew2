import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';

interface ExportData {
  patients: any[];
  consultations: any[];
  appointments: any[];
  activeTab: 'all' | 'admissions' | 'consultations' | 'appointments';
  dateFilter: {
    startDate: string;
    endDate: string;
    period: string;
  };
}

export const exportToPDF = ({ patients, consultations, appointments, activeTab, dateFilter }: ExportData) => {
  try {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const today = format(new Date(), 'MMMM d, yyyy');
    
    // Add header
    doc.setFontSize(20);
    doc.text('IMD-Care Report', pageWidth / 2, 15, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text(`Generated on: ${today}`, pageWidth / 2, 25, { align: 'center' });
    doc.text(`Period: ${format(new Date(dateFilter.startDate), 'MMM d, yyyy')} - ${format(new Date(dateFilter.endDate), 'MMM d, yyyy')}`, pageWidth / 2, 32, { align: 'center' });

    let currentY = 45;

    // Active Admissions Section
    if (activeTab === 'all' || activeTab === 'admissions') {
      if (patients.length > 0) {
        doc.setFontSize(14);
        doc.text('Active Admissions', 14, currentY);
        currentY += 10;

        const admissionsData = patients.map(patient => {
          const activeAdmission = patient.admissions?.find(a => a.status === 'active');
          return [
            patient.name,
            patient.mrn,
            activeAdmission?.department || '',
            format(new Date(activeAdmission?.admission_date || ''), 'MMM d, yyyy'),
            activeAdmission?.shift_type?.toUpperCase() || '',
            activeAdmission?.users?.name || 'Not assigned',
            activeAdmission?.diagnosis || ''
          ];
        });

        autoTable(doc, {
          startY: currentY,
          head: [['Patient Name', 'MRN', 'Department', 'Admission Date', 'Shift', 'Doctor', 'Diagnosis']],
          body: admissionsData,
          theme: 'striped',
          headStyles: { 
            fillColor: [63, 81, 181],
            fontSize: 10,
            cellPadding: 2
          },
          bodyStyles: {
            fontSize: 9,
            cellPadding: 2
          },
          columnStyles: {
            0: { cellWidth: 30 },
            1: { cellWidth: 20 },
            2: { cellWidth: 30 },
            3: { cellWidth: 25 },
            4: { cellWidth: 20 },
            5: { cellWidth: 30 },
            6: { cellWidth: 'auto' }
          }
        });

        currentY = (doc as any).lastAutoTable.finalY + 15;
      }
    }

    // Consultations Section
    if (activeTab === 'all' || activeTab === 'consultations') {
      if (consultations.length > 0) {
        if (currentY > doc.internal.pageSize.height - 60) {
          doc.addPage();
          currentY = 15;
        }

        doc.setFontSize(14);
        doc.text('Medical Consultations', 14, currentY);
        currentY += 10;

        const consultationsData = consultations.map(consultation => [
          consultation.patient_name,
          consultation.mrn,
          consultation.consultation_specialty,
          format(new Date(consultation.created_at), 'MMM d, yyyy'),
          consultation.shift_type.toUpperCase(),
          consultation.urgency.toUpperCase(),
          consultation.reason
        ]);

        autoTable(doc, {
          startY: currentY,
          head: [['Patient Name', 'MRN', 'Specialty', 'Date', 'Shift', 'Urgency', 'Reason']],
          body: consultationsData,
          theme: 'striped',
          headStyles: {
            fillColor: [63, 81, 181],
            fontSize: 10,
            cellPadding: 2
          },
          bodyStyles: {
            fontSize: 9,
            cellPadding: 2
          },
          columnStyles: {
            0: { cellWidth: 30 },
            1: { cellWidth: 20 },
            2: { cellWidth: 30 },
            3: { cellWidth: 25 },
            4: { cellWidth: 20 },
            5: { cellWidth: 20 },
            6: { cellWidth: 'auto' }
          }
        });

        currentY = (doc as any).lastAutoTable.finalY + 15;
      }
    }

    // Appointments Section
    if (activeTab === 'all' || activeTab === 'appointments') {
      if (appointments.length > 0) {
        if (currentY > doc.internal.pageSize.height - 60) {
          doc.addPage();
          currentY = 15;
        }

        doc.setFontSize(14);
        doc.text('Clinic Appointments', 14, currentY);
        currentY += 10;

        const appointmentsData = appointments.map(appointment => [
          appointment.patientName,
          appointment.medicalNumber,
          appointment.specialty,
          format(new Date(appointment.createdAt), 'MMM d, yyyy'),
          appointment.appointmentType.toUpperCase(),
          appointment.status,
          appointment.notes || ''
        ]);

        autoTable(doc, {
          startY: currentY,
          head: [['Patient Name', 'Medical No.', 'Specialty', 'Date', 'Type', 'Status', 'Notes']],
          body: appointmentsData,
          theme: 'striped',
          headStyles: {
            fillColor: [63, 81, 181],
            fontSize: 10,
            cellPadding: 2
          },
          bodyStyles: {
            fontSize: 9,
            cellPadding: 2
          },
          columnStyles: {
            0: { cellWidth: 30 },
            1: { cellWidth: 25 },
            2: { cellWidth: 30 },
            3: { cellWidth: 25 },
            4: { cellWidth: 20 },
            5: { cellWidth: 20 },
            6: { cellWidth: 'auto' }
          }
        });
      }
    }

    // Add footer with page numbers
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.text(
        `Page ${i} of ${pageCount}`,
        pageWidth / 2,
        doc.internal.pageSize.height - 10,
        { align: 'center' }
      );
    }

    // Save the PDF
    doc.save(`imd-care-report-${format(new Date(), 'yyyy-MM-dd-HHmm')}.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF report');
  }
};