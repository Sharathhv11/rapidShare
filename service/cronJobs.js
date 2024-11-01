import cron from "node-cron";
import sessionModel from "../module/fileSchema.js";
import fs from "fs";

export default function () {
  return cron.schedule("* * * * *", async () => {
    try {
      const data = await sessionModel.find({
        expireTime: { $lt: new Date(Date.now()) },
      });

      await sessionModel.deleteMany({
        expireTime: { $lt: new Date(Date.now()) },
      });

      data.map((elem) => {
        fs.unlinkSync(elem.fileUrl);
      });
    } catch (error) {}
  });
}
