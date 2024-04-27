import * as React from "react";
import { format, isBefore, startOfDay } from "date-fns";
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
  selected: Date | undefined;
  onSelect: (date: Date | undefined) => void;
}

export const DatePicker: React.FC<DatePickerProps> = ({ selected, onSelect }) =>  {
  const handleDateSelect = (selectedDate: Date | undefined) => {
    // Check if selectedDate is undefined
    if (!selectedDate) {
      console.log("No date selected.");
      return;
    }
    // Ensure the selected date is not before today
    if (isBefore(startOfDay(selectedDate), startOfDay(new Date()))) {
      // Optionally, alert the user or handle this case differently
      return; // Do not update the date
    }
    onSelect(selectedDate); // Use onSelect to update the date externally
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !selected && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selected ? format(selected, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={handleDateSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}