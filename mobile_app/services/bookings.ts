import { apiRequest } from "./api";

export interface CreateBookingPayload {
  artistProfileId?: string;
  serviceId: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  totalAmount: number;
  status?: string;
}

export const createBooking = async ({
  artistProfileId,
  serviceId,
  bookingDate,
  startTime,
  endTime,
  totalAmount,
  status = "pending",
}: CreateBookingPayload) => {
  const payload = {
    booking: {
      artist_profile_id: artistProfileId,
      service_id: serviceId,
      booking_date: bookingDate,
      start_time: startTime,
      end_time: endTime,
      total_amount: totalAmount,
      status,
    },
  };

  console.log("createBooking payload:", JSON.stringify(payload, null, 2));

  return apiRequest("/bookings", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};