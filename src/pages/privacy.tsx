import SEO from "@/components/SEO";

const Privacy = () => {
  return (
    <>
      <SEO
        title="Privacy Policy | ShipFilez"
        description="Read ShipFilez's Privacy Policy to learn how we protect your data with peer-to-peer encryption and ensure safe, secure, and private file sharing."
        url="https://www.shipfilez.app/privacy"
      />
      <div
        className="relative min-h-screen w-full pt-36 bg-slate-900 bg-cover bg-center bg-no-repeat px-4 py-16 text-white sm:px-6 md:px-8 lg:px-12"
        style={{
          backgroundImage:
            "url('https://res.cloudinary.com/da3j9iqkp/image/upload/v1730989736/iqgxciixwtfburooeffb.svg')",
        }}
      >
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-slate-900/80"></div>

        <div className="relative mx-auto max-w-4xl">
          {/* Header Section */}
          <div className="mb-16 text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              Privacy Policy
            </h1>
            <div className="mx-auto h-1 w-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-8"></div>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Your privacy matters to us. We built ShipFilez with a fundamental
              principle: your data belongs to you, not to us.
            </p>
          </div>

          {/* Main Content */}
          <div className="space-y-10">
            {/* Privacy Commitment Card */}
            <div className="rounded-2xl bg-slate-800/50 p-8 backdrop-blur-sm border border-slate-700/30 transition-all duration-300 hover:border-blue-500/30">
              <div className="flex items-start mb-6">
                <div className="mr-5 flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/20">
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
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-blue-300 mb-2">
                    Our Core Principle
                  </h2>
                  <p className="text-lg text-slate-300">
                    We do not store your data, ever. Your files are transferred
                    directly between devices without passing through our
                    servers.
                  </p>
                </div>
              </div>
            </div>

            {/* Data Collection Card */}
            <div className="rounded-2xl bg-slate-800/50 p-8 backdrop-blur-sm border border-slate-700/30 transition-all duration-300 hover:border-purple-500/30">
              <div className="flex items-start mb-6">
                <div className="mr-5 flex h-12 w-12 items-center justify-center rounded-full bg-purple-500/20">
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
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-purple-300 mb-2">
                    What We Track
                  </h2>
                  <p className="text-lg text-slate-300 mb-4">
                    The only information we keep is anonymous, aggregated data
                    to help us monitor system performance and improve the
                    platform:
                  </p>
                  <ul className="list-disc pl-6 text-slate-300 space-y-2">
                    <li>Total number of daily users</li>
                    <li>Number of successful and failed transfers</li>
                    <li>Usage of fallback transfer methods</li>
                    <li>Performance metrics to identify and fix issues</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* GDPR Compliance Card */}
            <div className="rounded-2xl bg-slate-800/50 p-8 backdrop-blur-sm border border-slate-700/30 transition-all duration-300 hover:border-green-500/30">
              <div className="flex items-start mb-6">
                <div className="mr-5 flex h-12 w-12 items-center justify-center rounded-full bg-green-500/20">
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
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-green-300 mb-2">
                    GDPR Compliance
                  </h2>
                  <p className="text-lg text-slate-300">
                    Our service is fully compliant with the General Data
                    Protection Regulation (GDPR). Since we don't store personal
                    data or files, your privacy and security remain our top
                    priorities.
                  </p>
                </div>
              </div>
            </div>

            {/* Security Practices Card */}
            <div className="rounded-2xl bg-slate-800/50 p-8 backdrop-blur-sm border border-slate-700/30 transition-all duration-300 hover:border-yellow-500/30">
              <div className="flex items-start mb-6">
                <div className="mr-5 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-500/20">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-yellow-400"
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
                <div>
                  <h2 className="text-2xl font-semibold text-yellow-300 mb-2">
                    Your Responsibility
                  </h2>
                  <p className="text-lg text-slate-300 mb-4">
                    While we strive to make this platform as secure as possible,
                    we encourage you to use it responsibly:
                  </p>
                  <ul className="list-disc pl-6 text-slate-300 space-y-2">
                    <li>Keep your share links private and secure</li>
                    <li>Only share files with trusted recipients</li>
                    <li>Be aware of your local data privacy regulations</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Contact Card */}
            <div className="rounded-2xl bg-slate-800/50 p-8 backdrop-blur-sm border border-slate-700/30 transition-all duration-300 hover:border-cyan-500/30">
              <div className="flex items-start mb-6">
                <div className="mr-5 flex h-12 w-12 items-center justify-center rounded-full bg-cyan-500/20">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-cyan-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-cyan-300 mb-2">
                    Questions & Concerns
                  </h2>
                  <p className="text-lg text-slate-300 mb-4">
                    If you have any questions about our privacy practices or how
                    we handle data, we're here to help.
                  </p>
                  <a
                    href="/contact"
                    className="inline-flex items-center px-6 py-3 rounded-full bg-cyan-600 text-white font-medium hover:bg-cyan-500 transition-colors duration-300"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    Contact Us
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Last Updated */}
          <div className="mt-16 text-center text-slate-400 text-sm">
            Last updated:{" "}
            {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default Privacy;
