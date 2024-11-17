"server only";

import { PinataSDK } from "pinata";

export const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT,
  pinataGateway: process.env.GATEWAY_URL,
});

export async function uploadFile(file, metadata = {}) {
  try {
    console.log("Uploading file to Pinata...");
    const response = await pinata.upload.file(file, {
      name: metadata.name || "file",
      keyvalues: metadata.keyvalues || {},
    });
    console.log("File uploaded successfully:", response.data);
    return response;
  } catch (error) {
    console.error("Error uploading file to Pinata:", error);
    throw error;
  }
}
