import cron from "node-cron";
import metadata from "../module/fileSchema.js";
import room from "./../module/room.js"
import fileDeleter from "../utilities/fileDeleter.js";

export default function () {
  return cron.schedule("* * * * * *", async () => {
    try {

        const  expRoom = await room.find({
        expireTime : {
          $lte : new Date(Date.now())
        }
      },{
        _id : 1,
        roomID:1
      });

      expRoom.forEach(async (elem) => {
        try{
            const data = await metadata.find({
              roomID : elem._id.toString()
            })

           
            fileDeleter(data,true);

            await metadata.deleteMany({
              roomID : elem._id.toString()
            });

            await room.deleteOne({
              roomID:elem.roomID
            })
        }
        catch(error){
            console.log(error.message);
        }
      })

    } catch (error) {
      console.log(error.message);
    }
  });
}


