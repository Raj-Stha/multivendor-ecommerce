import Header from "@/components/Header/Header";
import { TopBar } from "@/components/Header/top-bar";
import MobileBottomNav from "@/components/Header/mobile-bottom-nav";
import Footer from "@/components/Footer";
import { InfoLinks } from "./_components/info-links";

export default function HomeLayout({ children }) {
  return (
    <>
      {/* Fixed TopBar + Header Wrapper */}
      <div className="fixed top-0 left-0 w-full z-50">
        <Header />
      </div>

      {/* Push content below fixed header */}
      <main className="min-h-screen pt-[56px]  md:pt-[50px] lg:pt-[70px] ">
        {children}
      </main>
      {/* <InfoLinks /> */}
      <MobileBottomNav />
      <Footer />
    </>
  );
}
