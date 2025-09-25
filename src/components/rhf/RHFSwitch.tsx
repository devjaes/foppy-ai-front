import { useFormContext, Controller } from "react-hook-form";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";

interface RHFSwitchProps {
  name: string;
  label?: string;
  disabled?: boolean;
  helperText?: string;
}

const RHFSwitch: React.FC<RHFSwitchProps> = ({
  name,
  label,
  disabled = false,
  helperText,
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const getErrorMessage = (name: string): string | undefined => {
    const error = errors[name];
    return error && typeof error.message === "string"
      ? error.message
      : undefined;
  };

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center gap-2">
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <Switch
              id={name}
              checked={field.value || false}
              onCheckedChange={field.onChange}
              disabled={disabled}
            />
          )}
        />
        {label && (
          <Label htmlFor={name} className="cursor-pointer">
            {label}
          </Label>
        )}
      </div>

      {helperText && (
        <p className="text-sm text-muted-foreground ml-1">{helperText}</p>
      )}

      <p className="text-sm text-red-500">&nbsp;{getErrorMessage(name)}</p>
    </div>
  );
};

export default RHFSwitch;
