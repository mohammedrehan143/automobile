import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Worker Terminal | Indian Two & Four Wheeler Alignment",
  robots: {
    index: false,
    follow: false,
  },
};

export default function WorkerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
