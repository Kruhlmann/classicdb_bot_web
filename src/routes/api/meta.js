import * as sqlite from "sqlite";
import { database_path, itemization_api_key } from "../../config.js";
const request = require("request-promise");
import * as fs from "fs";
import * as path from "path";

const item_cache_path = path.resolve("items.json");
const culprits_path = path.resolve("culprits.json");

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

function db_items_filter(db_items, item_cache, culprits) {
    return db_items.filter((item) => {
        const found_item = item_cache.find((i) => `${i.ID}` === item.item_id);
        const found_culprit = culprits.find((i) => i === item.item_id);
        if (!found_item && !found_culprit) {
            console.log(`Missing item ${item.item_id}`)
            return true;
        }
    })
}

function db_items_to_obj(db_items) {
    return db_items.map(async (item) => {
        const found_item = item_cache.find((i) => `${i.ID}` === item.item_id);
        const found_culprit = culprits.find((i) => i === item.item_id);
        if (!found_item && !found_culprit) {
            return {id: item.item_id, item: await get_item(item.item_id)};
        }
    });
}

async function update_local_storage(missing_items, culprits, culprits_path, item_cache, item_cache_path) {
    for (const _missing_item of missing_items) {
        const missing_item = await _missing_item;
        if (!missing_item || !missing_item.item) {
            continue;
        }
        if (missing_item.item.length === 0) {
            if (!culprits.includes(missing_item.id)) {
                culprits.push(missing_item.id);
                fs.writeFileSync(culprits_path, JSON.stringify(culprits));
            }
            continue;
        }
        item_cache.push(missing_item.item[0]);
        fs.writeFileSync(item_cache_path, JSON.stringify(item_cache));
    }
}

function increment_item_counters(db_items, item_cache, ii_items) {
    for (const item of db_items) {
        const item_match = item_cache.find((i) => `${i.ID}` === item.item_id);
        if (!item_match) {
            continue;
        }

        const existing_item = ii_items.find((i) => i.id === item.item_id);

        if (existing_item) {
            existing_item.hits += item.hits;
        } else {
            if (item.hits > 5) {
                const pruned_item = item_match.Current;
                pruned_item.hits = item.hits;
                pruned_item.id = item.item_id;
                ii_items.push(pruned_item);
            }
        }
    }
}

function sort_guilds(guilds, db_items) {
    return guilds.map((guild) => {
        guild.hits = 0;
        db_items.forEach((hit) => {
            if (hit.server_id === guild.id) {
                guild.hits += parseInt(hit.hits);
            }
        });
        return guild;
    }).sort((a, b) => b.hits - a.hits);
}

export async function get(req, res, next) {
	try {
		res.writeHead(200, {
			"Content-Type": "application/json",
		});

		const item_cache = JSON.parse(fs.readFileSync(item_cache_path));
		const culprits = JSON.parse(fs.readFileSync(culprits_path));
		const db = await sqlite.open(database_path);

		const guilds = await db.all("SELECT * FROM guild_configs");
		const db_items = await db.all("SELECT * FROM queries ORDER BY hits DESC");
		const ii_items = [];
		const missing_item_count = db_items_filter(db_items, item_cache, culprits);
		console.log(`${missing_item_count.length} items have not been cached`);
		const missing_items = db_items_to_obj(db_items, culprits);
		const sorted_guilds = sort_guilds(guilds, db_items);

        update_local_storage(missing_items, culprits, culprits_path, item_cache, item_cache_path);
        increment_item_counters(db_items, item_cache, ii_items);

		res.end(JSON.stringify({
			guilds: sorted_guilds || [],
			hits_count: db_items.reduce((sum, b) => {
				return {hits: sum.hits + parseInt(b.hits)}
			}).hits,
			items: ii_items.sort((a, b) => b.hits - a.hits),
		}));
	} catch (err) {
		console.log(err)
		res.end(JSON.stringify({
			err,
		}));
	}
}
