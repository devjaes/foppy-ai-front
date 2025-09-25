import React, { useEffect } from "react";
import { useFormContext, Controller } from "react-hook-form";

import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface RHFSelectProps {
  name: string;
  label: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

const RHFSelect: React.FC<RHFSelectProps> = ({
  name,
  label,
  options,
  placeholder,
}) => {
  const {
    control,
    formState: { errors },
    watch,
  } = useFormContext();

  const currentValue = watch(name);
  useEffect(() => {
    console.log(`Field ${name} watched value changed:`, {
      value: currentValue,
      type: typeof currentValue
    });
  }, [currentValue, name]);

  const getErrorMessage = (name: string): string | undefined => {
    const error = errors[name];
    return error && typeof error.message === "string"
      ? error.message
      : undefined;
  };

  return (
    <div className="w-full space-y-1">
      <Label htmlFor={name} className="ml-1">
        {label}
      </Label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          // Asegurarse de que field.value sea una cadena o undefined
          const fieldValue = field.value !== null && field.value !== undefined 
            ? String(field.value) 
            : undefined;
            
          // No logear en cada render para evitar ruido
          return (
            <>
              <Select
                value={fieldValue}
                onValueChange={(value) => {
                  // Prevenir valores vacíos
                  if (value && value !== 'all') {
                    
                    // Determinar si debemos convertir a número para mantener el tipo correcto
                    if (typeof field.value === 'number' || !isNaN(Number(value))) {
                      field.onChange(Number(value));
                    } else {
                      field.onChange(value);
                    }
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent className="max-h-40 overflow-auto">
                  <SelectGroup>
                    {options.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <p className="text-sm text-red-500">
                &nbsp;{getErrorMessage(name)}
              </p>
            </>
          );
        }}
      />
    </div>
  );
};

export default RHFSelect;
