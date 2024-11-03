import fs from "fs";
const fileDeleter = (files, db = false) => {
  files.forEach((file) => {
    if (db && fs.existsSync(file.fileUrl)) {
      fs.unlinkSync(file.fileUrl);
    } else if (!db) {
      fs.unlinkSync(file.path);
    }
  });
};

export default fileDeleter;
