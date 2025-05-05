
import { Button } from '@/components/ui/button';
import { seedDatabase } from '@/utils/supabaseSeeder';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useState } from 'react';

/**
 * Component to reset and seed the Supabase database.
 * This is useful for development and demo purposes.
 */
export const ResetSupabaseData = () => {
  const [isLoading, setIsLoading] = useState(false);

  const resetAndSeedData = async () => {
    if (!confirm('This will delete all existing data and seed the database with demo data. Continue?')) {
      return;
    }

    setIsLoading(true);
    try {
      toast.info('Resetting database...');
      
      // Delete all data from tables in reverse dependency order
      await supabase.from('space_allocations').delete().neq('id', 'none');
      await supabase.from('client_services').delete().neq('id', 'none');
      await supabase.from('clients').delete().neq('id', 'none');
      await supabase.from('proposal_items').delete().neq('id', 'none');
      await supabase.from('proposals').delete().neq('id', 'none');
      await supabase.from('leads').delete().neq('id', 'none');
      await supabase.from('spaces').delete().neq('id', 'none');
      await supabase.from('pipeline_stages').delete().neq('id', 'none');
      
      toast.success('Database reset successfully');
      
      // Now seed the database
      await seedDatabase();
    } catch (error) {
      console.error('Error resetting database:', error);
      toast.error('Failed to reset database');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      variant="destructive" 
      onClick={resetAndSeedData} 
      disabled={isLoading}
    >
      {isLoading ? 'Resetting...' : 'Reset & Seed Supabase Data'}
    </Button>
  );
};

export default ResetSupabaseData;
