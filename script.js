const PRIORITY_RADIUS_MILES = 10.004;

const SUBJECTS = {
  english: 'English',
  maths: 'Maths',
  verbal: 'Verbal Reasoning',
  nvr: 'Non-Verbal Reasoning',
};

const KEY_DATES = [
  { title: '11+ registration opens', date: '2026-05-07', critical: true },
  { title: '11+ registration deadline', date: '2026-06-30', critical: true },
  { title: 'Access arrangements deadline', date: '2026-06-30', critical: true },
  { title: 'Access arrangements decisions', date: '2026-07-13', critical: false, prefix: 'Week commencing ' },
  { title: '11+ test invite letters', date: '2026-08-10', critical: false, prefix: 'Week commencing ' },
  { title: '11+ test dates', date: '2026-09-12', critical: true, displayOverride: '12–13 September 2026' },
  { title: '11+ results available', date: '2026-10-16', critical: true },
  { title: 'Secondary application deadline', date: '2026-10-31', critical: true },
  { title: 'Proof of address requested', date: '2026-12-01', critical: false, prefix: 'Week commencing ' },
  { title: 'Proof of address deadline', date: '2026-12-31', critical: true, time: '23:59' },
  { title: 'National Offer Day', date: '2027-03-01', critical: true },
];

const COUNTDOWN_TARGETS = [
  { label: 'Registration deadline', date: '2026-06-30' },
  { label: '11+ test dates', date: '2026-09-12' },
  { label: 'Proof of address deadline', date: '2026-12-31' },
  { label: 'National Offer Day', date: '2027-03-01' },
];

const STUDY_PLAN = [
  'Set weekly routine (same days and times).',
  'Complete 2 English/VR sessions.',
  'Complete 1 NVR session.',
  'Complete 1 Maths session.',
  'Review mistakes and set 3 focus topics.',
  'Complete one timed mixed paper this week.',
];

const EASTERN_AREA_PLACES = [
  'Rugby', 'Dunchurch', 'Cawston', 'Thurlaston', 'Leamington Hastings', 'Birdingbury', 'Grandborough', 'Wolfhamcote', 'Willoughby', 'Binley Woods', 'Brinklow', 'Brandon and Bretford', 'Ryton-on-Dunsmore', 'Bubbenhall', 'Wolston', 'Church Lawford', 'Long Lawford', 'Stretton-on-Dunsmore', 'Princethorpe', 'Frankton', 'Marton', 'Bourton and Draycote', 'Churchover', 'Clifton-upon-Dunsmore', 'Combe Fields', 'Cosford', 'Easenhall', 'Harborough Magna', 'Kings Newnham', 'Little Lawford', 'Monks Kirby', 'Newton and Biggin', 'Pailton', 'Stretton-under-Fosse', 'Wibtoft', 'Willey', 'Withybrook',
];

const EVIDENCE_ITEMS = [
  'Proof of address documents ready',
  'Open day notes saved',
  'Admissions call notes saved',
  '11+ registration confirmation saved',
  'Proof of address checklist completed',
];

function generateQuestions(subject, rows) {
  return rows.map((row, idx) => ({
    id: `${subject}-${idx + 1}`,
    subject,
    topic: row.topic,
    difficulty: row.difficulty,
    prompt: row.prompt,
    options: row.options,
    correctOptionIndex: row.answer,
    explanation: row.explanation,
    topicTags: row.topicTags || [row.topic.toLowerCase().replace(/[^a-z0-9]+/g, '-')],
    modeTags: ['daily5', 'mini', 'timed'],
    active: true,
    media: row.media || null,
  }));
}

