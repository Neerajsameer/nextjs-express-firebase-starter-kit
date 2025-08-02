import { Express } from "express";
import errorHandler, { ERROR_CODES } from "../../../helpers/errorHandler";
import { responseWrapper } from "../../../helpers/responseWrapper";
import { storage } from "../../../helpers/s3";

const ROUTE_SIGNED_URL = "/get-signed-url";

export default function (app: Express) {
  app.post(ROUTE_SIGNED_URL, async (req, res) => {
    return await responseWrapper(req, res, async () => {
      const { file_path } = req.body;
      if (!file_path) throw errorHandler(ERROR_CODES.MISSING_PARAMS, "file_path");

      const uploadSignedUrl = await storage.getUploadFileUrl(file_path);
      const downloadSignedUrl = await storage.getDownloadFileUrl(file_path);

      return {
        responseData: {
          upload_signed_url: uploadSignedUrl,
          download_signed_url: downloadSignedUrl,
        },
      };
    });
  });
}
