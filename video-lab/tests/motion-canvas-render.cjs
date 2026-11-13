// يفتح محرر Motion Canvas، يصوّره، ثم يضغط Render ويصدّر MP4 عبر @motion-canvas/ffmpeg
const { chromium } = require(process.env.PW || 'playwright');
(async () => {
  const b = await chromium.launch();
  const pg = await b.newPage({ viewport: { width: 1400, height: 800 } });
  const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('http://localhost:9000/');
  await pg.waitForTimeout(4000);
  await pg.screenshot({ path: process.argv[2] });
  const btns = await pg.$$eval('button', bs => bs.map(b => b.textContent.trim()).filter(Boolean));
  console.log('buttons:', btns.slice(0, 30), 'errors:', errs);
  // اختيار مُصدّر الفيديو ثم الضغط على Render
  for (const s of await pg.$$('select')) {
    const opts = await s.$$eval('option', o => o.map(x => x.textContent));
    const v = opts.find(t => /video/i.test(t));
    if (v) { await s.selectOption({ label: v }); console.log('exporter:', v); }
  }
  await pg.waitForTimeout(500);
  await pg.getByRole('button', { name: /^render$/i }).last().click();
  await pg.waitForTimeout(20000);
  await b.close();
})();