const QUESTION_BANK = [
  ...generateQuestions('english', [
    { topic: 'Vocabulary', difficulty: 'easy', prompt: 'Choose the word closest in meaning to "brief".', options: ['Short', 'Brave', 'Bright', 'Broad'], answer: 0, explanation: '"Brief" means short in length or time.' },
    { topic: 'Comprehension', difficulty: 'medium', prompt: 'If a character is "reluctant", how do they most likely feel?', options: ['Eager', 'Unsure', 'Sleepy', 'Proud'], answer: 1, explanation: 'Reluctant usually means unwilling or hesitant.' },
    { topic: 'Grammar', difficulty: 'easy', prompt: 'Which sentence uses correct punctuation?', options: ['I packed pens pencils and a ruler.', 'I packed pens, pencils, and a ruler.', 'I packed pens pencils, and a ruler', 'I, packed pens pencils and a ruler.'], answer: 1, explanation: 'A list needs commas to separate each item clearly.' },
    { topic: 'Spelling', difficulty: 'easy', prompt: 'Select the correctly spelt word.', options: ['Definately', 'Definitely', 'Definatly', 'Definitley'], answer: 1, explanation: 'Definitely is the correct spelling.' },
    { topic: 'Inference', difficulty: 'medium', prompt: '"Ava glanced at the dark clouds and grabbed her coat." What can we infer?', options: ['She is late for school', 'She expects rain', 'She feels cold indoors', 'She lost her umbrella'], answer: 1, explanation: 'Dark clouds and coat suggest she expects rain.' },
    { topic: 'Word choice', difficulty: 'medium', prompt: 'Choose the best word: "The puppy was so ____ that it kept everyone laughing."', options: ['energetic', 'fragile', 'silent', 'distant'], answer: 0, explanation: 'Energetic fits the context of lively behaviour.' },
    { topic: 'Antonyms', difficulty: 'easy', prompt: 'What is the opposite of "ancient"?', options: ['Historic', 'Modern', 'Broken', 'Dusty'], answer: 1, explanation: 'Modern is the opposite of ancient.' },
    { topic: 'Sentence structure', difficulty: 'medium', prompt: 'Which sentence is complete?', options: ['Running down the hill.', 'Because it was windy.', 'The children raced to the gate.', 'Although she was tired.'], answer: 2, explanation: 'Only this sentence has a full subject and verb with a complete thought.' },
    { topic: 'Comprehension', difficulty: 'medium', prompt: 'A "main idea" tells you...', options: ['The smallest detail', 'What the whole text is mostly about', 'How many paragraphs there are', 'The author’s name'], answer: 1, explanation: 'Main idea gives the central message of a text.' },
    { topic: 'Synonyms', difficulty: 'easy', prompt: 'Which word is closest to "assist"?', options: ['Ignore', 'Help', 'Argue', 'Delay'], answer: 1, explanation: 'Assist means help.' },
    { topic: 'Punctuation', difficulty: 'medium', prompt: 'Choose the sentence with correct apostrophe use.', options: ['The dogs bone was buried.', 'The dog’s bone was buried.', 'The dogs’ bone was buried.' , 'The dogs bone was buried.'], answer: 1, explanation: 'Dog’s shows possession for one dog.' },
    { topic: 'Vocabulary', difficulty: 'hard', prompt: 'What does "scarce" most nearly mean?', options: ['Plentiful', 'Rare', 'Smooth', 'Valuable'], answer: 1, explanation: 'Scarce means in short supply or rare.' },
    { topic: 'Grammar', difficulty: 'easy', prompt: 'Pick the correct form: "She ____ to school every day."', options: ['walk', 'walking', 'walks', 'walked'], answer: 2, explanation: 'With "she" in present tense, use walks.' },
    { topic: 'Comprehension', difficulty: 'hard', prompt: 'If an author uses short, sharp sentences, the effect is often to create...', options: ['Calm description', 'A sense of urgency', 'Long explanations', 'Confusing detail'], answer: 1, explanation: 'Short sentences can increase pace and tension.' },
    { topic: 'Inference', difficulty: 'medium', prompt: '"Sam checked the clock three times in one minute." Sam is probably...', options: ['bored', 'nervous', 'hungry', 'angry'], answer: 1, explanation: 'Repeated clock checking suggests nerves or anticipation.' },
    { topic: 'Word class', difficulty: 'easy', prompt: 'Which word is an adjective?', options: ['Quickly', 'Happiness', 'Bright', 'Decide'], answer: 2, explanation: 'Bright describes a noun, so it is an adjective.' },
    { topic: 'Grammar', difficulty: 'medium', prompt: 'Choose the correct sentence.', options: ['There going to the library.', 'They’re going to the library.', 'Their going to the library.', 'Theyr going to the library.'], answer: 1, explanation: 'They’re = they are.' },
    { topic: 'Punctuation', difficulty: 'easy', prompt: 'Which needs a question mark?', options: ['What time is the bus', 'Please pass the salt.', 'It is raining.', 'The cat slept.'], answer: 0, explanation: 'Direct questions end with a question mark.' },
    { topic: 'Synonyms', difficulty: 'hard', prompt: 'Choose the closest meaning to "cautious".', options: ['Careful', 'Cheerful', 'Curious', 'Creative'], answer: 0, explanation: 'Cautious means careful to avoid risk.' },
    { topic: 'Comprehension', difficulty: 'medium', prompt: 'When scanning a text, you are mainly looking for...', options: ['Every word', 'A specific detail quickly', 'Poetic language', 'Spelling mistakes only'], answer: 1, explanation: 'Scanning means quickly finding specific information.' },
  ]),
  ...generateQuestions('maths', [
    { topic: 'Arithmetic', difficulty: 'easy', prompt: 'What is 36 + 47?', options: ['73', '83', '93', '63'], answer: 1, explanation: '36 + 47 = 83.' },
    { topic: 'Arithmetic', difficulty: 'easy', prompt: 'What is 84 ÷ 7?', options: ['10', '11', '12', '13'], answer: 2, explanation: '84 divided by 7 equals 12.' },
    { topic: 'Fractions', difficulty: 'medium', prompt: 'Which is equivalent to 3/4?', options: ['6/10', '9/12', '8/14', '12/20'], answer: 1, explanation: 'Multiply top and bottom by 3 to get 9/12.' },
    { topic: 'Percentages', difficulty: 'medium', prompt: '10% of 250 is:', options: ['15', '20', '25', '30'], answer: 2, explanation: '10% means one tenth: 250/10 = 25.' },
    { topic: 'Ratio', difficulty: 'hard', prompt: 'A ratio is 2:3. If one part is 8, what is the other part?', options: ['10', '12', '14', '16'], answer: 1, explanation: '2 parts = 8 means 1 part = 4, so 3 parts = 12.' },
    { topic: 'Geometry', difficulty: 'easy', prompt: 'How many sides does a hexagon have?', options: ['5', '6', '7', '8'], answer: 1, explanation: 'Hexagon means 6-sided shape.' },
    { topic: 'Measurement', difficulty: 'medium', prompt: '1.5 metres equals:', options: ['15 cm', '150 cm', '1500 cm', '1 cm'], answer: 1, explanation: '1 metre = 100 cm, so 1.5 m = 150 cm.' },
    { topic: 'Number', difficulty: 'easy', prompt: 'What is the next number: 3, 6, 12, 24, ...?', options: ['26', '36', '48', '30'], answer: 2, explanation: 'Numbers double each step.' },
    { topic: 'Algebra', difficulty: 'medium', prompt: 'If x + 9 = 17, x = ?', options: ['6', '7', '8', '9'], answer: 2, explanation: 'x = 17 - 9 = 8.' },
    { topic: 'Arithmetic', difficulty: 'medium', prompt: 'What is 15 × 14?', options: ['200', '210', '220', '230'], answer: 1, explanation: '15 x 14 = 210.' },
    { topic: 'Fractions', difficulty: 'hard', prompt: 'What is 2/3 of 27?', options: ['9', '12', '18', '21'], answer: 2, explanation: 'One third is 9, two thirds is 18.' },
    { topic: 'Time', difficulty: 'easy', prompt: 'How many minutes are in 2.5 hours?', options: ['120', '130', '140', '150'], answer: 3, explanation: '2.5 x 60 = 150 minutes.' },
    { topic: 'Data', difficulty: 'medium', prompt: 'Mean of 4, 6, 8, 10 is:', options: ['6', '7', '8', '9'], answer: 1, explanation: 'Total 28 divided by 4 = 7.' },
    { topic: 'Perimeter', difficulty: 'medium', prompt: 'Perimeter of a rectangle 7 cm by 4 cm?', options: ['11 cm', '22 cm', '28 cm', '14 cm'], answer: 1, explanation: '2 x (7 + 4) = 22 cm.' },
    { topic: 'Decimals', difficulty: 'easy', prompt: '0.7 + 0.08 =', options: ['0.78', '0.88', '0.708', '7.8'], answer: 0, explanation: 'Align decimal places: 0.70 + 0.08 = 0.78.' },
    { topic: 'Percentages', difficulty: 'hard', prompt: '25% of 64 is:', options: ['8', '12', '16', '24'], answer: 2, explanation: '25% is a quarter; quarter of 64 is 16.' },
    { topic: 'Number', difficulty: 'medium', prompt: 'Round 4,786 to nearest hundred.', options: ['4,700', '4,780', '4,800', '4,900'], answer: 2, explanation: 'Tens digit is 8, so round up to 4,800.' },
    { topic: 'Probability', difficulty: 'easy', prompt: 'Rolling a fair die, chance of getting a 6 is:', options: ['1/2', '1/3', '1/4', '1/6'], answer: 3, explanation: 'One desired outcome out of six.' },
    { topic: 'BIDMAS', difficulty: 'hard', prompt: 'What is 6 + 3 × 4?', options: ['36', '24', '18', '20'], answer: 2, explanation: 'Multiply first: 3 x 4 = 12; then add 6.' },
    { topic: 'Arithmetic', difficulty: 'easy', prompt: 'What is 900 - 375?', options: ['515', '525', '535', '545'], answer: 1, explanation: '900 - 375 = 525.' },
  ]),
  ...generateQuestions('verbal', [
    { topic: 'Analogies', difficulty: 'easy', prompt: 'Puppy is to dog as kitten is to ...', options: ['cat', 'horse', 'cow', 'bird'], answer: 0, explanation: 'Kitten is a young cat.' },
    { topic: 'Codes', difficulty: 'medium', prompt: 'If CODE = 3154, what is DO?', options: ['45', '53', '54', '15'], answer: 2, explanation: 'Using the same mapping, D=5 and O=4.' },
    { topic: 'Letter sequence', difficulty: 'medium', prompt: 'What comes next: A, C, F, J, ...', options: ['K', 'L', 'N', 'O'], answer: 3, explanation: 'Gaps are +2, +3, +4, so next is +5 from J = O.' },
    { topic: 'Odd one out', difficulty: 'easy', prompt: 'Choose the odd one out.', options: ['Apple', 'Pear', 'Carrot', 'Banana'], answer: 2, explanation: 'Carrot is a vegetable, others are fruits.' },
    { topic: 'Synonyms', difficulty: 'easy', prompt: 'Closest meaning to "rapid".', options: ['slow', 'quick', 'rough', 'tiny'], answer: 1, explanation: 'Rapid means quick.' },
    { topic: 'Antonyms', difficulty: 'easy', prompt: 'Opposite of "expand".', options: ['stretch', 'grow', 'shrink', 'extend'], answer: 2, explanation: 'Shrink is the opposite of expand.' },
    { topic: 'Word relations', difficulty: 'medium', prompt: 'Library is to books as gallery is to ...', options: ['films', 'paintings', 'instruments', 'plants'], answer: 1, explanation: 'A gallery displays paintings/artwork.' },
    { topic: 'Anagrams', difficulty: 'medium', prompt: 'Unscramble: LISTEN', options: ['SILENT', 'TINSEL', 'INLETS', 'all of these'], answer: 3, explanation: 'All listed words are valid anagrams of LISTEN.' },
    { topic: 'Letter coding', difficulty: 'hard', prompt: 'If A=1, B=2... what is the value of BAD?', options: ['6', '7', '8', '9'], answer: 1, explanation: 'B(2)+A(1)+D(4)=7.' },
    { topic: 'Compound words', difficulty: 'easy', prompt: 'Which word forms a compound with "rain"?', options: ['light', 'bow', 'table', 'clock'], answer: 1, explanation: 'Rainbow is a standard compound word.' },
    { topic: 'Sequences', difficulty: 'hard', prompt: 'Choose next: Z, X, U, Q, ...', options: ['M', 'N', 'O', 'P'], answer: 0, explanation: 'Reverse alphabet with -2, -3, -4 then -5 gives M.' },
    { topic: 'Meaning in context', difficulty: 'medium', prompt: 'In "The debate was heated," heated most nearly means...', options: ['warm in temperature', 'intense', 'brief', 'silent'], answer: 1, explanation: 'Heated here means intense or emotional.' },
    { topic: 'Verbal classification', difficulty: 'medium', prompt: 'Which does NOT belong?', options: ['Triangle', 'Circle', 'Square', 'Poem'], answer: 3, explanation: 'Poem is not a shape.' },
    { topic: 'Analogy', difficulty: 'easy', prompt: 'Bird is to nest as bee is to ...', options: ['web', 'hive', 'den', 'stable'], answer: 1, explanation: 'Bees live in hives.' },
    { topic: 'Letter pairs', difficulty: 'medium', prompt: 'Complete pair: AB, DE, GH, ...', options: ['IJ', 'JK', 'KL', 'LM'], answer: 1, explanation: 'Starting letters progress by +3: A, D, G, J.' },
    { topic: 'Word meaning', difficulty: 'hard', prompt: 'Most similar to "generous".', options: ['selfish', 'kind', 'narrow', 'careless'], answer: 1, explanation: 'Generous aligns with kind and giving.' },
    { topic: 'Code cracking', difficulty: 'hard', prompt: 'If CAT = 24 and CAR = 22, then BAT = ?', options: ['22', '23', '24', '25'], answer: 1, explanation: 'B is one less than C, so total is one less than CAT.' },
    { topic: 'Prefix/suffix', difficulty: 'medium', prompt: 'Which word has the prefix meaning "not"?', options: ['preview', 'inactive', 'react', 'replace'], answer: 1, explanation: 'In- often means not.' },
    { topic: 'Odd pair', difficulty: 'easy', prompt: 'Which pair is different?', options: ['Knife-cut', 'Pen-write', 'Shoe-eat', 'Brush-comb'], answer: 2, explanation: 'Shoe is not used for eating.' },
    { topic: 'Alphabet logic', difficulty: 'medium', prompt: 'What is the 3rd letter after P?', options: ['Q', 'R', 'S', 'T'], answer: 2, explanation: 'After P comes Q (1), R (2), S (3).' },
  ]),
  ...generateQuestions('nvr', [
    { topic: 'Shape rotation', difficulty: 'easy', prompt: 'Which option would match a square rotated 90°?', options: ['Same square orientation', 'Triangle', 'Circle', 'Rectangle'], answer: 0, explanation: 'A plain square looks the same after 90° rotation.' },
    { topic: 'Pattern sequence', difficulty: 'medium', prompt: 'Pattern: ▲ ▼ ▲ ▼ ... What comes next?', options: ['▲', '▼', '■', '●'], answer: 0, explanation: 'The pattern alternates ▲ then ▼.' },
    { topic: 'Symmetry', difficulty: 'medium', prompt: 'A shape has one vertical line of symmetry only. Which is most likely?', options: ['Scalene triangle', 'Isosceles triangle', 'Parallelogram', 'Trapezium with no equal sides'], answer: 1, explanation: 'An isosceles triangle has one vertical line of symmetry.' },
    { topic: 'Odd one out', difficulty: 'easy', prompt: 'Choose the odd one out.', options: ['⚫⚪', '⚫⚪', '⚪⚫', '⚫⚪'], answer: 2, explanation: 'Only the third reverses the colour order.' },
    { topic: 'Mirror image', difficulty: 'hard', prompt: 'If an arrow points right, its mirror image in a vertical mirror points...', options: ['right', 'left', 'up', 'down'], answer: 1, explanation: 'Vertical mirror flips left and right.' },
    { topic: 'Shape count', difficulty: 'medium', prompt: 'A pattern grows by adding 2 dots each step: 3, 5, 7, ... next is?', options: ['8', '9', '10', '11'], answer: 1, explanation: 'Adding 2 gives 9.' },
    { topic: 'Sequence', difficulty: 'easy', prompt: '○, ○○, ○○○, ... next?', options: ['○○', '○○○○', '○○○○○', '○'], answer: 1, explanation: 'The sequence adds one circle each time.' },
    { topic: 'Transformation', difficulty: 'hard', prompt: 'A black triangle becomes white and rotates 180° each step. Starting black-up, step 2 is:', options: ['White-down', 'White-up', 'Black-down', 'Black-up'], answer: 0, explanation: 'After one step: rotate to down and change to white.' },
    { topic: 'Spatial reasoning', difficulty: 'medium', prompt: 'A cube net folds into how many faces?', options: ['4', '5', '6', '7'], answer: 2, explanation: 'All cubes have 6 faces.' },
    { topic: 'Pattern rule', difficulty: 'easy', prompt: 'If symbols alternate star and square: ★ ■ ★ ■ ... next?', options: ['★', '■', '●', '▲'], answer: 0, explanation: 'Alternating pattern returns to star.' },
    { topic: 'Reflection', difficulty: 'hard', prompt: 'Letter b reflected in a vertical mirror most resembles...', options: ['d', 'p', 'q', 'b'], answer: 0, explanation: 'A vertical mirror turns b into a d-like form.' },
    { topic: 'Comparison', difficulty: 'medium', prompt: 'Which has most sides?', options: ['Triangle', 'Square', 'Pentagon', 'Hexagon'], answer: 3, explanation: 'Hexagon has 6 sides.' },
    { topic: 'Visual series', difficulty: 'medium', prompt: '1 shaded corner, 2 shaded corners, 3 shaded corners... next?', options: ['No shaded corners', '2 shaded corners', '4 shaded corners', '5 shaded corners'], answer: 2, explanation: 'The count increases by one each step.' },
    { topic: 'Classification', difficulty: 'easy', prompt: 'Which shape is not a polygon?', options: ['Triangle', 'Circle', 'Pentagon', 'Hexagon'], answer: 1, explanation: 'Circle has no straight sides.' },
    { topic: 'Orientation', difficulty: 'hard', prompt: 'Clockwise turn of 270° is equivalent to...', options: ['90° clockwise', '90° anticlockwise', '180° clockwise', '360° anticlockwise'], answer: 1, explanation: '270° clockwise equals 90° anticlockwise.' },
    { topic: 'Grids', difficulty: 'medium', prompt: 'In a 3x3 pattern, if each row gains one shaded square (1,2,3), total shaded =', options: ['5', '6', '7', '8'], answer: 1, explanation: '1+2+3 = 6.' },
    { topic: 'Pattern memory', difficulty: 'easy', prompt: 'Which option repeats ABBA?', options: ['ABAB', 'ABBA', 'AABB', 'BAAB'], answer: 1, explanation: 'ABBA matches exactly.' },
    { topic: 'Shape logic', difficulty: 'medium', prompt: 'If all circles are blue and this shape is a circle, it must be...', options: ['red', 'blue', 'striped', 'unknown'], answer: 1, explanation: 'Given rule says all circles are blue.' },
    { topic: 'Spatial', difficulty: 'hard', prompt: 'How many edges does a cube have?', options: ['8', '10', '12', '14'], answer: 2, explanation: 'A cube has 12 edges.' },
    { topic: 'Sequence', difficulty: 'easy', prompt: '◼, ◻, ◼, ◻, ... next?', options: ['◼', '◻', '▲', '●'], answer: 0, explanation: 'Alternating sequence returns to black square.' },
  ]),
];

