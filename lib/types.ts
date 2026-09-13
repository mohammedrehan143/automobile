export type VehicleType = "car" | "bike";

export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";

export interface ServiceItem {
  id: string;
  slug: string;
  number: string;
  title: string;
  category: "alignment" | "suspension" | "repair" | "welding" | "maintenance";
  vehicleType: "car" | "bike" | "both";
  shortDesc: string;
  fullDesc: string;
  durationMinutes: number;
  highlight: string;
  specs: string[];
  image: string;
}

export interface Booking {
  id: string;
  customerName: string;
  customerPhone: string;
  vehicleType: VehicleType;
  vehicleNumber: string;
  serviceId: string;
  serviceName: string;
  bookingDate: string; // YYYY-MM-DD
  bookingTime: string; // e.g. "10:30 AM"
  status: BookingStatus;
  notes?: string;
  createdAt: string;
}

export interface TimeSlot {
  time: string;
  available: boolean;
  reason?: string;
}

export interface BusinessDayHours {
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, ...
  dayName: string;
  openTime: string;
  closeTime: string;
  isClosed: boolean;
}

export interface CustomerReview {
  id: string;
  author: string;
  rating: number;
  date: string;
  vehicleType: VehicleType | "both";
  reviewText: string;
  serviceMentioned: string;
  source: "Google Reviews";
}

export interface GalleryImage {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  tag: string;
}

export interface WorkshopMetrics {
  googleRating: number;
  reviewCount: number;
  yearsExperience: number;
  alignedVehicles: string;
}
