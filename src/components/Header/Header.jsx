// Header.jsx - SIMPLIFIED VERSION
import DesktopNav from "./_components/DesktopNav";
import MobileNav from "./_components/MobileNav";

export default function Header() {
  return (
    <>
      {/* Desktop Sticky Nav */}
      <div className="hidden lg:block">
        <DesktopNav />
      </div>
      {/* Mobile Sticky Nav */}
      <div className="block lg:hidden">
        <MobileNav />
      </div>
    </>
  );
}
