import Header from "@/components/Header/Header";
import { TopBar } from "@/components/Header/top-bar";
import MobileBottomNav from "@/components/Header/mobile-bottom-nav";
import Footer from "@/components/Footer";

export default function HomeLayout({ children }) {
  return (
    <>
      {/* Fixed TopBar + Header Wrapper */}
      <div className="fixed top-0 left-0 w-full z-50">
        <TopBar />
        <Header />
      </div>

      {/* Push content below fixed header */}
      <main className="min-h-screen pt-[56px]  md:pt-[78px] lg:pt-[96px] ">{children}</main>

      <MobileBottomNav />
      <Footer />
    </>
  );
}
