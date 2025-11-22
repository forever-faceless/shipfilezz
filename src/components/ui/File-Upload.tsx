import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { useDropzone } from "react-dropzone";
import { cn } from "@/lib/utils";

const mainVariant = {
  initial: {
    x: 0,
    y: 0,
  },
  animate: {
    x: 20,
    y: -20,
    opacity: 0.9,
  },
};

const secondaryVariant = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
};

export const FileUpload = ({
  onChange,
}: {
  onChange?: (files: File[]) => void;
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (newFiles: File[]) => {
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    onChange && onChange(newFiles);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const { getRootProps, isDragActive } = useDropzone({
    multiple: true,
    noClick: true,
    onDrop: handleFileChange,
    onDropRejected: (error) => {
      console.log(error);
    },
  });

  return (
    <div
      className="flex w-full h-full items-center justify-center "
      {...getRootProps()}
    >
      <motion.div
        onClick={handleClick}
        whileHover="animate"
        className="group/file relative block w-full cursor-pointer overflow-hidden rounded-lg p-10 "
      >
        <input
          ref={fileInputRef}
          id="file-upload-handle"
          type="file"
          multiple
          onChange={(e) => handleFileChange(Array.from(e.target.files || []))}
          className="hidden"
        />
        {!files.length && (
          <motion.div
            layoutId="file-upload"
            variants={mainVariant}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
            }}
            className={cn(
              "border-dash-custom relative group-hover/file:shadow-2xl z-40 bg-[#0263eb] flex flex-col items-center justify-center gap-4 h-[40vh] w-[60vw] md:w-[40vw] lg:w-[20vw] mx-auto rounded-3xl",
              "border-2 border-dashed border-[#ffd500]/40 transition-all duration-300",
              "hover:shadow-lg hover:scale-[1.02] hover:border-[#ffd500]/70",
              "hover:shadow-[#ffd500]/10 hover:bg-[#0f172b]/90",
              "bg-[#003B8E] border border-white/20 shadow-xl"
            )}
          >
            {isDragActive ? (
              <motion.div
                className="flex flex-col items-center justify-center gap-4 min-h-full min-w-full p-4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.1 }}
              >
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 0.1,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                >
                  <img
                    src="https://res.cloudinary.com/da3j9iqkp/image/upload/v1730913391/t4bws90sqw3vosvrzsy9.svg"
                    width={120}
                    height={120}
                    alt="upload icon"
                    className="filter brightness-0 invert bg-zinc-950"
                  />
                </motion.div>
                <motion.div
                  className="text-[#ffd500] text-center font-medium text-lg"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  Drop your files here
                </motion.div>
                <motion.div
                  className="text-[#ffd500]/80 text-center text-sm mt-2"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  We'll take care of the rest
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                className="flex flex-col items-center justify-center gap-4 p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  whileHover={{
                    scale: 1.05,
                    transition: { duration: 0.2 },
                  }}
                >
                  <img
                    src="https://res.cloudinary.com/da3j9iqkp/image/upload/v1730913391/t4bws90sqw3vosvrzsy9.svg"
                    width={80}
                    height={90}
                    alt="upload icon"
                    className="opacity-90"
                  />
                </motion.div>
                <div className="text-[#ffd500] text-center font-medium text-xl">
                  Upload Files
                </div>
                <div className="text-[#ffd500]/80 text-center text-sm">
                  or drag & drop here
                </div>
              </motion.div>
            )}

            {/* Subtle background pattern */}
            <div className="absolute inset-0 overflow-hidden rounded-3xl">
              <div className="absolute -inset-4 opacity-5">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_#ffd500_1px,_transparent_0)] bg-[size:20px_20px]"></div>
              </div>
            </div>

            {/* Glowing effect on hover */}
            <div className="absolute inset-0 rounded-3xl opacity-0 group-hover/file:opacity-100 transition-opacity duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-[#ffd500]/10 via-transparent to-[#ffd500]/5 rounded-3xl"></div>
              <div className="absolute inset-0 bg-radial at-center from-[#ffd500]/5 to-transparent"></div>
            </div>
          </motion.div>
        )}

        {!files.length && (
          <motion.div
            variants={secondaryVariant}
            className="absolute inset-0 z-30 mx-auto mt-14 flex h-[40vh] w-[20vw] items-center justify-center rounded-3xl border border-dashed border-sky-400 bg-transparent opacity-0"
          ></motion.div>
        )}
      </motion.div>
    </div>
  );
};
