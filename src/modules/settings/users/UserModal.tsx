
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, TabKey, Team, TabKeyDisplayMap, TeamDisplayMap } from './types';
import { useUpsertUser } from '@/api/users';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';

// Schema for form validation
const userFormSchema = z.object({
  name: z.string().min(3, { message: 'Nome deve ter pelo menos 3 caracteres' }),
  email: z.string().email({ message: 'Email inválido' }),
  team: z.enum(['financeiro', 'atendimento', 'frontdesk', 'comercial']),
  allowedTabs: z.array(z.string()).min(1, { message: 'Selecione pelo menos uma aba' }),
});

export type UserFormValues = z.infer<typeof userFormSchema>;

interface UserModalProps {
  user?: User;
  open: boolean;
  onClose: () => void;
}

export function UserModal({ user, open, onClose }: UserModalProps) {
  const [selectedTabs, setSelectedTabs] = useState<TabKey[]>(user?.allowedTabs || []);
  const upsertUser = useUpsertUser();
  
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      team: user?.team || 'comercial',
      allowedTabs: user?.allowedTabs || [],
    },
  });

  const allTabs = Object.keys(TabKeyDisplayMap) as TabKey[];
  
  const onSubmit = async (data: UserFormValues) => {
    try {
      await upsertUser.mutateAsync({
        id: user?.id,
        name: data.name,
        email: data.email,
        team: data.team as Team,
        allowedTabs: data.allowedTabs as TabKey[],
      });
      
      toast({
        title: user ? 'Usuário atualizado' : 'Usuário criado',
        description: `${data.name} foi ${user ? 'atualizado' : 'adicionado'} com sucesso.`,
      });
      
      onClose();
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao salvar o usuário.',
        variant: 'destructive',
      });
    }
  };

  const handleTabChange = (tab: TabKey, checked: boolean) => {
    setSelectedTabs(prev => {
      const newTabs = checked 
        ? [...prev, tab]
        : prev.filter(t => t !== tab);
      
      form.setValue('allowedTabs', newTabs, { shouldValidate: true });
      return newTabs;
    });
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{user ? 'Editar Usuário' : 'Novo Usuário'}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome completo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="email@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="team"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um time" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(TeamDisplayMap).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="allowedTabs"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel>Abas Permitidas</FormLabel>
                    <p className="text-xs text-gray-500 mt-1">
                      Selecionadas {selectedTabs.length} de {allTabs.length} abas
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {allTabs.map((tab) => (
                      <FormItem
                        key={tab}
                        className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-3"
                      >
                        <FormControl>
                          <Checkbox
                            checked={selectedTabs.includes(tab)}
                            onCheckedChange={(checked) => 
                              handleTabChange(tab, checked as boolean)
                            }
                          />
                        </FormControl>
                        <FormLabel className="cursor-pointer font-normal">
                          {TabKeyDisplayMap[tab]}
                        </FormLabel>
                      </FormItem>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
              >
                Cancelar
              </Button>
              <Button 
                type="submit"
                disabled={upsertUser.isPending}
              >
                {upsertUser.isPending ? 'Salvando...' : 'Salvar'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
