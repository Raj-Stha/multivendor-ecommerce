import type { Metadata } from "next"

interface PageSEOProps {
  title: string
  description: string
  keywords?: string
  image?: string
  url?: string
}

export function generatePageMetadata({
  title,
  description,
  keywords,
  image = "/og-logo.png",
  url = "http://localhost:3000",
}: PageSEOProps): Metadata {
  return {
    title: title,
    description: description,
    keywords: keywords,
    openGraph: {
      title: title,
      description: description,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      url: url,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: [image],
    },
  }
}
