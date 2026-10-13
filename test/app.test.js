const assert = require("node:assert/strict");
const { after, before, test } = require("node:test");
process.env.NODE_ENV = "test";
const { createApp } = require("../src/app");

let server;
let baseUrl;

before(async () => {
  server = createApp().listen(0);
  await new Promise((resolve, reject) => {
    server.once("listening", resolve);
    server.once("error", reject);
  });
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  if (server) await new Promise((resolve, reject) => server.close((err) => err ? reject(err) : resolve()));
});

test("health and readiness endpoints return valid status", async () => {
  const health = await fetch(`${baseUrl}/health`);
  assert.equal(health.status, 200);
  assert.deepEqual(await health.json(), { ok: true });

  const ready = await fetch(`${baseUrl}/ready`);
  assert.ok([200, 503].includes(ready.status));
  assert.equal(typeof (await ready.json()).ok, "boolean");
});

test("core pages render successfully", async () => {
  for (const route of ["/", "/about", "/services", "/industries", "/candidates", "/employers", "/contact", "/careers", "/privacy", "/terms"]) {
    const response = await fetch(`${baseUrl}${route}`);
    assert.equal(response.status, 200, `${route} should render`);
    assert.match(response.headers.get("content-type"), /text\/html/);
  }
});

test("leadership, client and contact details render in the shared pages", async () => {
  const home = await (await fetch(`${baseUrl}/`)).text();
  assert.match(home, /Prashant Chavan/);
  assert.match(home, /Poonam Phatak Chavan/);
  assert.match(home, /SB Fab/);
  assert.match(home, /Nirmal Enterprises/);

  const contact = await (await fetch(`${baseUrl}/contact`)).text();
  assert.match(contact, /Goregaon West/);
  assert.match(contact, /viewBox="0 0 24 24"/);
  const contactContent = contact.match(/<main id="main">([\s\S]*?)<\/main>/)[1];
  assert.doesNotMatch(contactContent, /LinkedIn|Instagram|Office location map|Google Maps/);
  const footer = contact.match(/<footer[\s\S]*?<\/footer>/)[0];
  assert.doesNotMatch(footer, /LinkedIn|Instagram/);
  assert.match(footer, /Email — to be added|pranam301125@gmail\.com/);
});

test("career search returns relevant multi-word matches", async () => {
  const warehouse = await (await fetch(`${baseUrl}/careers?q=warehouse%20stock`)).text();
  assert.match(warehouse, /<h2 class="mt-2 font-display text-xl font-semibold">Inventory Associate<\/h2>/);
  assert.doesNotMatch(warehouse, /<h2 class="mt-2 font-display text-xl font-semibold">Software Developer<\/h2>/);

  const developer = await (await fetch(`${baseUrl}/careers?q=software%20developer`)).text();
  assert.match(developer, /<h2 class="mt-2 font-display text-xl font-semibold">Software Developer<\/h2>/);
});

test("career search renders accessible popular-job suggestions", async () => {
  const response = await fetch(`${baseUrl}/careers`);
  const html = await response.text();
  assert.match(html, /role="combobox"/);
  assert.match(html, /aria-controls="job-search-suggestions"/);
  assert.match(html, /role="listbox" aria-label="Suggested demo jobs"/);
  assert.match(html, /Popular demo jobs/);
  assert.match(html, /data-title="Payroll Assistant"/);
  assert.match(html, /data-title="Software Developer"/);
  assert.match(html, /IT &amp; Technology · Pune/);
});

test("Services navigation dropdown links to each service section", async () => {
  const response = await fetch(`${baseUrl}/services`);
  const html = await response.text();
  for (const slug of [
    "permanent-staffing",
    "temporary-staffing",
    "payroll-compliance",
    "rpo",
    "manpower-consulting"
  ]) {
    assert.ok(html.includes(`href="/services#${slug}"`), `Missing Services dropdown link for ${slug}`);
  }
  assert.match(html, /class="nav-dropdown-menu" aria-label="Services"/);
  assert.match(html, /href="\/services"[^>]*aria-current="page"/);
});

test("unknown pages return the branded 404 page", async () => {
  const response = await fetch(`${baseUrl}/not-a-page`);
  assert.equal(response.status, 404);
  assert.match(await response.text(), /Page not found/);
});