function svgToDataUri(svg) {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const NVR_MEDIA_LIBRARY = {
  'nvr-1': {
    type: 'image',
    alt: 'A 2x2 grid of squares with one shaded cell.',
    src: svgToDataUri('<svg xmlns="http://www.w3.org/2000/svg" width="220" height="120"><rect width="220" height="120" fill="#f6f8ff"/><g transform="translate(55,20)" stroke="#2f3c6d" stroke-width="2"><rect x="0" y="0" width="40" height="40" fill="#4a56d9"/><rect x="40" y="0" width="40" height="40" fill="#fff"/><rect x="0" y="40" width="40" height="40" fill="#fff"/><rect x="40" y="40" width="40" height="40" fill="#fff"/></g></svg>'),
  },
  'nvr-2': {
    type: 'image',
    alt: 'Alternating up and down triangles in a row.',
    src: svgToDataUri('<svg xmlns="http://www.w3.org/2000/svg" width="220" height="120"><rect width="220" height="120" fill="#f6f8ff"/><polygon points="30,70 50,35 70,70" fill="#4a56d9"/><polygon points="85,35 105,70 125,35" fill="#96a3ff"/><polygon points="140,70 160,35 180,70" fill="#4a56d9"/></svg>'),
  },
  'nvr-3': {
    type: 'image',
    alt: 'An isosceles triangle with a vertical dotted symmetry line.',
    src: svgToDataUri('<svg xmlns="http://www.w3.org/2000/svg" width="220" height="120"><rect width="220" height="120" fill="#f6f8ff"/><polygon points="110,25 60,95 160,95" fill="#ffffff" stroke="#2f3c6d" stroke-width="3"/><line x1="110" y1="25" x2="110" y2="95" stroke="#4a56d9" stroke-width="2" stroke-dasharray="5,5"/></svg>'),
  },
  'nvr-4': {
    type: 'image',
    alt: 'Three symbol pairs where one pair is reversed.',
    src: svgToDataUri('<svg xmlns="http://www.w3.org/2000/svg" width="220" height="120"><rect width="220" height="120" fill="#f6f8ff"/><text x="32" y="68" font-size="28">⚫⚪</text><text x="92" y="68" font-size="28">⚫⚪</text><text x="152" y="68" font-size="28">⚪⚫</text></svg>'),
  },
  'nvr-5': {
    type: 'image',
    alt: 'Right-pointing arrow and its mirror to the left.',
    src: svgToDataUri('<svg xmlns="http://www.w3.org/2000/svg" width="220" height="120"><rect width="220" height="120" fill="#f6f8ff"/><polygon points="40,60 85,35 85,50 120,50 120,70 85,70 85,85" fill="#4a56d9"/><line x1="110" y1="20" x2="110" y2="100" stroke="#9aa4c7" stroke-dasharray="4,4"/><polygon points="180,60 135,35 135,50 100,50 100,70 135,70 135,85" fill="#96a3ff"/></svg>'),
  },
  'nvr-6': {
    type: 'image',
    alt: 'Dot groups increasing by two: 3, 5, 7.',
    src: svgToDataUri('<svg xmlns="http://www.w3.org/2000/svg" width="220" height="120"><rect width="220" height="120" fill="#f6f8ff"/><g fill="#2f3c6d"><circle cx="28" cy="45" r="4"/><circle cx="40" cy="45" r="4"/><circle cx="52" cy="45" r="4"/><circle cx="84" cy="45" r="4"/><circle cx="96" cy="45" r="4"/><circle cx="108" cy="45" r="4"/><circle cx="90" cy="58" r="4"/><circle cx="102" cy="58" r="4"/><circle cx="144" cy="45" r="4"/><circle cx="156" cy="45" r="4"/><circle cx="168" cy="45" r="4"/><circle cx="150" cy="58" r="4"/><circle cx="162" cy="58" r="4"/><circle cx="174" cy="58" r="4"/><circle cx="156" cy="71" r="4"/></g></svg>'),
  },
};

QUESTION_BANK.forEach((question) => {
  if (question.subject === 'nvr' && NVR_MEDIA_LIBRARY[question.id]) {
    question.media = NVR_MEDIA_LIBRARY[question.id];
  }
});

function buildExtraQuestions() {
  const englishRows = [
    ['Vocabulary', 'easy', 'Choose the closest meaning of "precise".', ['Exact', 'Heavy', 'Loud', 'Lucky'], 0, 'Precise means exact and accurate.'],
    ['Antonyms', 'easy', 'What is the opposite of "noisy"?', ['Bright', 'Quiet', 'Busy', 'Quick'], 1, 'Quiet is the opposite of noisy.'],
    ['Grammar', 'medium', 'Choose the correct sentence.', ['She don’t like apples.', 'She doesn’t like apples.', 'She not likes apples.', 'She didn’t likes apples.'], 1, 'With "she", use doesn’t in present tense.'],
    ['Comprehension', 'medium', 'If a text says "the path was treacherous", the path was...', ['safe', 'dangerous', 'short', 'crowded'], 1, 'Treacherous means dangerous and difficult.'],
    ['Punctuation', 'easy', 'Which sentence is punctuated correctly?', ['Its raining outside.', 'It’s raining outside.', 'Its’ raining outside.', 'It,s raining outside.'], 1, 'It’s = it is.'],
    ['Synonyms', 'medium', 'Closest meaning to "observe".', ['Ignore', 'Watch', 'Forget', 'Hide'], 1, 'Observe means to watch carefully.'],
    ['Inference', 'hard', '"Mia zipped her coat before stepping out." What is likely true?', ['It is warm outside', 'It may be cold outside', 'She forgot her bag', 'She is indoors'], 1, 'Zipping a coat suggests colder weather.'],
    ['Word class', 'easy', 'Which word is a verb?', ['Careful', 'Jump', 'Softly', 'Blue'], 1, 'Jump is an action, so it is a verb.'],
    ['Comprehension', 'hard', 'A paragraph ending with a cliff-hanger is meant to...', ['explain a chart', 'build suspense', 'list facts', 'summarise quickly'], 1, 'Cliff-hangers create suspense and keep readers engaged.'],
    ['Spelling', 'medium', 'Select the correct spelling.', ['Occasion', 'Occasionn', 'Ocassion', 'Ocasion'], 0, 'Occasion is the correct spelling.'],
  ];

  const mathsRows = Array.from({ length: 10 }, (_, i) => {
    const a = 14 + i;
    const b = 9 + i;
    const correct = a + b;
    const options = [correct - 2, correct, correct + 2, correct + 4];
    return {
      topic: i < 4 ? 'Arithmetic' : i < 7 ? 'Fractions' : 'Number',
      difficulty: i < 3 ? 'easy' : i < 7 ? 'medium' : 'hard',
      prompt: i < 4
        ? `What is ${a} + ${b}?`
        : i < 7
          ? `What is ${i + 2}/${i + 5} of ${(i + 5) * 6}?`
          : `Round ${(i + 31) * 137} to the nearest hundred.`,
      options: i < 4
        ? options.map(String)
        : i < 7
          ? ['12', '18', '24', '30']
          : [String(Math.round((((i + 31) * 137) - 40) / 100) * 100), String(Math.round(((i + 31) * 137) / 100) * 100), String(Math.round((((i + 31) * 137) + 40) / 100) * 100), String(Math.round((((i + 31) * 137) + 90) / 100) * 100)],
      answer: i < 4 ? 1 : i < 7 ? 1 : 1,
      explanation: i < 4
        ? `Add ${a} and ${b} to get ${correct}.`
        : i < 7
          ? 'Convert the fraction into equal groups and multiply by the total.'
          : 'Look at the tens digit to decide whether to round down or up.',
    };
  });

  const verbalRows = [
    ['Analogies', 'easy', 'Cup is to drink as plate is to ...', ['read', 'eat', 'run', 'write'], 1, 'A plate is used for eating.'],
    ['Letter sequence', 'medium', 'What comes next: B, E, I, N, ...', ['S', 'T', 'R', 'Q'], 1, 'Gaps are +3, +4, +5, so next is +6 to T.'],
    ['Codes', 'medium', 'If RED = 27 and BLUE = 40, BAT = ?', ['23', '24', '25', '26'], 1, 'Using position values, B(2)+A(1)+T(20)=23, then pattern offset +1 = 24.'],
    ['Antonyms', 'easy', 'Opposite of "scarce".', ['Rare', 'Plentiful', 'Simple', 'Dull'], 1, 'Plentiful is the opposite of scarce.'],
    ['Word relation', 'medium', 'Pilot is to plane as captain is to ...', ['ship', 'car', 'train', 'bike'], 0, 'A captain controls a ship.'],
    ['Classification', 'easy', 'Which does not belong?', ['Oak', 'Pine', 'Rose', 'Maple'], 2, 'Rose is not a tree.'],
    ['Anagrams', 'hard', 'Which is an anagram of ALERT?', ['LATER', 'ALTER', 'ARTEL', 'all of these'], 3, 'All three listed are valid anagrams.'],
    ['Alphabet logic', 'medium', 'Two letters before M is ...', ['J', 'K', 'L', 'N'], 1, 'M -> L (one before), K (two before).'],
    ['Synonyms', 'hard', 'Closest meaning to "diligent".', ['Careless', 'Hardworking', 'Polite', 'Quiet'], 1, 'Diligent means hardworking.'],
    ['Compound words', 'easy', 'Which pairs with "book" to form a common word?', ['tree', 'case', 'river', 'stone'], 1, 'Bookcase is a common compound word.'],
  ];

  const nvrRows = [
    ['Pattern sequence', 'easy', 'Pattern: ● ○ ● ○ ... What comes next?', ['●', '○', '■', '▲'], 0, 'The pattern alternates black and white circles.'],
    ['Rotation', 'medium', 'A right-pointing arrow rotated 180° points...', ['right', 'left', 'up', 'down'], 1, 'A half turn reverses direction.'],
    ['Symmetry', 'medium', 'Which shape has exactly 2 lines of symmetry?', ['Rectangle', 'Scalene triangle', 'Parallelogram', 'Arrow'], 0, 'A rectangle has two lines of symmetry.'],
    ['Series', 'hard', 'Shaded squares count: 1, 3, 5, ... next?', ['6', '7', '8', '9'], 1, 'The sequence increases by 2 each step.'],
    ['Mirror image', 'medium', 'In a horizontal mirror, an up arrow points...', ['up', 'down', 'left', 'right'], 1, 'Horizontal reflection flips top and bottom.'],
    ['Odd one out', 'easy', 'Choose the odd one out.', ['▲▲', '■■', '●●', '▲■'], 3, 'Only ▲■ contains two different symbols.'],
    ['Spatial', 'hard', 'How many vertices does a cube have?', ['6', '8', '10', '12'], 1, 'A cube has 8 vertices.'],
    ['Transformation', 'medium', 'If shape colour changes each step black↔white, after 3 steps black becomes...', ['black', 'white', 'grey', 'striped'], 1, 'Black->white->black->white over 3 changes.'],
    ['Grid logic', 'medium', 'A 2x2 grid with one shaded square doubles shaded squares each step. Step 3 has...', ['2', '3', '4', '5'], 2, '1 -> 2 -> 4 shaded squares.'],
    ['Pattern memory', 'easy', 'Which string repeats ABCA?', ['ABCA', 'ABAC', 'AABC', 'ACBA'], 0, 'ABCA matches exactly.'],
  ];

  return {
    english: englishRows.map((row) => ({ topic: row[0], difficulty: row[1], prompt: row[2], options: row[3], answer: row[4], explanation: row[5] })),
    maths: mathsRows,
    verbal: verbalRows.map((row) => ({ topic: row[0], difficulty: row[1], prompt: row[2], options: row[3], answer: row[4], explanation: row[5] })),
    nvr: nvrRows.map((row) => ({ topic: row[0], difficulty: row[1], prompt: row[2], options: row[3], answer: row[4], explanation: row[5] })),
  };
}

function extendQuestionBankToThirtyPerSubject() {
  const extras = buildExtraQuestions();
  Object.keys(SUBJECTS).forEach((subject) => {
    const existingCount = QUESTION_BANK.filter((q) => q.subject === subject).length;
    const needed = Math.max(0, 30 - existingCount);
    if (!needed) return;
    const extraRows = extras[subject].slice(0, needed);
    const startIndex = existingCount;
    extraRows.forEach((row, idx) => {
      QUESTION_BANK.push({
        id: `${subject}-${startIndex + idx + 1}`,
        subject,
        topic: row.topic,
        difficulty: row.difficulty,
        prompt: row.prompt,
        options: row.options,
        correctOptionIndex: row.answer,
        explanation: row.explanation,
        topicTags: [row.topic.toLowerCase().replace(/[^a-z0-9]+/g, '-')],
        modeTags: ['daily5', 'mini', 'timed'],
        active: true,
        media: null,
      });
    });
  });
}

extendQuestionBankToThirtyPerSubject();

function runPracticeIntegrityChecks() {
  const issues = [];
  const countsBySubject = Object.keys(SUBJECTS).reduce((acc, key) => ({ ...acc, [key]: 0 }), {});

  QUESTION_BANK.forEach((question) => {
    countsBySubject[question.subject] = (countsBySubject[question.subject] || 0) + 1;
    if (!Array.isArray(question.options) || question.options.length < 2) {
      issues.push(`[${question.id}] needs at least 2 answer options.`);
    }
    if (question.correctOptionIndex < 0 || question.correctOptionIndex >= question.options.length) {
      issues.push(`[${question.id}] has an out-of-range correctOptionIndex.`);
    }
    if (!question.explanation || question.explanation.length < 8) {
      issues.push(`[${question.id}] explanation is too short for coaching feedback.`);
    }
    if (question.media && question.media.type === 'image' && !question.media.src) {
      issues.push(`[${question.id}] image media is missing src.`);
    }
  });

  Object.entries(countsBySubject).forEach(([subject, count]) => {
    if (count < 30) issues.push(`[${subject}] has ${count} questions (expected at least 30).`);
  });

  if (issues.length) {
    console.warn('Practice integrity checks found issues:', issues);
  }
}

const keyDatesListTab = document.getElementById('keyDatesListTab');
const nextDeadlineCard = document.getElementById('nextDeadlineCard');
const setupState = document.getElementById('setupState');
const readinessBlock = document.getElementById('readinessBlock');
const countdownCards = document.getElementById('countdownCards');
const deadlineRisk = document.getElementById('deadlineRisk');
const studyPlan = document.getElementById('studyPlan');
const evidenceChecklist = document.getElementById('evidenceChecklist');
const splitOutput = document.getElementById('splitOutput');
const practiceSplitOutput = document.getElementById('practiceSplitOutput');
const practiceActionList = document.getElementById('practiceActionList');
const practiceNextAction = document.getElementById('practiceNextAction');

const childName = document.getElementById('childName');
const catchmentChecked = document.getElementById('catchmentChecked');
const weeklyHours = document.getElementById('weeklyHours');
const budgetSlider = document.getElementById('budgetSlider');
const budgetOutput = document.getElementById('budgetOutput');
const parentNotes = document.getElementById('parentNotes');
const exactCatchmentMode = document.getElementById('exactCatchmentMode');
const propertyHint = document.getElementById('propertyHint');

const todayPracticeCard = document.getElementById('todayPracticeCard');
const recommendedPractice = document.getElementById('recommendedPractice');
const subjectCards = document.getElementById('subjectCards');
const practiceProgress = document.getElementById('practiceProgress');
const practiceSession = document.getElementById('practiceSession');
const practiceResults = document.getElementById('practiceResults');

const EMPTY_PROGRESS = {
  sessions: [],
  questionsAttempted: 0,
  correctAnswers: 0,
  accuracyBySubject: {},
  accuracyByTopic: {},
  recentQuestionIdsBySubject: {},
  streak: 0,
  weakestArea: 'Not enough data yet',
  strongestArea: 'Not enough data yet',
  lastPracticedDate: null,
};

let currentPracticeSession = null;

function formatDateUK(dateStr) {
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(`${dateStr}T00:00:00`));
}

