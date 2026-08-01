import mongoose from "mongoose";

const storeSchema = new mongoose.Schema(
    {
        city: { type: String, trim: true },
        name: { type: String, trim: true, required: true },
        address: { type: String, trim: true },
        storeUrl: { type: String, trim: true, unique: true, sparse: true },
        image: { type: String, trim: true },
        region: { type: String, trim: true },
        brand: { type: String, default: "Mejuri" },
    },
    { timestamps: true }
);

export default mongoose.models.Store || mongoose.model("Store", storeSchema);