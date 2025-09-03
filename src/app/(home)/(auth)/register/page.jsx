// import { generatePageMetadata } from "@/components/Seo";
import SignUp from "@/components/home/(auth)/register/form/SignUp";

// export const metadata = {
//   ...generatePageMetadata({
//     title: `Register | ${process.env.NEXT_PUBLIC_WEBSITE_NAME}`,
//     description:
//       "Create your account to start shopping or selling. Join our platform and enjoy a seamless online marketplace experience.",
//     keywords:
//       "register, sign up, create account, customer register, vendor register, join marketplace",
//     image: "/seo/register-banner.jpg",
//     url: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/auth/register`,
//   }),
//   metadataBase: new URL(
//     process.env.NEXT_PUBLIC_WEBSITE_URL || "http://localhost:3000"
//   ),
// };

export default function RegisterPage() {
  return <SignUp />;
}
