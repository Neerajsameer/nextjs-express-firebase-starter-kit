"use client";

import { CalendarIcon } from "@heroicons/react/24/outline";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export function DatePicker({
  selectedDate,
  onChange,
  label,
  required,
}: {
  selectedDate: Date | undefined;
  onChange: (date: Date | undefined) => void;
  label?: string;
  required?: boolean;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="flex flex-col gap-2">
          {label && (
            <label className="text-sm font-medium">
              {label}
              {required && <span className="text-red-500">*</span>}
            </label>
          )}
          <Button
            variant={"outline"}
            className={cn("w-[210px] justify-start text-left font-normal", !selectedDate && "text-muted-foreground")}
          >
            <CalendarIcon className="w-4 h-4 mr-2" />
            {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          captionLayout="dropdown"
          mode="single"
          selected={selectedDate}
          onSelect={onChange}
          fromYear={1970}
          toYear={2035}
        />
      </PopoverContent>
    </Popover>
  );
}
