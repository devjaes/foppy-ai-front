import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { FieldErrors, FieldValues } from "react-hook-form";

interface DatePickerProps {
  name?: string;
  value?: Date;
  minDate?: Date;
  onChange: (date: Date | undefined) => void;
  errors?: FieldErrors<FieldValues>;
  className?: string;
}

const DatePicker = ({
  name,
  minDate,
  onChange,
  errors,
  value,
  className,
}: DatePickerProps) => {
  const [date, setDate] = useState<Date | undefined>(value);
  const handleDateChange = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    onChange(selectedDate ? selectedDate : undefined);
  };

  const getErrorMessage = (name?: string): string | undefined => {
    if (!name) return undefined;
    const error = errors?.[name];
    return error && typeof error.message === "string"
      ? error.message
      : undefined;
  };

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "mt-1 w-full justify-start text-left font-normal",
              !date && "text-muted-foreground",
              className
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? (
              format(date, "PPP", { locale: es })
            ) : (
              <span>Selecciona una fecha</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateChange}
            initialFocus
            fromDate={minDate}
          />
        </PopoverContent>
      </Popover>

      <p className="text-sm text-red-500">&nbsp; {getErrorMessage(name)}</p>
    </>
  );
};

export default DatePicker;
