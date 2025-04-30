
import { Control } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUsers } from "@/api/proposals";

interface OwnerFieldProps {
  control: Control<any>;
  defaultValue: string;
}

export const OwnerField = ({ control, defaultValue }: OwnerFieldProps) => {
  const { data: users } = useUsers();

  return (
    <FormField
      control={control}
      name="ownerId"
      defaultValue={defaultValue}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Responsável</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um responsável" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {users?.map(user => (
                <SelectItem key={user.id} value={user.id}>
                  {user.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
