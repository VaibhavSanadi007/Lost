import multer from "multer";

const MemoryStorage = multer.memoryStorage();
const upload = multer({storage:MemoryStorage, limits:{fileSize:150 * 1024 * 1024}});

export default upload;
