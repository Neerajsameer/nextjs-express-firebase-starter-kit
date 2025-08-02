import AWS from "aws-sdk";

class s3Storage {
  s3 = new AWS.S3({
    region: "auto",
    endpoint: process.env.R2_ENDPOINT,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
    signatureVersion: "v4",
  });

  Bucket = process.env.R2_BUCKET!;

  async getObject(path: string) {
    return this.s3.getObject({ Bucket: this.Bucket, Key: path }).promise();
  }

  async putObject(path: string, body: any, ContentType?: string) {
    return this.s3.putObject({ Bucket: this.Bucket, Key: path, Body: body, ContentType }).promise();
  }

  async deleteObject(filePath: string) {
    await this.s3.deleteObject({ Bucket: this.Bucket, Key: filePath }).promise();
  }

  async copyObject(sourcePath: string, destinationPath: string) {
    return this.s3
      .copyObject({
        Bucket: this.Bucket,
        CopySource: `${this.Bucket}/${sourcePath}`,
        Key: destinationPath,
      })
      .promise();
  }

  async deleteObjects(filePaths: string[]) {
    while (filePaths.length > 0) {
      const chunk = filePaths.splice(0, 500);

      await this.s3
        .deleteObjects({
          Bucket: this.Bucket,
          Delete: { Objects: chunk.map((x) => ({ Key: x })) },
        })
        .promise();
    }
  }

  async listFiles(prefix: string) {
    let continuationToken: string | undefined = undefined;
    let allFiles: string[] = [];

    do {
      const data: any = await this.s3
        .listObjectsV2({
          Bucket: this.Bucket,
          Prefix: prefix,
          MaxKeys: 1000,
          ContinuationToken: continuationToken,
        })
        .promise();

      if (data.Contents && data.Contents.length > 0) {
        allFiles = allFiles.concat(data.Contents.map((file: any) => file.Key!.split("/")[1]));
      }

      continuationToken = data.NextContinuationToken;
    } while (continuationToken);

    return allFiles;
  }

  async getUploadFileUrl(file_path?: string | null, expiry: number = 120) {
    if (!file_path) return null;
    const get_url = await this.s3.getSignedUrlPromise("putObject", {
      Bucket: this.Bucket,
      Key: file_path,
      Expires: expiry,
    });
    return get_url;
  }

  async getDownloadFileUrl(file_path?: string | null, expiry: number = 1800) {
    if (!file_path) return null;
    const get_url = await this.s3.getSignedUrlPromise("getObject", {
      Bucket: this.Bucket,
      Key: file_path,
      Expires: expiry,
    });
    return get_url;
  }

  async paginateAndGetAllFiles(prefix: string) {
    let continuationToken: string | undefined = undefined;
    let allFiles: string[] = [];
    do {
      const data: any = await this.s3
        .listObjectsV2({ Bucket: this.Bucket, Prefix: prefix, ContinuationToken: continuationToken })
        .promise();
      allFiles = allFiles.concat(data.Contents!.map((file: any) => file.Key!.split("/")[1]));
      continuationToken = data.NextContinuationToken;
    } while (continuationToken);
    return allFiles;
  }

  // async compressAndSaveImage(filePath: string) {
  //   const prefix = filePath.split("/")[0];
  //   const fileName = filePath.split("/")[1];

  //   const fileExtension = fileName.split(".").pop();
  //   if (!/(jpeg|jpg|png)$/i.test(fileExtension || "")) return;

  //   const originalImage = await this.getObject(filePath);

  //   const compressedImage = await sharp(originalImage.Body as Buffer)
  //     .resize({ fit: "cover", width: 512 }) // Optional: resize if you want to change dimensions
  //     .rotate()
  //     .jpeg({ quality: 80 }) // For JPEG
  //     .png({ quality: 80 }) // For PNG
  //     .toBuffer();

  //   const compressedKey = fileName.replace(/(\.jpeg|\.jpg|\.png)$/i, "_c256$1");

  //   await this.putObject(prefix + "/" + compressedKey, compressedImage, `image/${fileExtension}`);
  // }

  // check if file exists
  async fileExists(filePath: string) {
    try {
      await this.s3.headObject({ Bucket: this.Bucket, Key: filePath }).promise();
      return true;
    } catch (err: any) {
      return false;
    }
  }

  async copyFile(oldPath: string, newPath: string) {
    await this.s3.copyObject({ Bucket: this.Bucket, CopySource: `${this.Bucket}/${oldPath}`, Key: newPath }).promise();
  }
}

export const storage = new s3Storage();
