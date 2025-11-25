export interface Plan {
  id: number;
  name: string;
  description: string | null;
  price: string;
  frequency: string;
  features: string[];
}
