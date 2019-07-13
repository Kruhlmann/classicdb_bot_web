'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var sirv = _interopDefault(require('sirv'));
var polka = _interopDefault(require('polka'));
var compression = _interopDefault(require('compression'));
var fs = _interopDefault(require('fs'));
var path = _interopDefault(require('path'));
var Stream = _interopDefault(require('stream'));
var http = _interopDefault(require('http'));
var Url = _interopDefault(require('url'));
var https = _interopDefault(require('https'));
var zlib = _interopDefault(require('zlib'));

function noop() { }
function is_promise(value) {
    return value && typeof value === 'object' && typeof value.then === 'function';
}
function run(fn) {
    return fn();
}
function blank_object() {
    return Object.create(null);
}
function run_all(fns) {
    fns.forEach(run);
}
function safe_not_equal(a, b) {
    return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
}

let current_component;
function set_current_component(component) {
    current_component = component;
}
function get_current_component() {
    if (!current_component)
        throw new Error(`Function called outside component initialization`);
    return current_component;
}
function onMount(fn) {
    get_current_component().$$.on_mount.push(fn);
}
function setContext(key, context) {
    get_current_component().$$.context.set(key, context);
}
const escaped = {
    '"': '&quot;',
    "'": '&#39;',
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;'
};
function escape(html) {
    return String(html).replace(/["'&<>]/g, match => escaped[match]);
}
function each(items, fn) {
    let str = '';
    for (let i = 0; i < items.length; i += 1) {
        str += fn(items[i], i);
    }
    return str;
}
const missing_component = {
    $$render: () => ''
};
function validate_component(component, name) {
    if (!component || !component.$$render) {
        if (name === 'svelte:component')
            name += ' this={...}';
        throw new Error(`<${name}> is not a valid SSR component. You may need to review your build config to ensure that dependencies are compiled, rather than imported as pre-compiled modules`);
    }
    return component;
}
let on_destroy;
function create_ssr_component(fn) {
    function $$render(result, props, bindings, slots) {
        const parent_component = current_component;
        const $$ = {
            on_destroy,
            context: new Map(parent_component ? parent_component.$$.context : []),
            // these will be immediately discarded
            on_mount: [],
            before_render: [],
            after_render: [],
            callbacks: blank_object()
        };
        set_current_component({ $$ });
        const html = fn(result, props, bindings, slots);
        set_current_component(parent_component);
        return html;
    }
    return {
        render: (props = {}, options = {}) => {
            on_destroy = [];
            const result = { head: '', css: new Set() };
            const html = $$render(result, props, {}, options);
            run_all(on_destroy);
            return {
                html,
                css: {
                    code: Array.from(result.css).map(css => css.code).join('\n'),
                    map: null // TODO
                },
                head: result.head
            };
        },
        $$render
    };
}
function get_store_value(store) {
    let value;
    store.subscribe(_ => value = _)();
    return value;
}
function add_attribute(name, value) {
    if (!value)
        return '';
    return ` ${name}${value === true ? '' : `=${JSON.stringify(value)}`}`;
}

/**
 * Create a `Writable` store that allows both updating and reading by subscription.
 * @param {*=}value initial value
 * @param {StartStopNotifier=}start start and stop notifications for subscriptions
 */
function writable(value, start = noop) {
    let stop;
    const subscribers = [];
    function set(new_value) {
        if (safe_not_equal(value, new_value)) {
            value = new_value;
            if (!stop) {
                return; // not ready
            }
            subscribers.forEach((s) => s[1]());
            subscribers.forEach((s) => s[0](value));
        }
    }
    function update(fn) {
        set(fn(value));
    }
    function subscribe(run, invalidate = noop) {
        const subscriber = [run, invalidate];
        subscribers.push(subscriber);
        if (subscribers.length === 1) {
            stop = start(set) || noop;
        }
        run(value);
        return () => {
            const index = subscribers.indexOf(subscriber);
            if (index !== -1) {
                subscribers.splice(index, 1);
            }
            if (subscribers.length === 0) {
                stop();
                stop = null;
            }
        };
    }
    return { set, update, subscribe };
}

const axle_query = writable("");

var config = {
    api_url: "http://149.212.223.80:443/api",
    months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    axle_counter_aliases: {
        axle_counter: "name",
        number_of_crossings: "# crossings",
    },
    allowed_file_types: [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel.sheet.macroEnabled.12",
    ],
};

/* src\components\IgnoreToggle.svelte generated by Svelte v3.6.1 */

const css = {
	code: ".switch-wrap.svelte-p427kv{display:flex;align-items:center}.switch-wrap.svelte-p427kv>span.svelte-p427kv{color:white;text-transform:uppercase;width:105px;font-size:16px}.switch-wrap.svelte-p427kv>span.svelte-p427kv:first-child{text-align:right}.switch-wrap.svelte-p427kv>span.svelte-p427kv:last-child{text-align:left}.switch-wrap.svelte-p427kv>span.ignored.svelte-p427kv{color:#f32121}.switch-wrap.svelte-p427kv>span.not-ignored.svelte-p427kv{color:#689dc0}.switch-wrap.svelte-p427kv .switch.svelte-p427kv{position:relative;display:inline-block;width:60px;height:34px;margin:0 5px}.switch-wrap.svelte-p427kv .switch input.svelte-p427kv{opacity:0;width:0;height:0}.switch-wrap .switch input:checked+.slider.svelte-p427kv{background-color:#f32121}.switch-wrap .switch input:focus+.slider.svelte-p427kv{box-shadow:0 0 1px #f32121}.switch-wrap .switch input:checked+.slider.svelte-p427kv:before{-webkit-transform:translateX(26px);-ms-transform:translateX(26px);transform:translateX(26px)}.switch-wrap.svelte-p427kv .switch .slider.svelte-p427kv{position:absolute;cursor:pointer;top:0;left:0;right:0;bottom:0;background-color:#ccc}.switch-wrap.svelte-p427kv .switch .slider.svelte-p427kv:before{position:absolute;content:\"\";height:26px;width:26px;left:4px;bottom:4px;background-color:white}.switch-wrap.svelte-p427kv .switch .slider.round.svelte-p427kv{border-radius:34px}.switch-wrap.svelte-p427kv .switch .slider.round.svelte-p427kv:before{border-radius:50%}",
	map: "{\"version\":3,\"file\":\"IgnoreToggle.svelte\",\"sources\":[\"IgnoreToggle.svelte\"],\"sourcesContent\":[\"<script>\\r\\n    import { createEventDispatcher } from \\\"svelte\\\";\\r\\n    const dispatch = createEventDispatcher();\\r\\n\\r\\n    export let ignored = false;\\r\\n\\r\\n    function emit() {\\r\\n        dispatch(\\\"toggle\\\");\\r\\n    }\\r\\n</script>\\r\\n\\r\\n<div class=\\\"switch-wrap\\\">\\r\\n    <label class=\\\"switch\\\">\\r\\n        <input type=\\\"checkbox\\\" bind:checked={ignored} on:change={emit}>\\r\\n        <span class=\\\"slider round\\\"></span>\\r\\n    </label>\\r\\n    <span class:ignored={ignored} class:not-ignored={!ignored}>{ignored ? \\\"\\\" : \\\"not\\\"} ignored</span>\\r\\n</div>\\r\\n\\r\\n<style lang=\\\"scss\\\">.switch-wrap {\\n  display: flex;\\n  align-items: center; }\\n  .switch-wrap > span {\\n    color: white;\\n    text-transform: uppercase;\\n    width: 105px;\\n    font-size: 16px; }\\n    .switch-wrap > span:first-child {\\n      text-align: right; }\\n    .switch-wrap > span:last-child {\\n      text-align: left; }\\n    .switch-wrap > span.ignored {\\n      color: #f32121; }\\n    .switch-wrap > span.not-ignored {\\n      color: #689dc0; }\\n  .switch-wrap .switch {\\n    position: relative;\\n    display: inline-block;\\n    width: 60px;\\n    height: 34px;\\n    margin: 0 5px; }\\n    .switch-wrap .switch input {\\n      opacity: 0;\\n      width: 0;\\n      height: 0; }\\n      .switch-wrap .switch input:checked + .slider {\\n        background-color: #f32121; }\\n      .switch-wrap .switch input:focus + .slider {\\n        box-shadow: 0 0 1px #f32121; }\\n      .switch-wrap .switch input:checked + .slider:before {\\n        -webkit-transform: translateX(26px);\\n        -ms-transform: translateX(26px);\\n        transform: translateX(26px); }\\n    .switch-wrap .switch .slider {\\n      position: absolute;\\n      cursor: pointer;\\n      top: 0;\\n      left: 0;\\n      right: 0;\\n      bottom: 0;\\n      background-color: #ccc; }\\n      .switch-wrap .switch .slider:before {\\n        position: absolute;\\n        content: \\\"\\\";\\n        height: 26px;\\n        width: 26px;\\n        left: 4px;\\n        bottom: 4px;\\n        background-color: white; }\\n      .switch-wrap .switch .slider.round {\\n        border-radius: 34px; }\\n        .switch-wrap .switch .slider.round:before {\\n          border-radius: 50%; }\\n\\n/*# sourceMappingURL=IgnoreToggle.svelte.css.map */</style>\"],\"names\":[],\"mappings\":\"AAmBmB,YAAY,cAAC,CAAC,AAC/B,OAAO,CAAE,IAAI,CACb,WAAW,CAAE,MAAM,AAAE,CAAC,AACtB,0BAAY,CAAG,IAAI,cAAC,CAAC,AACnB,KAAK,CAAE,KAAK,CACZ,cAAc,CAAE,SAAS,CACzB,KAAK,CAAE,KAAK,CACZ,SAAS,CAAE,IAAI,AAAE,CAAC,AAClB,0BAAY,CAAG,kBAAI,YAAY,AAAC,CAAC,AAC/B,UAAU,CAAE,KAAK,AAAE,CAAC,AACtB,0BAAY,CAAG,kBAAI,WAAW,AAAC,CAAC,AAC9B,UAAU,CAAE,IAAI,AAAE,CAAC,AACrB,0BAAY,CAAG,IAAI,QAAQ,cAAC,CAAC,AAC3B,KAAK,CAAE,OAAO,AAAE,CAAC,AACnB,0BAAY,CAAG,IAAI,YAAY,cAAC,CAAC,AAC/B,KAAK,CAAE,OAAO,AAAE,CAAC,AACrB,0BAAY,CAAC,OAAO,cAAC,CAAC,AACpB,QAAQ,CAAE,QAAQ,CAClB,OAAO,CAAE,YAAY,CACrB,KAAK,CAAE,IAAI,CACX,MAAM,CAAE,IAAI,CACZ,MAAM,CAAE,CAAC,CAAC,GAAG,AAAE,CAAC,AAChB,0BAAY,CAAC,OAAO,CAAC,KAAK,cAAC,CAAC,AAC1B,OAAO,CAAE,CAAC,CACV,KAAK,CAAE,CAAC,CACR,MAAM,CAAE,CAAC,AAAE,CAAC,AACZ,YAAY,CAAC,OAAO,CAAC,KAAK,QAAQ,CAAG,OAAO,cAAC,CAAC,AAC5C,gBAAgB,CAAE,OAAO,AAAE,CAAC,AAC9B,YAAY,CAAC,OAAO,CAAC,KAAK,MAAM,CAAG,OAAO,cAAC,CAAC,AAC1C,UAAU,CAAE,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,OAAO,AAAE,CAAC,AAChC,YAAY,CAAC,OAAO,CAAC,KAAK,QAAQ,CAAG,qBAAO,OAAO,AAAC,CAAC,AACnD,iBAAiB,CAAE,WAAW,IAAI,CAAC,CACnC,aAAa,CAAE,WAAW,IAAI,CAAC,CAC/B,SAAS,CAAE,WAAW,IAAI,CAAC,AAAE,CAAC,AAClC,0BAAY,CAAC,OAAO,CAAC,OAAO,cAAC,CAAC,AAC5B,QAAQ,CAAE,QAAQ,CAClB,MAAM,CAAE,OAAO,CACf,GAAG,CAAE,CAAC,CACN,IAAI,CAAE,CAAC,CACP,KAAK,CAAE,CAAC,CACR,MAAM,CAAE,CAAC,CACT,gBAAgB,CAAE,IAAI,AAAE,CAAC,AACzB,0BAAY,CAAC,OAAO,CAAC,qBAAO,OAAO,AAAC,CAAC,AACnC,QAAQ,CAAE,QAAQ,CAClB,OAAO,CAAE,EAAE,CACX,MAAM,CAAE,IAAI,CACZ,KAAK,CAAE,IAAI,CACX,IAAI,CAAE,GAAG,CACT,MAAM,CAAE,GAAG,CACX,gBAAgB,CAAE,KAAK,AAAE,CAAC,AAC5B,0BAAY,CAAC,OAAO,CAAC,OAAO,MAAM,cAAC,CAAC,AAClC,aAAa,CAAE,IAAI,AAAE,CAAC,AACtB,0BAAY,CAAC,OAAO,CAAC,OAAO,oBAAM,OAAO,AAAC,CAAC,AACzC,aAAa,CAAE,GAAG,AAAE,CAAC\"}"
};

const IgnoreToggle = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {

    let { ignored = false } = $$props;

	if ($$props.ignored === void 0 && $$bindings.ignored && ignored !== void 0) $$bindings.ignored(ignored);

	$$result.css.add(css);

	return `<div class="switch-wrap svelte-p427kv">
	    <label class="switch svelte-p427kv">
	        <input type="checkbox" class="svelte-p427kv"${add_attribute("checked", ignored)}>
	        <span class="slider round svelte-p427kv"></span>
	    </label>
	    <span class="${[`svelte-p427kv`, ignored ? "ignored" : "", !ignored ? "not-ignored" : ""].join(' ').trim() }">${escape(ignored ? "" : "not")} ignored</span>
	</div>`;
});

/* src\components\DatePicker.svelte generated by Svelte v3.6.1 */

const css$1 = {
	code: ".datepicker.svelte-6agj4j{display:flex;flex-direction:column;width:315px;background-color:white;box-shadow:0 5px 10px 2px rgba(0, 0, 0, 0.3)}.datepicker.svelte-6agj4j .header.svelte-6agj4j{display:flex;justify-content:space-between;align-items:center;margin-bottom:5px;font-size:18px;text-transform:uppercase;color:white;font-weight:bold;background-color:#0681ff}.datepicker.svelte-6agj4j .header .next.svelte-6agj4j,.datepicker.svelte-6agj4j .header .prev.svelte-6agj4j{cursor:pointer;display:flex;align-items:center;justify-content:center;transition:color .15s linear;font-size:14px;width:55px;padding:0 10px;height:40px}.datepicker.svelte-6agj4j .header .next.svelte-6agj4j:hover,.datepicker.svelte-6agj4j .header .prev.svelte-6agj4j:hover{background-color:#0068d2}.datepicker.svelte-6agj4j .header .next .chevron.svelte-6agj4j,.datepicker.svelte-6agj4j .header .prev .chevron.svelte-6agj4j{margin-top:-4px;font-size:22px}.datepicker.svelte-6agj4j .header .next.svelte-6agj4j{text-align:right}.datepicker.svelte-6agj4j .header .next .month.svelte-6agj4j{margin-right:5px}.datepicker.svelte-6agj4j .header .prev.svelte-6agj4j{text-align:left}.datepicker.svelte-6agj4j .header .prev .month.svelte-6agj4j{margin-left:5px}.datepicker.svelte-6agj4j table.svelte-6agj4j{width:100%}.datepicker.svelte-6agj4j table .svelte-6agj4j{text-align:center}.datepicker.svelte-6agj4j table td.svelte-6agj4j{width:35px;height:35px;font-size:16px}.datepicker.svelte-6agj4j table td.svelte-6agj4j:not(.week-number){cursor:pointer}.datepicker.svelte-6agj4j table td:not(.week-number).today.svelte-6agj4j{background-color:#7dabca}.datepicker.svelte-6agj4j table td.svelte-6agj4j:not(.week-number):hover,.datepicker.svelte-6agj4j table td:not(.week-number).picked.svelte-6agj4j{background-color:#0681ff;color:white}.datepicker.svelte-6agj4j table td:not(.week-number).disabled.svelte-6agj4j:not(.picked):not(.today){color:#AAA}.datepicker.svelte-6agj4j table td.week-number.svelte-6agj4j{font-weight:bold}.footer.svelte-6agj4j{display:flex;justify-content:space-between;align-items:center;padding:5px}.footer.svelte-6agj4j .timepicker.svelte-6agj4j{display:flex;align-items:center;justify-content:center;justify-self:center}.footer.svelte-6agj4j .timepicker .svelte-6agj4j{font-size:22px}.footer.svelte-6agj4j .timepicker input.numerical.svelte-6agj4j{width:25px;border:none;border-bottom:1px solid #AAA;padding:0 5px;text-align:center}.footer.svelte-6agj4j .footer-btn.svelte-6agj4j{height:28px;width:28px;color:white;font-weight:bold;border:none;cursor:pointer}.footer.svelte-6agj4j .footer-btn.submit.svelte-6agj4j{background-color:#0681ff}.footer.svelte-6agj4j .footer-btn.submit.svelte-6agj4j:hover{background-color:#0068d2}.footer.svelte-6agj4j .footer-btn.submit.disabled.svelte-6agj4j{cursor:default;background-color:#797979}.footer.svelte-6agj4j .footer-btn.submit.disabled.svelte-6agj4j:hover{background-color:#797979}.footer.svelte-6agj4j .footer-btn.cancel.svelte-6agj4j{background-color:#797979}.footer.svelte-6agj4j .footer-btn.cancel.svelte-6agj4j:hover{background-color:#6b6b6b}",
	map: "{\"version\":3,\"file\":\"DatePicker.svelte\",\"sources\":[\"DatePicker.svelte\"],\"sourcesContent\":[\"<script>\\r\\n    import \\\"@fortawesome/fontawesome-free/css/all.css\\\";\\r\\n    import { createEventDispatcher } from \\\"svelte\\\";\\r\\n\\r\\n    export let month = new Date().getMonth();\\r\\n    export let year = new Date().getFullYear();\\r\\n\\r\\n    const dispatch = createEventDispatcher();\\r\\n    const today = new Date();\\r\\n    const weekdays = [7, 6, 5, 4, 3, 2, 1];\\r\\n    const months = [\\\"January\\\", \\\"February\\\", \\\"March\\\", \\\"April\\\", \\\"May\\\", \\\"June\\\", \\\"July\\\", \\\"August\\\", \\\"September\\\", \\\"October\\\", \\\"November\\\", \\\"December\\\"];\\r\\n\\r\\n    let picked_date;\\r\\n    let hours = \\\"\\\";\\r\\n    let minutes = \\\"\\\";\\r\\n\\r\\n    /**\\r\\n     * @param {number} - The month number, 0 based.\\r\\n     * @param {number} - The year, not zero based, required to account for leap years.\\r\\n     * @return {Date[]} - List with date objects for each day of the month.\\r\\n     */\\r\\n    function month_days(month, year) {\\r\\n        const date = new Date(year, month, 1);\\r\\n        let days = [];\\r\\n        while (date.getMonth() === month) {\\r\\n            days.push(new Date(date));\\r\\n            date.setDate(date.getDate() + 1);\\r\\n        }\\r\\n        return days;\\r\\n    }\\r\\n\\r\\n    function dec_month() {\\r\\n        month -= 1;\\r\\n        if (month < 0) {\\r\\n            month = 11;\\r\\n            year --;\\r\\n        }\\r\\n    }\\r\\n\\r\\n    function inc_month() {\\r\\n        month += 1;\\r\\n        if (month > 11) {\\r\\n            month = 0;\\r\\n            year ++;\\r\\n        }\\r\\n    }\\r\\n\\r\\n    function final_day_of_month(year, month) {\\r\\n        return new Date(year, month + 1, 0);\\r\\n    }\\r\\n\\r\\n    function day_x_next_month(year, month, date) {\\r\\n        month = month + 1;\\r\\n        return new Date(year, month, date);\\r\\n    }\\r\\n\\r\\n    function is_same_date(date, cmp_date) {\\r\\n        if (!date) {\\r\\n            return false;\\r\\n        }\\r\\n        cmp_date = !!cmp_date ? cmp_date : today;\\r\\n        return date.getFullYear() === cmp_date.getFullYear()\\r\\n            && date.getMonth() === cmp_date.getMonth()\\r\\n            && date.getDate() === cmp_date.getDate();\\r\\n    }\\r\\n\\r\\n    function prev_month(month) {\\r\\n        return month === 0 ? 11 : month - 1;\\r\\n    }\\r\\n\\r\\n    function next_month(month) {\\r\\n        return month === 11 ? 0 : month + 1;\\r\\n    }\\r\\n\\r\\n    function submit_date() {\\r\\n        if (hours === \\\"\\\" || minutes === \\\"\\\" || !picked_date) {\\r\\n            return;\\r\\n        }\\r\\n        picked_date.setHours(parseInt(hours), parseInt(minutes));\\r\\n        dispatch(\\\"date\\\", {date: picked_date});\\r\\n    }\\r\\n\\r\\n    function cancel() {\\r\\n        dispatch(\\\"cancel\\\");\\r\\n    }\\r\\n\\r\\n    let weeks = {};\\r\\n\\r\\n    $: this_month_days = month_days(month, year);\\r\\n    $: month_string = months[month % months.length];\\r\\n    $: {\\r\\n        weeks = {};\\r\\n        this_month_days.forEach((day) => {\\r\\n            const week_number = `${day.getWeek()}`;\\r\\n            if (!Object.keys(weeks).includes(week_number)) {\\r\\n                weeks[week_number] = [];\\r\\n            }\\r\\n            weeks[week_number].push(day);\\r\\n        });\\r\\n\\r\\n    }\\r\\n</script>\\r\\n<div class=\\\"datepicker\\\">\\r\\n    <div class=\\\"header\\\">\\r\\n        <div class=\\\"prev\\\" on:click={dec_month}>\\r\\n            <span class=\\\"chevron\\\">&#8249;</span>\\r\\n            <span class=\\\"month\\\">\\r\\n                {months[(month > 0 ? month - 1 : 11) % months.length].substring(0, 3)}\\r\\n            </span>\\r\\n        </div>\\r\\n        <span class=\\\"current-month\\\">{month_string} {year}</span>\\r\\n        <div class=\\\"next\\\" on:click={inc_month}>\\r\\n            <span class=\\\"month\\\">\\r\\n                {months[(month + 1) % months.length].substring(0, 3)}\\r\\n            </span>\\r\\n            <span class=\\\"chevron\\\">&#x203a;</span>\\r\\n        </div>\\r\\n    </div>\\r\\n    <table>\\r\\n        <thead>\\r\\n            <tr>\\r\\n                <th>#</th>\\r\\n                <th>Mon</th>\\r\\n                <th>Tue</th>\\r\\n                <th>Wed</th>\\r\\n                <th>Thu</th>\\r\\n                <th>Fri</th>\\r\\n                <th>Sat</th>\\r\\n                <th>Sun</th>\\r\\n            </tr>\\r\\n        </thead>\\r\\n        <tbody>\\r\\n            {#each Object.keys(weeks) as week_number}\\r\\n                <tr class=\\\"week\\\">\\r\\n                    {#if month !== 11 || week_number !== \\\"1\\\"}\\r\\n                        <td class=\\\"week-number\\\">{week_number}</td>\\r\\n                        {#each weeks[week_number] as date}\\r\\n                            {#if date.getDate() === 1}\\r\\n                                {#each weekdays.slice(weeks[week_number].length) as i}\\r\\n                                    <td\\r\\n                                        class=\\\"date disabled\\\"\\r\\n                                        class:today={is_same_date(new Date(year, month, 1 - i))}\\r\\n                                        class:picked={is_same_date(picked_date, new Date(year, month, 1 - i))}\\r\\n                                        on:click={() => picked_date = new Date(year, month, 1 - i)}\\r\\n                                    >\\r\\n                                        {new Date(new Date().setDate(weeks[week_number][0].getDate() - i)).getDate()}\\r\\n                                    </td>\\r\\n                                {/each}\\r\\n                            {/if}\\r\\n                            <td\\r\\n                                class=\\\"date\\\"\\r\\n                                class:picked={is_same_date(picked_date, date)}\\r\\n                                class:today={is_same_date(date)}\\r\\n                                on:click={() => picked_date = date}\\r\\n                            >\\r\\n                                {date.getDate()}\\r\\n                            </td>\\r\\n                            {#if date.getDate() === final_day_of_month(date.getFullYear(), date.getMonth()).getDate()}\\r\\n                                {#each weekdays.slice(weeks[week_number].length) as _, i}\\r\\n                                    <td\\r\\n                                        class=\\\"date disabled\\\"\\r\\n                                        class:today={is_same_date(day_x_next_month(year, month, i + 1))}\\r\\n                                        class:picked={is_same_date(picked_date, day_x_next_month(year, month, i + 1))}\\r\\n                                        on:click={() => picked_date = day_x_next_month(year, month, i + 1)}\\r\\n                                    >\\r\\n                                        {i + 1}\\r\\n                                    </td>\\r\\n                                {/each}\\r\\n                            {/if}\\r\\n                        {/each}\\r\\n                    {/if}\\r\\n                </tr>\\r\\n            {/each}\\r\\n            {#if month === 11}\\r\\n                <td class=\\\"week-number\\\">1</td>\\r\\n                {#each weeks[\\\"1\\\"] as date}\\r\\n                    <td\\r\\n                        class=\\\"date\\\"\\r\\n                        class:picked={is_same_date(picked_date, date)}\\r\\n                        class:today={is_same_date(date)}\\r\\n                        on:click={() => picked_date = date}\\r\\n                    >\\r\\n                        {date.getDate()}\\r\\n                    </td>\\r\\n                    {#if date.getDate() === final_day_of_month(date.getFullYear(), date.getMonth()).getDate()}\\r\\n                        {#each weekdays.slice(weeks[\\\"1\\\"].length) as _, i}\\r\\n                            <td\\r\\n                                class=\\\"date disabled\\\"\\r\\n                                class:today={is_same_date(day_x_next_month(year, month, i + 1))}\\r\\n                                class:picked={is_same_date(picked_date, day_x_next_month(year, month, i + 1))}\\r\\n                                on:click={() => picked_date = day_x_next_month(year, month, i + 1)}\\r\\n                            >\\r\\n                                {i + 1}\\r\\n                            </td>\\r\\n                        {/each}\\r\\n                    {/if}\\r\\n                {/each}\\r\\n            {/if}\\r\\n        </tbody>\\r\\n    </table>\\r\\n    <div class=\\\"footer\\\">\\r\\n        <button class=\\\"footer-btn cancel\\\" on:click={cancel}>&#xd7;</button>\\r\\n        <div class=\\\"timepicker\\\">\\r\\n            <input type=\\\"text\\\" class=\\\"numerical\\\" placeholder=\\\"12\\\" bind:value={hours}/>\\r\\n            :\\r\\n            <input type=\\\"text\\\" class=\\\"numerical\\\" placeholder=\\\"48\\\" bind:value={minutes}/>\\r\\n        </div>\\r\\n        <button\\r\\n            class=\\\"footer-btn submit\\\"\\r\\n            class:disabled={hours === \\\"\\\" || minutes === \\\"\\\" || !picked_date}\\r\\n            on:click={submit_date}\\r\\n        >\\r\\n            &#x2713;\\r\\n        </button>\\r\\n    </div>\\r\\n</div>\\r\\n\\r\\n<style lang=\\\"scss\\\">.datepicker {\\n  display: flex;\\n  flex-direction: column;\\n  width: 315px;\\n  background-color: white;\\n  box-shadow: 0 5px 10px 2px rgba(0, 0, 0, 0.3); }\\n  .datepicker .header {\\n    display: flex;\\n    justify-content: space-between;\\n    align-items: center;\\n    margin-bottom: 5px;\\n    font-size: 18px;\\n    text-transform: uppercase;\\n    color: white;\\n    font-weight: bold;\\n    background-color: #0681ff; }\\n    .datepicker .header .next, .datepicker .header .prev {\\n      cursor: pointer;\\n      display: flex;\\n      align-items: center;\\n      justify-content: center;\\n      transition: color .15s linear;\\n      font-size: 14px;\\n      width: 55px;\\n      padding: 0 10px;\\n      height: 40px; }\\n      .datepicker .header .next:hover, .datepicker .header .prev:hover {\\n        background-color: #0068d2; }\\n      .datepicker .header .next .chevron, .datepicker .header .prev .chevron {\\n        margin-top: -4px;\\n        font-size: 22px; }\\n    .datepicker .header .next {\\n      text-align: right; }\\n      .datepicker .header .next .month {\\n        margin-right: 5px; }\\n    .datepicker .header .prev {\\n      text-align: left; }\\n      .datepicker .header .prev .month {\\n        margin-left: 5px; }\\n  .datepicker table {\\n    width: 100%; }\\n    .datepicker table * {\\n      text-align: center; }\\n    .datepicker table td {\\n      width: 35px;\\n      height: 35px;\\n      font-size: 16px; }\\n      .datepicker table td:not(.week-number) {\\n        cursor: pointer; }\\n        .datepicker table td:not(.week-number).today {\\n          background-color: #7dabca; }\\n        .datepicker table td:not(.week-number):hover, .datepicker table td:not(.week-number).picked {\\n          background-color: #0681ff;\\n          color: white; }\\n        .datepicker table td:not(.week-number).disabled:not(.picked):not(.today) {\\n          color: #AAA; }\\n      .datepicker table td.week-number {\\n        font-weight: bold; }\\n\\n.footer {\\n  display: flex;\\n  justify-content: space-between;\\n  align-items: center;\\n  padding: 5px; }\\n  .footer .timepicker {\\n    display: flex;\\n    align-items: center;\\n    justify-content: center;\\n    justify-self: center; }\\n    .footer .timepicker * {\\n      font-size: 22px; }\\n    .footer .timepicker input.numerical {\\n      width: 25px;\\n      border: none;\\n      border-bottom: 1px solid #AAA;\\n      padding: 0 5px;\\n      text-align: center; }\\n  .footer .footer-btn {\\n    height: 28px;\\n    width: 28px;\\n    color: white;\\n    font-weight: bold;\\n    border: none;\\n    cursor: pointer; }\\n    .footer .footer-btn.submit {\\n      background-color: #0681ff; }\\n      .footer .footer-btn.submit:hover {\\n        background-color: #0068d2; }\\n      .footer .footer-btn.submit.disabled {\\n        cursor: default;\\n        background-color: #797979; }\\n        .footer .footer-btn.submit.disabled:hover {\\n          background-color: #797979; }\\n    .footer .footer-btn.cancel {\\n      background-color: #797979; }\\n      .footer .footer-btn.cancel:hover {\\n        background-color: #6b6b6b; }\\n\\n/*# sourceMappingURL=DatePicker.svelte.css.map */</style>\"],\"names\":[],\"mappings\":\"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\"}"
};

function month_days(month, year) {
      const date = new Date(year, month, 1);
      let days = [];
      while (date.getMonth() === month) {
          days.push(new Date(date));
          date.setDate(date.getDate() + 1);
      }
      return days;
  }

function final_day_of_month(year, month) {
      return new Date(year, month + 1, 0);
  }

function day_x_next_month(year, month, date) {
      month = month + 1;
      return new Date(year, month, date);
  }

const DatePicker = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	

    let { month = new Date().getMonth(), year = new Date().getFullYear() } = $$props;
    const today = new Date();
    const weekdays = [7, 6, 5, 4, 3, 2, 1];
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    let picked_date;
    let hours = "";
    let minutes = "";

    function is_same_date(date, cmp_date) {
        if (!date) {
            return false;
        }
        cmp_date = !!cmp_date ? cmp_date : today;
        return date.getFullYear() === cmp_date.getFullYear()
            && date.getMonth() === cmp_date.getMonth()
            && date.getDate() === cmp_date.getDate();
    }

    let weeks = {};

	if ($$props.month === void 0 && $$bindings.month && month !== void 0) $$bindings.month(month);
	if ($$props.year === void 0 && $$bindings.year && year !== void 0) $$bindings.year(year);

	$$result.css.add(css$1);

	let this_month_days = month_days(month, year);
	let month_string = months[month % months.length];
	{
            weeks = {};
            this_month_days.forEach((day) => {
                const week_number = `${day.getWeek()}`;
                if (!Object.keys(weeks).includes(week_number)) {
                    weeks[week_number] = [];
                }
                weeks[week_number].push(day);
            });
    
        }

	return `<div class="datepicker svelte-6agj4j">
	    <div class="header svelte-6agj4j">
	        <div class="prev svelte-6agj4j">
	            <span class="chevron svelte-6agj4j">‹</span>
	            <span class="month svelte-6agj4j">
	                ${escape(months[(month > 0 ? month - 1 : 11) % months.length].substring(0, 3))}
	            </span>
	        </div>
	        <span class="current-month">${escape(month_string)} ${escape(year)}</span>
	        <div class="next svelte-6agj4j">
	            <span class="month svelte-6agj4j">
	                ${escape(months[(month + 1) % months.length].substring(0, 3))}
	            </span>
	            <span class="chevron svelte-6agj4j">›</span>
	        </div>
	    </div>
	    <table class="svelte-6agj4j">
	        <thead class="svelte-6agj4j">
	            <tr class="svelte-6agj4j">
	                <th class="svelte-6agj4j">#</th>
	                <th class="svelte-6agj4j">Mon</th>
	                <th class="svelte-6agj4j">Tue</th>
	                <th class="svelte-6agj4j">Wed</th>
	                <th class="svelte-6agj4j">Thu</th>
	                <th class="svelte-6agj4j">Fri</th>
	                <th class="svelte-6agj4j">Sat</th>
	                <th class="svelte-6agj4j">Sun</th>
	            </tr>
	        </thead>
	        <tbody class="svelte-6agj4j">
	            ${each(Object.keys(weeks), (week_number) => `<tr class="week svelte-6agj4j">
	                    ${ month !== 11 || week_number !== "1" ? `<td class="week-number svelte-6agj4j">${escape(week_number)}</td>
	                        ${each(weeks[week_number], (date) => `${ date.getDate() === 1 ? `${each(weekdays.slice(weeks[week_number].length), (i) => `<td class="${[`date disabled svelte-6agj4j`, is_same_date(new Date(year, month, 1 - i)) ? "today" : "", is_same_date(picked_date, new Date(year, month, 1 - i)) ? "picked" : ""].join(' ').trim() }">
	                                        ${escape(new Date(new Date().setDate(weeks[week_number][0].getDate() - i)).getDate())}
	                                    </td>`)}` : `` }
	                            <td class="${[`date svelte-6agj4j`, is_same_date(picked_date, date) ? "picked" : "", is_same_date(date) ? "today" : ""].join(' ').trim() }">
	                                ${escape(date.getDate())}
	                            </td>
	                            ${ date.getDate() === final_day_of_month(date.getFullYear(), date.getMonth()).getDate() ? `${each(weekdays.slice(weeks[week_number].length), (_, i) => `<td class="${[`date disabled svelte-6agj4j`, is_same_date(day_x_next_month(year, month, i + 1)) ? "today" : "", is_same_date(picked_date, day_x_next_month(year, month, i + 1)) ? "picked" : ""].join(' ').trim() }">
	                                        ${escape(i + 1)}
	                                    </td>`)}` : `` }`)}` : `` }
	                </tr>`)}
	            ${ month === 11 ? `<td class="week-number svelte-6agj4j">1</td>
	                ${each(weeks["1"], (date) => `<td class="${[`date svelte-6agj4j`, is_same_date(picked_date, date) ? "picked" : "", is_same_date(date) ? "today" : ""].join(' ').trim() }">
	                        ${escape(date.getDate())}
	                    </td>
	                    ${ date.getDate() === final_day_of_month(date.getFullYear(), date.getMonth()).getDate() ? `${each(weekdays.slice(weeks["1"].length), (_, i) => `<td class="${[`date disabled svelte-6agj4j`, is_same_date(day_x_next_month(year, month, i + 1)) ? "today" : "", is_same_date(picked_date, day_x_next_month(year, month, i + 1)) ? "picked" : ""].join(' ').trim() }">
	                                ${escape(i + 1)}
	                            </td>`)}` : `` }`)}` : `` }
	        </tbody>
	    </table>
	    <div class="footer svelte-6agj4j">
	        <button class="footer-btn cancel svelte-6agj4j">×</button>
	        <div class="timepicker svelte-6agj4j">
	            <input type="text" class="numerical svelte-6agj4j" placeholder="12"${add_attribute("value", hours)}>
	            :
	            <input type="text" class="numerical svelte-6agj4j" placeholder="48"${add_attribute("value", minutes)}>
	        </div>
	        <button class="${[`footer-btn submit svelte-6agj4j`,  "disabled" ].join(' ').trim() }">
	            ✓
	        </button>
	    </div>
	</div>`;
});

