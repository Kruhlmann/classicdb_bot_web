import * as sqlite from "sqlite";
import { database_path } from "../../config.js";

export async function get(req, res, next) {
	try {
		const db = await sqlite.open(database_path);

		res.writeHead(200, {
			"Content-Type": "application/json",
		});

		const guild_count = await db.get("SELECT COUNT(*) from guild_configs");
		const hits = await db.all("SELECT hits FROM queries");
		const top_item = await db.get("SELECT item_id FROM queries ORDER BY hits DESC LIMIT 1");

		res.end(JSON.stringify({
			guild_count: guild_count["COUNT(*)"],
			hits_count: hits.reduce((a, b) => a.hits + b.hits),
			top_item: top_item.item_id
		}));
	} catch (err) {
		next(err)
	}
}