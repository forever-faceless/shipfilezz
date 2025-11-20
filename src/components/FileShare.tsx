import React, { useEffect, useRef, useState } from "react";
import QRCode from "react-qr-code";
import { BsCopy } from "react-icons/bs";
import { BiSolidCircle } from "react-icons/bi";
import { Input } from "./ui/input";
import { Progress } from "@/components/ui/progress";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { Copy } from "lucide-react";

interface FileShareProps {
  files: File[];
}
// Need to do
const FileShare: React.FC<FileShareProps> = ({ files }) => {
  const socketRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const urlRef = useRef<HTMLInputElement | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const [shareCode, setShareCode] = useState<string | null>(null);
  const shareCodeRef = useRef<string | null>(null);
  const clientCodeRef = useRef<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [NearByShareCode, setNearByShareCode] = useState<string | null>(null);
  const shareCodeCopyRef = useRef<HTMLButtonElement | null>(null);
  const heartbeatIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null
  );
  const [isTransferComplete, setIsTransferComplete] = useState(false);
  const [transferError, setTransferError] = useState<string | null>(null);

  const CopyText = (text: string) => {
    if (text) {
      navigator.clipboard.writeText(text).catch((err) => {
        console.error("Failed to copy text: ", err);
      });
      toast("Copied");
    } else {
      toast("Not able to copy text");
    }
  };

  const RequestNearByShareCode = () => {
    const socket = socketRef.current;
    if (!socket) return null;
    socket.send(
      JSON.stringify({
        event: "EVENT_REQUEST_NEAR_BY_SHARE_CODE",
        shareCode,
      })
    );
  };

  const createOffer = async () => {
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

    const socket = socketRef.current;
    if (!socket) return;

    const pc = new RTCPeerConnection(rtcConfiguration);
    pcRef.current = pc;

    const dataChannel = pc.createDataChannel("fileTransfer", { ordered: true });
    dataChannel.binaryType = "arraybuffer";

    const CHUNK_SIZE = 16 * 1024;
    dataChannel.bufferedAmountLowThreshold = 64 * 1024;
    const BATCH_SIZE = 1024 * 1024;

    let currentFileIndex = 0;
    let offset = 0;
    let sending = false;
    let waitingForAck = false;
    let waitingForReady = true;
    let bytesSinceLastAck = 0;

    const sendMetadata = (file: File) => {
      dataChannel.send(
        JSON.stringify({
          type: "meta",
          fileName: file.name,
          fileSize: file.size,
          chunkSize: CHUNK_SIZE,
        })
      );
    };

    const pump = async () => {
      if (
        sending ||
        waitingForAck ||
        waitingForReady ||
        dataChannel.bufferedAmount > dataChannel.bufferedAmountLowThreshold
      ) {
        return;
      }
      sending = true;

      try {
        while (
          pc.connectionState === "connected" &&
          dataChannel.readyState === "open" &&
          !waitingForAck &&
          !waitingForReady &&
          dataChannel.bufferedAmount <= dataChannel.bufferedAmountLowThreshold
        ) {
          const file = files[currentFileIndex];
          if (!file) {
            setIsTransferComplete(true);
            return;
          }

          if (offset >= file.size) {
            // ✅ Wait until all buffered chunks are flushed before sending "done"
            await new Promise<void>((resolve) => {
              const checkBuffer = () => {
                if (dataChannel.bufferedAmount === 0) {
                  resolve();
                } else {
                  setTimeout(checkBuffer, 50);
                }
              };
              checkBuffer();
            });

            console.log("📤 Sending 'done' marker...");
            dataChannel.send(JSON.stringify({ type: "done" }));

            // ✅ Now wait for receiver to confirm full completion
            await new Promise<void>((resolve) => {
              const onMessage = (event: MessageEvent) => {
                try {
                  const msg = JSON.parse(event.data);
                  if (msg.type === "transfer-complete") {
                    console.log("✅ Receiver confirmed completion");
                    dataChannel.removeEventListener("message", onMessage);
                    resolve();
                  }
                } catch {
                  // ignore other messages
                }
              };
              dataChannel.addEventListener("message", onMessage);
            });

            currentFileIndex++;
            offset = 0;
            bytesSinceLastAck = 0;
            setProgress(0);

            if (currentFileIndex < files.length) {
              sendMetadata(files[currentFileIndex]);
              return pump(); // continue next file
            } else {
              setIsTransferComplete(true);
              console.log("🎉 All files transferred successfully");
              return;
            }
          }

          const chunk = file.slice(offset, offset + CHUNK_SIZE);
          const buf = await chunk.arrayBuffer();

          try {
            dataChannel.send(buf);
          } catch (err) {
            console.error("Send failed:", err);
            setTransferError("Failed to send chunk");
            return;
          }

          offset += chunk.size;
          bytesSinceLastAck += chunk.size;

          const progressPercentage = Math.min(
            Math.round((offset / file.size) * 100),
            100
          );
          setProgress(progressPercentage);

          if (bytesSinceLastAck >= BATCH_SIZE) {
            waitingForAck = true;
            break;
          }
        }
      } finally {
        sending = false;
      }
    };

    dataChannel.onopen = () => {
      console.log("Data channel open");
      setTransferError(null);
      setIsTransferComplete(false);
      if (files.length > 0) {
        sendMetadata(files[0]);
        waitingForReady = true;
      }
    };

    dataChannel.onmessage = (event) => {
      const data = event.data;
      if (typeof data !== "string") return;
      try {
        const msg = JSON.parse(data);
        if (msg.type === "ready") {
          waitingForReady = false;
          pump();
        } else if (msg.type === "ack") {
          waitingForAck = false;
          bytesSinceLastAck = 0;
          pump();
        }
      } catch {
        // ignore non-JSON control
      }
    };

    dataChannel.onbufferedamountlow = () => {
      pump();
    };

    dataChannel.onerror = (error) => {
      console.error("Data channel error:", error);
    };

    let isNegotiating = false;
    pc.onnegotiationneeded = async () => {
      if (isNegotiating) return; // prevents overlapping negotiation
      isNegotiating = true;
      try {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socket.send(
          JSON.stringify({
            event: "EVENT_OFFER",
            shareCode: shareCodeRef.current,
            clientId: clientCodeRef.current,
            offer,
          })
        );
      } catch (error) {
        console.error("Error during WebRTC negotiation:", error);
      } finally {
        isNegotiating = false; // allows future negotiations
      }
    };

    dataChannel.onclose = () => {
      console.log(
        "Data channel closed (reason: sender side  cleanup)",
        pc.connectionState
      );

      if (!isTransferComplete) {
        setTransferError("Data channel closed unexpectedly");
      }
    };

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.send(
          JSON.stringify({
            event: "EVENT_ICE_CANDIDATE",
            shareCode: shareCodeRef.current,
            clientId: clientCodeRef.current,
            candidate: event.candidate,
            from: "HOST",
          })
        );
      }
    };

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    socket.send(
      JSON.stringify({
        event: "EVENT_OFFER",
        shareCode: shareCodeRef.current,
        clientId: clientCodeRef.current,
        offer,
      })
    );
  };

  useEffect(() => {
    if (socketRef.current) return;
    const socket = new WebSocket(
      "wss://backend-service-707394683264.us-central1.run.app/"
    );
    socketRef.current = socket;

    socket.onopen = () => {
      setIsConnected(true);
      socket.send(
        JSON.stringify({
          event: "EVENT_REQUEST_SHARE_CODE",
          fileName: files.map((f) => f.name),
          fileLength: files.length,
        })
      );

      heartbeatIntervalRef.current = setInterval(() => {
        if (socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({ event: "EVENT_HEART_BEAT" }));
        }
      }, 10000);
    };

    socket.onmessage = async (ev) => {
      const msg = JSON.parse(ev.data);

      if (msg.event === "EVENT_REQUEST_SHARE_CODE") {
        setShareCode(msg.shareCode);
        shareCodeRef.current = msg.shareCode;
      } else if (msg.event === "EVENT_REQUEST_NEAR_BY_SHARE_CODE") {
        setNearByShareCode(msg.nearByShareCode);
      } else if (msg.event === "EVENT_REQUEST_HOST_TO_SEND_OFFER") {
        clientCodeRef.current = msg.clientId;
        shareCodeRef.current = msg.shareCode;
        createOffer();
      } else if (msg.event === "EVENT_ANSWER") {
        if (pcRef.current) {
          try {
            await pcRef.current.setRemoteDescription(msg.answer);
          } catch (err) {
            console.error("Error setting remote description:", err);
          }
        }
      } else if (msg.event === "EVENT_ICE_CANDIDATE") {
        if (pcRef.current) {
          try {
            await pcRef.current.addIceCandidate(
              new RTCIceCandidate(msg.candidate)
            );
          } catch (err) {
            console.error("Error adding ICE candidate:", err);
          }
        }
      }
    };

    socket.onclose = (ev) => {
      console.log("[WS] onclose", ev);
      setIsConnected(false);
      if (socketRef.current) return;
      const socket = new WebSocket(
        "wss://backend-service-707394683264.us-central1.run.app/"
      );
      socketRef.current = socket;

      socket.onopen = () => {
        setIsConnected(true);
        socket.send(
          JSON.stringify({
            event: "EVENT_REQUEST_SHARE_CODE",
            fileName: files.map((f) => f.name),
            fileLength: files.length,
          })
        );

        heartbeatIntervalRef.current = setInterval(() => {
          if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ event: "EVENT_HEART_BEAT" }));
          }
        }, 10000);
      };
    };
    socket.onerror = (err) => {
      console.error("[WS] onerror", err);
    };

    return () => {
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
        heartbeatIntervalRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files]);

  useEffect(() => {
    const checkConnection = () => {
      if (pcRef.current && pcRef.current.connectionState === "disconnected") {
        console.log("Connection lost, attempting to reconnect...");
      }
    };

    const interval = setInterval(checkConnection, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-auto w-full flex-col-reverse items-center justify-end gap-8 px-4 pt-8 text-white md:flex-row-reverse md:items-start md:justify-center md:px-8 md:pt-16">
      {/* Text Container */}
      <div className="flex w-full flex-col gap-6 md:w-2/5">
        <div className="flex items-center gap-3 text-lg font-bold md:text-xl">
          {isConnected ? (
            <BiSolidCircle className="text-[#24cc3e]" />
          ) : (
            <BiSolidCircle className="text-[#f34f4f]" />
          )}
          <p>Status</p>
        </div>

        <div className="flex flex-col gap-6">
          {shareCode ? (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-center gap-3">
                <Input
                  ref={urlRef}
                  className="h-10 w-full rounded-lg bg-white px-2 text-sm text-black md:w-[85%] md:text-lg"
                  value={`https://www.shipfilez.app/receiver?code=${shareCode}`}
                  readOnly
                />
                <button
                  className="rounded-md text-xl text-white md:text-3xl"
                  onClick={() => CopyText(urlRef.current!.value)}
                >
                  <BsCopy />
                </button>
              </div>
            </div>
          ) : (
            <div className="text-sm md:text-base">Waiting for message...</div>
          )}
          <div className="flex flex-col gap-5">
            {!NearByShareCode ? (
              <Button
                className="relative h-14 w-full max-w-md bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl hover:from-yellow-500 hover:to-amber-600 transition-all duration-300 group overflow-hidden md:w-80"
                onClick={RequestNearByShareCode}
              >
                {/* Animated background effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="flex items-center justify-center gap-3 relative z-10">
                  <div className="relative">
                    <svg
                      className="w-6 h-6 group-hover:animate-pulse"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                      />
                    </svg>
                  </div>
                  <span className="">Generate Share Code</span>
                </div>
              </Button>
            ) : (
              <Button
                className="h-12 w-full cursor-pointer items-center justify-center rounded-lg bg-yellow-400 text-base font-semibold text-black hover:bg-yellow-500 md:h-14 md:w-fit md:text-xl"
                ref={shareCodeCopyRef}
                onClick={() => CopyText(NearByShareCode)}
              >
                {NearByShareCode}
                <span>
                  <Copy />
                </span>
              </Button>
            )}
          </div>
          <Progress value={progress} className="w-full text-yellow-400" />
          <div>
            {progress > 0 && !isTransferComplete && !transferError && (
              <p className="text-sm">
                Transfer Progress: {progress}%{" "}
                {progress === 100 ? " - Finalizing..." : ""}
              </p>
            )}
          </div>
          {transferError && (
            <div className="mt-4 rounded-lg bg-red-100 p-4 text-red-700">
              <p className="font-semibold">Transfer Error</p>
              <p className="text-sm">{transferError}</p>
              Refresh the page to try again.
            </div>
          )}

          {isTransferComplete && (
            <div className="mt-4 rounded-lg bg-green-100 p-4 text-green-700">
              <p className="font-semibold">Transfer Complete!</p>
              <p className="text-sm">All files were transferred successfully</p>
            </div>
          )}
        </div>
      </div>

      <div className="relative flex w-[70%] items-center justify-center md:w-auto">
        <QRCode
          bgColor="#ffffff"
          fgColor="#000000"
          style={{ height: "auto", width: "100%" }}
          value={`https://www.shipfilez.app/receiver?code=${shareCode}`}
          viewBox="0 0 256 256"
          className="w-1/2 sm:w-2/3 md:w-1/3 lg:w-1/4 xl:w-1/5"
        />
      </div>
    </div>
  );
};

export default FileShare;
