import SEO from "@/components/SEO";
import { Link } from "react-router-dom";

const Blog = () => {
  return (
    <>
      <SEO
        title="WebRTC File Transfer Using DataChannels | ShareFilez Blog"
        description="How I built a secure WebRTC file transfer system with DataChannels, handling backpressure and enabling large file downloads."
        url="https://shipfilez.app/blog"
        image="https://shipfilez.app/preview.png"
        type="article"
        publishedTime="2025-08-22"
        modifiedTime="2025-08-22"
        authorName="Mokshith"
      />

      <div className="min-h-screen w-screen pt-26 bg-white text-slate-800">
        <main className="max-w-5xl mx-auto px-6 py-12 space-y-10">
          {/* Title Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-blue-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm font-medium">WEBRTC DEVELOPMENT</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              🚀 WebRTC File Transfer Using DataChannels
            </h1>

            <div className="flex items-center gap-4 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center">
                  <span className="text-xs text-white">P</span>
                </div>
                <span>Poorvik</span>
              </div>
              <span>•</span>
              <span>August 22, 2025</span>
            </div>
          </div>

          {/* Introduction */}
          <div className="prose prose-lg max-w-none">
            <p className="text-slate-700 leading-relaxed">
              In this blog, I'll explain how I built a{" "}
              <strong className="text-blue-600">
                peer-to-peer (P2P) file sharing system
              </strong>{" "}
              using{" "}
              <strong className="text-blue-600">WebRTC DataChannels</strong>.
              The journey started with a simple idea: securely transfer files
              between browsers without uploading them to a server.
            </p>
          </div>

          {/* The Initial Problem */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="bg-blue-500/20 p-2 rounded-lg">
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
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl md:text-3xl font-semibold">
                ⚡ The Initial Problem
              </h2>
            </div>

            <div className="prose max-w-none text-slate-700">
              <p>
                My first implementation allowed me to send file data over a
                DataChannel. However, the received data was corrupted because I
                wasn't handling raw{" "}
                <code className="bg-slate-200 px-1.5 py-0.5 rounded text-blue-600">
                  ArrayBuffer
                </code>{" "}
                chunks properly. After fixing that, I faced another problem:
                converting large buffers into{" "}
                <code className="bg-slate-200 px-1.5 py-0.5 rounded text-blue-600">
                  Blob
                </code>{" "}
                objects consumed too much <strong>RAM memory</strong>, making
                large downloads impossible.
              </p>
            </div>
          </section>

          {/* The Solution */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="bg-green-500/20 p-2 rounded-lg">
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
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl md:text-3xl font-semibold">
                💡 The Solution
              </h2>
            </div>

            <div className="prose max-w-none text-slate-700">
              <p>
                Browsers don't allow direct writing of DataChannel streams to
                disk. To bypass this, I built a{" "}
                <strong className="text-blue-600">
                  browser sandbox server using Web Workers
                </strong>
                . This Worker intercepted the DataChannel, streamed the data,
                and exposed it as an{" "}
                <strong className="text-blue-600">HTTPS download</strong>. This
                avoided memory overload and made downloads much faster.
              </p>
            </div>
          </section>

          {/* Diagrams Section */}
          <section className="space-y-10">
            {/* Receiver Flow Diagram */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="bg-purple-500/20 p-2 rounded-lg">
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
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl md:text-3xl font-semibold">
                  📥 Receiver Flow Diagram
                </h2>
              </div>

              <div className="bg-white/80 p-6 rounded-xl border border-slate-300 shadow-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 800 250"
                  className="w-full h-auto"
                >
                  <rect
                    x="20"
                    y="80"
                    width="160"
                    height="60"
                    fill="#3b82f6"
                    rx="10"
                  />
                  <text
                    x="100"
                    y="115"
                    fill="white"
                    fontSize="14"
                    textAnchor="middle"
                    fontWeight="500"
                  >
                    DataChannel
                  </text>

                  <rect
                    x="220"
                    y="80"
                    width="160"
                    height="60"
                    fill="#10b981"
                    rx="10"
                  />
                  <text
                    x="300"
                    y="115"
                    fill="white"
                    fontSize="14"
                    textAnchor="middle"
                    fontWeight="500"
                  >
                    Queue (Chunks)
                  </text>

                  <rect
                    x="420"
                    y="80"
                    width="160"
                    height="60"
                    fill="#f59e0b"
                    rx="10"
                  />
                  <text
                    x="500"
                    y="115"
                    fill="white"
                    fontSize="14"
                    textAnchor="middle"
                    fontWeight="500"
                  >
                    Worker
                  </text>

                  <rect
                    x="620"
                    y="80"
                    width="160"
                    height="60"
                    fill="#ef4444"
                    rx="10"
                  />
                  <text
                    x="700"
                    y="115"
                    fill="white"
                    fontSize="14"
                    textAnchor="middle"
                    fontWeight="500"
                  >
                    Disk (File)
                  </text>

                  <line
                    x1="180"
                    y1="110"
                    x2="220"
                    y2="110"
                    stroke="#374151"
                    strokeWidth="2"
                    markerEnd="url(#arrow)"
                  />
                  <line
                    x1="380"
                    y1="110"
                    x2="420"
                    y2="110"
                    stroke="#374151"
                    strokeWidth="2"
                    markerEnd="url(#arrow)"
                  />
                  <line
                    x1="580"
                    y1="110"
                    x2="620"
                    y2="110"
                    stroke="#374151"
                    strokeWidth="2"
                    markerEnd="url(#arrow)"
                  />

                  <defs>
                    <marker
                      id="arrow"
                      markerWidth="10"
                      markerHeight="10"
                      refX="5"
                      refY="5"
                      orient="auto"
                    >
                      <path d="M0,0 L10,5 L0,10 z" fill="#374151" />
                    </marker>
                  </defs>
                </svg>
              </div>
            </div>

            {/* Sender Flow Diagram */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="bg-orange-500/20 p-2 rounded-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-orange-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl md:text-3xl font-semibold">
                  📤 Sender Flow Diagram
                </h2>
              </div>

              <div className="bg-white/80 p-6 rounded-xl border border-slate-300 shadow-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 800 250"
                  className="w-full h-auto"
                >
                  <rect
                    x="20"
                    y="80"
                    width="160"
                    height="60"
                    fill="#a855f7"
                    rx="10"
                  />
                  <text
                    x="100"
                    y="115"
                    fill="white"
                    fontSize="14"
                    textAnchor="middle"
                    fontWeight="500"
                  >
                    File Reference
                  </text>

                  <rect
                    x="220"
                    y="80"
                    width="160"
                    height="60"
                    fill="#06b6d4"
                    rx="10"
                  />
                  <text
                    x="300"
                    y="115"
                    fill="white"
                    fontSize="14"
                    textAnchor="middle"
                    fontWeight="500"
                  >
                    Blob → Slices
                  </text>

                  <rect
                    x="420"
                    y="80"
                    width="160"
                    height="60"
                    fill="#f97316"
                    rx="10"
                  />
                  <text
                    x="500"
                    y="115"
                    fill="white"
                    fontSize="14"
                    textAnchor="middle"
                    fontWeight="500"
                  >
                    ArrayBuffer
                  </text>

                  <rect
                    x="620"
                    y="80"
                    width="160"
                    height="60"
                    fill="#22c55e"
                    rx="10"
                  />
                  <text
                    x="700"
                    y="115"
                    fill="white"
                    fontSize="14"
                    textAnchor="middle"
                    fontWeight="500"
                  >
                    DataChannel
                  </text>

                  <line
                    x1="180"
                    y1="110"
                    x2="220"
                    y2="110"
                    stroke="#374151"
                    strokeWidth="2"
                    markerEnd="url(#arrow2)"
                  />
                  <line
                    x1="380"
                    y1="110"
                    x2="420"
                    y2="110"
                    stroke="#374151"
                    strokeWidth="2"
                    markerEnd="url(#arrow2)"
                  />
                  <line
                    x1="580"
                    y1="110"
                    x2="620"
                    y2="110"
                    stroke="#374151"
                    strokeWidth="2"
                    markerEnd="url(#arrow2)"
                  />

                  <defs>
                    <marker
                      id="arrow2"
                      markerWidth="10"
                      markerHeight="10"
                      refX="5"
                      refY="5"
                      orient="auto"
                    >
                      <path d="M0,0 L10,5 L0,10 z" fill="#374151" />
                    </marker>
                  </defs>
                </svg>
              </div>
            </div>
          </section>

          {/* SEO Takeaways */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="bg-yellow-500/20 p-2 rounded-lg">
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
              <h2 className="text-2xl md:text-3xl font-semibold">
                🔑 Key Takeaways
              </h2>
            </div>

            <ul className="space-y-3">
              {[
                "Use ArrayBuffers for raw binary transfer",
                "Handle backpressure in SCTP to avoid congestion",
                "Leverage Web Workers to reduce memory usage",
                "Stream data to disk instead of holding in RAM",
                "Enable secure P2P transfers with WebRTC",
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="bg-blue-600/10 p-1 rounded-full mt-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-blue-600"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-slate-700">{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* FAQs */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="bg-red-500/20 p-2 rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-red-600"
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
              <h2 className="text-2xl md:text-3xl font-semibold">❓ FAQs</h2>
            </div>

            <div className="space-y-6">
              <div className="bg-white/80 p-5 rounded-xl border border-slate-300 shadow-lg">
                <p className="font-semibold text-lg text-blue-600 mb-2">
                  Q: Why not just upload files to a server?
                </p>
                <p className="text-slate-700">
                  A: Using WebRTC allows direct browser-to-browser transfer
                  without server storage, ensuring privacy and speed.
                </p>
              </div>

              <div className="bg-white/80 p-5 rounded-xl border border-slate-300 shadow-lg">
                <p className="font-semibold text-lg text-blue-600 mb-2">
                  Q: How do you handle large files (2GB+)?
                </p>
                <p className="text-slate-700">
                  A: By chunking data into slices, handling SCTP backpressure,
                  and writing directly to disk instead of memory.
                </p>
              </div>
            </div>
          </section>

          {/* Conclusion */}
          <div className="bg-white/80 p-6 rounded-xl border border-slate-300 shadow-lg">
            <p className="text-slate-700">
              This architecture powers{" "}
              <Link
                to="https://shipfilez.app"
                className="text-blue-600 hover:text-blue-500 underline font-medium transition-colors"
              >
                Sharefilez
              </Link>
              , my P2P file-sharing project. If you're interested in trying it,
              check it out!
            </p>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-300 py-8 mt-12">
          <div className="max-w-3xl mx-auto px-6 text-center text-slate-600">
            <p>© 2025 Sharefilez. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Blog;