/* src\components\Modal.svelte generated by Svelte v3.6.1 */

const css$2 = {
	code: ".modal-wrapper.svelte-me2b3v{position:fixed;top:0;right:0;bottom:0;left:0;display:flex;justify-content:center;align-items:center;background-color:rgba(0, 0, 0, 0.6);z-index:1}.modal-wrapper.hidden.svelte-me2b3v{display:none}.modal-wrapper.svelte-me2b3v .modal-inner.svelte-me2b3v{display:flex;flex-direction:column;background-color:white;min-height:300px}.modal-wrapper.svelte-me2b3v .modal-inner .modal-title.svelte-me2b3v{display:flex;justify-content:space-between;align-items:center;padding:5px 15px;text-transform:uppercase;font-size:20px}.modal-wrapper.svelte-me2b3v .modal-inner .modal-title i.svelte-me2b3v{cursor:pointer}.modal-wrapper.svelte-me2b3v .modal-inner .modal-content.svelte-me2b3v{padding:15px}",
	map: "{\"version\":3,\"file\":\"Modal.svelte\",\"sources\":[\"Modal.svelte\"],\"sourcesContent\":[\"<script>\\r\\n    import { createEventDispatcher } from \\\"svelte\\\";\\r\\n    const dispatch = createEventDispatcher();\\r\\n\\r\\n    export let title = \\\"Modal\\\";\\r\\n    export let color = \\\"#689dc0\\\";\\r\\n    export let show = false;\\r\\n    export let width = \\\"auto\\\";\\r\\n\\r\\n    let modal_binding;\\r\\n\\r\\n    document.onkeydown = (event) => {\\r\\n        if (event.key === \\\"Escape\\\" && show) {\\r\\n            show = false;\\r\\n        }\\r\\n    }\\r\\n\\r\\n    function wrapper_click(event) {\\r\\n        if (event.target === modal_binding) {\\r\\n            hide_modal();\\r\\n        }\\r\\n    }\\r\\n\\r\\n    function hide_modal() {\\r\\n        show = false;\\r\\n        dispatch(\\\"hide\\\");\\r\\n    }\\r\\n</script>\\r\\n\\r\\n<div\\r\\n    class=\\\"modal-wrapper\\\"\\r\\n    class:hidden={!show}\\r\\n    on:click={wrapper_click}\\r\\n    bind:this={modal_binding}\\r\\n    display=\\\"width: {width === \\\"auto\\\" ? width : `$[width}px`}\\\"\\r\\n>\\r\\n    <div class=\\\"modal-inner\\\">\\r\\n        <div class=\\\"modal-title\\\" style=\\\"background-color: {color};\\\">\\r\\n            <span class=\\\"title\\\">{title}</span>\\r\\n            <span class=\\\"close-btn\\\">\\r\\n                <i class=\\\"fas fa-close\\\" on:click={hide_modal}></i>\\r\\n            </span>\\r\\n        </div>\\r\\n        <div class=\\\"modal-content\\\">\\r\\n            <slot></slot>\\r\\n        </div>\\r\\n    </div>\\r\\n</div>\\r\\n\\r\\n<style lang=\\\"scss\\\">.modal-wrapper {\\n  position: fixed;\\n  top: 0;\\n  right: 0;\\n  bottom: 0;\\n  left: 0;\\n  display: flex;\\n  justify-content: center;\\n  align-items: center;\\n  background-color: rgba(0, 0, 0, 0.6);\\n  z-index: 1; }\\n  .modal-wrapper.hidden {\\n    display: none; }\\n  .modal-wrapper .modal-inner {\\n    display: flex;\\n    flex-direction: column;\\n    background-color: white;\\n    min-height: 300px; }\\n    .modal-wrapper .modal-inner .modal-title {\\n      display: flex;\\n      justify-content: space-between;\\n      align-items: center;\\n      padding: 5px 15px;\\n      text-transform: uppercase;\\n      font-size: 20px; }\\n      .modal-wrapper .modal-inner .modal-title i {\\n        cursor: pointer; }\\n    .modal-wrapper .modal-inner .modal-content {\\n      padding: 15px; }\\n\\n/*# sourceMappingURL=Modal.svelte.css.map */</style>\"],\"names\":[],\"mappings\":\"AAiDmB,cAAc,cAAC,CAAC,AACjC,QAAQ,CAAE,KAAK,CACf,GAAG,CAAE,CAAC,CACN,KAAK,CAAE,CAAC,CACR,MAAM,CAAE,CAAC,CACT,IAAI,CAAE,CAAC,CACP,OAAO,CAAE,IAAI,CACb,eAAe,CAAE,MAAM,CACvB,WAAW,CAAE,MAAM,CACnB,gBAAgB,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,CACpC,OAAO,CAAE,CAAC,AAAE,CAAC,AACb,cAAc,OAAO,cAAC,CAAC,AACrB,OAAO,CAAE,IAAI,AAAE,CAAC,AAClB,4BAAc,CAAC,YAAY,cAAC,CAAC,AAC3B,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,MAAM,CACtB,gBAAgB,CAAE,KAAK,CACvB,UAAU,CAAE,KAAK,AAAE,CAAC,AACpB,4BAAc,CAAC,YAAY,CAAC,YAAY,cAAC,CAAC,AACxC,OAAO,CAAE,IAAI,CACb,eAAe,CAAE,aAAa,CAC9B,WAAW,CAAE,MAAM,CACnB,OAAO,CAAE,GAAG,CAAC,IAAI,CACjB,cAAc,CAAE,SAAS,CACzB,SAAS,CAAE,IAAI,AAAE,CAAC,AAClB,4BAAc,CAAC,YAAY,CAAC,YAAY,CAAC,CAAC,cAAC,CAAC,AAC1C,MAAM,CAAE,OAAO,AAAE,CAAC,AACtB,4BAAc,CAAC,YAAY,CAAC,cAAc,cAAC,CAAC,AAC1C,OAAO,CAAE,IAAI,AAAE,CAAC\"}"
};

const Modal = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {

    let { title = "Modal", color = "#689dc0", show = false, width = "auto" } = $$props;

    let modal_binding;

    document.onkeydown = (event) => {
        if (event.key === "Escape" && show) {
            show = false;
        }
    };

	if ($$props.title === void 0 && $$bindings.title && title !== void 0) $$bindings.title(title);
	if ($$props.color === void 0 && $$bindings.color && color !== void 0) $$bindings.color(color);
	if ($$props.show === void 0 && $$bindings.show && show !== void 0) $$bindings.show(show);
	if ($$props.width === void 0 && $$bindings.width && width !== void 0) $$bindings.width(width);

	$$result.css.add(css$2);

	return `<div class="${[`modal-wrapper svelte-me2b3v`, !show ? "hidden" : ""].join(' ').trim() }" display="width: ${escape(width === "auto" ? width : `$[width}px`)}"${add_attribute("this", modal_binding)}>
	    <div class="modal-inner svelte-me2b3v">
	        <div class="modal-title svelte-me2b3v" style="background-color: ${escape(color)};">
	            <span class="title">${escape(title)}</span>
	            <span class="close-btn">
	                <i class="fas fa-close svelte-me2b3v"></i>
	            </span>
	        </div>
	        <div class="modal-content svelte-me2b3v">
	            ${$$slots.default ? $$slots.default() : ``}
	        </div>
	    </div>
	</div>`;
});

function pad_int(i) {
    return i < 9 ? `0${i}` : `${i}`;
}

/* src\components\AxleCounterTable.svelte generated by Svelte v3.6.1 */

const css$3 = {
	code: "table.svelte-mf5tkw{width:100%;border-spacing:unset}table.svelte-mf5tkw th.svelte-mf5tkw,table.svelte-mf5tkw td.svelte-mf5tkw{min-width:50px}table.svelte-mf5tkw th.svelte-mf5tkw:first-child,table.svelte-mf5tkw td.svelte-mf5tkw:first-child{min-width:400px}table.svelte-mf5tkw th.svelte-mf5tkw:last-child,table.svelte-mf5tkw td.svelte-mf5tkw:last-child{text-align:center}table.svelte-mf5tkw thead.svelte-mf5tkw{text-transform:uppercase;text-align:left}table.svelte-mf5tkw thead th.sortable.svelte-mf5tkw{cursor:pointer}table.svelte-mf5tkw thead th.sortable i.svelte-mf5tkw{color:#0068d2}table.svelte-mf5tkw tbody.svelte-mf5tkw{text-transform:initial}table.svelte-mf5tkw tbody tr.svelte-mf5tkw{background-color:white}table.svelte-mf5tkw tbody tr.svelte-mf5tkw:nth-child(odd){background-color:#F3F3F3}table.svelte-mf5tkw tbody tr td.svelte-mf5tkw{font-size:20px;height:34px}table.svelte-mf5tkw tbody tr td.svelte-mf5tkw:last-child{display:flex;justify-content:center}table.svelte-mf5tkw tbody tr td .shoveling-btn.svelte-mf5tkw{display:flex;justify-content:center;height:28px;text-transform:uppercase;margin:3px 0;border:none;color:white;background-color:inherit;cursor:pointer;padding:0}table.svelte-mf5tkw tbody tr td .shoveling-btn:hover i.svelte-mf5tkw{font-size:18px;background-color:#0068d2}table.svelte-mf5tkw tbody tr td .shoveling-btn:hover span.svelte-mf5tkw{color:#0068d2;border-color:#0068d2}table.svelte-mf5tkw tbody tr td .shoveling-btn i.svelte-mf5tkw{color:white;background-color:#0681ff;font-size:18px;width:28px;height:28px;line-height:28px}table.svelte-mf5tkw tbody tr td .shoveling-btn span.svelte-mf5tkw{font-size:14px;padding:0 5px;line-height:28px;color:#0681ff;border:1px solid #0681ff;border-left:none}table.svelte-mf5tkw tbody tr td .no-last-crossing.svelte-mf5tkw{font-weight:bold;color:#f32121}.table-nav.svelte-mf5tkw{display:flex;width:100%;justify-content:center;align-items:flex-end;flex:1}.table-nav.svelte-mf5tkw .center-wrap.svelte-mf5tkw{display:flex;justify-content:center;align-items:center}.table-nav.svelte-mf5tkw .center-wrap button.svelte-mf5tkw{cursor:pointer;padding:3px;width:80px;font-size:16px;text-transform:uppercase;border:none;background-color:#0681ff;color:white}.table-nav.svelte-mf5tkw .center-wrap button.svelte-mf5tkw:not(.disabled):hover{background-color:#0068d2}.table-nav.svelte-mf5tkw .center-wrap button.disabled.svelte-mf5tkw{cursor:default;color:black;background-color:#888}.table-nav.svelte-mf5tkw .center-wrap span.svelte-mf5tkw{font-size:20px;margin:0 20px}.submit-shoveling.svelte-mf5tkw{width:100%;margin-top:15px;background-color:#0681ff;color:white;border:none;font-size:22px;padding:5px}.submit-shoveling.disabled.svelte-mf5tkw{background-color:#888}.submit-shoveling.svelte-mf5tkw:not(.disabled){cursor:pointer}.submit-shoveling.svelte-mf5tkw:not(.disabled):hover{background-color:#0068d2}",
	map: "{\"version\":3,\"file\":\"AxleCounterTable.svelte\",\"sources\":[\"AxleCounterTable.svelte\"],\"sourcesContent\":[\"<script>\\r\\n    import { onMount } from \\\"svelte\\\";\\r\\n    import { axle_query } from \\\"../stores.js\\\"\\r\\n    import config from \\\"../const.js\\\";\\r\\n    import IgnoreToggle from \\\"./IgnoreToggle.svelte\\\";\\r\\n    import DatePicker from \\\"./DatePicker.svelte\\\";\\r\\n    import Modal from \\\"./Modal.svelte\\\";\\r\\n    import { pad_int } from \\\"../lib.js\\\";\\r\\n\\r\\n    export let counters = [];\\r\\n    export let exclude = [];\\r\\n    export let sorting = {};\\r\\n    export let threshold = 25;\\r\\n    export let aliases = {};\\r\\n    export let ascending = false;\\r\\n    export let sortby = sorting[0];\\r\\n\\r\\n    let show_modal = false;\\r\\n    let page_index = 0;\\r\\n    let shoveling_date;\\r\\n    let selected_axle_counter;\\r\\n    let maxlen = Math.max(Math.floor((window.innerHeight - 400) / 36) + 1, 5);\\r\\n\\r\\n    $: filtered_reports = counters.filter((report, index) => {\\r\\n        return (report.axle_counter.toLowerCase().includes($axle_query.toLowerCase())\\r\\n            || `${report.number_of_crossings}`.includes($axle_query)\\r\\n            || $axle_query.toLowerCase() === \\\"ignored\\\" && report.ignored\\r\\n            || $axle_query.toLowerCase() === \\\"not ignored\\\" && !report.ignored\\r\\n            || report.crossing_time.includes($axle_query)\\r\\n            || $axle_query === \\\"\\\");\\r\\n    }).sort(sorting[sortby][ascending ? \\\"asc\\\" : \\\"desc\\\"]);\\r\\n\\r\\n    $: last_page = Math.floor(filtered_reports.length / maxlen);\\r\\n    $: page_index = page_index > last_page ? last_page : page_index;\\r\\n\\r\\n    function next() {\\r\\n        if (page_index >= last_page) {\\r\\n            return;\\r\\n        }\\r\\n        page_index = page_index >= last_page ? last_page : page_index + 1;\\r\\n    }\\r\\n\\r\\n    function prev() {\\r\\n        if (page_index <= 0) {\\r\\n            return;\\r\\n        }\\r\\n        page_index = page_index <= 0 ? 0 : page_index - 1;\\r\\n    }\\r\\n\\r\\n    function shoveling_submit() {\\r\\n        fetch(`${config.api_url}/shoveling/`, {\\r\\n            method: \\\"POST\\\",\\r\\n            body: JSON.stringify({\\r\\n                id: selected_axle_counter.id,\\r\\n                shoveling_timestamp: shoveling_date.toISOString(),\\r\\n            }),\\r\\n        }).then(() => {\\r\\n            console.log(\\\"Success\\\")\\r\\n        }).catch((error) => {\\r\\n            console.error(error)\\r\\n        }).finally(() => {\\r\\n            show_modal = false;\\r\\n            shoveling_date = null;\\r\\n            selected_axle_counter = null;\\r\\n        });\\r\\n    }\\r\\n\\r\\n    function set_sorting(key) {\\r\\n        if (key === sortby) {\\r\\n            ascending = !ascending;\\r\\n            return;\\r\\n        }\\r\\n        ascending = true;\\r\\n        sortby = key;\\r\\n    }\\r\\n\\r\\n    function shoveling_cancel() {\\r\\n        show_modal = false;\\r\\n        shoveling_date = null;\\r\\n        selected_axle_counter = null;\\r\\n    }\\r\\n\\r\\n    function toggle_counter_ignore(counter) {\\r\\n        counter.ignored = !counter.ignored;\\r\\n        const url = `${config.api_url}/ignored_axle_counters`;\\r\\n        const req = fetch(url, { method: counter.ignored ? \\\"POST\\\" : \\\"DELETE\\\", body: {name: counter.axle_counter} });\\r\\n        req.catch(() => {\\r\\n            console.log(\\\"ERROR IN TOGGLE\\\");\\r\\n            counter.ignored = !counter.ignore;\\r\\n        });\\r\\n    }\\r\\n\\r\\n    function register_shoveling(counter) {\\r\\n        selected_axle_counter = counter;\\r\\n        show_modal = true;\\r\\n    }\\r\\n\\r\\n    window.onresize = function(event) {\\r\\n        maxlen = Math.max(Math.floor((window.innerHeight - 400) / 36) + 1, 5);\\r\\n        page_index = Math.min(page_index, last_page);\\r\\n    };\\r\\n</script>\\r\\n\\r\\n<table>\\r\\n    <thead>\\r\\n        <tr>\\r\\n            {#each Object.keys(counters[0]) as key}\\r\\n                {#if !exclude.includes(key)}\\r\\n                    <th\\r\\n                        class:sortable={Object.keys(sorting).includes(key)}\\r\\n                        on:click={() => set_sorting(key)}\\r\\n                    >\\r\\n                        {#if Object.keys(sorting).includes(key)}\\r\\n                            {#if key === sortby}\\r\\n                                {#if ascending}\\r\\n                                    <i class=\\\"fas fa-sort-up\\\"></i>\\r\\n                                {:else}\\r\\n                                    <i class=\\\"fas fa-sort-down\\\"></i>\\r\\n                                {/if}\\r\\n                            {:else}\\r\\n                                <i class=\\\"fas fa-sort\\\"></i>\\r\\n                            {/if}\\r\\n                        {/if}\\r\\n                        {#if Object.keys(aliases).includes(key)}\\r\\n                            {aliases[key]}\\r\\n                        {:else}\\r\\n                            {key}\\r\\n                        {/if}\\r\\n                    </th>\\r\\n                {/if}\\r\\n            {/each}\\r\\n            <th\\r\\n                style=\\\"width: 175px;\\\"\\r\\n                class:sortable={Object.keys(sorting).includes(\\\"days_since_last_crossing\\\")}\\r\\n                on:click={() => set_sorting(\\\"days_since_last_crossing\\\")}\\r\\n            >\\r\\n                {#if \\\"days_since_last_crossing\\\" === sortby}\\r\\n                    {#if ascending}\\r\\n                        <i class=\\\"fas fa-sort-up\\\"></i>\\r\\n                    {:else}\\r\\n                        <i class=\\\"fas fa-sort-down\\\"></i>\\r\\n                    {/if}\\r\\n                {:else}\\r\\n                    <i class=\\\"fas fa-sort\\\"></i>\\r\\n                {/if}\\r\\n                last crossing\\r\\n            </th>\\r\\n            <th\\r\\n                style=\\\"width: 175px;\\\"\\r\\n                class:sortable={Object.keys(sorting).includes(\\\"ignored\\\")}\\r\\n                on:click={() => set_sorting(\\\"ignored\\\")}\\r\\n            >\\r\\n                {#if \\\"ignored\\\" === sortby}\\r\\n                    {#if ascending}\\r\\n                        <i class=\\\"fas fa-sort-up\\\"></i>\\r\\n                    {:else}\\r\\n                        <i class=\\\"fas fa-sort-down\\\"></i>\\r\\n                    {/if}\\r\\n                {:else}\\r\\n                    <i class=\\\"fas fa-sort\\\"></i>\\r\\n                {/if}\\r\\n                ignored\\r\\n            </th>\\r\\n            <th style=\\\"width: 175px;\\\">ignore</th>\\r\\n            <th style=\\\"width: 250px;\\\">shoveling</th>\\r\\n        </tr>\\r\\n    </thead>\\r\\n    <tbody>\\r\\n        {#each filtered_reports as counter, index}\\r\\n            {#if index >= page_index * maxlen && index <= page_index * maxlen + maxlen}\\r\\n                <tr>\\r\\n                    {#each Object.keys(counter) as key}\\r\\n                        {#if !exclude.includes(key)}\\r\\n                            <td>{counter[key]}</td>\\r\\n                        {/if}\\r\\n                    {/each}\\r\\n                    <td>\\r\\n                        {#if !counter.days_since_last_crossing}\\r\\n                            <div class=\\\"no-last-crossing\\\">\\r\\n                                NOT CROSSED\\r\\n                            </div>\\r\\n                        {:else}\\r\\n                            {#if counter.days_since_last_crossing >= threshold}\\r\\n                                <div class=\\\"no-last-crossing\\\">\\r\\n                                    {counter.days_since_last_crossing} days ago\\r\\n                                </div>\\r\\n                            {:else}\\r\\n                                {counter.days_since_last_crossing} days ago\\r\\n                            {/if}\\r\\n                        {/if}\\r\\n                    </td>\\r\\n                    <td>\\r\\n                        <IgnoreToggle\\r\\n                            ignored={counter.ignored}\\r\\n                            on:toggle={() => toggle_counter_ignore(counter)}\\r\\n                        />\\r\\n                    </td>\\r\\n                    <td>\\r\\n                        <button\\r\\n                            class=\\\"shoveling-btn\\\"\\r\\n                            on:click={() => register_shoveling(counter)}>\\r\\n                            <i class=\\\"fas fa-clipboard-check\\\" />\\r\\n                            <span>Register shoveling</span>\\r\\n                        </button>\\r\\n                    </td>\\r\\n                </tr>\\r\\n            {/if}\\r\\n        {/each}\\r\\n    </tbody>\\r\\n</table>\\r\\n\\r\\n<div class=\\\"table-nav\\\">\\r\\n    <div class=\\\"center-wrap\\\">\\r\\n        <button class:disabled={page_index <= 0} on:click={prev}>\\r\\n            prev\\r\\n        </button>\\r\\n        <span>Page {page_index + 1} of {last_page + 1}</span>\\r\\n        <button class:disabled={page_index >= last_page} on:click={next}>\\r\\n            next\\r\\n        </button>\\r\\n    </div>\\r\\n</div>\\r\\n\\r\\n<Modal\\r\\n    title={\\\"register shoveling\\\"}\\r\\n    show={show_modal}\\r\\n    on:hide={() => (show_modal = false)}\\r\\n>\\r\\n    <DatePicker on:date={(e) => shoveling_date = e.detail.date} on:cancel={() => show_modal = false}/>\\r\\n    <button\\r\\n        class=\\\"submit-shoveling\\\"\\r\\n        class:disabled={!shoveling_date}\\r\\n        on:click={shoveling_submit}\\r\\n    >\\r\\n        {shoveling_date ? `${config.months[shoveling_date.getMonth()]} ${pad_int(shoveling_date.getDate())} ${shoveling_date.getFullYear()} ${pad_int(shoveling_date.getHours())}:${pad_int(shoveling_date.getMinutes())}` : \\\"Submit\\\"}\\r\\n    </button>\\r\\n</Modal>\\r\\n\\r\\n<style lang=\\\"scss\\\">table {\\n  width: 100%;\\n  border-spacing: unset; }\\n  table th, table td {\\n    min-width: 50px; }\\n    table th:first-child, table td:first-child {\\n      min-width: 400px; }\\n    table th:last-child, table td:last-child {\\n      text-align: center; }\\n  table thead {\\n    text-transform: uppercase;\\n    text-align: left; }\\n    table thead th.sortable {\\n      cursor: pointer; }\\n      table thead th.sortable i {\\n        color: #0068d2; }\\n  table tbody {\\n    text-transform: initial; }\\n    table tbody tr {\\n      background-color: white; }\\n      table tbody tr:nth-child(odd) {\\n        background-color: #F3F3F3; }\\n      table tbody tr td {\\n        font-size: 20px;\\n        height: 34px; }\\n        table tbody tr td:last-child {\\n          display: flex;\\n          justify-content: center; }\\n        table tbody tr td .shoveling-btn {\\n          display: flex;\\n          justify-content: center;\\n          height: 28px;\\n          text-transform: uppercase;\\n          margin: 3px 0;\\n          border: none;\\n          color: white;\\n          background-color: inherit;\\n          cursor: pointer;\\n          padding: 0; }\\n          table tbody tr td .shoveling-btn:hover i {\\n            font-size: 18px;\\n            background-color: #0068d2; }\\n          table tbody tr td .shoveling-btn:hover span {\\n            color: #0068d2;\\n            border-color: #0068d2; }\\n          table tbody tr td .shoveling-btn i {\\n            color: white;\\n            background-color: #0681ff;\\n            font-size: 18px;\\n            width: 28px;\\n            height: 28px;\\n            line-height: 28px; }\\n          table tbody tr td .shoveling-btn span {\\n            font-size: 14px;\\n            padding: 0 5px;\\n            line-height: 28px;\\n            color: #0681ff;\\n            border: 1px solid #0681ff;\\n            border-left: none; }\\n        table tbody tr td .no-last-crossing {\\n          font-weight: bold;\\n          color: #f32121; }\\n\\n.table-nav {\\n  display: flex;\\n  width: 100%;\\n  justify-content: center;\\n  align-items: flex-end;\\n  flex: 1; }\\n  .table-nav .center-wrap {\\n    display: flex;\\n    justify-content: center;\\n    align-items: center; }\\n    .table-nav .center-wrap button {\\n      cursor: pointer;\\n      padding: 3px;\\n      width: 80px;\\n      font-size: 16px;\\n      text-transform: uppercase;\\n      border: none;\\n      background-color: #0681ff;\\n      color: white; }\\n      .table-nav .center-wrap button:not(.disabled):hover {\\n        background-color: #0068d2; }\\n      .table-nav .center-wrap button.disabled {\\n        cursor: default;\\n        color: black;\\n        background-color: #888; }\\n    .table-nav .center-wrap span {\\n      font-size: 20px;\\n      margin: 0 20px; }\\n\\n.submit-shoveling {\\n  width: 100%;\\n  margin-top: 15px;\\n  background-color: #0681ff;\\n  color: white;\\n  border: none;\\n  font-size: 22px;\\n  padding: 5px; }\\n  .submit-shoveling.disabled {\\n    background-color: #888; }\\n  .submit-shoveling:not(.disabled) {\\n    cursor: pointer; }\\n    .submit-shoveling:not(.disabled):hover {\\n      background-color: #0068d2; }\\n\\n/*# sourceMappingURL=AxleCounterTable.svelte.css.map */</style>\\r\\n\"],\"names\":[],\"mappings\":\"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\"}"
};

const AxleCounterTable = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	let $axle_query = get_store_value(axle_query);

	

    let { counters = [], exclude = [], sorting = {}, threshold = 25, aliases = {}, ascending = false, sortby = sorting[0] } = $$props;

    let show_modal = false;
    let page_index = 0;
    let shoveling_date;
    let maxlen = Math.max(Math.floor((window.innerHeight - 400) / 36) + 1, 5);

    window.onresize = function(event) {
        maxlen = Math.max(Math.floor((window.innerHeight - 400) / 36) + 1, 5);
        page_index = Math.min(page_index, last_page);
    };

	if ($$props.counters === void 0 && $$bindings.counters && counters !== void 0) $$bindings.counters(counters);
	if ($$props.exclude === void 0 && $$bindings.exclude && exclude !== void 0) $$bindings.exclude(exclude);
	if ($$props.sorting === void 0 && $$bindings.sorting && sorting !== void 0) $$bindings.sorting(sorting);
	if ($$props.threshold === void 0 && $$bindings.threshold && threshold !== void 0) $$bindings.threshold(threshold);
	if ($$props.aliases === void 0 && $$bindings.aliases && aliases !== void 0) $$bindings.aliases(aliases);
	if ($$props.ascending === void 0 && $$bindings.ascending && ascending !== void 0) $$bindings.ascending(ascending);
	if ($$props.sortby === void 0 && $$bindings.sortby && sortby !== void 0) $$bindings.sortby(sortby);

	$$result.css.add(css$3);

	let filtered_reports = counters.filter((report, index) => {
            return (report.axle_counter.toLowerCase().includes($axle_query.toLowerCase())
                || `${report.number_of_crossings}`.includes($axle_query)
                || $axle_query.toLowerCase() === "ignored" && report.ignored
                || $axle_query.toLowerCase() === "not ignored" && !report.ignored
                || report.crossing_time.includes($axle_query)
                || $axle_query === "");
        }).sort(sorting[sortby][ascending ? "asc" : "desc"]);
	let last_page = Math.floor(filtered_reports.length / maxlen);
	page_index = page_index > last_page ? last_page : page_index;

	return `<table class="svelte-mf5tkw">
	    <thead class="svelte-mf5tkw">
	        <tr>
	            ${each(Object.keys(counters[0]), (key) => `${ !exclude.includes(key) ? `<th class="${[`svelte-mf5tkw`, Object.keys(sorting).includes(key) ? "sortable" : ""].join(' ').trim() }">
	                        ${ Object.keys(sorting).includes(key) ? `${ key === sortby ? `${ ascending ? `<i class="fas fa-sort-up svelte-mf5tkw"></i>` : `<i class="fas fa-sort-down svelte-mf5tkw"></i>` }` : `<i class="fas fa-sort svelte-mf5tkw"></i>` }` : `` }
	                        ${ Object.keys(aliases).includes(key) ? `${escape(aliases[key])}` : `${escape(key)}` }
	                    </th>` : `` }`)}
	            <th style="width: 175px;" class="${[`svelte-mf5tkw`, Object.keys(sorting).includes("days_since_last_crossing") ? "sortable" : ""].join(' ').trim() }">
	                ${ "days_since_last_crossing" === sortby ? `${ ascending ? `<i class="fas fa-sort-up svelte-mf5tkw"></i>` : `<i class="fas fa-sort-down svelte-mf5tkw"></i>` }` : `<i class="fas fa-sort svelte-mf5tkw"></i>` }
	                last crossing
	            </th>
	            <th style="width: 175px;" class="${[`svelte-mf5tkw`, Object.keys(sorting).includes("ignored") ? "sortable" : ""].join(' ').trim() }">
	                ${ "ignored" === sortby ? `${ ascending ? `<i class="fas fa-sort-up svelte-mf5tkw"></i>` : `<i class="fas fa-sort-down svelte-mf5tkw"></i>` }` : `<i class="fas fa-sort svelte-mf5tkw"></i>` }
	                ignored
	            </th>
	            <th style="width: 175px;" class="svelte-mf5tkw">ignore</th>
	            <th style="width: 250px;" class="svelte-mf5tkw">shoveling</th>
	        </tr>
	    </thead>
	    <tbody class="svelte-mf5tkw">
	        ${each(filtered_reports, (counter, index) => `${ index >= page_index * maxlen && index <= page_index * maxlen + maxlen ? `<tr class="svelte-mf5tkw">
	                    ${each(Object.keys(counter), (key) => `${ !exclude.includes(key) ? `<td class="svelte-mf5tkw">${escape(counter[key])}</td>` : `` }`)}
	                    <td class="svelte-mf5tkw">
	                        ${ !counter.days_since_last_crossing ? `<div class="no-last-crossing svelte-mf5tkw">
	                                NOT CROSSED
	                            </div>` : `${ counter.days_since_last_crossing >= threshold ? `<div class="no-last-crossing svelte-mf5tkw">
	                                    ${escape(counter.days_since_last_crossing)} days ago
	                                </div>` : `${escape(counter.days_since_last_crossing)} days ago` }` }
	                    </td>
	                    <td class="svelte-mf5tkw">
	                        ${validate_component(IgnoreToggle, 'IgnoreToggle').$$render($$result, { ignored: counter.ignored }, {}, {})}
	                    </td>
	                    <td class="svelte-mf5tkw">
	                        <button class="shoveling-btn svelte-mf5tkw">
	                            <i class="fas fa-clipboard-check svelte-mf5tkw"></i>
	                            <span class="svelte-mf5tkw">Register shoveling</span>
	                        </button>
	                    </td>
	                </tr>` : `` }`)}
	    </tbody>
	</table>

	<div class="table-nav svelte-mf5tkw">
	    <div class="center-wrap svelte-mf5tkw">
	        <button class="${[`svelte-mf5tkw`, page_index <= 0 ? "disabled" : ""].join(' ').trim() }">
	            prev
	        </button>
	        <span class="svelte-mf5tkw">Page ${escape(page_index + 1)} of ${escape(last_page + 1)}</span>
	        <button class="${[`svelte-mf5tkw`, page_index >= last_page ? "disabled" : ""].join(' ').trim() }">
	            next
	        </button>
	    </div>
	</div>

	${validate_component(Modal, 'Modal').$$render($$result, {
		title: "register shoveling",
		show: show_modal
	}, {}, {
		default: () => `
	    ${validate_component(DatePicker, 'DatePicker').$$render($$result, {}, {}, {})}
	    <button class="${[`submit-shoveling svelte-mf5tkw`, !shoveling_date ? "disabled" : ""].join(' ').trim() }">
	        ${escape(shoveling_date ? `${config.months[shoveling_date.getMonth()]} ${pad_int(shoveling_date.getDate())} ${shoveling_date.getFullYear()} ${pad_int(shoveling_date.getHours())}:${pad_int(shoveling_date.getMinutes())}` : "Submit")}
	    </button>
	`
	})}`;
});

/* src\components\Loader.svelte generated by Svelte v3.6.1 */

