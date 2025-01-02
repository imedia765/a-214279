import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Database } from '@/integrations/supabase/types';

type Member = Database['public']['Tables']['members']['Row'];

export const generateMembersPDF = (members: Member[], title: string = 'All Members Report') => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(16);
  doc.text(title, 14, 15);
  doc.setFontSize(11);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 25);
  
  // Define the columns for the table
  const columns = [
    'Member #',
    'Name',
    'Email',
    'Phone',
    'Address',
    'Status',
    'Collector'
  ];

  // Transform the data into rows
  const rows = members.map(member => [
    member.member_number,
    member.full_name,
    member.email || 'N/A',
    member.phone || 'N/A',
    `${member.address || ''} ${member.town || ''} ${member.postcode || ''}`.trim() || 'N/A',
    member.status || 'N/A',
    member.collector || 'N/A'
  ]);

  // Generate the table
  autoTable(doc, {
    head: [columns],
    body: rows,
    startY: 35,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [75, 75, 75] },
    alternateRowStyles: { fillColor: [245, 245, 245] },
  });

  // Save the PDF
  doc.save(`members-report-${new Date().toISOString().split('T')[0]}.pdf`);
};