import { Helmet } from "react-helmet-async";

export default function P2PFileSharing() {
  return (
    <div className="min-h-screen w-screen mx-auto bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <Helmet>
        <title>
          Secure P2P File Sharing | Encrypted Peer-to-Peer File Transfer
        </title>
        <meta
          name="description"
          content="Share files securely and instantly with peer-to-peer (P2P) file sharing. Fast, private, encrypted file transfers without size limits. Send large files online directly between devices."
        />
        <meta
          name="keywords"
          content="P2P file sharing, peer to peer file transfer, send large files online, secure file sharing, encrypted file transfer, free file sharing, WebRTC file sharing, no size limit file transfer, private file transfer, instant file sharing"
        />
        <link rel="canonical" href="https://yourdomain.com/p2p-file-sharing" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: "Is P2P file sharing secure?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes. With end-to-end encryption and WebRTC, no one can intercept your files.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Can I send large files?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Absolutely! No file size limits — send gigabyte-sized videos and documents easily.",
                  },
                },
                {
                  "@type": "Question",
                  name: "How fast is it?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Peer-to-peer file sharing is typically faster than cloud uploads as it connects devices directly.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Do I need an account?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "No registration is required. Start sharing files instantly.",
                  },
                },
              ],
            }),
          }}
        />
      </Helmet>

      <main className="max-w-5xl mx-auto px-6 py-12 space-y-16">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="bg-ffd500/10 p-3 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-ffd500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                />
              </svg>
            </div>
          </div>
          <h1 className="text-4xl font-extrabold text-ffd500 md:text-6xl">
            Secure P2P File Sharing — Fast, Encrypted & Unlimited 🚀
          </h1>
          <p className="mt-6 text-lg text-slate-300 md:text-xl max-w-3xl mx-auto">
            Experience{" "}
            <strong className="text-ffd500">
              instant, private, and unlimited peer-to-peer file transfers
            </strong>
            . Share files online directly between devices with{" "}
            <strong className="text-ffd500">end-to-end encryption</strong> — no
            servers, no restrictions, just pure speed and security.
          </p>
        </section>

        {/* Benefits Section */}
        <section className="mb-20">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-blue-500/20 p-2 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-blue-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m7 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-ffd500">
              Why Choose Peer-to-Peer File Sharing?
            </h2>
          </div>

          <ul className="grid gap-6 md:grid-cols-2">
            {[
              {
                icon: "📂",
                title: "No File Size Limits",
                description:
                  "Send gigabytes instantly without compression or restrictions.",
              },
              {
                icon: "🔒",
                title: "End-to-End Encryption",
                description:
                  "Only sender and receiver can access your files — no third parties.",
              },
              {
                icon: "⚡",
                title: "Blazing Fast Transfers",
                description:
                  "Direct device-to-device sharing is much faster than cloud uploads.",
              },
              {
                icon: "🔄",
                title: "100% Peer-to-Peer",
                description:
                  "No middleman — powered by WebRTC for secure direct transfers.",
              },
            ].map((benefit, index) => (
              <li
                key={index}
                className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700 hover:border-ffd500/30 transition-colors"
              >
                <h3 className="text-xl font-semibold mb-2 text-ffd500">
                  {benefit.icon} {benefit.title}
                </h3>
                <p className="text-slate-300">{benefit.description}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* SEO Content Section */}
        <section className="mb-20">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-green-500/20 p-2 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-green-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-ffd500">
              What is Peer-to-Peer File Sharing?
            </h2>
          </div>

          <div className="prose prose-invert max-w-none text-slate-300">
            <p className="mb-4 text-lg leading-relaxed">
              Peer-to-peer (P2P) file sharing allows you to transfer files
              directly between devices without relying on centralized servers.
              This ensures faster transfers, maximum privacy, and no storage
              costs. Unlike cloud-based services,{" "}
              <strong className="text-ffd500">
                peer-to-peer file transfer
              </strong>{" "}
              keeps your data safe and efficient.
            </p>
            <p className="mb-4 text-lg leading-relaxed">
              Our platform uses{" "}
              <strong className="text-ffd500">WebRTC technology</strong> with
              <strong className="text-ffd500"> end-to-end encryption</strong>,
              ensuring your files are private, encrypted, and secure from
              interception.
            </p>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-20">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-purple-500/20 p-2 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-purple-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-ffd500">
              Frequently Asked Questions (P2P File Sharing)
            </h2>
          </div>

          <div className="space-y-6">
            {[
              {
                question: "🔐 Is P2P file sharing secure?",
                answer:
                  "Yes. With end-to-end encryption and WebRTC, no one can intercept your files.",
              },
              {
                question: "📂 Can I send large files?",
                answer:
                  "Absolutely! No file size limits — send even gigabyte-sized HD videos and documents.",
              },
              {
                question: "🚀 How fast is it?",
                answer:
                  "Speed depends on your internet connection, but P2P transfers are typically faster than cloud uploads.",
              },
              {
                question: "🌍 Do I need to create an account?",
                answer:
                  "No registration required. Start sharing instantly without sign-ups or logins.",
              },
            ].map((faq, index) => (
              <div
                key={index}
                className="bg-slate-800/30 p-5 rounded-xl border border-slate-700"
              >
                <h3 className="font-semibold text-lg text-ffd500 mb-2">
                  {faq.question}
                </h3>
                <p className="text-slate-300">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center py-10 border-t border-slate-700">
          <h2 className="text-2xl font-bold text-ffd500 mb-4">
            Ready to try secure peer-to-peer file sharing?
          </h2>
          <button className="bg-ffd500 hover:bg-yellow-400 text-slate-900 font-bold py-3 px-8 rounded-lg transition-colors">
            Start Secure File Transfer Now
          </button>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-700 py-8 mt-12">
        <div className="max-w-6xl mx-auto px-6 text-center text-slate-400">
          <p>© 2025 Secure P2P File Sharing. All rights reserved.</p>
        </div>
      </footer>

      {/* JSON-LD Schema for FAQ */}
    </div>
  );
}
