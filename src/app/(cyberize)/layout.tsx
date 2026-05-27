import { AppRole } from "@/utils/get-user-role";
import { protectPage } from "@/utils/supabase/actions";

export default async function CyberizeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Any authenticated role can access the cyberize app surface.
  // Nested mission-control layout will add an admin-only inner gate in Phase 6.
  await protectPage([AppRole.MEMBER, AppRole.ADMIN, AppRole.SUPERADMIN]);

  return <>{children}</>;
}
