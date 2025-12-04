import SEO from "@/components/SEO";

const Contact = () => {
  return (
    <>
      <SEO
        title="Contact ShareFilez | Get in Touch"
        description="Have questions or feedback? Contact the ShareFilez team to learn more about our secure and unlimited peer-to-peer file sharing service."
        url="https://sharefilez.vercel.app/contact"
      />
      <div className="relative min-h-screen w-full pt-36 bg-[#0263eb] bg-cover bg-center bg-no-repeat px-4 py-16 text-slate-800 sm:px-6 md:px-8 lg:px-12">
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-[#b5d8ff]"></div>

        <div className="relative mx-auto max-w-4xl text-center">
          {/* Header Section */}
          <div className="mb-12">
            <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl bg-clip-text text-transparent bg-[#0263eb]">
              Get In Touch
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-slate-700 sm:text-xl">
              Have questions, requests, or feedback? We'd love to hear from you!
              We're a small passionate team working on exciting projects.
            </p>
          </div>

          {/* Support Note */}
          <div className="mx-auto mb-16 max-w-2xl rounded-xl bg-white/80 p-6 backdrop-blur-sm border border-blue-200 shadow-lg">
            <p className="text-slate-700">
              Please note that responses might not be immediate. Like what we
              do? You can always{" "}
              <a
                href="https://buymeacoffee.com/mokshith"
                className="font-semibold text-blue-600 hover:text-blue-500 transition-colors duration-300 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                buy us a coffee ☕
              </a>{" "}
              to support our work.
            </p>
          </div>

          {/* Team Members */}
          <div className="mb-16">
            <h2 className="mb-12 text-2xl font-semibold sm:text-3xl md:text-4xl flex items-center justify-center text-slate-800">
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
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </span>
              Our Team
            </h2>

            <div className="flex flex-col items-center gap-12 md:flex-row md:justify-center md:items-start">
              {/* Team Member 1 */}
              <div className="group w-72 transform transition-all duration-500 hover:scale-105">
                <div className="relative mb-6 overflow-hidden rounded-2xl shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 z-10"></div>
                  <img
                    src="/ava1.jpeg"
                    alt="Mokshith S"
                    className="w-full rounded-2xl transition-transform duration-500 group-hover:scale-110"
                    width={300}
                    height={300}
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-center opacity-0 transition-all duration-500 group-hover:opacity-100 z-20 transform translate-y-4 group-hover:translate-y-0">
                    <a
                      href="mailto:mokshith@shipfilez.app"
                      className="inline-block rounded-full bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-500 transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
                    >
                      Send Email
                    </a>
                  </div>
                </div>
                <h3 className="mb-1 text-xl font-bold text-slate-800">
                  Mokshith S
                </h3>
                <p className="mb-3 text-sm text-blue-600 font-medium">
                  Developer / Founder
                </p>
                <a
                  href="mailto:mokshith@shipfilez.app"
                  className="text-slate-600 hover:text-blue-600 transition-colors duration-300 text-sm font-medium"
                >
                  mokshith@shipfilez.app
                </a>
              </div>

              {/* Team Member 2 */}
              <div className="group w-72 transform transition-all duration-500 hover:scale-105">
                <div className="relative mb-6 overflow-hidden rounded-2xl shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 z-10"></div>
                  <img
                    src="/image copy.png"
                    alt="Poorvik"
                    className="w-full rounded-2xl transition-transform duration-500 group-hover:scale-110"
                    width={300}
                    height={300}
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-center opacity-0 transition-all duration-500 group-hover:opacity-100 z-20 transform translate-y-4 group-hover:translate-y-0">
                    <a
                      href="mailto:poorvik1212@gmail.com"
                      className="inline-block rounded-full bg-purple-600 px-6 py-3 text-sm font-medium text-white hover:bg-purple-500 transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
                    >
                      Send Email
                    </a>
                  </div>
                </div>
                <h3 className="mb-1 text-xl font-bold text-slate-800">
                  K S Poorvik
                </h3>
                <p className="mb-3 text-sm text-purple-600 font-medium">
                  Designer / Co-Founder
                </p>
                <a
                  href="mailto:poorvik1212@gmail.com"
                  className="text-slate-600 hover:text-purple-600 transition-colors duration-300 text-sm font-medium"
                >
                  poorvik1212@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Social Media Links */}
          <div className="mb-12">
            <h2 className="mb-8 text-2xl font-semibold sm:text-3xl md:text-4xl flex items-center justify-center text-slate-800">
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
                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                  />
                </svg>
              </span>
              Connect With Us
            </h2>

            <div className="flex flex-wrap justify-center gap-6">
              <a
                href="https://discord.gg/ECWBD3dv"
                aria-label="Discord"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-16 w-16 items-center justify-center rounded-2xl bg-white/80 backdrop-blur-sm transition-all duration-300 hover:bg-blue-600 hover:scale-110 shadow-lg hover:shadow-blue-500/25 border border-white/20"
              >
                <img
                  src="/discord.png"
                  alt="Discord"
                  className="h-8 w-8 transition-transform duration-300 group-hover:scale-110 group-hover:brightness-0 group-hover:invert"
                  width={32}
                  height={32}
                />
              </a>

              <a
                href="https://www.instagram.com/encrypted.ghost_/"
                aria-label="Instagram"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-16 w-16 items-center justify-center rounded-2xl bg-white/80 backdrop-blur-sm transition-all duration-300 hover:bg-pink-600 hover:scale-110 shadow-lg hover:shadow-pink-500/25 border border-white/20"
              >
                <img
                  src="/igs.png"
                  alt="Instagram"
                  className="h-8 w-8 transition-transform duration-300 group-hover:scale-110 group-hover:brightness-0 group-hover:invert"
                  width={32}
                  height={32}
                />
              </a>

              <a
                href="https://x.com/mokshith_s_"
                aria-label="Twitter"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-16 w-16 items-center justify-center rounded-2xl bg-white/80 backdrop-blur-sm transition-all duration-300 hover:bg-black hover:scale-110 shadow-lg hover:shadow-black/25 border border-white/20"
              >
                <img
                  src="/x.svg"
                  alt="Twitter"
                  className="h-8 w-8 transition-transform duration-300 group-hover:scale-110 group-hover:brightness-0 group-hover:invert"
                  width={32}
                  height={32}
                />
              </a>

              <a
                href="https://www.linkedin.com/in/mokshith-s"
                aria-label="LinkedIn"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-16 w-16 items-center justify-center rounded-2xl bg-white/80 backdrop-blur-sm transition-all duration-300 hover:bg-blue-700 hover:scale-110 shadow-lg hover:shadow-blue-500/25 border border-white/20"
              >
                <img
                  src="/linkedIN.png"
                  alt="LinkedIn"
                  className="h-8 w-8 transition-transform duration-300 group-hover:scale-110 group-hover:brightness-0 group-hover:invert"
                  width={32}
                  height={32}
                />
              </a>
            </div>
          </div>

          {/* General Inquiries */}
          <div className="rounded-2xl bg-white/80 p-8 backdrop-blur-sm border border-blue-200 max-w-2xl mx-auto shadow-lg">
            <h3 className="mb-4 text-xl font-semibold text-blue-700">
              General Inquiries
            </h3>
            <p className="text-slate-700 mb-4">
              For general questions or support, please email:
            </p>
            <a
              href="mailto:mokshith@shipfilez.app"
              className="text-lg font-medium text-blue-600 hover:text-blue-500 transition-colors duration-300 underline"
            >
              mokshith@shipfilez.app
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
