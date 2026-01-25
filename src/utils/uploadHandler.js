import imageCompression from 'browser-image-compression';
import { supabase } from "../supabaseClient";

export const uploadDisplayPhoto = async (displayId, file) => {
  try {
    // 1. Compression Settings
    const options = {
      maxSizeMB: 0.2,          // Target size 200KB
      maxWidthOrHeight: 800,   // Resize to max 800px (perfect for grid thumbnails)
      useWebWorker: true,
      fileType: 'image/jpeg'
    };

    console.log(`Original size: ${(file.size / 1024 / 1024).toFixed(2)} MB`);
    
    // 2. Run Compression
    const compressedFile = await imageCompression(file, options);
    
    console.log(`Compressed size: ${(compressedFile.size / 1024).toFixed(2)} KB`);

    // 3. Upload the SMALLER file
    const fileExt = 'jpg';
    const fileName = `${displayId}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('display-photos')
      .upload(filePath, compressedFile, { 
        upsert: true,
        contentType: 'image/jpeg'
      });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('display-photos')
      .getPublicUrl(filePath);

    return data.publicUrl;
  } catch (error) {
    console.error('Compression/Upload error:', error);
    return null;
  }
};