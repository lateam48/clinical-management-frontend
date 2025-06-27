import * as React from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface Option {
  label: string;
  value: string;
}

interface SelectWithSearchProps {
  options: Option[];
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  renderOption?: (option: Option) => React.ReactNode;
}

export const SelectWithSearch: React.FC<SelectWithSearchProps> = ({
  options,
  value,
  onValueChange,
  placeholder = "Sélectionner...",
  disabled,
  renderOption,
}) => {
  const [search, setSearch] = React.useState("");
  const filteredOptions = React.useMemo(
    () =>
      options.filter((option) =>
        option.label.toLowerCase().includes(search.toLowerCase())
      ),
    [options, search]
  );

  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger className="w-full bg-white border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <div className="p-2">
          <Input
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-2 bg-white border border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            autoFocus
          />
        </div>
        {filteredOptions.length === 0 && (
          <div className="px-3 py-2 text-sm text-muted-foreground">Aucun résultat</div>
        )}
        {filteredOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {renderOption ? renderOption(option) : option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}; 