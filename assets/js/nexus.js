(function (root) {
  'use strict';
  const plans = Object.freeze({ standard: 32000, premium: 56000 });
  const joiningFee = 22000;

  function calculatePrice(plan, months) {
    const count = Number(months);
    if (!Object.hasOwn(plans, plan) || !Number.isInteger(count) || count < 1 || count > 3) {
      throw new RangeError('プランまたは利用期間が無効です');
    }
    return { monthly: plans[plan], joining: joiningFee, months: count, total: joiningFee + plans[plan] * count };
  }

  function localToday(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function addLocalDays(isoDate, days) {
    const [year, month, day] = isoDate.split('-').map(Number);
    const date = new Date(Date.UTC(year, month - 1, day + days));
    return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}`;
  }

  function validDate(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const [year, month, day] = value.split('-').map(Number);
    const parsed = new Date(Date.UTC(year, month - 1, day));
    return parsed.getUTCFullYear() === year && parsed.getUTCMonth() + 1 === month && parsed.getUTCDate() === day;
  }

  function validateBooking(values, today = localToday()) {
    const errors = {};
    if (!values.name || !values.name.trim()) errors.name = '氏名を入力してください。';
    const email = (values.email || '').trim();
    if (!email) errors.email = 'メールアドレスを入力してください。';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'メールアドレスの形式を確認してください。';
    if (!values.date) errors.date = '希望日を選択してください。';
    else if (!validDate(values.date)) errors.date = '有効な日付を選択してください。';
    else if (values.date < addLocalDays(today, 1) || values.date > addLocalDays(today, 90)) errors.date = '希望日は明日から90日後までの日付を選択してください。';
    if (!['morning', 'afternoon', 'evening'].includes(values.time)) errors.time = '希望時間帯を選択してください。';
    return errors;
  }

  if (typeof module !== 'undefined' && module.exports) module.exports = { calculatePrice, validateBooking, localToday, addLocalDays };
  if (!root.document) return;
  const document = root.document;
  const formatYen = value => `${value.toLocaleString('ja-JP')}円`;
  const planSelect = document.getElementById('plan-select');
  const monthsSelect = document.getElementById('months-select');
  if (planSelect && monthsSelect) {
    function updatePrice() {
      const result = calculatePrice(planSelect.value, monthsSelect.value);
      document.getElementById('monthly-price').textContent = `${formatYen(result.monthly)} × ${result.months}か月`;
      document.getElementById('joining-price').textContent = formatYen(result.joining);
      document.getElementById('total-price').textContent = formatYen(result.total);
    }
    planSelect.addEventListener('change', updatePrice);
    monthsSelect.addEventListener('change', updatePrice);
    updatePrice();
  }

  const form = document.getElementById('trial-form');
  if (!form) return;
  const fields = ['name', 'email', 'date', 'time'];
  const dateField = form.elements.namedItem('date');
  const today = localToday();
  dateField.min = addLocalDays(today, 1);
  dateField.max = addLocalDays(today, 90);
  form.addEventListener('submit', event => {
    event.preventDefault();
    const values = Object.fromEntries(fields.map(key => [key, form.elements.namedItem(key).value]));
    const errors = validateBooking(values);
    const status = document.getElementById('form-status');
    fields.forEach(key => {
      const field = form.elements.namedItem(key);
      const message = document.getElementById(`${key}-error`);
      message.textContent = errors[key] || '';
      field.setAttribute('aria-invalid', errors[key] ? 'true' : 'false');
    });
    if (Object.keys(errors).length) {
      status.textContent = '入力内容を確認してください。';
      form.elements.namedItem(fields.find(key => errors[key])).focus();
    } else {
      status.textContent = 'デモフォームのため、予約情報は送信されていません。';
    }
  });
})(typeof window !== 'undefined' ? window : globalThis);
