/**
 * deeplink-helper.js
 * Automatically optimizes LinkedIn & Twitter/X links for mobile app launching
 * and handles Instagram in-app browser constraints.
 */
(function() {
  // Use a self-executing init that doesn't strictly depend on DOMContentLoaded if DOM is already parsed
  function init() {
    // 1. Device and browser detection
    const ua = navigator.userAgent || navigator.vendor || window.opera;
    const isIOS = /iPhone|iPad|iPod/i.test(ua);
    const isAndroid = /Android/i.test(ua);
    const isInstagram = /Instagram/i.test(ua);

    // Target profiles
    const linkedinWebUrl = "https://www.linkedin.com/in/ansil-muhammed-n-s-882449377";
    const linkedinAppUrl = "linkedin://in/ansil-muhammed-n-s-882449377";
    const linkedinIntentUrl = "intent://www.linkedin.com/in/ansil-muhammed-n-s-882449377#Intent;scheme=https;package=com.linkedin.android;S.browser_fallback_url=https%3A%2F%2Fwww.linkedin.com%2Fin%2Fansil-muhammed-n-s-882449377;end";

    const twitterWebUrl = "https://twitter.com/ClashIt82009";
    const twitterAppUrl = "twitter://user?screen_name=ClashIt82009";
    const twitterIntentUrl = "intent://twitter.com/ClashIt82009#Intent;scheme=https;package=com.twitter.android;S.browser_fallback_url=https%3A%2F%2Ftwitter.com%2FClashIt82009;end";

    // 2. Android Intent replacement (applies to all Android browsers, including Instagram WebView)
    if (isAndroid) {
      const anchors = document.querySelectorAll("a");
      anchors.forEach(a => {
        const href = a.getAttribute("href") || "";
        if (href.includes("linkedin.com/in/ansil-muhammed-n-s-882449377")) {
          a.setAttribute("href", linkedinIntentUrl);
        } else if (href.includes("twitter.com/ClashIt82009")) {
          a.setAttribute("href", twitterIntentUrl);
        }
      });
      return; // Android is fully handled via browser intent standard
    }

    // 3. iOS Instagram WebView interceptor
    if (isIOS && isInstagram) {
      // Inject CSS styles for the helper modal
      injectModalStyles();

      // Set up click handler to intercept actions
      document.body.addEventListener("click", (e) => {
        const anchor = e.target.closest("a");
        if (!anchor) return;

        const href = anchor.getAttribute("href") || "";
        const isLinkedIn = href.includes("linkedin.com/in/ansil-muhammed-n-s-882449377");
        const isTwitter = href.includes("twitter.com/ClashIt82009");

        if (isLinkedIn || isTwitter) {
          e.preventDefault();
          const appName = isLinkedIn ? "LinkedIn" : "Twitter / X";
          const appUrl = isLinkedIn ? linkedinAppUrl : twitterAppUrl;
          const webUrl = isLinkedIn ? linkedinWebUrl : twitterWebUrl;
          showInstagramIOSModal(appName, appUrl, webUrl);
        }
      });
    }

    // ── MODAL INJECTION & LOGIC ──
    function injectModalStyles() {
      if (document.getElementById("dl-modal-styles")) return;
      const styles = document.createElement("style");
      styles.id = "dl-modal-styles";
      styles.textContent = `
        .dl-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(10, 11, 15, 0.85);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 999999;
          opacity: 0;
          transition: opacity 0.3s ease;
          padding: 20px;
          box-sizing: border-box;
        }
        .dl-backdrop.active {
          opacity: 1;
        }
        .dl-card {
          background: #121214;
          border: 3px solid #fff;
          box-shadow: 8px 8px 0px rgba(0, 0, 0, 1);
          color: #fff;
          width: 100%;
          max-width: 380px;
          padding: 24px;
          border-radius: 0px; /* Brutalist sharp corners */
          box-sizing: border-box;
          transform: translateY(20px) scale(0.95);
          transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.15);
          font-family: system-ui, -apple-system, sans-serif;
        }
        .dl-backdrop.active .dl-card {
          transform: translateY(0) scale(1);
        }
        .dl-badge {
          display: inline-block;
          background: #facc15;
          color: #000;
          padding: 3px 8px;
          font-family: monospace;
          font-size: 11px;
          font-weight: 900;
          margin-bottom: 14px;
          letter-spacing: 1px;
          text-transform: uppercase;
        }
        .dl-title {
          margin: 0 0 12px 0;
          font-size: 20px;
          font-weight: 900;
          line-height: 1.2;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .dl-desc {
          margin: 0 0 20px 0;
          font-size: 14px;
          line-height: 1.5;
          color: #ccc;
        }
        .dl-instruction {
          background: rgba(255, 255, 255, 0.05);
          border-left: 4px solid #facc15;
          padding: 10px 12px;
          margin-bottom: 20px;
          font-size: 13px;
          line-height: 1.4;
          color: #eee;
        }
        .dl-btn-stack {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 18px;
        }
        .dl-btn {
          display: block;
          text-align: center;
          padding: 12px;
          font-weight: 800;
          text-decoration: none;
          font-size: 14px;
          text-transform: uppercase;
          transition: all 0.15s ease;
          border: 2px solid transparent;
          cursor: pointer;
          box-sizing: border-box;
        }
        .dl-btn-primary {
          background: #2563eb;
          color: #fff;
          border-color: #2563eb;
        }
        .dl-btn-primary:active {
          background: #1d4ed8;
          transform: translateY(1px);
        }
        .dl-btn-secondary {
          background: transparent;
          color: #fff;
          border-color: #4b5563;
        }
        .dl-btn-secondary:active {
          background: rgba(255, 255, 255, 0.05);
          transform: translateY(1px);
        }
        .dl-btn-close {
          background: none;
          border: none;
          color: #9ca3af;
          text-decoration: underline;
          font-size: 12px;
          cursor: pointer;
          display: block;
          margin: 0 auto;
          text-transform: uppercase;
          font-weight: 700;
          letter-spacing: 0.5px;
        }
        .dl-btn-close:hover {
          color: #fff;
        }
      `;
      document.head.appendChild(styles);
    }

    function showInstagramIOSModal(appName, appUrl, webUrl) {
      // Remove any existing modal
      const existing = document.getElementById("dl-modal-overlay");
      if (existing) existing.remove();

      // Create backdrop
      const backdrop = document.createElement("div");
      backdrop.id = "dl-modal-overlay";
      backdrop.className = "dl-backdrop";

      // Create card
      backdrop.innerHTML = `
        <div class="dl-card">
          <div class="dl-badge">App Integration</div>
          <h3 class="dl-title">Open ${appName}</h3>
          <p class="dl-desc">
            You are browsing inside the Instagram webview, which blocks direct app launching.
          </p>
          <div class="dl-instruction">
            For the best native experience, tap <strong>"..." (top-right)</strong> and select <strong>"Open in Safari"</strong>.
          </div>
          <div class="dl-btn-stack">
            <a href="${appUrl}" class="dl-btn dl-btn-primary" id="dl-btn-launch">Try Native App</a>
            <a href="${webUrl}" target="_blank" class="dl-btn dl-btn-secondary" id="dl-btn-web">Continue in Web</a>
          </div>
          <button class="dl-btn-close" id="dl-btn-close">Close</button>
        </div>
      `;

      document.body.appendChild(backdrop);

      // Force layout calculation and trigger fade-in transition
      requestAnimationFrame(() => {
        backdrop.classList.add("active");
      });

      // Event handlers
      const closeModal = () => {
        backdrop.classList.remove("active");
        setTimeout(() => backdrop.remove(), 300);
      };

      backdrop.addEventListener("click", (e) => {
        if (e.target === backdrop) closeModal();
      });

      document.getElementById("dl-btn-close").addEventListener("click", closeModal);
      document.getElementById("dl-btn-launch").addEventListener("click", () => {
        // App launch clicked, let the browser attempt custom scheme, then close modal
        setTimeout(closeModal, 800);
      });
      document.getElementById("dl-btn-web").addEventListener("click", closeModal);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
