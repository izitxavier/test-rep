// App State Encapsulation
const AppState = {
  visitedSections: new Set(),
  loop: { max: 5, i: 0 },
  sort: { arr: [], i: 0, j: 0, swapped: false, ready: false, sortedSet: new Set() },
  quiz: { index: 0, selected: -1, score: 0, answered: false }
};

const codeExamples = {
  hello: 'nama = "Dunia"\nprint("Halo,", nama)',
  loop: 'for i in range(1, 6):\n    print(i)',
  if: 'nilai = 82\nif nilai >= 75:\n    print("Lulus")\nelse:\n    print("Belajar lagi")'
};

const quizQuestions = [
  {
    q: 'Apa tujuan utama algoritma?',
    o: ['Membuat kode terlihat keren', 'Memberi langkah jelas untuk menyelesaikan masalah', 'Selalu memakai banyak variabel', 'Menghindari semua perulangan'],
    a: 1,
    e: 'Algoritma adalah urutan langkah jelas dan terbatas untuk memecahkan masalah.'
  },
  {
    q: 'Apa hasil dari 7 % 2 dalam Python?',
    o: ['3', '2', '1', '0'],
    a: 2,
    e: 'Operator % menghasilkan sisa pembagian. Sisa 7 dibagi 2 adalah 1.'
  },
  {
    q: 'Kapan blok else dijalankan?',
    o: ['Selalu sebelum if', 'Ketika kondisi if bernilai False dan alurnya mencapai else', 'Hanya saat program error', 'Setiap loop berakhir'],
    a: 1,
    e: 'else adalah jalur alternatif saat kondisi if tidak terpenuhi.'
  },
  {
    q: 'Apa kegunaan fungsi?',
    o: ['Menghapus kebutuhan logika', 'Membuat kode dapat dikelompokkan dan digunakan kembali', 'Mengubah semua angka menjadi teks', 'Menjalankan program tanpa input'],
    a: 1,
    e: 'Fungsi memberi nama pada suatu pekerjaan dan dapat dipanggil berulang.'
  },
  {
    q: 'Kompleksitas O(n) biasanya berarti...',
    o: ['Jumlah langkah tumbuh sebanding dengan ukuran input', 'Selalu satu langkah', 'Jumlah langkah tumbuh seperti n kuadrat', 'Algoritma tidak pernah selesai'],
    a: 0,
    e: 'O(n) disebut linear: pertumbuhan pekerjaan sebanding dengan jumlah data.'
  }
];

// Navigation
function showSection(id) {
  document.querySelectorAll('.section').forEach(s => s.classList.toggle('active', s.id === id));
  document.querySelectorAll('.navbtn').forEach(b => b.classList.toggle('active', b.dataset.section === id));
  
  AppState.visitedSections.add(id);
  document.getElementById('progressFill').style.width = (AppState.visitedSections.size / 9 * 100) + '%';
  document.getElementById('progressText').textContent = AppState.visitedSections.size + ' dari 9 bagian dijelajahi';
  
  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (id === 'kompleksitas') complexityDemo();
  if (id === 'sorting' && !AppState.sort.ready) resetSort();
}

// Section Demos
function sumDemo() {
  const a = Number(document.getElementById('numA').value);
  const b = Number(document.getElementById('numB').value);
  document.getElementById('sumResult').innerHTML = `Input: ${a} dan ${b}<br>Proses: ${a} + ${b}<br><b>Output: ${a + b}</b>`;
}

function typeDemo() {
  const val = document.getElementById('typeValue').value;
  const types = {
    text: ['"Halo dunia"', 'string (str)', 'Teks diapit tanda kutip.'],
    int: ['42', 'integer (int)', 'Bilangan bulat.'],
    float: ['3.14', 'float', 'Bilangan dengan pecahan desimal.'],
    bool: ['True', 'boolean (bool)', 'Nilai logika True atau False.'],
    list: ['[2, 4, 6]', 'list', 'Kumpulan nilai berurutan yang dapat diubah.']
  };
  const info = types[val];
  document.getElementById('typeResult').innerHTML = `Nilai: <b>${info[0]}</b><br>Tipe: <b>${info[1]}</b><br>${info[2]}`;
}

function ifDemo() {
  const n = Number(document.getElementById('score').value);
  const r = document.getElementById('ifResult');
  if (!Number.isFinite(n) || n < 0 || n > 100) {
    r.textContent = 'Masukkan nilai dari 0 sampai 100.';
    return;
  }
  r.innerHTML = `Kondisi: ${n} >= 75 → <b>${n >= 75 ? 'True' : 'False'}</b><br>Output: <b>${n >= 75 ? 'Lulus' : 'Belajar lagi'}</b>`;
}

