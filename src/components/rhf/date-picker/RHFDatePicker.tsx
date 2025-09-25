import { useFormContext, Controller } from "react-hook-form";

import { Label } from "@/components/ui/label";
import DatePicker from "./DatePicker";

interface RHFDatePickerProps {
  name: string;
  label: string;
  minDate?: Date;
}

const RHFDatePicker: React.FC<RHFDatePickerProps> = ({
  name,
  label,
  minDate,
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="w-full">
      <Label htmlFor={name} className="mb-1 ml-1 ">
        {label}
      </Label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          return (
            <DatePicker
              name={name}
              minDate={minDate}
              onChange={field.onChange}
              errors={errors}
              value={field.value}
            />
          );
        }}
      />
    </div>
  );
};

export default RHFDatePicker;
