import React, { useEffect, useRef, useState } from "react";
import { BiSolidCircle } from "react-icons/bi";
import streamSaver from "streamsaver";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
interface typeFileDetail {
  fileName: string[];
  fileLength: number;
}

const isLocalhost =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

streamSaver.mitm = isLocalhost
  ? "http://localhost:5173/StreamSaver/mitm.html"
  : "https://www.shipfilez.app/StreamSaver/mitm.html";

interface ReceiverProps {
  shareCode?: string;
}

const Receiver: React.FC<ReceiverProps> = () => {
  const [searchParams] = useSearchParams();
  const initialShareCode = searchParams.get("code");
  const [shareCode] = useState(initialShareCode || "");
  const socketRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [clientId, setClientId] = useState<string | null>(null);
  const [fileDetail, setFileDetail] = useState<typeFileDetail | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const shareCodeRef = useRef<string | null>(null);
  const clientCodeRef = useRef<string | null>(null);
  const [percentage, setPercentage] = useState<string>("0");
  const heartbeatIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null
  );
  const [downloadedFilesCount, setDownloadedFilesCount] = useState<number>(0);
  const writerRef = useRef<WritableStreamDefaultWriter<Uint8Array> | null>(
    null
  );
  const dataChannelRef = useRef<RTCDataChannel | null>(null);
  const receivedBytesRef = useRef<number>(0);
  const totalFileSizeRef = useRef<number>(0);
  const ackCounterRef = useRef<number>(0);
  const ackThreshold = 1024 * 1024; // 1 MB
  const navigate = useNavigate();

  const requestHostToSendOffer = async () => {
    console.log("Requesting host to send offer...");
    const socket = socketRef.current;
    if (!socket) return;
    socket.send(
      JSON.stringify({
        event: "EVENT_REQUEST_HOST_TO_SEND_OFFER",
        shareCode: shareCodeRef.current,
        clientId,
      })
    );
  };

  const cleanup = (msg: string) => {
    console.log("Cleanup function called:", msg);
    if (writerRef.current) {
      writerRef.current.close().catch(console.error);
      writerRef.current = null;
    }
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
      heartbeatIntervalRef.current = null;
    }
    if (dataChannelRef.current) {
      dataChannelRef.current.close();
      dataChannelRef.current = null;
    }
    receivedBytesRef.current = 0;
    totalFileSizeRef.current = 0;
    ackCounterRef.current = 0;
  };

  useEffect(() => {
    if (!shareCode) {
      navigate("/");
      return;
    }
    if (socketRef.current) return;

    const socket = new WebSocket(
      "wss://backend-service-707394683264.us-central1.run.app/"
    );
    socketRef.current = socket;

    socket.onopen = () => {
      setIsConnected(true);
      socket.send(
        JSON.stringify({
          event: "EVENT_REQUEST_CLIENT_ID",
          shareCode,
        })
      );

      heartbeatIntervalRef.current = setInterval(() => {
        if (socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({ event: "EVENT_HEART_BEAT" }));
        }
      }, 10000);
    };

    socket.onmessage = async (event) => {
      const parsedMessage = JSON.parse(event.data);

      if (parsedMessage.event === "EVENT_REQUEST_CLIENT_ID") {
        setClientId(parsedMessage.clientId);
        setFileDetail({
          fileName: parsedMessage.fileName,
          fileLength: parsedMessage.fileLength,
        });
        shareCodeRef.current = parsedMessage.sharedCode;
      }

      if (parsedMessage.event === "EVENT_OFFER") {
        const rtcConfiguration = {
          iceServers: [
            {
              urls: "stun:stun.l.google.com:19302", // Google's primary STUN
            },
            {
              urls: "stun:stun1.l.google.com:19302", // Backup STUN
            },
            {
              urls: "stun:stun2.l.google.com:19302", // Backup STUN
            },
            {
              urls: "turn:relay1.expressturn.com:3480", // ExpressTurn relay
              username: "000000002071130093",
              credential: "aTlsOf4X59YBepzUeCxekYwQb9s=",
            },
          ],
        };

        clientCodeRef.current = parsedMessage.clientId;
        shareCodeRef.current = parsedMessage.sharedCode;
        cleanup("Cleaning up before setting up new connection...");

        const pc = new RTCPeerConnection(rtcConfiguration);
        pcRef.current = pc;

        pc.onicecandidate = (event) => {
          if (event.candidate && socket.readyState === WebSocket.OPEN) {
            socket.send(
              JSON.stringify({
                event: "EVENT_ICE_CANDIDATE",
                shareCode: shareCodeRef.current,
                clientId: clientCodeRef.current,
                candidate: event.candidate,
                from: "CLIENT",
              })
            );
          }
        };

        pc.onconnectionstatechange = () => {
          console.log(
            "Receiver connection state: PC STATE onConnectionStateCHange",
            pc.connectionState
          );
          if (pc.connectionState === "failed") {
            console.log(
              "Receiver connection failed, inside the pc.connectionState inside onConnectionstateChange cleaning up..."
            );
            cleanup("Connection failed inside onConnectionStateChange");
          }
        };

        pc.oniceconnectionstatechange = () => {
          console.log("Receiver ICE state:", pc.iceConnectionState);
        };

        pc.ondatachannel = (event) => {
          const dataChannel = event.channel;
          dataChannel.binaryType = "arraybuffer";
          dataChannelRef.current = dataChannel;

          let receivedFileMetadata: {
            fileName: string;
            fileSize: number;
          } | null = null;

          // local queue for chunks
          const chunkQueue: ArrayBuffer[] = [];
          let writing = false;

          async function processQueue() {
            if (writing || !writerRef.current) return;
            writing = true;
            try {
              while (chunkQueue.length > 0 && writerRef.current) {
                const chunk = chunkQueue.shift()!;
                await writerRef.current.write(new Uint8Array(chunk));
                receivedBytesRef.current += chunk.byteLength;

                if (receivedFileMetadata) {
                  const percent = (
                    (receivedBytesRef.current / receivedFileMetadata.fileSize) *
                    100
                  ).toFixed(2);
                  setPercentage(percent);
                }

                // batch ACKs
                ackCounterRef.current += chunk.byteLength;
                // Modify the ACK logic:
                if (ackCounterRef.current >= ackThreshold) {
                  try {
                    if (dataChannel.readyState === "open") {
                      dataChannel.send(
                        JSON.stringify({
                          type: "ack",
                          received: receivedBytesRef.current,
                        })
                      );
                      ackCounterRef.current = 0;
                    }
                  } catch (error) {
                    console.error("Failed to send ACK:", error);
                  }
                }
              }
              // final ack when file finishes
              if (
                receivedFileMetadata &&
                receivedBytesRef.current >= receivedFileMetadata.fileSize
              ) {
                dataChannel.send(
                  JSON.stringify({
                    type: "ack",
                    received: receivedBytesRef.current,
                    final: true,
                  })
                );
                setDownloadedFilesCount((prev) => prev + 1);
              }
            } catch (err) {
              console.error("Error writing chunk:", err);
            } finally {
              writing = false;
            }
          }

          dataChannel.onmessage = async (event: MessageEvent) => {
            const message = event.data;
            try {
              if (typeof message === "string") {
                const parsed = JSON.parse(message);
                if (parsed.type === "meta") {
                  receivedFileMetadata = {
                    fileName: parsed.fileName,
                    fileSize: parsed.fileSize,
                  };
                  totalFileSizeRef.current = parsed.fileSize;

                  if (writerRef.current) {
                    await writerRef.current.close();
                  }

                  const fileStream = streamSaver.createWriteStream(
                    parsed.fileName,
                    {
                      size: parsed.fileSize,
                    }
                  );
                  writerRef.current = fileStream.getWriter();
                  receivedBytesRef.current = 0;
                  ackCounterRef.current = 0;

                  console.log("📂 Ready to receive file:", parsed.fileName);
                  dataChannel.send(JSON.stringify({ type: "ready" }));
                } else if (parsed.type === "done") {
                  if (writerRef.current) {
                    console.log("📥 Flushing remaining chunks before close...");

                    await new Promise((resolve, reject) => {
                      const interval = setInterval(async () => {
                        if (!writerRef.current) {
                          console.error("Writer is not initialized");
                          reject(new Error("Writer is not initialized"));
                          return;
                        }
                        if (dataChannel.bufferedAmount === 0) {
                          clearInterval(interval);
                          await writerRef.current.close();
                          writerRef.current = null;
                          resolve(true);
                        }
                      }, 100);
                    });

                    console.log("✅ File fully written to disk");
                  }

                  // ✅ now safe to notify sender
                  dataChannel.send(
                    JSON.stringify({ type: "transfer-complete" })
                  );
                }
              } else if (message instanceof ArrayBuffer) {
                chunkQueue.push(message);
                processQueue();
              }
            } catch (error) {
              console.error("Error processing message:", error);
            }
          };

          dataChannel.onerror = (error) => {
            console.error("Data channel error:", error);
          };

          dataChannel.onclose = () => {
            console.log(
              "Data channel closed (reason: receiver cleanup)",
              pc.connectionState
            );
            if (writerRef.current) {
              writerRef.current.close().catch(console.error);
              writerRef.current = null;
            }
          };
        };

        try {
          await pc.setRemoteDescription(parsedMessage.offer);
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);

          if (socket.readyState === WebSocket.OPEN) {
            socket.send(
              JSON.stringify({
                event: "EVENT_ANSWER",
                answer,
                shareCode: shareCodeRef.current,
                clientId: clientCodeRef.current,
              })
            );
          }
        } catch (error) {
          console.error("Error during WebRTC negotiation:", error);
          cleanup("Error during WebRTC negotiation");
        }
      }

      if (parsedMessage.event === "EVENT_ICE_CANDIDATE") {
        try {
          const candidate = new RTCIceCandidate(parsedMessage.candidate);
          const pc = pcRef.current;
          if (!pc) return;
          await pc.addIceCandidate(candidate);
        } catch (error) {
          console.error("Error adding ICE candidate:", error);
        }
      }
    };

    socket.onclose = () => {
      console.warn("WebSocket connection closed, but keeping WebRTC alive...");
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
      console.log("WebSocket connection closed cleaning up...");
      cleanup("WebSocket error");
    };

    return () => {
      console.log("WebSocket connection closed cleaning up...");
      cleanup("Cleanup on component unmount");
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shareCode]);

  const ProgressBar: React.FC<{ value: number }> = ({ value }) => (
    <div className="h-2.5 w-full rounded-full bg-gray-200">
      <div
        className="h-2.5 rounded-full bg-blue-600"
        style={{ width: `${value}%` }}
      ></div>
    </div>
  );

  return (
    <div
      className="
    relative min-h-screen w-full 
    flex items-center justify-center 
    bg-cover bg-no-repeat bg-left md:bg-center 
    px-4 sm:px-6 py-10 bg-white
  ">
      {/* dark overlay to make content pop */}
      <div className="absolute inset-0 bg-black/60 md:bg-black/50" />

      {/* Card wrapper */}
      <div className="relative z-10 w-full max-w-3xl">
        <div
          className="
        bg-white backdrop-blur
        rounded-2xl shadow-2xl 
        border border-slate-200 
        p-5 sm:p-6 md:p-8 
        space-y-6
      "
        >
          {/* Header + status */}
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="space-y-2 text-center md:text-left">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Receive Files Seamlessly
              </h2>
              <p className="text-sm sm:text-base text-slate-600">
                Share and receive files instantly without interruptions.
              </p>
            </div>

            {/* Connection status pill */}
            <div className="flex justify-center md:justify-end">
              {isConnected ? (
                <div
                  className="
                inline-flex items-center gap-2 
                rounded-full px-3 py-1 
                bg-emerald-50 text-emerald-700 
                text-xs sm:text-sm font-semibold
              "
                >
                  <BiSolidCircle className="text-[#24cc3e]" />
                  <span>Connected</span>
                </div>
              ) : (
                <div
                  className="
                inline-flex items-center gap-2 
                rounded-full px-3 py-1 
                bg-rose-50 text-rose-700 
                text-xs sm:text-sm font-semibold
              "
                >
                  <BiSolidCircle className="text-[#f34f4f]" />
                  <span>Disconnected</span>
                </div>
              )}
            </div>
          </div>

          {/* File details */}
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-base sm:text-lg font-semibold text-slate-900">
                File details
              </h3>
              {fileDetail && (
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                  {fileDetail.fileName.length} file
                  {fileDetail.fileName.length > 1 ? "s" : ""}
                </span>
              )}
            </div>

            <div
              className="
            h-28 max-h-36 w-full 
            overflow-auto 
            rounded-xl bg-slate-900 
            p-3 sm:p-4 
            text-white text-xs sm:text-sm 
          "
            >
              {fileDetail ? (
                <div className="flex flex-wrap gap-2">
                  {fileDetail.fileName.map((name) => (
                    <span
                      key={name}
                      className="
                    rounded-md bg-white/10 
                    px-2 py-1 
                    break-all
                  "
                    >
                      {name}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-slate-200">No file selected yet.</p>
              )}
            </div>
          </div>

          {/* Stats + download button */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-sm sm:text-base text-slate-700 space-y-1">
              <p>
                <span className="font-semibold text-slate-900">
                  Files available:
                </span>{" "}
                {fileDetail?.fileLength ?? 0}
              </p>
              <p>
                <span className="font-semibold text-slate-900">
                  Files received:
                </span>{" "}
                {downloadedFilesCount}
              </p>
            </div>

            <button
              onClick={requestHostToSendOffer}
              disabled={!shareCode || !isConnected}
              className={`
            h-11 w-full sm:w-40 
            rounded-lg 
            font-semibold 
            shadow-md 
            text-sm sm:text-base
            transition-all 
            ${
              !shareCode || !isConnected
                ? "bg-blue-300/60 text-black/60 cursor-not-allowed"
                : "bg-blue-400 text-black hover:bg-blue-500 hover:shadow-lg"
            }
          `}
            >
              Download
            </button>
          </div>

          {/* Progress */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs sm:text-sm text-slate-600">
              <span>Transfer progress</span>
              <span className="font-semibold text-slate-900">
                {Number(percentage)}%
              </span>
            </div>
            <div className="flex w-full flex-col items-center gap-3">
              <ProgressBar value={Number(percentage)} />
              {Number(percentage) === 100 && (
                <p className="text-sm sm:text-base font-semibold text-emerald-600">
                  File download complete!
                </p>
              )}
            </div>
          </div>

          {/* Connection lost alert */}
          {!isConnected && (
            <div className="mt-2 rounded-xl bg-blue-50 px-4 py-3 text-blue-900 shadow-sm border border-blue-100">
              <p className="font-semibold text-sm sm:text-base">
                ⚠ Connection lost
              </p>
              <p className="text-xs sm:text-sm mt-1">
                Your connection was interrupted. Please{" "}
                <button
                  onClick={() => window.location.reload()}
                  className="underline font-medium hover:text-blue-800"
                >
                  refresh
                </button>{" "}
                to try again.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Receiver;
