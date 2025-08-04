import DesktopNav from "./_components/DesktopNav";
import CategorySlider from "./_components/CategorySlider"; // Commented out in original
import MobileNav from "./_components/MobileNav";

export default function Header() {
  return (
    <div className="nunito-text">
      {/* Desktop Sticky Nav */}
      <div className="hidden lg:block sticky top-0 z-48 color-gray shadow-md ">
        <DesktopNav />
        <CategorySlider />
      </div>
      {/* Mobile Sticky Nav */}
      <div className="block lg:hidden sticky top-0 z-48 bg-white shadow-md">
        <MobileNav />
      </div>
    </div>
  );
}