const css$4 = {
	code: ".load-wrapper.svelte-354ro{display:flex;flex:1;justify-content:center;align-items:center}[class*=\"loader-\"].svelte-354ro{display:inline-block;width:1em;height:1em;color:inherit;vertical-align:middle;pointer-events:none}.loader-01.svelte-354ro{border:.2em dotted currentcolor;border-radius:50%;animation:1s svelte-354ro-loader-01 linear infinite}@keyframes svelte-354ro-loader-01{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}.loader-02.svelte-354ro{border:.2em solid transparent;border-left-color:currentcolor;border-right-color:currentcolor;border-radius:50%;animation:1s svelte-354ro-loader-02 linear infinite}@keyframes svelte-354ro-loader-02{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}.loader-03.svelte-354ro{border:.2em solid currentcolor;border-bottom-color:transparent;border-radius:50%;animation:1s svelte-354ro-loader-03 linear infinite;position:relative}@keyframes svelte-354ro-loader-03{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}.loader-04.svelte-354ro{border:1px solid currentcolor;border-radius:50%;animation:1s svelte-354ro-loader-04 linear infinite;position:relative}.loader-04.svelte-354ro:before{content:'';display:block;width:0;height:0;position:absolute;top:-.2em;left:50%;border:.2em solid currentcolor;border-radius:50%}@keyframes svelte-354ro-loader-04{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}.loader-05.svelte-354ro{border:.2em solid transparent;border-top-color:currentcolor;border-radius:50%;animation:1s svelte-354ro-loader-05 linear infinite;position:relative}.loader-05.svelte-354ro:before{content:'';display:block;width:inherit;height:inherit;position:absolute;top:-.2em;left:-.2em;border:.2em solid currentcolor;border-radius:50%;opacity:.5}@keyframes svelte-354ro-loader-05{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}.loader-06.svelte-354ro{border:.2em solid currentcolor;border-radius:50%;animation:svelte-354ro-loader-06 1s ease-out infinite}@keyframes svelte-354ro-loader-06{0%{transform:scale(0);opacity:0}50%{opacity:1}100%{transform:scale(1);opacity:0}}.loader-07.svelte-354ro{border:0 solid transparent;border-radius:50%;position:relative}.loader-07.svelte-354ro:before,.loader-07.svelte-354ro:after{content:'';border:.2em solid currentcolor;border-radius:50%;width:inherit;height:inherit;position:absolute;top:0;left:0;animation:svelte-354ro-loader-07 1s linear infinite;opacity:0}.loader-07.svelte-354ro:before{animation-delay:1s}.loader-07.svelte-354ro:after{animation-delay:.5s}@keyframes svelte-354ro-loader-07{0%{transform:scale(0);opacity:0}50%{opacity:1}100%{transform:scale(1);opacity:0}}.loader-08.svelte-354ro{position:relative}.loader-08.svelte-354ro:before,.loader-08.svelte-354ro:after{content:'';width:inherit;height:inherit;border-radius:50%;background-color:currentcolor;opacity:0.6;position:absolute;top:0;left:0;animation:svelte-354ro-loader-08 2.0s infinite ease-in-out}.loader-08.svelte-354ro:after{animation-delay:-1.0s}@keyframes svelte-354ro-loader-08{0%,100%{transform:scale(0)}50%{transform:scale(1)}}.loader-09.svelte-354ro{background-color:currentcolor;border-radius:50%;animation:svelte-354ro-loader-09 1.0s infinite ease-in-out}@keyframes svelte-354ro-loader-09{0%{transform:scale(0)}100%{transform:scale(1);opacity:0}}.loader-10.svelte-354ro{position:relative;animation:svelte-354ro-loader-10-1 2.0s infinite linear}.loader-10.svelte-354ro:before,.loader-10.svelte-354ro:after{content:'';width:0;height:0;border:.5em solid currentcolor;display:block;position:absolute;border-radius:100%;animation:svelte-354ro-loader-10-2 2s infinite ease-in-out}.loader-10.svelte-354ro:before{top:0;left:50%}.loader-10.svelte-354ro:after{bottom:0;right:50%;animation-delay:-1s}@keyframes svelte-354ro-loader-10-1{100%{transform:rotate(360deg)}}@keyframes svelte-354ro-loader-10-2{0%,100%{transform:scale(0)}50%{transform:scale(1)}}.loader-11.svelte-354ro{background-color:currentcolor;animation:svelte-354ro-loader-11 1.2s infinite ease-in-out}@keyframes svelte-354ro-loader-11{0%{transform:perspective(120px) rotateX(0deg) rotateY(0deg)}50%{transform:perspective(120px) rotateX(-180.1deg) rotateY(0deg)}100%{transform:perspective(120px) rotateX(-180deg) rotateY(-179.9deg)}}.loader-12.svelte-354ro{position:relative}.loader-12.svelte-354ro:before,.loader-12.svelte-354ro:after{content:'';display:block;position:absolute;background-color:currentcolor;left:50%;right:0;top:0;bottom:50%;box-shadow:-.5em 0 0 currentcolor;animation:svelte-354ro-loader-12 1s linear infinite}.loader-12.svelte-354ro:after{top:50%;bottom:0;animation-delay:.25s}@keyframes svelte-354ro-loader-12{0%,100%{box-shadow:-.5em 0 0 transparent;background-color:currentcolor}50%{box-shadow:-.5em 0 0 currentcolor;background-color:transparent}}.loader-13.svelte-354ro:before,.loader-13.svelte-354ro:after,.loader-13.svelte-354ro{border-radius:50%;animation-fill-mode:both;animation:svelte-354ro-loader-13 1.8s infinite ease-in-out}.loader-13.svelte-354ro{color:currentcolor;position:relative;transform:translateZ(0);animation-delay:-0.16s;top:-1em}.loader-13.svelte-354ro:before{right:100%;animation-delay:-0.32s}.loader-13.svelte-354ro:after{left:100%}.loader-13.svelte-354ro:before,.loader-13.svelte-354ro:after{content:'';display:block;position:absolute;top:0;width:inherit;height:inherit}@keyframes svelte-354ro-loader-13{0%,80%,100%{box-shadow:0 1em 0 -1em}40%{box-shadow:0 1em 0 -.2em}}.loader-14.svelte-354ro{border-radius:50%;box-shadow:0 1em 0 -.2em currentcolor;position:relative;animation:svelte-354ro-loader-14 0.8s ease-in-out alternate infinite;animation-delay:0.32s;top:-1em}.loader-14.svelte-354ro:after,.loader-14.svelte-354ro:before{content:'';position:absolute;width:inherit;height:inherit;border-radius:inherit;box-shadow:inherit;animation:inherit}.loader-14.svelte-354ro:before{left:-1em;animation-delay:0.48s}.loader-14.svelte-354ro:after{right:-1em;animation-delay:0.16s}@keyframes svelte-354ro-loader-14{0%{box-shadow:0 2em 0 -.2em currentcolor}100%{box-shadow:0 1em 0 -.2em currentcolor}}.loader-15.svelte-354ro{background:currentcolor;position:relative;animation:svelte-354ro-loader-15 1s ease-in-out infinite;animation-delay:0.4s;width:.25em;height:.5em;margin:0 .5em}.loader-15.svelte-354ro:after,.loader-15.svelte-354ro:before{content:'';position:absolute;width:inherit;height:inherit;background:inherit;animation:inherit}.loader-15.svelte-354ro:before{right:.5em;animation-delay:0.2s}.loader-15.svelte-354ro:after{left:.5em;animation-delay:0.6s}@keyframes svelte-354ro-loader-15{0%,100%{box-shadow:0 0 0 currentcolor, 0 0 0 currentcolor}50%{box-shadow:0 -.25em 0 currentcolor, 0 .25em 0 currentcolor}}.loader-16.svelte-354ro{transform:rotateZ(45deg);perspective:1000px;border-radius:50%}.loader-16.svelte-354ro:before,.loader-16.svelte-354ro:after{content:'';display:block;position:absolute;top:0;left:0;width:inherit;height:inherit;border-radius:50%;animation:1s svelte-354ro-spin linear infinite}.loader-16.svelte-354ro:before{transform:rotateX(70deg)}.loader-16.svelte-354ro:after{transform:rotateY(70deg);animation-delay:.4s}@keyframes svelte-354ro-rotate{0%{transform:translate(-50%, -50%) rotateZ(0deg)}100%{transform:translate(-50%, -50%) rotateZ(360deg)}}@keyframes svelte-354ro-rotateccw{0%{transform:translate(-50%, -50%) rotate(0deg)}100%{transform:translate(-50%, -50%) rotate(-360deg)}}@keyframes svelte-354ro-spin{0%,100%{box-shadow:.2em 0px 0 0px currentcolor}12%{box-shadow:.2em .2em 0 0 currentcolor}25%{box-shadow:0 .2em 0 0px currentcolor}37%{box-shadow:-.2em .2em 0 0 currentcolor}50%{box-shadow:-.2em 0 0 0 currentcolor}62%{box-shadow:-.2em -.2em 0 0 currentcolor}75%{box-shadow:0px -.2em 0 0 currentcolor}87%{box-shadow:.2em -.2em 0 0 currentcolor}}.loader-17.svelte-354ro{position:relative;background-color:currentcolor;border-radius:50%}.loader-17.svelte-354ro:after,.loader-17.svelte-354ro:before{content:\"\";position:absolute;width:.25em;height:.25em;border-radius:50%;opacity:.8}.loader-17.svelte-354ro:after{left:-.5em;top:-.25em;background-color:currentcolor;transform-origin:.75em 1em;animation:svelte-354ro-loader-17 1s linear infinite;opacity:.6}.loader-17.svelte-354ro:before{left:-1.25em;top:-.75em;background-color:currentcolor;transform-origin:1.5em 1em;animation:svelte-354ro-loader-17 2s linear infinite}@keyframes svelte-354ro-loader-17{0%{transform:rotateZ(0deg) translate3d(0, 0, 0)}100%{transform:rotateZ(360deg) translate3d(0, 0, 0)}}.loader-18.svelte-354ro{position:relative}.loader-18.svelte-354ro:before,.loader-18.svelte-354ro:after{content:'';display:block;position:absolute;border-radius:50%;border:.1em solid transparent;border-bottom-color:currentcolor;top:0;left:0;animation:1s svelte-354ro-loader-18 linear infinite}.loader-18.svelte-354ro:before{width:1em;height:1em}.loader-18.svelte-354ro:after{width:.8em;height:.8em;top:.1em;left:.1em;animation-direction:reverse}@keyframes svelte-354ro-loader-18{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}.loader-19.svelte-354ro{border-top:.2em solid currentcolor;border-right:.2em solid transparent;animation:svelte-354ro-loader-19 1s linear infinite;border-radius:100%;position:relative}@keyframes svelte-354ro-loader-19{to{transform:rotate(360deg)}}.loader-20.svelte-354ro{background-color:transparent;box-shadow:inset 0px 0px 0px .1em currentcolor;border-radius:50%;position:relative}.loader-20.svelte-354ro:after,.loader-20.svelte-354ro:before{position:absolute;content:\"\";background-color:currentcolor;top:.5em;left:.5em;height:.1em;transform-origin:left center}.loader-20.svelte-354ro:after{width:.4em;animation:svelte-354ro-loader-20 2s linear infinite}.loader-20.svelte-354ro:before{width:.3em;animation:svelte-354ro-loader-20 8s linear infinite}@keyframes svelte-354ro-loader-20{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}.loader-21.svelte-354ro{position:relative}.loader-21.svelte-354ro:before,.loader-21.svelte-354ro:after{position:absolute;content:\"\"}.loader-21.svelte-354ro:before{width:80%;height:80%;left:10%;bottom:10%;border-radius:100% 100% 100% 0;box-shadow:0px 0px 0px .1em currentcolor;animation:svelte-354ro-loader-21 1s linear infinite;transform:rotate(-46deg)}.loader-21.svelte-354ro:after{width:1em;height:.3em;border-radius:100%;left:0;background-color:rgba(255, 255, 255, 0.2);bottom:-.2em;z-index:-1}@keyframes svelte-354ro-loader-21{0%{top:0}50%{top:-5px}100%{top:0}}.loader-22.svelte-354ro{border:.1em currentcolor solid;border-radius:100%;position:relative;overflow:hidden;z-index:1}.loader-22.svelte-354ro:after,.loader-22.svelte-354ro:before{position:absolute;content:\"\";background-color:currentcolor}.loader-22.svelte-354ro:after{width:50%;height:.1em;left:50%;top:50%;transform-origin:left center;animation:svelte-354ro-loader-22 2s linear infinite alternate}.loader-22.svelte-354ro:before{width:100%;height:40%;left:0;bottom:0}@keyframes svelte-354ro-loader-22{0%{transform:rotate(-160deg)}100%{transform:rotate(-20deg)}}.loader-23.svelte-354ro{height:.5em;border:.1em currentcolor solid;border-radius:.1em;position:relative;animation:svelte-354ro-loader-23 5s linear infinite}.loader-23.svelte-354ro:after{width:.07em;height:100%;background-color:currentcolor;border-radius:0px .5em .5em 0px;position:absolute;content:\"\";top:0;left:calc(100% + .1em)}@keyframes svelte-354ro-loader-23{0%{box-shadow:inset 0px 0px 0px currentcolor}100%{box-shadow:inset 1em 0px 0px currentcolor}}.loader-24.svelte-354ro{width:.8em;height:1em;border:.1em currentcolor solid;border-radius:0px 0px .2em .2em;position:relative}.loader-24.svelte-354ro:after,.loader-24.svelte-354ro:before{position:absolute;content:\"\"}.loader-24.svelte-354ro:after{width:.2em;height:50%;border:.1em currentcolor solid;border-left:none;border-radius:0px .5em .5em 0px;left:calc(100% + .1em);top:.1em}.loader-24.svelte-354ro:before{width:.1em;height:.3em;background-color:currentcolor;top:-.3em;left:.05em;box-shadow:.2em 0px 0px 0px currentcolor, .2em -.2em 0px 0px currentcolor, .4em 0px 0px 0px currentcolor;animation:svelte-354ro-loader-24 1s linear infinite alternate}@keyframes svelte-354ro-loader-24{0%{height:0px}100%{height:6px}}.loader-25.svelte-354ro{border:.1em currentcolor solid;position:relative;animation:svelte-354ro-loader-25-1 5s linear infinite}.loader-25.svelte-354ro:after{width:.2em;height:.2em;position:absolute;content:\"\";background-color:currentcolor;bottom:calc(100% + .2em);left:-.4em;animation:svelte-354ro-loader-25-2 1s ease-in-out infinite}@keyframes svelte-354ro-loader-25-1{0%{box-shadow:inset 0 0 0 0 currentcolor}100%{box-shadow:inset 0 -1em 0 0 currentcolor}}@keyframes svelte-354ro-loader-25-2{25%{left:calc(100% + .2em);bottom:calc(100% + .2em)}50%{left:calc(100% + .2em);bottom:-.4em}75%{left:-.4em;bottom:-.4em}100%{left:-.4em;bottom:calc(100% + .2em)}}.loader-26.svelte-354ro{width:.5em;height:.5em;background-color:currentcolor;box-shadow:1em 0px 0px currentcolor;border-radius:50%;animation:svelte-354ro-loader-26 1s ease-in-out infinite alternate}@keyframes svelte-354ro-loader-26{0%{opacity:0.1;transform:rotate(0deg) scale(0.5)}100%{opacity:1;transform:rotate(360deg) scale(1.2)}}.loader-27.svelte-354ro{box-shadow:inset 0 0 0 .1em currentcolor;border-radius:50%;position:relative;margin-left:1.2em}.loader-27.svelte-354ro:before{content:'';display:block;width:inherit;height:inherit;border-radius:50%;position:absolute;right:1.2em;top:0;box-shadow:inset 0 0 0 .1em currentcolor}.loader-27.svelte-354ro:after{border:.2em solid currentcolor;box-shadow:-1.2em 0 0 0 currentcolor;width:0;height:0;border-radius:50%;left:50%;top:25%;position:absolute;content:\"\";animation:svelte-354ro-loader-27 2s linear infinite alternate}@keyframes svelte-354ro-loader-27{0%{left:0}100%{left:.5em}}.loader-28.svelte-354ro{position:relative;animation:2s svelte-354ro-loader-28-1 infinite}.loader-28.svelte-354ro:before{content:'';display:block;width:inherit;height:inherit;border-radius:80% 20%;border:.1em solid currentcolor;transform:rotate(45deg);border-width:.1em .05em .05em .1em}.loader-28.svelte-354ro:after{content:'';display:block;width:.2em;height:.2em;position:absolute;top:.4em;left:50%;border-radius:50%;box-shadow:-.07em .07em 0 .1em currentcolor;animation:2s svelte-354ro-loader-28-2 linear infinite}@keyframes svelte-354ro-loader-28-1{0%,100%{transform:scaleY(1)}10%{transform:scaleY(0)}20%{transform:scaleY(1)}}@keyframes svelte-354ro-loader-28-2{0%,100%{transform:translateX(0)}30%{transform:translateX(-100%)}50%{transform:transalteX(200%)}}.loader-29.svelte-354ro{border-radius:50%;box-shadow:inset 0 0 0 .1em currentcolor, -.5em -.5em 0 -.4em currentcolor, 0 -.7em 0 -.4em currentcolor, .5em -.5em 0 -.4em currentcolor, -.5em .5em 0 -.4em currentcolor, 0 .7em 0 -.4em currentcolor, .5em .5em 0 -.4em currentcolor, -.7em 0 0 -.4em currentcolor, .7em 0 0 -.4em currentcolor;animation:5s svelte-354ro-loader-29 linear infinite}@keyframes svelte-354ro-loader-29{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}.loader-30.svelte-354ro{border:.2em solid transparent;border-top-color:currentcolor;border-bottom-color:currentcolor;border-radius:50%;position:relative;animation:1s svelte-354ro-loader-30 linear infinite}.loader-30.svelte-354ro:before,.loader-30.svelte-354ro:after{content:'';display:block;width:0;height:0;position:absolute;border:.2em solid transparent;border-bottom-color:currentcolor}.loader-30.svelte-354ro:before{transform:rotate(135deg);right:-.3em;top:-.05em}.loader-30.svelte-354ro:after{transform:rotate(-45deg);left:-.3em;bottom:-.05em}@keyframes svelte-354ro-loader-30{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}.loader-31.svelte-354ro{box-shadow:0 0 2em currentcolor;background-color:currentcolor;position:relative;border-radius:50%;transform:rotateX(-60deg) perspective(1000px)}.loader-31.svelte-354ro:before,.loader-31.svelte-354ro:after{content:'';display:block;position:absolute;top:0;left:0;width:inherit;height:inherit;border-radius:inherit;animation:1s svelte-354ro-loader-31 ease-out infinite}.loader-31.svelte-354ro:after{animation-delay:.4s}@keyframes svelte-354ro-loader-31{0%{opacity:1;transform:rotate(0deg);box-shadow:0 0 0 -.5em currentcolor, 0 0 0 -.5em currentcolor, 0 0 0 -.5em currentcolor, 0 0 0 -.5em currentcolor, 0 0 0 -.5em currentcolor, 0 0 0 -.5em currentcolor, 0 0 0 -.5em currentcolor, 0 0 0 -.5em currentcolor}100%{opacity:0;transform:rotate(180deg);box-shadow:-1em -1em 0 -.35em currentcolor, 0 -1.5em 0 -.35em currentcolor, 1em -1em 0 -.35em currentcolor, -1.5em 0 0 -.35em currentcolor, 1.5em -0 0 -.35em currentcolor, -1em 1em 0 -.35em currentcolor, 0 1.5em 0 -.35em currentcolor, 1em 1em 0 -.35em currentcolor}}.loader-32.svelte-354ro{position:relative;border-radius:50%;box-shadow:0 0 1em 0 currentcolor, inset 0 0 1em 0 currentcolor;animation:1s svelte-354ro-loader-32 linear infinite}.loader-32.svelte-354ro:before,.loader-32.svelte-354ro:after{content:'';display:block;width:inherit;height:inherit;position:absolute;border-radius:50%}.loader-32.svelte-354ro:before{border-top:.2em solid currentcolor;border-right:.2em solid transparent;top:.28em;right:calc(50% - .22em)}.loader-32.svelte-354ro:after{border-bottom:.2em solid currentcolor;border-left:.2em solid transparent;bottom:.28em;left:calc(50% - .22em)}@keyframes svelte-354ro-loader-32{0%{transform:rotateX(-60deg) rotateZ(0deg)}100%{transform:rotateX(-60deg) rotateZ(360deg)}}.loader-33.svelte-354ro{border-radius:50%;position:relative}.loader-33.svelte-354ro:after,.loader-33.svelte-354ro:before{position:absolute;content:\"\"}.loader-33.svelte-354ro:after{height:0.1em;width:1em;background-color:currentcolor;border-radius:0.1em;bottom:0;left:0;transform-origin:bottom center;animation:svelte-354ro-loader-33-1 0.8s ease-in-out infinite alternate}.loader-33.svelte-354ro:before{height:.2em;width:.2em;background-color:currentcolor;border-radius:50%;top:0;left:calc(50% - .1em);animation:svelte-354ro-loader-33-2 0.4s ease-in-out infinite alternate}@keyframes svelte-354ro-loader-33-2{0%{height:.24em;transform:translateY(0px)}75%{height:.2em;width:.2em}100%{height:.1em;width:.24em;transform:translateY(0.8em)}}@keyframes svelte-354ro-loader-33-1{0%{transform:rotate(-45deg)}100%{transform:rotate(45deg)}}.loader-34.svelte-354ro{position:relative;width:1em;height:.5em}.loader-34.svelte-354ro:after,.loader-34.svelte-354ro:before{position:absolute;content:\"\";height:.4em;width:.4em;top:0;background-color:currentcolor;border-radius:50%}.loader-34.svelte-354ro:after{right:0;animation:svelte-354ro-loader-34-2 0.5s ease-in-out infinite;animation-direction:alternate}.loader-34.svelte-354ro:before{left:0;animation:svelte-354ro-loader-34-1 0.5s ease-in-out infinite;animation-direction:alternate}@keyframes svelte-354ro-loader-34-1{0%{transform:translatex(0px)}65%{height:.4em;width:.4em}100%{height:.5em;width:.3em;transform:translatex(0.2em)}}@keyframes svelte-354ro-loader-34-2{0%{transform:translatex(0px)}65%{height:.4em;width:.4em}100%{height:.5em;width:.3em;transform:translatex(-0.2em)}}.loader-35.svelte-354ro{margin:0 .5em;position:relative}.loader-35.svelte-354ro:before{border-radius:50%;background-color:currentcolor;animation:svelte-354ro-loader-35 3s cubic-bezier(0.77, 0, 0.175, 1) infinite;content:'';width:inherit;height:inherit;top:0;left:0;position:absolute}@keyframes svelte-354ro-loader-35{0%{transform:translateX(0) scale(1)}25%{transform:translateX(-100%) scale(0.3)}50%{transform:translateX(0) scale(1)}75%{transform:translateX(100%) scale(0.3)}100%{transform:translateX(0) scale(1)}}.loader-36.svelte-354ro{position:relative}.loader-36.svelte-354ro:before,.loader-36.svelte-354ro:after{content:'';position:absolute;top:0;left:0}.loader-36.svelte-354ro:before{width:1em;height:1em;border:.1em solid currentcolor;border-radius:50%;animation:svelte-354ro-loader-36-1 1.15s infinite -0.3s}.loader-36.svelte-354ro:after{right:0;bottom:0;margin:auto;width:0;height:0;border:.1em solid currentcolor;border-radius:50%;transform:translate(-0.2em);animation:svelte-354ro-loader-36-2 4.6s infinite steps(1)}@keyframes svelte-354ro-loader-36-1{to{transform:rotateX(180deg)}}@keyframes svelte-354ro-loader-36-2{0%{opacity:0}25%{opacity:1}50%{box-shadow:.2em 0 0 currentcolor}75%{box-shadow:.2em 0 0 currentcolor, .4em 0 0 currentcolor}}.loader-37.svelte-354ro{border-right:.1em solid currentcolor;border-radius:100%;animation:svelte-354ro-loader-37 800ms linear infinite}.loader-37.svelte-354ro:before,.loader-37.svelte-354ro:after{content:'';width:.8em;height:.8em;display:block;position:absolute;top:calc(50% - .4em);left:calc(50% - .4em);border-left:.08em solid currentcolor;border-radius:100%;animation:svelte-354ro-loader-37 400ms linear infinite reverse}.loader-37.svelte-354ro:after{width:.6em;height:.6em;top:calc(50% - .3em);left:calc(50% - .3em);border:0;border-right:.05em solid currentcolor;animation:none}@keyframes svelte-354ro-loader-37{from{transform:rotate(360deg)}to{transform:rotate(0deg)}}.loader-38.svelte-354ro{height:0.1em;width:0.1em;box-shadow:-0.2em -0.2em 0 0.1em currentcolor, -0.2em -0.2em 0 0.1em currentcolor, -0.2em -0.2em 0 0.1em currentcolor, -0.2em -0.2em 0 0.1em currentcolor;animation:svelte-354ro-loader-38 6s infinite}@keyframes svelte-354ro-loader-38{0%{box-shadow:-0.2em -0.2em 0 0.1em currentcolor, -0.2em -0.2em 0 0.1em currentcolor, -0.2em -0.2em 0 0.1em currentcolor, -0.2em -0.2em 0 0.1em currentcolor}8.33%{box-shadow:-0.2em -0.2em 0 0.1em currentcolor, 0.2em -0.2em 0 0.1em currentcolor, 0.2em -0.2em 0 0.1em currentcolor, 0.2em -0.2em 0 0.1em currentcolor}16.66%{box-shadow:-0.2em -0.2em 0 0.1em currentcolor, 0.2em -0.2em 0 0.1em currentcolor, 0.2em 0.2em 0 0.1em currentcolor, 0.2em 0.2em 0 0.1em currentcolor}24.99%{box-shadow:-0.2em -0.2em 0 0.1em currentcolor, 0.2em -0.2em 0 0.1em currentcolor, 0.2em 0.2em 0 0.1em currentcolor, -0.2em 0.2em 0 0.1em currentcolor}33.32%{box-shadow:-0.2em -0.2em 0 0.1em currentcolor, 0.2em -0.2em 0 0.1em currentcolor, 0.2em 0.2em 0 0.1em currentcolor, -0.2em -0.2em 0 0.1em currentcolor}41.65%{box-shadow:0.2em -0.2em 0 0.1em currentcolor, 0.2em -0.2em 0 0.1em currentcolor, 0.2em 0.2em 0 0.1em currentcolor, 0.2em -0.2em 0 0.1em currentcolor}49.98%{box-shadow:0.2em 0.2em 0 0.1em currentcolor, 0.2em 0.2em 0 0.1em currentcolor, 0.2em 0.2em 0 0.1em currentcolor, 0.2em 0.2em 0 0.1em currentcolor}58.31%{box-shadow:-0.2em 0.2em 0 0.1em currentcolor, -0.2em 0.2em 0 0.1em currentcolor, 0.2em 0.2em 0 0.1em currentcolor, -0.2em 0.2em 0 0.1em currentcolor}66.64%{box-shadow:-0.2em -0.2em 0 0.1em currentcolor, -0.2em -0.2em 0 0.1em currentcolor, 0.2em 0.2em 0 0.1em currentcolor, -0.2em 0.2em 0 0.1em currentcolor}74.97%{box-shadow:-0.2em -0.2em 0 0.1em currentcolor, 0.2em -0.2em 0 0.1em currentcolor, 0.2em 0.2em 0 0.1em currentcolor, -0.2em 0.2em 0 0.1em currentcolor}83.3%{box-shadow:-0.2em -0.2em 0 0.1em currentcolor, 0.2em 0.2em 0 0.1em currentcolor, 0.2em 0.2em 0 0.1em currentcolor, -0.2em 0.2em 0 0.1em currentcolor}91.63%{box-shadow:-0.2em -0.2em 0 0.1em currentcolor, -0.2em 0.2em 0 0.1em currentcolor, -0.2em 0.2em 0 0.1em currentcolor, -0.2em 0.2em 0 0.1em currentcolor}100%{box-shadow:-0.2em -0.2em 0 0.1em currentcolor, -0.2em -0.2em 0 0.1em currentcolor, -0.2em -0.2em 0 0.1em currentcolor, -0.2em -0.2em 0 0.1em currentcolor}}.loader-39.svelte-354ro{position:relative;width:.15em;height:.15em;background-color:currentcolor;border-radius:100%;animation:svelte-354ro-loader-39-1 30s infinite linear}.loader-39.svelte-354ro:before,.loader-39.svelte-354ro:after{content:'';border-radius:100%;position:absolute;top:50%;left:50%;transform:translate(-50%, -50%)}.loader-39.svelte-354ro:before{width:.3em;height:1em;animation:svelte-354ro-loader-39-2 .8s linear infinite}.loader-39.svelte-354ro:after{width:1em;height:.3em;animation:svelte-354ro-loader-39-2 1.2s linear infinite}@keyframes svelte-354ro-loader-39-1{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}@keyframes svelte-354ro-loader-39-2{0%{box-shadow:0.04em -0.04em 0 0.02em currentcolor}25%{box-shadow:0.04em 0.04em 0 0.02em currentcolor}50%{box-shadow:-0.04em 0.04em 0 0.02em currentcolor}75%{box-shadow:-0.04em -0.04em 0 0.02em currentcolor}100%{box-shadow:0.04em -0.04em 0 0.02em currentcolor}}.loader-40.svelte-354ro{border:.05em currentcolor solid;border-radius:.2em;overflow:hidden;position:relative}.loader-40.svelte-354ro:after,.loader-40.svelte-354ro:before{content:'';border-radius:50%;position:absolute;width:inherit;height:inherit;animation:svelte-354ro-loader-40 2s infinite linear}.loader-40.svelte-354ro:before{border-top:.2em currentcolor solid;top:-.15em;left:calc( -50% - .15em);transform-origin:right center}.loader-40.svelte-354ro:after{border-bottom:.2em currentcolor solid;top:.15em;right:calc( -50% - .15em);transform-origin:left center}@keyframes svelte-354ro-loader-40{from{transform:rotate(0deg)}to{transform:rotate(359deg)}}.loader-41.svelte-354ro{border:.05em currentcolor solid;border-radius:.2em;position:relative;background:linear-gradient(45deg, transparent 48%, currentcolor 50%, currentcolor 50%, transparent 52%, transparent), linear-gradient(-45deg, transparent 48%, currentcolor 50%, currentcolor 50%, transparent 52%, transparent);background-size:.5em .5em;background-position:0% 0%;animation:svelte-354ro-loader-41 1s infinite linear}@keyframes svelte-354ro-loader-41{from{background-position:0 0}to{background-position:-1em 0}}.loader-42.svelte-354ro{width:2em;height:.66em;border:.05em currentcolor solid;border-radius:.1em;background:linear-gradient(-60deg, transparent 0%, transparent 50%, currentcolor 50%, currentcolor 75%, transparent 75%, transparent);background-size:1em 2em;background-position:0 0;animation:svelte-354ro-loader-42 0.8s infinite linear}@keyframes svelte-354ro-loader-42{from{background-position:0 0}to{background-position:-2em 0}}.box.svelte-354ro:nth-of-type(n + 43){display:none}",
	map: "{\"version\":3,\"file\":\"Loader.svelte\",\"sources\":[\"Loader.svelte\"],\"sourcesContent\":[\"<script>\\r\\n    export let index = 1;\\r\\n    export let scale = 1;\\r\\n    export let color = \\\"#000\\\";\\r\\n    index = index > 9 ? index : `0${index}`;\\r\\n</script>\\r\\n\\r\\n<div class=\\\"load-wrapper\\\">\\r\\n    <div class=\\\"scalebox\\\" style=\\\"transform: scale({scale}, {scale});\\\">\\r\\n        <div style=\\\"color: {color}\\\" class=\\\"loader-{index}\\\"></div>\\r\\n    </div>\\r\\n</div>\\r\\n\\r\\n<style lang=\\\"scss\\\">.load-wrapper {\\n  display: flex;\\n  flex: 1;\\n  justify-content: center;\\n  align-items: center; }\\n\\n[class*=\\\"loader-\\\"] {\\n  display: inline-block;\\n  width: 1em;\\n  height: 1em;\\n  color: inherit;\\n  vertical-align: middle;\\n  pointer-events: none; }\\n\\n.loader-01 {\\n  border: .2em dotted currentcolor;\\n  border-radius: 50%;\\n  animation: 1s loader-01 linear infinite; }\\n\\n@keyframes loader-01 {\\n  0% {\\n    transform: rotate(0deg); }\\n  100% {\\n    transform: rotate(360deg); } }\\n\\n.loader-02 {\\n  border: .2em solid transparent;\\n  border-left-color: currentcolor;\\n  border-right-color: currentcolor;\\n  border-radius: 50%;\\n  animation: 1s loader-02 linear infinite; }\\n\\n@keyframes loader-02 {\\n  0% {\\n    transform: rotate(0deg); }\\n  100% {\\n    transform: rotate(360deg); } }\\n\\n.loader-03 {\\n  border: .2em solid currentcolor;\\n  border-bottom-color: transparent;\\n  border-radius: 50%;\\n  animation: 1s loader-03 linear infinite;\\n  position: relative; }\\n\\n@keyframes loader-03 {\\n  0% {\\n    transform: rotate(0deg); }\\n  100% {\\n    transform: rotate(360deg); } }\\n\\n.loader-04 {\\n  border: 1px solid currentcolor;\\n  border-radius: 50%;\\n  animation: 1s loader-04 linear infinite;\\n  position: relative; }\\n  .loader-04:before {\\n    content: '';\\n    display: block;\\n    width: 0;\\n    height: 0;\\n    position: absolute;\\n    top: -.2em;\\n    left: 50%;\\n    border: .2em solid currentcolor;\\n    border-radius: 50%; }\\n\\n@keyframes loader-04 {\\n  0% {\\n    transform: rotate(0deg); }\\n  100% {\\n    transform: rotate(360deg); } }\\n\\n.loader-05 {\\n  border: .2em solid transparent;\\n  border-top-color: currentcolor;\\n  border-radius: 50%;\\n  animation: 1s loader-05 linear infinite;\\n  position: relative; }\\n  .loader-05:before {\\n    content: '';\\n    display: block;\\n    width: inherit;\\n    height: inherit;\\n    position: absolute;\\n    top: -.2em;\\n    left: -.2em;\\n    border: .2em solid currentcolor;\\n    border-radius: 50%;\\n    opacity: .5; }\\n\\n@keyframes loader-05 {\\n  0% {\\n    transform: rotate(0deg); }\\n  100% {\\n    transform: rotate(360deg); } }\\n\\n.loader-06 {\\n  border: .2em solid currentcolor;\\n  border-radius: 50%;\\n  animation: loader-06 1s ease-out infinite; }\\n\\n@keyframes loader-06 {\\n  0% {\\n    transform: scale(0);\\n    opacity: 0; }\\n  50% {\\n    opacity: 1; }\\n  100% {\\n    transform: scale(1);\\n    opacity: 0; } }\\n\\n.loader-07 {\\n  border: 0 solid transparent;\\n  border-radius: 50%;\\n  position: relative; }\\n  .loader-07:before, .loader-07:after {\\n    content: '';\\n    border: .2em solid currentcolor;\\n    border-radius: 50%;\\n    width: inherit;\\n    height: inherit;\\n    position: absolute;\\n    top: 0;\\n    left: 0;\\n    animation: loader-07 1s linear infinite;\\n    opacity: 0; }\\n  .loader-07:before {\\n    animation-delay: 1s; }\\n  .loader-07:after {\\n    animation-delay: .5s; }\\n\\n@keyframes loader-07 {\\n  0% {\\n    transform: scale(0);\\n    opacity: 0; }\\n  50% {\\n    opacity: 1; }\\n  100% {\\n    transform: scale(1);\\n    opacity: 0; } }\\n\\n.loader-08 {\\n  position: relative; }\\n  .loader-08:before, .loader-08:after {\\n    content: '';\\n    width: inherit;\\n    height: inherit;\\n    border-radius: 50%;\\n    background-color: currentcolor;\\n    opacity: 0.6;\\n    position: absolute;\\n    top: 0;\\n    left: 0;\\n    animation: loader-08 2.0s infinite ease-in-out; }\\n  .loader-08:after {\\n    animation-delay: -1.0s; }\\n\\n@keyframes loader-08 {\\n  0%,\\n  100% {\\n    transform: scale(0); }\\n  50% {\\n    transform: scale(1); } }\\n\\n.loader-09 {\\n  background-color: currentcolor;\\n  border-radius: 50%;\\n  animation: loader-09 1.0s infinite ease-in-out; }\\n\\n@keyframes loader-09 {\\n  0% {\\n    transform: scale(0); }\\n  100% {\\n    transform: scale(1);\\n    opacity: 0; } }\\n\\n.loader-10 {\\n  position: relative;\\n  animation: loader-10-1 2.0s infinite linear; }\\n  .loader-10:before, .loader-10:after {\\n    content: '';\\n    width: 0;\\n    height: 0;\\n    border: .5em solid currentcolor;\\n    display: block;\\n    position: absolute;\\n    border-radius: 100%;\\n    animation: loader-10-2 2s infinite ease-in-out; }\\n  .loader-10:before {\\n    top: 0;\\n    left: 50%; }\\n  .loader-10:after {\\n    bottom: 0;\\n    right: 50%;\\n    animation-delay: -1s; }\\n\\n@keyframes loader-10-1 {\\n  100% {\\n    transform: rotate(360deg); } }\\n\\n@keyframes loader-10-2 {\\n  0%,\\n  100% {\\n    transform: scale(0); }\\n  50% {\\n    transform: scale(1); } }\\n\\n.loader-11 {\\n  background-color: currentcolor;\\n  animation: loader-11 1.2s infinite ease-in-out; }\\n\\n@keyframes loader-11 {\\n  0% {\\n    transform: perspective(120px) rotateX(0deg) rotateY(0deg); }\\n  50% {\\n    transform: perspective(120px) rotateX(-180.1deg) rotateY(0deg); }\\n  100% {\\n    transform: perspective(120px) rotateX(-180deg) rotateY(-179.9deg); } }\\n\\n.loader-12 {\\n  position: relative; }\\n  .loader-12:before, .loader-12:after {\\n    content: '';\\n    display: block;\\n    position: absolute;\\n    background-color: currentcolor;\\n    left: 50%;\\n    right: 0;\\n    top: 0;\\n    bottom: 50%;\\n    box-shadow: -.5em 0 0 currentcolor;\\n    animation: loader-12 1s linear infinite; }\\n  .loader-12:after {\\n    top: 50%;\\n    bottom: 0;\\n    animation-delay: .25s; }\\n\\n@keyframes loader-12 {\\n  0%,\\n  100% {\\n    box-shadow: -.5em 0 0 transparent;\\n    background-color: currentcolor; }\\n  50% {\\n    box-shadow: -.5em 0 0 currentcolor;\\n    background-color: transparent; } }\\n\\n.loader-13:before,\\n.loader-13:after,\\n.loader-13 {\\n  border-radius: 50%;\\n  animation-fill-mode: both;\\n  animation: loader-13 1.8s infinite ease-in-out; }\\n\\n.loader-13 {\\n  color: currentcolor;\\n  position: relative;\\n  transform: translateZ(0);\\n  animation-delay: -0.16s;\\n  top: -1em; }\\n  .loader-13:before {\\n    right: 100%;\\n    animation-delay: -0.32s; }\\n  .loader-13:after {\\n    left: 100%; }\\n  .loader-13:before, .loader-13:after {\\n    content: '';\\n    display: block;\\n    position: absolute;\\n    top: 0;\\n    width: inherit;\\n    height: inherit; }\\n\\n@keyframes loader-13 {\\n  0%,\\n  80%,\\n  100% {\\n    box-shadow: 0 1em 0 -1em; }\\n  40% {\\n    box-shadow: 0 1em 0 -.2em; } }\\n\\n.loader-14 {\\n  border-radius: 50%;\\n  box-shadow: 0 1em 0 -.2em currentcolor;\\n  position: relative;\\n  animation: loader-14 0.8s ease-in-out alternate infinite;\\n  animation-delay: 0.32s;\\n  top: -1em; }\\n  .loader-14:after, .loader-14:before {\\n    content: '';\\n    position: absolute;\\n    width: inherit;\\n    height: inherit;\\n    border-radius: inherit;\\n    box-shadow: inherit;\\n    animation: inherit; }\\n  .loader-14:before {\\n    left: -1em;\\n    animation-delay: 0.48s; }\\n  .loader-14:after {\\n    right: -1em;\\n    animation-delay: 0.16s; }\\n\\n@keyframes loader-14 {\\n  0% {\\n    box-shadow: 0 2em 0 -.2em currentcolor; }\\n  100% {\\n    box-shadow: 0 1em 0 -.2em currentcolor; } }\\n\\n.loader-15 {\\n  background: currentcolor;\\n  position: relative;\\n  animation: loader-15 1s ease-in-out infinite;\\n  animation-delay: 0.4s;\\n  width: .25em;\\n  height: .5em;\\n  margin: 0 .5em; }\\n  .loader-15:after, .loader-15:before {\\n    content: '';\\n    position: absolute;\\n    width: inherit;\\n    height: inherit;\\n    background: inherit;\\n    animation: inherit; }\\n  .loader-15:before {\\n    right: .5em;\\n    animation-delay: 0.2s; }\\n  .loader-15:after {\\n    left: .5em;\\n    animation-delay: 0.6s; }\\n\\n@keyframes loader-15 {\\n  0%,\\n  100% {\\n    box-shadow: 0 0 0 currentcolor, 0 0 0 currentcolor; }\\n  50% {\\n    box-shadow: 0 -.25em 0 currentcolor, 0 .25em 0 currentcolor; } }\\n\\n.loader-16 {\\n  transform: rotateZ(45deg);\\n  perspective: 1000px;\\n  border-radius: 50%; }\\n  .loader-16:before, .loader-16:after {\\n    content: '';\\n    display: block;\\n    position: absolute;\\n    top: 0;\\n    left: 0;\\n    width: inherit;\\n    height: inherit;\\n    border-radius: 50%;\\n    animation: 1s spin linear infinite; }\\n  .loader-16:before {\\n    transform: rotateX(70deg); }\\n  .loader-16:after {\\n    transform: rotateY(70deg);\\n    animation-delay: .4s; }\\n\\n@keyframes rotate {\\n  0% {\\n    transform: translate(-50%, -50%) rotateZ(0deg); }\\n  100% {\\n    transform: translate(-50%, -50%) rotateZ(360deg); } }\\n\\n@keyframes rotateccw {\\n  0% {\\n    transform: translate(-50%, -50%) rotate(0deg); }\\n  100% {\\n    transform: translate(-50%, -50%) rotate(-360deg); } }\\n\\n@keyframes spin {\\n  0%,\\n  100% {\\n    box-shadow: .2em 0px 0 0px currentcolor; }\\n  12% {\\n    box-shadow: .2em .2em 0 0 currentcolor; }\\n  25% {\\n    box-shadow: 0 .2em 0 0px currentcolor; }\\n  37% {\\n    box-shadow: -.2em .2em 0 0 currentcolor; }\\n  50% {\\n    box-shadow: -.2em 0 0 0 currentcolor; }\\n  62% {\\n    box-shadow: -.2em -.2em 0 0 currentcolor; }\\n  75% {\\n    box-shadow: 0px -.2em 0 0 currentcolor; }\\n  87% {\\n    box-shadow: .2em -.2em 0 0 currentcolor; } }\\n\\n.loader-17 {\\n  position: relative;\\n  background-color: currentcolor;\\n  border-radius: 50%; }\\n  .loader-17:after, .loader-17:before {\\n    content: \\\"\\\";\\n    position: absolute;\\n    width: .25em;\\n    height: .25em;\\n    border-radius: 50%;\\n    opacity: .8; }\\n  .loader-17:after {\\n    left: -.5em;\\n    top: -.25em;\\n    background-color: currentcolor;\\n    transform-origin: .75em 1em;\\n    animation: loader-17 1s linear infinite;\\n    opacity: .6; }\\n  .loader-17:before {\\n    left: -1.25em;\\n    top: -.75em;\\n    background-color: currentcolor;\\n    transform-origin: 1.5em 1em;\\n    animation: loader-17 2s linear infinite; }\\n\\n@keyframes loader-17 {\\n  0% {\\n    transform: rotateZ(0deg) translate3d(0, 0, 0); }\\n  100% {\\n    transform: rotateZ(360deg) translate3d(0, 0, 0); } }\\n\\n.loader-18 {\\n  position: relative; }\\n  .loader-18:before, .loader-18:after {\\n    content: '';\\n    display: block;\\n    position: absolute;\\n    border-radius: 50%;\\n    border: .1em solid transparent;\\n    border-bottom-color: currentcolor;\\n    top: 0;\\n    left: 0;\\n    animation: 1s loader-18 linear infinite; }\\n  .loader-18:before {\\n    width: 1em;\\n    height: 1em; }\\n  .loader-18:after {\\n    width: .8em;\\n    height: .8em;\\n    top: .1em;\\n    left: .1em;\\n    animation-direction: reverse; }\\n\\n@keyframes loader-18 {\\n  0% {\\n    transform: rotate(0deg); }\\n  100% {\\n    transform: rotate(360deg); } }\\n\\n.loader-19 {\\n  border-top: .2em solid currentcolor;\\n  border-right: .2em solid transparent;\\n  animation: loader-19 1s linear infinite;\\n  border-radius: 100%;\\n  position: relative; }\\n\\n@keyframes loader-19 {\\n  to {\\n    transform: rotate(360deg); } }\\n\\n.loader-20 {\\n  background-color: transparent;\\n  box-shadow: inset 0px 0px 0px .1em currentcolor;\\n  border-radius: 50%;\\n  position: relative; }\\n  .loader-20:after, .loader-20:before {\\n    position: absolute;\\n    content: \\\"\\\";\\n    background-color: currentcolor;\\n    top: .5em;\\n    left: .5em;\\n    height: .1em;\\n    transform-origin: left center; }\\n  .loader-20:after {\\n    width: .4em;\\n    animation: loader-20 2s linear infinite; }\\n  .loader-20:before {\\n    width: .3em;\\n    animation: loader-20 8s linear infinite; }\\n\\n@keyframes loader-20 {\\n  0% {\\n    transform: rotate(0deg); }\\n  100% {\\n    transform: rotate(360deg); } }\\n\\n.loader-21 {\\n  position: relative; }\\n  .loader-21:before, .loader-21:after {\\n    position: absolute;\\n    content: \\\"\\\"; }\\n  .loader-21:before {\\n    width: 80%;\\n    height: 80%;\\n    left: 10%;\\n    bottom: 10%;\\n    border-radius: 100% 100% 100% 0;\\n    box-shadow: 0px 0px 0px .1em currentcolor;\\n    animation: loader-21 1s linear infinite;\\n    transform: rotate(-46deg); }\\n  .loader-21:after {\\n    width: 1em;\\n    height: .3em;\\n    border-radius: 100%;\\n    left: 0;\\n    background-color: rgba(255, 255, 255, 0.2);\\n    bottom: -.2em;\\n    z-index: -1; }\\n\\n@keyframes loader-21 {\\n  0% {\\n    top: 0; }\\n  50% {\\n    top: -5px; }\\n  100% {\\n    top: 0; } }\\n\\n.loader-22 {\\n  border: .1em currentcolor solid;\\n  border-radius: 100%;\\n  position: relative;\\n  overflow: hidden;\\n  z-index: 1; }\\n  .loader-22:after, .loader-22:before {\\n    position: absolute;\\n    content: \\\"\\\";\\n    background-color: currentcolor; }\\n  .loader-22:after {\\n    width: 50%;\\n    height: .1em;\\n    left: 50%;\\n    top: 50%;\\n    transform-origin: left center;\\n    animation: loader-22 2s linear infinite alternate; }\\n  .loader-22:before {\\n    width: 100%;\\n    height: 40%;\\n    left: 0;\\n    bottom: 0; }\\n\\n@keyframes loader-22 {\\n  0% {\\n    transform: rotate(-160deg); }\\n  100% {\\n    transform: rotate(-20deg); } }\\n\\n.loader-23 {\\n  height: .5em;\\n  border: .1em currentcolor solid;\\n  border-radius: .1em;\\n  position: relative;\\n  animation: loader-23 5s linear infinite; }\\n  .loader-23:after {\\n    width: .07em;\\n    height: 100%;\\n    background-color: currentcolor;\\n    border-radius: 0px .5em .5em 0px;\\n    position: absolute;\\n    content: \\\"\\\";\\n    top: 0;\\n    left: calc(100% + .1em); }\\n\\n@keyframes loader-23 {\\n  0% {\\n    box-shadow: inset 0px 0px 0px currentcolor; }\\n  100% {\\n    box-shadow: inset 1em 0px 0px currentcolor; } }\\n\\n.loader-24 {\\n  width: .8em;\\n  height: 1em;\\n  border: .1em currentcolor solid;\\n  border-radius: 0px 0px .2em .2em;\\n  position: relative; }\\n  .loader-24:after, .loader-24:before {\\n    position: absolute;\\n    content: \\\"\\\"; }\\n  .loader-24:after {\\n    width: .2em;\\n    height: 50%;\\n    border: .1em currentcolor solid;\\n    border-left: none;\\n    border-radius: 0px .5em .5em 0px;\\n    left: calc(100% + .1em);\\n    top: .1em; }\\n  .loader-24:before {\\n    width: .1em;\\n    height: .3em;\\n    background-color: currentcolor;\\n    top: -.3em;\\n    left: .05em;\\n    box-shadow: .2em 0px 0px 0px currentcolor, .2em -.2em 0px 0px currentcolor, .4em 0px 0px 0px currentcolor;\\n    animation: loader-24 1s linear infinite alternate; }\\n\\n@keyframes loader-24 {\\n  0% {\\n    height: 0px; }\\n  100% {\\n    height: 6px; } }\\n\\n.loader-25 {\\n  border: .1em currentcolor solid;\\n  position: relative;\\n  animation: loader-25-1 5s linear infinite; }\\n  .loader-25:after {\\n    width: .2em;\\n    height: .2em;\\n    position: absolute;\\n    content: \\\"\\\";\\n    background-color: currentcolor;\\n    bottom: calc(100% + .2em);\\n    left: -.4em;\\n    animation: loader-25-2 1s ease-in-out infinite; }\\n\\n@keyframes loader-25-1 {\\n  0% {\\n    box-shadow: inset 0 0 0 0 currentcolor; }\\n  100% {\\n    box-shadow: inset 0 -1em 0 0 currentcolor; } }\\n\\n@keyframes loader-25-2 {\\n  25% {\\n    left: calc(100% + .2em);\\n    bottom: calc(100% + .2em); }\\n  50% {\\n    left: calc(100% + .2em);\\n    bottom: -.4em; }\\n  75% {\\n    left: -.4em;\\n    bottom: -.4em; }\\n  100% {\\n    left: -.4em;\\n    bottom: calc(100% + .2em); } }\\n\\n.loader-26 {\\n  width: .5em;\\n  height: .5em;\\n  background-color: currentcolor;\\n  box-shadow: 1em 0px 0px currentcolor;\\n  border-radius: 50%;\\n  animation: loader-26 1s ease-in-out infinite alternate; }\\n\\n@keyframes loader-26 {\\n  0% {\\n    opacity: 0.1;\\n    transform: rotate(0deg) scale(0.5); }\\n  100% {\\n    opacity: 1;\\n    transform: rotate(360deg) scale(1.2); } }\\n\\n.loader-27 {\\n  box-shadow: inset 0 0 0 .1em currentcolor;\\n  border-radius: 50%;\\n  position: relative;\\n  margin-left: 1.2em; }\\n  .loader-27:before {\\n    content: '';\\n    display: block;\\n    width: inherit;\\n    height: inherit;\\n    border-radius: 50%;\\n    position: absolute;\\n    right: 1.2em;\\n    top: 0;\\n    box-shadow: inset 0 0 0 .1em currentcolor; }\\n  .loader-27:after {\\n    border: .2em solid currentcolor;\\n    box-shadow: -1.2em 0 0 0 currentcolor;\\n    width: 0;\\n    height: 0;\\n    border-radius: 50%;\\n    left: 50%;\\n    top: 25%;\\n    position: absolute;\\n    content: \\\"\\\";\\n    animation: loader-27 2s linear infinite alternate; }\\n\\n@keyframes loader-27 {\\n  0% {\\n    left: 0; }\\n  100% {\\n    left: .5em; } }\\n\\n.loader-28 {\\n  position: relative;\\n  animation: 2s loader-28-1 infinite; }\\n  .loader-28:before {\\n    content: '';\\n    display: block;\\n    width: inherit;\\n    height: inherit;\\n    border-radius: 80% 20%;\\n    border: .1em solid currentcolor;\\n    transform: rotate(45deg);\\n    border-width: .1em .05em .05em .1em; }\\n  .loader-28:after {\\n    content: '';\\n    display: block;\\n    width: .2em;\\n    height: .2em;\\n    position: absolute;\\n    top: .4em;\\n    left: 50%;\\n    border-radius: 50%;\\n    box-shadow: -.07em .07em 0 .1em currentcolor;\\n    animation: 2s loader-28-2 linear infinite; }\\n\\n@keyframes loader-28-1 {\\n  0%,\\n  100% {\\n    transform: scaleY(1); }\\n  10% {\\n    transform: scaleY(0); }\\n  20% {\\n    transform: scaleY(1); } }\\n\\n@keyframes loader-28-2 {\\n  0%,\\n  100% {\\n    transform: translateX(0); }\\n  30% {\\n    transform: translateX(-100%); }\\n  50% {\\n    transform: transalteX(200%); } }\\n\\n.loader-29 {\\n  border-radius: 50%;\\n  box-shadow: inset 0 0 0 .1em currentcolor, -.5em -.5em 0 -.4em currentcolor, 0 -.7em 0 -.4em currentcolor, .5em -.5em 0 -.4em currentcolor, -.5em .5em 0 -.4em currentcolor, 0 .7em 0 -.4em currentcolor, .5em .5em 0 -.4em currentcolor, -.7em 0 0 -.4em currentcolor, .7em 0 0 -.4em currentcolor;\\n  animation: 5s loader-29 linear infinite; }\\n\\n@keyframes loader-29 {\\n  0% {\\n    transform: rotate(0deg); }\\n  100% {\\n    transform: rotate(360deg); } }\\n\\n.loader-30 {\\n  border: .2em solid transparent;\\n  border-top-color: currentcolor;\\n  border-bottom-color: currentcolor;\\n  border-radius: 50%;\\n  position: relative;\\n  animation: 1s loader-30 linear infinite; }\\n  .loader-30:before, .loader-30:after {\\n    content: '';\\n    display: block;\\n    width: 0;\\n    height: 0;\\n    position: absolute;\\n    border: .2em solid transparent;\\n    border-bottom-color: currentcolor; }\\n  .loader-30:before {\\n    transform: rotate(135deg);\\n    right: -.3em;\\n    top: -.05em; }\\n  .loader-30:after {\\n    transform: rotate(-45deg);\\n    left: -.3em;\\n    bottom: -.05em; }\\n\\n@keyframes loader-30 {\\n  0% {\\n    transform: rotate(0deg); }\\n  100% {\\n    transform: rotate(360deg); } }\\n\\n.loader-31 {\\n  box-shadow: 0 0 2em currentcolor;\\n  background-color: currentcolor;\\n  position: relative;\\n  border-radius: 50%;\\n  transform: rotateX(-60deg) perspective(1000px); }\\n  .loader-31:before, .loader-31:after {\\n    content: '';\\n    display: block;\\n    position: absolute;\\n    top: 0;\\n    left: 0;\\n    width: inherit;\\n    height: inherit;\\n    border-radius: inherit;\\n    animation: 1s loader-31 ease-out infinite; }\\n  .loader-31:after {\\n    animation-delay: .4s; }\\n\\n@keyframes loader-31 {\\n  0% {\\n    opacity: 1;\\n    transform: rotate(0deg);\\n    box-shadow: 0 0 0 -.5em currentcolor, 0 0 0 -.5em currentcolor, 0 0 0 -.5em currentcolor, 0 0 0 -.5em currentcolor, 0 0 0 -.5em currentcolor, 0 0 0 -.5em currentcolor, 0 0 0 -.5em currentcolor, 0 0 0 -.5em currentcolor; }\\n  100% {\\n    opacity: 0;\\n    transform: rotate(180deg);\\n    box-shadow: -1em -1em 0 -.35em currentcolor, 0 -1.5em 0 -.35em currentcolor, 1em -1em 0 -.35em currentcolor, -1.5em 0 0 -.35em currentcolor, 1.5em -0 0 -.35em currentcolor, -1em 1em 0 -.35em currentcolor, 0 1.5em 0 -.35em currentcolor, 1em 1em 0 -.35em currentcolor; } }\\n\\n.loader-32 {\\n  position: relative;\\n  border-radius: 50%;\\n  box-shadow: 0 0 1em 0 currentcolor, inset 0 0 1em 0 currentcolor;\\n  animation: 1s loader-32 linear infinite; }\\n  .loader-32:before, .loader-32:after {\\n    content: '';\\n    display: block;\\n    width: inherit;\\n    height: inherit;\\n    position: absolute;\\n    border-radius: 50%; }\\n  .loader-32:before {\\n    border-top: .2em solid currentcolor;\\n    border-right: .2em solid transparent;\\n    top: .28em;\\n    right: calc(50% - .22em); }\\n  .loader-32:after {\\n    border-bottom: .2em solid currentcolor;\\n    border-left: .2em solid transparent;\\n    bottom: .28em;\\n    left: calc(50% - .22em); }\\n\\n@keyframes loader-32 {\\n  0% {\\n    transform: rotateX(-60deg) rotateZ(0deg); }\\n  100% {\\n    transform: rotateX(-60deg) rotateZ(360deg); } }\\n\\n.loader-33 {\\n  border-radius: 50%;\\n  position: relative; }\\n  .loader-33:after, .loader-33:before {\\n    position: absolute;\\n    content: \\\"\\\"; }\\n  .loader-33:after {\\n    height: 0.1em;\\n    width: 1em;\\n    background-color: currentcolor;\\n    border-radius: 0.1em;\\n    bottom: 0;\\n    left: 0;\\n    transform-origin: bottom center;\\n    animation: loader-33-1 0.8s ease-in-out infinite alternate; }\\n  .loader-33:before {\\n    height: .2em;\\n    width: .2em;\\n    background-color: currentcolor;\\n    border-radius: 50%;\\n    top: 0;\\n    left: calc(50% - .1em);\\n    animation: loader-33-2 0.4s ease-in-out infinite alternate; }\\n\\n@keyframes loader-33-2 {\\n  0% {\\n    height: .24em;\\n    transform: translateY(0px); }\\n  75% {\\n    height: .2em;\\n    width: .2em; }\\n  100% {\\n    height: .1em;\\n    width: .24em;\\n    transform: translateY(0.8em); } }\\n\\n@keyframes loader-33-1 {\\n  0% {\\n    transform: rotate(-45deg); }\\n  100% {\\n    transform: rotate(45deg); } }\\n\\n.loader-34 {\\n  position: relative;\\n  width: 1em;\\n  height: .5em; }\\n  .loader-34:after, .loader-34:before {\\n    position: absolute;\\n    content: \\\"\\\";\\n    height: .4em;\\n    width: .4em;\\n    top: 0;\\n    background-color: currentcolor;\\n    border-radius: 50%; }\\n  .loader-34:after {\\n    right: 0;\\n    animation: loader-34-2 0.5s ease-in-out infinite;\\n    animation-direction: alternate; }\\n  .loader-34:before {\\n    left: 0;\\n    animation: loader-34-1 0.5s ease-in-out infinite;\\n    animation-direction: alternate; }\\n\\n@keyframes loader-34-1 {\\n  0% {\\n    transform: translatex(0px); }\\n  65% {\\n    height: .4em;\\n    width: .4em; }\\n  100% {\\n    height: .5em;\\n    width: .3em;\\n    transform: translatex(0.2em); } }\\n\\n@keyframes loader-34-2 {\\n  0% {\\n    transform: translatex(0px); }\\n  65% {\\n    height: .4em;\\n    width: .4em; }\\n  100% {\\n    height: .5em;\\n    width: .3em;\\n    transform: translatex(-0.2em); } }\\n\\n.loader-35 {\\n  margin: 0 .5em;\\n  position: relative; }\\n  .loader-35:before {\\n    border-radius: 50%;\\n    background-color: currentcolor;\\n    animation: loader-35 3s cubic-bezier(0.77, 0, 0.175, 1) infinite;\\n    content: '';\\n    width: inherit;\\n    height: inherit;\\n    top: 0;\\n    left: 0;\\n    position: absolute; }\\n\\n@keyframes loader-35 {\\n  0% {\\n    transform: translateX(0) scale(1); }\\n  25% {\\n    transform: translateX(-100%) scale(0.3); }\\n  50% {\\n    transform: translateX(0) scale(1); }\\n  75% {\\n    transform: translateX(100%) scale(0.3); }\\n  100% {\\n    transform: translateX(0) scale(1); } }\\n\\n.loader-36 {\\n  position: relative; }\\n  .loader-36:before, .loader-36:after {\\n    content: '';\\n    position: absolute;\\n    top: 0;\\n    left: 0; }\\n  .loader-36:before {\\n    width: 1em;\\n    height: 1em;\\n    border: .1em solid currentcolor;\\n    border-radius: 50%;\\n    animation: loader-36-1 1.15s infinite -0.3s; }\\n  .loader-36:after {\\n    right: 0;\\n    bottom: 0;\\n    margin: auto;\\n    width: 0;\\n    height: 0;\\n    border: .1em solid currentcolor;\\n    border-radius: 50%;\\n    transform: translate(-0.2em);\\n    animation: loader-36-2 4.6s infinite steps(1); }\\n\\n@keyframes loader-36-1 {\\n  to {\\n    transform: rotateX(180deg); } }\\n\\n@keyframes loader-36-2 {\\n  0% {\\n    opacity: 0; }\\n  25% {\\n    opacity: 1; }\\n  50% {\\n    box-shadow: .2em 0 0 currentcolor; }\\n  75% {\\n    box-shadow: .2em 0 0 currentcolor, .4em 0 0 currentcolor; } }\\n\\n.loader-37 {\\n  border-right: .1em solid currentcolor;\\n  border-radius: 100%;\\n  animation: loader-37 800ms linear infinite; }\\n  .loader-37:before, .loader-37:after {\\n    content: '';\\n    width: .8em;\\n    height: .8em;\\n    display: block;\\n    position: absolute;\\n    top: calc(50% - .4em);\\n    left: calc(50% - .4em);\\n    border-left: .08em solid currentcolor;\\n    border-radius: 100%;\\n    animation: loader-37 400ms linear infinite reverse; }\\n  .loader-37:after {\\n    width: .6em;\\n    height: .6em;\\n    top: calc(50% - .3em);\\n    left: calc(50% - .3em);\\n    border: 0;\\n    border-right: .05em solid currentcolor;\\n    animation: none; }\\n\\n@keyframes loader-37 {\\n  from {\\n    transform: rotate(360deg); }\\n  to {\\n    transform: rotate(0deg); } }\\n\\n.loader-38 {\\n  height: 0.1em;\\n  width: 0.1em;\\n  box-shadow: -0.2em -0.2em 0 0.1em currentcolor, -0.2em -0.2em 0 0.1em currentcolor, -0.2em -0.2em 0 0.1em currentcolor, -0.2em -0.2em 0 0.1em currentcolor;\\n  animation: loader-38 6s infinite; }\\n\\n@keyframes loader-38 {\\n  0% {\\n    box-shadow: -0.2em -0.2em 0 0.1em currentcolor, -0.2em -0.2em 0 0.1em currentcolor, -0.2em -0.2em 0 0.1em currentcolor, -0.2em -0.2em 0 0.1em currentcolor; }\\n  8.33% {\\n    box-shadow: -0.2em -0.2em 0 0.1em currentcolor, 0.2em -0.2em 0 0.1em currentcolor, 0.2em -0.2em 0 0.1em currentcolor, 0.2em -0.2em 0 0.1em currentcolor; }\\n  16.66% {\\n    box-shadow: -0.2em -0.2em 0 0.1em currentcolor, 0.2em -0.2em 0 0.1em currentcolor, 0.2em 0.2em 0 0.1em currentcolor, 0.2em 0.2em 0 0.1em currentcolor; }\\n  24.99% {\\n    box-shadow: -0.2em -0.2em 0 0.1em currentcolor, 0.2em -0.2em 0 0.1em currentcolor, 0.2em 0.2em 0 0.1em currentcolor, -0.2em 0.2em 0 0.1em currentcolor; }\\n  33.32% {\\n    box-shadow: -0.2em -0.2em 0 0.1em currentcolor, 0.2em -0.2em 0 0.1em currentcolor, 0.2em 0.2em 0 0.1em currentcolor, -0.2em -0.2em 0 0.1em currentcolor; }\\n  41.65% {\\n    box-shadow: 0.2em -0.2em 0 0.1em currentcolor, 0.2em -0.2em 0 0.1em currentcolor, 0.2em 0.2em 0 0.1em currentcolor, 0.2em -0.2em 0 0.1em currentcolor; }\\n  49.98% {\\n    box-shadow: 0.2em 0.2em 0 0.1em currentcolor, 0.2em 0.2em 0 0.1em currentcolor, 0.2em 0.2em 0 0.1em currentcolor, 0.2em 0.2em 0 0.1em currentcolor; }\\n  58.31% {\\n    box-shadow: -0.2em 0.2em 0 0.1em currentcolor, -0.2em 0.2em 0 0.1em currentcolor, 0.2em 0.2em 0 0.1em currentcolor, -0.2em 0.2em 0 0.1em currentcolor; }\\n  66.64% {\\n    box-shadow: -0.2em -0.2em 0 0.1em currentcolor, -0.2em -0.2em 0 0.1em currentcolor, 0.2em 0.2em 0 0.1em currentcolor, -0.2em 0.2em 0 0.1em currentcolor; }\\n  74.97% {\\n    box-shadow: -0.2em -0.2em 0 0.1em currentcolor, 0.2em -0.2em 0 0.1em currentcolor, 0.2em 0.2em 0 0.1em currentcolor, -0.2em 0.2em 0 0.1em currentcolor; }\\n  83.3% {\\n    box-shadow: -0.2em -0.2em 0 0.1em currentcolor, 0.2em 0.2em 0 0.1em currentcolor, 0.2em 0.2em 0 0.1em currentcolor, -0.2em 0.2em 0 0.1em currentcolor; }\\n  91.63% {\\n    box-shadow: -0.2em -0.2em 0 0.1em currentcolor, -0.2em 0.2em 0 0.1em currentcolor, -0.2em 0.2em 0 0.1em currentcolor, -0.2em 0.2em 0 0.1em currentcolor; }\\n  100% {\\n    box-shadow: -0.2em -0.2em 0 0.1em currentcolor, -0.2em -0.2em 0 0.1em currentcolor, -0.2em -0.2em 0 0.1em currentcolor, -0.2em -0.2em 0 0.1em currentcolor; } }\\n\\n.loader-39 {\\n  position: relative;\\n  width: .15em;\\n  height: .15em;\\n  background-color: currentcolor;\\n  border-radius: 100%;\\n  animation: loader-39-1 30s infinite linear; }\\n  .loader-39:before, .loader-39:after {\\n    content: '';\\n    border-radius: 100%;\\n    position: absolute;\\n    top: 50%;\\n    left: 50%;\\n    transform: translate(-50%, -50%); }\\n  .loader-39:before {\\n    width: .3em;\\n    height: 1em;\\n    animation: loader-39-2 .8s linear infinite; }\\n  .loader-39:after {\\n    width: 1em;\\n    height: .3em;\\n    animation: loader-39-2 1.2s linear infinite; }\\n\\n@keyframes loader-39-1 {\\n  0% {\\n    transform: rotate(0deg); }\\n  100% {\\n    transform: rotate(360deg); } }\\n\\n@keyframes loader-39-2 {\\n  0% {\\n    box-shadow: 0.04em -0.04em 0 0.02em currentcolor; }\\n  25% {\\n    box-shadow: 0.04em 0.04em 0 0.02em currentcolor; }\\n  50% {\\n    box-shadow: -0.04em 0.04em 0 0.02em currentcolor; }\\n  75% {\\n    box-shadow: -0.04em -0.04em 0 0.02em currentcolor; }\\n  100% {\\n    box-shadow: 0.04em -0.04em 0 0.02em currentcolor; } }\\n\\n.loader-40 {\\n  border: .05em currentcolor solid;\\n  border-radius: .2em;\\n  overflow: hidden;\\n  position: relative; }\\n  .loader-40:after, .loader-40:before {\\n    content: '';\\n    border-radius: 50%;\\n    position: absolute;\\n    width: inherit;\\n    height: inherit;\\n    animation: loader-40 2s infinite linear; }\\n  .loader-40:before {\\n    border-top: .2em currentcolor solid;\\n    top: -.15em;\\n    left: calc( -50% - .15em);\\n    transform-origin: right center; }\\n  .loader-40:after {\\n    border-bottom: .2em currentcolor solid;\\n    top: .15em;\\n    right: calc( -50% - .15em);\\n    transform-origin: left center; }\\n\\n@keyframes loader-40 {\\n  from {\\n    transform: rotate(0deg); }\\n  to {\\n    transform: rotate(359deg); } }\\n\\n.loader-41 {\\n  border: .05em currentcolor solid;\\n  border-radius: .2em;\\n  position: relative;\\n  background: linear-gradient(45deg, transparent 48%, currentcolor 50%, currentcolor 50%, transparent 52%, transparent), linear-gradient(-45deg, transparent 48%, currentcolor 50%, currentcolor 50%, transparent 52%, transparent);\\n  background-size: .5em .5em;\\n  background-position: 0% 0%;\\n  animation: loader-41 1s infinite linear; }\\n\\n@keyframes loader-41 {\\n  from {\\n    background-position: 0 0; }\\n  to {\\n    background-position: -1em 0; } }\\n\\n.loader-42 {\\n  width: 2em;\\n  height: .66em;\\n  border: .05em currentcolor solid;\\n  border-radius: .1em;\\n  background: linear-gradient(-60deg, transparent 0%, transparent 50%, currentcolor 50%, currentcolor 75%, transparent 75%, transparent);\\n  background-size: 1em 2em;\\n  background-position: 0 0;\\n  animation: loader-42 0.8s infinite linear; }\\n\\n@keyframes loader-42 {\\n  from {\\n    background-position: 0 0; }\\n  to {\\n    background-position: -2em 0; } }\\n\\n.box:nth-of-type(n + 43) {\\n  display: none; }\\n\\n/*# sourceMappingURL=Loader.svelte.css.map */</style>\"],\"names\":[],\"mappings\":\"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\"}"
};

