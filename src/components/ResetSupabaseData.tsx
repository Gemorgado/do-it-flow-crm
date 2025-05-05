
import { Button } from "@/components/ui/button";
import { ReloadIcon } from "lucide-react";
import { seedDatabase } from "@/utils/supabaseSeeder";
import { useState } from "react";
import { toast } from "sonner";

export function ResetSupabaseData() {
  const [isResetting, setIsResetting] = useState(false);

  const handleReset = async () => {
    try {
      setIsResetting(true);
      const result = await seedDatabase();
      if (result) {
        toast.success("Supabase demo data has been reset");
      } else {
        toast.error("Failed to reset Supabase demo data");
      }
    } catch (error) {
      console.error("Error resetting Supabase data:", error);
      toast.error("Failed to reset Supabase demo data");
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      disabled={isResetting}
      onClick={handleReset}
    >
      {isResetting ? (
        <>
          <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
          Resetting...
        </>
      ) : (
        "Reset Supabase Data"
      )}
    </Button>
  );
}
