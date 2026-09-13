import { TimeSlot, Booking } from "./types";
import { fetchAllBookings } from "./supabase";
import { BUSINESS_INFO } from "./data";

export const DEFAULT_SLOTS = [
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "02:00 PM",
  "02:30 PM",
  "03:00 PM",
  "03:30 PM",
  "04:00 PM",
  "04:30 PM",
  "05:00 PM",
  "05:30 PM",
  "06:00 PM",
  "06:30 PM",
  "07:00 PM",
];

export function validateIndianPhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s\-+]/g, "");
  // Accept 10-digit starting with 6-9, or 12-digit with 91 prefix
  if (cleaned.length === 10 && /^[6-9]\d{9}$/.test(cleaned)) {
    return true;
  }
  if (cleaned.length === 12 && cleaned.startsWith("91") && /^[6-9]\d{9}$/.test(cleaned.slice(2))) {
    return true;
  }
  return false;
}

export function validateVehicleNumber(vehNo: string): boolean {
  if (!vehNo) return false;
  const cleaned = vehNo.replace(/[\s\-]/g, "").toUpperCase();
  // Standard Indian vehicle registration format: 2 letters state + 2 digits district + optional 1-2 letters series + 4 digits number
  // E.g. KA03MZ4421 or KA04E1234 or KA011234
  const regex = /^[A-Z]{2}[0-9]{1,2}[A-Z]{0,3}[0-9]{4}$/;
  return regex.test(cleaned) || cleaned.length >= 6;
}

export function formatVehicleNumber(vehNo: string): string {
  const cleaned = vehNo.replace(/[\s\-]/g, "").toUpperCase();
  if (cleaned.length >= 8) {
    const state = cleaned.slice(0, 2);
    const district = cleaned.slice(2, 4);
    const rest = cleaned.slice(4);
    return `${state} ${district} ${rest}`;
  }
  return vehNo.toUpperCase();
}

export async function getAvailableSlots(dateString: string): Promise<TimeSlot[]> {
  const allBookings = await fetchAllBookings();
  const bookedSlots = new Set(
    allBookings
      .filter((b) => b.bookingDate === dateString && b.status !== "cancelled")
      .map((b) => b.bookingTime)
  );

  return DEFAULT_SLOTS.map((time) => ({
    time,
    available: !bookedSlots.has(time),
    reason: bookedSlots.has(time) ? "Slot already booked" : undefined,
  }));
}

export function generateWhatsAppConfirmationUrl(booking: Booking): string {
  const message = `Hello *Indian Two and Four Wheeler Alignment and Repair*,
I would like to confirm my workshop appointment:

*Booking ID:* ${booking.id}
*Vehicle:* ${booking.vehicleType.toUpperCase()} (${booking.vehicleNumber})
*Service:* ${booking.serviceName}
*Date:* ${booking.bookingDate}
*Time:* ${booking.bookingTime}
*Customer:* ${booking.customerName} (${booking.customerPhone})

Location: 60/1, Nehru Road, Opp. NKGSB Bank, Kammanahalli, Bengaluru.
Looking forward to the precision inspection. Thank you!`;

  return `${BUSINESS_INFO.whatsappUrl}?text=${encodeURIComponent(message)}`;
}

export function generateCalendarUrl(booking: Booking): string {
  const title = encodeURIComponent(`${booking.serviceName} - Indian Wheel Alignment Kammanahalli`);
  const details = encodeURIComponent(
    `Appointment for ${booking.vehicleType.toUpperCase()} (${booking.vehicleNumber}) with Indian Two and Four Wheeler Alignment and Repair.\nPhone: 093438 42301\nLocation: 60/1, Nehru Road, Opp. NKGSB Bank, Kammanahalli, Bengaluru 560084`
  );
  const location = encodeURIComponent(BUSINESS_INFO.location);

  // Parse time and date
  const [year, month, day] = booking.bookingDate.split("-").map(Number);
  const timeParts = booking.bookingTime.replace(/[^\d:]/g, "").split(":").map(Number);
  let hours = timeParts[0];
  const mins = timeParts[1];
  const isPM = booking.bookingTime.includes("PM");
  if (isPM && hours !== 12) hours += 12;
  if (!isPM && hours === 12) hours = 0;

  const startDate = new Date(year, month - 1, day, hours, mins);
  const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 1 hour duration

  const formatIso = (d: Date) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const dates = `${formatIso(startDate)}/${formatIso(endDate)}`;

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${dates}`;
}
