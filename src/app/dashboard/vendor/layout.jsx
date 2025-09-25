import { VendorSidebar } from "../../../components/vendor/base/vendor-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

export default function AdminLayout({ children }) {
  return (
    <SidebarProvider>
      <VendorSidebar />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