const Loader = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	let { index = 1, scale = 1, color = "#000" } = $$props;
    index = index > 9 ? index : `0${index}`;

	if ($$props.index === void 0 && $$bindings.index && index !== void 0) $$bindings.index(index);
	if ($$props.scale === void 0 && $$bindings.scale && scale !== void 0) $$bindings.scale(scale);
	if ($$props.color === void 0 && $$bindings.color && color !== void 0) $$bindings.color(color);

	$$result.css.add(css$4);

	return `<div class="load-wrapper svelte-354ro">
	    <div class="scalebox" style="transform: scale(${escape(scale)}, ${escape(scale)});">
	        <div style="color: ${escape(color)}" class="loader-${escape(index)} svelte-354ro"></div>
	    </div>
	</div>`;
});

// Takes an ISO time and returns a string representing how
// long ago the date represents.
function pretty_date(time) {
    const date = new Date(time);
    const diff = (((new Date()).getTime() - date.getTime()) / 1000);
    const day_diff = Math.ceil(diff / 86400);

    if (isNaN(day_diff) || day_diff < 0) {
        return;
    }

    return day_diff == 0 && (
    diff < 60 && "just now"
        || diff < 120 && "1 minute ago"
        || diff < 3600 && Math.floor(diff / 60) + " minutes ago"
        || diff < 7200 && "1 hour ago"
        || diff < 86400 && Math.floor(diff / 3600) + " hours ago")
        || day_diff == 1 && "1 day ago"
        || day_diff + " days ago";
}

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
function human_date(date) {
    const YYYY = date.getFullYear();
    const MM = months[date.getMonth()];
    const dd = `${date.getDate()}${date_ordinal(date.getDate())}`;
    const HH = pad_int(date.getHours());
    const mm = pad_int(date.getMinutes());
    return `${MM} ${dd} ${YYYY} ${HH}:${mm}`;
}

function date_ordinal(d) {
    if (d > 3 && d < 21) {
        return "th";
    }
    switch (d % 10) {
        case 1:  return "st";
        case 2:  return "nd";
        case 3:  return "rd";
        default: return "th";
    }
}

