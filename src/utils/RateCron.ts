import cron from "node-cron";
import RateMaster from "../models/Rate";

const resetRateMaster = async () => {
  try {

    await RateMaster.deleteMany({});

    const newRate = new RateMaster({ rate: 100 });
    await newRate.save();

    console.log("Rate Master reset successfully at 1 AM");
  } catch (error) {
    console.error("Error resetting Rate Master:", error);
  }
};

cron.schedule("0 1 * * *", resetRateMaster, {
  scheduled: true,
  timezone: "Asia/Kolkata", 
});
