import { UploadApiResponse } from "cloudinary";
import cloudinary from "../../interface/http/external/cloudinary";

export const uploadImageToCloudinaryService = async (
  fileBuffer: Buffer,
  filename: string
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        { resource_type: "image", public_id: `memories/${filename}` },
        (error, result) => {
          if (error || !result) reject(error);
          else resolve(result);
        }
      )
      .end(fileBuffer);
  });
};
