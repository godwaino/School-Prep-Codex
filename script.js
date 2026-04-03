const PRIORITY_RADIUS_MILES = 10.004;
const TODAY = new Date();

const KEY_DATES = [
  { title: '11+ registration opens', date: '2026-05-07', critical: true, source: 'Warwickshire' },
  { title: '11+ registration deadline', date: '2026-06-30', critical: true, source: 'Warwickshire' },
  { title: 'Access arrangements deadline', date: '2026-06-30', critical: true, source: 'Warwickshire' },
  { title: 'Access arrangements decisions (week commencing)', date: '2026-07-13', critical: false, source: 'Warwickshire' },
  { title: 'Test invite letters (week commencing)', date: '2026-08-10', critical: false, source: 'Warwickshire' },
  { title: '11+ test date 1', date: '2026-09-12', critical: true, source: 'Warwickshire' },
  { title: '11+ test date 2', date: '2026-09-13', critical: true, source: 'Warwickshire' },
  { title: 'Results available', date: '2026-10-16', critical: true, source: 'Warwickshire' },
  { title: 'Residency evidence deadline (23:59)', date: '2026-12-31', critical: true, source: 'Lawrence Sheriff' },
  { title: 'Year 7 starts', date: '2027-09-01', critical: false, source: 'School year' },
];

const COUNTDOWN_TARGETS = [
  { label: 'Registration deadline', date: '2026-06-30' },
  { label: '11+ test date', date: '2026-09-12' },
  { label: 'Results available', date: '2026-10-16' },
  { label: 'Residency evidence deadline', date: '2026-12-31' },
];

const STUDY_PLAN = [
  'Set weekly routine (same days/times each week).',
  'Complete 2 English/VR sessions.',
  'Complete 1 NVR session.',
  'Complete 1 Maths session.',
  'Review mistakes and write 3 focus topics.',
  'Run one timed mixed paper at the weekend.',
];

const EVIDENCE_ITEMS = [
  'House proof documents ready',
  'Open day notes saved',
  'Admissions call notes saved',
  '11+ registration confirmation saved',
  'Residency evidence checklist completed',
];

const keyDatesList = document.getElementById('keyDatesList');
const setupState = document.getElementById('setupState');
const readinessBlock = document.getElementById('readinessBlock');
const countdownCards = document.getElementById('countdownCards');
const deadlineRisk = document.getElementById('deadlineRisk');
const studyPlan = document.getElementById('studyPlan');
const evidenceChecklist = document.getElementById('evidenceChecklist');
const splitOutput = document.getElementById('splitOutput');

const childName = document.getElementById('childName');
const catchmentChecked = document.getElementById('catchmentChecked');
const weeklyHours = document.getElementById('weeklyHours');
const budgetSlider = document.getElementById('budgetSlider');
const budgetOutput = document.getElementById('budgetOutput');
const parentNotes = document.getElementById('parentNotes');

function daysTo(dateStr) {
  const target = new Date(`${dateStr}T00:00:00`);
  return Math.ceil((target - TODAY) / (1000 * 60 * 60 * 24));
}

function statusTag(date) {
  const d = daysTo(date);
  if (d < 0) return 'completed';
  if (d <= 21) return 'upcoming';
  return 'future';
}

function renderKeyDates() {
  keyDatesList.innerHTML = '';
  KEY_DATES.forEach((item) => {
    const status = statusTag(item.date);
    const line = document.createElement('article');
    line.className = `date-item ${status} ${item.critical ? 'critical' : ''}`;
    line.innerHTML = `
      <div>
        <p class="date">${item.date}</p>
        <h3>${item.title}</h3>
        <p class="small">Source: ${item.source}</p>
      </div>
      <span class="pill">${status === 'completed' ? 'Completed' : status === 'upcoming' ? 'Upcoming' : 'Planned'}</span>
    `;
    keyDatesList.appendChild(line);
  });
}

