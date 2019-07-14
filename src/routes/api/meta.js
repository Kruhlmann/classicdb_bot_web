import * as sqlite from "sqlite";
import { database_path, itemization_api_key } from "../../config.js";
const request = require("request-promise");


function get_item(item_id) {
	return request({
        body: {
            apiKey: itemization_api_key,
            query: `id:${item_id}`,
        },
        json: true,
        method: "POST",
        uri: "https://itemization.info/api/search",
    });
}

export async function get(req, res, next) {
	try {
		const db = await sqlite.open(database_path);
		res.writeHead(200, {
			"Content-Type": "application/json",
		});

		const guild_count = await db.get("SELECT COUNT(*) from guild_configs");
		const db_items = await db.all("SELECT * FROM queries ORDER BY hits DESC");
		const ii_items = [];

		for (const item of db_items) {
			const resolved_item = await get_item(item.item_id);
			if (resolved_item.length < 1 || !resolved_item[0].Current) {
				continue;
			}

			const existing_item = ii_items.find((i) => i.id === item.item_id);
			if (existing_item) {
				existing_item.hits += item.hits;
			} else {
				resolved_item[0].Current.hits = item.hits;
				resolved_item[0].Current.id = item.item_id;
				ii_items.push(resolved_item[0].Current);
			}
		}

		res.end(JSON.stringify({
			guild_count: guild_count["COUNT(*)"],
			hits_count: db_items.reduce((a, b) => a.hits + b.hits),
			items: ii_items.slice(0, 15).sort((a, b) => b.hits - a.hits),
			topitem: ii_items.sort((a, b) => b.hits - a.hits)[0],
		}));
	} catch (err) {
		console.log(err)
		res.end(JSON.stringify({
			err,
		}));
	}
}