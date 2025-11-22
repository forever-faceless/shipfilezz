import { FileUpload } from "./ui/File-Upload";
import FileShare from "./FileShare";

interface FileComponentProps {
  uploadedFiles: File[];
  setUploadedFiles: React.Dispatch<React.SetStateAction<File[]>>;
}

const FileComponent: React.FC<FileComponentProps> = ({
  uploadedFiles,
  setUploadedFiles,
}) => {
  const handleFileChange = (files: File[]) => {
    setUploadedFiles((prevFiles) => [...prevFiles, ...files]);
  };
  return (
    <>
      {uploadedFiles.length === 0 ? (
        <FileUpload onChange={handleFileChange} />
      ) : (
        <FileShare files={uploadedFiles} />
      )}
    </>
  );
};

export default FileComponent;
