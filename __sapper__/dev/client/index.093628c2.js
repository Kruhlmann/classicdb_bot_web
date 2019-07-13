import { S as SvelteComponentDev, i as init, s as safe_not_equal, e as element, f as text, r as space, h as claim_element, j as children, k as claim_text, l as detach, m as add_location, v as attr, o as insert, p as append, q as set_data, D as create_bidirectional_transition, t as transition_in, b as transition_out, C as check_outros, E as onMount, F as add_render_callback, B as group_outros } from './chunk.31edceb9.js';

function cubicOut(t) {
    const f = t - 1.0;
    return f * f * f + 1.0;
}

function fly(node, { delay = 0, duration = 400, easing = cubicOut, x = 0, y = 0, opacity = 0 }) {
    const style = getComputedStyle(node);
    const target_opacity = +style.opacity;
    const transform = style.transform === 'none' ? '' : style.transform;
    const od = target_opacity * (1 - opacity);
    return {
        delay,
        duration,
        easing,
        css: (t, u) => `
			transform: ${transform} translate(${(1 - t) * x}px, ${(1 - t) * y}px);
			opacity: ${target_opacity - (od * u)}`
    };
}

/* src/routes/index.svelte generated by Svelte v3.6.7 */

const file = "src/routes/index.svelte";

// (41:4) {#if loaded}
function create_if_block(ctx) {
	var div1, div0, span0, t0, t1, t2, t3_value = ctx.guild_count === 1 ? "" : "s", t3, t4, span1, t5, t6, t7, span3, span2, t8, t9, a, t10_value = ctx.top_item.name, t10, a_class_value, a_href_value, div1_transition, current;

	return {
		c: function create() {
			div1 = element("div");
			div0 = element("div");
			span0 = element("span");
			t0 = text("Used by ");
			t1 = text(ctx.guild_count);
			t2 = text(" server");
			t3 = text(t3_value);
			t4 = space();
			span1 = element("span");
			t5 = text(ctx.hits_count);
			t6 = text(" items provided");
			t7 = space();
			span3 = element("span");
			span2 = element("span");
			t8 = text("Most requested item:");
			t9 = space();
			a = element("a");
			t10 = text(t10_value);
			this.h();
		},

		l: function claim(nodes) {
			div1 = claim_element(nodes, "DIV", { class: true }, false);
			var div1_nodes = children(div1);

			div0 = claim_element(div1_nodes, "DIV", { class: true }, false);
			var div0_nodes = children(div0);

			span0 = claim_element(div0_nodes, "SPAN", {}, false);
			var span0_nodes = children(span0);

			t0 = claim_text(span0_nodes, "Used by ");
			t1 = claim_text(span0_nodes, ctx.guild_count);
			t2 = claim_text(span0_nodes, " server");
			t3 = claim_text(span0_nodes, t3_value);
			span0_nodes.forEach(detach);
			t4 = claim_text(div0_nodes, "\r\n                ");

			span1 = claim_element(div0_nodes, "SPAN", {}, false);
			var span1_nodes = children(span1);

			t5 = claim_text(span1_nodes, ctx.hits_count);
			t6 = claim_text(span1_nodes, " items provided");
			span1_nodes.forEach(detach);
			div0_nodes.forEach(detach);
			t7 = claim_text(div1_nodes, "\r\n            ");

			span3 = claim_element(div1_nodes, "SPAN", { class: true }, false);
			var span3_nodes = children(span3);

			span2 = claim_element(span3_nodes, "SPAN", {}, false);
			var span2_nodes = children(span2);

			t8 = claim_text(span2_nodes, "Most requested item:");
			span2_nodes.forEach(detach);
			t9 = claim_text(span3_nodes, "\r\n                ");

			a = claim_element(span3_nodes, "A", { class: true, href: true }, false);
			var a_nodes = children(a);

			t10 = claim_text(a_nodes, t10_value);
			a_nodes.forEach(detach);
			span3_nodes.forEach(detach);
			div1_nodes.forEach(detach);
			this.h();
		},

		h: function hydrate() {
			add_location(span0, file, 43, 16, 1358);
			add_location(span1, file, 44, 16, 1447);
			attr(div0, "class", "overview svelte-uy1kkd");
			add_location(div0, file, 42, 12, 1318);
			add_location(span2, file, 47, 16, 1562);
			attr(a, "class", a_class_value = "" + ctx.top_item.quality + " svelte-uy1kkd");
			attr(a, "href", a_href_value = "https://itemization.info/item/" + ctx.top_item.id);
			add_location(a, file, 48, 16, 1614);
			attr(span3, "class", "top-item svelte-uy1kkd");
			add_location(span3, file, 46, 12, 1521);
			attr(div1, "class", "viewbox-content svelte-uy1kkd");
			add_location(div1, file, 41, 8, 1232);
		},

		m: function mount(target, anchor) {
			insert(target, div1, anchor);
			append(div1, div0);
			append(div0, span0);
			append(span0, t0);
			append(span0, t1);
			append(span0, t2);
			append(span0, t3);
			append(div0, t4);
			append(div0, span1);
			append(span1, t5);
			append(span1, t6);
			append(div1, t7);
			append(div1, span3);
			append(span3, span2);
			append(span2, t8);
			append(span3, t9);
			append(span3, a);
			append(a, t10);
			current = true;
		},

		p: function update(changed, ctx) {
			if (!current || changed.guild_count) {
				set_data(t1, ctx.guild_count);
			}

			if ((!current || changed.guild_count) && t3_value !== (t3_value = ctx.guild_count === 1 ? "" : "s")) {
				set_data(t3, t3_value);
			}

			if (!current || changed.hits_count) {
				set_data(t5, ctx.hits_count);
			}

			if ((!current || changed.top_item) && t10_value !== (t10_value = ctx.top_item.name)) {
				set_data(t10, t10_value);
			}

			if ((!current || changed.top_item) && a_class_value !== (a_class_value = "" + ctx.top_item.quality + " svelte-uy1kkd")) {
				attr(a, "class", a_class_value);
			}

			if ((!current || changed.top_item) && a_href_value !== (a_href_value = "https://itemization.info/item/" + ctx.top_item.id)) {
				attr(a, "href", a_href_value);
			}
		},

		i: function intro(local) {
			if (current) return;
			add_render_callback(() => {
				if (!div1_transition) div1_transition = create_bidirectional_transition(div1, fly, { y: 60, duration: 1200 }, true);
				div1_transition.run(1);
			});

			current = true;
		},

		o: function outro(local) {
			if (!div1_transition) div1_transition = create_bidirectional_transition(div1, fly, { y: 60, duration: 1200 }, false);
			div1_transition.run(0);

			current = false;
		},

		d: function destroy(detaching) {
			if (detaching) {
				detach(div1);
				if (div1_transition) div1_transition.end();
			}
		}
	};
}

