// Which store an install button sends a visitor to (src/lib/install-target.ts), and the /get QR
// redirect's store links (qrStoreHref in src/lib/analytics-core.ts).
import { test } from "node:test";
import assert from "node:assert/strict";
import { detectDevice, installStore, isGenericLabel, phoneStore } from "../src/lib/install-target.ts";
import { qrStoreHref } from "../src/lib/analytics-core.ts";

const UA = {
	iphone: "Mozilla/5.0 (iPhone; CPU iPhone OS 18_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1 Mobile/15E148 Safari/604.1",
	iphoneChrome: "Mozilla/5.0 (iPhone; CPU iPhone OS 18_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/131.0.6778.73 Mobile/15E148 Safari/604.1",
	ipad: "Mozilla/5.0 (iPad; CPU OS 17_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.6 Mobile/15E148 Safari/604.1",
	// iPadOS asks for the desktop site: a Mac UA, told apart by its touch screen.
	ipadDesktop: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1 Safari/605.1.15",
	android: "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36",
	// Chrome's reduced UA on Android: model hidden, still says Android.
	androidReduced: "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36",
	samsung: "Mozilla/5.0 (Linux; Android 14; SM-S921B) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/26.0 Chrome/122.0.0.0 Mobile Safari/537.36",
	androidFirefox: "Mozilla/5.0 (Android 14; Mobile; rv:132.0) Gecko/132.0 Firefox/132.0",
	cubot: "Mozilla/5.0 (Linux; Android 10; CUBOT X30) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",
	macChrome: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
	winChrome: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
	winEdge: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0",
	chromeOS: "Mozilla/5.0 (X11; CrOS x86_64 14541.0.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
	linuxChrome: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
	winOpera: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36 OPR/115.0.0.0",
	macSafari: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1 Safari/605.1.15",
	macFirefox: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:132.0) Gecko/20100101 Firefox/132.0",
	winFirefox: "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:132.0) Gecko/20100101 Firefox/132.0",
	googlebot: "Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.6778.69 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
	bingbot: "Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)",
	gptbot: "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; GPTBot/1.2; +https://openai.com/gptbot",
	chatgptUser: "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; ChatGPT-User/1.0; +https://openai.com/bot",
	headless: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/131.0.0.0 Safari/537.36",
	curl: "curl/8.7.1",
};

const chromeBrands = [{ brand: "Google Chrome" }, { brand: "Chromium" }, { brand: "Not_A Brand" }];

test("phones go to their store", () => {
	for (const k of ["iphone", "iphoneChrome", "ipad"]) assert.equal(installStore({ ua: UA[k] }), "app_store", k);
	for (const k of ["android", "androidReduced", "samsung", "androidFirefox", "cubot"]) assert.equal(installStore({ ua: UA[k] }), "google_play", k);
});

test("iPadOS with a desktop UA counts as iOS (touch Mac); a real Mac does not", () => {
	assert.equal(installStore({ ua: UA.ipadDesktop, platform: "MacIntel", maxTouchPoints: 5 }), "app_store");
	assert.equal(installStore({ ua: UA.ipadDesktop, platform: "MacIntel", maxTouchPoints: 0 }), null);
});

test("Chrome and Edge on a computer go to the Chrome Web Store", () => {
	for (const k of ["macChrome", "winChrome", "winEdge", "chromeOS", "linuxChrome"]) assert.equal(installStore({ ua: UA[k] }), "chrome_web_store", k);
	// userAgentData agrees.
	assert.equal(installStore({ ua: UA.winChrome, uaData: { mobile: false, platform: "Windows", brands: chromeBrands } }), "chrome_web_store");
});

test("userAgentData wins where it is more exact", () => {
	// Android Chrome with a "Request desktop site" UA still reports platform Android.
	assert.equal(installStore({ ua: UA.linuxChrome, uaData: { mobile: false, platform: "Android", brands: chromeBrands } }), "google_play");
	// A mobile Chromium that isn't Android or iOS: no store.
	assert.equal(installStore({ ua: UA.linuxChrome, uaData: { mobile: true, platform: "Linux", brands: chromeBrands } }), null);
	// Opera says so in its brands.
	assert.equal(installStore({ ua: UA.winChrome, uaData: { mobile: false, platform: "Windows", brands: [{ brand: "Opera" }, { brand: "Chromium" }] } }), null);
});

test("other desktop browsers, bots and unknowns keep /download/", () => {
	for (const k of ["winOpera", "macSafari", "macFirefox", "winFirefox", "googlebot", "bingbot", "gptbot", "chatgptUser", "headless", "curl"]) {
		assert.equal(installStore({ ua: UA[k] }), null, k);
	}
	assert.equal(installStore({ ua: "" }), null);
	assert.equal(detectDevice({ ua: UA.googlebot }), null); // smartphone Googlebot says Android, but is a bot
});

test("phoneStore (/get): phones only, Client Hints help", () => {
	assert.equal(phoneStore(UA.android), "google_play");
	assert.equal(phoneStore(UA.iphone), "app_store");
	assert.equal(phoneStore(UA.winChrome), null); // a computer: /download/
	assert.equal(phoneStore(UA.macFirefox), null);
	assert.equal(phoneStore(UA.googlebot), null);
	assert.equal(phoneStore(UA.linuxChrome, '"Android"'), "google_play");
	assert.equal(phoneStore(UA.winChrome, '"Windows"'), null);
});

test("only generic button labels become 'Add to Chrome — free'", () => {
	for (const t of ["Get the App", "Get Respite free", "Download free", "Download Free", "Download Respite", "  Get  the app "]) assert.ok(isGenericLabel(t), t);
	for (const t of ["Try Respite on one app", "Get it free", "Take the quiz"]) assert.ok(!isGenericLabel(t), t);
});

test("qrStoreHref: QR defaults, campaign from ?c, explicit utm_* win", () => {
	const play = "https://play.google.com/store/apps/details?id=dev.sadakat.thinkfaster";
	const p = new URL(qrStoreHref(play, "google_play", "?c=blog"));
	assert.equal(p.searchParams.get("id"), "dev.sadakat.thinkfaster");
	assert.equal(p.searchParams.get("referrer"), "utm_source=respite_site&utm_medium=qr&utm_campaign=blog&utm_content=qr_blog__qr");
	assert.match(p.href, /referrer=utm_source%3Drespite_site%26utm_medium%3Dqr/);

	const apple = "https://apps.apple.com/us/app/respite-screen-time-control/id6757760293";
	const a = new URL(qrStoreHref(apple, "app_store", "?c=download"));
	assert.equal(a.searchParams.get("pt"), "128440905");
	assert.equal(a.searchParams.get("ct"), "respite_site.qr_download");
	assert.ok(a.searchParams.get("ct").length <= 30);

	assert.match(new URL(qrStoreHref(play, "google_play", "")).searchParams.get("referrer"), /utm_campaign=desktop/);
	assert.equal(
		new URL(qrStoreHref(play, "google_play", "?c=blog&utm_source=Flyer&utm_campaign=Expo 2026")).searchParams.get("referrer"),
		"utm_source=flyer&utm_medium=qr&utm_campaign=expo_2026&utm_content=qr_expo_2026__qr",
	);
	// A long campaign still fits Apple's 30 characters.
	assert.ok(new URL(qrStoreHref(apple, "app_store", `?c=${"x".repeat(50)}`)).searchParams.get("ct").length <= 30);
});
