// Icon of each organization (alliance), shown before its name in the Organization field.
// Inline SVG drawn with currentColor, so it takes the gold of the key value. Organizations without an entry show no icon.
// To add one, add a key with the same name as in data/alliances.csv.

var ORGANIZATION_ICONS = {
  // Flag on a pole
  "Revolutionary Army": '<path d="M5 21V3" /><path d="M5 4h12l-3 4 3 4H5" fill="currentColor" />',
  // House with a door
  "Revolutionary Country": '<path d="M3 11 12 4l9 7" /><path d="M5 10v10h14V10" /><path d="M10 20v-5h4v5" />',
  // Anchor
  "Marine": '<circle cx="12" cy="5" r="2" /><path d="M12 7v13" /><path d="M7 11h10" /><path d="M5 15a7 7 0 0 0 14 0" />',
  // Skull with two crossed bones behind it (the skull is filled with the card colour so the bones stay behind it)
  "Pirate": '<path d="M4 4l16 16M20 4 4 20" /><circle cx="4" cy="4" r="1.6" fill="currentColor" /><circle cx="20" cy="4" r="1.6" fill="currentColor" /><circle cx="4" cy="20" r="1.6" fill="currentColor" /><circle cx="20" cy="20" r="1.6" fill="currentColor" /><path style="fill: var(--ink)" d="M12 3a7 7 0 0 0-7 7c0 2.4 1.2 4.2 3 5.3V18h8v-2.7c1.8-1.1 3-2.9 3-5.3a7 7 0 0 0-7-7z" /><circle cx="9.2" cy="10.5" r="1.6" fill="currentColor" /><circle cx="14.8" cy="10.5" r="1.6" fill="currentColor" /><path d="M12 13l-1 1.5h2z" fill="currentColor" /><path d="M10 18v-2M14 18v-2" />',
  // Target
  "Bounty Hunter": '<circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3" />',
  // Eye
  "Cipher Pol": '<path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z" /><circle cx="12" cy="12" r="3" />',
  // Crown
  "World Nobles": '<path d="M3 8l4.5 4L12 5l4.5 7L21 8l-2 11H5z" />',
  // Balance scale
  "Government": '<path d="M12 4v16M7 20h10" /><path d="M4 8h16" /><path d="M4 8l-2.5 6h5zM20 8l-2.5 6h5z" />'
};

// Icon (SVG markup) followed by the name, for the Organization field. Plain name when there is no icon.
function organizationHtml(name) {
  var icon = ORGANIZATION_ICONS[name];
  if (!icon) return name;
  return '<svg class="org-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + icon + '</svg>' + name;
}