function create_fragment(ctx) {
	var div, h1, t0, t1, current;

	var if_block = (ctx.loaded) && create_if_block(ctx);

	return {
		c: function create() {
			div = element("div");
			h1 = element("h1");
			t0 = text("classic db bot");
			t1 = space();
			if (if_block) if_block.c();
			this.h();
		},

		l: function claim(nodes) {
			div = claim_element(nodes, "DIV", { class: true }, false);
			var div_nodes = children(div);

			h1 = claim_element(div_nodes, "H1", { class: true }, false);
			var h1_nodes = children(h1);

			t0 = claim_text(h1_nodes, "classic db bot");
			h1_nodes.forEach(detach);
			t1 = claim_text(div_nodes, "\r\n    ");
			if (if_block) if_block.l(div_nodes);
			div_nodes.forEach(detach);
			this.h();
		},

		h: function hydrate() {
			attr(h1, "class", "main-title svelte-uy1kkd");
			add_location(h1, file, 39, 4, 1162);
			attr(div, "class", "viewbox svelte-uy1kkd");
			add_location(div, file, 38, 0, 1135);
		},

		m: function mount(target, anchor) {
			insert(target, div, anchor);
			append(div, h1);
			append(h1, t0);
			append(div, t1);
			if (if_block) if_block.m(div, null);
			current = true;
		},

		p: function update(changed, ctx) {
			if (ctx.loaded) {
				if (if_block) {
					if_block.p(changed, ctx);
					transition_in(if_block, 1);
				} else {
					if_block = create_if_block(ctx);
					if_block.c();
					transition_in(if_block, 1);
					if_block.m(div, null);
				}
			} else if (if_block) {
				group_outros();
				transition_out(if_block, 1, 1, () => {
					if_block = null;
				});
				check_outros();
			}
		},

		i: function intro(local) {
			if (current) return;
			transition_in(if_block);
			current = true;
		},

		o: function outro(local) {
			transition_out(if_block);
			current = false;
		},

		d: function destroy(detaching) {
			if (detaching) {
				detach(div);
			}

			if (if_block) if_block.d();
		}
	};
}

function preload() {
    return this.fetch("/api/meta").then((r) => r.json()).then((stats) => {
        return this.fetch(`https://itemization.info/item/${stats.top_item}`)
            .then((r) => r.text())
            .then((html) => {
                const r = /<span class="(legendary|rare) name">(.*?)<\/span>/gm;
                const match = r.exec(html);
                return {
                    guild_count: stats.guild_count,
                    hits_count: stats.hits_count,
                    top_item: {
                        id: stats.top_item,
                        quality: match[1],
                        name: match[2],
                    }
                };
            });
    });
}

function instance($$self, $$props, $$invalidate) {
	

    let { guild_count, hits_count, top_item } = $$props;

    let loaded = false;

    onMount(() => {
        $$invalidate('loaded', loaded = true);
    });

	const writable_props = ['guild_count', 'hits_count', 'top_item'];
	Object.keys($$props).forEach(key => {
		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<Index> was created with unknown prop '${key}'`);
	});

	$$self.$set = $$props => {
		if ('guild_count' in $$props) $$invalidate('guild_count', guild_count = $$props.guild_count);
		if ('hits_count' in $$props) $$invalidate('hits_count', hits_count = $$props.hits_count);
		if ('top_item' in $$props) $$invalidate('top_item', top_item = $$props.top_item);
	};

	return {
		guild_count,
		hits_count,
		top_item,
		loaded
	};
}

class Index extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance, create_fragment, safe_not_equal, ["guild_count", "hits_count", "top_item"]);

		const { ctx } = this.$$;
		const props = options.props || {};
		if (ctx.guild_count === undefined && !('guild_count' in props)) {
			console.warn("<Index> was created without expected prop 'guild_count'");
		}
		if (ctx.hits_count === undefined && !('hits_count' in props)) {
			console.warn("<Index> was created without expected prop 'hits_count'");
		}
		if (ctx.top_item === undefined && !('top_item' in props)) {
			console.warn("<Index> was created without expected prop 'top_item'");
		}
	}

	get guild_count() {
		throw new Error("<Index>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set guild_count(value) {
		throw new Error("<Index>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get hits_count() {
		throw new Error("<Index>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set hits_count(value) {
		throw new Error("<Index>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get top_item() {
		throw new Error("<Index>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set top_item(value) {
		throw new Error("<Index>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

export default Index;
export { preload };