// Returns the ISO week of the date.
Date.prototype.getWeek = function() {
    const date = new Date(this.getTime());
    date.setHours(0, 0, 0, 0);
    // Thursday in current week decides the year.
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    // January 4 is always in week 1.
    const week1 = new Date(date.getFullYear(), 0, 4);
    // Adjust to Thursday in week 1 and count number of weeks from date to week1.
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
};

// Returns the four-digit year corresponding to the ISO week of the date.
Date.prototype.getWeekYear = function() {
    const date = new Date(this.getTime());
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    return date.getFullYear();
};

/* src\routes\index.svelte generated by Svelte v3.6.1 */

const css$5 = {
	code: "body, html{background-color:#EBF0F5;font-family:\"Roboto\", sans-serif;min-height:100%;margin:0;padding:0}body{position:absolute;top:0;bottom:0;left:0;right:0}#sapper{width:100%;height:100%}.frow{display:flex;flex-direction:row}.btnwrap{flex:1;display:flex;justify-content:center;align-items:center}.main-container.svelte-1h0spkk{width:100%;height:100%;display:flex;flex-direction:column;position:absolute;top:0}.main-container.svelte-1h0spkk .header.svelte-1h0spkk{margin:0 2em;margin-top:0.5em;font-size:42px;text-transform:uppercase;font-weight:300;color:#697882;border-bottom:3px solid #689dc0}.main-container.svelte-1h0spkk .header strong.svelte-1h0spkk{font-weight:400}.main-container.svelte-1h0spkk .content.svelte-1h0spkk{display:flex;flex-direction:column;flex:1;padding:25px;margin:4em;margin-top:1em;background-color:white}.main-container.svelte-1h0spkk .content .content-header.svelte-1h0spkk{display:flex;align-items:center;border-bottom:1px solid #AAA;padding:5px 0}.main-container.svelte-1h0spkk .content .content-header .title.svelte-1h0spkk{flex:1;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;text-transform:uppercase;font-size:26px}.main-container.svelte-1h0spkk .content .content-header .floater.svelte-1h0spkk{position:relative;width:0;height:0;left:-260px;top:20px;z-index:1}.main-container.svelte-1h0spkk .content .content-header .floater.hidden.svelte-1h0spkk{display:none}.main-container.svelte-1h0spkk .content .content-header .pseudo-input.svelte-1h0spkk{width:195px;font-size:16px;border:1px solid #AAA;padding:4px 10px;margin-left:10px;cursor:pointer;text-align:center}.main-container.svelte-1h0spkk .content .content-header .pseudo-input-lbl.svelte-1h0spkk{margin-left:10px}.main-container.svelte-1h0spkk .content .content-header input.svelte-1h0spkk{width:195px;font-size:16px;border:1px solid #AAA;padding:4px 10px;margin-left:10px}.main-container.svelte-1h0spkk .content .content-header button.svelte-1h0spkk{width:29px;height:29px;color:white;background-color:#0681ff;border:none;cursor:pointer;text-transform:uppercase;margin-left:10px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}.main-container.svelte-1h0spkk .content .content-header button.svelte-1h0spkk:hover{background-color:#0068d2}.main-container.svelte-1h0spkk .content .content-header button .svelte-1h0spkk{font-size:18px}.main-container.svelte-1h0spkk .content .content-header button i.svelte-1h0spkk{margin-left:-2px}.main-container.svelte-1h0spkk .content .inner-content.svelte-1h0spkk{display:flex;flex-direction:column;flex:1}.error-box.svelte-1h0spkk{display:flex;flex-direction:column;justify-content:center;align-items:center;height:100%;font-size:24px;color:#f32121}.error-box.svelte-1h0spkk span.svelte-1h0spkk:first-child{font-size:36px;margin-bottom:15px}",
	map: "{\"version\":3,\"file\":\"index.svelte\",\"sources\":[\"index.svelte\"],\"sourcesContent\":[\"<script>\\r\\n    import \\\"@fortawesome/fontawesome-free/css/all.css\\\";\\r\\n    import { onMount } from \\\"svelte\\\";\\r\\n    import ReportsTable from \\\"../components/ReportsTable.svelte\\\";\\r\\n    import AxleCounterTable from \\\"../components/AxleCounterTable.svelte\\\";\\r\\n    import DatePicker from \\\"../components/DatePicker.svelte\\\";\\r\\n    import Loader from \\\"../components/Loader.svelte\\\";\\r\\n    import config from \\\"../const.js\\\";\\r\\n    import { pretty_date, human_date } from \\\"../pretty.js\\\";\\r\\n    import \\\"../middle_ware.js\\\";\\r\\n    import { axle_query } from \\\"../stores.js\\\"\\r\\n    import { pad_int } from \\\"../lib.js\\\";\\r\\n\\r\\n    let reports;\\r\\n    let axle_data;\\r\\n    let query = \\\"\\\";\\r\\n    let show_to_picker = false;\\r\\n    let show_from_picker = false;\\r\\n    let is_uploading = false;\\r\\n    let is_downloading = false;\\r\\n    let to_date = new Date();\\r\\n    let from_date = new Date();\\r\\n    from_date.setDate(to_date.getDate() - 30);\\r\\n    let file_upload_element;\\r\\n\\r\\n    const sort_methods = {\\r\\n        number_of_crossings: {\\r\\n            asc: (a, b) => a.number_of_crossings || Number.MAX_SAFE_INTEGER - b.number_of_crossings || Number.MAX_SAFE_INTEGER,\\r\\n            desc: (a, b) => b.number_of_crossings || Number.MAX_SAFE_INTEGER - a.number_of_crossings || Number.MAX_SAFE_INTEGER,\\r\\n        },\\r\\n        axle_counter: {\\r\\n            asc: (a, b) => a.localeCompare(b),\\r\\n            desc: (a, b) => b.localeCompare(a),\\r\\n        },\\r\\n        ignored: {\\r\\n            asc: (a, b) => a.ignored - b.ignored,\\r\\n            desc: (a, b) => b.ignored - a.ignored,\\r\\n        },\\r\\n        days_since_last_crossing: {\\r\\n            asc: (a, b) => new Date(a.crossing_time) - new Date(b.crossing_time),\\r\\n            desc: (a, b) => new Date(b.crossing_time) - new Date(a.crossing_time),\\r\\n        },\\r\\n    }\\r\\n\\r\\n    function format_date(date) {\\r\\n        const year = date.getFullYear();\\r\\n        const month = date.getMonth() + 1;\\r\\n        const day = date.getDate();\\r\\n        const hours = date.getHours();\\r\\n        const minutes = date.getMinutes();\\r\\n        const seconds = date.getSeconds();\\r\\n\\r\\n        return `${year}-${pad_int(month)}-${pad_int(day)} ${pad_int(hours)}:${pad_int(minutes)}:${pad_int(seconds)}`;\\r\\n    }\\r\\n\\r\\n    function show_from_date_picker() {\\r\\n        show_to_picker = false;\\r\\n        show_from_picker = true;\\r\\n    }\\r\\n\\r\\n    function show_to_date_picker() {\\r\\n        show_to_picker = true;\\r\\n        show_from_picker = false;\\r\\n    }\\r\\n\\r\\n    function from_date_picked(date) {\\r\\n        from_date = date;\\r\\n        show_from_picker = false;\\r\\n        reports = fetch(`${config.api_url}/axle_counters/report?from=${format_date(from_date)}&to=${format_date(to_date)}`).then(res => {\\r\\n            return res.json();\\r\\n        }).then(reports => {\\r\\n            reports.sort((a, b) => {\\r\\n                return new Date(a.crossing_time) - new Date(b.crossing_time);\\r\\n            });\\r\\n            for (const report of reports) {\\r\\n                report.crossing_time = pretty_date(\\r\\n                    report.crossing_time\\r\\n                ) || \\\"No crossing time avaliable\\\";\\r\\n            }\\r\\n            return reports;\\r\\n        });\\r\\n    }\\r\\n\\r\\n    function to_date_picked(date) {\\r\\n        to_date = date;\\r\\n        show_to_picker = false;\\r\\n        reports = fetch(`${config.api_url}/axle_counters/report?from=${format_date(from_date)}&to=${format_date(to_date)}`).then(res => {\\r\\n            return res.json();\\r\\n        }).then(reports => {\\r\\n            reports.sort((a, b) => {\\r\\n                return new Date(a.crossing_time) - new Date(b.crossing_time);\\r\\n            });\\r\\n            for (const report of reports) {\\r\\n                report.crossing_time = pretty_date(\\r\\n                    report.crossing_time\\r\\n                ) || \\\"No crossing time avaliable\\\";\\r\\n            }\\r\\n            return reports;\\r\\n        });\\r\\n    }\\r\\n\\r\\n    function download_report() {\\r\\n        is_downloading = true;\\r\\n\\r\\n        fetch(`${config.api_url}/axle_counters/report/excel?from=${format_date(from_date)}&to=${format_date(to_date)}`, {\\r\\n            method: \\\"GET\\\",\\r\\n        }).then((response) => {\\r\\n            return response.blob();\\r\\n        }).then((blob) => {\\r\\n            const url = window.URL.createObjectURL(blob);\\r\\n            const a = document.createElement(\\\"a\\\");\\r\\n            a.href = url;\\r\\n            a.download = \\\"axle_counter_report.xlsx\\\";\\r\\n            document.body.appendChild(a);\\r\\n            a.click();\\r\\n            a.remove();\\r\\n        }).catch((error) => {\\r\\n            console.error(error);\\r\\n        }).finally(() => {\\r\\n            is_downloading = false;\\r\\n        });\\r\\n    };\\r\\n\\r\\n    function upload_file_selected() {\\r\\n        const selected_file = file_upload_element.files[0];\\r\\n\\r\\n        if (!config.allowed_file_types.includes(selected_file.type)) {\\r\\n            console.error(\\\"Invalid file type\\\");\\r\\n            return;\\r\\n        }\\r\\n\\r\\n        is_uploading = true;\\r\\n        const data = new FormData()\\r\\n        data.append(\\\"file\\\", selected_file)\\r\\n\\r\\n        fetch(`${config.api_url}/import_excel/`, {\\r\\n                method: \\\"POST\\\",\\r\\n                body: data,\\r\\n        }).then(response => {\\r\\n            response.json()\\r\\n        }).catch((err) => {\\r\\n            console.error(err)\\r\\n        }).finally(() => {\\r\\n            is_uploading = false;\\r\\n        });\\r\\n    }\\r\\n\\r\\n    onMount(() => {\\r\\n        reports = fetch(`${config.api_url}/axle_counters/report?from=${format_date(from_date)}&to=${format_date(to_date)}`).then(res => {\\r\\n            return res.json();\\r\\n        }).then(reports => {\\r\\n            reports.sort((a, b) => {\\r\\n                return new Date(a.crossing_time) - new Date(b.crossing_time);\\r\\n            });\\r\\n            for (const report of reports) {\\r\\n                report.crossing_time = pretty_date(\\r\\n                    report.crossing_time\\r\\n                ) || \\\"No crossing time avaliable\\\";\\r\\n            }\\r\\n            return reports;\\r\\n        });\\r\\n    });\\r\\n</script>\\r\\n\\r\\n<svelte:head>\\r\\n    <title>Axle Counter</title>\\r\\n</svelte:head>\\r\\n\\r\\n<input\\r\\n    bind:this={file_upload_element}\\r\\n    on:change={upload_file_selected}\\r\\n    type=\\\"file\\\"\\r\\n    style=\\\"width: 0; height: 0;\\\"\\r\\n>\\r\\n<div class=\\\"main-container\\\">\\r\\n    <div class=\\\"frow\\\">\\r\\n        <div class=\\\"header\\\">\\r\\n            <strong>axle</strong>\\r\\n            counter\\r\\n        </div>\\r\\n    </div>\\r\\n\\r\\n    <div class=\\\"content\\\">\\r\\n        <div class=\\\"content-header\\\">\\r\\n            <span class=\\\"title\\\">axle counter reports</span>\\r\\n            <button on:click={() => file_upload_element.click()} title=\\\"Upload axle counter data\\\">\\r\\n                <span>\\r\\n                    {#if is_uploading}\\r\\n                        <Loader index={Math.floor((Math.random() * 42) + 1)} scale={1} color={\\\"white\\\"} />\\r\\n                    {:else}\\r\\n                        <i class=\\\"fas fa-upload\\\"></i>\\r\\n                    {/if}\\r\\n                </span>\\r\\n            </button>\\r\\n            <button on:click={download_report} title=\\\"Download axle counter data\\\">\\r\\n                <span>\\r\\n                    {#if is_downloading}\\r\\n                        <Loader index={Math.floor((Math.random() * 42) + 1)} scale={1} color={\\\"white\\\"} />\\r\\n                    {:else}\\r\\n                        <!-- <i class=\\\"fas fa-download\\\"></i> -->\\r\\n                        <!-- <div>Icons made by <a href=\\\"https://www.flaticon.com/authors/dave-gandy\\\" title=\\\"Dave Gandy\\\">Dave Gandy</a> from <a href=\\\"https://www.flaticon.com/\\\" title=\\\"Flaticon\\\">www.flaticon.com</a> is licensed by <a href=\\\"http://creativecommons.org/licenses/by/3.0/\\\"                 title=\\\"Creative Commons BY 3.0\\\" target=\\\"_blank\\\">CC 3.0 BY</a></div> -->\\r\\n                        <img src=\\\"icons/download.svg\\\" alt=\\\"download\\\" width=\\\"19\\\" height=\\\"19\\\" display=\\\"fill: white;\\\">\\r\\n                    {/if}\\r\\n                </span>\\r\\n            </button>\\r\\n            <div\\r\\n                class=\\\"pseudo-input\\\"\\r\\n                on:click={show_from_date_picker}\\r\\n                title=\\\"Set a minimum date for axle counter data\\\"\\r\\n            >\\r\\n                {human_date(from_date)}\\r\\n            </div>\\r\\n            <div class=\\\"floater\\\" class:hidden={!show_from_picker}>\\r\\n                <DatePicker\\r\\n                    on:date={(e) => from_date_picked(e.detail.date)}\\r\\n                    on:cancel={() => show_from_picker = false}\\r\\n                />\\r\\n            </div>\\r\\n            <span class=\\\"pseudo-input-lbl\\\">TO</span>\\r\\n            <div\\r\\n                class=\\\"pseudo-input\\\"\\r\\n                on:click={show_to_date_picker}\\r\\n                title=\\\"Set a maximum date for axle counter data\\\"\\r\\n            >\\r\\n                {human_date(to_date)}\\r\\n            </div>\\r\\n            <div class=\\\"floater\\\" class:hidden={!show_to_picker}>\\r\\n                <DatePicker\\r\\n                    on:date={(e) => to_date_picked(e.detail.date)}\\r\\n                    on:cancel={() => show_to_picker = false}\\r\\n                />\\r\\n            </div>\\r\\n            <input\\r\\n                type=\\\"text\\\"\\r\\n                placeholder=\\\"Search\\\"\\r\\n                bind:value={query}\\r\\n                on:input={() => axle_query.sedust(query)} title=\\\"Filter axle counters\\\"\\r\\n            >\\r\\n        </div>\\r\\n        <div class=\\\"inner-content\\\">\\r\\n            {#if reports}\\r\\n                {#await reports}\\r\\n                    <Loader index={Math.floor((Math.random() * 42) + 1)} scale={8} color={\\\"#689dc0\\\"} />\\r\\n                {:then counters}\\r\\n                    <AxleCounterTable\\r\\n                        counters={counters}\\r\\n                        aliases={config.axle_counter_aliases}\\r\\n                        sorting={sort_methods}\\r\\n                        sortby={\\\"days_since_last_crossing\\\"}\\r\\n                        ascending={false}\\r\\n                        threshold={22}\\r\\n                        exclude={[\\\"id\\\", \\\"ignored\\\", \\\"ignore\\\", \\\"reset_tvs\\\", \\\"days_since_last_crossing\\\", \\\"crossing_time\\\"]}\\r\\n                    />\\r\\n                {:catch error}\\r\\n                    <div class=\\\"error-box\\\">\\r\\n                        <span>No data was avaliable</span>\\r\\n                        <span>{error}</span>\\r\\n                    </div>\\r\\n                {/await}\\r\\n            {/if}\\r\\n        </div>\\r\\n    </div>\\r\\n</div>\\r\\n\\r\\n<style lang=\\\"scss\\\">:global(body, html) {\\n  background-color: #EBF0F5;\\n  font-family: \\\"Roboto\\\", sans-serif;\\n  min-height: 100%;\\n  margin: 0;\\n  padding: 0; }\\n\\n:global(body) {\\n  position: absolute;\\n  top: 0;\\n  bottom: 0;\\n  left: 0;\\n  right: 0; }\\n\\n:global(#sapper) {\\n  width: 100%;\\n  height: 100%; }\\n\\n:global(.frow) {\\n  display: flex;\\n  flex-direction: row; }\\n\\n:global(.btnwrap) {\\n  flex: 1;\\n  display: flex;\\n  justify-content: center;\\n  align-items: center; }\\n\\n.main-container {\\n  width: 100%;\\n  height: 100%;\\n  display: flex;\\n  flex-direction: column;\\n  position: absolute;\\n  top: 0; }\\n  .main-container .header {\\n    margin: 0 2em;\\n    margin-top: 0.5em;\\n    font-size: 42px;\\n    text-transform: uppercase;\\n    font-weight: 300;\\n    color: #697882;\\n    border-bottom: 3px solid #689dc0; }\\n    .main-container .header strong {\\n      font-weight: 400; }\\n  .main-container .content {\\n    display: flex;\\n    flex-direction: column;\\n    flex: 1;\\n    padding: 25px;\\n    margin: 4em;\\n    margin-top: 1em;\\n    background-color: white; }\\n    .main-container .content .content-header {\\n      display: flex;\\n      align-items: center;\\n      border-bottom: 1px solid #AAA;\\n      padding: 5px 0; }\\n      .main-container .content .content-header .title {\\n        flex: 1;\\n        overflow: hidden;\\n        white-space: nowrap;\\n        text-overflow: ellipsis;\\n        text-transform: uppercase;\\n        font-size: 26px; }\\n      .main-container .content .content-header .floater {\\n        position: relative;\\n        width: 0;\\n        height: 0;\\n        left: -260px;\\n        top: 20px;\\n        z-index: 1; }\\n        .main-container .content .content-header .floater.hidden {\\n          display: none; }\\n      .main-container .content .content-header .pseudo-input {\\n        width: 195px;\\n        font-size: 16px;\\n        border: 1px solid #AAA;\\n        padding: 4px 10px;\\n        margin-left: 10px;\\n        cursor: pointer;\\n        text-align: center; }\\n      .main-container .content .content-header .pseudo-input-lbl {\\n        margin-left: 10px; }\\n      .main-container .content .content-header input {\\n        width: 195px;\\n        font-size: 16px;\\n        border: 1px solid #AAA;\\n        padding: 4px 10px;\\n        margin-left: 10px; }\\n      .main-container .content .content-header button {\\n        width: 29px;\\n        height: 29px;\\n        color: white;\\n        background-color: #0681ff;\\n        border: none;\\n        cursor: pointer;\\n        text-transform: uppercase;\\n        margin-left: 10px;\\n        overflow: hidden;\\n        white-space: nowrap;\\n        text-overflow: ellipsis; }\\n        .main-container .content .content-header button:hover {\\n          background-color: #0068d2; }\\n        .main-container .content .content-header button * {\\n          font-size: 18px; }\\n        .main-container .content .content-header button i {\\n          margin-left: -2px; }\\n    .main-container .content .inner-content {\\n      display: flex;\\n      flex-direction: column;\\n      flex: 1; }\\n\\n.error-box {\\n  display: flex;\\n  flex-direction: column;\\n  justify-content: center;\\n  align-items: center;\\n  height: 100%;\\n  font-size: 24px;\\n  color: #f32121; }\\n  .error-box span:first-child {\\n    font-size: 36px;\\n    margin-bottom: 15px; }\\n\\n/*# sourceMappingURL=index.svelte.css.map */</style>\\r\\n\"],\"names\":[],\"mappings\":\"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\"}"
};

function format_date(date) {
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const seconds = date.getSeconds();

      return `${year}-${pad_int(month)}-${pad_int(day)} ${pad_int(hours)}:${pad_int(minutes)}:${pad_int(seconds)}`;
  }

const Index = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	

    let reports;
    let query = "";
    let show_to_picker = false;
    let show_from_picker = false;
    let is_uploading = false;
    let is_downloading = false;
    let to_date = new Date();
    let from_date = new Date();
    from_date.setDate(to_date.getDate() - 30);
    let file_upload_element;

    const sort_methods = {
        number_of_crossings: {
            asc: (a, b) => a.number_of_crossings || Number.MAX_SAFE_INTEGER - b.number_of_crossings || Number.MAX_SAFE_INTEGER,
            desc: (a, b) => b.number_of_crossings || Number.MAX_SAFE_INTEGER - a.number_of_crossings || Number.MAX_SAFE_INTEGER,
        },
        axle_counter: {
            asc: (a, b) => a.localeCompare(b),
            desc: (a, b) => b.localeCompare(a),
        },
        ignored: {
            asc: (a, b) => a.ignored - b.ignored,
            desc: (a, b) => b.ignored - a.ignored,
        },
        days_since_last_crossing: {
            asc: (a, b) => new Date(a.crossing_time) - new Date(b.crossing_time),
            desc: (a, b) => new Date(b.crossing_time) - new Date(a.crossing_time),
        },
    };

    onMount(() => {
        reports = fetch(`${config.api_url}/axle_counters/report?from=${format_date(from_date)}&to=${format_date(to_date)}`).then(res => {
            return res.json();
        }).then(reports => {
            reports.sort((a, b) => {
                return new Date(a.crossing_time) - new Date(b.crossing_time);
            });
            for (const report of reports) {
                report.crossing_time = pretty_date(
                    report.crossing_time
                ) || "No crossing time avaliable";
            }
            return reports;
        });
    });

	$$result.css.add(css$5);

	return `${($$result.head += `<title>Axle Counter</title>`, "")}

	<input type="file" style="width: 0; height: 0;"${add_attribute("this", file_upload_element)}>
	<div class="main-container svelte-1h0spkk">
	    <div class="frow">
	        <div class="header svelte-1h0spkk">
	            <strong class="svelte-1h0spkk">axle</strong>
	            counter
	        </div>
	    </div>

	    <div class="content svelte-1h0spkk">
	        <div class="content-header svelte-1h0spkk">
	            <span class="title svelte-1h0spkk">axle counter reports</span>
	            <button title="Upload axle counter data" class="svelte-1h0spkk">
	                <span class="svelte-1h0spkk">
	                    ${ is_uploading ? `${validate_component(Loader, 'Loader').$$render($$result, {
		index: Math.floor((Math.random() * 42) + 1),
		scale: 1,
		color: "white"
	}, {}, {})}` : `<i class="fas fa-upload svelte-1h0spkk"></i>` }
	                </span>
	            </button>
	            <button title="Download axle counter data" class="svelte-1h0spkk">
	                <span class="svelte-1h0spkk">
	                    ${ is_downloading ? `${validate_component(Loader, 'Loader').$$render($$result, {
		index: Math.floor((Math.random() * 42) + 1),
		scale: 1,
		color: "white"
	}, {}, {})}` : `
	                        
	                        <img src="icons/download.svg" alt="download" width="19" height="19" display="fill: white;" class="svelte-1h0spkk">` }
	                </span>
	            </button>
	            <div class="pseudo-input svelte-1h0spkk" title="Set a minimum date for axle counter data">
	                ${escape(human_date(from_date))}
	            </div>
	            <div class="${[`floater svelte-1h0spkk`, !show_from_picker ? "hidden" : ""].join(' ').trim() }">
	                ${validate_component(DatePicker, 'DatePicker').$$render($$result, {}, {}, {})}
	            </div>
	            <span class="pseudo-input-lbl svelte-1h0spkk">TO</span>
	            <div class="pseudo-input svelte-1h0spkk" title="Set a maximum date for axle counter data">
	                ${escape(human_date(to_date))}
	            </div>
	            <div class="${[`floater svelte-1h0spkk`, !show_to_picker ? "hidden" : ""].join(' ').trim() }">
	                ${validate_component(DatePicker, 'DatePicker').$$render($$result, {}, {}, {})}
	            </div>
	            <input type="text" placeholder="Search" title="Filter axle counters" class="svelte-1h0spkk"${add_attribute("value", query)}>
	        </div>
	        <div class="inner-content svelte-1h0spkk">
	            ${ reports ? `${(function(__value) { if(is_promise(__value)) return `
	                    ${validate_component(Loader, 'Loader').$$render($$result, {
		index: Math.floor((Math.random() * 42) + 1),
		scale: 8,
		color: "#689dc0"
	}, {}, {})}
	                `; return function(counters) { return `
	                    ${validate_component(AxleCounterTable, 'AxleCounterTable').$$render($$result, {
		counters: counters,
		aliases: config.axle_counter_aliases,
		sorting: sort_methods,
		sortby: "days_since_last_crossing",
		ascending: false,
		threshold: 22,
		exclude: ["id", "ignored", "ignore", "reset_tvs", "days_since_last_crossing", "crossing_time"]
	}, {}, {})}
	                `;}(__value);}(reports)) }` : `` }
	        </div>
	    </div>
	</div>`;
});

/* src\routes\_layout.svelte generated by Svelte v3.6.1 */

const Layout = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	return `${$$slots.default ? $$slots.default() : ``}`;
});

/* src\routes\_error.svelte generated by Svelte v3.6.1 */

const css$6 = {
	code: "h1.svelte-1v0wz8u{font-size:42px;text-transform:uppercase;font-weight:300;color:#697882;border-bottom:3px solid #689dc0}@media(min-width: 480px){h1.svelte-1v0wz8u{font-size:4em}}",
	map: "{\"version\":3,\"file\":\"_error.svelte\",\"sources\":[\"_error.svelte\"],\"sourcesContent\":[\"<script>\\r\\n\\texport let status;\\r\\n\\texport let error;\\r\\n\\r\\n\\tconst dev = undefined === 'development';\\r\\n</script>\\r\\n\\r\\n<svelte:head>\\r\\n    <title>Error {status}</title>\\r\\n</svelte:head>\\r\\n\\r\\n<h1>{status}: {error.message}</h1>\\r\\n\\r\\n{#if dev && error.stack}\\r\\n\\t<pre>{error.stack}</pre>\\r\\n{/if}\\r\\n\\r\\n<style>\\r\\n\\th1 {\\r\\n\\t\\tfont-size: 42px;\\r\\n\\t\\ttext-transform: uppercase;\\r\\n\\t\\tfont-weight: 300;\\r\\n\\t\\tcolor: #697882;\\r\\n\\t\\tborder-bottom: 3px solid #689dc0;\\r\\n\\t}\\r\\n\\r\\n\\t@media (min-width: 480px) {\\r\\n\\t\\th1 {\\r\\n\\t\\t\\tfont-size: 4em;\\r\\n\\t\\t}\\r\\n\\t}\\r\\n</style>\\r\\n\"],\"names\":[],\"mappings\":\"AAkBC,EAAE,eAAC,CAAC,AACH,SAAS,CAAE,IAAI,CACf,cAAc,CAAE,SAAS,CACzB,WAAW,CAAE,GAAG,CAChB,KAAK,CAAE,OAAO,CACd,aAAa,CAAE,GAAG,CAAC,KAAK,CAAC,OAAO,AACjC,CAAC,AAED,MAAM,AAAC,YAAY,KAAK,CAAC,AAAC,CAAC,AAC1B,EAAE,eAAC,CAAC,AACH,SAAS,CAAE,GAAG,AACf,CAAC,AACF,CAAC\"}"
};

const Error$1 = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	let { status, error } = $$props;

	if ($$props.status === void 0 && $$bindings.status && status !== void 0) $$bindings.status(status);
	if ($$props.error === void 0 && $$bindings.error && error !== void 0) $$bindings.error(error);

	$$result.css.add(css$6);

	return `${($$result.head += `<title>Error ${escape(status)}</title>`, "")}

	<h1 class="svelte-1v0wz8u">${escape(status)}: ${escape(error.message)}</h1>

	${  `` }`;
});

// This file is generated by Sapper — do not edit it!

const manifest = {
	server_routes: [
		
	],

	pages: [
		{
			// index.svelte
			pattern: /^\/$/,
			parts: [
				{ name: "index", file: "index.svelte", component: Index }
			]
		}
	],

	root: Layout,
	root_preload: () => {},
	error: Error$1
};

const build_dir = "__sapper__/build";

const CONTEXT_KEY = {};

/* src\node_modules\@sapper\internal\App.svelte generated by Svelte v3.6.1 */

const App = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	

	let { stores, error, status, segments, level0, level1 = null } = $$props;

	setContext(CONTEXT_KEY, stores);

	if ($$props.stores === void 0 && $$bindings.stores && stores !== void 0) $$bindings.stores(stores);
	if ($$props.error === void 0 && $$bindings.error && error !== void 0) $$bindings.error(error);
	if ($$props.status === void 0 && $$bindings.status && status !== void 0) $$bindings.status(status);
	if ($$props.segments === void 0 && $$bindings.segments && segments !== void 0) $$bindings.segments(segments);
	if ($$props.level0 === void 0 && $$bindings.level0 && level0 !== void 0) $$bindings.level0(level0);
	if ($$props.level1 === void 0 && $$bindings.level1 && level1 !== void 0) $$bindings.level1(level1);

	return `


	${validate_component(Layout, 'Layout').$$render($$result, Object.assign({ segment: segments[0] }, level0.props), {}, {
		default: () => `
		${ error ? `${validate_component(Error$1, 'Error').$$render($$result, { error: error, status: status }, {}, {})}` : `${validate_component(((level1.component) || missing_component), 'svelte:component').$$render($$result, Object.assign(level1.props), {}, {})}` }
	`
	})}`;
});

function get_server_route_handler(routes) {
	async function handle_route(route, req, res, next) {
		req.params = route.params(route.pattern.exec(req.path));

		const method = req.method.toLowerCase();
		// 'delete' cannot be exported from a module because it is a keyword,
		// so check for 'del' instead
		const method_export = method === 'delete' ? 'del' : method;
		const handle_method = route.handlers[method_export];
		if (handle_method) {
			if (process.env.SAPPER_EXPORT) {
				const { write, end, setHeader } = res;
				const chunks = [];
				const headers = {};

				// intercept data so that it can be exported
				res.write = function(chunk) {
					chunks.push(Buffer.from(chunk));
					write.apply(res, arguments);
				};

				res.setHeader = function(name, value) {
					headers[name.toLowerCase()] = value;
					setHeader.apply(res, arguments);
				};

				res.end = function(chunk) {
					if (chunk) chunks.push(Buffer.from(chunk));
					end.apply(res, arguments);

					process.send({
						__sapper__: true,
						event: 'file',
						url: req.url,
						method: req.method,
						status: res.statusCode,
						type: headers['content-type'],
						body: Buffer.concat(chunks).toString()
					});
				};
			}

			const handle_next = (err) => {
				if (err) {
					res.statusCode = 500;
					res.end(err.message);
				} else {
					process.nextTick(next);
				}
			};

			try {
				await handle_method(req, res, handle_next);
			} catch (err) {
				handle_next(err);
			}
		} else {
			// no matching handler for method
			process.nextTick(next);
		}
	}

	return function find_route(req, res, next) {
		for (const route of routes) {
			if (route.pattern.test(req.path)) {
				handle_route(route, req, res, next);
				return;
			}
		}

		next();
	};
}

/*!
 * cookie
 * Copyright(c) 2012-2014 Roman Shtylman
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */

/**
 * Module exports.
 * @public
 */

var parse_1 = parse;
var serialize_1 = serialize;

/**
 * Module variables.
 * @private
 */

var decode = decodeURIComponent;
var encode = encodeURIComponent;
var pairSplitRegExp = /; */;

/**
 * RegExp to match field-content in RFC 7230 sec 3.2
 *
 * field-content = field-vchar [ 1*( SP / HTAB ) field-vchar ]
 * field-vchar   = VCHAR / obs-text
 * obs-text      = %x80-FF
 */

var fieldContentRegExp = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;

/**
 * Parse a cookie header.
 *
 * Parse the given cookie header string into an object
 * The object has the various cookies as keys(names) => values
 *
 * @param {string} str
 * @param {object} [options]
 * @return {object}
 * @public
 */

function parse(str, options) {
  if (typeof str !== 'string') {
    throw new TypeError('argument str must be a string');
  }

  var obj = {};
  var opt = options || {};
  var pairs = str.split(pairSplitRegExp);
  var dec = opt.decode || decode;

  for (var i = 0; i < pairs.length; i++) {
    var pair = pairs[i];
    var eq_idx = pair.indexOf('=');

    // skip things that don't look like key=value
    if (eq_idx < 0) {
      continue;
    }

    var key = pair.substr(0, eq_idx).trim();
    var val = pair.substr(++eq_idx, pair.length).trim();

    // quoted values
    if ('"' == val[0]) {
      val = val.slice(1, -1);
    }

    // only assign once
    if (undefined == obj[key]) {
      obj[key] = tryDecode(val, dec);
    }
  }

  return obj;
}

/**
 * Serialize data into a cookie header.
 *
 * Serialize the a name value pair into a cookie string suitable for
 * http headers. An optional options object specified cookie parameters.
 *
 * serialize('foo', 'bar', { httpOnly: true })
 *   => "foo=bar; httpOnly"
 *
 * @param {string} name
 * @param {string} val
 * @param {object} [options]
 * @return {string}
 * @public
 */

function serialize(name, val, options) {
  var opt = options || {};
  var enc = opt.encode || encode;

  if (typeof enc !== 'function') {
    throw new TypeError('option encode is invalid');
  }

  if (!fieldContentRegExp.test(name)) {
    throw new TypeError('argument name is invalid');
  }

  var value = enc(val);

  if (value && !fieldContentRegExp.test(value)) {
    throw new TypeError('argument val is invalid');
  }

  var str = name + '=' + value;

  if (null != opt.maxAge) {
    var maxAge = opt.maxAge - 0;
    if (isNaN(maxAge)) throw new Error('maxAge should be a Number');
    str += '; Max-Age=' + Math.floor(maxAge);
  }

  if (opt.domain) {
    if (!fieldContentRegExp.test(opt.domain)) {
      throw new TypeError('option domain is invalid');
    }

    str += '; Domain=' + opt.domain;
  }

  if (opt.path) {
    if (!fieldContentRegExp.test(opt.path)) {
      throw new TypeError('option path is invalid');
    }

    str += '; Path=' + opt.path;
  }

  if (opt.expires) {
    if (typeof opt.expires.toUTCString !== 'function') {
      throw new TypeError('option expires is invalid');
    }

    str += '; Expires=' + opt.expires.toUTCString();
  }

  if (opt.httpOnly) {
    str += '; HttpOnly';
  }

  if (opt.secure) {
    str += '; Secure';
  }

  if (opt.sameSite) {
    var sameSite = typeof opt.sameSite === 'string'
      ? opt.sameSite.toLowerCase() : opt.sameSite;

    switch (sameSite) {
      case true:
        str += '; SameSite=Strict';
        break;
      case 'lax':
        str += '; SameSite=Lax';
        break;
      case 'strict':
        str += '; SameSite=Strict';
        break;
      case 'none':
        str += '; SameSite=None';
        break;
      default:
        throw new TypeError('option sameSite is invalid');
    }
  }

  return str;
}

/**
 * Try decoding a string using a decoding function.
 *
 * @param {string} str
 * @param {function} decode
 * @private
 */

function tryDecode(str, decode) {
  try {
    return decode(str);
  } catch (e) {
    return str;
  }
}

