import supabase from "../config/supabase.js";

const fileDeleter = (files, db = false) => {
  files.forEach(async (file) => {
    const { data, error } = await supabase
    .storage
    .from('Rapid-Share')
    .remove(file.fileUrl)
  });
};

export default fileDeleter;
