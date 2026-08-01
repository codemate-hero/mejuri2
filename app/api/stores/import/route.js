import { connectDB } from "@/app/lib/db";
import Store from "@/app/models/Store";
import fs from "fs";
import path from "path";

function mapStore(store) {
    return {
        city: store.city || "",
        name: store.name || "",
        address: store.address || "",
        storeUrl: store.storeUrl || "",
        image: store.image || "",
        region: store.region || "",
        brand: "Mejuri",
    };
}

export async function POST() {
    try {
        await connectDB();

        const filePath = path.join(process.cwd(), "mejuri-stores.json");
        const fileData = fs.readFileSync(filePath, "utf-8");

        const storesData = JSON.parse(fileData);
        const stores = storesData.map(mapStore);

        const operations = stores
            .filter((store) => store.name && store.storeUrl)
            .map((store) => ({
                updateOne: {
                    filter: { storeUrl: store.storeUrl },
                    update: { $set: store },
                    upsert: true,
                },
            }));

        if (!operations.length) {
            return Response.json({
                message: "No valid stores found",
                total: 0,
            });
        }

        const result = await Store.bulkWrite(operations);

        return Response.json({
            message: "Stores imported successfully",
            total: stores.length,
            inserted: result.upsertedCount,
            modified: result.modifiedCount,
            matched: result.matchedCount,
        });
    } catch (error) {
        return Response.json(
            {
                message: "Stores import failed",
                error: error.message,
            },
            { status: 500 }
        );
    }
}