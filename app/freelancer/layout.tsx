import { PortalLayout } from "@/components/layout/PortalLayout";

export default function FreelancerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PortalLayout role="freelancer">{children}</PortalLayout>;
}
