"use client";

// import { generatePageMetadata } from "@/components/page-seo";
import LoginForm from "@/components/home/auth/login/form/login";

// export const metadata = {
//   ...generatePageMetadata({
//     title: `Login | ${process.env.NEXT_PUBLIC_WEBSITE_NAME}`,
//     description:
//       "Access your account on our platform. Login to manage your orders, wishlist, and shop seamlessly.",
//     keywords:
//       "login, user login, sign in, account access, customer login, vendor login",
//     image: "/seo/login-banner.jpg",
//     url: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/login`,
//   }),
//   metadataBase: new URL(
//     process.env.NEXT_PUBLIC_WEBSITE_URL || "http://localhost:3000"
//   ),
// };

export default function LoginPage() {
  return <LoginForm />;
}