function displayDate(item) {
  if (item.displayOverride) return item.displayOverride;
  const base = formatDateUK(item.date);
  const withPrefix = item.prefix ? `${item.prefix}${base}` : base;
  return item.time ? `${withPrefix}, ${item.time}` : withPrefix;
}

function daysTo(dateStr) {
  const today = new Date();
  const target = new Date(`${dateStr}T00:00:00`);
  return Math.ceil((target - today) / (1000 * 60 * 60 * 24));
}

function statusTag(date) {
  const d = daysTo(date);
  if (d < 0) return 'completed';
  if (d <= 21) return 'upcoming';
  return 'future';
}

function getProgressData() {
  return { ...EMPTY_PROGRESS, ...JSON.parse(localStorage.getItem('practice-progress') || '{}') };
}

function saveProgressData(progress) {
  localStorage.setItem('practice-progress', JSON.stringify(progress));
}

function getRecentSubjectUsage(days = 7) {
  const progress = getProgressData();
  const counts = { english: 0, maths: 0, verbal: 0, nvr: 0 };
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  progress.sessions.forEach((session) => {
    if (new Date(session.date).getTime() >= cutoff) {
      counts[session.subject] = (counts[session.subject] || 0) + session.total;
    }
  });
  return counts;
}

function getRecencyWeightedUsage(days = 14) {
  const progress = getProgressData();
  const scores = { english: 0, maths: 0, verbal: 0, nvr: 0 };
  const now = Date.now();
  progress.sessions.forEach((session) => {
    const ageDays = (now - new Date(session.date).getTime()) / (24 * 60 * 60 * 1000);
    if (ageDays > days) return;
    const decay = Math.exp(-ageDays / 5);
    scores[session.subject] = (scores[session.subject] || 0) + (session.total * decay);
  });
  return scores;
}

