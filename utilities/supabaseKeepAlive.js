import cron from "node-cron";
import axios from "axios";

// 8:00 AM IST = 2:30 AM UTC
cron.schedule("30 2 * * *", async () => {
  try {
    console.log("Pinging Supabase at 8:00 AM IST...");
    const res = await axios.get(
      "https://fxfcccrzkabovfkhwlqn.supabase.co/rest/v1/"
    );
    console.log("Supabase status:", res.status);
  } catch (err) {
    console.error("Ping failed:", err.message);
  }
});
