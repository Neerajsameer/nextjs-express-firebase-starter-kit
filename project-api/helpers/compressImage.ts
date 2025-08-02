import axios from "axios";
import createCloudTask from "./cloud_tasks";
import { ADMIN_SECRET } from "./globals";

export async function asyncCompressImages(files: any[] = []) {
  const promises: Promise<any>[] = [];
  for (const file of files) {
    // if (file.file_type !== FileType.IMAGE) continue;

    if (process.env.NODE_ENV !== "development") {
      promises.push(
        createCloudTask([
          {
            queue: "image-compressor",
            httpBody: {
              url: "/internal/compress_image",
              method: "POST",
              headers: { api_key: ADMIN_SECRET },
              body: file,
            },
          },
        ])
      );
    } else {
      promises.push(
        axios.post("http://localhost:8080/internal/compress_image", file, { headers: { api_key: ADMIN_SECRET! } })
      );
    }
  }

  return Promise.all(promises);
}
