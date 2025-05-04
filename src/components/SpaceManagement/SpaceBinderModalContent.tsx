
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Client, Location, SpaceBinding } from "@/types";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export interface SpaceBinderModalContentProps {
  space: Location;
  selectedClientId: string | null;
  setSelectedClientId: (id: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  contractId: string | null;
  setContractId: (id: string | null) => void;
  unitPrice: number | null;
  setUnitPrice: (price: number | null) => void;
  startDate: string | null;
  setStartDate: (date: string | null) => void;
  endDate: string | null;
  setEndDate: (date: string | null) => void;
  existingBinding: SpaceBinding | null;
  isLoading: boolean;
  isLoadingClients: boolean;
  isLoadingContract: boolean;
  activeContract: any | null;
  clients: Client[];
  handleSave: () => Promise<void>;
  handleUnbind: () => Promise<void>;
  canSave: boolean;
  onClose: () => void;
}

export function SpaceBinderModalContent({
  space,
  selectedClientId,
  setSelectedClientId,
  searchQuery,
  setSearchQuery,
  contractId,
  setContractId,
  unitPrice,
  setUnitPrice,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  existingBinding,
  isLoading,
  isLoadingClients,
  isLoadingContract,
  activeContract,
  clients,
  handleSave,
  handleUnbind,
  canSave,
  onClose
}: SpaceBinderModalContentProps) {
  // Local state for filtering clients
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  
  // Filter clients based on search query
  useEffect(() => {
    if (!clients) return;
    
    const filtered = searchQuery 
      ? clients.filter(c => 
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
          c.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.email.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : clients;
    
    setFilteredClients(filtered);
  }, [clients, searchQuery]);

  return (
    <div className="space-y-4 mt-4">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
          <p>Loading binding information...</p>
        </div>
      ) : (
        <>
          <div className="space-y-2">
            <Label htmlFor="client">Client</Label>
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Search clients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                disabled={!!existingBinding}
              />
              
              {isLoadingClients ? (
                <div className="flex items-center justify-center p-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              ) : (
                <div className="border rounded-md max-h-40 overflow-y-auto">
                  {filteredClients.length === 0 ? (
                    <div className="p-2 text-sm text-center text-muted-foreground">
                      No clients found
                    </div>
                  ) : (
                    filteredClients.map((client) => (
                      <div 
                        key={client.id}
                        className={cn(
                          "p-2 cursor-pointer hover:bg-accent",
                          selectedClientId === client.id ? "bg-muted" : ""
                        )}
                        onClick={() => !existingBinding && setSelectedClientId(client.id)}
                      >
                        <div className="font-medium">{client.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {client.company && `${client.company} • `}{client.email}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          {selectedClientId && (
            <div className="space-y-2">
              <Label>Contract Details</Label>
              
              {isLoadingContract ? (
                <div className="flex items-center justify-center p-2">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  <span>Loading contract details...</span>
                </div>
              ) : activeContract ? (
                <div className="border rounded-md p-3">
                  <div className="font-medium">{activeContract.description}</div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Start: </span>
                    {new Date(activeContract.contractStart).toLocaleDateString()}
                    <span className="text-muted-foreground ml-2">End: </span>
                    {new Date(activeContract.contractEnd).toLocaleDateString()}
                  </div>
                  <div className="text-sm mt-1">
                    <span className="text-muted-foreground">Value: </span>
                    R$ {(activeContract.value / 100).toFixed(2)}
                  </div>
                  <Button 
                    variant="outline" 
                    className="mt-2 w-full"
                    onClick={() => {
                      setContractId(activeContract.id);
                      setUnitPrice(activeContract.value);
                      setStartDate(activeContract.contractStart);
                      setEndDate(activeContract.contractEnd);
                    }}
                  >
                    Use This Contract
                  </Button>
                </div>
              ) : (
                <div className="border rounded-md p-3 text-center text-muted-foreground">
                  No active contract found for this client
                </div>
              )}
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="unit-price">Monthly Price (R$)</Label>
            <Input
              id="unit-price"
              type="number"
              value={unitPrice !== null ? unitPrice : ''}
              onChange={(e) => setUnitPrice(e.target.value ? Number(e.target.value) : null)}
              placeholder="0.00"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(new Date(startDate), "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate ? new Date(startDate) : undefined}
                    onSelect={(date) => setStartDate(date ? date.toISOString() : null)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label>End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(new Date(endDate), "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate ? new Date(endDate) : undefined}
                    onSelect={(date) => setEndDate(date ? date.toISOString() : null)}
                    initialFocus
                    disabled={(date) => 
                      startDate ? date < new Date(startDate) : date < new Date()
                    }
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div className="flex justify-between pt-4">
            {existingBinding ? (
              <Button variant="destructive" onClick={handleUnbind}>
                Remove Binding
              </Button>
            ) : (
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
            )}
            <Button onClick={handleSave} disabled={!canSave}>
              {existingBinding ? 'Update' : 'Assign'}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
