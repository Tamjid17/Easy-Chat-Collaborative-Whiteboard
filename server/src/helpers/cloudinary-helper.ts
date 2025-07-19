import cloudinary from "../config/cloudinary";

type CloudinaryUploadResult = {
    secure_url: string;
    public_id: string;
};

export const uploadImageFromBuffer = async (fileBuffer: Buffer): Promise<CloudinaryUploadResult> => {
    return new Promise((resolve, reject) =>{

        const uploadStream = cloudinary.uploader.upload_stream(
            { resource_type: 'image' },
            (error, result) => {
                if (error || !result) {
                    return reject(
                        error || new Error("Cloudinary upload failed.")
                    );
                }
                resolve({
                    secure_url: result.secure_url,
                    public_id: result.public_id,
                });
            }
        );
        uploadStream.end(fileBuffer);
    });
}

export default uploadImageFromBuffer;