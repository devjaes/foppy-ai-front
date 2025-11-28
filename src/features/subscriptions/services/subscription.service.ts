import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export const createSubscription = async (userId: number, planId: number, frequency: string) => {
  const response = await axios.post(`${API_URL}/subscriptions`, {
    userId,
    planId,
    frequency,
  });
  return response.data;
};

export const getSubscription = async (userId: number) => {
  const response = await axios.get(`${API_URL}/users/${userId}/subscription`);
  return response.data;
};
