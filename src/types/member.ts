export interface Member {
  id: string;
  member_number: string;
  full_name: string;
  phone?: string;
  email?: string;
  status: 'active' | 'inactive';
  yearly_payment_status?: 'pending' | 'completed';
  collector?: string;
}