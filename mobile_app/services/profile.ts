import { apiRequest } from "./api";

export interface UserProfile {
  id: number;
  email: string;
  name: string;
  role: string;
  phone?: string;
  address?: string;
  status: string;
  loyalty_status?: string;
  preferences?: string;
}

export const getProfile = async (): Promise<UserProfile> => {
  const data = await apiRequest("/profile");

  if (!data?.data?.user) {
    throw new Error("Invalid API response: user data missing");
  }

  return data.data.user;
};