function functionDemo() {
  const n = Number(document.getElementById('side').value);
  document.getElementById('functionResult').textContent = n < 0 
    ? 'Panjang sisi tidak boleh negatif.' 
    : `luas_persegi(${n}) = ${n} × ${n} = ${n * n}`;
}

// Loop Simulator
function startLoop() {
  AppState.loop.max = Math.max(1, Math.min(12, Number(document.getElementById('loopCount').value) || 5));
  AppState.loop.i = 0;
  document.getElementById('loopVisual').innerHTML = '';
  nextLoop();
}

function nextLoop() {
  const visual = document.getElementById('loopVisual');
  const explain = document.getElementById('loopExplain');

  if (AppState.loop.i === 0 && visual.children.length === 0) {
    visual.innerHTML = '<span class="step current">Mulai</span>';
    explain.textContent = 'Inisialisasi penghitung, lalu mulai iterasi.';
    AppState.loop.i = 1;
    return;
  }

  if (AppState.loop.i <= AppState.loop.max) {
    const el = document.createElement('span');
    el.className = 'step current';
    el.textContent = 'i = ' + AppState.loop.i;
    visual.appendChild(el);
    explain.textContent = `Iterasi ${AppState.loop.i}: jalankan isi loop dengan i = ${AppState.loop.i}.`;
    AppState.loop.i++;
  } else {
    explain.textContent = 'Selesai: kondisi perulangan tidak lagi terpenuhi.';
    const e = document.createElement('span');
    e.className = 'step';
    e.textContent = 'Selesai';
    visual.appendChild(e);
  }
}

// Sorting Visualizer
function resetSort() {
  AppState.sort.arr = Array.from({ length: 8 }, () => Math.floor(Math.random() * 80) + 10);
  AppState.sort.i = 0;
  AppState.sort.j = 0;
  AppState.sort.swapped = false;
  AppState.sort.sortedSet = new Set();
  AppState.sort.ready = true;
  renderBars();
  document.getElementById('sortStatus').innerHTML = '<span class="step">Daftar baru dibuat</span>';
}

function renderBars(activeA = -1, activeB = -1) {
  const host = document.getElementById('bars');
  host.innerHTML = '';
  const max = Math.max(...AppState.sort.arr);

  AppState.sort.arr.forEach((v, idx) => {
    const b = document.createElement('div');
    b.className = 'bar' + (AppState.sort.sortedSet.has(idx) ? ' sorted' : '');
    if (idx === activeA || idx === activeB) {
      b.style.background = 'linear-gradient(0deg, #ff8eb5, #ffd0df)';
    }
    b.style.height = (v / max * 180) + 'px';
    b.textContent = v;
    b.title = 'Indeks ' + idx + ': ' + v;
    host.appendChild(b);
  });
}

function sortStep() {
  const s = AppState.sort;
  if (!s.ready) resetSort();

  if (s.i >= s.arr.length - 1) {
    s.sortedSet = new Set(s.arr.map((_, i) => i));
    renderBars();
    document.getElementById('sortStatus').innerHTML = '<span class="step current">Selesai! Angka terurut.</span>';
    return;
  }

  const a = s.j;
  const b = s.j + 1;
  if (s.arr[a] > s.arr[b]) {
    [s.arr[a], s.arr[b]] = [s.arr[b], s.arr[a]];
    s.swapped = true;
  }

  renderBars(a, b);
  document.getElementById('sortStatus').innerHTML = `<span class="step">Lintasan ${s.i + 1}</span><span class="step">Bandingkan ${a} dan ${b}</span><span class="step">${s.arr[a] <= s.arr[b] ? 'Urutan benar' : 'Ditukar'}</span>`;

  s.j++;
  if (s.j >= s.arr.length - s.i - 1) {
    s.sortedSet.add(s.arr.length - s.i - 1);
    s.i++;
    s.j = 0;
    if (!s.swapped) {
      s.sortedSet = new Set(s.arr.map((_, i) => i));
      s.i = s.arr.length;
    }
    s.swapped = false;
  }
}

