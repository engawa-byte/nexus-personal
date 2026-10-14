const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { calculatePrice, validateBooking, addLocalDays, localToday } = require('../assets/js/nexus.js');

for (const [plan, monthly] of [['standard', 32000], ['premium', 56000]]) {
  for (const months of [1, 2, 3]) {
    test(`${plan} ${months}か月の料金`, () => {
      assert.deepEqual(calculatePrice(plan, months), { monthly, joining: 22000, months, total: 22000 + monthly * months });
    });
  }
}
const valid = { name: '山田 太郎', email: 'taro@example.com', date: '2026-12-01', time: 'morning' };
test('正常入力', () => assert.deepEqual(validateBooking(valid, '2026-10-14'), {}));
test('必須入力エラー', () => assert.deepEqual(Object.keys(validateBooking({ name: '', email: '', date: '', time: '' }, '2026-10-14')), ['name', 'email', 'date', 'time']));
test('不正なメールアドレス', () => assert.match(validateBooking({ ...valid, email: 'invalid' }, '2026-10-14').email, /形式/));
test('過去日', () => assert.match(validateBooking({ ...valid, date: '2026-10-13' }, '2026-10-14').date, /明日から90日後まで/));
test('FAQは4件のネイティブ開閉要素', () => {
  const html = fs.readFileSync('index.html', 'utf8');
  const faq = html.match(/<div class="faq-list">([\s\S]*?)<\/div>/)[1];
  assert.equal((faq.match(/<details>/g) || []).length, 4);
  assert.equal((faq.match(/<summary>/g) || []).length, 4);
});
test('フォーム送信は阻止され外部通信コードがない', () => {
  const js = fs.readFileSync('assets/js/nexus.js', 'utf8');
  const html = fs.readFileSync('index.html', 'utf8');
  assert.match(js, /event\.preventDefault\(\)/);
  assert.match(html, /<form id="trial-form" novalidate>/);
  assert.doesNotMatch(js, /\b(fetch|XMLHttpRequest|sendBeacon|localStorage|sessionStorage)\b/);
  assert.doesNotMatch(html, /<form[^>]*action=/);
});

test('日付下限と上限を含む', () => {
  for (const date of ['2026-10-15', '2027-01-12']) assert.deepEqual(validateBooking({ ...valid, date }, '2026-10-14'), {});
});
test('日付範囲外を拒否', () => {
  for (const date of ['2026-10-14', '2027-01-13', '9999-12-31']) assert.match(validateBooking({ ...valid, date }, '2026-10-14').date, /明日から90日後まで/);
});
test('手入力の不正日付と空欄を拒否', () => {
  for (const date of ['2026-02-30', '2026-13-01', '2026-1-2', 'abcd']) assert.match(validateBooking({ ...valid, date }, '2026-10-14').date, /有効な日付/);
  assert.match(validateBooking({ ...valid, date: '' }, '2026-10-14').date, /選択/);
});
test('月末と年越しの90日計算', () => {
  assert.equal(addLocalDays('2026-12-31', 1), '2027-01-01');
  assert.equal(addLocalDays('2026-10-14', 90), '2027-01-12');
  assert.equal(addLocalDays('2028-02-28', 1), '2028-02-29');
});
test('ローカル日付をUTC時刻への変換なしに取得', () => {
  const date = new Date(2026, 9, 14, 23, 59);
  assert.equal(localToday(date), '2026-10-14');
});
test('ラベルと入力欄のCSS色・コントラスト', () => {
  const css = fs.readFileSync('assets/css/nexus.css', 'utf8');
  assert.match(css, /\.trial \.form-field label\{color:var\(--off-white\)\}/);
  assert.match(css, /\.trial \.form-field label span\{color:#bdc3bd\}/);
  assert.match(css, /\.trial input,\.trial select,\.trial textarea\{background:var\(--off-white\);color:var\(--charcoal\)\}/);
  const luminance = hex => {
    const channels = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255).map(x => x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4);
    return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
  };
  const contrast = (a, b) => (Math.max(luminance(a), luminance(b)) + 0.05) / (Math.min(luminance(a), luminance(b)) + 0.05);
  assert.ok(contrast('#f7f6f2', '#181c1c') >= 4.5);
  assert.ok(contrast('#bdc3bd', '#181c1c') >= 4.5);
  assert.ok(contrast('#181c1c', '#f7f6f2') >= 4.5);
  assert.ok(contrast('#5d6260', '#f7f6f2') >= 4.5);
});
test('日付入力のmin/max属性を設定', () => {
  const js = fs.readFileSync('assets/js/nexus.js', 'utf8');
  assert.match(js, /dateField\.min = addLocalDays\(today, 1\)/);
  assert.match(js, /dateField\.max = addLocalDays\(today, 90\)/);
});