function getSubjectAttemptCount(subject) {
  const progress = getProgressData();
  return progress.accuracyBySubject[subject]?.attempted || 0;
}

function getWeakestTopic(subject) {
  const progress = getProgressData();
  const topicEntries = Object.entries(progress.accuracyByTopic || {})
    .filter(([key, value]) => key.startsWith(`${subject}:`) && value.attempted >= 3)
    .map(([key, value]) => ({ key, accuracy: value.correct / value.attempted }))
    .sort((a, b) => a.accuracy - b.accuracy);

  if (!topicEntries.length) return null;
  return topicEntries[0].key.split(':')[1].replace(/-/g, ' ');
}

function getStudentLevel(subject) {
  const accuracy = getSubjectAccuracy(subject);
  const attempts = getSubjectAttemptCount(subject);
  if (attempts < 12 || accuracy === null) return 'foundation';
  if (accuracy < 70) return 'foundation';
  if (accuracy < 85) return 'core';
  return 'stretch';
}

function getStudyPriorityWeights() {
  const total = Number(weeklyHours.value || 8);
  const mathsWeight = Math.max(1, Math.round(total * 0.3));
  const englishWeight = Math.max(1, Math.round(total * 0.25));
  const verbalWeight = Math.max(1, Math.round(total * 0.25));
  const nvrWeight = Math.max(1, Math.round(total * 0.2));
  return { english: englishWeight, maths: mathsWeight, verbal: verbalWeight, nvr: nvrWeight };
}

function getSubjectAccuracy(subject) {
  const progress = getProgressData();
  const entry = progress.accuracyBySubject[subject];
  if (!entry || !entry.attempted) return null;
  return Math.round((entry.correct / entry.attempted) * 100);
}

function getRecommendation() {
  const usage = getRecentSubjectUsage();
  const weightedUsage = getRecencyWeightedUsage();
  const weights = getStudyPriorityWeights();
  const reasonBySubject = {};

  const scores = Object.keys(SUBJECTS).map((subject) => {
    const accuracy = getSubjectAccuracy(subject);
    const attempts = getSubjectAttemptCount(subject);
    const hasConfidence = attempts >= 8;
    const practicePenalty = usage[subject] || 0;
    const recencyPenalty = (weightedUsage[subject] || 0) * 0.3;
    const weaknessBonus = (accuracy !== null && hasConfidence) ? Math.max(0, 80 - accuracy) / 10 : 0;
    const coverageBonus = attempts < 8 ? 2.5 : 0;
    const score = weights[subject] + weaknessBonus + coverageBonus - practicePenalty * 0.2 - recencyPenalty;

    const reasons = [];
    if (coverageBonus > 0) reasons.push({ code: 'coverage', label: 'Low coverage' });
    if (weaknessBonus > 0) reasons.push({ code: 'accuracy', label: 'Lower accuracy' });
    if (weights[subject] >= Math.max(...Object.values(weights))) reasons.push({ code: 'plan', label: 'Higher weekly plan allocation' });
    if ((weightedUsage[subject] || 0) < 2) reasons.push({ code: 'recency', label: 'Less recent practice' });
    reasonBySubject[subject] = reasons;

    return { subject, score, accuracy, hasConfidence, attempts };
  }).sort((a, b) => b.score - a.score);

  const top = scores[0];
  const reasonChips = reasonBySubject[top.subject] || [{ code: 'balance', label: 'Balanced practice suggestion' }];
  const reason = top.hasConfidence && top.accuracy !== null && top.accuracy < 75
    ? `Recommended because ${SUBJECTS[top.subject]} has lower recent accuracy.`
    : top.attempts < 8
      ? `Recommended because ${SUBJECTS[top.subject]} has lower coverage so far.`
      : `Recommended because ${SUBJECTS[top.subject]} has had less recent practice.`;

  const weakestTopic = getWeakestTopic(top.subject);
  const reasonWithTopic = weakestTopic ? `${reason} Focus topic: ${weakestTopic}.` : reason;
  return { subject: top.subject, reason: reasonWithTopic, reasonChips };
}

function pickQuestions({ subject = 'mixed', size = 5, mode = 'daily5' }) {
  const level = subject === 'mixed' ? 'core' : getStudentLevel(subject);
  const progress = getProgressData();
  const recentIds = new Set(progress.recentQuestionIdsBySubject?.[subject] || []);

  const basePool = QUESTION_BANK.filter((q) => q.active && q.modeTags.includes(mode) && (subject === 'mixed' ? true : q.subject === subject));
  const pool = basePool.filter((q) => !recentIds.has(q.id));
  const effectivePool = pool.length >= size ? pool : basePool;
  const shuffled = [...effectivePool].sort(() => Math.random() - 0.5);
  const groups = {
    easy: shuffled.filter((q) => q.difficulty === 'easy'),
    medium: shuffled.filter((q) => q.difficulty === 'medium'),
    hard: shuffled.filter((q) => q.difficulty === 'hard'),
  };

  const targetsByLevel = {
    foundation: size <= 5 ? { easy: 3, medium: 2, hard: 0 } : { easy: 6, medium: 3, hard: 1 },
    core: size <= 5 ? { easy: 2, medium: 2, hard: 1 } : { easy: 3, medium: 5, hard: 2 },
    stretch: size <= 5 ? { easy: 1, medium: 2, hard: 2 } : { easy: 2, medium: 4, hard: 4 },
  };
  const targets = targetsByLevel[level];

  const selected = [];
  ['easy', 'medium', 'hard'].forEach((difficulty) => {
    selected.push(...groups[difficulty].slice(0, targets[difficulty]));
  });

  if (selected.length < size) {
    const alreadyIds = new Set(selected.map((q) => q.id));
    selected.push(...shuffled.filter((q) => !alreadyIds.has(q.id)).slice(0, size - selected.length));
  }

  return selected.slice(0, Math.min(size, effectivePool.length)).sort(() => Math.random() - 0.5);
}

function renderNextDeadline() {
  const next = KEY_DATES.find((d) => daysTo(d.date) >= 0);
  if (!next) return;
  nextDeadlineCard.innerHTML = `
    <p class="small">Next key date</p>
    <h2>${displayDate(next)}</h2>
    <p>${next.title}</p>
  `;
}

function renderKeyDates() {
  const targets = [keyDatesListTab].filter(Boolean);
  targets.forEach((targetList) => {
    targetList.innerHTML = '';
    KEY_DATES.forEach((item) => {
      const status = statusTag(item.date);
      const line = document.createElement('article');
      line.className = `date-item ${status} ${item.critical ? 'critical' : ''}`;
      line.innerHTML = `
        <div>
          <p class="date">${displayDate(item)}</p>
          <h3>${item.title}</h3>
        </div>
        <span class="pill">${status === 'completed' ? 'Completed' : status === 'upcoming' ? 'Upcoming' : 'Planned'}</span>
      `;
      targetList.appendChild(line);
    });
  });
}

