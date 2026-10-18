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
    if (nama) { var h = $('#heroSub'); h.textContent = 'Halo ' + nama + '! Selamat belajar bersama TEMANI.'; h.hidden = false; }
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

  var VIS = '<div class="vis"><i style="background:#2EF50B"></i><i style="background:#4A9A3C"></i><i style="background:#2A7A12"></i><i style="background:#176200"></i><i style="background:#78CC6A"></i></div><p class="note">Tes penglihatan: apakah warna tiap kotak terlihat sama atau berbeda? Bila tidak bisa membedakan, sampaikan ke petugas kesehatan.</p>';
  /* ---------- Kartu TEMANI (isi dari Buku Saku TBC RO 2024) ---------- */
  var TL = [
    { k: 'g', h: 'Keluhan ringan', d: 'Teruskan pengobatan. Sampaikan saat kontrol rutin', l: ['Mual tidak lebih dari 24 jam', 'Lemas tapi tidak mengganggu aktivitas', 'Kulit menjadi kehitaman', 'Sakit kepala ringan yang hilang dengan istirahat'] },
    { k: 'y', h: 'Hati-hati', d: 'Segera sampaikan ke petugas kesehatan atau pendamping', l: ['Mual lebih dari 24 jam yang mengganggu makan dan minum', 'Muntah', 'Gangguan penglihatan', 'Jantung berdebar', 'Nyeri perut ringan', 'Nyeri kepala lebih dari 24 jam', 'Lemas hingga mengganggu aktivitas', 'Bicara meracau atau mendengar bisikan', 'Kebas dan nyeri yang tidak mengganggu aktivitas', 'Emosi tidak stabil (sedih atau cemas berlebihan)', 'Sulit tidur', 'Gatal-gatal', 'Pucat', 'Diare 1–3 kali sehari'] },
    { k: 'r', h: 'Peringatan!', d: 'Datang ke layanan TBC RO sekarang', l: ['Mual atau muntah terus-menerus lebih dari 48 jam', 'Pingsan atau kesadaran menurun', 'Lemas hingga sulit beraktivitas', 'Nyeri perut hebat', 'Nyeri dada', 'Pikiran menyakiti diri sendiri', 'Nyeri kepala hebat', 'Mata atau kulit berwarna kuning', 'Kebas dan nyeri hebat', 'Kejang', 'Sesak disertai gangguan kulit', 'Kulit melepuh', 'Diare lebih dari 3 kali dalam sehari'] }
  ];
  var TEMANI = [
    { l: 'T', c: '#C62F18', t: 'Tiga T', s: 'Tepat waktu, tepat cara, tepat dosis', items: [
      { i: '⏰', t: 'Tepat waktu', b: ['Telan obat pada waktu yang sama setiap hari.', 'Pasang alarm harian di ponsel supaya tidak lupa.'] },
      { i: '💧', t: 'Tepat cara', b: ['Telan seluruh obat dalam waktu 2 jam.', 'Bedaquiline dan delamanid sebaiknya diminum bersama makanan berlemak.', 'Hindari minuman susu dan soda 2 jam sebelum/sesudah minum obat.', 'Selalu ikuti petunjuk petugas untuk paduanmu.'] },
      { i: '💊', t: 'Tepat dosis', b: ['Telan obat sesuai dosis yang dianjurkan.', 'Jangan mengurangi atau menambah dosis sendiri.'] },
      { i: '😅', t: 'Lupa minum obat', b: ['Lanjutkan dosis harian hari ini.', 'Jangan menambah dosis yang terlewat sebelumnya.', 'Segera laporkan dan konsultasikan ke petugas kesehatan yang merawat.'] },
      { i: '🛑', t: 'Jangan berhenti dulu', b: ['Hasil dahak negatif bukan berarti semua kuman mati.', 'Obat harus ditelan sampai tuntas sesuai pertimbangan dokter.'] },
      { i: '🌿', t: 'Obat lain dan jamu', b: ['Obat lain atau suplemen boleh, tapi konsultasikan dulu ke dokter atau petugas.', 'Obat tradisional tidak bisa menggantikan obat TBC RO. Belum ada bukti ilmiah obat tradisional menyembuhkan TBC RO.'] }
    ] },
    { l: 'E', c: '#C25E00', t: 'Efek samping', s: 'Kenali, atasi, dan lapor. Jangan berhenti sendiri', tl: true, items: [
      { i: '😩', t: 'Lelah dan lemas', b: ['Cukupi asupan makanan dan minum air putih.', 'Aktivitas fisik seimbang sesuai kemampuan.', 'Tidur nyenyak; bangun dan tidur di jam yang sama.', 'Berjemur pagi sebelum jam 09:00 selama 10–30 menit.', 'Makan makanan berprotein: kacang-kacangan, bayam, ikan, daging, telur, tahu, tempe, yogurt.', 'Minum cairan elektrolit seperti air kelapa atau oralit.'], w: 'Lemas berat yang membatasi aktivitas: segera konsultasi ke petugas.' },
      { i: '💪', t: 'Pegal dan nyeri otot', b: ['Olahraga ringan yang kamu suka: peregangan, jalan kaki, meditasi.', 'Kompres air hangat sekitar 15 menit, 1–2 kali sehari.', 'Rendam kaki dalam air hangat bergaram.', 'Konsultasikan ke petugas untuk penanganan nyeri.'] },
      { i: '🍽️', t: 'Nafsu makan turun', b: ['Makan porsi kecil tapi lebih sering.', 'Pilih makanan tinggi kalori dan protein seperti kue, madu, susu.', 'Variasikan menu agar tidak bosan.', 'Sesuaikan dengan penyakit penyerta; tanya dokter, perawat, atau ahli gizi.'] },
      { i: '🤢', t: 'Mual dan muntah', b: ['Makan porsi kecil dan lebih sering; pilih makanan yang kamu sukai.', 'Makan dan minum perlahan, kunyah dengan baik.', 'Jangan berbaring setelah makan.', 'Hindari aroma yang memicu mual.', 'Tarik napas dalam dan perlahan; alihkan perhatian, misalnya dengan musik.', 'Minum air putih cukup.', 'Minum obat anti muntah dari dokter bila diberikan.'], w: 'Mual atau muntah tidak reda: konsultasi ke dokter atau perawat. Lebih dari 48 jam terus-menerus: datang ke layanan TBC RO sekarang.' },
      { i: '🚽', t: 'Diare', b: ['Hindari makanan berserat tinggi dan berminyak.', 'Perbanyak air putih, boleh ditambah oralit.', 'Konsumsi produk probiotik seperti yogurt.'], w: 'Diare lebih dari 3 kali sehari, atau lemas dan tidak bisa makan/minum: segera ke fasyankes TBC RO.' },
      { i: '👅', t: 'Rasa lidah berubah / air liur banyak', b: ['Tetap lanjutkan obat sambil dievaluasi petugas.', 'Tetap makan dan minum agar tidak lemas dan mual.', 'Coba mengulum es batu atau permen keras, atau cicipi rasa manis, asam, asin (jeruk, mangga muda, garam).', 'Asupan makan minum berkurang: konsultasi ke petugas.'] },
      { i: '🤕', t: 'Pusing dan sakit kepala', b: ['Tidur cukup 7–8 jam dan teratur.', 'Minum air minimal 8–10 gelas sehari.', 'Pejamkan mata, hindari suara mengganggu, buat suasana nyaman.', 'Ganti posisi bertahap: berbaring, duduk 10 detik, berdiri 10 detik, lalu berjalan.', 'Kompres kepala, bahu, dan leher dengan es; pijat 15 menit.', 'Boleh oles minyak gosok hangat beraroma menenangkan.'], w: 'Tampak pucat atau pusing memberat: segera konsultasi ke petugas dan pendamping.' },
      { i: '👀', t: 'Gangguan penglihatan', b: ['Kenali: sulit membaca; sulit membedakan warna (misalnya gradasi hijau); penglihatan buram; ruang pandang menyempit; nyeri saat mata digerakkan; kilatan cahaya; warna tampak lebih redup.', 'Ada satu atau lebih tanda di atas: segera datang ke fasyankes TBC RO.'], x: VIS },
      { i: '💓', t: 'Jantung berdebar / gatal', b: ['Jantung berdebar dan gatal-gatal termasuk kategori "Hati-hati": segera sampaikan ke petugas atau pendamping.', 'Jangan menunggu jadwal kontrol.'], w: 'Nyeri dada, sesak disertai gangguan kulit, atau kulit melepuh: datang ke layanan TBC RO sekarang.' },
      { i: '😴', t: 'Sulit tidur', b: ['Coba relaksasi: berdoa, meditasi, yoga, mandi air hangat, musik.', 'Olahraga teratur, tapi jangan 3 jam sebelum tidur.', 'Hindari kafein (kopi, teh, cokelat, soda) setelah jam 3 sore.', 'Minum minuman hangat sebelum tidur dan jangan tidur dalam keadaan lapar.', 'Tidur dan bangun di jam yang sama; hindari tidur siang lebih dari 1 jam.', 'Jangan minum obat tidur kecuali diresepkan dokter.'] },
      { i: '😟', t: 'Gelisah dan sedih berlebihan', b: ['Bicarakan perasaanmu dengan keluarga, teman dekat, petugas, atau pendamping.', 'Kenali penyebab kegelisahan dan tulis di catatan harian untuk didiskusikan.', 'Lakukan teknik relaksasi.', 'Tanda depresi: minat pada kegiatan yang disukai berubah dalam 2 minggu terakhir, pola tidur berubah, sulit berpikir dan berkonsentrasi, merasa putus asa.'], w: 'Ada tanda di atas: segera konsultasi ke petugas dan pendamping. Pikiran menyakiti diri sendiri: datang ke layanan TBC RO sekarang.' },
      { i: '🖐️', t: 'Kebas', b: ['Kompres air hangat pada bagian yang kebas; bila perlu oleskan krim anti nyeri.', 'Segera konsultasikan ke petugas dan pendamping.'], w: 'Kebas dan nyeri hebat yang mengganggu aktivitas: datang ke layanan TBC RO sekarang.' },
      { i: '🌞', t: 'Warna kulit berubah', b: ['Hindari sinar matahari langsung; pakai tabir surya, topi, atau payung saat siang.', 'Bila kulit kering, gunakan pelembab.', 'Tenang: perubahan warna akan berkurang beberapa bulan setelah pengobatan selesai.', 'Tidak dianjurkan memakai krim pemutih kulit.'] }
    ] },
    { l: 'M', c: '#B83A68', t: 'Mendampingi', s: 'Diri sendiri, keluarga, teman, lingkungan', items: [
      { i: '🪞', t: 'Diri sendiri', b: ['Yakinkan dirimu tetap berharga: TBC RO bisa mengenai siapa saja dan bisa disembuhkan.', 'Yakinkan dirimu mampu menjalani pengobatan sampai tuntas.', 'Libatkan orang yang kamu nyaman dan percaya.', 'Jangan dengarkan komentar negatif yang membuatmu berhenti berobat.'] },
      { i: '🏠', t: 'Keluarga serumah', b: ['Beritahu keluarga tentang kondisi dan pengobatanmu agar mendapat dukungan.', 'Ingatkan: TBC RO menular lewat udara dan percikan ludah, tidak lewat peralatan makan.', 'Sampaikan jujur kondisi emosimu.', 'Tetap beraktivitas seperti biasa dengan masker, dan keluarga mendapat TPT bila memenuhi syarat.'] },
      { i: '🤝', t: 'Teman dan sesama pasien', b: ['Ceritakan ke teman dekat yang kamu percaya agar mereka bisa mendukung.', 'Sesama pasien bisa saling menguatkan, berdiskusi soal efek samping, dan saling mengingatkan minum obat.', 'Lakukan kegiatan positif bersama teman sambil tetap memakai masker.'] },
      { i: '🧑‍⚕️', t: 'Pendamping dan lingkungan', b: ['Tetap bersosialisasi dengan masker, etika batuk, dan cuci tangan.', 'Diskusikan dengan pendamping soal pengobatan, efek samping, ekonomi, stigma, diskriminasi, dan dukungan keluarga.', 'Petugas kesehatan selalu ada untuk membantu pengobatanmu.'] }
    ] },
    { l: 'A', c: '#1E6A96', t: 'Akses obat dan bantuan', s: 'Tahu ke mana harus pergi dan melapor', items: [
      { i: '🏥', t: 'Di mana berobat', b: ['Pengobatan sesuai standar tersedia di rumah sakit, balai kesehatan, dan puskesmas penyedia layanan TBC RO.', 'Daftar layanan TBC RO bisa dicek di laportbc.id.', 'Pengobatan dimulai setelah pasien setuju dan menandatangani lembar kesediaan (informed consent).'] },
      { i: '🩻', t: 'Pemeriksaan awal', b: ['Rontgen dada, darah lengkap, EKG (rekam jantung), tes kehamilan pada wanita usia subur, dan pemeriksaan penunjang lain (mata, saraf, jiwa, dll.).', 'Tujuannya menentukan paduan obat TBC RO yang akan diberikan.'] },
      { i: '🚗', t: 'Pindah atau bepergian', b: ['Lapor ke petugas kesehatan dan pendamping di fasyankes tempat berobat.', 'Sampaikan kapan dan ke mana kamu pindah.', 'Pastikan nomor ponsel yang kamu berikan aktif.'] },
      { i: '🌪️', t: 'Saat bencana alam', b: ['Segera lapor ke Kepala Posko dan petugas kesehatan di posko terdekat soal pengobatanmu.', 'Minta masker kepada petugas dan gunakan untuk mencegah penularan.'] },
      { i: '💸', t: 'Biaya dan kendala', b: ['Soal biaya, transport, atau obat yang sempat tidak tersedia: sampaikan ke petugas dan pendamping agar dicarikan jalan keluar.', 'Isi nomor kontak penting (klinik TBC RO, konsultasi medis, PMO) di halaman kontak Buku Saku.'] }
    ] },
    { l: 'N', c: '#6B3F2A', t: 'Nyalakan pantauan', s: 'Periksa rutin setiap bulan', items: [
      { i: '📅', t: 'Pantauan bulanan', b: ['Setiap bulan lakukan pemantauan rutin di fasyankes tempat kamu berobat.', 'Selalu tanyakan kemajuan pengobatanmu ke petugas.'] },
      { i: '📈', t: 'Tanda kemajuan', b: ['Berat badan naik.', 'Keluhan berkurang.', 'Rontgen dada dan pemeriksaan laboratorium lain membaik.', 'Pemeriksaan dahak.'] },
      { i: '📝', t: 'Catatan harian', b: ['Tulis keluhan dan perasaanmu di catatan harian.', 'Bawa catatan itu ke petugas dan pendamping saat kontrol.'] },
      { i: '😷', t: 'Cegah menular', b: ['Di awal pengobatan risiko penularan masih sangat tinggi: selalu pakai masker.', 'Lakukan etika batuk dengan benar.', 'Pastikan rumah punya ventilasi dan sinar matahari yang cukup.', 'Ajak keluarga memeriksakan diri ke fasyankes terdekat.'] },
      { i: '🏃', t: 'Tetap beraktivitas', b: ['Kamu tetap bisa menjalani aktivitas rutin selama pengobatan, termasuk bekerja, sambil menerapkan pencegahan penularan.'] }
    ] },
    { l: 'I', c: '#9A4A1A', t: 'Ingat kontrol lanjutan', s: 'Tuntas bukan berarti lengah', items: [
      { i: '🗓️', t: 'Kontrol setelah tuntas', b: ['Setelah dinyatakan tuntas, tetap datang kontrol sesuai jadwal dari petugas.', 'Jadwal tepatnya ditentukan fasyankes tempatmu berobat.'] },
      { i: '❤️', t: 'Lindungi orang tersayang', b: ['Ajak keluarga dan kontak erat memeriksakan gejala TBC di fasyankes.', 'Bila bergejala dan positif TBC, mereka diobati; bila tidak bergejala, bisa diberi terapi pencegahan (TPT) jika memenuhi syarat.'] },
      { i: '🥗', t: 'Jaga tubuh', b: ['Makan dan minum sehat dengan gizi seimbang (makanan pokok, lauk pauk, sayur, buah).', 'Berhenti merokok, termasuk rokok elektrik (vape).', 'Punya penyakit penyerta seperti diabetes atau hipertensi: ikuti saran diet dari poli gizi atau dokter.'] }
    ] }
  ];

  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html !== undefined) e.innerHTML = html; return e; }
  var root = $('#temani');
  TEMANI.forEach(function (d, k) {
    var card = el('div', 'tcard' + (k === 0 ? ' open' : ''));
    var head = el('button', 'thead', '<span class="letter" style="--c:' + d.c + '">' + d.l + '</span><span><b>' + d.t + '</b><small>' + d.s + '</small></span>');
    head.type = 'button';
    head.addEventListener('click', function () { card.classList.toggle('open'); });
    var body = el('div', 'tbody');
    if (d.tl) {
      body.appendChild(el('p', 'pick', 'Lampu lalu lintas efek samping: kenali tingkat keluhanmu'));
      var t = el('div', 'tl');
      TL.forEach(function (c) {
        t.appendChild(el('div', c.k, '<h5>' + c.h + '<small>' + c.d + '</small></h5><ul>' + c.l.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul>'));
      });
      body.appendChild(t);
      body.appendChild(el('p', 'note', 'Keluhanmu tidak ada di daftar? Tetap sampaikan ke petugas atau pendamping.'));
    }
    body.appendChild(el('p', 'pick', d.tl ? 'Pilih keluhan untuk melihat cara mengatasinya:' : 'Pilih topik:'));
    var chips = el('div', 'subchips'), panel = el('div', 'panel'), btns = [];
    function show(j) {
      var it = d.items[j];
      btns.forEach(function (b, x) { b.classList.toggle('on', x === j); });
      panel.innerHTML = '<h4>' + it.i + ' ' + it.t + '</h4><ul>' + it.b.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul>' + (it.w ? '<p class="tip warn">⚠️ ' + it.w + '</p>' : '') + (it.x || '');
    }
    d.items.forEach(function (it, j) {
      var b = el('button', 'chip', it.i + ' ' + it.t); b.type = 'button';
      b.addEventListener('click', function () { show(j); });
      btns.push(b); chips.appendChild(b);
    });
    body.appendChild(chips); body.appendChild(panel);
    card.appendChild(head); card.appendChild(body); root.appendChild(card);
    show(0);
  });
})();
