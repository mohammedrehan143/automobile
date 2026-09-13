import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Booking, BookingStatus } from "./types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl.startsWith("https://") &&
  supabaseAnonKey.length > 20
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null;

// ============================================================================
// IN-MEMORY / LOCAL STORAGE PERSISTENCE ENGINE (Seamless dev/offline fallback)
// ============================================================================

const SEED_BOOKINGS: Booking[] = [
  {
    id: "seed-bk-101",
    customerName: "Sanjay Verma",
    customerPhone: "9845012345",
    vehicleType: "car",
    vehicleNumber: "KA 03 MZ 4421",
    serviceId: "wheel-alignment",
    serviceName: "WHEEL ALIGNMENT",
    bookingDate: new Date().toISOString().split("T")[0],
    bookingTime: "11:00 AM",
    status: "confirmed",
    notes: "Slight left pulling at 80 km/h on highway.",
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: "seed-bk-102",
    customerName: "Rahul Shetty",
    customerPhone: "9900128841",
    vehicleType: "bike",
    vehicleNumber: "KA 04 ET 9102",
    serviceId: "bike-service",
    serviceName: "BIKE SERVICE & HANDLE ALIGNMENT",
    bookingDate: new Date().toISOString().split("T")[0],
    bookingTime: "02:30 PM",
    status: "pending",
    notes: "Front handle T-stem check after minor slip.",
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: "seed-bk-103",
    customerName: "Farhan Ahmed",
    customerPhone: "9886033412",
    vehicleType: "car",
    vehicleNumber: "KA 51 MD 2033",
    serviceId: "alloy-wheel-repair",
    serviceName: "ALLOY WHEEL REPAIR & TRUING",
    bookingDate: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    bookingTime: "10:30 AM",
    status: "confirmed",
    notes: "Front left rim minor dent, check air leak.",
    createdAt: new Date(Date.now() - 3600000 * 1).toISOString(),
  },
];

declare global {
  // eslint-disable-next-line no-var
  var __memoryBookings: Booking[] | undefined;
}

if (!globalThis.__memoryBookings) {
  globalThis.__memoryBookings = [...SEED_BOOKINGS];
}

const LOCAL_STORAGE_KEY = "indian_auto_bookings_v1";

function getLocalBookings(): Booking[] {
  if (typeof window === "undefined") {
    return globalThis.__memoryBookings || SEED_BOOKINGS;
  }
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!saved) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(globalThis.__memoryBookings || SEED_BOOKINGS));
      return globalThis.__memoryBookings || SEED_BOOKINGS;
    }
    return JSON.parse(saved);
  } catch {
    return globalThis.__memoryBookings || SEED_BOOKINGS;
  }
}

function saveLocalBookings(bookings: Booking[]) {
  globalThis.__memoryBookings = bookings;
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(bookings));
    } catch {
      // ignore storage errors
    }
  }
}

export async function fetchAllBookings(): Promise<Booking[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .order("booking_date", { ascending: false });
      if (!error && data) {
        return data.map((item) => ({
          id: item.id,
          customerName: item.customer_name,
          customerPhone: item.customer_phone,
          vehicleType: item.vehicle_type,
          vehicleNumber: item.vehicle_number,
          serviceId: item.service_id,
          serviceName: item.service_name,
          bookingDate: item.booking_date,
          bookingTime: item.booking_time,
          status: item.status,
          notes: item.notes,
          createdAt: item.created_at,
        }));
      }
    } catch (e) {
      console.warn("Supabase fetch failed, using fallback store", e);
    }
  }
  return getLocalBookings();
}

export async function insertBooking(booking: Omit<Booking, "id" | "createdAt" | "status">): Promise<{ success: boolean; data?: Booking; error?: string }> {
  // Validate availability first
  const existing = await fetchAllBookings();
  const isSlotTaken = existing.some(
    (b) => b.bookingDate === booking.bookingDate && b.bookingTime === booking.bookingTime && b.status !== "cancelled"
  );

  if (isSlotTaken) {
    return {
      success: false,
      error: `The slot ${booking.bookingTime} on ${booking.bookingDate} is already booked. Please choose another time.`,
    };
  }

  const newBooking: Booking = {
    ...booking,
    id: "bk-" + Math.random().toString(36).substr(2, 9),
    status: "confirmed",
    createdAt: new Date().toISOString(),
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("bookings")
        .insert([
          {
            customer_name: newBooking.customerName,
            customer_phone: newBooking.customerPhone,
            vehicle_type: newBooking.vehicleType,
            vehicle_number: newBooking.vehicleNumber,
            service_id: newBooking.serviceId,
            service_name: newBooking.serviceName,
            booking_date: newBooking.bookingDate,
            booking_time: newBooking.bookingTime,
            status: "confirmed",
            notes: newBooking.notes || "",
          },
        ])
        .select()
        .single();

      if (!error && data) {
        return {
          success: true,
          data: {
            id: data.id,
            customerName: data.customer_name,
            customerPhone: data.customer_phone,
            vehicleType: data.vehicle_type,
            vehicleNumber: data.vehicle_number,
            serviceId: data.service_id,
            serviceName: data.service_name,
            bookingDate: data.booking_date,
            bookingTime: data.booking_time,
            status: data.status,
            notes: data.notes,
            createdAt: data.created_at,
          },
        };
      }
    } catch (e) {
      console.warn("Supabase insert failed, saving to local fallback", e);
    }
  }

  // Local fallback save
  const current = getLocalBookings();
  const updated = [newBooking, ...current];
  saveLocalBookings(updated);

  return {
    success: true,
    data: newBooking,
  };
}

export async function updateBookingStatus(id: string, status: BookingStatus): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase
        .from("bookings")
        .update({ status })
        .eq("id", id);
      if (!error) return true;
    } catch {
      // fallback
    }
  }

  const current = getLocalBookings();
  const updated = current.map((b) => (b.id === id ? { ...b, status } : b));
  saveLocalBookings(updated);
  return true;
}
