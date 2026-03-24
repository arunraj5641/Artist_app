import { useState, useEffect } from "react";
import { UserProfile, getProfile } from "../services/profile";

export const useProfile = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const data = await getProfile();
        setUser(data);
        setError(null);
      } catch (err) {
        console.error("Failed to load profile", err);
        setError("Unable to load profile.");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, loading, error };
};
