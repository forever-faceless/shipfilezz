import { useState } from "react";
import { FileUpload } from "./ui/File-Upload";
import FileShare from "./FileShare";

const FileComponent = () => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleFileChange = (files: File[]) => {
    setUploadedFiles((prevFiles) => [...prevFiles, ...files]);
  };

  return (
    <div className="w-full h-full">
      {uploadedFiles.length === 0 ? (
        <FileUpload onChange={handleFileChange} />
      ) : (
        <FileShare files={uploadedFiles} />
      )}
    </div>
  );
};

export default FileComponent;