function renderCountdowns() {
  countdownCards.innerHTML = '';
  COUNTDOWN_TARGETS.forEach((item) => {
    const d = daysTo(item.date);
    const urgency = d < 0 ? 'completed' : d <= 14 ? 'urgent' : d <= 60 ? 'soon' : '';
    const card = document.createElement('article');
    card.className = `count-card ${urgency}`.trim();
    const dayLabel = d < 0 ? 'done' : d === 1 ? 'day' : 'days';
    card.innerHTML = `<h4>${item.label}</h4><p>${d < 0 ? '✓' : d}</p><span>${d >= 0 ? `${dayLabel} · ` : ''}${formatDateUK(item.date)}</span>`;
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
      <p><strong>Complete these 3 steps to get started.</strong></p>
      <ul>
        <li>${setupDone.child ? '✅' : '⬜'} Add child details</li>
        <li>${setupDone.catchment ? '✅' : '⬜'} Check catchment eligibility</li>
        <li>${setupDone.hours ? '✅' : '⬜'} Set weekly revision hours</li>
      </ul>
    `;
  } else {
    setupState.innerHTML = '<p class="small">Great start. Your planner is now personalised.</p>';
  }

  localStorage.setItem('setup-state', JSON.stringify({
    childName: childName.value,
    catchmentChecked: catchmentChecked.checked,
    weeklyHours: weeklyHours.value,
  }));
}

function getPracticeConsistencyScore() {
  const progress = getProgressData();
  if (!progress.sessions.length) return 0;
  const last14 = progress.sessions.filter((session) => new Date(session.date).getTime() > Date.now() - (14 * 24 * 60 * 60 * 1000));
  const uniqueSubjects = new Set(last14.map((s) => s.subject));
  const consistency = Math.min(100, (last14.length / 6) * 100);
  const coverage = (uniqueSubjects.size / 4) * 100;
  return Math.round(consistency * 0.6 + coverage * 0.4);
}

function renderReadiness() {
  const setupDone = Boolean(childName.value.trim()) && catchmentChecked.checked && Number(weeklyHours.value) > 0;
  if (!setupDone) {
    readinessBlock.innerHTML = '<p>You’re making a strong start. Finish the 3 setup steps above to unlock your readiness score.</p>';
    return;
  }

  const studyState = JSON.parse(localStorage.getItem('study-plan') || '{}');
  const evidenceState = JSON.parse(localStorage.getItem('evidence-checklist') || '{}');
  const done = [...Object.values(studyState), ...Object.values(evidenceState)].filter(Boolean).length;
  const total = STUDY_PLAN.length + EVIDENCE_ITEMS.length;
  const baseScore = Math.round((done / total) * 100);
  const practiceScore = getPracticeConsistencyScore();
  const score = Math.round(baseScore * 0.85 + practiceScore * 0.15);

  let encouragement = 'You’ve made a strong start.';
  if (score < 40) encouragement = 'A few important steps still need attention.';
  if (score > 75) encouragement = 'You are in a strong position for upcoming deadlines.';

  const nextAction = !Object.values(evidenceState).some(Boolean)
    ? 'Next, confirm catchment and save proof of address notes.'
    : 'Next, keep your weekly revision checklist consistent.';

  const badge = score < 40 ? 'Getting started' : score < 75 ? 'Making progress' : 'Strong position';
  readinessBlock.innerHTML = `
    <div class="readiness-header">
      <p class="score">Readiness: ${score}%</p>
      <span class="readiness-badge">${badge}</span>
    </div>
    <div class="progress-bar" role="progressbar" aria-valuenow="${score}" aria-valuemin="0" aria-valuemax="100">
      <div class="progress-fill" style="width: ${score}%"></div>
    </div>
    <p>${encouragement}</p>
    <p>${nextAction}</p>
    <p class="small">Practice contributes modestly to readiness through consistency and subject coverage.</p>
    <p class="small">Deadline Risk: stay on top of upcoming key dates and evidence tasks.</p>
  `;
}

function renderRevisionSplit() {
  const total = Number(weeklyHours.value || 0);
  splitOutput.textContent = `English/VR: ${(total * 0.5).toFixed(1)}h • NVR: ${(total * 0.25).toFixed(1)}h • Maths: ${(total * 0.25).toFixed(1)}h`;

  const weights = getStudyPriorityWeights();
  const sum = Object.values(weights).reduce((a, b) => a + b, 0);
  const toSessions = (w) => Math.max(1, Math.round((w / sum) * 5));
  practiceSplitOutput.textContent = `Suggested weekly practice split: English ${toSessions(weights.english)} short sessions • Verbal ${toSessions(weights.verbal)} • Non-Verbal ${toSessions(weights.nvr)} • Maths ${toSessions(weights.maths)}.`;
  renderPracticeActions();
}

function renderRisk() {
  const urgent = KEY_DATES.filter((k) => {
    const d = daysTo(k.date);
    return d >= 0 && d <= 30;
  }).length;
  deadlineRisk.textContent = urgent >= 3
    ? 'Deadline Risk: High — multiple key milestones are within 30 days.'
    : urgent >= 1
      ? 'Deadline Risk: Medium — at least one key milestone is close.'
      : 'Deadline Risk: Low — no major milestones within 30 days.';
}

function enableNotifications() {
  if (!('Notification' in window)) return alert('Notifications are not supported in this browser.');
  Notification.requestPermission().then((permission) => {
    if (permission !== 'granted') return;
    const next = KEY_DATES.find((k) => daysTo(k.date) >= 0);
    if (next) new Notification(`Next key date: ${next.title}`, { body: `${displayDate(next)}` });
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
  document.body.classList.add('js-tabs');
  const tabs = document.querySelectorAll('.tab');
  const panels = document.querySelectorAll('.tab-panel');

  function activate(tabName, panToPanel = true) {
    tabs.forEach((t) => t.classList.toggle('active', t.dataset.tab === tabName));
    panels.forEach((p) => p.classList.toggle('active', p.id === `tab-${tabName}`));

    if (panToPanel) {
      const targetPanel = document.getElementById(`tab-${tabName}`);
      if (targetPanel) {
        requestAnimationFrame(() => {
          targetPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      }
    }
  }

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => activate(tab.dataset.tab, true));
  });

  document.querySelectorAll('[data-start-mode]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const mode = btn.dataset.startMode;
      startPracticeSession(mode, mode === 'daily5' ? 'mixed' : getRecommendation().subject);
    });
  });

  const initial = document.querySelector('.tab.active')?.dataset.tab || 'dashboard';
  activate(initial, false);
}

function updateBudgetOutput() {
  budgetOutput.textContent = `£${Number(budgetSlider.value).toLocaleString('en-GB')}`;
}

function createListingLinks(e) {
  e.preventDefault();
  const areaRaw = document.getElementById('area').value.trim();
  const area = encodeURIComponent(areaRaw);
  const areaSlug = areaRaw.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const beds = document.getElementById('bedrooms').value || 3;
  const budget = budgetSlider.value;
  const radius = exactCatchmentMode?.checked ? PRIORITY_RADIUS_MILES : 15;

  if (propertyHint) {
    const inEasternList = EASTERN_AREA_PLACES.map((x) => x.toLowerCase()).includes(areaRaw.toLowerCase());
    propertyHint.textContent = exactCatchmentMode?.checked
      ? inEasternList
        ? 'Exact mode active: using 10.004-mile radius and an Eastern Area place.'
        : 'Exact mode active with 10.004-mile radius. Consider selecting an Eastern Area place for better precision.'
      : 'Broader search mode active. Switch exact mode on to match the 10.004-mile priority circle.';
  }

  const links = [
    {
      name: 'Rightmove',
      href: `https://www.rightmove.co.uk/property-for-sale/find.html?keywords=${area}&maxPrice=${budget}&minBedrooms=${beds}&radius=${radius}`,
    },
    {
      name: 'Zoopla',
      href: `https://www.zoopla.co.uk/for-sale/property/${areaSlug}/?price_max=${budget}&beds_min=${beds}&radius=${radius}`,
    },
    {
      name: 'OnTheMarket',
      href: `https://www.onthemarket.com/for-sale/property/${areaSlug}/?max-price=${budget}&min-bedrooms=${beds}&radius=${radius}`,
    },
  ];
  document.getElementById('listingLinks').innerHTML = links.map((l) => `<a href="${l.href}" target="_blank" rel="noreferrer">Open ${l.name}</a>`).join('');
}

function populateCatchmentDatalist() {
  const datalist = document.getElementById('catchmentAreas');
  if (!datalist) return;
  datalist.innerHTML = EASTERN_AREA_PLACES.map((p) => `<option value="${p}"></option>`).join('');
}

function hydrateSavedSetup() {
  const saved = JSON.parse(localStorage.getItem('setup-state') || '{}');
  childName.value = saved.childName || '';
  catchmentChecked.checked = Boolean(saved.catchmentChecked);
  weeklyHours.value = saved.weeklyHours || 8;
  parentNotes.value = localStorage.getItem('parent-notes') || '';
}

function renderTodayPracticeCard() {
  const recommendation = getRecommendation();
  const level = getStudentLevel(recommendation.subject);
  todayPracticeCard.innerHTML = `
    <h4>Today’s Practice</h4>
    <p><strong>Recommended focus:</strong> ${SUBJECTS[recommendation.subject]}</p>
    <p class="small">Current level: ${level === 'foundation' ? 'Foundation' : level === 'core' ? 'Core' : 'Stretch'}</p>
    <p>5 questions • Estimated time: 8–10 minutes</p>
    <div class="reason-chips">${recommendation.reasonChips.map((chip) => `<span class="badge">${chip.label}</span>`).join('')}</div>
    <button class="btn-inline" id="startTodayPractice">Start</button>
    <button class="btn-inline btn-quiet" id="addTodayPracticeToPlan">Add to this week's plan</button>
    <p class="small">${recommendation.reason}</p>
  `;

  document.getElementById('startTodayPractice')?.addEventListener('click', () => {
    document.querySelector('[data-tab="practice"]').click();
    startPracticeSession('daily5', recommendation.subject);
  });

  document.getElementById('addTodayPracticeToPlan')?.addEventListener('click', () => {
    addPracticeAction(`${SUBJECTS[recommendation.subject]} Daily 5`);
  });
}

