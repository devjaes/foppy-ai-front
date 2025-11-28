"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format, subMonths, startOfMonth, endOfMonth, startOfYear } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type PeriodType =
  | "current-month"
  | "last-month"
  | "last-3-months"
  | "last-6-months"
  | "current-year"
  | "custom";

export interface PeriodRange {
  startDate: Date;
  endDate: Date;
  type: PeriodType;
  label: string;
}

import { FilterPillGroup } from "@/components/ui/filter-pill-group";

interface PeriodSelectorProps {
  value: PeriodRange;
  onChange: (period: PeriodRange) => void;
  variant?: "default" | "pill";
}

const PRESET_PERIODS: Record<
  Exclude<PeriodType, "custom">,
  { label: string; getValue: () => { startDate: Date; endDate: Date } }
> = {
  "current-month": {
    label: "Mes actual",
    getValue: () => ({
      startDate: startOfMonth(new Date()),
      endDate: endOfMonth(new Date()),
    }),
  },
  "last-month": {
    label: "Mes anterior",
    getValue: () => {
      const lastMonth = subMonths(new Date(), 1);
      return {
        startDate: startOfMonth(lastMonth),
        endDate: endOfMonth(lastMonth),
      };
    },
  },
  "last-3-months": {
    label: "Últimos 3 meses",
    getValue: () => ({
      startDate: startOfMonth(subMonths(new Date(), 2)),
      endDate: endOfMonth(new Date()),
    }),
  },
  "last-6-months": {
    label: "Últimos 6 meses",
    getValue: () => ({
      startDate: startOfMonth(subMonths(new Date(), 5)),
      endDate: endOfMonth(new Date()),
    }),
  },
  "current-year": {
    label: "Año actual",
    getValue: () => ({
      startDate: startOfYear(new Date()),
      endDate: endOfMonth(new Date()), // Usar endOfMonth para incluir todo el mes actual
    }),
  },
};

export function PeriodSelector({ value, onChange, variant = "default" }: PeriodSelectorProps) {
  const [selectedType, setSelectedType] = useState<PeriodType>(value.type);
  const [customStartDate, setCustomStartDate] = useState<Date | undefined>(
    value.type === "custom" ? value.startDate : undefined
  );
  const [customEndDate, setCustomEndDate] = useState<Date | undefined>(
    value.type === "custom" ? value.endDate : undefined
  );

  const handlePresetChange = (type: PeriodType) => {
    setSelectedType(type);

    if (type === "custom") {
      return;
    }

    const preset = PRESET_PERIODS[type];
    const dates = preset.getValue();

    onChange({
      startDate: dates.startDate,
      endDate: dates.endDate,
      type,
      label: preset.label,
    });
  };

  const handleCustomDateChange = () => {
    if (customStartDate && customEndDate) {
      onChange({
        startDate: customStartDate,
        endDate: customEndDate,
        type: "custom",
        label: `${format(customStartDate, "dd MMM", { locale: es })} - ${format(
          customEndDate,
          "dd MMM yyyy",
          { locale: es }
        )}`,
      });
    }
  };

  if (variant === "pill") {
    const options = Object.entries(PRESET_PERIODS).map(([key, val]) => ({
      value: key,
      label: val.label,
    }));
    options.push({ value: "custom", label: "Personalizado" });

    return (
      <div className="flex items-center gap-2">
        <FilterPillGroup
          options={options}
          value={selectedType}
          onChange={(val) => handlePresetChange(val as PeriodType)}
          placeholder="Período"
        />
        {selectedType === "custom" && (
          // Simplified custom date picker for pill mode could go here, 
          // but for now we'll just show the standard one if custom is selected
          // or maybe just redirect to standard view. 
          // For simplicity in this iteration, let's just show the label.
          <span className="text-xs text-muted-foreground ml-2">
            {value.label}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
      <Select
        value={selectedType}
        onValueChange={(val) => handlePresetChange(val as PeriodType)}
      >
        <SelectTrigger className="w-full sm:w-[200px]">
          <SelectValue placeholder="Seleccionar período" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="current-month">Mes actual</SelectItem>
          <SelectItem value="last-month">Mes anterior</SelectItem>
          <SelectItem value="last-3-months">Últimos 3 meses</SelectItem>
          <SelectItem value="last-6-months">Últimos 6 meses</SelectItem>
          <SelectItem value="current-year">Año actual</SelectItem>
          <SelectItem value="custom">Personalizado</SelectItem>
        </SelectContent>
      </Select>

      {selectedType === "custom" && (
        <div className="flex gap-2 items-center flex-wrap">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full sm:w-[160px] justify-start text-left font-normal",
                  !customStartDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {customStartDate ? (
                  format(customStartDate, "dd MMM yyyy", { locale: es })
                ) : (
                  <span>Fecha inicio</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={customStartDate}
                onSelect={setCustomStartDate}
                initialFocus
                locale={es}
              />
            </PopoverContent>
          </Popover>

          <span className="text-muted-foreground">-</span>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full sm:w-[160px] justify-start text-left font-normal",
                  !customEndDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {customEndDate ? (
                  format(customEndDate, "dd MMM yyyy", { locale: es })
                ) : (
                  <span>Fecha fin</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={customEndDate}
                onSelect={setCustomEndDate}
                initialFocus
                locale={es}
                disabled={(date) =>
                  customStartDate ? date < customStartDate : false
                }
              />
            </PopoverContent>
          </Popover>

          <Button
            onClick={handleCustomDateChange}
            disabled={!customStartDate || !customEndDate}
            size="sm"
          >
            Aplicar
          </Button>
        </div>
      )}

      <div className="text-sm text-muted-foreground">
        {selectedType === "custom" && customStartDate && customEndDate
          ? `${format(customStartDate, "dd MMM", { locale: es })} - ${format(
            customEndDate,
            "dd MMM yyyy",
            { locale: es }
          )}`
          : value.label}
      </div>
    </div>
  );
}
