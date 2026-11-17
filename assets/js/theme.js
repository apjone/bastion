/* Bastion theme — colour scheme switch, mobile nav, code copy, reading progress */
(function () {
    'use strict';

    var KEY = 'bastion-theme';
    var CHOICES = ['light', 'system', 'dark'];
    var root = document.documentElement;
    var mq = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

    /* ---------- Colour scheme ---------- */

    function currentPref() {
        var p = root.getAttribute('data-theme-pref');
        return CHOICES.indexOf(p) > -1 ? p : 'system';
    }

    function resolve(pref) {
        if (pref === 'system') return mq && mq.matches ? 'dark' : 'light';
        return pref;
    }

    var LABELS = { light: 'Light', dark: 'Dark', system: 'System' };

    function syncControls(pref) {
        var items = document.querySelectorAll('[data-theme-value]');
        for (var i = 0; i < items.length; i++) {
            items[i].setAttribute('aria-checked', items[i].getAttribute('data-theme-value') === pref ? 'true' : 'false');
        }
        var btn = document.querySelector('.theme-menu-btn');
        if (btn) {
            var label = 'Colour scheme: ' + LABELS[pref];
            btn.setAttribute('aria-label', label);
            btn.setAttribute('title', label);
        }
    }

    function syncThemeColor() {
        var meta = document.querySelector('meta[name="theme-color"]');
        if (meta) meta.setAttribute('content', getComputedStyle(root).getPropertyValue('--bg').trim() || '#f6f7f9');
    }

    function apply(pref, persist) {
        root.setAttribute('data-theme-pref', pref);
        root.setAttribute('data-theme', resolve(pref));
        if (persist) {
            try { localStorage.setItem(KEY, pref); } catch (e) { /* storage blocked */ }
        }
        syncControls(pref);
        syncThemeColor();
    }

    // Follow OS changes while on "system"
    if (mq) {
        var onSystemChange = function () { if (currentPref() === 'system') apply('system', false); };
        if (mq.addEventListener) mq.addEventListener('change', onSystemChange);
        else if (mq.addListener) mq.addListener(onSystemChange);
    }

    // Keep multiple open tabs in sync
    window.addEventListener('storage', function (e) {
        if (e.key === KEY && CHOICES.indexOf(e.newValue) > -1) apply(e.newValue, false);
    });

    apply(currentPref(), false);

    /* ---------- Colour scheme dropdown ---------- */

    var menuWrap = document.querySelector('[data-theme-menu]');
    if (menuWrap) {
        var menuBtn = menuWrap.querySelector('.theme-menu-btn');
        var menuList = menuWrap.querySelector('.theme-menu-list');
        var items = Array.prototype.slice.call(menuList.querySelectorAll('[data-theme-value]'));

        var isOpen = function () { return !menuList.hidden; };

        var focusItem = function (i) {
            items[(i + items.length) % items.length].focus();
        };

        var openMenu = function (focusIndex) {
            menuList.hidden = false;
            menuBtn.setAttribute('aria-expanded', 'true');
            if (typeof focusIndex !== 'number') {
                focusIndex = 0;
                for (var i = 0; i < items.length; i++) {
                    if (items[i].getAttribute('aria-checked') === 'true') focusIndex = i;
                }
            }
            focusItem(focusIndex);
        };

        var closeMenu = function (returnFocus) {
            if (!isOpen()) return;
            menuList.hidden = true;
            menuBtn.setAttribute('aria-expanded', 'false');
            if (returnFocus) menuBtn.focus();
        };

        menuBtn.addEventListener('click', function () {
            if (isOpen()) closeMenu(false); else openMenu();
        });

        menuBtn.addEventListener('keydown', function (e) {
            if (e.key === 'ArrowDown') { e.preventDefault(); openMenu(0); }
            else if (e.key === 'ArrowUp') { e.preventDefault(); openMenu(items.length - 1); }
        });

        items.forEach(function (item) {
            item.addEventListener('click', function () {
                apply(item.getAttribute('data-theme-value'), true);
                closeMenu(true);
            });
        });

        menuList.addEventListener('keydown', function (e) {
            var i = items.indexOf(document.activeElement);
            switch (e.key) {
                case 'ArrowDown': e.preventDefault(); focusItem(i + 1); break;
                case 'ArrowUp': e.preventDefault(); focusItem(i - 1); break;
                case 'Home': e.preventDefault(); focusItem(0); break;
                case 'End': e.preventDefault(); focusItem(items.length - 1); break;
                case 'Escape': e.preventDefault(); closeMenu(true); break;
                case 'Tab': closeMenu(false); break;
            }
        });

        document.addEventListener('click', function (e) {
            if (isOpen() && !menuWrap.contains(e.target)) closeMenu(false);
        });
    }

    /* ---------- Mobile navigation ---------- */

    var toggle = document.querySelector('.menu-toggle');
    var nav = document.getElementById('site-nav');
    if (toggle && nav) {
        var setOpen = function (open) {
            nav.classList.toggle('is-open', open);
            toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        };
        toggle.addEventListener('click', function () {
            setOpen(!nav.classList.contains('is-open'));
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && nav.classList.contains('is-open')) {
                setOpen(false);
                toggle.focus();
            }
        });
        document.addEventListener('click', function (e) {
            if (nav.classList.contains('is-open') && !nav.contains(e.target) && !toggle.contains(e.target)) setOpen(false);
        });
    }

    /* ---------- Code blocks: language label + copy button ---------- */

    function copyText(text) {
        if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
        return new Promise(function (resolveCopy, reject) {
            var ta = document.createElement('textarea');
            ta.value = text;
            ta.setAttribute('readonly', '');
            ta.style.position = 'fixed';
            ta.style.opacity = '0';
            document.body.appendChild(ta);
            ta.select();
            try { document.execCommand('copy') ? resolveCopy() : reject(); } catch (err) { reject(err); }
            document.body.removeChild(ta);
        });
    }

    var blocks = document.querySelectorAll('.gh-content pre');
    Array.prototype.forEach.call(blocks, function (pre) {
        if (pre.parentNode.classList.contains('code-wrap')) return;

        var code = pre.querySelector('code');
        var wrap = document.createElement('div');
        wrap.className = 'code-wrap';
        pre.parentNode.insertBefore(wrap, pre);
        wrap.appendChild(pre);

        var bar = document.createElement('div');
        bar.className = 'code-toolbar';

        var match = code && /language-([\w+#-]+)/.exec(code.className);
        if (match) {
            var lang = document.createElement('span');
            lang.className = 'code-lang';
            lang.textContent = match[1];
            bar.appendChild(lang);
        }

        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'copy-btn';
        btn.textContent = 'copy';
        btn.setAttribute('aria-label', 'Copy code to clipboard');
        btn.addEventListener('click', function () {
            copyText((code || pre).innerText).then(function () {
                btn.textContent = 'copied';
                btn.classList.add('is-copied');
                setTimeout(function () {
                    btn.textContent = 'copy';
                    btn.classList.remove('is-copied');
                }, 1800);
            }, function () {
                btn.textContent = 'failed';
            });
        });
        bar.appendChild(btn);
        wrap.appendChild(bar);
    });

    /* ---------- Reading progress ---------- */

    var progress = document.querySelector('.reading-progress');
    if (progress) {
        var ticking = false;
        var update = function () {
            var max = document.documentElement.scrollHeight - window.innerHeight;
            var ratio = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
            progress.style.transform = 'scaleX(' + ratio + ')';
            ticking = false;
        };
        window.addEventListener('scroll', function () {
            if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
        }, { passive: true });
        window.addEventListener('resize', update);
        update();
    }
})();