function sortAll() {
  const s = AppState.sort;
  let guard = 0;
  while (s.i < s.arr.length - 1 && guard++ < 100) {
    const a = s.j;
    const b = s.j + 1;
    if (s.arr[a] > s.arr[b]) {
      [s.arr[a], s.arr[b]] = [s.arr[b], s.arr[a]];
    }
    s.j++;
    if (s.j >= s.arr.length - s.i - 1) {
      s.sortedSet.add(s.arr.length - s.i - 1);
      s.i++;
      s.j = 0;
    }
  }
  s.sortedSet = new Set(s.arr.map((_, i) => i));
  s.ready = true;
  renderBars();
  document.getElementById('sortStatus').innerHTML = '<span class="step current">Selesai! ' + s.arr.join(' · ') + '</span>';
}

function complexityDemo() {
  const n = Math.max(1, Math.min(1000, Number(document.getElementById('sizeN').value) || 1));
  document.getElementById('complexityResult').innerHTML = `
    <span class="step">O(1): 1</span>
    <span class="step">O(log₂ n): ${Math.ceil(Math.log2(n + 1))}</span>
    <span class="step">O(n): ${n.toLocaleString('id-ID')}</span>
    <span class="step">O(n²): ${(n * n).toLocaleString('id-ID')}</span>
  `;
}

// Code Interpreter / Playground
function loadExample(key) {
  document.getElementById('editorCode').value = codeExamples[key];
}

