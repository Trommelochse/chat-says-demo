/* Chat Says landing: fake "Just Chatting" webcam scene.
   Sets window.CHAT_SAYS_SCENE_HTML (one markup string). Art is one inline SVG
   on a 1600x900 grid, so it scales with the .stream box. Styles: scene.css. */
(function () {
  "use strict";
  var INK = "#2a1d18";
  var glows = ""; // light-bulb glows, filled by lights()

  // tiny seeded random, so the city and lights look the same every load
  var seed = 7;
  function rnd() { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }
  function r1(n) { return Math.round(n * 10) / 10; }

  // point on a quadratic curve
  function q(p0, c, p1, t) {
    var u = 1 - t;
    return [u * u * p0[0] + 2 * u * t * c[0] + t * t * p1[0], u * u * p0[1] + 2 * u * t * c[1] + t * t * p1[1]];
  }

  /* ---------- string lights: two swags across the top ---------- */
  function lights() {
    var swags = [
      [[-30, 34], [330, 210], [720, 58]],
      [[720, 58], [1150, 200], [1630, 30]]
    ];
    var cols = ["#ffd27a", "#ffb862", "#fff0c4", "#ffc98a"];
    var TWINKLE = [3, 11, 16]; // bulb numbers that twinkle
    var wire = "", bulbs = "", k = 0;
    swags.forEach(function (s) {
      wire += '<path d="M' + s[0] + "Q" + s[1] + " " + s[2] + '"/>';
      for (var t = 0.07; t < 0.97; t += 0.095) {
        var p = q(s[0], s[1], s[2], t), x = r1(p[0]), y = r1(p[1]);
        var tilt = Math.round((rnd() - 0.5) * 24);
        var d = (-(rnd() * 4)).toFixed(1);
        // only a few bulbs twinkle (slowly); the rest glow steadily
        var tw = TWINKLE.indexOf(k) >= 0 ? ' class="tw"' : "";
        glows += '<i' + tw + ' style="left:' + r1(x / 16) + "%;top:" + r1((y + 14) / 9) + "%;animation-delay:" + d + 's"></i>';
        bulbs += '<g transform="translate(' + x + " " + y + ") rotate(" + tilt + ')"><rect x="-3.5" y="0" width="7" height="7" rx="1.5" fill="' + INK +
          '"/><ellipse cx="0" cy="14" rx="5.5" ry="8" fill="' + cols[k++ % 4] + '"/><ellipse cx="-1.6" cy="11" rx="1.6" ry="3" fill="#fff" opacity=".7"/></g>';
      }
    });
    return '<g class="sc-lights"><g fill="none" stroke="' + INK + '" stroke-width="2.2" stroke-linecap="round">' + wire +
      "</g>" + bulbs + "</g>";
  }

  /* ---------- city seen through the window ---------- */
  function city() {
    var back = "", front = "", wins = "", x;
    for (x = 248; x < 598;) {
      var w = 30 + rnd() * 40, h = 60 + rnd() * 110;
      back += '<rect x="' + r1(x) + '" y="' + r1(452 - h - 40) + '" width="' + r1(Math.min(w, 602 - x)) + '" height="' + r1(h + 40) + '"/>';
      x += w + 2;
    }
    for (x = 248; x < 590;) {
      var fw = 40 + rnd() * 50, fh = 40 + rnd() * 90, top = 452 - fh;
      fw = Math.min(fw, 602 - x);
      front += '<rect x="' + r1(x) + '" y="' + r1(top) + '" width="' + r1(fw) + '" height="' + r1(fh) + '"/>';
      for (var wy = top + 10; wy < 446; wy += 15) {
        for (var wx = x + 7; wx < x + fw - 9; wx += 13) {
          var v = rnd();
          if (v < 0.3) {
            var tw = v < 0.05 ? ' class="sc-tw" style="animation-delay:-' + (rnd() * 5).toFixed(1) + 's"' : "";
            wins += '<rect' + tw + ' x="' + r1(wx) + '" y="' + r1(wy) + '" width="6" height="8"/>';
          }
        }
      }
      x += fw + 3;
    }
    return '<g fill="#4c3d63" opacity=".85">' + back + '</g><g fill="#271f38">' + front + '</g><g fill="#ffcf7a">' + wins + "</g>";
  }

  function stars() {
    var s = "";
    for (var i = 0; i < 22; i++) {
      s += '<circle cx="' + r1(250 + rnd() * 350) + '" cy="' + r1(80 + rnd() * 170) + '" r="' + r1(0.8 + rnd() * 1.6) + '"/>';
    }
    return '<g fill="#fff4dc" opacity=".75">' + s + "</g>";
  }

  /* ---------- keyboard keys ---------- */
  function keys() {
    var s = "";
    for (var row = 0; row < 4; row++) {
      var y = 815 + row * 17, inset = 30 - row * 6, x0 = 642 + inset, x1 = 958 - inset;
      var n = 15, step = (x1 - x0) / n;
      for (var i = 0; i < n; i++) {
        if (row === 3 && i > 4 && i < 10) { if (i === 5) s += '<rect x="' + r1(x0 + 5 * step) + '" y="' + y + '" width="' + r1(step * 5 - 3) + '" height="12" rx="2.5"/>'; continue; }
        s += '<rect x="' + r1(x0 + i * step) + '" y="' + y + '" width="' + r1(step - 3) + '" height="12" rx="2.5"/>';
      }
    }
    return s;
  }

  var svg =
'<svg class="sc-art" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">' +


/* wall */

/* window + curtain */
'<g class="sc-window">' +
  '<path d="M230 60h390v410H230zM248 78v374h354V78z" fill="#d8c6a4" fill-rule="evenodd"/>' +
  '<g>' + stars() +
    '<circle cx="520" cy="140" r="26" fill="#fbeccc"/><circle cx="532" cy="132" r="23" fill="#2a2a4c"/>' +
    city() +
    '<path d="M248 90l120 -12h40l-160 200z" fill="#fff" opacity=".05"/>' +
  '</g>' +
  '<g fill="#d8c6a4"><rect x="418" y="78" width="14" height="374"/><rect x="248" y="258" width="354" height="12"/></g>' +
  '<path d="M230 60h390v410H230z" fill="none" stroke="' + INK + '" stroke-width="3" opacity=".55"/>' +
  '<rect x="212" y="462" width="426" height="22" rx="3" fill="#cdb995"/><rect x="212" y="480" width="426" height="8" fill="#000" opacity=".2"/>' +
  /* little succulent on the sill */
  '<path d="M540 462l6-34h44l6 34z" fill="#b5603f"/><path d="M552 430c-12-22 0-34 10-36 6 12 6 24 2 36zM570 430c-2-26 12-36 22-36 0 14-6 28-14 36zM562 430c0-20 4-32 8-38 6 10 4 26 0 38z" fill="#6c9a5e" stroke="#3f6a46" stroke-width="2"/>' +
  /* rod + curtain */
  '<rect x="150" y="40" width="540" height="9" rx="4.5" fill="' + INK + '"/>' +
  '<path d="M160 46c-6 140 6 300-4 520h120c-14-130-20-250 4-310 18-46 26-130 14-210z" fill="#4e7a6c"/>' +
  '<path d="M186 60c4 120-2 260 6 500M226 60c-6 120 -4 230 4 330" stroke="#36584d" stroke-width="7" fill="none" stroke-linecap="round"/>' +
  '<path d="M276 566c-14-130-20-250 4-310 18-46 26-130 14-210" stroke="' + INK + '" stroke-width="2.5" fill="none" opacity=".35"/>' +
'</g>' +

lights() +

/* small framed print, right of the head */
'<g class="sc-print"><rect x="968" y="118" width="96" height="120" fill="#e8dcc4" stroke="' + INK + '" stroke-width="5"/>' +
  '<circle cx="1016" cy="166" r="20" fill="#d4563c"/><path d="M978 228c18-30 34-34 50-20s26 6 28-6v26h-78z" fill="#3f6e6b"/></g>' +

/* shelves */
'<g class="sc-shelves">' +
  '<g fill="#5e3b28"><rect x="1100" y="232" width="440" height="16" rx="2"/><rect x="1100" y="430" width="440" height="16" rx="2"/></g>' +
  '<g fill="#000" opacity=".22"><rect x="1100" y="248" width="440" height="10"/><rect x="1100" y="446" width="440" height="10"/></g>' +
  /* top shelf books */
  '<g stroke="' + INK + '" stroke-width="2.5">' +
    '<rect x="1118" y="150" width="26" height="82" fill="#a9483a"/><rect x="1144" y="162" width="20" height="70" fill="#d6a646"/>' +
    '<rect x="1164" y="140" width="30" height="92" fill="#3f6e6b"/><rect x="1194" y="158" width="22" height="74" fill="#e7dcc5"/>' +
    '<path d="M1218 232l22-80 22 6-22 80z" fill="#5b4a6e"/>' +
  '</g>' +
  '<g fill="#e7dcc5" opacity=".5"><rect x="1122" y="164" width="18" height="5"/><rect x="1168" y="156" width="22" height="5"/><rect x="1168" y="210" width="22" height="5"/></g>' +
  /* pothos pot + vines */
  '<path d="M1300 232l-8-58h96l-8 58z" fill="#e2d3b5" stroke="' + INK + '" stroke-width="2.5"/>' +
  '<path d="M1294 186h92" stroke="#c74a33" stroke-width="7"/>' +
  '<g fill="none" stroke="#3f6a46" stroke-width="3">' +
    '<path d="M1306 184c-20 60-14 160-26 270"/><path d="M1340 180c4 70 -10 120 0 190"/><path d="M1376 184c26 70 20 140 34 210"/>' +
  '</g>' +
  '<g fill="#6c9a5e" stroke="#3f6a46" stroke-width="2">' +
    '<path d="M1300 176c-22-6-30-30-18-40 14 2 22 20 18 40zM1322 172c-6-22 6-42 20-40 4 16-6 34-20 40zM1352 172c2-24 22-36 34-28-2 16-18 28-34 28zM1380 178c14-16 36-14 40 0-12 8-28 8-40 0z"/>' +
    '<path d="M1300 230c-16 4-26-8-22-20 12 0 20 8 22 20zM1294 300c-16 2-24-10-20-22 12 2 18 10 20 22zM1286 380c-16 4-26-8-22-20 12 0 20 8 22 20zM1282 446c14 6 24-4 22-16-12-2-20 6-22 16z"/>' +
    '<path d="M1336 250c14 6 24-4 22-16-12-2-20 6-22 16zM1334 330c-16 2-24-10-20-22 12 2 18 10 20 22zM1342 366c14 6 24-4 22-16-12-2-20 6-22 16z"/>' +
    '<path d="M1384 250c16 4 26-8 22-20-12 0-20 8-22 20zM1396 320c-14 6-24-4-22-16 12-2 20 6 22 16zM1404 390c16 2 24-10 20-22-12 2-18 10-20 22z"/>' +
  '</g>' +
  /* photo frame */
  '<g transform="rotate(4 1470 190)"><rect x="1436" y="150" width="70" height="82" fill="#f2e8d4" stroke="' + INK + '" stroke-width="3"/><rect x="1446" y="160" width="50" height="50" fill="#8aa6a3"/><circle cx="1471" cy="200" r="12" fill="#d48a4c"/></g>' +
  /* lower shelf: stacked books, speaker, cactus */
  '<g stroke="' + INK + '" stroke-width="2.5"><rect x="1120" y="408" width="120" height="22" fill="#3f6e6b"/><rect x="1128" y="388" width="104" height="20" fill="#d6a646"/><rect x="1116" y="370" width="114" height="18" fill="#a9483a"/></g>' +
  '<rect x="1270" y="350" width="64" height="80" rx="6" fill="#2f2a2a" stroke="' + INK + '" stroke-width="2.5"/><circle cx="1302" cy="404" r="17" fill="#1c1818" stroke="#4a4242" stroke-width="3"/><circle cx="1302" cy="368" r="6" fill="#4a4242"/>' +
  '<path d="M1450 430l-6-36h56l-6 36z" fill="#c4704a" stroke="' + INK + '" stroke-width="2.5"/>' +
  '<path d="M1464 394c-4-30 2-50 8-52 8 2 10 22 6 52zM1458 394c-12-6-14-20-10-26 8 0 12 12 10 26zM1484 394c8-8 18-10 22-4-4 6-12 6-22 4z" fill="#5f8f5c" stroke="#355c40" stroke-width="2"/>' +
'</g>' +

/* big leafy plant, far left */
'<g class="sc-plant">' +
  '<g fill="none" stroke="#355c40" stroke-width="5" stroke-linecap="round"><path d="M120 700c-4-120 -30-210 -70-270"/><path d="M128 700c10-110 40-200 96-250"/><path d="M124 700c2-140 4-220 -6-330"/><path d="M130 700c30-80 60-110 120-140"/><path d="M122 640c10-150 30-260 74-340"/><path d="M116 660c-10-160-40-300-96-410"/></g>' +
  '<g stroke="#2f5238" stroke-width="2.5">' +
    '<path d="M50 430c-60-10-80-70-50-120 40 10 70 60 50 120z" fill="#4f7f55"/>' +
    '<path d="M224 450c10-60 70-90 120-60-14 46-64 74-120 60z" fill="#5f8f5c"/>' +
    '<path d="M118 370c-40-40-40-110 0-140 40 30 40 100 0 140z" fill="#6c9a5e"/>' +
    '<path d="M250 560c30-50 90-50 110-10-30 30-80 36-110 10z" fill="#4f7f55"/>' +
    '<path d="M60 540c-50 0-80-50-60-90 40-4 70 40 60 90z" fill="#5f8f5c"/>' +
    '<path d="M196 300c-6-54 30-96 80-96 6 50-30 92-80 96z" fill="#4f7f55"/>' +
    '<path d="M20 250c-40-30-44-90-14-120 34 20 44 80 14 120z" fill="#6c9a5e"/>' +
  '</g>' +
  '<g fill="none" stroke="#2f5238" stroke-width="2" opacity=".7"><path d="M50 430c-10-40-26-70-50-120"/><path d="M118 370c0-50 0-90 0-140"/><path d="M224 450c30-30 70-50 120-60"/><path d="M60 540c-10-30-30-60-60-90"/><path d="M250 560c40-20 70-20 110-10"/><path d="M196 300c16-40 40-70 80-96"/><path d="M20 250c0-40-4-80-14-120"/></g>' +
'</g>' +

/* desk lamp light on the wall */

/* chair back */
'<path class="sc-chair" d="M604 720l10-330c4-70 70-100 186-100s182 30 186 100l10 330z" fill="#2f504f" stroke="' + INK + '" stroke-width="4"/>' +
'<path d="M610 718l8-320c4-60 50-92 140-98-60 20-90 60-94 110l-6 308z" fill="#3f6865"/>' +
'<path d="M990 718l-8-320c-3-50-30-82-80-94 34 20 50 52 52 102l6 312z" fill="#243e3e"/>' +
'<path d="M604 720l10-330c4-70 70-100 186-100s182 30 186 100l10 330" fill="none" stroke="' + INK + '" stroke-width="4"/>' +
'<path d="M636 400c10-56 70-82 164-82s154 26 164 82" fill="none" stroke="#4b7774" stroke-width="5" stroke-linecap="round" opacity=".7"/>' +

/* ---------- the streamer ---------- */
'<g class="sc-person">' +
  '<g class="sc-upper">' +
    /* torso / sweater */
    '<path d="M686 520c32-34 72-44 114-44s84 10 114 44c36 40 52 110 58 210H628c6-100 22-170 58-210z" fill="#c4923e" stroke="' + INK + '" stroke-width="4"/>' +
    '<path d="M900 508c36 40 54 120 58 222h14c-6-100-22-170-58-210z" fill="#9c6f2c" opacity=".8"/>' +
    '<g fill="none" stroke="#a87a30" stroke-width="3.5" stroke-linecap="round">' +
      '<path d="M786 520c-10 14 10 24 0 38s10 24 0 38 10 24 0 38 10 24 0 38 10 24 0 38"/><path d="M814 520c10 14-10 24 0 38s-10 24 0 38-10 24 0 38-10 24 0 38-10 24 0 38"/>' +
      '<path d="M740 540v180M860 540v180"/>' +
    '</g>' +
    /* neck */
    '<path d="M770 420h60l2 58c-12 12-52 12-64 0z" fill="#a86c48"/>' +
    /* collar rib */
    '<path d="M756 480c14 22 74 22 88 0" fill="none" stroke="#a87a30" stroke-width="12" stroke-linecap="round"/>' +
    '<path d="M756 480c14 22 74 22 88 0" fill="none" stroke="' + INK + '" stroke-width="2.5" opacity=".5" transform="translate(0 7)"/>' +

    /* head */
    '<g class="sc-head">' +
      /* hair bun + back hair */
      '<path d="M762 232c-10-30 8-56 36-58 30-4 52 18 48 46-2 14-10 22-18 26-20 6-50 4-66-14z" fill="#2b1b14" stroke="' + INK + '" stroke-width="3"/>' +
      '<path d="M780 196c10-8 30-8 40 2M774 218c14 6 40 6 58-4" fill="none" stroke="#4a3024" stroke-width="3" stroke-linecap="round"/>' +
      '<path d="M720 360c-14-70 20-112 80-112s96 42 82 112c-6 24-10 40-16 52H736c-6-12-12-28-16-52z" fill="#2b1b14"/>' +
      /* face */
      '<path d="M728 342c-2-50 30-80 72-80s76 30 72 80c-2 52-28 100-72 102-44-2-70-50-72-102z" fill="#c98b62" stroke="' + INK + '" stroke-width="4"/>' +
      '<path d="M862 330c6 56-18 106-62 114 34-10 50-50 54-90 2-14 4-20 8-24z" fill="#a86c48" opacity=".75"/>' +
      /* fringe */
      '<path d="M724 356c-10-62 22-100 76-100 56 0 88 38 78 96-6-24-18-40-36-50-24 14-60 12-82 4-18 10-30 28-36 50z" fill="#2b1b14" stroke="' + INK + '" stroke-width="3"/>' +
      '<path d="M752 300c14-12 34-18 50-16M820 284c16 2 30 10 38 20" fill="none" stroke="#4a3024" stroke-width="3" stroke-linecap="round"/>' +
      '<path d="M732 352c-8 14-4 30 4 40M868 350c8 14 6 30-2 40" fill="none" stroke="#2b1b14" stroke-width="4" stroke-linecap="round"/>' +
      '<path d="M736 356c-6-20-4-42 8-58" fill="none" stroke="#e8a46a" stroke-width="3" stroke-linecap="round" opacity=".55"/>' +
      /* cheeks + freckles */
      '<g fill="#e07b62" opacity=".45"><ellipse cx="754" cy="398" rx="15" ry="8"/><ellipse cx="848" cy="398" rx="15" ry="8"/></g>' +
      '<g fill="#8a5236" opacity=".55"><circle cx="760" cy="392" r="1.8"/><circle cx="768" cy="398" r="1.6"/><circle cx="752" cy="400" r="1.5"/><circle cx="842" cy="392" r="1.8"/><circle cx="834" cy="398" r="1.6"/><circle cx="850" cy="400" r="1.5"/></g>' +
      /* brows */
      '<g fill="none" stroke="#2b1b14" stroke-width="5.5" stroke-linecap="round"><path d="M750 322c8-9 22-11 34-5"/><path d="M818 317c12-6 26-4 34 5"/></g>' +
      /* eyes */
      '<g class="sc-eyes" fill="' + INK + '"><ellipse class="sc-eye" cx="768" cy="362" rx="6.5" ry="9"/><ellipse class="sc-eye" cx="834" cy="362" rx="6.5" ry="9"/></g>' +
      '<g fill="#fff"><circle cx="770.5" cy="358" r="2.3"/><circle cx="836.5" cy="358" r="2.3"/></g>' +
      /* glasses */
      '<g fill="#fff" fill-opacity=".08" stroke="' + INK + '" stroke-width="4.5"><circle cx="768" cy="362" r="25"/><circle cx="834" cy="362" r="25"/></g>' +
      '<path d="M793 360c4-5 12-5 16 0M743 356l-14-4M859 356l14-4" fill="none" stroke="' + INK + '" stroke-width="4" stroke-linecap="round"/>' +
      '<path d="M754 348c4-6 10-9 16-10M820 348c4-6 10-9 16-10" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".5"/>' +
      /* nose + mouth */
      '<path d="M801 372c-5 12-8 20-1 23" fill="none" stroke="#7a4630" stroke-width="3.5" stroke-linecap="round"/>' +
      '<path d="M776 408c12 24 40 26 52 0-16 5-36 5-52 0z" fill="#5a2420" stroke="' + INK + '" stroke-width="3" stroke-linejoin="round"/>' +
      '<path d="M780 410c14 4 30 4 44 0l-2 5c-14 3-28 3-40 0z" fill="#f6efe4"/>' +
      '<path d="M790 424c6-6 18-6 24 0-6 4-18 4-24 0z" fill="#d86a5e"/>' +
      /* headphones */
      '<path d="M722 372c-12-96 30-142 78-142s90 46 78 142" fill="none" stroke="' + INK + '" stroke-width="15" stroke-linecap="round"/>' +
      '<path d="M728 334c-2-60 28-94 72-96" fill="none" stroke="#7a6a60" stroke-width="4" stroke-linecap="round"/>' +
      '<g stroke="' + INK + '" stroke-width="3.5"><rect x="724" y="342" width="22" height="66" rx="10" fill="#e9dcc3"/><rect x="854" y="342" width="22" height="66" rx="10" fill="#d9c9ab"/>' +
      '<rect x="696" y="334" width="38" height="82" rx="17" fill="#3d3532"/><rect x="866" y="334" width="38" height="82" rx="17" fill="#2f2826"/></g>' +
      '<path d="M704 352c2-8 6-11 12-12" fill="none" stroke="#7a6a60" stroke-width="3" stroke-linecap="round"/>' +
      '<g fill="#c94a33"><circle cx="715" cy="390" r="4.5"/><circle cx="885" cy="390" r="4.5"/></g>' +
    '</g>' +
  '</g>' +

  /* arms resting on the desk (drawn after the desk top, see below) */
'</g>' +

/* ---------- desk ---------- */
'<path d="M0 704h1600v196H0z" fill="#74492f"/>' +
'<g fill="#2a160c"><rect y="790" width="1600" height="110" opacity=".12"/><rect y="850" width="1600" height="50" opacity=".14"/></g>' +
'<path d="M0 704h1600" stroke="#9a6a48" stroke-width="5"/>' +
'<g fill="none" stroke="#3e2618" stroke-width="2" opacity=".35"><path d="M0 760c300-8 500 6 820-2s560 8 780 0"/><path d="M0 830c240 6 520-8 760 0s600 6 840-4"/><path d="M1040 790c80-10 160-6 240 0"/></g>' +

/* desk lamp */
'<g class="sc-lamp">' +
  '<ellipse cx="300" cy="770" rx="62" ry="14" fill="#000" opacity=".25"/>' +
  '<path d="M246 766c0-14 24-22 54-22s54 8 54 22z" fill="' + INK + '"/>' +
  '<path d="M300 752l-46-210 120-96" fill="none" stroke="' + INK + '" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>' +
  '<path d="M300 752l-46-210 120-96" fill="none" stroke="#5a4a42" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" transform="translate(-3 -2)"/>' +
  '<circle cx="254" cy="542" r="10" fill="#5a4a42" stroke="' + INK + '" stroke-width="3"/>' +
  '<path d="M360 418l78-30 40 104c-30 26-92 44-140 40z" fill="#c94a33" stroke="' + INK + '" stroke-width="4" stroke-linejoin="round"/>' +
  '<path d="M370 424l60-22" stroke="#e4775a" stroke-width="5" stroke-linecap="round"/>' +
  '<ellipse cx="408" cy="512" rx="73" ry="13" fill="#fff1c8" stroke="' + INK + '" stroke-width="3.5" transform="rotate(-16 408 512)"/>' +
  '<ellipse cx="410" cy="514" rx="26" ry="7" fill="#fffaf0" transform="rotate(-16 410 514)"/>' +
'</g>' +

/* mug + steam */
'<g class="sc-mug">' +
  '<ellipse cx="510" cy="788" rx="44" ry="10" fill="#000" opacity=".25"/>' +
  '<path d="M538 726c30-4 34 44 0 46" fill="none" stroke="' + INK + '" stroke-width="12"/><path d="M538 726c30-4 34 44 0 46" fill="none" stroke="#e9dcc3" stroke-width="6"/>' +
  '<path d="M472 714h76l-6 66c-2 10-12 14-32 14s-30-4-32-14z" fill="#e9dcc3" stroke="' + INK + '" stroke-width="4" stroke-linejoin="round"/>' +
  '<ellipse cx="510" cy="716" rx="37" ry="7" fill="#5b3524" stroke="' + INK + '" stroke-width="3"/>' +
  '<path d="M486 740h48" stroke="#c94a33" stroke-width="8"/>' +
  '<g fill="none" stroke="#fff6e6" stroke-width="5" stroke-linecap="round"><path class="sc-steam" d="M498 700c-12-16 12-26 0-44s8-28 2-40"/><path class="sc-steam sc-steam2" d="M522 702c10-14-10-24 2-40s-6-24 0-34"/></g>' +
'</g>' +

/* takeaway menu (dinner hint) */
'<g class="sc-menu" transform="rotate(-9 1060 800)">' +
  '<rect x="1000" y="752" width="124" height="96" rx="3" fill="#f2e8d4" stroke="' + INK + '" stroke-width="3"/>' +
  '<rect x="1000" y="752" width="124" height="22" fill="#c94a33"/><path d="M1062 752v96" stroke="' + INK + '" stroke-width="1.5" opacity=".3"/>' +
  '<path d="M1012 788l22-6-14 24z" fill="#e5a33f" stroke="' + INK + '" stroke-width="2"/><circle cx="1019" cy="790" r="2" fill="#c94a33"/>' +
  '<g stroke="#8a7a66" stroke-width="3" stroke-linecap="round"><path d="M1040 790h14M1012 816h40M1012 828h30M1072 790h40M1072 802h30M1072 816h36"/></g>' +
  '<circle cx="1092" cy="830" r="9" fill="#f6efe4" stroke="' + INK + '" stroke-width="2"/><circle cx="1092" cy="830" r="4" fill="#d4563c"/>' +
'</g>' +

/* audio box the mic plugs into */
'<g class="sc-box"><rect x="1140" y="716" width="100" height="44" rx="6" fill="#2f2a2a" stroke="' + INK + '" stroke-width="3"/>' +
  '<circle cx="1164" cy="738" r="12" fill="#4a4242" stroke="' + INK + '" stroke-width="2"/><path d="M1164 738l-6-7" stroke="#e9dcc3" stroke-width="2.5" stroke-linecap="round"/>' +
  '<circle cx="1194" cy="738" r="7" fill="#1c1818"/><circle class="sc-led-ok" cx="1222" cy="738" r="5" fill="#7bd88f"/><circle class="sc-led-bad" cx="1222" cy="738" r="5" fill="#ff5a3c"/></g>' +

/* keyboard */
'<g class="sc-kb"><path d="M646 800h308l26 84H620z" fill="#e6dccb" stroke="' + INK + '" stroke-width="4" stroke-linejoin="round"/>' +
  '<g fill="#cfc2ac">' + keys() + '</g></g>' +

/* arms + hands */
'<g class="sc-arms" stroke="' + INK + '" stroke-width="4" stroke-linejoin="round">' +
  '<path d="M690 520c-34 30-58 120-60 214 0 34 40 70 104 78l18-40c-40-6-64-22-66-44-2-60 6-130 20-180z" fill="#c4923e"/>' +
  '<path d="M910 520c34 30 58 120 60 214 0 34-40 70-104 78l-18-40c40-6 64-22 66-44 2-60-6-130-20-180z" fill="#b2842f"/>' +
  '<path d="M730 776l6 36" stroke="#a87a30" stroke-width="10"/><path d="M870 776l-6 36" stroke="#9c6f2c" stroke-width="10"/>' +
  '<path d="M734 790c18-10 42-6 50 8 6 12-4 26-24 28-20 2-32-8-34-20z" fill="#c98b62"/>' +
  '<path d="M866 790c-18-10-42-6-50 8-6 12 4 26 24 28 20 2 32-8 34-20z" fill="#b97c56"/>' +
'</g>' +

/* mic on a boom arm */
'<g class="sc-mic">' +
  '<path d="M1280 708l-120-300-188 86" fill="none" stroke="' + INK + '" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>' +
  '<path d="M1274 698l-112-282" fill="none" stroke="#5a4a42" stroke-width="3" stroke-dasharray="7 6"/>' +
  '<path d="M1156 414l-170 78" fill="none" stroke="#5a4a42" stroke-width="3" stroke-dasharray="7 6"/>' +
  '<circle cx="1160" cy="408" r="11" fill="#3a3330" stroke="' + INK + '" stroke-width="3"/>' +
  '<rect x="1258" y="698" width="44" height="18" rx="3" fill="#3a3330" stroke="' + INK + '" stroke-width="3"/>' +
  '<g transform="rotate(-34 940 470)">' +
    '<rect x="914" y="420" width="52" height="128" rx="22" fill="#2f2a2a" stroke="' + INK + '" stroke-width="4"/>' +
    '<rect x="914" y="420" width="52" height="58" rx="22" fill="#4a4242" stroke="' + INK + '" stroke-width="4"/>' +
    '<g stroke="#2a2424" stroke-width="2"><path d="M920 436h40M916 450h48M918 464h44"/></g>' +
    '<path d="M922 432c2-6 6-8 10-9" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".35" fill="none"/>' +
    '<rect x="908" y="490" width="64" height="12" rx="4" fill="#1c1818"/>' +
    '<rect class="sc-plugged" x="928" y="546" width="24" height="18" rx="3" fill="#1c1818"/>' +
  '</g>' +
  /* cable: plugged in */
  '<path class="sc-plugged" d="M996 558c34 56 110 110 196 160" fill="none" stroke="#1c1818" stroke-width="6" stroke-linecap="round"/>' +
  /* cable: fell out (trouble state) */
  '<g class="sc-unplugged">' +
    '<path d="M1192 718c-70-40-136-70-176-60" fill="none" stroke="#1c1818" stroke-width="6" stroke-linecap="round"/>' +
    '<rect x="988" y="648" width="30" height="18" rx="4" fill="#1c1818" transform="rotate(-14 1003 657)"/>' +
    '<g stroke="#ffd23a" stroke-width="3.5" stroke-linecap="round"><path d="M972 640l-12-10M968 660h-16M978 622l-6-14"/></g>' +
  '</g>' +
'</g>' +

/* the cat */
'<g class="sc-cat">' +
  '<ellipse cx="1376" cy="772" rx="96" ry="14" fill="#000" opacity=".25"/>' +
  '<path class="sc-tail" d="M1436 760c40 6 74-4 84-28 8-18 0-34-10-38" fill="none" stroke="' + INK + '" stroke-width="22" stroke-linecap="round"/>' +
  '<path class="sc-tail" d="M1436 760c40 6 74-4 84-28 8-18 0-34-10-38" fill="none" stroke="#d48a4c" stroke-width="15" stroke-linecap="round"/>' +
  '<path d="M1312 770c-14-60 0-120 30-150h70c30 30 44 90 30 150z" fill="#d48a4c" stroke="' + INK + '" stroke-width="4"/>' +
  '<path d="M1350 770c-8-40-4-90 10-120h32c14 30 18 80 10 120z" fill="#f0d9b5"/>' +
  '<path d="M1322 690c14-2 22 4 28 10M1318 720c14-2 24 4 30 12M1432 690c-14-2-22 4-28 10M1436 720c-14-2-24 4-30 12" fill="none" stroke="#b06a33" stroke-width="5" stroke-linecap="round"/>' +
  '<path d="M1340 770c0-16 10-22 20-22s16 8 14 22zM1384 770c0-16 8-22 18-22s18 8 16 22z" fill="#f0d9b5" stroke="' + INK + '" stroke-width="3"/>' +
  '<g class="sc-cathead">' +
    '<path d="M1324 600l-6-56 40 26zM1428 600l6-56-40 26z" fill="#d48a4c" stroke="' + INK + '" stroke-width="4" stroke-linejoin="round"/>' +
    '<path d="M1326 590l-2-32 20 14zM1426 590l2-32-20 14z" fill="#e9a790"/>' +
    '<path d="M1376 560c40 0 64 24 64 54 0 28-26 48-64 48s-64-20-64-48c0-30 24-54 64-54z" fill="#d48a4c" stroke="' + INK + '" stroke-width="4"/>' +
    '<path d="M1362 566l4 16M1376 562v18M1390 566l-4 16" stroke="#b06a33" stroke-width="5" stroke-linecap="round"/>' +
    '<g fill="none" stroke="' + INK + '" stroke-width="4" stroke-linecap="round"><path d="M1342 612c6 6 14 6 20 0"/><path d="M1390 612c6 6 14 6 20 0"/><path d="M1368 632c4 5 12 5 16 0"/></g>' +
    '<path d="M1370 624h12l-6 6z" fill="#c25a5a"/>' +
    '<g stroke="#f6efe4" stroke-width="2" stroke-linecap="round" opacity=".8"><path d="M1340 630l-26 -4M1340 638l-24 6M1412 630l26-4M1412 638l24 6"/></g>' +
  '</g>' +
'</g>' +

/* trouble state: speech bubble with a muted mic */
'<g class="sc-mute" transform="translate(740 296) scale(1.15) translate(-740 -296)">' +
  '<path d="M644 196h84c10 0 16 6 16 16v42c0 10-6 16-16 16h-6l18 26-40-26h-56c-10 0-16-6-16-16v-42c0-10 6-16 16-16z" fill="#f6efe4" stroke="' + INK + '" stroke-width="4" stroke-linejoin="round"/>' +
  '<rect x="674" y="206" width="20" height="32" rx="10" fill="none" stroke="' + INK + '" stroke-width="4.5"/>' +
  '<path d="M666 226c0 15 10 22 18 22s18-7 18-22M684 248v9" fill="none" stroke="' + INK + '" stroke-width="4.5" stroke-linecap="round"/>' +
  '<path d="M662 206l46 52" stroke="#e0303f" stroke-width="6.5" stroke-linecap="round"/>' +
'</g>' +
'</svg>';

  // glows, desk-lamp light, grain and vignette are plain HTML layers (no SVG ids,
  // so many copies of the scene can live on one page, even hidden ones)
  window.CHAT_SAYS_SCENE_HTML = '<div class="sc-scene" role="img" aria-label="A streamer in headphones chats from a cozy desk at night, a cat dozing beside them">' +
    svg + '<div class="sc-glows" aria-hidden="true">' + glows + '</div><div class="sc-light"></div><div class="sc-grain"></div><div class="sc-vignette"></div></div>';
  window.CHAT_SAYS_SCENE_VERSION = "1";
})();
