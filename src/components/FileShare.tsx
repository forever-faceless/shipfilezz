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
  const [downloadedFilesCount, setDownloadedFilesCount] = useState<number>(0);

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
            setDownloadedFilesCount(currentFileIndex);
            offset = 0;
            bytesSinceLastAck = 0;
            setProgress(0);

            if (currentFileIndex < files.length) {
              sendMetadata(files[currentFileIndex]);
              return pump();
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

    socket.onclose = () => {
      setIsConnected(false);
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
        heartbeatIntervalRef.current = null;
      }
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
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
    <div className="flex h-auto w-full flex-col-reverse md:flex-row items-center justify-center gap-8 px-4 md:px-10 pt-8 md:pt-16">
      {/* LEFT: Status + Controls */}
      <div className="flex-1 flex justify-center">
        <div className="w-full max-w-xl space-y-6 rounded-3xl bg-slate-900/50 backdrop-blur-xl border border-white/15 px-5 py-6 sm:px-7 sm:py-8 shadow-2xl text-white">
          {/* Status row */}
          <div className="flex items-center gap-3 text-sm sm:text-base font-semibold">
            <div
              className={`
            inline-flex items-center gap-2 rounded-full px-3 py-1
            ${isConnected ? "bg-emerald-500/20" : "bg-rose-500/20"}
          `}
            >
              <BiSolidCircle
                className={isConnected ? "text-[#24cc3e]" : "text-[#f34f4f]"}
              />
              <span className="uppercase tracking-wide text-[0.7rem] sm:text-xs">
                {isConnected ? "Connected" : "Disconnected"}
              </span>
            </div>
            <span className="text-xs sm:text-sm text-white/80">
              ShareFilez Host Panel
            </span>
          </div>

          {/* Share URL + Copy */}
          <div className="space-y-3">
            <p className="text-sm sm:text-base text-white">
              Send this link to your receiver to start the transfer:
            </p>

            {shareCode ? (
              <div className="flex items-center gap-3">
                <Input
                  ref={urlRef}
                  className="h-11 w-full rounded-xl bg-white text-black text-xs sm:text-sm px-3 md:text-base"
                  value={`https://sharefilez.vercel.app/receiver?code=${shareCode}`}
                  readOnly
                />
                <button
                  className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 border border-white/25 text-xl text-white md:text-2xl hover:bg-white/20 active:scale-95 transition"
                  onClick={() => CopyText(urlRef.current!.value)}
                >
                  <BsCopy />
                </button>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-white/30 bg-white/5 px-4 py-3 text-sm md:text-base text-white/85">
                Waiting for share code… Generate one to get started.
              </div>
            )}
          </div>

          {/* Generate / Show Share Code */}
          <div className="space-y-3">
            <p className="text-xs sm:text-sm uppercase tracking-wide text-white/70">
              Nearby share
            </p>
            {!NearByShareCode ? (
              <Button
                className="relative h-14 w-fit rounded-2xl bg-[#0263eb] px-6 text-white font-bold text-sm sm:text-lg shadow-lg hover:shadow-2xl transition-all duration-300 group overflow-hidden"
                onClick={RequestNearByShareCode}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10 flex items-center justify-center gap-3">
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 group-hover:animate-pulse"
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
                  <span>Generate Nearby Share Code</span>
                </div>
              </Button>
            ) : (
              <Button
                className="flex h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm sm:text-lg font-semibold text-white hover:bg-blue-400 md:h-14"
                ref={shareCodeCopyRef}
                onClick={() => CopyText(NearByShareCode)}
              >
                {NearByShareCode}
                <Copy className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            )}
          </div>

          {/* Stats + Progress */}
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm md:text-base">
              <div className="rounded-xl bg-white/5 px-3 py-2 border border-white/15">
                <p className="text-white/70 text-[0.7rem] sm:text-xs uppercase tracking-wide">
                  Files selected
                </p>
                <p className="text-lg sm:text-xl font-semibold text-white">
                  {files.length}
                </p>
              </div>
              <div className="rounded-xl bg-white/5 px-3 py-2 border border-white/15">
                <p className="text-white/70 text-[0.7rem] sm:text-xs uppercase tracking-wide">
                  Files delivered
                </p>
                <p className="text-lg sm:text-xl font-semibold text-white">
                  {downloadedFilesCount}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs sm:text-sm text-white/80">
                <span>Transfer progress</span>
                <span className="font-semibold">{progress}%</span>
              </div>
              <Progress value={progress} className="w-full" />
              {progress > 0 && !isTransferComplete && !transferError && (
                <p className="text-xs sm:text-sm text-white/85">
                  Transfer in progress…{" "}
                  {progress === 100 ? "Finalizing files on receiver…" : ""}
                </p>
              )}
            </div>
          </div>

          {/* Alerts */}
          {transferError && (
            <div className="mt-2 rounded-xl bg-red-500/15 border border-red-400/60 p-4 text-red-100 text-sm sm:text-base">
              <p className="font-semibold">Transfer error</p>
              <p className="mt-1 text-xs sm:text-sm">{transferError}</p>
              <p className="mt-1 text-xs sm:text-sm text-red-100/90">
                Refresh the page to try again.
              </p>
            </div>
          )}

          {isTransferComplete && (
            <div className="mt-2 rounded-xl bg-emerald-500/15 border border-emerald-400/60 p-4 text-emerald-100 text-sm sm:text-base">
              <p className="font-semibold">Transfer complete!</p>
              <p className="mt-1 text-xs sm:text-sm">
                All files were transferred successfully.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT: QR Code */}
      <div className="flex justify-center md:justify-end flex-1">
        <div className="rounded-3xl bg-slate-900/50 backdrop-blur-xl border border-white/15 px-5 py-6 sm:px-7 sm:py-8 flex flex-col items-center gap-4 shadow-2xl text-white">
          <p className="text-xs sm:text-sm uppercase tracking-wide text-white/80">
            Scan to receive
          </p>
          <QRCode
            bgColor="#ffffff"
            fgColor="#000000"
            style={{ height: "auto", width: "100%" }}
            value={`https://sharefilez.vercel.app/receiver?code=${shareCode}`}
            viewBox="0 0 256 256"
            className="w-40 h-40 sm:w-52 sm:h-52 md:w-56 md:h-56"
          />
          <p className="text-[0.7rem] sm:text-xs text-white/80 text-center max-w-[14rem]">
            Point your camera or QR scanner to open the receiver page instantly.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FileShare;
