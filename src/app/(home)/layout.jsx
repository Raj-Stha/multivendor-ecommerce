import Header from "@/components/Header/Header";
import { TopBar } from "@/components/Header/top-bar";
import MobileBottomNav from "@/components/Header/mobile-bottom-nav";

export default function HomeLayout({ children }) {
  return (
    <div>
      <TopBar />
      <Header />
      {children}
      <MobileBottomNav />
    </div>
  );
}
