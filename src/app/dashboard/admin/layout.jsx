// import { cookies } from "next/headers";
import { AdminSidebar } from "../../../components/admin/base/AdminSideBar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

export default function AdminLayout({ children }) {
  // const cookieStore = cookies();
  // const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    // <SidebarProvider defaultOpen={defaultOpen}>
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
