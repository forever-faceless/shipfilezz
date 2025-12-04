import SEO from "@/components/SEO";

const About = () => {
  return (
    <>
      <SEO
        title="About ShipFilez | Secure & Unlimited File Sharing"
        description="Discover what makes ShipFilez different — peer-to-peer, no size limits, and fully encrypted file sharing."
        url="https://www.shipfilez.app/about"
      />

      <div className="relative min-h-screen w-full bg-white bg-cover bg-center bg-no-repeat px-4 pt-36 py-12 text-white sm:px-6 md:px-8 lg:px-12">
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-purple-600/10"></div>

        <div className="relative mx-auto max-w-4xl">
          {/* Header Section */}
          <div className="mb-16 text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl bg-clip-text text-transparent bg-[#0263eb]">
              About ShareFilez
            </h1>
          </div>

          {/* Introduction Section */}
          <section className="mb-16 transition-all duration-300 hover:scale-[1.01]">
            <p className="text-lg leading-relaxed text-slate-800 sm:text-xl">
              ShipFilez is a next-generation{" "}
              <span className="font-semibold text-blue-700">
                secure peer-to-peer file sharing platform
              </span>{" "}
              that makes sending and receiving files simple, fast, and private.
              Unlike traditional cloud-based services, ShipFilez never stores
              your files on a server — ensuring{" "}
              <span className="font-semibold text-blue-700">
                complete privacy and control over your data
              </span>
              .
            </p>
          </section>

          {/* Unique Features Section */}
          <section className="mb-16">
            <h2 className="mb-8 text-2xl font-semibold sm:text-3xl md:text-4xl flex items-center text-slate-800">
              <span className="mr-3 text-blue-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </span>
              What Makes ShipFilez Different?
            </h2>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-xl bg-white/80 p-6 backdrop-blur-sm transition-all duration-300 hover:bg-white/90 hover:shadow-lg">
                <div className="mb-4 flex items-center">
                  <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/20">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800">
                    True Peer-to-Peer Connection
                  </h3>
                </div>
                <p className="text-slate-700">
                  Data is transferred directly between devices with zero storage
                  on external servers.
                </p>
              </div>

              <div className="rounded-xl bg-white/80 p-6 backdrop-blur-sm transition-all duration-300 hover:bg-white/90 hover:shadow-lg">
                <div className="mb-4 flex items-center">
                  <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-purple-500/20">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-purple-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800">
                    No Size Limits
                  </h3>
                </div>
                <p className="text-slate-700">
                  Send small documents or massive videos without worrying about
                  restrictions.
                </p>
              </div>

              <div className="rounded-xl bg-white/80 p-6 backdrop-blur-sm transition-all duration-300 hover:bg-white/90 hover:shadow-lg">
                <div className="mb-4 flex items-center">
                  <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-green-500/20">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800">
                    End-to-End Encryption
                  </h3>
                </div>
                <p className="text-slate-700">
                  Built on{" "}
                  <span className="font-medium text-green-700">
                    DTLS (Datagram Transport Layer Security)
                  </span>{" "}
                  for complete protection during transfer.
                </p>
              </div>

              <div className="rounded-xl bg-white/80 p-6 backdrop-blur-sm transition-all duration-300 hover:bg-white/90 hover:shadow-lg">
                <div className="mb-4 flex items-center">
                  <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-yellow-500/20">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-yellow-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800">
                    Blazing-Fast Transfers
                  </h3>
                </div>
                <p className="text-slate-700">
                  Optimized for speed and reliability worldwide.
                </p>
              </div>

              <div className="rounded-xl bg-white/80 p-6 backdrop-blur-sm transition-all duration-300 hover:bg-white/90 hover:shadow-lg md:col-span-2">
                <div className="mb-4 flex items-center">
                  <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500/20">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-cyan-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800">
                    No Signup Needed
                  </h3>
                </div>
                <p className="text-slate-700">
                  Start sharing instantly with zero setup or accounts.
                </p>
              </div>
            </div>
          </section>

          {/* Mission Section */}
          <section className="mb-16">
            <h2 className="mb-8 text-2xl font-semibold sm:text-3xl md:text-4xl flex items-center text-slate-800">
              <span className="mr-3 text-purple-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </span>
              Our Mission
            </h2>

            <p className="mb-8 text-lg leading-relaxed text-slate-800 sm:text-xl">
              At ShipFilez, our mission is to create a{" "}
              <span className="font-semibold text-purple-700">
                privacy-first file sharing experience
              </span>{" "}
              that empowers users to send and receive data without limits or
              compromises. We believe file transfer should be:
            </p>

            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-xl border border-slate-300/50 p-6 text-center transition-all duration-300 hover:border-blue-500/50 hover:bg-blue-500/10 hover:shadow-lg">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/20">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-semibold text-slate-800">
                  Secure
                </h3>
                <p className="text-slate-700">
                  Your files are always encrypted and protected.
                </p>
              </div>

              <div className="rounded-xl border border-slate-300/50 p-6 text-center transition-all duration-300 hover:border-purple-500/50 hover:bg-purple-500/10 hover:shadow-lg">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-500/20">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-purple-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-semibold text-slate-800">
                  Simple
                </h3>
                <p className="text-slate-700">
                  No complicated signups or bloated software.
                </p>
              </div>

              <div className="rounded-xl border border-slate-300/50 p-6 text-center transition-all duration-300 hover:border-green-500/50 hover:bg-green-500/10 hover:shadow-lg">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-semibold text-slate-800">
                  Unlimited
                </h3>
                <p className="text-slate-700">
                  Share what you want, when you want.
                </p>
              </div>
            </div>
          </section>

          {/* Who Can Use Section */}
          <section className="mb-16">
            <h2 className="mb-8 text-2xl font-semibold sm:text-3xl md:text-4xl flex items-center text-slate-800">
              <span className="mr-3 text-green-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </span>
              Who Can Benefit From ShipFilez?
            </h2>

            <p className="mb-8 text-lg leading-relaxed text-slate-800 sm:text-xl">
              ShipFilez is built for everyone who values{" "}
              <span className="font-semibold text-green-700">
                speed, privacy, and simplicity
              </span>
              :
            </p>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-xl bg-white/80 p-6 backdrop-blur-sm transition-all duration-300 hover:bg-white/90 hover:shadow-lg">
                <h3 className="mb-3 text-xl font-semibold text-blue-700">
                  Students & Professionals
                </h3>
                <p className="text-slate-700">
                  Quickly exchange projects, research files, or presentations.
                </p>
              </div>

              <div className="rounded-xl bg-white/80 p-6 backdrop-blur-sm transition-all duration-300 hover:bg-white/90 hover:shadow-lg">
                <h3 className="mb-3 text-xl font-semibold text-purple-700">
                  Businesses
                </h3>
                <p className="text-slate-700">
                  Share confidential documents securely without relying on
                  third-party servers.
                </p>
              </div>

              <div className="rounded-xl bg-white/80 p-6 backdrop-blur-sm transition-all duration-300 hover:bg-white/90 hover:shadow-lg">
                <h3 className="mb-3 text-xl font-semibold text-green-700">
                  Content Creators
                </h3>
                <p className="text-slate-700">
                  Send large videos, music, or design files without compression
                  or loss of quality.
                </p>
              </div>

              <div className="rounded-xl bg-white/80 p-6 backdrop-blur-sm transition-all duration-300 hover:bg-white/90 hover:shadow-lg">
                <h3 className="mb-3 text-xl font-semibold text-yellow-700">
                  Everyday Users
                </h3>
                <p className="text-slate-700">
                  Share photos, videos, and personal files with friends and
                  family worldwide.
                </p>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="mb-16">
            <h2 className="mb-8 text-2xl font-semibold sm:text-3xl md:text-4xl flex items-center text-slate-800">
              <span className="mr-3 text-yellow-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
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
              </span>
              Frequently Asked Questions
            </h2>

            <div className="space-y-6">
              <div className="rounded-xl bg-white/80 p-6 backdrop-blur-sm transition-all duration-300 hover:bg-white/90 hover:shadow-lg">
                <h3 className="mb-2 text-xl font-semibold text-blue-700">
                  Is ShipFilez free?
                </h3>
                <p className="text-slate-700">
                  Yes. ShipFilez is completely free to use with no hidden costs
                  or limitations.
                </p>
              </div>

              <div className="rounded-xl bg-white/80 p-6 backdrop-blur-sm transition-all duration-300 hover:bg-white/90 hover:shadow-lg">
                <h3 className="mb-2 text-xl font-semibold text-purple-700">
                  Do you store my files?
                </h3>
                <p className="text-slate-700">
                  No. ShipFilez never stores your files on any server —
                  transfers are direct, peer-to-peer.
                </p>
              </div>

              <div className="rounded-xl bg-white/80 p-6 backdrop-blur-sm transition-all duration-300 hover:bg-white/90 hover:shadow-lg">
                <h3 className="mb-2 text-xl font-semibold text-green-700">
                  Is ShipFilez secure?
                </h3>
                <p className="text-slate-700">
                  Absolutely. Every transfer is encrypted with industry-standard
                  security protocols.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default About;