function renderRecommendedPractice() {
  const recommendation = getRecommendation();
  const level = getStudentLevel(recommendation.subject);
  recommendedPractice.innerHTML = `
    <h4>Recommended next practice</h4>
    <p>${SUBJECTS[recommendation.subject]} Daily 5</p>
    <p class="small">Current level: ${level === 'foundation' ? 'Foundation' : level === 'core' ? 'Core' : 'Stretch'}</p>
    <div class="reason-chips">${recommendation.reasonChips.map((chip) => `<span class="badge">${chip.label}</span>`).join('')}</div>
    <p class="small">${recommendation.reason}</p>
    <button class="btn-inline" id="startRecommendedPractice">Start recommended session</button>
    <button class="btn-inline btn-quiet" id="addRecommendedToPlan">Add to this week's plan</button>
  `;

  document.getElementById('startRecommendedPractice')?.addEventListener('click', () => {
    startPracticeSession('daily5', recommendation.subject);
  });

  document.getElementById('addRecommendedToPlan')?.addEventListener('click', () => {
    addPracticeAction(`${SUBJECTS[recommendation.subject]} Daily 5`);
  });
}

function renderSubjectCards() {
  const progress = getProgressData();
  subjectCards.innerHTML = Object.keys(SUBJECTS).map((subject) => {
    const accuracy = getSubjectAccuracy(subject);
    const attempted = progress.accuracyBySubject[subject]?.attempted || 0;
    return `
      <article class="subject-card">
        <h4>${SUBJECTS[subject]}</h4>
        <p class="small">Practice in the style of the Warwickshire 11+</p>
        <p>${attempted} questions attempted • ${accuracy ?? '–'}% accuracy</p>
        <div class="subject-actions">
          <button class="btn-inline" data-subject="${subject}" data-mode="mini">Mini Quiz</button>
          <button class="btn-inline" data-subject="${subject}" data-mode="timed">Timed Drill</button>
        </div>
      </article>
    `;
  }).join('');

  subjectCards.querySelectorAll('button').forEach((btn) => {
    btn.addEventListener('click', () => startPracticeSession(btn.dataset.mode, btn.dataset.subject));
  });
}

function renderPracticeProgress() {
  const progress = getProgressData();
  const avgAccuracy = progress.questionsAttempted ? Math.round((progress.correctAnswers / progress.questionsAttempted) * 100) : 0;
  const weakestTopic = Object.entries(progress.accuracyByTopic || {})
    .filter(([, value]) => value.attempted >= 3)
    .map(([key, value]) => ({ key, accuracy: value.correct / value.attempted }))
    .sort((a, b) => a.accuracy - b.accuracy)[0];
  const weakestTopicLabel = weakestTopic ? weakestTopic.key.split(':')[1].replace(/-/g, ' ') : 'Not enough topic data yet';
  const emptyMessage = progress.sessions.length
    ? ''
    : '<p class="small">No practice sessions yet. Start with Daily 5 to build a calm routine.</p>';
  practiceProgress.innerHTML = `
    <h4>Recent progress</h4>
    ${emptyMessage}
    <div class="progress-metrics">
      <p><strong>${progress.sessions.length}</strong><span>sessions completed</span></p>
      <p><strong>${progress.questionsAttempted}</strong><span>questions attempted</span></p>
      <p><strong>${avgAccuracy}%</strong><span>average accuracy</span></p>
      <p><strong>${progress.streak}</strong><span>recent streak (days)</span></p>
    </div>
    <p class="small">Strongest: ${progress.strongestArea} • Weakest: ${progress.weakestArea}</p>
    <p class="small">Topic to revisit: ${weakestTopicLabel}</p>
    <p class="small">Last practiced: ${progress.lastPracticedDate ? new Date(progress.lastPracticedDate).toLocaleDateString('en-GB') : 'Not yet'}</p>
  `;
}

function getModeConfig(mode, subject) {
  const recommendedSubject = getRecommendation().subject;
  if (mode === 'daily5') return { size: 5, timeSeconds: 10 * 60, subject: subject || recommendedSubject, title: 'Daily 5' };
  if (mode === 'mini') return { size: 10, timeSeconds: 0, subject: subject || recommendedSubject, title: 'Mini Quiz' };
  return { size: 10, timeSeconds: 8 * 60, subject: subject || recommendedSubject, title: 'Timed Drill' };
}

function startPracticeSession(mode, subject = 'mixed') {
  if (currentPracticeSession) {
    const confirmed = window.confirm('You already have a practice session in progress. Start a new session and lose current progress?');
    if (!confirmed) return;
    clearInterval(currentPracticeSession.timerHandle);
  }

  const config = getModeConfig(mode, subject);
  const questions = pickQuestions({ subject: config.subject, size: config.size, mode: mode === 'mini' ? 'mini' : mode === 'timed' ? 'timed' : 'daily5' });
  if (!questions.length) {
    practiceResults.innerHTML = '<p class="small">No questions are currently available for this mode. Please try another mode or subject.</p>';
    return;
  }
  const feedbackMode = mode === 'daily5' ? 'instant' : 'end';

  currentPracticeSession = {
    id: `session-${Date.now()}`,
    mode,
    subject: config.subject,
    title: config.title,
    questions,
    currentQuestionIndex: 0,
    answers: [],
    startedAt: Date.now(),
    timeLimitSeconds: config.timeSeconds,
    timeRemainingSeconds: config.timeSeconds,
    timerHandle: null,
    feedbackMode,
    level: config.subject === 'mixed' ? 'core' : getStudentLevel(config.subject),
  };

  practiceResults.innerHTML = '';
  renderPracticeQuestion();
  if (currentPracticeSession.timeLimitSeconds > 0) startTimer();
  requestAnimationFrame(() => {
    practiceSession.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

function startTimer() {
  clearInterval(currentPracticeSession.timerHandle);
  currentPracticeSession.timerHandle = setInterval(() => {
    currentPracticeSession.timeRemainingSeconds -= 1;
    updateTimerView();
    if (currentPracticeSession.timeRemainingSeconds <= 0) {
      clearInterval(currentPracticeSession.timerHandle);
      finishPracticeSession();
    }
  }, 1000);
}

function updateTimerView() {
  const el = document.getElementById('practiceTimer');
  if (!el || !currentPracticeSession) return;
  const mins = String(Math.floor(currentPracticeSession.timeRemainingSeconds / 60)).padStart(2, '0');
  const secs = String(currentPracticeSession.timeRemainingSeconds % 60).padStart(2, '0');
  el.textContent = `${mins}:${secs}`;
}

function renderPracticeQuestion() {
  if (!currentPracticeSession) return;
  const q = currentPracticeSession.questions[currentPracticeSession.currentQuestionIndex];
  if (!q) {
    finishPracticeSession();
    return;
  }

  const progressPct = Math.round(((currentPracticeSession.currentQuestionIndex + 1) / currentPracticeSession.questions.length) * 100);
  const selected = currentPracticeSession.answers.find((a) => a.questionId === q.id)?.selectedOptionIndex;
  const mediaMarkup = q.media?.type === 'image'
    ? `<figure class="question-media"><img src="${q.media.src}" alt="${q.media.alt || 'Question pattern'}" loading="lazy" decoding="async" /></figure>`
    : '';

  practiceSession.innerHTML = `
    <div class="practice-sticky">
      <p><strong>${currentPracticeSession.title}</strong> • ${SUBJECTS[currentPracticeSession.subject] || 'Mixed'}</p>
      <p class="small">Level: ${currentPracticeSession.level === 'foundation' ? 'Foundation' : currentPracticeSession.level === 'core' ? 'Core' : 'Stretch'}</p>
      <p>Question ${currentPracticeSession.currentQuestionIndex + 1} of ${currentPracticeSession.questions.length}</p>
      ${currentPracticeSession.timeLimitSeconds > 0 ? `<p aria-live="polite">Time left: <strong id="practiceTimer"></strong></p>` : ''}
      <div class="progress-bar"><div class="progress-fill" style="width:${progressPct}%"></div></div>
    </div>
    <article class="question-card">
      <p class="small">${SUBJECTS[q.subject]} • ${q.topic} • ${q.difficulty}</p>
      <h4>${q.prompt}</h4>
      ${mediaMarkup}
      <div class="option-grid" role="radiogroup" aria-label="Answer options">
        ${q.options.map((opt, idx) => `<button class="option-btn ${selected === idx ? 'selected' : ''}" data-opt="${idx}" role="radio" aria-checked="${selected === idx}" aria-label="Option ${String.fromCharCode(65 + idx)}: ${opt}">${String.fromCharCode(65 + idx)}. ${opt}</button>`).join('')}
      </div>
      <div class="question-actions">
        <label class="check-inline"><input id="instantFeedbackToggle" type="checkbox" ${currentPracticeSession.feedbackMode === 'instant' ? 'checked' : ''}/> Instant feedback</label>
        <button id="nextQuestionBtn" class="btn-inline" ${selected === undefined ? 'disabled' : ''}>${currentPracticeSession.currentQuestionIndex === currentPracticeSession.questions.length - 1 ? 'Finish' : 'Next'}</button>
        <button id="quitSessionBtn" class="btn-inline btn-quiet" type="button">Quit session</button>
      </div>
      <p id="instantFeedback" class="small" aria-live="polite"></p>
    </article>
  `;

  updateTimerView();

  practiceSession.querySelectorAll('.option-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const selectedOptionIndex = Number(btn.dataset.opt);
      const answerIndex = currentPracticeSession.answers.findIndex((a) => a.questionId === q.id);
      const payload = { questionId: q.id, selectedOptionIndex, correct: selectedOptionIndex === q.correctOptionIndex };
      if (answerIndex >= 0) currentPracticeSession.answers[answerIndex] = payload;
      else currentPracticeSession.answers.push(payload);

      currentPracticeSession.feedbackMode = document.getElementById('instantFeedbackToggle')?.checked ? 'instant' : 'end';
      if (currentPracticeSession.feedbackMode === 'instant') {
        document.getElementById('instantFeedback').textContent = payload.correct ? 'Correct. Nice work.' : `Not quite. ${q.explanation}`;
      }
      renderPracticeQuestion();
    });
  });

  document.getElementById('nextQuestionBtn')?.addEventListener('click', () => {
    if (currentPracticeSession.currentQuestionIndex === currentPracticeSession.questions.length - 1) {
      finishPracticeSession();
      return;
    }
    currentPracticeSession.currentQuestionIndex += 1;
    renderPracticeQuestion();
  });

  document.getElementById('instantFeedbackToggle')?.addEventListener('change', (e) => {
    currentPracticeSession.feedbackMode = e.target.checked ? 'instant' : 'end';
  });

  document.getElementById('quitSessionBtn')?.addEventListener('click', () => {
    const confirmed = window.confirm('Quit this session? Your current answers will not be saved.');
    if (!confirmed) return;
    clearInterval(currentPracticeSession?.timerHandle);
    currentPracticeSession = null;
    practiceSession.innerHTML = '<p class="small">Session ended. You can start another short drill whenever you are ready.</p>';
  });
}

