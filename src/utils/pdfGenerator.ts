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

  // Group members by collector
  const membersByCollector = members.reduce((acc, member) => {
    const collector = member.collector || 'Unassigned';
    if (!acc[collector]) {
      acc[collector] = [];
    }
    acc[collector].push(member);
    return acc;
  }, {} as Record<string, Member[]>);

  let startY = 35;

  // Define the columns for the table
  const columns = [
    'Member #',
    'Name',
    'Email',
    'Phone',
    'Address',
    'Status',
  ];

  // Generate tables for each collector group
  Object.entries(membersByCollector).forEach(([collector, collectorMembers], index) => {
    // Start new page for each collector (except the first one)
    if (index > 0) {
      doc.addPage();
      startY = 20;
    }

    // Add collector section header with member count
    doc.setFontSize(14);
    doc.text(`Collector: ${collector} (${collectorMembers.length} members)`, 14, startY);
    startY += 10;

    // Transform the data into rows
    const rows = collectorMembers.map(member => [
      member.member_number,
      member.full_name,
      member.email || 'N/A',
      member.phone || 'N/A',
      `${member.address || ''} ${member.town || ''} ${member.postcode || ''}`.trim() || 'N/A',
      member.status || 'N/A',
    ]);

    // Generate the table for this collector's members
    autoTable(doc, {
      head: [columns],
      body: rows,
      startY: startY,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [137, 137, 222] }, // Using dashboard accent1 color
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });

    // Update startY for next section, adding extra space
    const finalY = (doc as any).lastAutoTable.finalY;
    startY = finalY + 15;
  });

  // Save the PDF
  doc.save(`members-report-${new Date().toISOString().split('T')[0]}.pdf`);
};