function runCode() {
  const code = document.getElementById('editorCode').value;
  const lines = code.split(/\n/);
  const vars = {};
  const out = [];

  function val(s) {
    s = s.trim();
    if (s in vars) return vars[s];
    if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) return s.slice(1, -1);
    if (s === 'True') return true;
    if (s === 'False') return false;
    if (s === 'None') return null;
    if (/^-?\d+(\.\d+)?$/.test(s)) return Number(s);

    const m = s.match(/^(.+?)\s*([+\-*/%])\s*(.+)$/);
    if (m) {
      const a = val(m[1]);
      const b = val(m[3]);
      switch (m[2]) {
        case '+': return (typeof a === 'string' || typeof b === 'string') ? String(a) + String(b) : a + b;
        case '-': return a - b;
        case '*': return a * b;
        case '/': return a / b;
        case '%': return a % b;
      }
    }
    return s;
  }

  function condition(s) {
    const m = s.match(/^(.+?)\s*(>=|<=|==|!=|>|<)\s*(.+)$/);
    if (!m) throw Error('Kondisi belum didukung: ' + s);
    const a = val(m[1]);
    const b = val(m[3]);
    return {
      '>=': a >= b,
      '<=': a <= b,
      '==': a == b,
      '!=': a != b,
      '>': a > b,
      '<': a < b
    }[m[2]];
  }

  try {
    function execRange(start, end) {
      for (let j = start; j < end; j++) {
        const raw = lines[j];
        const line = raw.trim();
        if (!line || line.startsWith('#')) continue;

        let m;
        if ((m = line.match(/^(\w+)\s*=\s*(.+)$/)) && !line.startsWith('if ')) {
          vars[m[1]] = val(m[2]);
          continue;
        }

        if ((m = line.match(/^print\((.*)\)$/))) {
          const args = m[1].split(/,(?=(?:[^'"]|'[^']*'|"[^"]*")*$)/).map(x => String(val(x)));
          out.push(args.join(' '));
          continue;
        }

        if ((m = line.match(/^for\s+(\w+)\s+in\s+range\((\d+)(?:\s*,\s*(\d+))?\):$/))) {
          let body = j + 1;
          while (body < end && (!lines[body].trim() || lines[body].startsWith(' ') || lines[body].startsWith('\t'))) body++;
          const from = m[3] === undefined ? 0 : Number(m[2]);
          const to = m[3] === undefined ? Number(m[2]) : Number(m[3]);
          if (body === j + 1) throw Error('Isi for harus memakai indentasi.');

          for (let n = from; n < to; n++) {
            vars[m[1]] = n;
            execRange(j + 1, body);
          }
          j = body - 1;
          continue;
        }

        if ((m = line.match(/^if\s+(.+):$/))) {
          let mid = j + 1;
          while (mid < end && (!lines[mid].trim() || lines[mid].startsWith(' ') || lines[mid].startsWith('\t'))) mid++;
          const hasElse = mid < end && lines[mid].trim() === 'else:';
          let finish = mid + 1;

          if (hasElse) {
            while (finish < end && (!lines[finish].trim() || lines[finish].startsWith(' ') || lines[finish].startsWith('\t'))) finish++;
          }

          if (mid === j + 1) throw Error('Isi if harus memakai indentasi.');
          const yes = condition(m[1]);
          if (yes) execRange(j + 1, mid);
          else if (hasElse) execRange(mid + 1, finish);

          j = (hasElse ? finish : mid) - 1;
          continue;
        }

        if (line === 'else:') continue;
        throw Error('Baris belum didukung: ' + line);
      }
    }

    execRange(0, lines.length);
    document.getElementById('codeOutput').textContent = out.join('\n') || '(Program selesai tanpa output)';
  } catch (e) {
    document.getElementById('codeOutput').textContent = 'Simulasi berhenti: ' + e.message;
  }
}

// Quiz Component
function renderQuiz() {
  const q = quizQuestions[AppState.quiz.index];
  document.getElementById('quizCount').textContent = `Pertanyaan ${AppState.quiz.index + 1} dari ${quizQuestions.length}`;
  document.getElementById('quizProgress').style.width = (AppState.quiz.index / quizQuestions.length * 100) + '%';
  document.getElementById('quizQuestion').textContent = q.q;

  const optsHost = document.getElementById('quizOptions');
  optsHost.innerHTML = '';

  q.o.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.className = 'quiz-option' + (AppState.quiz.selected === idx ? ' chosen' : '');
    btn.textContent = String.fromCharCode(65 + idx) + '. ' + opt;
    btn.onclick = () => {
      if (!AppState.quiz.answered) {
        AppState.quiz.selected = idx;
        renderQuiz();
      }
    };
    optsHost.appendChild(btn);
  });

  document.getElementById('quizFeedback').innerHTML = '';
  document.getElementById('quizSubmit').style.display = AppState.quiz.answered ? 'none' : 'inline-block';
  document.getElementById('quizNext').style.display = AppState.quiz.answered ? 'inline-block' : 'none';
  document.getElementById('quizNext').textContent = AppState.quiz.index === quizQuestions.length - 1 ? 'Lihat hasil' : 'Berikutnya →';
}

function submitAnswer() {
  if (AppState.quiz.selected < 0) {
    document.getElementById('quizFeedback').innerHTML = '<div class="feedback bad">Pilih satu jawaban dulu.</div>';
    return;
  }

  AppState.quiz.answered = true;
  const q = quizQuestions[AppState.quiz.index];
  const correct = AppState.quiz.selected === q.a;
  if (correct) AppState.quiz.score++;

  document.getElementById('quizFeedback').innerHTML = `<div class="feedback ${correct ? 'good' : 'bad'}"><b>${correct ? 'Benar!' : 'Belum tepat.'}</b> ${q.e}</div>`;

  document.querySelectorAll('.quiz-option').forEach((btn, idx) => {
    btn.disabled = true;
    if (idx === q.a) btn.style.borderColor = 'var(--accent)';
  });

  document.getElementById('quizSubmit').style.display = 'none';
  document.getElementById('quizNext').style.display = 'inline-block';
  document.getElementById('quizProgress').style.width = ((AppState.quiz.index + 1) / quizQuestions.length * 100) + '%';
}

function nextQuestion() {
  if (!AppState.quiz.answered) return;

  if (AppState.quiz.index === quizQuestions.length - 1) {
    const total = quizQuestions.length;
    const score = AppState.quiz.score;
    document.getElementById('quizQuestion').textContent = 'Kuis selesai!';
    document.getElementById('quizOptions').innerHTML = '';
    document.getElementById('quizFeedback').innerHTML = `
      <div class="feedback good">
        Skor kamu: <b>${score}/${total}</b> (${Math.round(score / total * 100)}%). 
        ${score === total ? 'Sempurna!' : score >= 3 ? 'Bagus! Ulangi materi yang masih terasa sulit.' : 'Coba pelajari lagi konsepnya, lalu ulangi kuis.'}
      </div>
    `;

    document.getElementById('quizSubmit').style.display = 'none';
    const nextBtn = document.getElementById('quizNext');
    nextBtn.textContent = 'Ulangi kuis';
    nextBtn.onclick = () => {
      AppState.quiz.index = 0;
      AppState.quiz.score = 0;
      AppState.quiz.selected = -1;
      AppState.quiz.answered = false;
      nextBtn.onclick = nextQuestion;
      renderQuiz();
    };
    nextBtn.style.display = 'inline-block';
    document.getElementById('quizCount').textContent = 'Selesai';
    document.getElementById('quizProgress').style.width = '100%';
    return;
  }

  AppState.quiz.index++;
  AppState.quiz.selected = -1;
  AppState.quiz.answered = false;
  renderQuiz();
}

// Initializations
renderQuiz();
typeDemo();
complexityDemo();
resetSort();
startLoop();
