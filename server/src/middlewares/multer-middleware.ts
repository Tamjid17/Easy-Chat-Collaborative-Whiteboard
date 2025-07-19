import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter = (req: any, file: any, cb: any) => {
    if(file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error("Not an image! Please upload only images."), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 1 * 1024 * 1024 }
})

export default upload;