function renderCountdowns() {
  countdownCards.innerHTML = '';
  COUNTDOWN_TARGETS.forEach((item) => {
    const d = daysTo(item.date);
    const card = document.createElement('article');
    card.className = 'count-card';
    card.innerHTML = `<h4>${item.label}</h4><p>${d < 0 ? 'Completed' : `${d} days`}</p><span>${item.date}</span>`;
    countdownCards.appendChild(card);
  });
}

function renderChecklist(container, list, storageKey) {
  const state = JSON.parse(localStorage.getItem(storageKey) || '{}');
  container.innerHTML = '';
  list.forEach((item, idx) => {
    const label = document.createElement('label');
    label.className = `check-item ${state[idx] ? 'done' : ''}`;
    label.innerHTML = `<input type="checkbox" data-i="${idx}" ${state[idx] ? 'checked' : ''} /> ${item}`;
    container.appendChild(label);
  });

  container.querySelectorAll('input').forEach((cb) => {
    cb.addEventListener('change', () => {
      state[cb.dataset.i] = cb.checked;
      localStorage.setItem(storageKey, JSON.stringify(state));
      renderChecklist(container, list, storageKey);
      renderReadiness();
    });
  });
}

function renderSetupState() {
  const setupDone = {
    child: Boolean(childName.value.trim()),
    catchment: catchmentChecked.checked,
    hours: Number(weeklyHours.value) > 0,
  };
  const doneCount = Object.values(setupDone).filter(Boolean).length;

  if (doneCount < 3) {
    setupState.innerHTML = `
      <p><strong>Complete these 3 steps to unlock your readiness score.</strong></p>
      <ul>
        <li>${setupDone.child ? '✅' : '⬜'} Add child details</li>
        <li>${setupDone.catchment ? '✅' : '⬜'} Check catchment eligibility</li>
        <li>${setupDone.hours ? '✅' : '⬜'} Set weekly revision hours</li>
      </ul>
    `;
  } else {
    setupState.innerHTML = '<p class="small">Setup complete. Your readiness score is now active.</p>';
  }

  localStorage.setItem('setup-state', JSON.stringify({
    childName: childName.value,
    catchmentChecked: catchmentChecked.checked,
    weeklyHours: weeklyHours.value,
  }));
}

function renderReadiness() {
  const setupDone = Boolean(childName.value.trim()) && catchmentChecked.checked && Number(weeklyHours.value) > 0;
  if (!setupDone) {
    readinessBlock.innerHTML = '<p>Finish setup above to activate readiness insights.</p>';
    return;
  }

  const studyState = JSON.parse(localStorage.getItem('study-plan') || '{}');
  const evidenceState = JSON.parse(localStorage.getItem('evidence-checklist') || '{}');
  const done = [...Object.values(studyState), ...Object.values(evidenceState)].filter(Boolean).length;
  const total = STUDY_PLAN.length + EVIDENCE_ITEMS.length;
  const score = Math.round((done / total) * 100);

  const missing = [];
  if (!Object.values(evidenceState).some(Boolean)) missing.push('Add at least one evidence item');
  if (!Object.values(studyState).some(Boolean)) missing.push('Start this week\'s revision checklist');

  const nextAction = missing[0] || 'Keep your weekly checklist momentum going.';

  readinessBlock.innerHTML = `
    <p class="score">Readiness score: ${score}%</p>
    <p>You’ve set a revision plan and checked key dates. Next: ${nextAction}</p>
    <p class="small">Why it matters: completing evidence and revision steps reduces deadline risk.</p>
  `;
}

function renderRevisionSplit() {
  const total = Number(weeklyHours.value || 0);
  splitOutput.textContent = `English/VR: ${(total * 0.5).toFixed(1)}h • NVR: ${(total * 0.25).toFixed(1)}h • Maths: ${(total * 0.25).toFixed(1)}h`;
}

function renderRisk() {
  const urgent = KEY_DATES.filter((k) => {
    const d = daysTo(k.date);
    return d >= 0 && d <= 30;
  }).length;
  const label = urgent >= 3 ? 'Deadline Risk: High — focus on key dates this month.' : urgent >= 1 ? 'Deadline Risk: Medium — at least one major item is near.' : 'Deadline Risk: Low — no major deadlines this month.';
  deadlineRisk.textContent = label;
}

