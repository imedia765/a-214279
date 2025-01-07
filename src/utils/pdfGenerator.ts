import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Member } from '@/types/member';

export const generateMembersPDF = (members: Member[], title: string = "Members Report") => {
  const doc = new jsPDF();
  let startY = 20;

  // Add title
  doc.setFontSize(18);
  doc.text(title, 14, startY);
  startY += 15;

  // Add timestamp
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, startY);
  startY += 10;

  // Group members by collector
  const membersByCollector = members.reduce<{ [key: string]: Member[] }>((acc, member) => {
    const collector = member.collector || 'Unassigned';
    if (!acc[collector]) {
      acc[collector] = [];
    }
    acc[collector].push(member);
    return acc;
  }, {});

  // Define columns
  const columns = [
    { header: 'Member #', dataKey: 'member_number' },
    { header: 'Name', dataKey: 'full_name' },
    { header: 'Phone', dataKey: 'phone' },
    { header: 'Email', dataKey: 'email' },
    { header: 'Status', dataKey: 'status' },
    { header: 'Payment Status', dataKey: 'yearly_payment_status' }
  ];

  // Generate tables for each collector group
  Object.entries(membersByCollector).forEach(([collector, collectorMembers], index) => {
    // Start new page for each collector (except the first one)
    if (index > 0) {
      doc.addPage();
      startY = 20;
    }

    // Add collector section header with member count and summary
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text(`Collector: ${collector}`, 14, startY);
    startY += 8;
    
    doc.setFontSize(11);
    doc.setTextColor(80);
    doc.text(`Total Members: ${collectorMembers.length}`, 14, startY);
    startY += 8;

    // Add payment status summary
    const activeMembers = collectorMembers.filter(m => m.status === 'active').length;
    const paidMembers = collectorMembers.filter(m => m.yearly_payment_status === 'completed').length;
    
    doc.text(`Active Members: ${activeMembers}`, 14, startY);
    startY += 6;
    doc.text(`Paid Members: ${paidMembers}`, 14, startY);
    startY += 10;

    // Transform the data into rows
    const rows = collectorMembers.map(member => ({
      member_number: member.member_number,
      full_name: member.full_name,
      phone: member.phone || 'N/A',
      email: member.email || 'N/A',
      status: member.status,
      yearly_payment_status: member.yearly_payment_status || 'pending'
    }));

    // Add the table
    (doc as any).autoTable({
      startY: startY,
      head: [columns.map(col => col.header)],
      body: rows.map(row => columns.map(col => row[col.dataKey as keyof typeof row])),
      theme: 'grid',
      headStyles: { fillColor: [89, 91, 213], textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [245, 247, 250] },
      margin: { top: 10 },
      styles: { fontSize: 9 }
    });

    // Update startY for next section
    const finalY = (doc as any).lastAutoTable.finalY;
    startY = finalY + 15;
  });

  // Save the PDF
  doc.save(`${title.toLowerCase().replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
};