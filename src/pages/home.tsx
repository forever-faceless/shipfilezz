import FileComponent from "@/components/Fileupload";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function Home() {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  return (
    <div>
      <div
        className="
          relative min-h-screen w-full 
          flex items-center 
          bg-cover bg-no-repeat bg-left md:bg-center
          bg-[radial-gradient(circle,_#6E9BFD_0%,_#9BB6FE_18%,_#C7DAFF_38%,_#E0ECFF_50%,_#FFFFFF_100%)]"
      >
        {/* Dark overlay for better contrast */}

        {/* Content */}
        <div className="relative z-10 w-full">
          <div
            className="
        max-w-6xl mx-auto 
        px-4 sm:px-6 lg:px-8 
        flex flex-col md:flex-row 
        items-center justify-between 
        gap-10 md:gap-16
        
      "
          >
            {/* Left: Text Content */}
            <div
              className={`md:w-1/2 ${uploadedFiles.length > 0 ? "hidden" : "block"} text-center md:text-left space-y-6`}
            >
              <h1
                className="
            text-3xl sm:text-4xl lg:text-5xl 
            font-bold 
            text-black 
            leading-tight
          "
              >
                <div>Share Files Instantly,</div>

                <div className="mt-4">
                  Without{" "}
                  <span className="bg-white border-black border-2 rounded-xl p-1">Limits</span>.
                </div>
              </h1>
              <br />

              <p className="text-base sm:text-lg text-black max-w-lg mx-auto md:mx-0">
                Fast, secure, and completely server-free file transfers with{" "}
                <span className="font-semibold">ShareFilez</span>.
              </p>

              {/* CTA buttons (optional, remove if not needed) */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center md:justify-start">
                <button
                  className="
              px-5 py-2.5 
              rounded-xl 
              bg-blue-600 
              text-white 
              text-sm sm:text-base 
              font-semibold 
              shadow-lg shadow-black/30 
              hover:bg-blue-800 
              transition
            "
                >
                  Start Sharing
                </button>
                <Link
                  to="/about"
                  className="
              px-5 py-2.5 
              rounded-xl
              bg-white
              border border-black 
              text-black
              text-sm sm:text-base 
              hover:bg-slate-200 
              transition
            "
                >
                  Learn More
                </Link>
              </div>
            </div>

            {/* Right: File Component */}
            <div
              className={`
              ${uploadedFiles.length > 0 ? "md:w-full" : "md:w-1/2"}
          flex justify-center md:justify-end 
        `}
            >
              <FileComponent
                uploadedFiles={uploadedFiles}
                setUploadedFiles={setUploadedFiles}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="w-full bg-blue-600 py-16 px-6 text-white md:px-20 lg:px-40">
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
