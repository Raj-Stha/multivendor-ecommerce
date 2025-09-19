import { generatePageMetadata } from "@/components/page-seo";
import SignUp from "@/components/home/auth/register/form/signup";

export const metadata = {
  ...generatePageMetadata({
    title: `Register | ${process.env.NEXT_PUBLIC_WEBSITE_NAME}`,
    description:
      "Sign up now to explore the best deals on cosmetics, beauty products, and more. Start shopping or selling with ease on our trusted online marketplace.",
    keywords:
      "register, sign up, create account, online shopping, cosmetics store, beauty products, join marketplace, vendor account, customer account",
    image: "/seo/register-banner.jpg",
    url: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/auth/register`,
  }),
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_WEBSITE_URL || "http://localhost:3000"
  ),
};

export default function RegisterPage() {
  return <SignUp />;
}
