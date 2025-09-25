import { format } from "date-fns";
import { es } from "date-fns/locale";

export const formatDate = (
  date?: Date | number | string,
  formatStr: string = "dd/MM/yyyy"
): string => {
  if (!date) return "";
  try {
    return format(date, formatStr, { locale: es });
  } catch (error) {
    console.error(error);
    return "";
  }
};
