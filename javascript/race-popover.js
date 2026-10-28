// Race details popover ----------------------------------------------------------------------------------------------------------------------------------------------------
// Only hybrids have one: the "i" next to the race name. Click or tap opens it and a second click closes it.
// With a mouse it also opens on hover, until it is clicked. Outside click, Escape or a new race closes it.
// It is position: fixed because the character card has overflow: hidden, which would clip it.

var racePopover = { anchor: null, pinned: false };   // anchor = the "i" button that opened it

function racePopoverEl() { return document.getElementById("race-popover"); }

// Type, components and description of the current hybrid (text only, no HTML)
function fillRacePopover() {
  var pop = racePopoverEl();
  pop.textContent = "";
  var title = document.createElement("p");
  title.className = "race-popover-title";
  title.textContent = race.name;
  var list = document.createElement("dl");
  [["Type", race.type], ["Components", componentsText()]].forEach(function (row) {
    var dt = document.createElement("dt"), dd = document.createElement("dd");
    dt.textContent = row[0];
    dd.textContent = row[1];
    list.appendChild(dt);
    list.appendChild(dd);
  });
  var text = document.createElement("p");
  text.textContent = race.description;
  pop.appendChild(title);
  pop.appendChild(list);
  pop.appendChild(text);
}

function openRacePopover(btn, pinned) {
  var pop = racePopoverEl();
  if (racePopover.anchor && racePopover.anchor !== btn) racePopover.anchor.setAttribute("aria-expanded", "false");
  racePopover.anchor = btn;
  racePopover.pinned = pinned;
  fillRacePopover();
  pop.hidden = false;
  btn.setAttribute("aria-expanded", "true");
  positionRacePopover();
}

// returnFocus = true after Escape, so keyboard users land back on the "i"
function closeRacePopover(returnFocus) {
  var anchor = racePopover.anchor;
  if (!anchor) return;
  racePopover.anchor = null;
  racePopover.pinned = false;
  racePopoverEl().hidden = true;
  if (!anchor.isConnected) return;
  anchor.setAttribute("aria-expanded", "false");
  if (returnFocus) anchor.focus();
}

// Next to the "i", below it when there is room, otherwise above; always kept inside the screen
function positionRacePopover() {
  var anchor = racePopover.anchor;
  if (!anchor) return;
  if (!anchor.isConnected) return closeRacePopover();
  var pop = racePopoverEl(), r = anchor.getBoundingClientRect();
  var gap = 8, edge = 12, vw = window.innerWidth, vh = window.innerHeight;
  var w = Math.min(300, vw - 2 * edge);
  pop.style.width = w + "px";
  var h = pop.offsetHeight;
  var top = r.bottom + gap;
  if (top + h > vh - edge && r.top - gap - h >= edge) top = r.top - gap - h;
  top = Math.max(edge, Math.min(top, vh - h - edge));
  var left = Math.max(edge, Math.min(r.left, vw - w - edge));
  pop.style.top = top + "px";
  pop.style.left = left + "px";
}

function raceInfoButton(target) {
  return target && target.closest ? target.closest(".race-info") : null;
}

// Click or tap: open pinned, or close when the same pinned "i" is clicked again
document.addEventListener("click", function (e) {
  var btn = raceInfoButton(e.target);
  if (btn) {
    if (racePopover.anchor === btn && racePopover.pinned) closeRacePopover();
    else openRacePopover(btn, true);
    return;
  }
  if (!(e.target.closest && e.target.closest("#race-popover"))) closeRacePopover();
});

// Mouse only (touch has no hover): open while the pointer is on the "i", close when it leaves unless pinned
document.addEventListener("pointerover", function (e) {
  var btn = e.pointerType === "mouse" ? raceInfoButton(e.target) : null;
  if (btn && racePopover.anchor !== btn) openRacePopover(btn, false);
});

document.addEventListener("pointerout", function (e) {
  if (e.pointerType !== "mouse" || !racePopover.anchor || racePopover.pinned) return;
  var to = e.relatedTarget;
  if (to && (racePopover.anchor.contains(to) || racePopoverEl().contains(to))) return;
  closeRacePopover();
});

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && racePopover.anchor) closeRacePopover(true);
});

window.addEventListener("resize", positionRacePopover);
window.addEventListener("scroll", positionRacePopover, { passive: true });
