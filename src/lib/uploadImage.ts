import imagekit from '../config/imageKitConfig';

export async function uploadImage(file: File): Promise<string | null> {
  try {
    const folderPath = 'products';

    // Convert the file to base64 (ImageKit requires base64)
    const base64String = await convertFileToBase64(file);

    // Upload to ImageKit
    const uploadResponse = await imagekit.upload({
      file: base64String, // Base64 string
      fileName: file.name, // Original file name
      useUniqueFileName: true,
      folder: folderPath,
    });

    return uploadResponse.url; // Return the uploaded image URL
  } catch (error: any) {
    console.error('Image upload error:', error.message);
    return null;
  }
}

// ✅ Convert File to Base64 for ImageKit Upload in Node.js
async function convertFileToBase64(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer()); // Convert File to Buffer
  return `data:${file.type};base64,${buffer.toString('base64')}`; // Convert to Base64
}
