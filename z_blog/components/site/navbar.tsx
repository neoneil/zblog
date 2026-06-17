import { getCurrentUserWithRole } from "@/lib/auth/current-user";
import NavbarClient from "./navbar-client";

export default async function Navbar() {
  const { user, canManagePosts } = await getCurrentUserWithRole();

  return <NavbarClient user={user} canManagePosts={canManagePosts} />;
}
