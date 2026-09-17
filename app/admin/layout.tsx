import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Portal | Indian Two & Four Wheeler Alignment",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
