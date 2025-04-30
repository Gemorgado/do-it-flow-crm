
import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export interface ComboboxOption {
  id: string
  [key: string]: any
}

interface ComboboxProps {
  options: ComboboxOption[] | undefined | null
  selected: ComboboxOption | null
  onSelect: (value: ComboboxOption) => void
  onSearch?: (value: string) => void
  getOptionLabel: (option: ComboboxOption) => string
  placeholder?: string
  searchPlaceholder?: string
  className?: string
  disabled?: boolean
  emptyMessage?: string
  // Additional props for the requested interface
  query?: string
  onQueryChange?: (value: string) => void
}

export function Combobox({
  options,
  selected,
  onSelect,
  onSearch,
  getOptionLabel,
  placeholder = "Select an option",
  searchPlaceholder = "Search...",
  className,
  disabled = false,
  emptyMessage = "No results found.",
  query,
  onQueryChange
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  
  // Ensure options is always an array, even if it's null or undefined
  const safeOptions = React.useMemo(() => options || [], [options]);
  
  const handleSearch = React.useCallback(
    (value: string) => {
      // Support both patterns
      if (onQueryChange) {
        onQueryChange(value);
      }
      if (onSearch) {
        onSearch(value);
      }
    },
    [onSearch, onQueryChange]
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
          disabled={disabled}
        >
          {selected ? getOptionLabel(selected) : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput 
            placeholder={searchPlaceholder}
            value={query}
            onValueChange={handleSearch}
            className="h-9"
          />
          <CommandEmpty>{emptyMessage}</CommandEmpty>
          <CommandGroup className="max-h-60 overflow-auto">
            {safeOptions.map((option) => (
              <CommandItem
                key={option.id}
                value={option.id}
                onSelect={() => {
                  onSelect(option)
                  setOpen(false)
                }}
                className="cursor-pointer"
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selected?.id === option.id ? "opacity-100" : "opacity-0"
                  )}
                />
                {getOptionLabel(option)}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
