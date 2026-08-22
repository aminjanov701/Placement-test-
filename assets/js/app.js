(function(){

var SHEET_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbymxB7MChyWhKoSYo0z6QqcdiH2ESayqs8U_IgL7jeZgI_NLu2ZAGlveLNKDS2qsHjiUw/exec';
var TELEGRAM_API_URL = '/.netlify/functions/placement-test';
var STORAGE_KEY = 'pendingResults';

  var LEVELS = [
    { code:'A1', name:'Beginner',            desc:'Can understand and use familiar everyday expressions and very basic phrases, and can introduce themselves and ask simple questions.', ielts:'below 3.0', group:'Beginner (A1)' },
    { code:'A2', name:'Elementary',          desc:'Can communicate in simple, routine tasks on familiar topics and describe basic aspects of their background and surroundings.', ielts:'3.0 – 3.5', group:'Elementary (A2)' },
    { code:'B1', name:'Intermediate',        desc:'Can deal with most situations likely to arise, and can describe experiences, events and ambitions and give brief reasons and explanations.', ielts:'4.0 – 5.0', group:'Intermediate (B1)' },
    { code:'B2', name:'Upper-Intermediate',  desc:'Can interact with a good degree of fluency and spontaneity, and produce clear, detailed text on a wide range of subjects.', ielts:'5.5 – 6.5', group:'Upper-Intermediate (B2)' },
    { code:'C1', name:'Advanced',            desc:'Can use language flexibly and effectively for social, academic and professional purposes, and produce well-structured, detailed text.', ielts:'7.0 – 8.0', group:'Advanced (C1)' },
    { code:'C2', name:'Proficiency',         desc:'Can understand with ease virtually everything read or heard, and express themselves spontaneously, precisely and with fine shades of meaning.', ielts:'8.5 – 9.0', group:'Proficiency (C2)' }
  ];

  var QUESTIONS = {
    A1: [
      { q:'I ___ a teacher.', o:['am','is','are','be'], c:0 },
      { q:'She ___ from Spain.', o:['am','is','are','be'], c:1 },
      { q:'They ___ students at this school.', o:['am','is','are','be'], c:2 },
      { q:'This is ___ apple.', o:['a','an','the','—'], c:1 },
      { q:'There ___ two cats in the garden.', o:['is','are','am','be'], c:1 },
      { q:'My brother ___ football every Sunday.', o:['play','plays','playing','played'], c:1 },
      { q:'___ you like coffee?', o:['Do','Does','Are','Is'], c:0 },
      { q:'Look! It ___ raining.', o:['rain','rains','is raining','rained'], c:2 }
    ],
    A2: [
      { q:'Yesterday, I ___ to the cinema.', o:['go','went','goes','going'], c:1 },
      { q:'This book is ___ than that one.', o:['interesting','more interesting','most interesting','interestinger'], c:1 },
      { q:'We ___ our grandparents next weekend.', o:['are going to visit','go to visit','goes to visit','went to visit'], c:0 },
      { q:"There isn't ___ milk in the fridge.", o:['some','any','a','an'], c:1 },
      { q:'I was born ___ 1998.', o:['in','on','at','for'], c:0 },
      { q:'He ___ his homework before dinner yesterday.', o:['finish','finished','finishes','finishing'], c:1 },
      { q:'Could you tell me ___ the station is?', o:['where','what','who','how'], c:0 },
      { q:"She's the ___ girl in the class.", o:['tall','taller','tallest','most tall'], c:2 }
    ],
    B1: [
      { q:'I have ___ eaten sushi before.', o:['ever','never','already','yet'], c:1 },
      { q:'If it rains tomorrow, we ___ the picnic.', o:['cancel','will cancel','would cancel','canceled'], c:1 },
      { q:"You ___ park here — it's forbidden.", o:["don't have to",'mustn\'t','can','could'], c:1 },
      { q:'She has worked here ___ 2015.', o:['for','since','from','at'], c:1 },
      { q:'___ it was raining, we still went for a walk.', o:['Because','Despite','Although','So'], c:2 },
      { q:'I need to look ___ this word in the dictionary.', o:['up','for','after','into'], c:0 },
      { q:'The letter ___ by the manager yesterday.', o:['was written','wrote','write','is writing'], c:0 },
      { q:'By the time we arrived, the film ___.', o:['already started','had already started','already starts','starts already'], c:1 }
    ],
    B2: [
      { q:'If I ___ more time, I would learn another language.', o:['have','had','has','having'], c:1 },
      { q:'She said that she ___ tired.', o:['is','was','were','be'], c:1 },
      { q:'The man ___ car was stolen called the police.', o:['who','whose','which','whom'], c:1 },
      { q:'If you ___ me earlier, I could have helped.', o:['told','tell','had told','would tell'], c:2 },
      { q:'The bridge ___ next year.', o:['is being built','build','built','is build'], c:0 },
      { q:'He apologized ___ being late.', o:['for','to','about','of'], c:0 },
      { q:'Despite ___ hard, he failed the exam.', o:['study','studying','studied','to study'], c:1 },
      { q:"It's high time you ___ a decision.", o:['make','made','making','makes'], c:1 }
    ],
    C1: [
      { q:'Not only ___ late, but he also forgot the documents.', o:['he was','was he','he did','did he'], c:1 },
      { q:'Had I known about the meeting, I ___ attended.', o:['would','would have','will have','had'], c:1 },
      { q:'It is essential that she ___ present at the meeting.', o:['is','be','was','will be'], c:1 },
      { q:"I'd rather you ___ that to anyone.", o:["don't say",'didn\'t say','not say',"won't say"], c:1 },
      { q:'What she really needs ___ a long holiday.', o:['is','are','be','being'], c:0 },
      { q:"He's been under a lot of pressure ___.", o:['lately','since','for','already'], c:0 },
      { q:'No sooner ___ the show started than the lights went out.', o:['had','has','did','was'], c:0 },
      { q:'The negotiations broke ___ without reaching an agreement.', o:['down','off','up','out'], c:0 }
    ],
    C2: [
      { q:"The committee's decision was, to all intents and ___, final.", o:['purposes','meanings','reasons','effects'], c:0 },
      { q:'Were it not ___ his intervention, the project would have failed.', o:['for','of','to','with'], c:0 },
      { q:'She has an uncanny ___ for spotting talent.', o:['eye','nose','ear','hand'], c:0 },
      { q:"The report's findings, ___ controversial, were ultimately accepted.", o:['although','while','albeit','despite'], c:2 },
      { q:'He is, by all ___, a changed man.', o:['appearances','means','accounts','ways'], c:0 },
      { q:'The proposal was met with a barrage ___ criticism.', o:['of','from','with','for'], c:0 },
      { q:'Little ___ she know that her life was about to change forever.', o:['did','does','had','was'], c:0 },
      { q:'The two theories are, in ___, essentially the same.', o:['essence','fact','reality','truth'], c:0 }
    ]
  };

  var WRITING_PROMPTS = {
    A1: 'O\'zingiz haqingizda 2–3 ta oddiy gap yozing: ismingiz, qayerdan ekanligingiz va nimalarni yaxshi ko\'rishingiz.',
    A2: 'Oddiy kuningiz haqida 3–4 ta gap yozing.',
    B1: 'Write a short letter (4–5 sentences) about a memorable trip you have taken.',
    B2: 'Write a letter (5–6 sentences) giving your opinion: is it better to learn English online or in a classroom?',
    C1: 'Write a short letter discussing one advantage and one disadvantage of working remotely.',
    C2: 'Write a well-reasoned short letter on a topic of your choice, using precise and rich vocabulary.'
  };

  var SELF_ASSESS_OPTIONS = [
    'A1',
    'A2',
    'B1',
    'B2',
    'C1'
  ];

  var STUDY_FORMATS = [
    { code:'group', name:'Standart guruh', desc:'14 nafargacha talaba bilan birga sinfda o\'tkaziladigan darslar.' },
    { code:'mini', name:'Mini-guruh', desc:'4 nafar talabalar guruhi.' },
    { code:'individual', name:'Individual darslar', desc:'Talabaga to\'liq moslashtirilgan yakka tartibdagi xususiy darslar.' }
  ];

  var state = {
    name: '',
    phone: '',
    birthDate: '',
    startIndex: 0,
    currentIndex: 0,
    mode: null,        // null | 'up' | 'down'
    lastPassed: null,
    testedScores: {},  // index -> score
    answers: {},       // temp answers for current block
    finalIndex: null,
    writing: '',
    studyFormat: null
  };

  var card = document.getElementById('card');
  var ladderEl = document.getElementById('ladder');

  function formatPhoneValue(value){
    var digits = String(value || '').replace(/\D/g, '').slice(0, 9);
    var formatted = '';
    if (digits.length > 0) formatted += '(' + digits.slice(0, 2);
    if (digits.length > 2) formatted += ') ' + digits.slice(2, 5);
    if (digits.length > 5) formatted += '-' + digits.slice(5, 7);
    if (digits.length > 7) formatted += '-' + digits.slice(7, 9);
    return formatted;
  }

  function isPhoneComplete(value){
    return /^\(\d{2}\) \d{3}-\d{2}-\d{2}$/.test(value || '');
  }

  function maskPhoneInput(el){
    el.addEventListener('input', function(){
      var before = el.value;
      var digits = String(before).replace(/\D/g, '').slice(0, 9);
      var formatted = formatPhoneValue(digits);
      if (formatted !== before){
        el.value = formatted;
      }
    });
    el.addEventListener('paste', function(e){
      e.preventDefault();
      var text = (e.clipboardData || window.clipboardData).getData('text');
      var digits = String(text).replace(/\D/g, '').slice(0, 9);
      el.value = formatPhoneValue(digits);
    });
  }

  // Keeps only basic English-keyboard characters in a name field (letters, spaces, apostrophe, hyphen, period).
  // Blocks Cyrillic, Arabic, CJK, and any other non-Latin script/keyboard, on every input or paste.
  function restrictToEnglishName(el){
    var allowed = /[^A-Za-z '\-.]/g;
    el.addEventListener('input', function(){
      var pos = el.selectionStart;
      var before = el.value;
      var cleaned = before.replace(allowed, '');
      if (cleaned !== before){
        el.value = cleaned;
        var diff = before.length - cleaned.length;
        var newPos = Math.max(0, (pos || cleaned.length) - diff);
        try { el.setSelectionRange(newPos, newPos); } catch(e){}
      }
    });
    el.addEventListener('paste', function(e){
      e.preventDefault();
      var text = (e.clipboardData || window.clipboardData).getData('text');
      var clean = text.replace(allowed, '');
      var start = el.selectionStart, end = el.selectionEnd;
      el.value = el.value.slice(0, start) + clean + el.value.slice(end);
      el.dispatchEvent(new Event('input'));
    });
  }

  // Keeps only basic English-keyboard characters in free-text writing (letters, numbers, common punctuation).
  // Blocks Cyrillic, Arabic, CJK, and any other non-Latin script/keyboard, on every input or paste.
  function restrictToEnglishText(el){
    var allowed = /[^A-Za-z0-9 .,'"!?;:()\-\n\r]/g;
    el.addEventListener('input', function(){
      var pos = el.selectionStart;
      var before = el.value;
      var cleaned = before.replace(allowed, '');
      if (cleaned !== before){
        el.value = cleaned;
        var diff = before.length - cleaned.length;
        var newPos = Math.max(0, (pos || cleaned.length) - diff);
        try { el.setSelectionRange(newPos, newPos); } catch(e){}
      }
    });
    el.addEventListener('paste', function(e){
      e.preventDefault();
      var text = (e.clipboardData || window.clipboardData).getData('text');
      var clean = text.replace(allowed, '');
      var start = el.selectionStart, end = el.selectionEnd;
      el.value = el.value.slice(0, start) + clean + el.value.slice(end);
      el.dispatchEvent(new Event('input'));
    });
  }

  function renderLadder(activeIndex){
    var html = '';
    for (var i=0;i<LEVELS.length;i++){
      var cls = 'rung';
      if (state.testedScores[i] !== undefined){
        cls += (state.testedScores[i] >= 6) ? ' passed' : ' failed';
      }
      if (i === activeIndex) cls += ' active';
      html += '<div class="'+cls+'" style="--step-index:' + i + '"><div class="rung-dot">'+LEVELS[i].code+'</div><div class="rung-label">'+LEVELS[i].name+'</div></div>';
    }
    ladderEl.innerHTML = html;
  }

  function animateCardTransition(nextHtml, callback, fadeOnly){
    card.classList.remove('card-panel-visible', 'card-fade');
    card.classList.add(fadeOnly ? 'card-fade-exit' : 'card-panel-exit');
    window.setTimeout(function(){
      card.innerHTML = nextHtml;
      card.classList.remove('card-panel-exit', 'card-fade-exit');
      if (fadeOnly){
        card.classList.add('card-fade', 'card-panel-visible');
      } else {
        card.classList.add('card-panel', 'card-panel-visible');
      }
      if (callback) callback();
    }, fadeOnly ? 450 : 250);
  }

  function renderWelcome(){
    renderLadder(-1);
    var html =
      '<h2 class="screen-title welcome-title">🚀 Test Your English in 5 Minutes</h2>' +
      '<div class="welcome-accent"></div>' +
      '<p class="screen-lede">Find out your English level for free and get a personalized recommendation from Nurik\'s Academy.</p>' +
      '<div class="field-group" style="margin-top:24px;"><label class="field-label" for="nameInput">FULL NAME</label>' +
      '<input type="text" id="nameInput" placeholder="e.g. Aminjonov Nurmuhammad" autocomplete="off" lang="en" spellcheck="false"></div>' +
      '<div class="field-group"><label class="field-label" for="phoneInput">PHONE NUMBER</label>' +
      '<input type="tel" id="phoneInput" placeholder="(90) 848-87-87" autocomplete="off" inputmode="numeric" pattern="[0-9]*" maxlength="15"></div>' +
      '<div class="field-group"><label class="field-label" for="birthDateInput">DATE OF BIRTH</label>' +
      '<input type="date" id="birthDateInput"></div>' +
      '<div class="row end"><button class="btn btn-primary btn-shine" id="startBtn" disabled>Start Free Test</button></div>';

    animateCardTransition(html, function(){
        var nameInput = document.getElementById('nameInput');
      var phoneInput = document.getElementById('phoneInput');
      var birthDateInput = document.getElementById('birthDateInput');
      var startBtn = document.getElementById('startBtn');
      restrictToEnglishName(nameInput);
      maskPhoneInput(phoneInput);

      function updateStartButtonState(){
        var nameOk = nameInput.value.trim().length > 0;
        var phoneOk = isPhoneComplete(phoneInput.value);
        startBtn.disabled = !(nameOk && phoneOk);
      }

      nameInput.addEventListener('input', updateStartButtonState);
      phoneInput.addEventListener('input', updateStartButtonState);
      nameInput.addEventListener('keydown', function(e){
        if (e.key === 'Enter' && !startBtn.disabled) beginTest();
      });
      startBtn.addEventListener('click', beginTest);
      updateStartButtonState();
      nameInput.focus();

      function beginTest(){
        if (!(nameInput.value.trim().length > 0 && isPhoneComplete(phoneInput.value))) return;
        state.name = nameInput.value.trim();
        state.phone = phoneInput.value.trim();
        state.birthDate = birthDateInput.value;
        renderSelfAssessment();
      }
    }, true);
  }

  function renderSelfAssessment(){
    renderLadder(-1);
    var html =
      '<h2 class="screen-title">One quick question</h2>' +
      '<p class="screen-lede">Bugungi kunda ingliz tili darajangizni qanday baholaysiz?</p>' +
      '<div class="choice-group" id="selfChoices">';
    for (var i=0;i<SELF_ASSESS_OPTIONS.length;i++){
      html += '<button type="button" class="choice" data-idx="'+i+'">'+SELF_ASSESS_OPTIONS[i]+'</button>';
    }
    html += '</div><div class="row end"><button class="btn btn-primary btn-shine" id="beginBtn" disabled>Next</button></div>';
    animateCardTransition(html, function(){

      var selected = null;
      var buttons = card.querySelectorAll('.choice');
      var beginBtn = document.getElementById('beginBtn');
      buttons.forEach(function(btn){
        btn.addEventListener('click', function(){
          buttons.forEach(function(b){ b.classList.remove('selected'); });
          btn.classList.add('selected');
          selected = parseInt(btn.getAttribute('data-idx'), 10);
          beginBtn.disabled = false;
        });
      });
      beginBtn.addEventListener('click', function(){
        state.startIndex = selected;
        state.currentIndex = selected;
        showBlock(selected);
      });
    });
  }

  function showBlock(index){
    renderLadder(index);
    var level = LEVELS[index];
    var items = QUESTIONS[level.code];
    state.answers = {};

    var html =
      '<div class="block-meta">SECTION &middot; LEVEL ' + level.code + ' &mdash; ' + level.name + '</div>' +
      '<h2 class="screen-title">' + items.length + ' quick questions</h2>' +
      '<p class="screen-lede">Choose the best option for each sentence.</p>';

    items.forEach(function(item, qi){
      html += '<fieldset data-qi="'+qi+'"><legend><span class="qnum">'+(qi+1)+'.</span>'+item.q+'</legend>';
      item.o.forEach(function(opt, oi){
        html += '<button type="button" class="opt" data-qi="'+qi+'" data-oi="'+oi+'">'+opt+'</button>';
      });
      html += '</fieldset>';
    });

    html += '<div class="row end"><button class="btn btn-primary btn-shine" id="continueBtn" disabled>Next</button></div>';
    animateCardTransition(html, function(){
        var continueBtn = document.getElementById('continueBtn');
      var optButtons = card.querySelectorAll('.opt');
      optButtons.forEach(function(btn){
        btn.addEventListener('click', function(){
          var qi = btn.getAttribute('data-qi');
          var oi = parseInt(btn.getAttribute('data-oi'), 10);
          var group = card.querySelectorAll('.opt[data-qi="'+qi+'"]');
          group.forEach(function(b){ b.classList.remove('selected'); });
          btn.classList.add('selected');
          state.answers[qi] = oi;
          continueBtn.disabled = Object.keys(state.answers).length < items.length;
        });
      });

      continueBtn.addEventListener('click', function(){
        var score = 0;
        items.forEach(function(item, qi){
          if (state.answers[qi] === item.c) score++;
        });
        onBlockComplete(index, score);
      });

      card.scrollIntoView({ behavior:'smooth', block:'start' });
    });
  }

  function onBlockComplete(index, score){
    state.testedScores[index] = score;
    var LAST = LEVELS.length - 1;

    if (score >= 4 && score <= 5){
      finalize(index);
      return;
    }

    if (score >= 6){
      state.lastPassed = index;
      if (state.mode === null) state.mode = 'up';
      if (state.mode === 'down'){ finalize(index); return; }
      if (index === LAST){ finalize(index); return; }
      state.currentIndex = index + 1;
      showBlock(state.currentIndex);
    } else {
      if (state.mode === null) state.mode = 'down';
      if (state.mode === 'up'){
        finalize(state.lastPassed !== null ? state.lastPassed : 0);
        return;
      }
      if (index === 0){ finalize(0); return; }
      state.currentIndex = index - 1;
      showBlock(state.currentIndex);
    }
  }

  function finalize(index){
    state.finalIndex = index;
    renderWritingPrompt();
  }

  function renderWritingPrompt(){
    renderLadder(state.finalIndex);
    var code = LEVELS[state.finalIndex].code;
    var isUzbekLevel = (code === 'A1' || code === 'A2');
    var note = isUzbekLevel
      ? ' (Bu avtomatik baholanmaydi — o\'qituvchi shaxsan o\'qib chiqadi.)'
      : ' (This is not graded automatically — the teacher will review it personally.)';
    var html =
      '<h2 class="screen-title">Almost done</h2>' +
      '<p class="screen-lede">' + WRITING_PROMPTS[code] + note + '</p>' +
      '<textarea id="writingArea" placeholder="Write your answer here..." lang="en" spellcheck="false"></textarea>' +
      '<div class="row"><button class="btn btn-ghost" id="skipBtn">Skip</button><button class="btn btn-primary btn-shine" id="seeResultBtn">Next</button></div>';

    animateCardTransition(html, function(){
      restrictToEnglishText(document.getElementById('writingArea'));

      document.getElementById('skipBtn').addEventListener('click', function(){
        state.writing = '';
        renderStudyFormat();
      });
      document.getElementById('seeResultBtn').addEventListener('click', function(){
        state.writing = document.getElementById('writingArea').value.trim();
        renderStudyFormat();
      });
    });
  }

 function renderStudyFormat(){
  state.studyFormat = {
    name: "NFC Test",
    desc: "Lead generated through NFC placement test"
  };

  renderResults();
}

  function traceText(){
    var parts = [];
    for (var i=0;i<LEVELS.length;i++){
      if (state.testedScores[i] === undefined) continue;
      var s = state.testedScores[i];
      var tag = s >= 6 ? 'passed' : (s <= 3 ? 'failed' : 'borderline');
      parts.push(LEVELS[i].code + ' ' + s + '/8 (' + tag + ')');
    }
    return parts.join('  ·  ');
  }

  function sanitizeFileName(value){
    var base = (value || 'Student').trim().replace(/\s+/g, '_').replace(/[^A-Za-z0-9._-]/g, '');
    return (base || 'Student') + '_Placement_Test.pdf';
  }

  function getPendingResults(){
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      var parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      console.error('Could not read pending results', err);
      return [];
    }
  }

  function savePendingResults(items){
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      return true;
    } catch (err) {
      if (err && err.name === 'QuotaExceededError') {
        console.warn('localStorage quota exceeded; pending result could not be saved.');
      } else {
        console.error('Could not save pending results', err);
      }
      return false;
    }
  }

  function updateConnectionIndicator(){
    var statusEl = document.getElementById('connectionStatus');
    if (!statusEl) return;
    var pending = getPendingResults().filter(function(entry){
      return entry && entry.telegramSent !== true || entry && entry.sheetsSent !== true;
    });
    if (!navigator.onLine){
      statusEl.textContent = '🔴 Offline (' + pending.length + ' pending results)';
      statusEl.className = 'status-indicator offline';
    } else {
      statusEl.textContent = '🟢 Connected';
      statusEl.className = 'status-indicator';
    }
  }

  var statusSequenceTimer = null;

  function stopStatusSequence(){
    if (statusSequenceTimer){
      window.clearTimeout(statusSequenceTimer);
      statusSequenceTimer = null;
    }
  }

  function showProcessingStatusSequence(){
    stopStatusSequence();
    var statusEl = document.getElementById('sendStatus');
    if (!statusEl) return;
    var steps = [
      '📤 Sending Results...',
      '📄 Generating PDF...',
      '📨 Sending to Telegram...',
      '📊 Saving to Google Sheets...'
    ];
    var index = 0;
    function showNext(){
      if (index >= steps.length) return;
      statusEl.innerHTML = steps[index].replace(/\n/g, '<br>');
      statusEl.className = 'send-status';
      statusEl.classList.remove('is-visible');
      window.setTimeout(function(){
        statusEl.classList.add('is-visible');
        index += 1;
        statusSequenceTimer = window.setTimeout(showNext, 650);
      }, 20);
    }
    showNext();
  }

  function setResultStatus(message, type){
    stopStatusSequence();
    var statusEl = document.getElementById('sendStatus');
    if (!statusEl) return;
    statusEl.innerHTML = (message || '').replace(/\n/g, '<br>');
    statusEl.className = 'send-status' + (type ? ' ' + type : '');
    window.setTimeout(function(){
      statusEl.classList.add('is-visible');
    }, 20);
  }

 function buildResultPayload(lvl){
  return {
    name: state.name || '',
    phone: state.phone || '',
    birthDate: state.birthDate || '',
    levelCode: lvl.code,
    levelName: lvl.name,
    level: lvl.code + ' - ' + lvl.name,
    ielts: lvl.ielts,
    writingSample: state.writing || '',
    dateTime: new Date().toISOString()
  };
}

  function buildTelegramCaption(payload){
    return [
      '🎓 New Placement Test',
      '',
      '👤 Student: ' + (payload.name || '—'),
      '📱 Student Phone: ' + (payload.phone || '—'),
      '',
      '📊 Level: ' + (payload.level || '—'),
      '🎯 IELTS Equivalent: ' + (payload.ielts || '—'),
      '',
      '📚 Preferred Format: ' + (payload.preferredFormat || '—')
    ].join('\n');
  }

  function buildReportHtml(payload){
    var safeValue = function(value){ return (value || '—').toString(); };
    return '<div class="page" style="max-width:660px;margin:0 auto;padding:24px;background:#F5F1E7;">' +
      '<div class="masthead">' +
      '<div class="seal-wrap" style="margin-bottom:12px;"><div class="seal-medal"><span class="seal-code">' + safeValue(payload.levelCode || '') + '</span></div></div>' +
      '<h2 class="screen-title">Placement Test Result</h2>' +
      '<p class="screen-lede">Nurik\'s Academy</p>' +
      '</div>' +
      '<main class="card">' +
      '<div class="result-grid">' +
      '<div class="result-item"><span class="k">STUDENT</span><span class="v">' + safeValue(payload.name) + '</span></div>' +
      '<div class="result-item"><span class="k">DATE</span><span class="v">' + safeValue(payload.dateTime ? new Date(payload.dateTime).toLocaleString() : '') + '</span></div>' +
      '<div class="result-item"><span class="k">STUDENT PHONE</span><span class="v">' + safeValue(payload.phone) + '</span></div>' +
      '<div class="result-item"><span class="k">LEVEL</span><span class="v">' + safeValue(payload.level) + '</span></div>' +
      '<div class="result-item"><span class="k">IELTS EQUIVALENT</span><span class="v">' + safeValue(payload.ielts) + '</span></div>' +
      '<div class="result-item"><span class="k">PREFERRED FORMAT</span><span class="v">' + safeValue(payload.preferredFormat) + '</span></div>' +
      '</div>' +
      (payload.writingSample ? '<label class="field-label">WRITING SAMPLE</label><div class="writing-echo">' + escapeHtml(payload.writingSample) + '</div>' : '') +
      '</main>' +
      '</div>';
  }

  function generatePdfFromPayload(payload){
    return new Promise(function(resolve, reject){
      var wrapper = document.createElement('div');
      wrapper.innerHTML = buildReportHtml(payload);
      wrapper.style.position = 'fixed';
      wrapper.style.left = '-9999px';
      wrapper.style.top = '0';
      wrapper.style.width = '660px';
      wrapper.style.zIndex = '-1';
      document.body.appendChild(wrapper);

      html2canvas(wrapper, {
        useCORS: true,
        backgroundColor: '#F5F1E7',
        scale: 2,
        logging: false
      }).then(function(canvas){
        var imgData = canvas.toDataURL('image/png');
        var pdf = new window.jspdf.jsPDF({ orientation: 'portrait', unit: 'px', format: [canvas.width, canvas.height] });
        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
        wrapper.remove();
        resolve(pdf.output('blob'));
      }).catch(function(err){
        wrapper.remove();
        reject(err);
      });
    });
  }

  function saveEntry(entry){
    var pending = getPendingResults();
    var found = false;
    pending = pending.map(function(item){
      if (item && item.id === entry.id){
        found = true;
        return entry;
      }
      return item;
    });
    if (!found){
      pending.push(entry);
    }
    return savePendingResults(pending);
  }

  function persistPendingResult(lvl, fileName){
    var payload = buildResultPayload(lvl, fileName);
    var pending = getPendingResults();
    var existing = pending.find(function(item){
      return item && item.data && item.data.name === payload.name && item.data.phone === payload.phone && item.data.level === payload.level && item.data.preferredFormat === payload.preferredFormat && item.telegramSent !== true && item.sheetsSent !== true;
    });
    if (existing){
      return existing;
    }

    var entry = {
      id: (Date.now().toString(36) + Math.random().toString(36).slice(2, 8)),
      data: payload,
      telegramSent: false,
      sheetsSent: false
    };
    if (!saveEntry(entry)){
      return null;
    }
    return entry;
  }

  function removePendingResult(entryId){
    var pending = getPendingResults();
    var filtered = pending.filter(function(item){ return item.id !== entryId; });
    if (filtered.length !== pending.length){
      savePendingResults(filtered);
      return true;
    }
    return false; 
  }

 
  function submitToSheets(payload){
    var fields = {
      name: payload.name || '',
      phone: payload.phone || '',
      birthDate: payload.birthDate || '',
      level: payload.level || '',
      studyFormat: payload.preferredFormat || '',
      dateTime: payload.dateTime || ''
    };
    var formBody = Object.keys(fields).map(function(key){
      return encodeURIComponent(key) + '=' + encodeURIComponent(fields[key]);
    }).join('&');
    return fetch(SHEET_WEBHOOK_URL, {
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
      body: formBody,
      mode: 'no-cors'
    }).then(function(){ return true; });
  }

  function syncEntry(entry){
    var payload = entry && entry.data ? entry.data : null;
    if (!payload){
      return Promise.reject(new Error('No payload found for pending result.'));
    }
 
    var runTelegram = function(){
  return fetch(TELEGRAM_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  }).then(function(response){
    return response.json().then(function(result){

      if (!response.ok || !result.success){
        throw new Error(
          result.error || 'Telegram request failed'
        );
      }

      console.log('Telegram message sent successfully', result);

      entry.telegramSent = true;

      if (!saveEntry(entry)){
        console.warn('Could not update pending result after Telegram success.');
      }

      return true;
    });
  });
};

    var runSheets = function(){
      return submitToSheets(payload).then(function(){
        entry.sheetsSent = true;
        if (!saveEntry(entry)){
          console.warn('Could not update pending result after Sheets success.');
        }
        return true;
      });
    };

    return Promise.resolve().then(function(){
      if (entry.telegramSent !== true){
        return runTelegram();
      }
      return true;
    }).then(function(){
      if (entry.sheetsSent !== true){
        return runSheets();
      }
      return true;
    }).then(function(){
      if (entry.telegramSent === true && entry.sheetsSent === true){
        removePendingResult(entry.id);
      }
      return entry;
    }).catch(function(err){
      if (entry.telegramSent !== true){
        entry.telegramSent = false;
      }
      if (entry.sheetsSent !== true){
        entry.sheetsSent = false;
      }
      saveEntry(entry);
      throw err;
    });
  }

  function processPendingResults(){
    var pending = getPendingResults();
    if (!pending.length || !navigator.onLine){
      updateConnectionIndicator();
      return Promise.resolve([]);
    }

    var queue = pending.filter(function(entry){
      return entry && (entry.telegramSent !== true || entry.sheetsSent !== true);
    }).slice();
    if (!queue.length){
      updateConnectionIndicator();
      return Promise.resolve([]);
    }

    var index = 0;
    function runNext(){
      if (index >= queue.length){
        updateConnectionIndicator();
        return Promise.resolve([]);
      }
      var entry = queue[index];
      index += 1;
      return syncEntry(entry).then(function(){
        return runNext();
      }).catch(function(err){
        console.error('Pending result sync failed', err);
        return runNext();
      });
    }
    return runNext();
  }

  function queueResultForSync(lvl){
    if (typeof html2canvas === 'undefined' || !window.jspdf || !window.jspdf.jsPDF){
      console.warn('Telegram export dependencies are unavailable.');
      return Promise.resolve(false);
    }

    var fileName = sanitizeFileName(state.name);
    var entry = persistPendingResult(lvl, fileName);
    if (!entry){
      setResultStatus('⚠️ Internet connection unavailable. Result could not be saved locally because storage is full.', 'error');
      return Promise.resolve(false);
    }

    updateConnectionIndicator();
    if (!navigator.onLine){
      setResultStatus('⚠️ Offline mode\n\nResult saved locally and will sync automatically.\n\n✓ Telegram CRM\n✓ Google Sheets\n✓ Offline Backup Active', 'error');
      return Promise.resolve(false);
    }

    return syncEntry(entry).then(function(){
      if (entry.telegramSent === true && entry.sheetsSent === true){
        setResultStatus('✅ Successfully Saved\n\nResult successfully saved.\n\n✓ Telegram CRM\n✓ Google Sheets\n✓ Offline Backup Active', 'success');
      } else if (entry.telegramSent === true){
        setResultStatus('⚠️ Google Sheets pending\n\nResult successfully saved.\n\n✓ Telegram CRM\n✓ Google Sheets\n✓ Offline Backup Active', 'error');
      } else if (entry.sheetsSent === true){
        setResultStatus('⚠️ Telegram pending\n\nResult successfully saved.\n\n✓ Telegram CRM\n✓ Google Sheets\n✓ Offline Backup Active', 'error');
      } else {
        setResultStatus('⚠️ Offline mode\n\nResult saved locally and will sync automatically.\n\n✓ Telegram CRM\n✓ Google Sheets\n✓ Offline Backup Active', 'error');
      }
      return true;
    }).catch(function(err){
      console.error('Result sync failed', err);
      setResultStatus('⚠️ Offline mode\n\nResult saved locally and will sync automatically.\n\n✓ Telegram CRM\n✓ Google Sheets\n✓ Offline Backup Active', 'error');
      return false;
    });
  }

  function renderResults(){

    renderLadder(state.finalIndex);
    var lvl = LEVELS[state.finalIndex];
    var today = new Date().toLocaleDateString();
    var celebration = (lvl.code === 'B2' || lvl.code === 'C1' || lvl.code === 'C2');

    var html =
      '<h2 class="screen-title">🏆 Your English Level</h2>' +
      (celebration ? '<div class="confetti-layer" id="confettiLayer"></div>' : '') +
      '<div class="seal-wrap"><div class="seal-medal' + (celebration ? ' stamp-animate' : ' reveal') + '"><span class="seal-code">' + lvl.code + '</span></div></div>' +
      '<div class="result-grid">' +
        '<div class="result-item"><span class="k">STUDENT</span><span class="v">' + (state.name || '—') + '</span></div>' +
        '<div class="result-item"><span class="k">DATE</span><span class="v">' + today + '</span></div>' +
        '<div class="result-item"><span class="k">STUDENT PHONE</span><span class="v">' + (state.phone || '—') + '</span></div>' +
        '<div class="result-item"><span class="k">BIRTH DATE</span><span class="v">' + (state.birthDate || '—') + '</span></div>' +
        '<div class="result-item"><span class="k">LEVEL</span><span class="v">' + lvl.code + ' &middot; ' + lvl.name + '</span></div>' +
        '<div class="result-item"><span class="k">RECOMMENDED GROUP</span><span class="v">' + lvl.group + '</span></div>' +
        '<div class="result-item"><span class="k">APPROX. IELTS BAND</span><span class="v">' + lvl.ielts + '</span></div>' +
        '<div class="result-item"><span class="k">CLASS FORMAT</span><span class="v">' + (state.studyFormat ? state.studyFormat.name : '—') + '</span></div>' +
      '</div>' +
      '<p class="screen-lede">' + lvl.desc + '</p>' +
'<div style="margin-top:20px;text-align:center;">' +
'<a href="https://t.me/Nuriksacademy" target="_blank" class="btn btn-primary">📲 Get Free Consultation</a>' +
'</div>';

    if (state.writing){
      html += '<label class="field-label">WRITING SAMPLE (for teacher review)</label><div class="writing-echo">' + escapeHtml(state.writing) + '</div>';
    }

    html += '<div class="trace">Sections tested: ' + traceText() + '</div>';
    html += '<div id="sendStatus" class="send-status" style="display:none;"></div>';
    html += '<div class="row no-print"><button class="btn btn-ghost btn-shine" id="restartBtn">Start New Student</button></div>';

    animateCardTransition(html, function(){
      if (celebration) {
        var confettiLayer = document.getElementById('confettiLayer');
        if (confettiLayer) {
          for (var c = 0; c < 8; c++) {
            var piece = document.createElement('span');
            piece.className = 'confetti-piece';
            piece.style.left = (8 + Math.random() * 84) + '%';
            piece.style.animationDelay = (Math.random() * 0.08) + 's';
            piece.style.setProperty('--drift', ((Math.random() > 0.5 ? 1 : -1) * (12 + Math.random() * 28)) + 'px');
            confettiLayer.appendChild(piece);
          }
        }
      }
      document.getElementById('restartBtn').addEventListener('click', function(){ window.location.reload(); });
      queueResultForSync(lvl);
    });
  }

  window.showPendingResults = function(){
    var pending = getPendingResults();
    console.log('Pending results:', pending);
    return pending;
  };

  window.syncPendingResults = function(){
    return processPendingResults();
  };

  window.resendPendingResults = function(){
    return processPendingResults();
  };

  window.addEventListener('online', function(){
    processPendingResults();
  });

  function sendResultsToSheet(lvl){
    queueResultForSync(lvl);
  }

  function escapeHtml(str){
    return str.replace(/[&<>"']/g, function(m){
      return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[m];
    });
  }

  renderWelcome();
  if (navigator.onLine){
    processPendingResults();
  }
})();

let timeLeft = 5 * 60;
function updateTimer() {
  const el = document.getElementById("timer");
  if(!el) return;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  el.textContent = `⏱ ${String(minutes).padStart(2,"0")}:${String(seconds).padStart(2,"0")}`;
  if (timeLeft <= 0) {
    clearInterval(timerInterval);
    alert("Vaqt tugadi!");
    if (typeof finishTest === "function") finishTest();
  }
  timeLeft--;
}
const timerInterval = setInterval(updateTimer, 1000);
updateTimer();
