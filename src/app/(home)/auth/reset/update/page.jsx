import { generatePageMetadata } from "@/components/page-seo";
import { Suspense } from "react";
import UpdateForm from "@/components/home/auth/reset/update/form/details";

export const metadata = {
  ...generatePageMetadata({
    title: `Login | ${process.env.NEXT_PUBLIC_WEBSITE_NAME}`,
    description:
      "Access your account on our platform. Login to manage your orders, wishlist, and shop seamlessly.",
    keywords:
      "login, user login, sign in, account access, customer login, vendor login",
    image: "/seo/login-banner.jpg",
    url: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/login`,
  }),
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_WEBSITE_URL || "http://localhost:3000"
  ),
};

export default function Reset() {
  return (
    <Suspense fallback={<div></div>}>
      <UpdateForm />
    </Suspense>
  );
}