var cookie = {
	parse: parse_1,
	serialize: serialize_1
};

var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_$';
var unsafeChars = /[<>\b\f\n\r\t\0\u2028\u2029]/g;
var reserved = /^(?:do|if|in|for|int|let|new|try|var|byte|case|char|else|enum|goto|long|this|void|with|await|break|catch|class|const|final|float|short|super|throw|while|yield|delete|double|export|import|native|return|switch|throws|typeof|boolean|default|extends|finally|package|private|abstract|continue|debugger|function|volatile|interface|protected|transient|implements|instanceof|synchronized)$/;
var escaped$1 = {
    '<': '\\u003C',
    '>': '\\u003E',
    '/': '\\u002F',
    '\\': '\\\\',
    '\b': '\\b',
    '\f': '\\f',
    '\n': '\\n',
    '\r': '\\r',
    '\t': '\\t',
    '\0': '\\0',
    '\u2028': '\\u2028',
    '\u2029': '\\u2029'
};
var objectProtoOwnPropertyNames = Object.getOwnPropertyNames(Object.prototype).sort().join('\0');
function devalue(value) {
    var counts = new Map();
    function walk(thing) {
        if (typeof thing === 'function') {
            throw new Error("Cannot stringify a function");
        }
        if (counts.has(thing)) {
            counts.set(thing, counts.get(thing) + 1);
            return;
        }
        counts.set(thing, 1);
        if (!isPrimitive(thing)) {
            var type = getType(thing);
            switch (type) {
                case 'Number':
                case 'String':
                case 'Boolean':
                case 'Date':
                case 'RegExp':
                    return;
                case 'Array':
                    thing.forEach(walk);
                    break;
                case 'Set':
                case 'Map':
                    Array.from(thing).forEach(walk);
                    break;
                default:
                    var proto = Object.getPrototypeOf(thing);
                    if (proto !== Object.prototype &&
                        proto !== null &&
                        Object.getOwnPropertyNames(proto).sort().join('\0') !== objectProtoOwnPropertyNames) {
                        throw new Error("Cannot stringify arbitrary non-POJOs");
                    }
                    if (Object.getOwnPropertySymbols(thing).length > 0) {
                        throw new Error("Cannot stringify POJOs with symbolic keys");
                    }
                    Object.keys(thing).forEach(function (key) { return walk(thing[key]); });
            }
        }
    }
    walk(value);
    var names = new Map();
    Array.from(counts)
        .filter(function (entry) { return entry[1] > 1; })
        .sort(function (a, b) { return b[1] - a[1]; })
        .forEach(function (entry, i) {
        names.set(entry[0], getName(i));
    });
    function stringify(thing) {
        if (names.has(thing)) {
            return names.get(thing);
        }
        if (isPrimitive(thing)) {
            return stringifyPrimitive(thing);
        }
        var type = getType(thing);
        switch (type) {
            case 'Number':
            case 'String':
            case 'Boolean':
                return "Object(" + stringify(thing.valueOf()) + ")";
            case 'RegExp':
                return thing.toString();
            case 'Date':
                return "new Date(" + thing.getTime() + ")";
            case 'Array':
                var members = thing.map(function (v, i) { return i in thing ? stringify(v) : ''; });
                var tail = thing.length === 0 || (thing.length - 1 in thing) ? '' : ',';
                return "[" + members.join(',') + tail + "]";
            case 'Set':
            case 'Map':
                return "new " + type + "([" + Array.from(thing).map(stringify).join(',') + "])";
            default:
                var obj = "{" + Object.keys(thing).map(function (key) { return safeKey(key) + ":" + stringify(thing[key]); }).join(',') + "}";
                var proto = Object.getPrototypeOf(thing);
                if (proto === null) {
                    return Object.keys(thing).length > 0
                        ? "Object.assign(Object.create(null)," + obj + ")"
                        : "Object.create(null)";
                }
                return obj;
        }
    }
    var str = stringify(value);
    if (names.size) {
        var params_1 = [];
        var statements_1 = [];
        var values_1 = [];
        names.forEach(function (name, thing) {
            params_1.push(name);
            if (isPrimitive(thing)) {
                values_1.push(stringifyPrimitive(thing));
                return;
            }
            var type = getType(thing);
            switch (type) {
                case 'Number':
                case 'String':
                case 'Boolean':
                    values_1.push("Object(" + stringify(thing.valueOf()) + ")");
                    break;
                case 'RegExp':
                    values_1.push(thing.toString());
                    break;
                case 'Date':
                    values_1.push("new Date(" + thing.getTime() + ")");
                    break;
                case 'Array':
                    values_1.push("Array(" + thing.length + ")");
                    thing.forEach(function (v, i) {
                        statements_1.push(name + "[" + i + "]=" + stringify(v));
                    });
                    break;
                case 'Set':
                    values_1.push("new Set");
                    statements_1.push(name + "." + Array.from(thing).map(function (v) { return "add(" + stringify(v) + ")"; }).join('.'));
                    break;
                case 'Map':
                    values_1.push("new Map");
                    statements_1.push(name + "." + Array.from(thing).map(function (_a) {
                        var k = _a[0], v = _a[1];
                        return "set(" + stringify(k) + ", " + stringify(v) + ")";
                    }).join('.'));
                    break;
                default:
                    values_1.push(Object.getPrototypeOf(thing) === null ? 'Object.create(null)' : '{}');
                    Object.keys(thing).forEach(function (key) {
                        statements_1.push("" + name + safeProp(key) + "=" + stringify(thing[key]));
                    });
            }
        });
        statements_1.push("return " + str);
        return "(function(" + params_1.join(',') + "){" + statements_1.join(';') + "}(" + values_1.join(',') + "))";
    }
    else {
        return str;
    }
}
function getName(num) {
    var name = '';
    do {
        name = chars[num % chars.length] + name;
        num = ~~(num / chars.length) - 1;
    } while (num >= 0);
    return reserved.test(name) ? name + "_" : name;
}
function isPrimitive(thing) {
    return Object(thing) !== thing;
}
function stringifyPrimitive(thing) {
    if (typeof thing === 'string')
        return stringifyString(thing);
    if (thing === void 0)
        return 'void 0';
    if (thing === 0 && 1 / thing < 0)
        return '-0';
    var str = String(thing);
    if (typeof thing === 'number')
        return str.replace(/^(-)?0\./, '$1.');
    return str;
}
function getType(thing) {
    return Object.prototype.toString.call(thing).slice(8, -1);
}
function escapeUnsafeChar(c) {
    return escaped$1[c] || c;
}
function escapeUnsafeChars(str) {
    return str.replace(unsafeChars, escapeUnsafeChar);
}
function safeKey(key) {
    return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key) ? key : escapeUnsafeChars(JSON.stringify(key));
}
function safeProp(key) {
    return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key) ? "." + key : "[" + escapeUnsafeChars(JSON.stringify(key)) + "]";
}
function stringifyString(str) {
    var result = '"';
    for (var i = 0; i < str.length; i += 1) {
        var char = str.charAt(i);
        var code = char.charCodeAt(0);
        if (char === '"') {
            result += '\\"';
        }
        else if (char in escaped$1) {
            result += escaped$1[char];
        }
        else if (code >= 0xd800 && code <= 0xdfff) {
            var next = str.charCodeAt(i + 1);
            // If this is the beginning of a [high, low] surrogate pair,
            // add the next two characters, otherwise escape
            if (code <= 0xdbff && (next >= 0xdc00 && next <= 0xdfff)) {
                result += char + str[++i];
            }
            else {
                result += "\\u" + code.toString(16).toUpperCase();
            }
        }
        else {
            result += char;
        }
    }
    result += '"';
    return result;
}

// Based on https://github.com/tmpvar/jsdom/blob/aa85b2abf07766ff7bf5c1f6daafb3726f2f2db5/lib/jsdom/living/blob.js

// fix for "Readable" isn't a named export issue
const Readable = Stream.Readable;

const BUFFER = Symbol('buffer');
const TYPE = Symbol('type');

class Blob {
	constructor() {
		this[TYPE] = '';

		const blobParts = arguments[0];
		const options = arguments[1];

		const buffers = [];
		let size = 0;

		if (blobParts) {
			const a = blobParts;
			const length = Number(a.length);
			for (let i = 0; i < length; i++) {
				const element = a[i];
				let buffer;
				if (element instanceof Buffer) {
					buffer = element;
				} else if (ArrayBuffer.isView(element)) {
					buffer = Buffer.from(element.buffer, element.byteOffset, element.byteLength);
				} else if (element instanceof ArrayBuffer) {
					buffer = Buffer.from(element);
				} else if (element instanceof Blob) {
					buffer = element[BUFFER];
				} else {
					buffer = Buffer.from(typeof element === 'string' ? element : String(element));
				}
				size += buffer.length;
				buffers.push(buffer);
			}
		}

		this[BUFFER] = Buffer.concat(buffers);

		let type = options && options.type !== undefined && String(options.type).toLowerCase();
		if (type && !/[^\u0020-\u007E]/.test(type)) {
			this[TYPE] = type;
		}
	}
	get size() {
		return this[BUFFER].length;
	}
	get type() {
		return this[TYPE];
	}
	text() {
		return Promise.resolve(this[BUFFER].toString());
	}
	arrayBuffer() {
		const buf = this[BUFFER];
		const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
		return Promise.resolve(ab);
	}
	stream() {
		const readable = new Readable();
		readable._read = function () {};
		readable.push(this[BUFFER]);
		readable.push(null);
		return readable;
	}
	toString() {
		return '[object Blob]';
	}
	slice() {
		const size = this.size;

		const start = arguments[0];
		const end = arguments[1];
		let relativeStart, relativeEnd;
		if (start === undefined) {
			relativeStart = 0;
		} else if (start < 0) {
			relativeStart = Math.max(size + start, 0);
		} else {
			relativeStart = Math.min(start, size);
		}
		if (end === undefined) {
			relativeEnd = size;
		} else if (end < 0) {
			relativeEnd = Math.max(size + end, 0);
		} else {
			relativeEnd = Math.min(end, size);
		}
		const span = Math.max(relativeEnd - relativeStart, 0);

		const buffer = this[BUFFER];
		const slicedBuffer = buffer.slice(relativeStart, relativeStart + span);
		const blob = new Blob([], { type: arguments[2] });
		blob[BUFFER] = slicedBuffer;
		return blob;
	}
}

Object.defineProperties(Blob.prototype, {
	size: { enumerable: true },
	type: { enumerable: true },
	slice: { enumerable: true }
});

Object.defineProperty(Blob.prototype, Symbol.toStringTag, {
	value: 'Blob',
	writable: false,
	enumerable: false,
	configurable: true
});

/**
 * fetch-error.js
 *
 * FetchError interface for operational errors
 */

/**
 * Create FetchError instance
 *
 * @param   String      message      Error message for human
 * @param   String      type         Error type for machine
 * @param   String      systemError  For Node.js system error
 * @return  FetchError
 */
function FetchError(message, type, systemError) {
  Error.call(this, message);

  this.message = message;
  this.type = type;

  // when err.type is `system`, err.code contains system error code
  if (systemError) {
    this.code = this.errno = systemError.code;
  }

  // hide custom error implementation details from end-users
  Error.captureStackTrace(this, this.constructor);
}

FetchError.prototype = Object.create(Error.prototype);
FetchError.prototype.constructor = FetchError;
FetchError.prototype.name = 'FetchError';

let convert;
try {
	convert = require('encoding').convert;
} catch (e) {}

const INTERNALS = Symbol('Body internals');

// fix an issue where "PassThrough" isn't a named export for node <10
const PassThrough = Stream.PassThrough;

/**
 * Body mixin
 *
 * Ref: https://fetch.spec.whatwg.org/#body
 *
 * @param   Stream  body  Readable stream
 * @param   Object  opts  Response options
 * @return  Void
 */
function Body(body) {
	var _this = this;

	var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
	    _ref$size = _ref.size;

	let size = _ref$size === undefined ? 0 : _ref$size;
	var _ref$timeout = _ref.timeout;
	let timeout = _ref$timeout === undefined ? 0 : _ref$timeout;

	if (body == null) {
		// body is undefined or null
		body = null;
	} else if (isURLSearchParams(body)) {
		// body is a URLSearchParams
		body = Buffer.from(body.toString());
	} else if (isBlob(body)) ; else if (Buffer.isBuffer(body)) ; else if (Object.prototype.toString.call(body) === '[object ArrayBuffer]') {
		// body is ArrayBuffer
		body = Buffer.from(body);
	} else if (ArrayBuffer.isView(body)) {
		// body is ArrayBufferView
		body = Buffer.from(body.buffer, body.byteOffset, body.byteLength);
	} else if (body instanceof Stream) ; else {
		// none of the above
		// coerce to string then buffer
		body = Buffer.from(String(body));
	}
	this[INTERNALS] = {
		body,
		disturbed: false,
		error: null
	};
	this.size = size;
	this.timeout = timeout;

	if (body instanceof Stream) {
		body.on('error', function (err) {
			const error = err.name === 'AbortError' ? err : new FetchError(`Invalid response body while trying to fetch ${_this.url}: ${err.message}`, 'system', err);
			_this[INTERNALS].error = error;
		});
	}
}

Body.prototype = {
	get body() {
		return this[INTERNALS].body;
	},

	get bodyUsed() {
		return this[INTERNALS].disturbed;
	},

	/**
  * Decode response as ArrayBuffer
  *
  * @return  Promise
  */
	arrayBuffer() {
		return consumeBody.call(this).then(function (buf) {
			return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
		});
	},

	/**
  * Return raw response as Blob
  *
  * @return Promise
  */
	blob() {
		let ct = this.headers && this.headers.get('content-type') || '';
		return consumeBody.call(this).then(function (buf) {
			return Object.assign(
			// Prevent copying
			new Blob([], {
				type: ct.toLowerCase()
			}), {
				[BUFFER]: buf
			});
		});
	},

	/**
  * Decode response as json
  *
  * @return  Promise
  */
	json() {
		var _this2 = this;

		return consumeBody.call(this).then(function (buffer) {
			try {
				return JSON.parse(buffer.toString());
			} catch (err) {
				return Body.Promise.reject(new FetchError(`invalid json response body at ${_this2.url} reason: ${err.message}`, 'invalid-json'));
			}
		});
	},

	/**
  * Decode response as text
  *
  * @return  Promise
  */
	text() {
		return consumeBody.call(this).then(function (buffer) {
			return buffer.toString();
		});
	},

	/**
  * Decode response as buffer (non-spec api)
  *
  * @return  Promise
  */
	buffer() {
		return consumeBody.call(this);
	},

	/**
  * Decode response as text, while automatically detecting the encoding and
  * trying to decode to UTF-8 (non-spec api)
  *
  * @return  Promise
  */
	textConverted() {
		var _this3 = this;

		return consumeBody.call(this).then(function (buffer) {
			return convertBody(buffer, _this3.headers);
		});
	}
};

// In browsers, all properties are enumerable.
Object.defineProperties(Body.prototype, {
	body: { enumerable: true },
	bodyUsed: { enumerable: true },
	arrayBuffer: { enumerable: true },
	blob: { enumerable: true },
	json: { enumerable: true },
	text: { enumerable: true }
});

Body.mixIn = function (proto) {
	for (const name of Object.getOwnPropertyNames(Body.prototype)) {
		// istanbul ignore else: future proof
		if (!(name in proto)) {
			const desc = Object.getOwnPropertyDescriptor(Body.prototype, name);
			Object.defineProperty(proto, name, desc);
		}
	}
};

/**
 * Consume and convert an entire Body to a Buffer.
 *
 * Ref: https://fetch.spec.whatwg.org/#concept-body-consume-body
 *
 * @return  Promise
 */
function consumeBody() {
	var _this4 = this;

	if (this[INTERNALS].disturbed) {
		return Body.Promise.reject(new TypeError(`body used already for: ${this.url}`));
	}

	this[INTERNALS].disturbed = true;

	if (this[INTERNALS].error) {
		return Body.Promise.reject(this[INTERNALS].error);
	}

	let body = this.body;

	// body is null
	if (body === null) {
		return Body.Promise.resolve(Buffer.alloc(0));
	}

	// body is blob
	if (isBlob(body)) {
		body = body.stream();
	}

	// body is buffer
	if (Buffer.isBuffer(body)) {
		return Body.Promise.resolve(body);
	}

	// istanbul ignore if: should never happen
	if (!(body instanceof Stream)) {
		return Body.Promise.resolve(Buffer.alloc(0));
	}

	// body is stream
	// get ready to actually consume the body
	let accum = [];
	let accumBytes = 0;
	let abort = false;

	return new Body.Promise(function (resolve, reject) {
		let resTimeout;

		// allow timeout on slow response body
		if (_this4.timeout) {
			resTimeout = setTimeout(function () {
				abort = true;
				reject(new FetchError(`Response timeout while trying to fetch ${_this4.url} (over ${_this4.timeout}ms)`, 'body-timeout'));
			}, _this4.timeout);
		}

		// handle stream errors
		body.on('error', function (err) {
			if (err.name === 'AbortError') {
				// if the request was aborted, reject with this Error
				abort = true;
				reject(err);
			} else {
				// other errors, such as incorrect content-encoding
				reject(new FetchError(`Invalid response body while trying to fetch ${_this4.url}: ${err.message}`, 'system', err));
			}
		});

		body.on('data', function (chunk) {
			if (abort || chunk === null) {
				return;
			}

			if (_this4.size && accumBytes + chunk.length > _this4.size) {
				abort = true;
				reject(new FetchError(`content size at ${_this4.url} over limit: ${_this4.size}`, 'max-size'));
				return;
			}

			accumBytes += chunk.length;
			accum.push(chunk);
		});

		body.on('end', function () {
			if (abort) {
				return;
			}

			clearTimeout(resTimeout);

			try {
				resolve(Buffer.concat(accum, accumBytes));
			} catch (err) {
				// handle streams that have accumulated too much data (issue #414)
				reject(new FetchError(`Could not create Buffer from response body for ${_this4.url}: ${err.message}`, 'system', err));
			}
		});
	});
}

/**
 * Detect buffer encoding and convert to target encoding
 * ref: http://www.w3.org/TR/2011/WD-html5-20110113/parsing.html#determining-the-character-encoding
 *
 * @param   Buffer  buffer    Incoming buffer
 * @param   String  encoding  Target encoding
 * @return  String
 */