function enableNotifications() {
  if (!('Notification' in window)) return alert('Notifications are not supported in this browser.');
  Notification.requestPermission().then((permission) => {
    if (permission !== 'granted') return;
    const next = KEY_DATES.find((k) => daysTo(k.date) >= 0);
    if (next) {
      new Notification(`Next key date: ${next.title}`, { body: `${next.date}` });
    }
  });
}

function downloadICS() {
  const events = KEY_DATES.map((k) => `BEGIN:VEVENT\nDTSTART;VALUE=DATE:${k.date.replaceAll('-', '')}\nSUMMARY:${k.title}\nEND:VEVENT`).join('\n');
  const text = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//LSS Planner//EN\n${events}\nEND:VCALENDAR`;
  const blob = new Blob([text], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'lss-2027-key-dates.ics';
  a.click();
  URL.revokeObjectURL(url);
}

function initTabs() {
  document.querySelectorAll('.tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach((t) => t.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach((p) => p.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(`tab-${tab.dataset.tab}`).classList.add('active');
    });
  });
}

function updateBudgetOutput() {
  budgetOutput.textContent = `£${Number(budgetSlider.value).toLocaleString('en-GB')}`;
}

function createListingLinks(e) {
  e.preventDefault();
  const area = encodeURIComponent(document.getElementById('area').value.trim());
  const beds = document.getElementById('bedrooms').value || 3;
  const budget = budgetSlider.value;
  const links = [
    { name: 'Rightmove', href: `https://www.rightmove.co.uk/property-for-sale/find.html?searchLocation=${area}&maxPrice=${budget}&minBedrooms=${beds}&radius=${PRIORITY_RADIUS_MILES}` },
    { name: 'Zoopla', href: `https://www.zoopla.co.uk/for-sale/property/${area}/?price_max=${budget}&beds_min=${beds}&radius=${PRIORITY_RADIUS_MILES}` },
    { name: 'OnTheMarket', href: `https://www.onthemarket.com/for-sale/property/${area}/?max-price=${budget}&min-bedrooms=${beds}&radius=${PRIORITY_RADIUS_MILES}` },
  ];
  document.getElementById('listingLinks').innerHTML = links.map((l) => `<a href="${l.href}" target="_blank" rel="noreferrer">Open ${l.name}</a>`).join('');
}

function hydrateSavedSetup() {
  const saved = JSON.parse(localStorage.getItem('setup-state') || '{}');
  childName.value = saved.childName || '';
  catchmentChecked.checked = Boolean(saved.catchmentChecked);
  weeklyHours.value = saved.weeklyHours || 8;
  parentNotes.value = localStorage.getItem('parent-notes') || '';
}

hydrateSavedSetup();
renderKeyDates();
renderCountdowns();
renderChecklist(studyPlan, STUDY_PLAN, 'study-plan');
renderChecklist(evidenceChecklist, EVIDENCE_ITEMS, 'evidence-checklist');
renderSetupState();
renderReadiness();
renderRevisionSplit();
renderRisk();
initTabs();
updateBudgetOutput();

[childName, catchmentChecked, weeklyHours].forEach((el) => {
  el.addEventListener('input', () => {
    renderSetupState();
    renderReadiness();
    renderRevisionSplit();
  });
});

parentNotes.addEventListener('input', () => localStorage.setItem('parent-notes', parentNotes.value));
budgetSlider.addEventListener('input', updateBudgetOutput);

document.getElementById('notifyBtn').addEventListener('click', enableNotifications);
document.getElementById('calendarBtn').addEventListener('click', downloadICS);
document.getElementById('listingForm').addEventListener('submit', createListingLinks);
document.getElementById('printStudyPlan').addEventListener('click', () => window.print());

setInterval(() => {
  renderCountdowns();
  renderRisk();
  renderKeyDates();
}, 60 * 1000);
