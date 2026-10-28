// Site-wide behaviour: the menu on phones and the preferences kept on this device (localStorage, no account). Loaded on every page.

var SITE_PREFS_KEY = "ocg-preferences";
var SITE_PREF_DEFAULTS = { reduceMotion: false, timelineView: "all", statistic: "doriki" };

// Saved preferences on top of the defaults; a damaged saved value falls back to the default
function sitePrefs() {
  var saved = {};
  try { saved = JSON.parse(localStorage.getItem(SITE_PREFS_KEY)) || {}; } catch (e) { saved = {}; }
  return Object.assign({}, SITE_PREF_DEFAULTS, saved);
}

function saveSitePrefs(prefs) {
  try { localStorage.setItem(SITE_PREFS_KEY, JSON.stringify(prefs)); } catch (e) { /* private mode: lasts for this visit only */ }
}

// Runs in the head, before the page is drawn, so the motion setting applies from the first frame
function applySitePrefs() {
  document.documentElement.classList.toggle("reduce-motion", !!sitePrefs().reduceMotion);
}
applySitePrefs();

// Settings page -------------------------------------------------------------------------------------------------------------------------------------------------------------

function bindSettingsPage() {
  var form = document.getElementById("settings-form");
  if (!form) return;
  var motion = document.getElementById("set-motion"), view = document.getElementById("set-view"), metric = document.getElementById("set-metric");
  var status = document.getElementById("settings-status");
  var prefs = sitePrefs();
  motion.checked = prefs.reduceMotion;
  view.value = prefs.timelineView;
  metric.value = prefs.statistic;

  form.addEventListener("change", function () {
    saveSitePrefs({ reduceMotion: motion.checked, timelineView: view.value, statistic: metric.value });
    applySitePrefs();
    status.textContent = "Saved on this device.";
  });
  document.getElementById("set-reset").addEventListener("click", function () {
    saveSitePrefs(Object.assign({}, SITE_PREF_DEFAULTS));
    window.location.reload();
  });
}

// Header --------------------------------------------------------------------------------------------------------------------------------------------------------------------

document.addEventListener("DOMContentLoaded", function () {
  var toggle = document.querySelector(".nav-toggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") !== "true";
      toggle.setAttribute("aria-expanded", String(open));
      document.getElementById("site-nav").classList.toggle("open", open);
    });
  }
  bindSettingsPage();
});
