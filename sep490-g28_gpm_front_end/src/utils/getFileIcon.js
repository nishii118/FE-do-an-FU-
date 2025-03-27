import DescriptionIcon from "@mui/icons-material/Description";
import ImageIcon from "@mui/icons-material/Image";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import AudiotrackIcon from "@mui/icons-material/Audiotrack";
import MovieIcon from "@mui/icons-material/Movie";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";

export const getFileIcon = (fileURL) => {
    const extension = fileURL?.split(".").pop().toLowerCase();
    switch (extension) {
        case "jpg":
        case "jpeg":
        case "png":
        case "gif":
            return <ImageIcon />;
        case "pdf":
            return <PictureAsPdfIcon />;
        case "mp3":
        case "wav":
            return <AudiotrackIcon />;
        case "mp4":
        case "avi":
            return <MovieIcon />;
        case "doc":
        case "docx":
        case "txt":
            return <DescriptionIcon />;
        default:
            return <InsertDriveFileIcon />;
    }
};