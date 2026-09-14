export type VehicleType = "car" | "bike";

export type JobStatus = "pending" | "in_progress" | "completed" | "delivered";

export type PaymentStatus = "paid" | "pending" | "partial";

export type PaymentMode = "cash" | "upi" | "card";

export interface WorkshopJob {
  id: string;
  jobId: string; // e.g. "JOB-26-1045"
  customerName?: string;
  customerPhone?: string;
  vehicleType: VehicleType;
  vehicleBrand: string; // e.g. "Hyundai", "Royal Enfield"
  vehicleModel?: string; // e.g. "Creta", "Classic 350"
  vehicleNumber?: string; // e.g. "KA 03 MZ 4421"
  branch: string; // e.g. "Kammanahalli Main (Nehru Rd)"
  servicesDone: string[]; // e.g. ["TIG Welding", "Rim Bend Removal"]
  totalAmount: number; // e.g. 3500
  paymentStatus?: PaymentStatus;
  paymentMode?: PaymentMode;
  status: JobStatus;
  workerNotes?: string;
  workerName?: string;
  date: string; // YYYY-MM-DD
  createdAt: string; // ISO 8601
}

export interface CompanyVehicleGroup {
  vehicleBrand: string;
  vehicleType: VehicleType;
  totalJobsCount: number;
  totalBrandRevenue: number;
  latestWorkTimestamp: string;
  jobs: WorkshopJob[];
}

export interface BranchLocation {
  id: string;
  name: string;
  shortName: string;
  area: string;
  isMain: boolean;
}

export interface ServicePreset {
  id: string;
  label: string;
  category: "welding" | "rim" | "tyre" | "alignment" | "suspension" | "mechanical" | "service";
  vehicleType: "car" | "bike" | "both";
  defaultPrice?: number;
  popular?: boolean;
}

export interface BrandSuggestion {
  name: string;
  type: VehicleType;
  popularModels: string[];
}

export type TimeFilterPeriod = "day" | "month" | "year" | "all";

export interface WorkshopStats {
  period: TimeFilterPeriod;
  totalCustomers: number;
  totalCars: number;
  totalBikes: number;
  totalRevenue: number;
  completedJobs: number;
  pendingJobs: number;
  inProgressJobs: number;
  averageTicketSize: number;
  branchBreakdown: {
    branch: string;
    totalJobs: number;
    cars: number;
    bikes: number;
    revenue: number;
  }[];
  serviceBreakdown: {
    service: string;
    count: number;
    totalAmount: number;
  }[];
  chartSeries: {
    label: string;
    cars: number;
    bikes: number;
    revenue: number;
    date: string;
  }[];
  companyGroups?: CompanyVehicleGroup[];
}
