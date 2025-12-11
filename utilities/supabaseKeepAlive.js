import cron from "node-cron";
import axios from "axios";

// 8:15 AM IST = 2:45 AM UTC
cron.schedule("45 2 * * *", async () => {
  try {
    console.log("Pinging Supabase at 8:15 AM IST...");
    const res = await axios.get(
      "https://uegoyqdcdicslpnapkxr.supabase.co/health"
    );
    console.log("Supabase status:", res.status);
  } catch (err) {
    console.error("Ping failed:", err.message);
  }
});