function convertBody(buffer, headers) {
	if (typeof convert !== 'function') {
		throw new Error('The package `encoding` must be installed to use the textConverted() function');
	}

	const ct = headers.get('content-type');
	let charset = 'utf-8';
	let res, str;

	// header
	if (ct) {
		res = /charset=([^;]*)/i.exec(ct);
	}

	// no charset in content type, peek at response body for at most 1024 bytes
	str = buffer.slice(0, 1024).toString();

	// html5
	if (!res && str) {
		res = /<meta.+?charset=(['"])(.+?)\1/i.exec(str);
	}

	// html4
	if (!res && str) {
		res = /<meta[\s]+?http-equiv=(['"])content-type\1[\s]+?content=(['"])(.+?)\2/i.exec(str);

		if (res) {
			res = /charset=(.*)/i.exec(res.pop());
		}
	}

	// xml
	if (!res && str) {
		res = /<\?xml.+?encoding=(['"])(.+?)\1/i.exec(str);
	}

	// found charset
	if (res) {
		charset = res.pop();

		// prevent decode issues when sites use incorrect encoding
		// ref: https://hsivonen.fi/encoding-menu/
		if (charset === 'gb2312' || charset === 'gbk') {
			charset = 'gb18030';
		}
	}

	// turn raw buffers into a single utf-8 buffer
	return convert(buffer, 'UTF-8', charset).toString();
}

/**
 * Detect a URLSearchParams object
 * ref: https://github.com/bitinn/node-fetch/issues/296#issuecomment-307598143
 *
 * @param   Object  obj     Object to detect by type or brand
 * @return  String
 */
function isURLSearchParams(obj) {
	// Duck-typing as a necessary condition.
	if (typeof obj !== 'object' || typeof obj.append !== 'function' || typeof obj.delete !== 'function' || typeof obj.get !== 'function' || typeof obj.getAll !== 'function' || typeof obj.has !== 'function' || typeof obj.set !== 'function') {
		return false;
	}

	// Brand-checking and more duck-typing as optional condition.
	return obj.constructor.name === 'URLSearchParams' || Object.prototype.toString.call(obj) === '[object URLSearchParams]' || typeof obj.sort === 'function';
}

/**
 * Check if `obj` is a W3C `Blob` object (which `File` inherits from)
 * @param  {*} obj
 * @return {boolean}
 */
function isBlob(obj) {
	return typeof obj === 'object' && typeof obj.arrayBuffer === 'function' && typeof obj.type === 'string' && typeof obj.stream === 'function' && typeof obj.constructor === 'function' && typeof obj.constructor.name === 'string' && /^(Blob|File)$/.test(obj.constructor.name) && /^(Blob|File)$/.test(obj[Symbol.toStringTag]);
}

/**
 * Clone body given Res/Req instance
 *
 * @param   Mixed  instance  Response or Request instance
 * @return  Mixed
 */
function clone(instance) {
	let p1, p2;
	let body = instance.body;

	// don't allow cloning a used body
	if (instance.bodyUsed) {
		throw new Error('cannot clone body after it is used');
	}

	// check that body is a stream and not form-data object
	// note: we can't clone the form-data object without having it as a dependency
	if (body instanceof Stream && typeof body.getBoundary !== 'function') {
		// tee instance body
		p1 = new PassThrough();
		p2 = new PassThrough();
		body.pipe(p1);
		body.pipe(p2);
		// set instance body to teed body and return the other teed body
		instance[INTERNALS].body = p1;
		body = p2;
	}

	return body;
}

/**
 * Performs the operation "extract a `Content-Type` value from |object|" as
 * specified in the specification:
 * https://fetch.spec.whatwg.org/#concept-bodyinit-extract
 *
 * This function assumes that instance.body is present.
 *
 * @param   Mixed  instance  Any options.body input
 */
function extractContentType(body) {
	if (body === null) {
		// body is null
		return null;
	} else if (typeof body === 'string') {
		// body is string
		return 'text/plain;charset=UTF-8';
	} else if (isURLSearchParams(body)) {
		// body is a URLSearchParams
		return 'application/x-www-form-urlencoded;charset=UTF-8';
	} else if (isBlob(body)) {
		// body is blob
		return body.type || null;
	} else if (Buffer.isBuffer(body)) {
		// body is buffer
		return null;
	} else if (Object.prototype.toString.call(body) === '[object ArrayBuffer]') {
		// body is ArrayBuffer
		return null;
	} else if (ArrayBuffer.isView(body)) {
		// body is ArrayBufferView
		return null;
	} else if (typeof body.getBoundary === 'function') {
		// detect form data input from form-data module
		return `multipart/form-data;boundary=${body.getBoundary()}`;
	} else if (body instanceof Stream) {
		// body is stream
		// can't really do much about this
		return null;
	} else {
		// Body constructor defaults other things to string
		return 'text/plain;charset=UTF-8';
	}
}

/**
 * The Fetch Standard treats this as if "total bytes" is a property on the body.
 * For us, we have to explicitly get it with a function.
 *
 * ref: https://fetch.spec.whatwg.org/#concept-body-total-bytes
 *
 * @param   Body    instance   Instance of Body
 * @return  Number?            Number of bytes, or null if not possible
 */
function getTotalBytes(instance) {
	const body = instance.body;


	if (body === null) {
		// body is null
		return 0;
	} else if (isBlob(body)) {
		return body.size;
	} else if (Buffer.isBuffer(body)) {
		// body is buffer
		return body.length;
	} else if (body && typeof body.getLengthSync === 'function') {
		// detect form data input from form-data module
		if (body._lengthRetrievers && body._lengthRetrievers.length == 0 || // 1.x
		body.hasKnownLength && body.hasKnownLength()) {
			// 2.x
			return body.getLengthSync();
		}
		return null;
	} else {
		// body is stream
		return null;
	}
}

/**
 * Write a Body to a Node.js WritableStream (e.g. http.Request) object.
 *
 * @param   Body    instance   Instance of Body
 * @return  Void
 */
function writeToStream(dest, instance) {
	const body = instance.body;


	if (body === null) {
		// body is null
		dest.end();
	} else if (isBlob(body)) {
		body.stream().pipe(dest);
	} else if (Buffer.isBuffer(body)) {
		// body is buffer
		dest.write(body);
		dest.end();
	} else {
		// body is stream
		body.pipe(dest);
	}
}

// expose Promise
Body.Promise = global.Promise;

/**
 * headers.js
 *
 * Headers class offers convenient helpers
 */

const invalidTokenRegex = /[^\^_`a-zA-Z\-0-9!#$%&'*+.|~]/;
const invalidHeaderCharRegex = /[^\t\x20-\x7e\x80-\xff]/;

function validateName(name) {
	name = `${name}`;
	if (invalidTokenRegex.test(name) || name === '') {
		throw new TypeError(`${name} is not a legal HTTP header name`);
	}
}

function validateValue(value) {
	value = `${value}`;
	if (invalidHeaderCharRegex.test(value)) {
		throw new TypeError(`${value} is not a legal HTTP header value`);
	}
}

/**
 * Find the key in the map object given a header name.
 *
 * Returns undefined if not found.
 *
 * @param   String  name  Header name
 * @return  String|Undefined
 */
function find(map, name) {
	name = name.toLowerCase();
	for (const key in map) {
		if (key.toLowerCase() === name) {
			return key;
		}
	}
	return undefined;
}

const MAP = Symbol('map');
class Headers {
	/**
  * Headers class
  *
  * @param   Object  headers  Response headers
  * @return  Void
  */
	constructor() {
		let init = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;

		this[MAP] = Object.create(null);

		if (init instanceof Headers) {
			const rawHeaders = init.raw();
			const headerNames = Object.keys(rawHeaders);

			for (const headerName of headerNames) {
				for (const value of rawHeaders[headerName]) {
					this.append(headerName, value);
				}
			}

			return;
		}

		// We don't worry about converting prop to ByteString here as append()
		// will handle it.
		if (init == null) ; else if (typeof init === 'object') {
			const method = init[Symbol.iterator];
			if (method != null) {
				if (typeof method !== 'function') {
					throw new TypeError('Header pairs must be iterable');
				}

				// sequence<sequence<ByteString>>
				// Note: per spec we have to first exhaust the lists then process them
				const pairs = [];
				for (const pair of init) {
					if (typeof pair !== 'object' || typeof pair[Symbol.iterator] !== 'function') {
						throw new TypeError('Each header pair must be iterable');
					}
					pairs.push(Array.from(pair));
				}

				for (const pair of pairs) {
					if (pair.length !== 2) {
						throw new TypeError('Each header pair must be a name/value tuple');
					}
					this.append(pair[0], pair[1]);
				}
			} else {
				// record<ByteString, ByteString>
				for (const key of Object.keys(init)) {
					const value = init[key];
					this.append(key, value);
				}
			}
		} else {
			throw new TypeError('Provided initializer must be an object');
		}
	}

	/**
  * Return combined header value given name
  *
  * @param   String  name  Header name
  * @return  Mixed
  */
	get(name) {
		name = `${name}`;
		validateName(name);
		const key = find(this[MAP], name);
		if (key === undefined) {
			return null;
		}

		return this[MAP][key].join(', ');
	}

	/**
  * Iterate over all headers
  *
  * @param   Function  callback  Executed for each item with parameters (value, name, thisArg)
  * @param   Boolean   thisArg   `this` context for callback function
  * @return  Void
  */
	forEach(callback) {
		let thisArg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

		let pairs = getHeaders(this);
		let i = 0;
		while (i < pairs.length) {
			var _pairs$i = pairs[i];
			const name = _pairs$i[0],
			      value = _pairs$i[1];

			callback.call(thisArg, value, name, this);
			pairs = getHeaders(this);
			i++;
		}
	}

	/**
  * Overwrite header values given name
  *
  * @param   String  name   Header name
  * @param   String  value  Header value
  * @return  Void
  */
	set(name, value) {
		name = `${name}`;
		value = `${value}`;
		validateName(name);
		validateValue(value);
		const key = find(this[MAP], name);
		this[MAP][key !== undefined ? key : name] = [value];
	}

	/**
  * Append a value onto existing header
  *
  * @param   String  name   Header name
  * @param   String  value  Header value
  * @return  Void
  */
	append(name, value) {
		name = `${name}`;
		value = `${value}`;
		validateName(name);
		validateValue(value);
		const key = find(this[MAP], name);
		if (key !== undefined) {
			this[MAP][key].push(value);
		} else {
			this[MAP][name] = [value];
		}
	}

	/**
  * Check for header name existence
  *
  * @param   String   name  Header name
  * @return  Boolean
  */
	has(name) {
		name = `${name}`;
		validateName(name);
		return find(this[MAP], name) !== undefined;
	}

	/**
  * Delete all header values given name
  *
  * @param   String  name  Header name
  * @return  Void
  */
	delete(name) {
		name = `${name}`;
		validateName(name);
		const key = find(this[MAP], name);
		if (key !== undefined) {
			delete this[MAP][key];
		}
	}

	/**
  * Return raw headers (non-spec api)
  *
  * @return  Object
  */
	raw() {
		return this[MAP];
	}

	/**
  * Get an iterator on keys.
  *
  * @return  Iterator
  */
	keys() {
		return createHeadersIterator(this, 'key');
	}

	/**
  * Get an iterator on values.
  *
  * @return  Iterator
  */
	values() {
		return createHeadersIterator(this, 'value');
	}

	/**
  * Get an iterator on entries.
  *
  * This is the default iterator of the Headers object.
  *
  * @return  Iterator
  */
	[Symbol.iterator]() {
		return createHeadersIterator(this, 'key+value');
	}
}
Headers.prototype.entries = Headers.prototype[Symbol.iterator];

Object.defineProperty(Headers.prototype, Symbol.toStringTag, {
	value: 'Headers',
	writable: false,
	enumerable: false,
	configurable: true
});

Object.defineProperties(Headers.prototype, {
	get: { enumerable: true },
	forEach: { enumerable: true },
	set: { enumerable: true },
	append: { enumerable: true },
	has: { enumerable: true },
	delete: { enumerable: true },
	keys: { enumerable: true },
	values: { enumerable: true },
	entries: { enumerable: true }
});

function getHeaders(headers) {
	let kind = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'key+value';

	const keys = Object.keys(headers[MAP]).sort();
	return keys.map(kind === 'key' ? function (k) {
		return k.toLowerCase();
	} : kind === 'value' ? function (k) {
		return headers[MAP][k].join(', ');
	} : function (k) {
		return [k.toLowerCase(), headers[MAP][k].join(', ')];
	});
}

const INTERNAL = Symbol('internal');

function createHeadersIterator(target, kind) {
	const iterator = Object.create(HeadersIteratorPrototype);
	iterator[INTERNAL] = {
		target,
		kind,
		index: 0
	};
	return iterator;
}

const HeadersIteratorPrototype = Object.setPrototypeOf({
	next() {
		// istanbul ignore if
		if (!this || Object.getPrototypeOf(this) !== HeadersIteratorPrototype) {
			throw new TypeError('Value of `this` is not a HeadersIterator');
		}

		var _INTERNAL = this[INTERNAL];
		const target = _INTERNAL.target,
		      kind = _INTERNAL.kind,
		      index = _INTERNAL.index;

		const values = getHeaders(target, kind);
		const len = values.length;
		if (index >= len) {
			return {
				value: undefined,
				done: true
			};
		}

		this[INTERNAL].index = index + 1;

		return {
			value: values[index],
			done: false
		};
	}
}, Object.getPrototypeOf(Object.getPrototypeOf([][Symbol.iterator]())));

Object.defineProperty(HeadersIteratorPrototype, Symbol.toStringTag, {
	value: 'HeadersIterator',
	writable: false,
	enumerable: false,
	configurable: true
});

/**
 * Export the Headers object in a form that Node.js can consume.
 *
 * @param   Headers  headers
 * @return  Object
 */
function exportNodeCompatibleHeaders(headers) {
	const obj = Object.assign({ __proto__: null }, headers[MAP]);

	// http.request() only supports string as Host header. This hack makes
	// specifying custom Host header possible.
	const hostHeaderKey = find(headers[MAP], 'Host');
	if (hostHeaderKey !== undefined) {
		obj[hostHeaderKey] = obj[hostHeaderKey][0];
	}

	return obj;
}

/**
 * Create a Headers object from an object of headers, ignoring those that do
 * not conform to HTTP grammar productions.
 *
 * @param   Object  obj  Object of headers
 * @return  Headers
 */
function createHeadersLenient(obj) {
	const headers = new Headers();
	for (const name of Object.keys(obj)) {
		if (invalidTokenRegex.test(name)) {
			continue;
		}
		if (Array.isArray(obj[name])) {
			for (const val of obj[name]) {
				if (invalidHeaderCharRegex.test(val)) {
					continue;
				}
				if (headers[MAP][name] === undefined) {
					headers[MAP][name] = [val];
				} else {
					headers[MAP][name].push(val);
				}
			}
		} else if (!invalidHeaderCharRegex.test(obj[name])) {
			headers[MAP][name] = [obj[name]];
		}
	}
	return headers;
}

const INTERNALS$1 = Symbol('Response internals');

// fix an issue where "STATUS_CODES" aren't a named export for node <10
const STATUS_CODES = http.STATUS_CODES;

/**
 * Response class
 *
 * @param   Stream  body  Readable stream
 * @param   Object  opts  Response options
 * @return  Void
 */
class Response {
	constructor() {
		let body = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
		let opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

		Body.call(this, body, opts);

		const status = opts.status || 200;
		const headers = new Headers(opts.headers);

		if (body != null && !headers.has('Content-Type')) {
			const contentType = extractContentType(body);
			if (contentType) {
				headers.append('Content-Type', contentType);
			}
		}

		this[INTERNALS$1] = {
			url: opts.url,
			status,
			statusText: opts.statusText || STATUS_CODES[status],
			headers,
			counter: opts.counter
		};
	}

	get url() {
		return this[INTERNALS$1].url || '';
	}

	get status() {
		return this[INTERNALS$1].status;
	}

	/**
  * Convenience property representing if the request ended normally
  */
	get ok() {
		return this[INTERNALS$1].status >= 200 && this[INTERNALS$1].status < 300;
	}

	get redirected() {
		return this[INTERNALS$1].counter > 0;
	}

	get statusText() {
		return this[INTERNALS$1].statusText;
	}

	get headers() {
		return this[INTERNALS$1].headers;
	}

	/**
  * Clone this response
  *
  * @return  Response
  */
	clone() {
		return new Response(clone(this), {
			url: this.url,
			status: this.status,
			statusText: this.statusText,
			headers: this.headers,
			ok: this.ok,
			redirected: this.redirected
		});
	}
}

Body.mixIn(Response.prototype);

Object.defineProperties(Response.prototype, {
	url: { enumerable: true },
	status: { enumerable: true },
	ok: { enumerable: true },
	redirected: { enumerable: true },
	statusText: { enumerable: true },
	headers: { enumerable: true },
	clone: { enumerable: true }
});

Object.defineProperty(Response.prototype, Symbol.toStringTag, {
	value: 'Response',
	writable: false,
	enumerable: false,
	configurable: true
});

const INTERNALS$2 = Symbol('Request internals');

// fix an issue where "format", "parse" aren't a named export for node <10
const parse_url = Url.parse;
const format_url = Url.format;

const streamDestructionSupported = 'destroy' in Stream.Readable.prototype;

/**
 * Check if a value is an instance of Request.
 *
 * @param   Mixed   input
 * @return  Boolean
 */
function isRequest(input) {
	return typeof input === 'object' && typeof input[INTERNALS$2] === 'object';
}

function isAbortSignal(signal) {
	const proto = signal && typeof signal === 'object' && Object.getPrototypeOf(signal);
	return !!(proto && proto.constructor.name === 'AbortSignal');
}

/**
 * Request class
 *
 * @param   Mixed   input  Url or Request instance
 * @param   Object  init   Custom options
 * @return  Void
 */
class Request {
	constructor(input) {
		let init = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

		let parsedURL;

		// normalize input
		if (!isRequest(input)) {
			if (input && input.href) {
				// in order to support Node.js' Url objects; though WHATWG's URL objects
				// will fall into this branch also (since their `toString()` will return
				// `href` property anyway)
				parsedURL = parse_url(input.href);
			} else {
				// coerce input to a string before attempting to parse
				parsedURL = parse_url(`${input}`);
			}
			input = {};
		} else {
			parsedURL = parse_url(input.url);
		}

		let method = init.method || input.method || 'GET';
		method = method.toUpperCase();

		if ((init.body != null || isRequest(input) && input.body !== null) && (method === 'GET' || method === 'HEAD')) {
			throw new TypeError('Request with GET/HEAD method cannot have body');
		}

		let inputBody = init.body != null ? init.body : isRequest(input) && input.body !== null ? clone(input) : null;

		Body.call(this, inputBody, {
			timeout: init.timeout || input.timeout || 0,
			size: init.size || input.size || 0
		});

		const headers = new Headers(init.headers || input.headers || {});

		if (inputBody != null && !headers.has('Content-Type')) {
			const contentType = extractContentType(inputBody);
			if (contentType) {
				headers.append('Content-Type', contentType);
			}
		}

		let signal = isRequest(input) ? input.signal : null;
		if ('signal' in init) signal = init.signal;

		if (signal != null && !isAbortSignal(signal)) {
			throw new TypeError('Expected signal to be an instanceof AbortSignal');
		}

		this[INTERNALS$2] = {
			method,
			redirect: init.redirect || input.redirect || 'follow',
			headers,
			parsedURL,
			signal
		};

		// node-fetch-only options
		this.follow = init.follow !== undefined ? init.follow : input.follow !== undefined ? input.follow : 20;
		this.compress = init.compress !== undefined ? init.compress : input.compress !== undefined ? input.compress : true;
		this.counter = init.counter || input.counter || 0;
		this.agent = init.agent || input.agent;
	}

	get method() {
		return this[INTERNALS$2].method;
	}

	get url() {
		return format_url(this[INTERNALS$2].parsedURL);
	}

	get headers() {
		return this[INTERNALS$2].headers;
	}

	get redirect() {
		return this[INTERNALS$2].redirect;
	}

	get signal() {
		return this[INTERNALS$2].signal;
	}

	/**
  * Clone this request
  *
  * @return  Request
  */
	clone() {
		return new Request(this);
	}
}

Body.mixIn(Request.prototype);

Object.defineProperty(Request.prototype, Symbol.toStringTag, {
	value: 'Request',
	writable: false,
	enumerable: false,
	configurable: true
});

Object.defineProperties(Request.prototype, {
	method: { enumerable: true },
	url: { enumerable: true },
	headers: { enumerable: true },
	redirect: { enumerable: true },
	clone: { enumerable: true },
	signal: { enumerable: true }
});

/**
 * Convert a Request to Node.js http request options.
 *
 * @param   Request  A Request instance
 * @return  Object   The options object to be passed to http.request
 */
function getNodeRequestOptions(request) {
	const parsedURL = request[INTERNALS$2].parsedURL;
	const headers = new Headers(request[INTERNALS$2].headers);

	// fetch step 1.3
	if (!headers.has('Accept')) {
		headers.set('Accept', '*/*');
	}

	// Basic fetch
	if (!parsedURL.protocol || !parsedURL.hostname) {
		throw new TypeError('Only absolute URLs are supported');
	}

	if (!/^https?:$/.test(parsedURL.protocol)) {
		throw new TypeError('Only HTTP(S) protocols are supported');
	}

	if (request.signal && request.body instanceof Stream.Readable && !streamDestructionSupported) {
		throw new Error('Cancellation of streamed requests with AbortSignal is not supported in node < 8');
	}

	// HTTP-network-or-cache fetch steps 2.4-2.7
	let contentLengthValue = null;
	if (request.body == null && /^(POST|PUT)$/i.test(request.method)) {
		contentLengthValue = '0';
	}
	if (request.body != null) {
		const totalBytes = getTotalBytes(request);
		if (typeof totalBytes === 'number') {
			contentLengthValue = String(totalBytes);
		}
	}
	if (contentLengthValue) {
		headers.set('Content-Length', contentLengthValue);
	}

	// HTTP-network-or-cache fetch step 2.11
	if (!headers.has('User-Agent')) {
		headers.set('User-Agent', 'node-fetch/1.0 (+https://github.com/bitinn/node-fetch)');
	}

	// HTTP-network-or-cache fetch step 2.15
	if (request.compress && !headers.has('Accept-Encoding')) {
		headers.set('Accept-Encoding', 'gzip,deflate');
	}

	let agent = request.agent;
	if (typeof agent === 'function') {
		agent = agent(parsedURL);
	}

	if (!headers.has('Connection') && !agent) {
		headers.set('Connection', 'close');
	}

	// HTTP-network fetch step 4.2
	// chunked encoding is handled by Node.js

	return Object.assign({}, parsedURL, {
		method: request.method,
		headers: exportNodeCompatibleHeaders(headers),
		agent
	});
}

/**
 * abort-error.js
 *
 * AbortError interface for cancelled requests
 */

/**
 * Create AbortError instance
 *
 * @param   String      message      Error message for human
 * @return  AbortError
 */
function AbortError(message) {
  Error.call(this, message);

  this.type = 'aborted';
  this.message = message;

  // hide custom error implementation details from end-users
  Error.captureStackTrace(this, this.constructor);
}

AbortError.prototype = Object.create(Error.prototype);
AbortError.prototype.constructor = AbortError;
AbortError.prototype.name = 'AbortError';

// fix an issue where "PassThrough", "resolve" aren't a named export for node <10
const PassThrough$1 = Stream.PassThrough;
const resolve_url = Url.resolve;

/**
 * Fetch function
 *
 * @param   Mixed    url   Absolute url or Request instance
 * @param   Object   opts  Fetch options
 * @return  Promise
 */
function fetch$1(url, opts) {

	// allow custom promise
	if (!fetch$1.Promise) {
		throw new Error('native promise missing, set fetch.Promise to your favorite alternative');
	}

	Body.Promise = fetch$1.Promise;

	// wrap http.request into fetch
	return new fetch$1.Promise(function (resolve, reject) {
		// build request object
		const request = new Request(url, opts);
		const options = getNodeRequestOptions(request);

		const send = (options.protocol === 'https:' ? https : http).request;
		const signal = request.signal;

		let response = null;

		const abort = function abort() {
			let error = new AbortError('The user aborted a request.');
			reject(error);
			if (request.body && request.body instanceof Stream.Readable) {
				request.body.destroy(error);
			}
			if (!response || !response.body) return;
			response.body.emit('error', error);
		};

		if (signal && signal.aborted) {
			abort();
			return;
		}

		const abortAndFinalize = function abortAndFinalize() {
			abort();
			finalize();
		};

		// send request
		const req = send(options);
		let reqTimeout;

		if (signal) {
			signal.addEventListener('abort', abortAndFinalize);
		}

		function finalize() {
			req.abort();
			if (signal) signal.removeEventListener('abort', abortAndFinalize);
			clearTimeout(reqTimeout);
		}

		if (request.timeout) {
			req.once('socket', function (socket) {
				reqTimeout = setTimeout(function () {
					reject(new FetchError(`network timeout at: ${request.url}`, 'request-timeout'));
					finalize();
				}, request.timeout);
			});
		}

		req.on('error', function (err) {
			reject(new FetchError(`request to ${request.url} failed, reason: ${err.message}`, 'system', err));
			finalize();
		});

		req.on('response', function (res) {
			clearTimeout(reqTimeout);

			const headers = createHeadersLenient(res.headers);

			// HTTP fetch step 5
			if (fetch$1.isRedirect(res.statusCode)) {
				// HTTP fetch step 5.2
				const location = headers.get('Location');

				// HTTP fetch step 5.3
				const locationURL = location === null ? null : resolve_url(request.url, location);

				// HTTP fetch step 5.5
				switch (request.redirect) {
					case 'error':
						reject(new FetchError(`redirect mode is set to error: ${request.url}`, 'no-redirect'));
						finalize();
						return;
					case 'manual':
						// node-fetch-specific step: make manual redirect a bit easier to use by setting the Location header value to the resolved URL.
						if (locationURL !== null) {
							// handle corrupted header
							try {
								headers.set('Location', locationURL);
							} catch (err) {
								// istanbul ignore next: nodejs server prevent invalid response headers, we can't test this through normal request
								reject(err);
							}
						}
						break;
					case 'follow':
						// HTTP-redirect fetch step 2
						if (locationURL === null) {
							break;
						}

						// HTTP-redirect fetch step 5
						if (request.counter >= request.follow) {
							reject(new FetchError(`maximum redirect reached at: ${request.url}`, 'max-redirect'));
							finalize();
							return;
						}

						// HTTP-redirect fetch step 6 (counter increment)
						// Create a new Request object.
						const requestOpts = {
							headers: new Headers(request.headers),
							follow: request.follow,
							counter: request.counter + 1,
							agent: request.agent,
							compress: request.compress,
							method: request.method,
							body: request.body,
							signal: request.signal,
							timeout: request.timeout
						};

						// HTTP-redirect fetch step 9
						if (res.statusCode !== 303 && request.body && getTotalBytes(request) === null) {
							reject(new FetchError('Cannot follow redirect with body being a readable stream', 'unsupported-redirect'));
							finalize();
							return;
						}

						// HTTP-redirect fetch step 11
						if (res.statusCode === 303 || (res.statusCode === 301 || res.statusCode === 302) && request.method === 'POST') {
							requestOpts.method = 'GET';
							requestOpts.body = undefined;
							requestOpts.headers.delete('content-length');
						}

						// HTTP-redirect fetch step 15
						resolve(fetch$1(new Request(locationURL, requestOpts)));
						finalize();
						return;
				}
			}

			// prepare response
			res.once('end', function () {
				if (signal) signal.removeEventListener('abort', abortAndFinalize);
			});
			let body = res.pipe(new PassThrough$1());

			const response_options = {
				url: request.url,
				status: res.statusCode,
				statusText: res.statusMessage,
				headers: headers,
				size: request.size,
				timeout: request.timeout,
				counter: request.counter
			};

			// HTTP-network fetch step 12.1.1.3
			const codings = headers.get('Content-Encoding');

			// HTTP-network fetch step 12.1.1.4: handle content codings

			// in following scenarios we ignore compression support
			// 1. compression support is disabled
			// 2. HEAD request
			// 3. no Content-Encoding header
			// 4. no content response (204)
			// 5. content not modified response (304)
			if (!request.compress || request.method === 'HEAD' || codings === null || res.statusCode === 204 || res.statusCode === 304) {
				response = new Response(body, response_options);
				resolve(response);
				return;
			}

			// For Node v6+
			// Be less strict when decoding compressed responses, since sometimes
			// servers send slightly invalid responses that are still accepted
			// by common browsers.
			// Always using Z_SYNC_FLUSH is what cURL does.
			const zlibOptions = {
				flush: zlib.Z_SYNC_FLUSH,
				finishFlush: zlib.Z_SYNC_FLUSH
			};

			// for gzip
			if (codings == 'gzip' || codings == 'x-gzip') {
				body = body.pipe(zlib.createGunzip(zlibOptions));
				response = new Response(body, response_options);
				resolve(response);
				return;
			}

			// for deflate
			if (codings == 'deflate' || codings == 'x-deflate') {
				// handle the infamous raw deflate response from old servers
				// a hack for old IIS and Apache servers
				const raw = res.pipe(new PassThrough$1());
				raw.once('data', function (chunk) {
					// see http://stackoverflow.com/questions/37519828
					if ((chunk[0] & 0x0F) === 0x08) {
						body = body.pipe(zlib.createInflate());
					} else {
						body = body.pipe(zlib.createInflateRaw());
					}
					response = new Response(body, response_options);
					resolve(response);
				});
				return;
			}

			// for br
			if (codings == 'br' && typeof zlib.createBrotliDecompress === 'function') {
				body = body.pipe(zlib.createBrotliDecompress());
				response = new Response(body, response_options);
				resolve(response);
				return;
			}

			// otherwise, use response as-is
			response = new Response(body, response_options);
			resolve(response);
		});

		writeToStream(req, request);
	});
}
/**
 * Redirect code matching
 *
 * @param   Number   code  Status code
 * @return  Boolean
 */
fetch$1.isRedirect = function (code) {
	return code === 301 || code === 302 || code === 303 || code === 307 || code === 308;
};

// expose Promise
fetch$1.Promise = global.Promise;

function get_page_handler(
	manifest,
	session_getter
) {
	const get_build_info =  (assets => () => assets)(JSON.parse(fs.readFileSync(path.join(build_dir, 'build.json'), 'utf-8')));

	const template =  (str => () => str)(read_template(build_dir));

	const has_service_worker = fs.existsSync(path.join(build_dir, 'service-worker.js'));

	const { server_routes, pages } = manifest;
	const error_route = manifest.error;

	function bail(req, res, err) {
		console.error(err);

		const message =  'Internal server error';

		res.statusCode = 500;
		res.end(`<pre>${message}</pre>`);
	}

	function handle_error(req, res, statusCode, error) {
		handle_page({
			pattern: null,
			parts: [
				{ name: null, component: error_route }
			]
		}, req, res, statusCode, error || new Error('Unknown error in preload function'));
	}

	async function handle_page(page, req, res, status = 200, error = null) {
		const is_service_worker_index = req.path === '/service-worker-index.html';
		const build_info




 = get_build_info();

		res.setHeader('Content-Type', 'text/html');
		res.setHeader('Cache-Control',  'max-age=600');

		// preload main.js and current route
		// TODO detect other stuff we can preload? images, CSS, fonts?
		let preloaded_chunks = Array.isArray(build_info.assets.main) ? build_info.assets.main : [build_info.assets.main];
		if (!error && !is_service_worker_index) {
			page.parts.forEach(part => {
				if (!part) return;

				// using concat because it could be a string or an array. thanks webpack!
				preloaded_chunks = preloaded_chunks.concat(build_info.assets[part.name]);
			});
		}

		if (build_info.bundler === 'rollup') {
			// TODO add dependencies and CSS
			const link = preloaded_chunks
				.filter(file => file && !file.match(/\.map$/))
				.map(file => `<${req.baseUrl}/client/${file}>;rel="modulepreload"`)
				.join(', ');

			res.setHeader('Link', link);
		} else {
			const link = preloaded_chunks
				.filter(file => file && !file.match(/\.map$/))
				.map((file) => {
					const as = /\.css$/.test(file) ? 'style' : 'script';
					return `<${req.baseUrl}/client/${file}>;rel="preload";as="${as}"`;
				})
				.join(', ');

			res.setHeader('Link', link);
		}

		const session = session_getter(req, res);

		let redirect;
		let preload_error;

		const preload_context = {
			redirect: (statusCode, location) => {
				if (redirect && (redirect.statusCode !== statusCode || redirect.location !== location)) {
					throw new Error(`Conflicting redirects`);
				}
				location = location.replace(/^\//g, ''); // leading slash (only)
				redirect = { statusCode, location };
			},
			error: (statusCode, message) => {
				preload_error = { statusCode, message };
			},
			fetch: (url, opts) => {
				const parsed = new Url.URL(url, `http://127.0.0.1:${process.env.PORT}${req.baseUrl ? req.baseUrl + '/' :''}`);

				if (opts) {
					opts = Object.assign({}, opts);

					const include_cookies = (
						opts.credentials === 'include' ||
						opts.credentials === 'same-origin' && parsed.origin === `http://127.0.0.1:${process.env.PORT}`
					);

					if (include_cookies) {
						opts.headers = Object.assign({}, opts.headers);

						const cookies = Object.assign(
							{},
							cookie.parse(req.headers.cookie || ''),
							cookie.parse(opts.headers.cookie || '')
						);

						const set_cookie = res.getHeader('Set-Cookie');
						(Array.isArray(set_cookie) ? set_cookie : [set_cookie]).forEach(str => {
							const match = /([^=]+)=([^;]+)/.exec(str);
							if (match) cookies[match[1]] = match[2];
						});

						const str = Object.keys(cookies)
							.map(key => `${key}=${cookies[key]}`)
							.join('; ');

						opts.headers.cookie = str;
					}
				}

				return fetch$1(parsed.href, opts);
			}
		};

		let preloaded;
		let match;
		let params;

		try {
			const root_preloaded = manifest.root_preload
				? manifest.root_preload.call(preload_context, {
					path: req.path,
					query: req.query,
					params: {}
				}, session)
				: {};

			match = error ? null : page.pattern.exec(req.path);


			let toPreload = [root_preloaded];
			if (!is_service_worker_index) {
				toPreload = toPreload.concat(page.parts.map(part => {
					if (!part) return null;

					// the deepest level is used below, to initialise the store
					params = part.params ? part.params(match) : {};

					return part.preload
						? part.preload.call(preload_context, {
							path: req.path,
							query: req.query,
							params
						}, session)
						: {};
				}));
			}

			preloaded = await Promise.all(toPreload);
		} catch (err) {
			if (error) {
				return bail(req, res, err)
			}

			preload_error = { statusCode: 500, message: err };
			preloaded = []; // appease TypeScript
		}

		try {
			if (redirect) {
				const location = Url.resolve((req.baseUrl || '') + '/', redirect.location);

				res.statusCode = redirect.statusCode;
				res.setHeader('Location', location);
				res.end();

				return;
			}

			if (preload_error) {
				handle_error(req, res, preload_error.statusCode, preload_error.message);
				return;
			}

			const segments = req.path.split('/').filter(Boolean);

			// TODO make this less confusing
			const layout_segments = [segments[0]];
			let l = 1;

			page.parts.forEach((part, i) => {
				layout_segments[l] = segments[i + 1];
				if (!part) return null;
				l++;
			});

			const props = {
				stores: {
					page: {
						subscribe: writable({
							path: req.path,
							query: req.query,
							params
						}).subscribe
					},
					preloading: {
						subscribe: writable(null).subscribe
					},
					session: writable(session)
				},
				segments: layout_segments,
				status: error ? status : 200,
				error: error ? error instanceof Error ? error : { message: error } : null,
				level0: {
					props: preloaded[0]
				},
				level1: {
					segment: segments[0],
					props: {}
				}
			};

			if (!is_service_worker_index) {
				let l = 1;
				for (let i = 0; i < page.parts.length; i += 1) {
					const part = page.parts[i];
					if (!part) continue;

					props[`level${l++}`] = {
						component: part.component,
						props: preloaded[i + 1] || {},
						segment: segments[i]
					};
				}
			}

			const { html, head, css } = App.render(props);

			const serialized = {
				preloaded: `[${preloaded.map(data => try_serialize(data)).join(',')}]`,
				session: session && try_serialize(session, err => {
					throw new Error(`Failed to serialize session data: ${err.message}`);
				}),
				error: error && try_serialize(props.error)
			};

			let script = `__SAPPER__={${[
				error && `error:${serialized.error},status:${status}`,
				`baseUrl:"${req.baseUrl}"`,
				serialized.preloaded && `preloaded:${serialized.preloaded}`,
				serialized.session && `session:${serialized.session}`
			].filter(Boolean).join(',')}};`;

			if (has_service_worker) {
				script += `if('serviceWorker' in navigator)navigator.serviceWorker.register('${req.baseUrl}/service-worker.js');`;
			}

			const file = [].concat(build_info.assets.main).filter(file => file && /\.js$/.test(file))[0];
			const main = `${req.baseUrl}/client/${file}`;

			if (build_info.bundler === 'rollup') {
				if (build_info.legacy_assets) {
					const legacy_main = `${req.baseUrl}/client/legacy/${build_info.legacy_assets.main}`;
					script += `(function(){try{eval("async function x(){}");var main="${main}"}catch(e){main="${legacy_main}"};var s=document.createElement("script");try{new Function("if(0)import('')")();s.src=main;s.type="module";s.crossOrigin="use-credentials";}catch(e){s.src="${req.baseUrl}/client/shimport@${build_info.shimport}.js";s.setAttribute("data-main",main);}document.head.appendChild(s);}());`;
				} else {
					script += `var s=document.createElement("script");try{new Function("if(0)import('')")();s.src="${main}";s.type="module";s.crossOrigin="use-credentials";}catch(e){s.src="${req.baseUrl}/client/shimport@${build_info.shimport}.js";s.setAttribute("data-main","${main}")}document.head.appendChild(s)`;
				}
			} else {
				script += `</script><script src="${main}">`;
			}

			let styles;

			// TODO make this consistent across apps
			// TODO embed build_info in placeholder.ts
			if (build_info.css && build_info.css.main) {
				const css_chunks = new Set();
				if (build_info.css.main) css_chunks.add(build_info.css.main);
				page.parts.forEach(part => {
					if (!part) return;
					const css_chunks_for_part = build_info.css.chunks[part.file];

					if (css_chunks_for_part) {
						css_chunks_for_part.forEach(file => {
							css_chunks.add(file);
						});
					}
				});

				styles = Array.from(css_chunks)
					.map(href => `<link rel="stylesheet" href="client/${href}">`)
					.join('');
			} else {
				styles = (css && css.code ? `<style>${css.code}</style>` : '');
			}

			// users can set a CSP nonce using res.locals.nonce
			const nonce_attr = (res.locals && res.locals.nonce) ? ` nonce="${res.locals.nonce}"` : '';

			const body = template()
				.replace('%sapper.base%', () => `<base href="${req.baseUrl}/">`)
				.replace('%sapper.scripts%', () => `<script${nonce_attr}>${script}</script>`)
				.replace('%sapper.html%', () => html)
				.replace('%sapper.head%', () => `<noscript id='sapper-head-start'></noscript>${head}<noscript id='sapper-head-end'></noscript>`)
				.replace('%sapper.styles%', () => styles);

			res.statusCode = status;
			res.end(body);
		} catch(err) {
			if (error) {
				bail(req, res, err);
			} else {
				handle_error(req, res, 500, err);
			}
		}
	}

	return function find_route(req, res, next) {
		if (req.path === '/service-worker-index.html') {
			const homePage = pages.find(page => page.pattern.test('/'));
			handle_page(homePage, req, res);
			return;
		}

		for (const page of pages) {
			if (page.pattern.test(req.path)) {
				handle_page(page, req, res);
				return;
			}
		}

		handle_error(req, res, 404, 'Not found');
	};
}

function read_template(dir = build_dir) {
	return fs.readFileSync(`${dir}/template.html`, 'utf-8');
}

function try_serialize(data, fail) {
	try {
		return devalue(data);
	} catch (err) {
		if (fail) fail(err);
		return null;
	}
}

var mime_raw = "application/andrew-inset\t\t\tez\napplication/applixware\t\t\t\taw\napplication/atom+xml\t\t\t\tatom\napplication/atomcat+xml\t\t\t\tatomcat\napplication/atomsvc+xml\t\t\t\tatomsvc\napplication/ccxml+xml\t\t\t\tccxml\napplication/cdmi-capability\t\t\tcdmia\napplication/cdmi-container\t\t\tcdmic\napplication/cdmi-domain\t\t\t\tcdmid\napplication/cdmi-object\t\t\t\tcdmio\napplication/cdmi-queue\t\t\t\tcdmiq\napplication/cu-seeme\t\t\t\tcu\napplication/davmount+xml\t\t\tdavmount\napplication/docbook+xml\t\t\t\tdbk\napplication/dssc+der\t\t\t\tdssc\napplication/dssc+xml\t\t\t\txdssc\napplication/ecmascript\t\t\t\tecma\napplication/emma+xml\t\t\t\temma\napplication/epub+zip\t\t\t\tepub\napplication/exi\t\t\t\t\texi\napplication/font-tdpfr\t\t\t\tpfr\napplication/gml+xml\t\t\t\tgml\napplication/gpx+xml\t\t\t\tgpx\napplication/gxf\t\t\t\t\tgxf\napplication/hyperstudio\t\t\t\tstk\napplication/inkml+xml\t\t\t\tink inkml\napplication/ipfix\t\t\t\tipfix\napplication/java-archive\t\t\tjar\napplication/java-serialized-object\t\tser\napplication/java-vm\t\t\t\tclass\napplication/javascript\t\t\t\tjs\napplication/json\t\t\t\tjson map\napplication/jsonml+json\t\t\t\tjsonml\napplication/lost+xml\t\t\t\tlostxml\napplication/mac-binhex40\t\t\thqx\napplication/mac-compactpro\t\t\tcpt\napplication/mads+xml\t\t\t\tmads\napplication/marc\t\t\t\tmrc\napplication/marcxml+xml\t\t\t\tmrcx\napplication/mathematica\t\t\t\tma nb mb\napplication/mathml+xml\t\t\t\tmathml\napplication/mbox\t\t\t\tmbox\napplication/mediaservercontrol+xml\t\tmscml\napplication/metalink+xml\t\t\tmetalink\napplication/metalink4+xml\t\t\tmeta4\napplication/mets+xml\t\t\t\tmets\napplication/mods+xml\t\t\t\tmods\napplication/mp21\t\t\t\tm21 mp21\napplication/mp4\t\t\t\t\tmp4s\napplication/msword\t\t\t\tdoc dot\napplication/mxf\t\t\t\t\tmxf\napplication/octet-stream\tbin dms lrf mar so dist distz pkg bpk dump elc deploy\napplication/oda\t\t\t\t\toda\napplication/oebps-package+xml\t\t\topf\napplication/ogg\t\t\t\t\togx\napplication/omdoc+xml\t\t\t\tomdoc\napplication/onenote\t\t\t\tonetoc onetoc2 onetmp onepkg\napplication/oxps\t\t\t\toxps\napplication/patch-ops-error+xml\t\t\txer\napplication/pdf\t\t\t\t\tpdf\napplication/pgp-encrypted\t\t\tpgp\napplication/pgp-signature\t\t\tasc sig\napplication/pics-rules\t\t\t\tprf\napplication/pkcs10\t\t\t\tp10\napplication/pkcs7-mime\t\t\t\tp7m p7c\napplication/pkcs7-signature\t\t\tp7s\napplication/pkcs8\t\t\t\tp8\napplication/pkix-attr-cert\t\t\tac\napplication/pkix-cert\t\t\t\tcer\napplication/pkix-crl\t\t\t\tcrl\napplication/pkix-pkipath\t\t\tpkipath\napplication/pkixcmp\t\t\t\tpki\napplication/pls+xml\t\t\t\tpls\napplication/postscript\t\t\t\tai eps ps\napplication/prs.cww\t\t\t\tcww\napplication/pskc+xml\t\t\t\tpskcxml\napplication/rdf+xml\t\t\t\trdf\napplication/reginfo+xml\t\t\t\trif\napplication/relax-ng-compact-syntax\t\trnc\napplication/resource-lists+xml\t\t\trl\napplication/resource-lists-diff+xml\t\trld\napplication/rls-services+xml\t\t\trs\napplication/rpki-ghostbusters\t\t\tgbr\napplication/rpki-manifest\t\t\tmft\napplication/rpki-roa\t\t\t\troa\napplication/rsd+xml\t\t\t\trsd\napplication/rss+xml\t\t\t\trss\napplication/rtf\t\t\t\t\trtf\napplication/sbml+xml\t\t\t\tsbml\napplication/scvp-cv-request\t\t\tscq\napplication/scvp-cv-response\t\t\tscs\napplication/scvp-vp-request\t\t\tspq\napplication/scvp-vp-response\t\t\tspp\napplication/sdp\t\t\t\t\tsdp\napplication/set-payment-initiation\t\tsetpay\napplication/set-registration-initiation\t\tsetreg\napplication/shf+xml\t\t\t\tshf\napplication/smil+xml\t\t\t\tsmi smil\napplication/sparql-query\t\t\trq\napplication/sparql-results+xml\t\t\tsrx\napplication/srgs\t\t\t\tgram\napplication/srgs+xml\t\t\t\tgrxml\napplication/sru+xml\t\t\t\tsru\napplication/ssdl+xml\t\t\t\tssdl\napplication/ssml+xml\t\t\t\tssml\napplication/tei+xml\t\t\t\ttei teicorpus\napplication/thraud+xml\t\t\t\ttfi\napplication/timestamped-data\t\t\ttsd\napplication/vnd.3gpp.pic-bw-large\t\tplb\napplication/vnd.3gpp.pic-bw-small\t\tpsb\napplication/vnd.3gpp.pic-bw-var\t\t\tpvb\napplication/vnd.3gpp2.tcap\t\t\ttcap\napplication/vnd.3m.post-it-notes\t\tpwn\napplication/vnd.accpac.simply.aso\t\taso\napplication/vnd.accpac.simply.imp\t\timp\napplication/vnd.acucobol\t\t\tacu\napplication/vnd.acucorp\t\t\t\tatc acutc\napplication/vnd.adobe.air-application-installer-package+zip\tair\napplication/vnd.adobe.formscentral.fcdt\t\tfcdt\napplication/vnd.adobe.fxp\t\t\tfxp fxpl\napplication/vnd.adobe.xdp+xml\t\t\txdp\napplication/vnd.adobe.xfdf\t\t\txfdf\napplication/vnd.ahead.space\t\t\tahead\napplication/vnd.airzip.filesecure.azf\t\tazf\napplication/vnd.airzip.filesecure.azs\t\tazs\napplication/vnd.amazon.ebook\t\t\tazw\napplication/vnd.americandynamics.acc\t\tacc\napplication/vnd.amiga.ami\t\t\tami\napplication/vnd.android.package-archive\t\tapk\napplication/vnd.anser-web-certificate-issue-initiation\tcii\napplication/vnd.anser-web-funds-transfer-initiation\tfti\napplication/vnd.antix.game-component\t\tatx\napplication/vnd.apple.installer+xml\t\tmpkg\napplication/vnd.apple.mpegurl\t\t\tm3u8\napplication/vnd.aristanetworks.swi\t\tswi\napplication/vnd.astraea-software.iota\t\tiota\napplication/vnd.audiograph\t\t\taep\napplication/vnd.blueice.multipass\t\tmpm\napplication/vnd.bmi\t\t\t\tbmi\napplication/vnd.businessobjects\t\t\trep\napplication/vnd.chemdraw+xml\t\t\tcdxml\napplication/vnd.chipnuts.karaoke-mmd\t\tmmd\napplication/vnd.cinderella\t\t\tcdy\napplication/vnd.claymore\t\t\tcla\napplication/vnd.cloanto.rp9\t\t\trp9\napplication/vnd.clonk.c4group\t\t\tc4g c4d c4f c4p c4u\napplication/vnd.cluetrust.cartomobile-config\t\tc11amc\napplication/vnd.cluetrust.cartomobile-config-pkg\tc11amz\napplication/vnd.commonspace\t\t\tcsp\napplication/vnd.contact.cmsg\t\t\tcdbcmsg\napplication/vnd.cosmocaller\t\t\tcmc\napplication/vnd.crick.clicker\t\t\tclkx\napplication/vnd.crick.clicker.keyboard\t\tclkk\napplication/vnd.crick.clicker.palette\t\tclkp\napplication/vnd.crick.clicker.template\t\tclkt\napplication/vnd.crick.clicker.wordbank\t\tclkw\napplication/vnd.criticaltools.wbs+xml\t\twbs\napplication/vnd.ctc-posml\t\t\tpml\napplication/vnd.cups-ppd\t\t\tppd\napplication/vnd.curl.car\t\t\tcar\napplication/vnd.curl.pcurl\t\t\tpcurl\napplication/vnd.dart\t\t\t\tdart\napplication/vnd.data-vision.rdz\t\t\trdz\napplication/vnd.dece.data\t\t\tuvf uvvf uvd uvvd\napplication/vnd.dece.ttml+xml\t\t\tuvt uvvt\napplication/vnd.dece.unspecified\t\tuvx uvvx\napplication/vnd.dece.zip\t\t\tuvz uvvz\napplication/vnd.denovo.fcselayout-link\t\tfe_launch\napplication/vnd.dna\t\t\t\tdna\napplication/vnd.dolby.mlp\t\t\tmlp\napplication/vnd.dpgraph\t\t\t\tdpg\napplication/vnd.dreamfactory\t\t\tdfac\napplication/vnd.ds-keypoint\t\t\tkpxx\napplication/vnd.dvb.ait\t\t\t\tait\napplication/vnd.dvb.service\t\t\tsvc\napplication/vnd.dynageo\t\t\t\tgeo\napplication/vnd.ecowin.chart\t\t\tmag\napplication/vnd.enliven\t\t\t\tnml\napplication/vnd.epson.esf\t\t\tesf\napplication/vnd.epson.msf\t\t\tmsf\napplication/vnd.epson.quickanime\t\tqam\napplication/vnd.epson.salt\t\t\tslt\napplication/vnd.epson.ssf\t\t\tssf\napplication/vnd.eszigno3+xml\t\t\tes3 et3\napplication/vnd.ezpix-album\t\t\tez2\napplication/vnd.ezpix-package\t\t\tez3\napplication/vnd.fdf\t\t\t\tfdf\napplication/vnd.fdsn.mseed\t\t\tmseed\napplication/vnd.fdsn.seed\t\t\tseed dataless\napplication/vnd.flographit\t\t\tgph\napplication/vnd.fluxtime.clip\t\t\tftc\napplication/vnd.framemaker\t\t\tfm frame maker book\napplication/vnd.frogans.fnc\t\t\tfnc\napplication/vnd.frogans.ltf\t\t\tltf\napplication/vnd.fsc.weblaunch\t\t\tfsc\napplication/vnd.fujitsu.oasys\t\t\toas\napplication/vnd.fujitsu.oasys2\t\t\toa2\napplication/vnd.fujitsu.oasys3\t\t\toa3\napplication/vnd.fujitsu.oasysgp\t\t\tfg5\napplication/vnd.fujitsu.oasysprs\t\tbh2\napplication/vnd.fujixerox.ddd\t\t\tddd\napplication/vnd.fujixerox.docuworks\t\txdw\napplication/vnd.fujixerox.docuworks.binder\txbd\napplication/vnd.fuzzysheet\t\t\tfzs\napplication/vnd.genomatix.tuxedo\t\ttxd\napplication/vnd.geogebra.file\t\t\tggb\napplication/vnd.geogebra.tool\t\t\tggt\napplication/vnd.geometry-explorer\t\tgex gre\napplication/vnd.geonext\t\t\t\tgxt\napplication/vnd.geoplan\t\t\t\tg2w\napplication/vnd.geospace\t\t\tg3w\napplication/vnd.gmx\t\t\t\tgmx\napplication/vnd.google-earth.kml+xml\t\tkml\napplication/vnd.google-earth.kmz\t\tkmz\napplication/vnd.grafeq\t\t\t\tgqf gqs\napplication/vnd.groove-account\t\t\tgac\napplication/vnd.groove-help\t\t\tghf\napplication/vnd.groove-identity-message\t\tgim\napplication/vnd.groove-injector\t\t\tgrv\napplication/vnd.groove-tool-message\t\tgtm\napplication/vnd.groove-tool-template\t\ttpl\napplication/vnd.groove-vcard\t\t\tvcg\napplication/vnd.hal+xml\t\t\t\thal\napplication/vnd.handheld-entertainment+xml\tzmm\napplication/vnd.hbci\t\t\t\thbci\napplication/vnd.hhe.lesson-player\t\tles\napplication/vnd.hp-hpgl\t\t\t\thpgl\napplication/vnd.hp-hpid\t\t\t\thpid\napplication/vnd.hp-hps\t\t\t\thps\napplication/vnd.hp-jlyt\t\t\t\tjlt\napplication/vnd.hp-pcl\t\t\t\tpcl\napplication/vnd.hp-pclxl\t\t\tpclxl\napplication/vnd.hydrostatix.sof-data\t\tsfd-hdstx\napplication/vnd.ibm.minipay\t\t\tmpy\napplication/vnd.ibm.modcap\t\t\tafp listafp list3820\napplication/vnd.ibm.rights-management\t\tirm\napplication/vnd.ibm.secure-container\t\tsc\napplication/vnd.iccprofile\t\t\ticc icm\napplication/vnd.igloader\t\t\tigl\napplication/vnd.immervision-ivp\t\t\tivp\napplication/vnd.immervision-ivu\t\t\tivu\napplication/vnd.insors.igm\t\t\tigm\napplication/vnd.intercon.formnet\t\txpw xpx\napplication/vnd.intergeo\t\t\ti2g\napplication/vnd.intu.qbo\t\t\tqbo\napplication/vnd.intu.qfx\t\t\tqfx\napplication/vnd.ipunplugged.rcprofile\t\trcprofile\napplication/vnd.irepository.package+xml\t\tirp\napplication/vnd.is-xpr\t\t\t\txpr\napplication/vnd.isac.fcs\t\t\tfcs\napplication/vnd.jam\t\t\t\tjam\napplication/vnd.jcp.javame.midlet-rms\t\trms\napplication/vnd.jisp\t\t\t\tjisp\napplication/vnd.joost.joda-archive\t\tjoda\napplication/vnd.kahootz\t\t\t\tktz ktr\napplication/vnd.kde.karbon\t\t\tkarbon\napplication/vnd.kde.kchart\t\t\tchrt\napplication/vnd.kde.kformula\t\t\tkfo\napplication/vnd.kde.kivio\t\t\tflw\napplication/vnd.kde.kontour\t\t\tkon\napplication/vnd.kde.kpresenter\t\t\tkpr kpt\napplication/vnd.kde.kspread\t\t\tksp\napplication/vnd.kde.kword\t\t\tkwd kwt\napplication/vnd.kenameaapp\t\t\thtke\napplication/vnd.kidspiration\t\t\tkia\napplication/vnd.kinar\t\t\t\tkne knp\napplication/vnd.koan\t\t\t\tskp skd skt skm\napplication/vnd.kodak-descriptor\t\tsse\napplication/vnd.las.las+xml\t\t\tlasxml\napplication/vnd.llamagraphics.life-balance.desktop\tlbd\napplication/vnd.llamagraphics.life-balance.exchange+xml\tlbe\napplication/vnd.lotus-1-2-3\t\t\t123\napplication/vnd.lotus-approach\t\t\tapr\napplication/vnd.lotus-freelance\t\t\tpre\napplication/vnd.lotus-notes\t\t\tnsf\napplication/vnd.lotus-organizer\t\t\torg\napplication/vnd.lotus-screencam\t\t\tscm\napplication/vnd.lotus-wordpro\t\t\tlwp\napplication/vnd.macports.portpkg\t\tportpkg\napplication/vnd.mcd\t\t\t\tmcd\napplication/vnd.medcalcdata\t\t\tmc1\napplication/vnd.mediastation.cdkey\t\tcdkey\napplication/vnd.mfer\t\t\t\tmwf\napplication/vnd.mfmp\t\t\t\tmfm\napplication/vnd.micrografx.flo\t\t\tflo\napplication/vnd.micrografx.igx\t\t\tigx\napplication/vnd.mif\t\t\t\tmif\napplication/vnd.mobius.daf\t\t\tdaf\napplication/vnd.mobius.dis\t\t\tdis\napplication/vnd.mobius.mbk\t\t\tmbk\napplication/vnd.mobius.mqy\t\t\tmqy\napplication/vnd.mobius.msl\t\t\tmsl\napplication/vnd.mobius.plc\t\t\tplc\napplication/vnd.mobius.txf\t\t\ttxf\napplication/vnd.mophun.application\t\tmpn\napplication/vnd.mophun.certificate\t\tmpc\napplication/vnd.mozilla.xul+xml\t\t\txul\napplication/vnd.ms-artgalry\t\t\tcil\napplication/vnd.ms-cab-compressed\t\tcab\napplication/vnd.ms-excel\t\t\txls xlm xla xlc xlt xlw\napplication/vnd.ms-excel.addin.macroenabled.12\t\txlam\napplication/vnd.ms-excel.sheet.binary.macroenabled.12\txlsb\napplication/vnd.ms-excel.sheet.macroenabled.12\t\txlsm\napplication/vnd.ms-excel.template.macroenabled.12\txltm\napplication/vnd.ms-fontobject\t\t\teot\napplication/vnd.ms-htmlhelp\t\t\tchm\napplication/vnd.ms-ims\t\t\t\tims\napplication/vnd.ms-lrm\t\t\t\tlrm\napplication/vnd.ms-officetheme\t\t\tthmx\napplication/vnd.ms-pki.seccat\t\t\tcat\napplication/vnd.ms-pki.stl\t\t\tstl\napplication/vnd.ms-powerpoint\t\t\tppt pps pot\napplication/vnd.ms-powerpoint.addin.macroenabled.12\t\tppam\napplication/vnd.ms-powerpoint.presentation.macroenabled.12\tpptm\napplication/vnd.ms-powerpoint.slide.macroenabled.12\t\tsldm\napplication/vnd.ms-powerpoint.slideshow.macroenabled.12\t\tppsm\napplication/vnd.ms-powerpoint.template.macroenabled.12\t\tpotm\napplication/vnd.ms-project\t\t\tmpp mpt\napplication/vnd.ms-word.document.macroenabled.12\tdocm\napplication/vnd.ms-word.template.macroenabled.12\tdotm\napplication/vnd.ms-works\t\t\twps wks wcm wdb\napplication/vnd.ms-wpl\t\t\t\twpl\napplication/vnd.ms-xpsdocument\t\t\txps\napplication/vnd.mseq\t\t\t\tmseq\napplication/vnd.musician\t\t\tmus\napplication/vnd.muvee.style\t\t\tmsty\napplication/vnd.mynfc\t\t\t\ttaglet\napplication/vnd.neurolanguage.nlu\t\tnlu\napplication/vnd.nitf\t\t\t\tntf nitf\napplication/vnd.noblenet-directory\t\tnnd\napplication/vnd.noblenet-sealer\t\t\tnns\napplication/vnd.noblenet-web\t\t\tnnw\napplication/vnd.nokia.n-gage.data\t\tngdat\napplication/vnd.nokia.n-gage.symbian.install\tn-gage\napplication/vnd.nokia.radio-preset\t\trpst\napplication/vnd.nokia.radio-presets\t\trpss\napplication/vnd.novadigm.edm\t\t\tedm\napplication/vnd.novadigm.edx\t\t\tedx\napplication/vnd.novadigm.ext\t\t\text\napplication/vnd.oasis.opendocument.chart\t\todc\napplication/vnd.oasis.opendocument.chart-template\totc\napplication/vnd.oasis.opendocument.database\t\todb\napplication/vnd.oasis.opendocument.formula\t\todf\napplication/vnd.oasis.opendocument.formula-template\todft\napplication/vnd.oasis.opendocument.graphics\t\todg\napplication/vnd.oasis.opendocument.graphics-template\totg\napplication/vnd.oasis.opendocument.image\t\todi\napplication/vnd.oasis.opendocument.image-template\toti\napplication/vnd.oasis.opendocument.presentation\t\todp\napplication/vnd.oasis.opendocument.presentation-template\totp\napplication/vnd.oasis.opendocument.spreadsheet\t\tods\napplication/vnd.oasis.opendocument.spreadsheet-template\tots\napplication/vnd.oasis.opendocument.text\t\t\todt\napplication/vnd.oasis.opendocument.text-master\t\todm\napplication/vnd.oasis.opendocument.text-template\tott\napplication/vnd.oasis.opendocument.text-web\t\toth\napplication/vnd.olpc-sugar\t\t\txo\napplication/vnd.oma.dd2+xml\t\t\tdd2\napplication/vnd.openofficeorg.extension\t\toxt\napplication/vnd.openxmlformats-officedocument.presentationml.presentation\tpptx\napplication/vnd.openxmlformats-officedocument.presentationml.slide\tsldx\napplication/vnd.openxmlformats-officedocument.presentationml.slideshow\tppsx\napplication/vnd.openxmlformats-officedocument.presentationml.template\tpotx\napplication/vnd.openxmlformats-officedocument.spreadsheetml.sheet\txlsx\napplication/vnd.openxmlformats-officedocument.spreadsheetml.template\txltx\napplication/vnd.openxmlformats-officedocument.wordprocessingml.document\tdocx\napplication/vnd.openxmlformats-officedocument.wordprocessingml.template\tdotx\napplication/vnd.osgeo.mapguide.package\t\tmgp\napplication/vnd.osgi.dp\t\t\t\tdp\napplication/vnd.osgi.subsystem\t\t\tesa\napplication/vnd.palm\t\t\t\tpdb pqa oprc\napplication/vnd.pawaafile\t\t\tpaw\napplication/vnd.pg.format\t\t\tstr\napplication/vnd.pg.osasli\t\t\tei6\napplication/vnd.picsel\t\t\t\tefif\napplication/vnd.pmi.widget\t\t\twg\napplication/vnd.pocketlearn\t\t\tplf\napplication/vnd.powerbuilder6\t\t\tpbd\napplication/vnd.previewsystems.box\t\tbox\napplication/vnd.proteus.magazine\t\tmgz\napplication/vnd.publishare-delta-tree\t\tqps\napplication/vnd.pvi.ptid1\t\t\tptid\napplication/vnd.quark.quarkxpress\t\tqxd qxt qwd qwt qxl qxb\napplication/vnd.realvnc.bed\t\t\tbed\napplication/vnd.recordare.musicxml\t\tmxl\napplication/vnd.recordare.musicxml+xml\t\tmusicxml\napplication/vnd.rig.cryptonote\t\t\tcryptonote\napplication/vnd.rim.cod\t\t\t\tcod\napplication/vnd.rn-realmedia\t\t\trm\napplication/vnd.rn-realmedia-vbr\t\trmvb\napplication/vnd.route66.link66+xml\t\tlink66\napplication/vnd.sailingtracker.track\t\tst\napplication/vnd.seemail\t\t\t\tsee\napplication/vnd.sema\t\t\t\tsema\napplication/vnd.semd\t\t\t\tsemd\napplication/vnd.semf\t\t\t\tsemf\napplication/vnd.shana.informed.formdata\t\tifm\napplication/vnd.shana.informed.formtemplate\titp\napplication/vnd.shana.informed.interchange\tiif\napplication/vnd.shana.informed.package\t\tipk\napplication/vnd.simtech-mindmapper\t\ttwd twds\napplication/vnd.smaf\t\t\t\tmmf\napplication/vnd.smart.teacher\t\t\tteacher\napplication/vnd.solent.sdkm+xml\t\t\tsdkm sdkd\napplication/vnd.spotfire.dxp\t\t\tdxp\napplication/vnd.spotfire.sfs\t\t\tsfs\napplication/vnd.stardivision.calc\t\tsdc\napplication/vnd.stardivision.draw\t\tsda\napplication/vnd.stardivision.impress\t\tsdd\napplication/vnd.stardivision.math\t\tsmf\napplication/vnd.stardivision.writer\t\tsdw vor\napplication/vnd.stardivision.writer-global\tsgl\napplication/vnd.stepmania.package\t\tsmzip\napplication/vnd.stepmania.stepchart\t\tsm\napplication/vnd.sun.xml.calc\t\t\tsxc\napplication/vnd.sun.xml.calc.template\t\tstc\napplication/vnd.sun.xml.draw\t\t\tsxd\napplication/vnd.sun.xml.draw.template\t\tstd\napplication/vnd.sun.xml.impress\t\t\tsxi\napplication/vnd.sun.xml.impress.template\tsti\napplication/vnd.sun.xml.math\t\t\tsxm\napplication/vnd.sun.xml.writer\t\t\tsxw\napplication/vnd.sun.xml.writer.global\t\tsxg\napplication/vnd.sun.xml.writer.template\t\tstw\napplication/vnd.sus-calendar\t\t\tsus susp\napplication/vnd.svd\t\t\t\tsvd\napplication/vnd.symbian.install\t\t\tsis sisx\napplication/vnd.syncml+xml\t\t\txsm\napplication/vnd.syncml.dm+wbxml\t\t\tbdm\napplication/vnd.syncml.dm+xml\t\t\txdm\napplication/vnd.tao.intent-module-archive\ttao\napplication/vnd.tcpdump.pcap\t\t\tpcap cap dmp\napplication/vnd.tmobile-livetv\t\t\ttmo\napplication/vnd.trid.tpt\t\t\ttpt\napplication/vnd.triscape.mxs\t\t\tmxs\napplication/vnd.trueapp\t\t\t\ttra\napplication/vnd.ufdl\t\t\t\tufd ufdl\napplication/vnd.uiq.theme\t\t\tutz\napplication/vnd.umajin\t\t\t\tumj\napplication/vnd.unity\t\t\t\tunityweb\napplication/vnd.uoml+xml\t\t\tuoml\napplication/vnd.vcx\t\t\t\tvcx\napplication/vnd.visio\t\t\t\tvsd vst vss vsw\napplication/vnd.visionary\t\t\tvis\napplication/vnd.vsf\t\t\t\tvsf\napplication/vnd.wap.wbxml\t\t\twbxml\napplication/vnd.wap.wmlc\t\t\twmlc\napplication/vnd.wap.wmlscriptc\t\t\twmlsc\napplication/vnd.webturbo\t\t\twtb\napplication/vnd.wolfram.player\t\t\tnbp\napplication/vnd.wordperfect\t\t\twpd\napplication/vnd.wqd\t\t\t\twqd\napplication/vnd.wt.stf\t\t\t\tstf\napplication/vnd.xara\t\t\t\txar\napplication/vnd.xfdl\t\t\t\txfdl\napplication/vnd.yamaha.hv-dic\t\t\thvd\napplication/vnd.yamaha.hv-script\t\thvs\napplication/vnd.yamaha.hv-voice\t\t\thvp\napplication/vnd.yamaha.openscoreformat\t\t\tosf\napplication/vnd.yamaha.openscoreformat.osfpvg+xml\tosfpvg\napplication/vnd.yamaha.smaf-audio\t\tsaf\napplication/vnd.yamaha.smaf-phrase\t\tspf\napplication/vnd.yellowriver-custom-menu\t\tcmp\napplication/vnd.zul\t\t\t\tzir zirz\napplication/vnd.zzazz.deck+xml\t\t\tzaz\napplication/voicexml+xml\t\t\tvxml\napplication/widget\t\t\t\twgt\napplication/winhlp\t\t\t\thlp\napplication/wsdl+xml\t\t\t\twsdl\napplication/wspolicy+xml\t\t\twspolicy\napplication/x-7z-compressed\t\t\t7z\napplication/x-abiword\t\t\t\tabw\napplication/x-ace-compressed\t\t\tace\napplication/x-apple-diskimage\t\t\tdmg\napplication/x-authorware-bin\t\t\taab x32 u32 vox\napplication/x-authorware-map\t\t\taam\napplication/x-authorware-seg\t\t\taas\napplication/x-bcpio\t\t\t\tbcpio\napplication/x-bittorrent\t\t\ttorrent\napplication/x-blorb\t\t\t\tblb blorb\napplication/x-bzip\t\t\t\tbz\napplication/x-bzip2\t\t\t\tbz2 boz\napplication/x-cbr\t\t\t\tcbr cba cbt cbz cb7\napplication/x-cdlink\t\t\t\tvcd\napplication/x-cfs-compressed\t\t\tcfs\napplication/x-chat\t\t\t\tchat\napplication/x-chess-pgn\t\t\t\tpgn\napplication/x-conference\t\t\tnsc\napplication/x-cpio\t\t\t\tcpio\napplication/x-csh\t\t\t\tcsh\napplication/x-debian-package\t\t\tdeb udeb\napplication/x-dgc-compressed\t\t\tdgc\napplication/x-director\t\t\tdir dcr dxr cst cct cxt w3d fgd swa\napplication/x-doom\t\t\t\twad\napplication/x-dtbncx+xml\t\t\tncx\napplication/x-dtbook+xml\t\t\tdtb\napplication/x-dtbresource+xml\t\t\tres\napplication/x-dvi\t\t\t\tdvi\napplication/x-envoy\t\t\t\tevy\napplication/x-eva\t\t\t\teva\napplication/x-font-bdf\t\t\t\tbdf\napplication/x-font-ghostscript\t\t\tgsf\napplication/x-font-linux-psf\t\t\tpsf\napplication/x-font-pcf\t\t\t\tpcf\napplication/x-font-snf\t\t\t\tsnf\napplication/x-font-type1\t\t\tpfa pfb pfm afm\napplication/x-freearc\t\t\t\tarc\napplication/x-futuresplash\t\t\tspl\napplication/x-gca-compressed\t\t\tgca\napplication/x-glulx\t\t\t\tulx\napplication/x-gnumeric\t\t\t\tgnumeric\napplication/x-gramps-xml\t\t\tgramps\napplication/x-gtar\t\t\t\tgtar\napplication/x-hdf\t\t\t\thdf\napplication/x-install-instructions\t\tinstall\napplication/x-iso9660-image\t\t\tiso\napplication/x-java-jnlp-file\t\t\tjnlp\napplication/x-latex\t\t\t\tlatex\napplication/x-lzh-compressed\t\t\tlzh lha\napplication/x-mie\t\t\t\tmie\napplication/x-mobipocket-ebook\t\t\tprc mobi\napplication/x-ms-application\t\t\tapplication\napplication/x-ms-shortcut\t\t\tlnk\napplication/x-ms-wmd\t\t\t\twmd\napplication/x-ms-wmz\t\t\t\twmz\napplication/x-ms-xbap\t\t\t\txbap\napplication/x-msaccess\t\t\t\tmdb\napplication/x-msbinder\t\t\t\tobd\napplication/x-mscardfile\t\t\tcrd\napplication/x-msclip\t\t\t\tclp\napplication/x-msdownload\t\t\texe dll com bat msi\napplication/x-msmediaview\t\t\tmvb m13 m14\napplication/x-msmetafile\t\t\twmf wmz emf emz\napplication/x-msmoney\t\t\t\tmny\napplication/x-mspublisher\t\t\tpub\napplication/x-msschedule\t\t\tscd\napplication/x-msterminal\t\t\ttrm\napplication/x-mswrite\t\t\t\twri\napplication/x-netcdf\t\t\t\tnc cdf\napplication/x-nzb\t\t\t\tnzb\napplication/x-pkcs12\t\t\t\tp12 pfx\napplication/x-pkcs7-certificates\t\tp7b spc\napplication/x-pkcs7-certreqresp\t\t\tp7r\napplication/x-rar-compressed\t\t\trar\napplication/x-research-info-systems\t\tris\napplication/x-sh\t\t\t\tsh\napplication/x-shar\t\t\t\tshar\napplication/x-shockwave-flash\t\t\tswf\napplication/x-silverlight-app\t\t\txap\napplication/x-sql\t\t\t\tsql\napplication/x-stuffit\t\t\t\tsit\napplication/x-stuffitx\t\t\t\tsitx\napplication/x-subrip\t\t\t\tsrt\napplication/x-sv4cpio\t\t\t\tsv4cpio\napplication/x-sv4crc\t\t\t\tsv4crc\napplication/x-t3vm-image\t\t\tt3\napplication/x-tads\t\t\t\tgam\napplication/x-tar\t\t\t\ttar\napplication/x-tcl\t\t\t\ttcl\napplication/x-tex\t\t\t\ttex\napplication/x-tex-tfm\t\t\t\ttfm\napplication/x-texinfo\t\t\t\ttexinfo texi\napplication/x-tgif\t\t\t\tobj\napplication/x-ustar\t\t\t\tustar\napplication/x-wais-source\t\t\tsrc\napplication/x-x509-ca-cert\t\t\tder crt\napplication/x-xfig\t\t\t\tfig\napplication/x-xliff+xml\t\t\t\txlf\napplication/x-xpinstall\t\t\t\txpi\napplication/x-xz\t\t\t\txz\napplication/x-zmachine\t\t\t\tz1 z2 z3 z4 z5 z6 z7 z8\napplication/xaml+xml\t\t\t\txaml\napplication/xcap-diff+xml\t\t\txdf\napplication/xenc+xml\t\t\t\txenc\napplication/xhtml+xml\t\t\t\txhtml xht\napplication/xml\t\t\t\t\txml xsl\napplication/xml-dtd\t\t\t\tdtd\napplication/xop+xml\t\t\t\txop\napplication/xproc+xml\t\t\t\txpl\napplication/xslt+xml\t\t\t\txslt\napplication/xspf+xml\t\t\t\txspf\napplication/xv+xml\t\t\t\tmxml xhvml xvml xvm\napplication/yang\t\t\t\tyang\napplication/yin+xml\t\t\t\tyin\napplication/zip\t\t\t\t\tzip\naudio/adpcm\t\t\t\t\tadp\naudio/basic\t\t\t\t\tau snd\naudio/midi\t\t\t\t\tmid midi kar rmi\naudio/mp4\t\t\t\t\tm4a mp4a\naudio/mpeg\t\t\t\t\tmpga mp2 mp2a mp3 m2a m3a\naudio/ogg\t\t\t\t\toga ogg spx\naudio/s3m\t\t\t\t\ts3m\naudio/silk\t\t\t\t\tsil\naudio/vnd.dece.audio\t\t\t\tuva uvva\naudio/vnd.digital-winds\t\t\t\teol\naudio/vnd.dra\t\t\t\t\tdra\naudio/vnd.dts\t\t\t\t\tdts\naudio/vnd.dts.hd\t\t\t\tdtshd\naudio/vnd.lucent.voice\t\t\t\tlvp\naudio/vnd.ms-playready.media.pya\t\tpya\naudio/vnd.nuera.ecelp4800\t\t\tecelp4800\naudio/vnd.nuera.ecelp7470\t\t\tecelp7470\naudio/vnd.nuera.ecelp9600\t\t\tecelp9600\naudio/vnd.rip\t\t\t\t\trip\naudio/webm\t\t\t\t\tweba\naudio/x-aac\t\t\t\t\taac\naudio/x-aiff\t\t\t\t\taif aiff aifc\naudio/x-caf\t\t\t\t\tcaf\naudio/x-flac\t\t\t\t\tflac\naudio/x-matroska\t\t\t\tmka\naudio/x-mpegurl\t\t\t\t\tm3u\naudio/x-ms-wax\t\t\t\t\twax\naudio/x-ms-wma\t\t\t\t\twma\naudio/x-pn-realaudio\t\t\t\tram ra\naudio/x-pn-realaudio-plugin\t\t\trmp\naudio/x-wav\t\t\t\t\twav\naudio/xm\t\t\t\t\txm\nchemical/x-cdx\t\t\t\t\tcdx\nchemical/x-cif\t\t\t\t\tcif\nchemical/x-cmdf\t\t\t\t\tcmdf\nchemical/x-cml\t\t\t\t\tcml\nchemical/x-csml\t\t\t\t\tcsml\nchemical/x-xyz\t\t\t\t\txyz\nfont/collection\t\t\t\t\tttc\nfont/otf\t\t\t\t\totf\nfont/ttf\t\t\t\t\tttf\nfont/woff\t\t\t\t\twoff\nfont/woff2\t\t\t\t\twoff2\nimage/bmp\t\t\t\t\tbmp\nimage/cgm\t\t\t\t\tcgm\nimage/g3fax\t\t\t\t\tg3\nimage/gif\t\t\t\t\tgif\nimage/ief\t\t\t\t\tief\nimage/jpeg\t\t\t\t\tjpeg jpg jpe\nimage/ktx\t\t\t\t\tktx\nimage/png\t\t\t\t\tpng\nimage/prs.btif\t\t\t\t\tbtif\nimage/sgi\t\t\t\t\tsgi\nimage/svg+xml\t\t\t\t\tsvg svgz\nimage/tiff\t\t\t\t\ttiff tif\nimage/vnd.adobe.photoshop\t\t\tpsd\nimage/vnd.dece.graphic\t\t\t\tuvi uvvi uvg uvvg\nimage/vnd.djvu\t\t\t\t\tdjvu djv\nimage/vnd.dvb.subtitle\t\t\t\tsub\nimage/vnd.dwg\t\t\t\t\tdwg\nimage/vnd.dxf\t\t\t\t\tdxf\nimage/vnd.fastbidsheet\t\t\t\tfbs\nimage/vnd.fpx\t\t\t\t\tfpx\nimage/vnd.fst\t\t\t\t\tfst\nimage/vnd.fujixerox.edmics-mmr\t\t\tmmr\nimage/vnd.fujixerox.edmics-rlc\t\t\trlc\nimage/vnd.ms-modi\t\t\t\tmdi\nimage/vnd.ms-photo\t\t\t\twdp\nimage/vnd.net-fpx\t\t\t\tnpx\nimage/vnd.wap.wbmp\t\t\t\twbmp\nimage/vnd.xiff\t\t\t\t\txif\nimage/webp\t\t\t\t\twebp\nimage/x-3ds\t\t\t\t\t3ds\nimage/x-cmu-raster\t\t\t\tras\nimage/x-cmx\t\t\t\t\tcmx\nimage/x-freehand\t\t\t\tfh fhc fh4 fh5 fh7\nimage/x-icon\t\t\t\t\tico\nimage/x-mrsid-image\t\t\t\tsid\nimage/x-pcx\t\t\t\t\tpcx\nimage/x-pict\t\t\t\t\tpic pct\nimage/x-portable-anymap\t\t\t\tpnm\nimage/x-portable-bitmap\t\t\t\tpbm\nimage/x-portable-graymap\t\t\tpgm\nimage/x-portable-pixmap\t\t\t\tppm\nimage/x-rgb\t\t\t\t\trgb\nimage/x-tga\t\t\t\t\ttga\nimage/x-xbitmap\t\t\t\t\txbm\nimage/x-xpixmap\t\t\t\t\txpm\nimage/x-xwindowdump\t\t\t\txwd\nmessage/rfc822\t\t\t\t\teml mime\nmodel/iges\t\t\t\t\tigs iges\nmodel/mesh\t\t\t\t\tmsh mesh silo\nmodel/vnd.collada+xml\t\t\t\tdae\nmodel/vnd.dwf\t\t\t\t\tdwf\nmodel/vnd.gdl\t\t\t\t\tgdl\nmodel/vnd.gtw\t\t\t\t\tgtw\nmodel/vnd.mts\t\t\t\t\tmts\nmodel/vnd.vtu\t\t\t\t\tvtu\nmodel/vrml\t\t\t\t\twrl vrml\nmodel/x3d+binary\t\t\t\tx3db x3dbz\nmodel/x3d+vrml\t\t\t\t\tx3dv x3dvz\nmodel/x3d+xml\t\t\t\t\tx3d x3dz\ntext/cache-manifest\t\t\t\tappcache\ntext/calendar\t\t\t\t\tics ifb\ntext/css\t\t\t\t\tcss\ntext/csv\t\t\t\t\tcsv\ntext/html\t\t\t\t\thtml htm\ntext/n3\t\t\t\t\t\tn3\ntext/plain\t\t\t\t\ttxt text conf def list log in\ntext/prs.lines.tag\t\t\t\tdsc\ntext/richtext\t\t\t\t\trtx\ntext/sgml\t\t\t\t\tsgml sgm\ntext/tab-separated-values\t\t\ttsv\ntext/troff\t\t\t\t\tt tr roff man me ms\ntext/turtle\t\t\t\t\tttl\ntext/uri-list\t\t\t\t\turi uris urls\ntext/vcard\t\t\t\t\tvcard\ntext/vnd.curl\t\t\t\t\tcurl\ntext/vnd.curl.dcurl\t\t\t\tdcurl\ntext/vnd.curl.mcurl\t\t\t\tmcurl\ntext/vnd.curl.scurl\t\t\t\tscurl\ntext/vnd.dvb.subtitle\t\t\t\tsub\ntext/vnd.fly\t\t\t\t\tfly\ntext/vnd.fmi.flexstor\t\t\t\tflx\ntext/vnd.graphviz\t\t\t\tgv\ntext/vnd.in3d.3dml\t\t\t\t3dml\ntext/vnd.in3d.spot\t\t\t\tspot\ntext/vnd.sun.j2me.app-descriptor\t\tjad\ntext/vnd.wap.wml\t\t\t\twml\ntext/vnd.wap.wmlscript\t\t\t\twmls\ntext/x-asm\t\t\t\t\ts asm\ntext/x-c\t\t\t\t\tc cc cxx cpp h hh dic\ntext/x-fortran\t\t\t\t\tf for f77 f90\ntext/x-java-source\t\t\t\tjava\ntext/x-nfo\t\t\t\t\tnfo\ntext/x-opml\t\t\t\t\topml\ntext/x-pascal\t\t\t\t\tp pas\ntext/x-setext\t\t\t\t\tetx\ntext/x-sfv\t\t\t\t\tsfv\ntext/x-uuencode\t\t\t\t\tuu\ntext/x-vcalendar\t\t\t\tvcs\ntext/x-vcard\t\t\t\t\tvcf\nvideo/3gpp\t\t\t\t\t3gp\nvideo/3gpp2\t\t\t\t\t3g2\nvideo/h261\t\t\t\t\th261\nvideo/h263\t\t\t\t\th263\nvideo/h264\t\t\t\t\th264\nvideo/jpeg\t\t\t\t\tjpgv\nvideo/jpm\t\t\t\t\tjpm jpgm\nvideo/mj2\t\t\t\t\tmj2 mjp2\nvideo/mp4\t\t\t\t\tmp4 mp4v mpg4\nvideo/mpeg\t\t\t\t\tmpeg mpg mpe m1v m2v\nvideo/ogg\t\t\t\t\togv\nvideo/quicktime\t\t\t\t\tqt mov\nvideo/vnd.dece.hd\t\t\t\tuvh uvvh\nvideo/vnd.dece.mobile\t\t\t\tuvm uvvm\nvideo/vnd.dece.pd\t\t\t\tuvp uvvp\nvideo/vnd.dece.sd\t\t\t\tuvs uvvs\nvideo/vnd.dece.video\t\t\t\tuvv uvvv\nvideo/vnd.dvb.file\t\t\t\tdvb\nvideo/vnd.fvt\t\t\t\t\tfvt\nvideo/vnd.mpegurl\t\t\t\tmxu m4u\nvideo/vnd.ms-playready.media.pyv\t\tpyv\nvideo/vnd.uvvu.mp4\t\t\t\tuvu uvvu\nvideo/vnd.vivo\t\t\t\t\tviv\nvideo/webm\t\t\t\t\twebm\nvideo/x-f4v\t\t\t\t\tf4v\nvideo/x-fli\t\t\t\t\tfli\nvideo/x-flv\t\t\t\t\tflv\nvideo/x-m4v\t\t\t\t\tm4v\nvideo/x-matroska\t\t\t\tmkv mk3d mks\nvideo/x-mng\t\t\t\t\tmng\nvideo/x-ms-asf\t\t\t\t\tasf asx\nvideo/x-ms-vob\t\t\t\t\tvob\nvideo/x-ms-wm\t\t\t\t\twm\nvideo/x-ms-wmv\t\t\t\t\twmv\nvideo/x-ms-wmx\t\t\t\t\twmx\nvideo/x-ms-wvx\t\t\t\t\twvx\nvideo/x-msvideo\t\t\t\t\tavi\nvideo/x-sgi-movie\t\t\t\tmovie\nvideo/x-smv\t\t\t\t\tsmv\nx-conference/x-cooltalk\t\t\t\tice\n";

const map = new Map();

mime_raw.split('\n').forEach((row) => {
	const match = /(.+?)\t+(.+)/.exec(row);
	if (!match) return;

	const type = match[1];
	const extensions = match[2].split(' ');

	extensions.forEach(ext => {
		map.set(ext, type);
	});
});

function lookup(file) {
	const match = /\.([^\.]+)$/.exec(file);
	return match && map.get(match[1]);
}

function middleware(opts


 = {}) {
	const { session, ignore } = opts;

	let emitted_basepath = false;

	return compose_handlers(ignore, [
		(req, res, next) => {
			if (req.baseUrl === undefined) {
				let { originalUrl } = req;
				if (req.url === '/' && originalUrl[originalUrl.length - 1] !== '/') {
					originalUrl += '/';
				}

				req.baseUrl = originalUrl
					? originalUrl.slice(0, -req.url.length)
					: '';
			}

			if (!emitted_basepath && process.send) {
				process.send({
					__sapper__: true,
					event: 'basepath',
					basepath: req.baseUrl
				});

				emitted_basepath = true;
			}

			if (req.path === undefined) {
				req.path = req.url.replace(/\?.*/, '');
			}

			next();
		},

		fs.existsSync(path.join(build_dir, 'service-worker.js')) && serve({
			pathname: '/service-worker.js',
			cache_control: 'no-cache, no-store, must-revalidate'
		}),

		fs.existsSync(path.join(build_dir, 'service-worker.js.map')) && serve({
			pathname: '/service-worker.js.map',
			cache_control: 'no-cache, no-store, must-revalidate'
		}),

		serve({
			prefix: '/client/',
			cache_control:  'max-age=31536000, immutable'
		}),

		get_server_route_handler(manifest.server_routes),

		get_page_handler(manifest, session || noop$1)
	].filter(Boolean));
}

function compose_handlers(ignore, handlers) {
	const total = handlers.length;

	function nth_handler(n, req, res, next) {
		if (n >= total) {
			return next();
		}

		handlers[n](req, res, () => nth_handler(n+1, req, res, next));
	}

	return !ignore
		? (req, res, next) => nth_handler(0, req, res, next)
		: (req, res, next) => {
			if (should_ignore(req.path, ignore)) {
				next();
			} else {
				nth_handler(0, req, res, next);
			}
		};
}

function should_ignore(uri, val) {
	if (Array.isArray(val)) return val.some(x => should_ignore(uri, x));
	if (val instanceof RegExp) return val.test(uri);
	if (typeof val === 'function') return val(uri);
	return uri.startsWith(val.charCodeAt(0) === 47 ? val : `/${val}`);
}

function serve({ prefix, pathname, cache_control }



) {
	const filter = pathname
		? (req) => req.path === pathname
		: (req) => req.path.startsWith(prefix);

	const cache = new Map();

	const read =  (file) => (cache.has(file) ? cache : cache.set(file, fs.readFileSync(path.resolve(build_dir, file)))).get(file);

	return (req, res, next) => {
		if (filter(req)) {
			const type = lookup(req.path);

			try {
				const file = decodeURIComponent(req.path.slice(1));
				const data = read(file);

				res.setHeader('Content-Type', type);
				res.setHeader('Cache-Control', cache_control);
				res.end(data);
			} catch (err) {
				res.statusCode = 404;
				res.end('not found');
			}
		} else {
			next();
		}
	};
}

function noop$1(){}

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === "development";

polka().use(
	compression({ threshold: 0 }),
	sirv("static", { dev }),
	middleware()
).listen(PORT, err => {
	if (err) {
		console.log("error", err);
	}
});
//# sourceMappingURL=server.js.map
