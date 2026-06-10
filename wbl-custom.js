(function () {
  'use strict';

  /* ---------- 0. Load Google Fonts (thay cho @import / <link>) ---------- */
  if (!document.getElementById('wbl-fonts')) {
    var pre1 = document.createElement('link');
    pre1.rel = 'preconnect'; pre1.href = 'https://fonts.googleapis.com';
    var pre2 = document.createElement('link');
    pre2.rel = 'preconnect'; pre2.href = 'https://fonts.gstatic.com'; pre2.crossOrigin = 'anonymous';
    var font = document.createElement('link');
    font.id = 'wbl-fonts';
    font.rel = 'stylesheet';
    font.href = 'https://fonts.googleapis.com/css2?family=Noto+Sans+Lao:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@400;500;600;700&display=swap';
    document.head.appendChild(pre1);
    document.head.appendChild(pre2);
    document.head.appendChild(font);
  }

  function wblInit() {
    var hasIO = 'IntersectionObserver' in window;
    var reducedMotion = window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* BROCHURE TONE — map màu cũ (hardcode trong content) sang palette mới.
       Muốn quay lại tone cũ: xóa các entry trong map này. */
    var TONE = {
      'rgb(255, 176, 32)': '#A6192E',  /* amber cũ  → đỏ brochure */
      '#FFB020':           '#A6192E',
      'rgb(46, 99, 238)':  '#1F5C99',  /* xanh tươi → steel blue  */
      '#2E63EE':           '#1F5C99',
      'rgb(15, 138, 95)':  '#C98A1B'   /* green     → gold đậm    */
    };
    function tone(c) { return TONE[(c || '').trim()] || c; }

    /* ---------- 1. Đếm số (data-count) ---------- */
    function animateCount(el) {
      var target = parseFloat(el.dataset.count || 0);
      var prefix = el.dataset.prefix || '';
      var suffix = el.dataset.suffix || '';
      if (reducedMotion) {
        el.textContent = prefix + target.toLocaleString() + suffix;
        return;
      }
      var dur = 1400, t0 = null;
      function step(t) {
        if (!t0) t0 = t;
        var p = Math.min((t - t0) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = prefix + Math.round(target * eased).toLocaleString() + suffix;
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }
    if (hasIO) {
      var counterIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          counterIO.unobserve(e.target);
          animateCount(e.target);
        });
      }, { threshold: 0.6 });
      document.querySelectorAll('[data-count]').forEach(function (el) { counterIO.observe(el); });
    } else {
      document.querySelectorAll('[data-count]').forEach(animateCount);
    }

    /* ---------- 2. Stat trio: vòng tròn + thanh bar ---------- */
    var trio = document.getElementById('statTrio') || document.querySelector('.stat-trio');
    if (trio) {
      /* Tự vẽ vòng tròn SVG (editor WordPress hay strip thẻ <svg>/<circle>).
         % và màu lấy từ .sc-bar (data-w + background). */
      trio.querySelectorAll('.sc').forEach(function (sc) {
        var bar = sc.querySelector('.sc-bar');
        var color = tone((bar && bar.style.background) || '#FFB020');
        var pct = bar ? parseFloat(bar.dataset.w || 100) : 100;
        /* Nếu trong cùng cột có element Icon (.sc-ico) thì vẽ ring quanh icon đó */
        var host = sc.parentElement && sc.parentElement.querySelector('.sc-ico');
        if (!host) {
          var col = sc.closest ? sc.closest('.vc_column-inner') : null;
          if (col) host = col.querySelector('.sc-ico');
        }
        var ring = (host || sc).querySelector('.sc-ring');
        if (!ring) {
          ring = document.createElement('div');
          ring.className = 'sc-ring';
          if (host) { host.appendChild(ring); }
          else { sc.insertBefore(ring, sc.firstChild); }
        }
        if (!ring.querySelector('svg')) {
          ring.innerHTML =
            '<svg viewBox="0 0 80 80">' +
            '<circle class="track" cx="40" cy="40" r="35"></circle>' +
            '<circle class="fill" cx="40" cy="40" r="35" stroke="' + color +
            '" data-dash="' + Math.round(220 * pct / 100) + '"></circle></svg>';
        }
      });
      var fillTrio = function (root) {
        root.querySelectorAll('.fill').forEach(function (c) {
          var dash = parseFloat(c.dataset.dash || 0);
          c.style.strokeDashoffset = (220 - dash).toString();
        });
        root.querySelectorAll('.sc-bar').forEach(function (b) {
          b.style.width = b.dataset.w;
        });
      };
      if (hasIO) {
        var trioIO = new IntersectionObserver(function (entries) {
          entries.forEach(function (e) {
            if (!e.isIntersecting) return;
            trioIO.unobserve(e.target);
            fillTrio(e.target);
          });
        }, { threshold: 0.35 });
        trioIO.observe(trio);
      } else { fillTrio(trio); }
    }

    /* ---------- 3. WBL Cycle: vẽ line gradient rồi sáng từng bước ---------- */
    var cyc = document.getElementById('wbl-cycle') || document.querySelector('.wbl-cycle-row');
    if (cyc) {
      /* chèn line track + gradient (div thật, tránh xung đột pseudo clearfix của vc_row) */
      if (!cyc.querySelector('.cycle-line-wp')) {
        var line = document.createElement('div');
        line.className = 'cycle-line-wp';
        line.innerHTML = '<i></i>';
        cyc.appendChild(line);
      }
      var litCycle = function (root) {
        root.classList.add('drawn');
        root.querySelectorAll('.cstep').forEach(function (s, i) {
          setTimeout(function () { s.classList.add('lit'); },
            reducedMotion ? 0 : 250 + i * 240);
        });
      };
      if (hasIO) {
        var cycIO = new IntersectionObserver(function (entries) {
          entries.forEach(function (e) {
            if (!e.isIntersecting) return;
            cycIO.unobserve(e.target);
            litCycle(e.target);
          });
        }, { threshold: 0.4 });
        cycIO.observe(cyc);
      } else { litCycle(cyc); }
    }

    /* ---------- 4. Bảng xếp hạng GTCI: thanh bar ---------- */
    var rank = document.getElementById('rank');
    if (rank) {
      var fillRank = function (root) {
        root.querySelectorAll('.rank-bar i').forEach(function (b) {
          b.style.transition = 'width 1.3s cubic-bezier(.4,0,.1,1)';
          b.style.width = b.dataset.w;
        });
      };
      if (hasIO) {
        var rankIO = new IntersectionObserver(function (entries) {
          entries.forEach(function (e) {
            if (!e.isIntersecting) return;
            rankIO.unobserve(e.target);
            fillRank(e.target);
          });
        }, { threshold: 0.4 });
        rankIO.observe(rank);
      } else { fillRank(rank); }
    }

    /* ---------- 5. Donut chi phí (conic gradient) ---------- */
    var donut = document.getElementById('donut');
    if (donut) {
      var fillDonut = function (el) {
        var target = parseFloat(el.dataset.p || 48);
        if (reducedMotion) {
          el.style.background = 'conic-gradient(#A6192E ' + target + '%, #1F5C99 0)';
          return;
        }
        var cur = 0;
        var iv = setInterval(function () {
          cur += 2;
          if (cur >= target) { cur = target; clearInterval(iv); }
          el.style.background = 'conic-gradient(#A6192E ' + cur + '%, #1F5C99 0)';
        }, 24);
      };
      if (hasIO) {
        var donutIO = new IntersectionObserver(function (entries) {
          entries.forEach(function (e) {
            if (!e.isIntersecting) return;
            donutIO.unobserve(e.target);
            fillDonut(e.target);
          });
        }, { threshold: 0.4 });
        donutIO.observe(donut);
      } else { fillDonut(donut); }
    }

    /* ---------- 6. Tab form Ứng viên / Doanh nghiệp ---------- */
    document.querySelectorAll('.form-tabs button').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var key = btn.dataset.form;
        btn.closest('.form-tabs').querySelectorAll('button').forEach(function (b) {
          b.classList.toggle('active', b === btn);
        });
        document.querySelectorAll('.wbl-form-panel').forEach(function (p) {
          p.style.display = (p.dataset.form === key) ? '' : 'none';
        });
        var aside = document.querySelector('.form-shell-wp .form-aside');
        if (aside) {
          aside.classList.toggle('youth-a', key === 'youth');
          aside.classList.toggle('ent-a', key === 'enterprise');
        }
      });
    });

    /* ---------- 7. Reveal on scroll (fade-up như bản design gốc) ---------- */
    if (hasIO && !reducedMotion) {
      var revealEls = document.querySelectorAll(
        '.panel, .field-card, .byc, .ebc, .cstep, .rank-row, .cost-card, ' +
        '.prob-item, .pcard-col .vc_column-inner, .swiss .pill, .stat-trio .vc_column-inner'
      );
      revealEls.forEach(function (el, i) {
        el.classList.add('reveal');
        /* stagger nhẹ theo vị trí trong nhóm */
        el.style.transitionDelay = ((i % 4) * 0.08) + 's';
      });
      var revIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          revIO.unobserve(e.target);
          e.target.classList.add('in');
        });
      }, { threshold: 0.15, rootMargin: '0px 0px -5% 0px' });
      revealEls.forEach(function (el) { revIO.observe(el); });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wblInit);
  } else {
    wblInit();
  }
})();