import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  url?: string;
  image?: string;
  type?: "website" | "article"; // add blog/article support
  publishedTime?: string; // for blog posts
  modifiedTime?: string; // for blog posts
  authorName?: string;
}

const SEO = ({
  title = "ShipFilez - Free & Secure File Sharing Online",
  description = "ShipFilez lets you send and receive large files instantly online. No signup, no storage — just secure, fast, and free peer-to-peer file sharing.",
  keywords = "shipfilez, file sharing, free file transfer, secure file sharing, send files online, large file sharing, peer to peer file transfer, no signup file sharing, online file sharing service, share files instantly",
  url = "https://www.shipfilez.app/",
  image = "https://www.shipfilez.app/preview.png",
  type = "website",
  publishedTime,
  modifiedTime,
  authorName = "ShipFilez Team",
}: SEOProps) => {
  // Organization Schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "ShipFilez",
    url,
    logo: image,
    sameAs: [
      "https://twitter.com/shipfilez",
      "https://www.linkedin.com/company/shipfilez",
    ],
  };

  // FAQ Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Is ShipFilez free to use?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes! ShipFilez is completely free to use for sending and receiving files without signup or storage costs.",
        },
      },
      {
        "@type": "Question",
        name: "Do you store my files?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. ShipFilez uses peer-to-peer connections, meaning your files are never stored on our servers.",
        },
      },
      {
        "@type": "Question",
        name: "Is my data encrypted?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Absolutely. ShipFilez transfers are protected with DTLS end-to-end encryption.",
        },
      },
      {
        "@type": "Question",
        name: "Are there file size limits?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No size limits! You can send large videos, documents, or any files without restrictions.",
        },
      },
    ],
  };

  // BlogPost Schema (only if type = article)
  const blogPostingSchema =
    type === "article"
      ? {
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: title,
          description,
          image,
          author: {
            "@type": "Person",
            name: authorName,
          },
          publisher: {
            "@type": "Organization",
            name: "ShipFilez",
            logo: {
              "@type": "ImageObject",
              url: image,
            },
          },
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": url,
          },
          datePublished: publishedTime,
          dateModified: modifiedTime || publishedTime,
        }
      : null;

  return (
    <Helmet>
      {/* Basic SEO */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Canonical */}
      <link rel="canonical" href={url} />

      {/* JSON-LD Schemas */}
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
      <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      {blogPostingSchema && (
        <script type="application/ld+json">
          {JSON.stringify(blogPostingSchema)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
