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

    const socket = new WebSocket("wss://api.shipfilez.app");
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
            // Google STUN (free)
            { urls: "stun:stun.l.google.com:19302" },
            { urls: "stun:stun1.l.google.com:19302" },
            { urls: "stun:stun2.l.google.com:19302" },
            { urls: "stun:stun3.l.google.com:19302" },
            { urls: "stun:stun4.l.google.com:19302" },

            // Free TURN/STUN by Metered (open relay – limited)
            {
              urls: "stun:openrelay.metered.ca:80",
            },
            {
              urls: "turn:openrelay.metered.ca:80",
              username: "openrelayproject",
              credential: "openrelayproject",
            },
            {
              urls: "turn:openrelay.metered.ca:443",
              username: "openrelayproject",
              credential: "openrelayproject",
            },
            {
              urls: "turn:openrelay.metered.ca:443?transport=tcp",
              username: "openrelayproject",
              credential: "openrelayproject",
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
        className="h-2.5 rounded-full bg-amber-400"
        style={{ width: `${value}%` }}
      ></div>
    </div>
  );

  return (
    <div
      className="relative w-screen mx-auto flex h-screen bg-slate-900 bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://res.cloudinary.com/da3j9iqkp/image/upload/v1730989736/iqgxciixwtfburooeffb.svg')",
      }}
    >
      {/* Left Section */}
      <div className="flex w-full flex-col items-start justify-center gap-10 px-10 md:w-1/2 md:px-10">
        <h2 className="text-2xl font-extrabold text-white md:hidden">
          Receive Files Seamlessly
        </h2>
        <p className="text-base leading-relaxed text-gray-300 md:hidden lg:text-lg">
          Share and receive files instantly without interruptions.
        </p>
        <div className="text-center text-lg font-semibold text-white sm:text-xl">
          {isConnected ? (
            <div className="flex items-center justify-center gap-2">
              <BiSolidCircle className="text-[#24cc3e]" />
              <span>Connected</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <BiSolidCircle className="text-[#f34f4f]" />
              <span>Disconnected</span>
            </div>
          )}
        </div>

        {/* File Details */}
        <div className="h-24 w-full overflow-auto rounded-md bg-gray-800 p-4 text-white md:w-3/4">
          <h3 className="text-lg font-bold">File Details</h3>
          <div className="mt-2 text-sm">
            {fileDetail ? (
              <div className="flex flex-1 flex-wrap gap-3">
                {fileDetail.fileName.map((name) => (
                  <p key={name}>{name}</p>
                ))}
              </div>
            ) : (
              <p>No file selected yet.</p>
            )}
          </div>
        </div>

        {/* Download Button */}
        <button
          onClick={requestHostToSendOffer}
          className="h-10 w-32 rounded-md bg-amber-400 font-bold text-black shadow-lg transition hover:bg-amber-500"
          disabled={!shareCode}
        >
          Download
        </button>

        {/* Progress */}
        <div className="flex w-full flex-col items-center justify-center gap-4 text-lg font-semibold text-white sm:text-2xl md:w-3/4">
          <ProgressBar value={Number(percentage)} />
          {percentage}%
        </div>

        {Number(percentage) === 100 && (
          <div className="text-green-500">
            <p className="text-lg font-semibold">File Download Complete!</p>
          </div>
        )}

        {!isConnected && (
          <div className="mt-4 rounded-lg bg-yellow-100 px-4 py-3 text-yellow-800 shadow-md">
            <p className="font-semibold">⚠ Connection Lost</p>
            <p className="text-sm">
              Your connection was interrupted. Please{" "}
              <button
                onClick={() => window.location.reload()}
                className="text-yellow-900 underline hover:text-yellow-700"
              >
                refresh
              </button>{" "}
              to try again.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Receiver;
