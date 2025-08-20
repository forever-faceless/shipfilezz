import React, { useEffect, useRef, useState } from "react";
import QRCode from "react-qr-code";
import { BsCopy } from "react-icons/bs";
import { BiSolidCircle } from "react-icons/bi";
import { Input } from "./ui/input";
import { Progress } from "@/components/ui/progress";
import { Button } from "./ui/button";
import { toast } from "sonner";

interface FileShareProps {
  files: File[];
}

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

  const getOptimalChunkSize = (fileSize: number) => {
    if (fileSize > 2 * 1024 * 1024 * 1024) {
      // >2GB
      return 256 * 1024; // 256KB
    } else if (fileSize > 1 * 1024 * 1024 * 1024) {
      // >1GB
      return 128 * 1024; // 128KB
    }
    return 64 * 1024; // 64KB
  };

  const recoverTransfer = async () => {
    if (pcRef.current && pcRef.current.connectionState === "failed") {
      console.log("Attempting to recover transfer...");
      setTransferError(null);
      await createOffer();
    }
  };

  const createOffer = async () => {
    const rtcConfiguration = {
      iceServers: [
        { urls: "stun:stun.relay.metered.ca:80" },
        {
          urls: "turn:global.relay.metered.ca:80",
          username: "096620311d4630e63e7aa164",
          credential: "vhSv/yxKuDdKj5XM",
        },
        {
          urls: "turn:global.relay.metered.ca:80?transport=tcp",
          username: "096620311d4630e63e7aa164",
          credential: "vhSv/yxKuDdKj5XM",
        },
        {
          urls: "turn:global.relay.metered.ca:443",
          username: "096620311d4630e63e7aa164",
          credential: "vhSv/yxKuDdKj5XM",
        },
        {
          urls: "turns:global.relay.metered.ca:443?transport=tcp",
          username: "096620311d4630e63e7aa164",
          credential: "vhSv/yxKuDdKj5XM",
        },
      ],
    };

    const socket = socketRef.current;
    if (!socket) return;

    const pc = new RTCPeerConnection(rtcConfiguration);
    pcRef.current = pc;

    // create a data channel
    const dataChannel = pc.createDataChannel("fileTransfer", { ordered: true });
    dataChannel.binaryType = "arraybuffer";

    // ---- Backpressure setup ----
    dataChannel.bufferedAmountLowThreshold = 8 * 1024 * 1024; // 8 MB threshold

    async function sendArrayBuffer(buf: ArrayBuffer) {
      const MAX_RETRIES = 10;
      const RETRY_DELAY = 100; // ms
      let retries = 0;

      while (dataChannel.bufferedAmount > 8 * 1024 * 1024) {
        if (retries >= MAX_RETRIES) {
          throw new Error("Backpressure timeout - buffer not draining");
        }

        console.log(
          "⏸ Waiting, buffered:",
          (dataChannel.bufferedAmount / 1024 / 1024).toFixed(2),
          "MB"
        );

        await new Promise<void>((resolve) => {
          const timeout = setTimeout(() => {
            resolve();
          }, RETRY_DELAY);

          const bufferedAmountLowHandler = () => {
            clearTimeout(timeout);
            resolve();
          };

          dataChannel.addEventListener(
            "bufferedamountlow",
            bufferedAmountLowHandler as EventListener,
            { once: true }
          );
        });

        retries++;
      }

      try {
        dataChannel.send(buf);
        console.log(
          "📤 Sent chunk, buffered now:",
          (dataChannel.bufferedAmount / 1024 / 1024).toFixed(2),
          "MB"
        );
      } catch (error) {
        console.error("Failed to send chunk:", error);
        throw error;
      }
    }

    // sender state
    let currentFileIndex = 0;
    let offset = 0;

    const sendMetadata = (file: File) => {
      const maxChunkSize = getOptimalChunkSize(file.size);
      dataChannel.send(
        JSON.stringify({
          type: "meta",
          fileName: file.name,
          fileSize: file.size,
          chunkSize: maxChunkSize,
        })
      );
    };

    const sendNextChunk = async () => {
      try {
        const file = files[currentFileIndex];
        if (!file) {
          setIsTransferComplete(true);
          return;
        }

        if (offset >= file.size) {
          // finished this file
          dataChannel.send(JSON.stringify({ type: "done" }));
          currentFileIndex++;
          offset = 0;
          setProgress(0);

          if (currentFileIndex < files.length) {
            sendMetadata(files[currentFileIndex]);
          } else {
            setIsTransferComplete(true);
            console.log("All files transferred successfully");
          }
          return;
        }

        const maxChunkSize = getOptimalChunkSize(file.size);
        const chunk = file.slice(offset, offset + maxChunkSize);
        const arrayBuffer = await chunk.arrayBuffer();

        await sendArrayBuffer(arrayBuffer); // backpressure aware
        offset += chunk.size;

        const progressPercentage = Math.min(
          Math.round((offset / file.size) * 100),
          100
        );
        setProgress(progressPercentage);
      } catch (error) {
        console.error("Error in sendNextChunk:", error);
        setTransferError(`Transfer failed: ${(error as Error).message}`);
      }
    };

    // handle incoming control messages from receiver
    dataChannel.onmessage = (event) => {
      const data = event.data;
      if (typeof data === "string") {
        try {
          const msg = JSON.parse(data);
          if (msg.type === "ack") {
            sendNextChunk();
          } else if (msg.type === "ready") {
            sendNextChunk();
          }
        } catch {
          // ignore
        }
      }
    };

    dataChannel.onopen = () => {
      setTransferError(null);
      setIsTransferComplete(false);
      if (files.length > 0) {
        sendMetadata(files[0]);
      }
    };

    dataChannel.onerror = (error) => {
      console.error("Data channel error:", error);
      setTransferError(
        `Transfer error: ${error.error?.message || "Unknown error"}`
      );

      // Attempt recovery for non-fatal errors
      if (error.error?.name !== "OperationError") {
        setTimeout(() => recoverTransfer(), 2000);
      }
    };

    dataChannel.onclose = () => {
      console.log("Data channel closed");
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

    let isNegotiating = false;
    pc.onnegotiationneeded = async () => {
      if (isNegotiating) return;
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
        isNegotiating = false;
      }
    };

    pc.onconnectionstatechange = () => {
      console.log("PC state:", pc.connectionState);

      if (pc.connectionState === "connected") {
        console.log("WebRTC connection established");
      } else if (
        pc.connectionState === "disconnected" ||
        pc.connectionState === "failed"
      ) {
        if (!isTransferComplete) {
          setTransferError("Connection lost during transfer");
          console.error("Connection lost before transfer completed");
        }
        pc.close();
        pcRef.current = null;
      }
    };
  };

  // WebSocket + signaling setup
  useEffect(() => {
    if (socketRef.current) return;
    const socket = new WebSocket("wss://api.shipfilez.app");
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
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
      if (pcRef.current) {
        pcRef.current.close();
        pcRef.current = null;
      }
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
        heartbeatIntervalRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files]);

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
                  value={`http://localhost:5173/receiver?code=${shareCode}`}
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
                className="md:text-md h-10 w-full bg-yellow-400 text-sm font-bold text-black hover:bg-yellow-500 md:h-11 md:w-60"
                onClick={RequestNearByShareCode}
              >
                Share with nearby devices
              </Button>
            ) : (
              <Button
                className="h-12 w-full cursor-pointer items-center justify-center rounded-lg bg-yellow-400 text-base font-semibold text-black hover:bg-yellow-500 md:h-14 md:w-fit md:text-xl"
                ref={shareCodeCopyRef}
                onClick={() => CopyText(NearByShareCode)}
              >
                {NearByShareCode}
              </Button>
            )}
          </div>
          <Progress value={progress} className="w-full text-yellow-400" />

          {/* Error and Status Messages */}
          {transferError && (
            <div className="mt-4 rounded-lg bg-red-100 p-4 text-red-700">
              <p className="font-semibold">Transfer Error</p>
              <p className="text-sm">{transferError}</p>
              <Button
                className="mt-2 bg-red-600 hover:bg-red-700"
                onClick={recoverTransfer}
              >
                Retry Transfer
              </Button>
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

      {/* QR Code Container */}
      <div className="relative flex w-[70%] items-center justify-center md:w-auto">
        <QRCode
          bgColor="#ffffff"
          fgColor="#000000"
          style={{ height: "auto", width: "100%" }}
          value={`https://shipfilez.app/receiver?code=${shareCode}`}
          viewBox="0 0 256 256"
          className="w-1/2 sm:w-2/3 md:w-1/3 lg:w-1/4 xl:w-1/5"
        />
      </div>
    </div>
  );
};

export default FileShare;
