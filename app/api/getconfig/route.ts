import { promises as fs } from "fs";
import path from "path";

export const dynamic = 'force-dynamic' 

// API-Route: /api/getconfig : Return the config options from formconfig.json
export async function GET(request: Request) {
  try {
    const configPath = path.join(process.cwd(), "formconfig.json");
    const configFile = await fs.readFile(configPath, "utf-8");
    const config = JSON.parse(configFile);
    return new Response(JSON.stringify(config), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error reading config file:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
