import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Workshop Portal Login | Indian Two & Four Wheeler Alignment",
  robots: {
    index: false,
    follow: false,
  },
};

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
