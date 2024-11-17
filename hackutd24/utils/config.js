"server only";

import { PinataSDK } from "pinata";

export const pinata = new PinataSDK({
  pinataJwt: `${process.env.PINATA_JWT}`,
  pinataGateway: `${process.env.NEXT_PUBLIC_GATEWAY_URL}`,
});

// Utility function to upload model files
export async function uploadModel(file, metadata) {
  try {
    const response = await pinata.upload
      .file(file)
      .addMetadata({
        name: metadata.name,
        keyvalues: {
          framework: metadata.framework,
          metrics: JSON.stringify(metadata.metrics),
          parameters: JSON.stringify(metadata.parameters),
        },
      })
      .group(process.env.MODELS_GROUP_ID);

    return response;
  } catch (error) {
    console.error("Model upload failed:", error);
    throw error;
  }
}

// Utility function to upload datasets
export async function uploadDataset(file, metadata) {
  try {
    const response = await pinata.upload
      .file(file)
      .addMetadata({
        name: metadata.name,
        keyvalues: {
          schema: JSON.stringify(metadata.schema),
          statistics: JSON.stringify(metadata.statistics),
        },
      })
      .group(process.env.DATASETS_GROUP_ID);

    return response;
  } catch (error) {
    console.error("Dataset upload failed:", error);
    throw error;
  }
}
