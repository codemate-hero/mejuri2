import { connectDB } from "@/app/lib/db";
import Store from "@/app/models/Store";

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const region = searchParams.get("region");
    const limit = Number(searchParams.get("limit")) || 100;

    const filter = {};
    
    // If region is specified and not "ALL STORES", filter by region
    if (region && region !== "ALL STORES") {
      filter.region = region;
    }

    const stores = await Store.find(filter)
      .sort({ city: 1, name: 1 })
      .limit(limit);

    const totalStores = await Store.countDocuments(filter);

    return Response.json({
      message: "Stores fetched successfully",
      stores,
      totalStores,
    });
  } catch (error) {
    console.error("Error fetching stores:", error);
    return Response.json(
      { message: "Failed to fetch stores", error: error.message },
      { status: 500 }
    );
  }
}
