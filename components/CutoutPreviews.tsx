import { FileMosaic } from "@files-ui/react";
import { ExtFile } from "@files-ui/react";

interface FileMosaicComponentProps {
  singleFile: ExtFile;
  multipleFiles: ExtFile[];
}

const FileMosaicComponent: React.FC<FileMosaicComponentProps> = ({ singleFile, multipleFiles }) => {
  return (
    <div className="flex">
      <FileMosaic
        key={singleFile.id}
        {...singleFile}
        info
        preview
        uploadStatus={singleFile.uploadStatus}
        className="mr-5"
      />
      <div>
        {multipleFiles.length > 0 ? multipleFiles.map(file => (
          <FileMosaic
            key={file.id}
            {...file}
            info
            preview
            uploadStatus={file.uploadStatus}
            downloadUrl={file.imageUrl}
            className="mb-5"
          />
        )) : <img src="/placeholder.png" alt="Placeholder" />}
      </div>
    </div>
  );
};

export default FileMosaicComponent;