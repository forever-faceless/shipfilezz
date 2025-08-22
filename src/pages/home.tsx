import FileComponent from "@/components/Fileupload";
import Wave from "react-wavify";
import { Midground } from "@/components/Midground";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div>
      {/* Background Section */}
      <div
        className="relative mx-auto flex h-screen w-screen bg-slate-900 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://res.cloudinary.com/da3j9iqkp/image/upload/v1730989736/iqgxciixwtfburooeffb.svg')",
        }}
      >
        {/* Left Section */}
        <div className="w-full px-4 md:w-1/2 md:px-0">
          {/* Mobile View Text */}
          <div className="absolute top-20 px-6 text-center md:hidden">
            <h1 className="text-xl font-bold leading-snug text-white sm:text-2xl">
              Share Files Instantly, Without Limits or Servers.
            </h1>
            <h2 className="text-sm font-light leading-relaxed text-gray-300 sm:text-base">
              Transfer files securely and seamlessly without a middleman.
            </h2>
          </div>
          <FileComponent />
        </div>

        {/* Right Section */}
        <div className="hidden w-1/2 items-start justify-center pt-20 md:flex">
          <div className="mt-20 flex h-1/2 flex-col gap-8 px-8 text-center md:px-12 md:text-left lg:px-20">
            <h1 className="text-2xl font-extrabold leading-snug text-white sm:text-3xl md:text-4xl lg:text-5xl">
              Share Files Instantly, Without Limits or Servers.
            </h1>
            <h2 className="text-sm font-light leading-relaxed text-gray-300 sm:text-lg md:text-xl lg:text-2xl">
              Transfer files securely and seamlessly without a middleman.
              Perfect for quick, private sharing.
            </h2>

            {/* Feature List */}
            <div className="flex flex-col items-center justify-center gap-6 text-sm text-white sm:flex-row sm:gap-12 sm:text-base md:items-start md:justify-start md:text-lg">
              <div className="flex flex-col items-center gap-4 sm:items-start">
                <p className="flex items-center gap-2">
                  📂 <span>No File Size Limit</span>
                </p>
                <p className="flex items-center gap-2">
                  🔒 <span>End-to-End Encryption</span>
                </p>
              </div>
              <div className="flex flex-col items-center gap-4 sm:items-start">
                <p className="flex items-center gap-2">
                  ⚡ <span>Blazing Fast Speeds</span>
                </p>
                <p className="flex items-center gap-2">
                  🔄 <span>Peer-to-Peer Transfers</span>
                </p>
              </div>
            </div>

            <Link
              to="/p2p-file-sharing"
              className="inline-flex text-lg items-center font-medium text-[#ffd500] hover:text-[#f9d568b5] transition-colors duration-200 group"
            >
              Learn More
              <svg
                className="w-4 h-4 ml-1 transition-transform duration-200 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </Link>
          </div>
        </div>

        {/* Wave Component */}
        <div className="absolute bottom-0 z-30 h-[20vh] w-full overflow-hidden sm:h-[25vh] md:h-[30vh] lg:h-[20vh] xxl:h-[30vh]">
          <Wave
            style={{ height: "100%" }}
            fill="#052454"
            paused={false}
            options={{
              height: 20,
              amplitude: 15,
              speed: 0.3,
              points: 3,
            }}
          />
        </div>
      </div>

      {/* Midground Section */}
      <div className="relative h-screen w-screen bg-[#062354]">
        <Midground />
      </div>

      {/* SEO Content Section */}
      <div className="w-full bg-slate-900 py-16 px-6 text-white md:px-20 lg:px-40">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">
          The Future of Secure & Unlimited File Sharing
        </h2>
        <p className="text-gray-300 text-lg leading-relaxed mb-6">
          Looking for <strong>secure file transfer</strong> without limits? Our
          platform offers <strong>peer-to-peer file sharing</strong> with{" "}
          <strong>end-to-end encryption</strong>, ensuring your data is safe,
          private, and never stored on third-party servers. Whether you need{" "}
          <strong>fast file sharing</strong> for work,{" "}
          <strong>encrypted file transfers</strong> for sensitive information,
          or <strong>unlimited file uploads</strong> for large projects — we’ve
          got you covered.
        </p>
        <p className="text-gray-300 text-lg leading-relaxed mb-6">
          Unlike traditional cloud storage providers, our solution gives you{" "}
          <strong>instant transfers</strong>, <strong>no storage limits</strong>
          , and complete <strong>privacy</strong>. Perfect for students,
          professionals, and businesses that need{" "}
          <strong>fast, reliable, and secure file sharing</strong>.
        </p>

        {/* FAQ Section */}
        <div className="mt-12">
          <h3 className="text-2xl font-semibold mb-4 text-center">
            Frequently Asked Questions
          </h3>
          <div className="space-y-4">
            <div className="bg-[#052454] p-4 rounded-lg">
              <h4 className="font-bold text-lg">🔒 Is file sharing secure?</h4>
              <p className="text-gray-300">
                Yes. All transfers use end-to-end encryption so your files
                remain private between sender and receiver.
              </p>
            </div>
            <div className="bg-[#052454] p-4 rounded-lg">
              <h4 className="font-bold text-lg">📂 Any file size limits?</h4>
              <p className="text-gray-300">
                No limits! Unlike cloud storage, our peer-to-peer sharing lets
                you send files of any size instantly.
              </p>
            </div>
            <div className="bg-[#052454] p-4 rounded-lg">
              <h4 className="font-bold text-lg">⚡ How fast is it?</h4>
              <p className="text-gray-300">
                Transfers are direct, peer-to-peer — meaning you get blazing
                fast speeds without server bottlenecks.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
