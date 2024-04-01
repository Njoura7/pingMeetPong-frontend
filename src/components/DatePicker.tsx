import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  field: {
    value: Date | null;
    onChange: (date: Date | null) => void;
  };
}

export function DatePicker({ field }: DatePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleSelect = (date: Date | null) => {
    field.onChange(date);
    setIsOpen(false);
  };

  return (
    <Popover isOpen={isOpen} onOpen={() => setIsOpen(true)} onClose={() => setIsOpen(false)}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !field.value && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <div>
        <Calendar
          mode="single"
          selected={field.value}
          onSelect={handleSelect}
          initialFocus
        />
      </div>
      </PopoverContent>
    </Popover>
  );
}



