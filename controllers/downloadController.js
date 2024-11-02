import metadata from "../module/fileSchema.js";
import roomModel from "../module/room.js";

const handleDownload = async (req, res) => {
  try {
    const { roomID, password } = req.body;

    if (!roomID || !password) {
      return res.status(400).json({
        status : "failed",
        message : "roomID and password are required"
      });
    }

    const room = await roomModel.findOne({
      roomID
    });

    if (!room) {
      return res.status(404).json({
        status: "failed",
        message: `no room is present with roomID ${roomID}`,
      });
    }

    const validPassword = await room.comparePassword(password); 

    if(!validPassword){
        res.status(401).send({
            status: "failed",
            message : "invalid password"
        })
    }
    
    res.send({
        status: "success",
        message: "authenticated to download files"
    })


  } catch (error) {
    res.status(400).send({
      status: "failed",
      message: error.message || "Failed to download file",
    });
  }
};

export { handleDownload };
