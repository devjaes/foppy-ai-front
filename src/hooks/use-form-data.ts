import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface FormData {
  user_id?: number;
  amount?: number;
  type?: "EXPENSE" | "INCOME" | "CONTRIBUTION";
  category?: string;
  description?: string;
  payment_method_id?: number;
  goal_id?: number;
  name?: string;
  target_amount?: number;
  current_amount?: number;
  contribution_frecuency?: number;
  contribution_amount?: number;
  end_date?: string;
  category_id?: number;
  limit_amount?: number;
  month?: string;
}

export function useFormData() {
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState<FormData | null>(null);

  useEffect(() => {
    const dataParam = searchParams.get('data');
    if (dataParam) {
      try {
        const parsedData = JSON.parse(decodeURIComponent(dataParam));
        setFormData(parsedData);
      } catch (error) {
        console.error('Error parsing form data:', error);
      }
    }
  }, [searchParams]);

  return formData;
} 