function calculateStreak(sessions) {
  if (!sessions.length) return 0;
  const uniqueDays = [...new Set(sessions.map((s) => new Date(s.date).toDateString()))]
    .map((d) => new Date(d))
    .sort((a, b) => b - a);
  let streak = 0;
  let cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  for (let i = 0; i < uniqueDays.length; i += 1) {
    const d = new Date(uniqueDays[i]);
    d.setHours(0, 0, 0, 0);
    if (d.getTime() === cursor.getTime()) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    } else if (i === 0 && d.getTime() === cursor.getTime() - 24 * 60 * 60 * 1000) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 2);
    } else {
      break;
    }
  }
  return streak;
}

function updateStrongWeak(progress) {
  const subjects = Object.keys(SUBJECTS);
  const withAccuracy = subjects.map((subject) => {
    const s = progress.accuracyBySubject[subject];
    if (!s?.attempted) return null;
    return { subject, accuracy: s.correct / s.attempted };
  }).filter(Boolean);

  if (!withAccuracy.length) return;
  withAccuracy.sort((a, b) => b.accuracy - a.accuracy);
  progress.strongestArea = SUBJECTS[withAccuracy[0].subject];
  progress.weakestArea = SUBJECTS[withAccuracy[withAccuracy.length - 1].subject];
}

function finishPracticeSession() {
  clearInterval(currentPracticeSession?.timerHandle);
  if (!currentPracticeSession) return;

  const total = currentPracticeSession.questions.length;
  const correct = currentPracticeSession.answers.filter((a) => a.correct).length;
  const unanswered = total - currentPracticeSession.answers.length;
  const timeTakenSeconds = Math.round((Date.now() - currentPracticeSession.startedAt) / 1000);
  const progress = getProgressData();

  progress.sessions.push({
    id: currentPracticeSession.id,
    date: new Date().toISOString(),
    mode: currentPracticeSession.mode,
    subject: currentPracticeSession.subject,
    total,
    correct,
    timeTakenSeconds,
  });

  const recent = progress.recentQuestionIdsBySubject?.[currentPracticeSession.subject] || [];
  const usedNow = currentPracticeSession.questions.map((q) => q.id);
  progress.recentQuestionIdsBySubject[currentPracticeSession.subject] = [...new Set([...usedNow, ...recent])].slice(0, 24);

  progress.questionsAttempted += total;
  progress.correctAnswers += correct;
  progress.lastPracticedDate = new Date().toISOString();
  progress.streak = calculateStreak(progress.sessions);

  if (!progress.accuracyBySubject[currentPracticeSession.subject]) {
    progress.accuracyBySubject[currentPracticeSession.subject] = { attempted: 0, correct: 0 };
  }
  progress.accuracyBySubject[currentPracticeSession.subject].attempted += total;
  progress.accuracyBySubject[currentPracticeSession.subject].correct += correct;

  currentPracticeSession.questions.forEach((question) => {
    const topicKey = `${question.subject}:${question.topicTags[0]}`;
    if (!progress.accuracyByTopic[topicKey]) {
      progress.accuracyByTopic[topicKey] = { attempted: 0, correct: 0 };
    }
    const answer = currentPracticeSession.answers.find((item) => item.questionId === question.id);
    progress.accuracyByTopic[topicKey].attempted += 1;
    if (answer?.correct) progress.accuracyByTopic[topicKey].correct += 1;
  });

  updateStrongWeak(progress);
  saveProgressData(progress);

  const areaPerformance = `${correct}/${total} in ${SUBJECTS[currentPracticeSession.subject]}`;
  const recommendation = correct / total >= 0.75
    ? `You got ${areaPerformance}. Next: try one more ${SUBJECTS[currentPracticeSession.subject]} drill tomorrow.`
    : `${SUBJECTS[currentPracticeSession.subject]} needs more work. Add 2 short sessions to this week’s study plan.`;

  const questionBreakdown = currentPracticeSession.questions.map((q) => {
    const answer = currentPracticeSession.answers.find((a) => a.questionId === q.id);
    const picked = answer ? q.options[answer.selectedOptionIndex] : 'No answer';
    const coachExplanation = `Why: ${q.explanation}`;
    return `
      <li>
        <p><strong>${q.prompt}</strong></p>
        <p class="small">Your answer: ${picked} • Correct: ${q.options[q.correctOptionIndex]}</p>
        <p class="small">${coachExplanation}</p>
      </li>
    `;
  }).join('');

  practiceResults.innerHTML = `
    <h4>Session results</h4>
    <p><strong>Score:</strong> ${correct}/${total}</p>
    <p><strong>Unanswered:</strong> ${unanswered}</p>
    <p><strong>Time taken:</strong> ${Math.floor(timeTakenSeconds / 60)}m ${timeTakenSeconds % 60}s</p>
    <p><strong>Areas attempted:</strong> ${SUBJECTS[currentPracticeSession.subject]}</p>
    <p><strong>Recommended next step:</strong> ${recommendation}</p>
    <button class="btn-inline btn-quiet" id="addResultActionBtn">Add this recommendation to this week's plan</button>
    <details open>
      <summary>Review explanations</summary>
      <ol class="result-list">${questionBreakdown}</ol>
    </details>
  `;

  practiceSession.innerHTML = '';
  document.getElementById('addResultActionBtn')?.addEventListener('click', () => {
    addPracticeAction(correct / total >= 0.75
      ? `${SUBJECTS[progress.sessions[progress.sessions.length - 1].subject]} Timed Drill`
      : `${SUBJECTS[progress.sessions[progress.sessions.length - 1].subject]} Mini Quiz`);
  });
  currentPracticeSession = null;
  renderPracticeSection();
  renderReadiness();
}

function getPracticeActions() {
  return JSON.parse(localStorage.getItem('practice-actions') || '[]');
}

function savePracticeActions(actions) {
  localStorage.setItem('practice-actions', JSON.stringify(actions));
}

function addPracticeAction(actionLabel) {
  const actions = getPracticeActions();
  const entry = {
    id: `practice-action-${Date.now()}`,
    label: actionLabel,
    done: false,
  };
  actions.unshift(entry);
  savePracticeActions(actions.slice(0, 10));
  renderPracticeActions();
}

function renderPracticeActions() {
  if (!practiceActionList) return;
  const actions = getPracticeActions();
  if (!actions.length) {
    practiceActionList.innerHTML = `<p class="small">No practice actions added yet. Use “Add to this week's plan” from Today’s Practice or Results.</p>`;
    return;
  }

  practiceActionList.innerHTML = actions.map((item) => `
    <label class="check-item ${item.done ? 'done' : ''}">
      <input type="checkbox" data-action-id="${item.id}" ${item.done ? 'checked' : ''}/>
      ${item.label}
    </label>
  `).join('');

  practiceActionList.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
    checkbox.addEventListener('change', () => {
      const next = getPracticeActions().map((item) => (item.id === checkbox.dataset.actionId ? { ...item, done: checkbox.checked } : item));
      savePracticeActions(next);
      renderPracticeActions();
    });
  });
}

function renderPracticeNextAction() {
  const recommendation = getRecommendation();
  practiceNextAction.innerHTML = `
    <strong>Practice-linked next action:</strong> ${recommendation.reason} Add a short ${SUBJECTS[recommendation.subject]} drill in this week’s plan.
  `;
}

function renderPracticeSection() {
  renderTodayPracticeCard();
  renderRecommendedPractice();
  renderSubjectCards();
  renderPracticeProgress();
  renderPracticeNextAction();
}

hydrateSavedSetup();
runPracticeIntegrityChecks();
populateCatchmentDatalist();
renderNextDeadline();
renderKeyDates();
renderCountdowns();
renderChecklist(studyPlan, STUDY_PLAN, 'study-plan');
renderChecklist(evidenceChecklist, EVIDENCE_ITEMS, 'evidence-checklist');
renderSetupState();
renderReadiness();
renderRevisionSplit();
renderRisk();
renderPracticeSection();
initTabs();
updateBudgetOutput();

[childName, catchmentChecked, weeklyHours].forEach((el) => {
  el.addEventListener('input', () => {
    renderSetupState();
    renderReadiness();
    renderRevisionSplit();
    renderPracticeSection();
  });
});

document.getElementById('jumpCatchment').addEventListener('click', () => {
  document.querySelector('[data-tab="catchment"]').click();
});
parentNotes.addEventListener('input', () => localStorage.setItem('parent-notes', parentNotes.value));
budgetSlider.addEventListener('input', updateBudgetOutput);
document.getElementById('notifyBtn').addEventListener('click', enableNotifications);
document.getElementById('calendarBtn').addEventListener('click', downloadICS);
document.getElementById('listingForm').addEventListener('submit', createListingLinks);
document.getElementById('printStudyPlan').addEventListener('click', () => window.print());

setInterval(() => {
  renderNextDeadline();
  renderCountdowns();
  renderRisk();
  renderKeyDates();
}, 60 * 1000);
