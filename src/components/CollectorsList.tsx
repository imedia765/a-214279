import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { Database } from '@/integrations/supabase/types';
import { UserCheck, ChevronDown, User } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type MemberCollector = Database['public']['Tables']['members_collectors']['Row'];
type Member = Database['public']['Tables']['members']['Row'];

const CollectorsList = () => {
  const { data: collectors, isLoading: collectorsLoading, error: collectorsError } = useQuery({
    queryKey: ['members_collectors'],
    queryFn: async () => {
      console.log('Fetching collectors from members_collectors...');
      const { data, error } = await supabase
        .from('members_collectors')
        .select(`
          id,
          name,
          prefix,
          number,
          email,
          phone,
          active,
          created_at,
          updated_at
        `)
        .order('number', { ascending: true })
        .throwOnError();
      
      if (error) {
        console.error('Error fetching collectors:', error);
        throw error;
      }
      
      console.log('Fetched collectors:', data);
      return data as MemberCollector[];
    },
  });

  const { data: members } = useQuery({
    queryKey: ['members'],
    queryFn: async () => {
      console.log('Fetching all members...');
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .throwOnError();
      
      if (error) {
        console.error('Error fetching members:', error);
        throw error;
      }
      
      console.log('Fetched total members:', data?.length);
      return data as Member[];
    },
  });

  // Group members by collector
  const membersByCollector = members?.reduce((acc, member) => {
    if (member.collector) {
      if (!acc[member.collector]) {
        acc[member.collector] = [];
      }
      acc[member.collector].push(member);
    }
    return acc;
  }, {} as Record<string, Member[]>);

  if (collectorsLoading) return <div className="text-center py-4">Loading collectors...</div>;
  if (collectorsError) return <div className="text-center py-4 text-red-500">Error loading collectors: {collectorsError.message}</div>;
  if (!collectors?.length) return <div className="text-center py-4">No collectors found</div>;

  return (
    <div className="space-y-4">
      <Accordion type="single" collapsible className="space-y-4">
        {collectors.map((collector) => {
          const collectorMembers = membersByCollector?.[collector.name || ''] || [];
          
          return (
            <AccordionItem
              key={collector.id}
              value={collector.id}
              className="bg-dashboard-card border border-white/10 rounded-lg overflow-hidden"
            >
              <AccordionTrigger className="px-4 py-3 hover:no-underline">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-medium">
                      {collector.prefix}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-white">{collector.name}</p>
                        <span className="text-sm text-gray-400">#{collector.number}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-dashboard-text">
                        <UserCheck className="w-4 h-4" />
                        <span>Collector</span>
                        <span className="text-purple-400">({collectorMembers.length} members)</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`px-3 py-1 rounded-full ${
                      collector.active 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {collector.active ? 'Active' : 'Inactive'}
                    </div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <div className="space-y-3 mt-2">
                  {collectorMembers.length > 0 ? (
                    collectorMembers.map((member) => (
                      <div 
                        key={member.id}
                        className="flex items-center gap-3 p-3 bg-black/20 rounded-lg"
                      >
                        <User className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-white">{member.full_name}</p>
                          <p className="text-xs text-gray-400">Member #{member.member_number}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-400">No members assigned to this collector</p>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
};

export default CollectorsList;