(function () {
  var $ = function (s) { return document.querySelector(s); };
  var $$ = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- YUREKA mengetik sapaan ---------- */
  var msg = 'Hai, aku YUREKA! Selamat datang di TEMANI.';
  var typed = $('#typed');
  function afterTyping() {
    typed.classList.add('done');
    $('#idForm').hidden = false;
  }
  if (reduce) { typed.textContent = msg; afterTyping(); }
  else {
    var i = 0;
    (function tick() {
      typed.textContent = msg.slice(0, ++i);
      if (i < msg.length) setTimeout(tick, 45); else afterTyping();
    })();
  }

  /* ---------- Nama dan umur (hanya di memori, tidak disimpan) ---------- */
  function showGreeting(text) {
    $('#idForm').hidden = true;
    var g = $('#greet'); g.textContent = text; g.hidden = false;
    $('#mulai').hidden = false;
  }
  $('#idForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var nama = $('#nama').value.trim(), umur = parseInt($('#umur').value, 10);
    var t = nama ? 'Senang kenalan, ' + nama + '! ' : 'Senang kenalan! ';
    if (umur && umur < 17) t += 'Ajak orang tuamu membaca bersama ya.';
    else if (umur >= 17) t += 'Yuk kita pelajari bersama, supaya kita bisa mendampingi orang tersayang.';
    else t += 'Yuk kita belajar bersama.';
    showGreeting(t);
    if (nama) { var h = $('.hero .sub'); h.innerHTML = 'Halo ' + nama.replace(/[<>&]/g, '') + '! Bisa disembuhkan. <b>TEMANI</b> sampai tuntas.'; }
  });
  $('#skip').addEventListener('click', function () { showGreeting('Tidak apa-apa, yuk langsung belajar!'); });

  /* ---------- Titik 100 orang, 7,3% ---------- */
  var dots = $('#dots');
  for (var d = 0; d < 100; d++) { var el = document.createElement('i'); dots.appendChild(el); }
  var dotEls = $$('#dots i');

  /* ---------- Hitung naik + titik menyala saat terlihat ---------- */
  var counted = false;
  function runCount() {
    if (counted) return; counted = true;
    var c = $('#count'), to = parseFloat(c.dataset.to), start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / 1400, 1);
      c.textContent = (to * p).toFixed(1).replace('.', ',');
      if (p < 1 && !reduce) requestAnimationFrame(step); else c.textContent = String(to).replace('.', ',');
    }
    requestAnimationFrame(step);
    [0, 1, 2, 3, 4, 5, 6].forEach(function (n, k) {
      setTimeout(function () { dotEls[n * 13 % 100 === n * 13 ? n * 13 % 100 : n].classList.add('hot'); }, reduce ? 0 : 300 + k * 160);
    });
  }
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (en, ob) {
      if (en[0].isIntersecting) { runCount(); ob.disconnect(); }
    }, { threshold: .4 }).observe($('.epi'));
  } else runCount();

  /* ---------- Cek gejala ---------- */
  var boxes = $$('#checks input'), hasil = $('#hasil');
  boxes.forEach(function (b) {
    b.addEventListener('change', function () {
      var n = boxes.filter(function (x) { return x.checked; }).length;
      if (n === 0) { hasil.className = 'hasil'; hasil.textContent = 'Centang gejala di atas untuk melihat saran.'; }
      else {
        hasil.className = 'hasil warn';
        hasil.textContent = 'Ada ' + n + ' gejala. Sebaiknya segera periksa ke puskesmas atau fasyankes terdekat untuk tes dahak (TCM). Gejala saja tidak bisa memastikan TBC kebal obat; hanya pemeriksaan yang bisa memastikan.';
      }
    });
  });

  /* ---------- Slider lama pengobatan ---------- */
  var sl = $('#bulan'), fill = $('#fill'), walker = $('#walker'), txt = $('#bulanTxt');
  function upd() {
    var v = +sl.value, pct = v / 20 * 100;
    fill.style.width = pct + '%'; walker.style.left = pct + '%';
    var s = 'Bulan ke-' + v + ' dari 20. ';
    if (v < 6) s += 'Masih awal. Efek samping paling sering muncul di fase ini; tetap lapor, jangan berhenti.';
    else if (v < 12) s += 'Sudah melewati 6 bulan. Merasa sehat itu bagus, tapi obat tetap harus dilanjutkan sesuai dokter.';
    else s += 'Hampir sampai garis akhir. Terus semangat, kamu hebat!';
    txt.textContent = s;
  }
  sl.addEventListener('input', upd); upd();

  /* ---------- Kartu hambatan ---------- */
  $$('.flip').forEach(function (f) {
    f.addEventListener('click', function () { f.classList.toggle('on'); });
  });

  /* ---------- Kartu TEMANI ---------- */
  $$('.tcard').forEach(function (c) {
    c.querySelector('.letter').style.setProperty('--c', c.dataset.c);
    c.querySelector('.thead').addEventListener('click', function () { c.classList.toggle('open'); });
  });
})();
