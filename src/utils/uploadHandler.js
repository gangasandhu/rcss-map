import { supabase } from "../supabaseClient";

export const uploadDisplayPhoto = async (displayId, file) => {
  try {
    // 1. Define a consistent filename (overwrites old file for this display)
    const fileExt = file.name.split('.').pop();
    const fileName = `${displayId}.${fileExt}`;
    const filePath = `${fileName}`;

    // 2. Upload to Supabase Storage (with upsert: true to overwrite)
    const { error: uploadError } = await supabase.storage
      .from('display-photos')
      .upload(filePath, file, { 
        upsert: true,
        contentType: 'image/jpeg' // ensures browser handles it correctly
      });

    if (uploadError) throw uploadError;

    // 3. Get the public URL
    const { data } = supabase.storage
      .from('display-photos')
      .getPublicUrl(filePath);

    return data.publicUrl;
  } catch (error) {
    console.error('Upload error:', error.message);
    return null;
  }
};