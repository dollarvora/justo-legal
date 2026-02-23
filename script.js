/* ===== TOC GENERATION ===== */
(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {
        buildTOC();
        initBackToTop();
        initLangSwitcher();
        initMobileTOC();
        initScrollSpy();
    });

    /* --- Build TOC from h2/h3 headings --- */
    function buildTOC() {
        var tocContainer = document.querySelector('.toc-sidebar ul');
        var content = document.querySelector('.main-content');
        if (!tocContainer || !content) return;

        var headings = content.querySelectorAll('h2, h3');
        if (headings.length === 0) return;

        headings.forEach(function (heading) {
            // Ensure each heading has an id
            if (!heading.id) {
                heading.id = heading.textContent
                    .trim()
                    .toLowerCase()
                    .replace(/[^\w\s-]/g, '')
                    .replace(/\s+/g, '-');
            }

            var li = document.createElement('li');
            var a = document.createElement('a');
            a.href = '#' + heading.id;
            a.textContent = heading.textContent;

            if (heading.tagName === 'H3') {
                a.classList.add('toc-h3');
            }

            a.addEventListener('click', function (e) {
                e.preventDefault();
                var target = document.getElementById(heading.id);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    history.replaceState(null, '', '#' + heading.id);
                }
            });

            li.appendChild(a);
            tocContainer.appendChild(li);
        });
    }

    /* --- Scroll Spy: highlight active TOC link --- */
    function initScrollSpy() {
        var tocLinks = document.querySelectorAll('.toc-sidebar a');
        if (tocLinks.length === 0) return;

        var headings = [];
        tocLinks.forEach(function (link) {
            var id = link.getAttribute('href');
            if (id && id.startsWith('#')) {
                var el = document.getElementById(id.substring(1));
                if (el) headings.push({ el: el, link: link });
            }
        });

        function updateActive() {
            var scrollPos = window.scrollY + 100;
            var current = null;

            for (var i = 0; i < headings.length; i++) {
                if (headings[i].el.offsetTop <= scrollPos) {
                    current = headings[i];
                }
            }

            tocLinks.forEach(function (link) {
                link.classList.remove('active');
            });

            if (current) {
                current.link.classList.add('active');
            }
        }

        window.addEventListener('scroll', updateActive, { passive: true });
        updateActive();
    }

    /* --- Back to Top Button --- */
    function initBackToTop() {
        var btn = document.querySelector('.back-to-top');
        if (!btn) return;

        window.addEventListener('scroll', function () {
            if (window.scrollY > 300) {
                btn.classList.add('visible');
            } else {
                btn.classList.remove('visible');
            }
        }, { passive: true });

        btn.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* --- Language Switcher Dropdown --- */
    function initLangSwitcher() {
        var switcher = document.querySelector('.lang-switcher');
        var btn = document.querySelector('.lang-btn');
        if (!switcher || !btn) return;

        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            switcher.classList.toggle('open');
        });

        document.addEventListener('click', function () {
            switcher.classList.remove('open');
        });

        // Prevent dropdown clicks from closing
        var dropdown = switcher.querySelector('.lang-dropdown');
        if (dropdown) {
            dropdown.addEventListener('click', function (e) {
                e.stopPropagation();
            });
        }
    }

    /* --- Mobile TOC Hamburger Toggle --- */
    function initMobileTOC() {
        var toggle = document.querySelector('.toc-mobile-toggle');
        var sidebar = document.querySelector('.toc-sidebar');
        if (!toggle || !sidebar) return;

        toggle.addEventListener('click', function () {
            sidebar.classList.toggle('open');
            if (sidebar.classList.contains('open')) {
                toggle.textContent = '\u2715  Close Table of Contents';
            } else {
                toggle.textContent = '\u2630  Table of Contents';
            }
        });

        // Close mobile TOC when a link is clicked
        sidebar.addEventListener('click', function (e) {
            if (e.target.tagName === 'A') {
                sidebar.classList.remove('open');
                toggle.textContent = '\u2630  Table of Contents';
            }
        });
    }
})();
