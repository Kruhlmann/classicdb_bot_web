import { S as SvelteComponentDev, i as init, d as globals, s as safe_not_equal, e as element, f as text, r as space, h as claim_element, j as children, k as claim_text, l as detach, m as add_location, v as attr, o as insert, p as append, q as set_data, D as create_bidirectional_transition, t as transition_in, b as transition_out, C as check_outros, E as onMount, F as add_render_callback, B as group_outros } from './chunk.31edceb9.js';

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
const { console: console_1 } = globals;

const file = "src/routes/index.svelte";

// (40:4) {#if loaded}
function create_if_block(ctx) {
	var div1, div0, span0, t0, t1_value = ctx.stats.guild_count, t1, t2, t3, span1, t4_value = ctx.stats.hits_count, t4, t5, t6, span2, t7, a, t8, a_href_value, div1_transition, current;

	return {
		c: function create() {
			div1 = element("div");
			div0 = element("div");
			span0 = element("span");
			t0 = text("Used by ");
			t1 = text(t1_value);
			t2 = text(" servers");
			t3 = space();
			span1 = element("span");
			t4 = text(t4_value);
			t5 = text(" items provided");
			t6 = space();
			span2 = element("span");
			t7 = text("Most requested item: ");
			a = element("a");
			t8 = text("s");
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
			t1 = claim_text(span0_nodes, t1_value);
			t2 = claim_text(span0_nodes, " servers");
			span0_nodes.forEach(detach);
			t3 = claim_text(div0_nodes, "\r\n                ");

			span1 = claim_element(div0_nodes, "SPAN", {}, false);
			var span1_nodes = children(span1);

			t4 = claim_text(span1_nodes, t4_value);
			t5 = claim_text(span1_nodes, " items provided");
			span1_nodes.forEach(detach);
			t6 = claim_text(div0_nodes, "\r\n                ");

			span2 = claim_element(div0_nodes, "SPAN", {}, false);
			var span2_nodes = children(span2);

			t7 = claim_text(span2_nodes, "Most requested item: ");

			a = claim_element(span2_nodes, "A", { href: true }, false);
			var a_nodes = children(a);

			t8 = claim_text(a_nodes, "s");
			a_nodes.forEach(detach);
			span2_nodes.forEach(detach);
			div0_nodes.forEach(detach);
			div1_nodes.forEach(detach);
			this.h();
		},

		h: function hydrate() {
			add_location(span0, file, 42, 16, 1333);
			add_location(span1, file, 43, 16, 1399);
			attr(a, "href", a_href_value = "https://itemization.info/item/" + ctx.stats.top_item);
			add_location(a, file, 45, 41, 1512);
			add_location(span2, file, 44, 16, 1463);
			attr(div0, "class", "overview svelte-1q2y2s9");
			add_location(div0, file, 41, 12, 1293);
			attr(div1, "class", "viewbox-content svelte-1q2y2s9");
			add_location(div1, file, 40, 8, 1207);
		},

		m: function mount(target, anchor) {
			insert(target, div1, anchor);
			append(div1, div0);
			append(div0, span0);
			append(span0, t0);
			append(span0, t1);
			append(span0, t2);
			append(div0, t3);
			append(div0, span1);
			append(span1, t4);
			append(span1, t5);
			append(div0, t6);
			append(div0, span2);
			append(span2, t7);
			append(span2, a);
			append(a, t8);
			current = true;
		},

		p: function update(changed, ctx) {
			if ((!current || changed.stats) && t1_value !== (t1_value = ctx.stats.guild_count)) {
				set_data(t1, t1_value);
			}

			if ((!current || changed.stats) && t4_value !== (t4_value = ctx.stats.hits_count)) {
				set_data(t4, t4_value);
			}

			if ((!current || changed.stats) && a_href_value !== (a_href_value = "https://itemization.info/item/" + ctx.stats.top_item)) {
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
			attr(h1, "class", "main-title svelte-1q2y2s9");
			add_location(h1, file, 38, 4, 1137);
			attr(div, "class", "viewbox svelte-1q2y2s9");
			add_location(div, file, 37, 0, 1110);
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
                console.log();
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
	

    let { stats } = $$props;

    let loaded = false;

    onMount(() => {
        $$invalidate('loaded', loaded = true);
    });

	const writable_props = ['stats'];
	Object.keys($$props).forEach(key => {
		if (!writable_props.includes(key) && !key.startsWith('$$')) console_1.warn(`<Index> was created with unknown prop '${key}'`);
	});

	$$self.$set = $$props => {
		if ('stats' in $$props) $$invalidate('stats', stats = $$props.stats);
	};

	return { stats, loaded };
}

class Index extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance, create_fragment, safe_not_equal, ["stats"]);

		const { ctx } = this.$$;
		const props = options.props || {};
		if (ctx.stats === undefined && !('stats' in props)) {
			console_1.warn("<Index> was created without expected prop 'stats'");
		}
	}

	get stats() {
		throw new Error("<Index>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set stats(value) {
		throw new Error("<Index>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

export default Index;
export { preload };
