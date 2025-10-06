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
    <div className="bg-blue-50 py-10 px-4 sm:px-6 md:px-8 lg:px-12 my-4">
      <div className="container max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-4 md:gap-x-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center px-2 sm:px-4"
            >
              <div
                className={`flex items-center justify-center 
                  w-12 h-12 sm:w-16 sm:h-16 
                  rounded-full bg-gradient-to-br ${feature.gradient} 
                  mb-3 sm:mb-4`}
              >
                <feature.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className="text-xs sm:text-sm font-semibold text-primary leading-tight px-2 nunito-text">
                {feature.title}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
