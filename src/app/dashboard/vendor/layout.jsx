// import { cookies } from "next/headers";
import { VendorSidebar } from "../../../components/vendor/base/vendor-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

export default function AdminLayout({ children }) {
  // const cookieStore = cookies();
  // const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    // <SidebarProvider defaultOpen={defaultOpen}>
    <SidebarProvider>
      <VendorSidebar />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
