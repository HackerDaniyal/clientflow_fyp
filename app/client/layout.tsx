import { PortalLayout } from "@/components/layout/PortalLayout";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PortalLayout role="client">{children}</PortalLayout>;
}
