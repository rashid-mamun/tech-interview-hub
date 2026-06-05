(function () {
    var LEFT_KEY = 'docs:leftHidden';
    var RIGHT_KEY = 'docs:rightHidden';
    var CONTROLS_ID = 'docs-layout-toggles-runtime';

    var icons = {
        sidebar: '<svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M4 6h16M4 12h16M4 18h10"/></svg>',
        toc: '<svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M8 6h12M8 12h12M8 18h12"/><path d="M4 6h.01M4 12h.01M4 18h.01"/></svg>',
        showLeft: '<svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/><path d="M4 6v12"/></svg>',
        showRight: '<svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/><path d="M20 6v12"/></svg>',
    };

    function isDocsPage() {
        return window.location.pathname.indexOf('/docs') === 0;
    }

    function isDesktop() {
        return window.matchMedia('(min-width: 997px)').matches;
    }

    function getState() {
        return {
            leftHidden: window.localStorage.getItem(LEFT_KEY) === '1',
            rightHidden: window.localStorage.getItem(RIGHT_KEY) === '1',
        };
    }

    function setState(leftHidden, rightHidden) {
        window.localStorage.setItem(LEFT_KEY, leftHidden ? '1' : '0');
        window.localStorage.setItem(RIGHT_KEY, rightHidden ? '1' : '0');
    }

    function applyBodyClasses(leftHidden, rightHidden) {
        document.body.classList.toggle('docs-left-hidden', leftHidden);
        document.body.classList.toggle('docs-right-hidden', rightHidden);
    }

    function updateButtons(container, state) {
        var leftBtn = container.querySelector('[data-role="toggle-left"]');
        var rightBtn = container.querySelector('[data-role="toggle-right"]');

        if (leftBtn) {
            leftBtn.setAttribute('aria-pressed', state.leftHidden ? 'true' : 'false');
            leftBtn.title = state.leftHidden ? 'Show Left Sidebar' : 'Hide Left Sidebar';
            leftBtn.innerHTML = state.leftHidden ? icons.showLeft : icons.sidebar;
        }

        if (rightBtn) {
            rightBtn.setAttribute('aria-pressed', state.rightHidden ? 'true' : 'false');
            rightBtn.title = state.rightHidden ? 'Show Table of Contents' : 'Hide Table of Contents';
            rightBtn.innerHTML = state.rightHidden ? icons.showRight : icons.toc;
        }
    }

    function removeControls() {
        var existing = document.getElementById(CONTROLS_ID);
        if (existing) {
            existing.remove();
        }
    }

    function ensureControls() {
        var controls = document.getElementById(CONTROLS_ID);
        if (controls) {
            return controls;
        }

        controls = document.createElement('div');
        controls.id = CONTROLS_ID;
        controls.className = 'docs-layout-toggles';
        controls.setAttribute('role', 'group');
        controls.setAttribute('aria-label', 'Documentation layout toggles');

        var leftBtn = document.createElement('button');
        leftBtn.type = 'button';
        leftBtn.className = 'docs-layout-toggle-btn';
        leftBtn.setAttribute('data-role', 'toggle-left');

        var rightBtn = document.createElement('button');
        rightBtn.type = 'button';
        rightBtn.className = 'docs-layout-toggle-btn';
        rightBtn.setAttribute('data-role', 'toggle-right');

        controls.appendChild(leftBtn);
        controls.appendChild(rightBtn);

        controls.addEventListener('click', function (event) {
            var target = event.target.closest('button');
            if (!target) {
                return;
            }

            var state = getState();

            if (target.getAttribute('data-role') === 'toggle-left') {
                state.leftHidden = !state.leftHidden;
            }
            if (target.getAttribute('data-role') === 'toggle-right') {
                state.rightHidden = !state.rightHidden;
            }

            setState(state.leftHidden, state.rightHidden);
            applyBodyClasses(state.leftHidden, state.rightHidden);
            updateButtons(controls, state);
        });

        document.body.appendChild(controls);
        return controls;
    }

    function syncLayout() {
        var desktop = isDesktop();
        var docs = isDocsPage();

        if (!desktop || !docs) {
            removeControls();
            applyBodyClasses(false, false);
            return;
        }

        var state = getState();
        var controls = ensureControls();
        applyBodyClasses(state.leftHidden, state.rightHidden);
        updateButtons(controls, state);
    }

    var rafId = 0;
    function scheduleSync() {
        if (rafId) {
            window.cancelAnimationFrame(rafId);
        }
        rafId = window.requestAnimationFrame(function () {
            rafId = 0;
            syncLayout();
        });
    }

    var originalPushState = history.pushState;
    history.pushState = function () {
        originalPushState.apply(history, arguments);
        scheduleSync();
    };

    var originalReplaceState = history.replaceState;
    history.replaceState = function () {
        originalReplaceState.apply(history, arguments);
        scheduleSync();
    };

    window.addEventListener('popstate', scheduleSync);
    window.addEventListener('resize', scheduleSync);
    document.addEventListener('DOMContentLoaded', scheduleSync);
    scheduleSync();
})();
