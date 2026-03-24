import { useState, useCallback } from "react";
import { createBooking, CreateBookingPayload } from "../services/bookings";

export const useCreateBooking = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const create = useCallback(async (payload: CreateBookingPayload) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await createBooking(payload);
      setSuccess(true);
      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create booking";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setError(null);
    setSuccess(false);
    setLoading(false);
  }, []);

  return { create, loading, error, success, reset };
};
