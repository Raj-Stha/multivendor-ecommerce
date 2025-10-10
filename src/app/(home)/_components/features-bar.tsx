import { Truck, CreditCard, RefreshCcw, Award } from "lucide-react";

export function FeaturesBar() {
  const features = [
    {
      icon: Truck,
      title: "Fast Delivery all across the country",
      gradient: "from-blue-400 to-blue-600",
    },
    {
      icon: CreditCard,
      title: "Safe & Secure Payments",
      gradient: "from-green-400 to-green-600",
    },
    {
      icon: RefreshCcw,
      title: "7-Day Return Policy",
      gradient: "from-yellow-400 to-yellow-600",
    },
    {
      icon: Award,
      title: "100% Authentic Products",
      gradient: "from-pink-400 to-pink-600",
    },
  ];
  return (
    <div className="max-w-7xl container mx-auto  py-15  px-4 ">
      <div className=" ">
        <div className="grid grid-cols-2 md:grid-cols-4   gap-5 ">
          {features.map((feature, index) => (
            <div
              key={index}
              className="relative flex flex-col items-center group cursor-pointer 
             rounded-sm overflow-hidden py-10 px-3 shadow-sm  text-center  bg-gradient-to-b from-primary/10  to-transparent
             transition-all duration-300 hover:shadow-xl hover:scale-105"
            >
              {/* Hover Background Fill */}
              <span
                className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent 
                         translate-y-full overflow-hidden group-hover:translate-y-0 transition-transform 
                         duration-500 ease-in-out"
              />

              {/* Feature Icon Circle */}
              <div
                className={`relative z-10 flex items-center  justify-center
                         w-12 h-12 sm:w-16 sm:h-16
                         rounded-full bg-gradient-to-br ${feature.gradient} 
                         mb-3 sm:mb-4 shadow-md`}
              >
                <feature.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>

              {/* Feature Title */}
              <h3 className="relative z-10 text-xs sm:text-sm font-semibold text-primary leading-tight px-2 nunito-text">
                {feature.title}
              </h3>

              {/* Bottom Accent Bar */}
              <span
                className="absolute bottom-0 left-0 h-1 w-0 bg-primary 
                         group-hover:w-full transition-all duration-500"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
