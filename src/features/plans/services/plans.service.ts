import axios from "axios";
import { Plan } from "../types/plan";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export const getPlans = async (): Promise<Plan[]> => {
  const response = await axios.get<{ success: boolean; data: Plan[] }>(`${API_URL}/plans`);
  
  return response.data.data
};
