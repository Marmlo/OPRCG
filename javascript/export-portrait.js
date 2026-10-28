// Character image for the Wanted Poster ------------------------------------------------------------------------------------------------------------------------------------
// The user's picture is decoded once, downscaled to a working canvas and kept only in memory for this session.
// Nothing is uploaded, stored in localStorage/cookies or put in a URL. The object URL is revoked right after decoding.

var PORTRAIT_TYPES = ["image/png", "image/jpeg", "image/webp"];
var PORTRAIT_EXTS = ["png", "jpg", "jpeg", "webp"];
var PORTRAIT_MAX_BYTES = 10 * 1024 * 1024;
var PORTRAIT_MAX_SIDE = 1800;          // working resolution: enough for the 2x export at maximum zoom
var PORTRAIT_MAX_ZOOM = 4;
var PORTRAIT_TINT = "rgba(120, 76, 28, 0.12)";   // ages the photo to match the parchment

// { canvas, w, h, zoom, x, y }: x / y = offset of the picture's centre from the frame's centre (poster px)
var posterPortrait = null;

function clampValue(v, min, max) { return Math.min(Math.max(v, min), max); }

// Cover-fit at zoom 1, then scale and clamp the offset so the picture always covers the frame
function portraitLayout(p, size) {
  var s = Math.max(size / p.w, size / p.h) * p.zoom;
  var dw = p.w * s, dh = p.h * s;
  p.x = clampValue(p.x, -(dw - size) / 2, (dw - size) / 2);
  p.y = clampValue(p.y, -(dh - size) / 2, (dh - size) / 2);
  return { dw: dw, dh: dh, left: size / 2 + p.x - dw / 2, top: size / 2 + p.y - dh / 2 };
}

// Called by the poster instead of the skull; (x, y, size) is the square portrait area
function drawPosterPortrait(ctx, x, y, size) {
  var p = posterPortrait, L = portraitLayout(p, size);
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, size, size);
  ctx.clip();
  ctx.fillStyle = "#e6d19c";
  ctx.fillRect(x, y, size, size);
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(p.canvas, x + L.left, y + L.top, L.dw, L.dh);
  ctx.fillStyle = PORTRAIT_TINT;
  ctx.fillRect(x, y, size, size);
  ctx.restore();
}

// Validation and decoding ---------------------------------------------------------------------------------------------------------------------------------------------

function portraitError(file) {
  var ext = (file.name.split(".").pop() || "").toLowerCase();
  if (PORTRAIT_TYPES.indexOf(file.type) === -1 && PORTRAIT_EXTS.indexOf(ext) === -1) return "Unsupported file. Use a PNG, JPG, JPEG or WebP image.";
  if (file.size > PORTRAIT_MAX_BYTES) return "The image is larger than 10 MB. Choose a smaller file.";
  if (!file.size) return "The file is empty. Choose another image.";
  return "";
}

// Decodes the file once and draws it onto a working canvas (no upscaling; the browser applies EXIF orientation)
function decodePortrait(file) {
  var url = URL.createObjectURL(file), img = new Image();
  img.src = url;
  return img.decode().then(function () {
    var w = img.naturalWidth, h = img.naturalHeight;
    if (!w || !h) throw new Error("No image data");
    var k = Math.min(1, PORTRAIT_MAX_SIDE / Math.max(w, h));
    var canvas = newCanvas(Math.max(1, Math.round(w * k)), Math.max(1, Math.round(h * k)));
    canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas;
  }).finally(function () {
    URL.revokeObjectURL(url);
    img.src = "";
  });
}

function releasePortrait() {
  if (!posterPortrait) return;
  posterPortrait.canvas.width = 0;   // frees the bitmap memory
  posterPortrait.canvas.height = 0;
  posterPortrait = null;
}

// Upload / remove / adjust (the modal controls) -----------------------------------------------------------------------------------------------------------------------

function uploadPortrait(input) {
  var file = input.files && input.files[0];
  input.value = "";   // lets the same file be chosen again
  if (!file || exportBusy) return;
  var error = portraitError(file);
  if (error) { exportStatus(error, true); return; }
  exportSetBusy(true, "Processing image…");
  decodePortrait(file).then(function (canvas) {
    releasePortrait();
    posterPortrait = { canvas: canvas, w: canvas.width, h: canvas.height, zoom: 1, x: 0, y: 0 };
    exportSetBusy(false);
    exportStatus("Image added. Drag it inside the portrait to position it.");
    updatePortraitControls();
    renderExportPreview();
  }).catch(function () {
    exportSetBusy(false);
    exportStatus("This image could not be read. Try a PNG, JPG or WebP file.", true);
  });
}

function removePortrait() {
  releasePortrait();
  updatePortraitControls();
  renderExportPreview();
  exportStatus("Character image removed.");
}

function zoomPortrait(value) {
  if (!posterPortrait) return;
  posterPortrait.zoom = clampValue(Number(value), 1, PORTRAIT_MAX_ZOOM);
  schedulePortraitRender();
}

function centerPortrait() {
  if (!posterPortrait) return;
  posterPortrait.x = 0;
  posterPortrait.y = 0;
  schedulePortraitRender();
}

function resetPortrait() {
  if (!posterPortrait) return;
  posterPortrait.zoom = 1;
  posterPortrait.x = 0;
  posterPortrait.y = 0;
  updatePortraitControls();
  schedulePortraitRender();
}

// Drags and wheel events can fire many times per frame: redraw at most once per animation frame
var portraitFrame = 0;
function schedulePortraitRender() {
  if (portraitFrame) return;
  portraitFrame = requestAnimationFrame(function () {
    portraitFrame = 0;
    updatePortraitControls();
    renderExportPreview();
  });
}

function updatePortraitControls() {
  var has = !!posterPortrait;
  document.getElementById("portrait-controls").hidden = !has;
  document.getElementById("export-preview").classList.toggle("has-portrait", has);
  document.getElementById("portrait-upload").textContent = has ? "Replace Character Image" : "Upload Character Image";
  if (has) document.getElementById("portrait-zoom").value = posterPortrait.zoom;
}

// Pointer position on the poster, in poster px (the preview is scaled by CSS)
function posterPoint(canvas, e) {
  var rect = canvas.getBoundingClientRect();
  return { x: (e.clientX - rect.left) * POSTER_W / rect.width, y: (e.clientY - rect.top) * POSTER_W / rect.width };
}

function inPortrait(pt) {
  var P = POSTER_PORTRAIT;
  return pt.x >= P.x && pt.x <= P.x + P.size && pt.y >= P.y && pt.y <= P.y + P.size;
}

// Mouse, touch and pen: drag to move, wheel to zoom (only over the portrait)
function initPortraitInteraction() {
  var canvas = document.getElementById("export-preview"), drag = null;

  canvas.addEventListener("pointerdown", function (e) {
    if (!posterPortrait || !canvas.getBoundingClientRect().width) return;
    var pt = posterPoint(canvas, e);
    if (!inPortrait(pt)) return;
    drag = { x: e.clientX, y: e.clientY };
    canvas.setPointerCapture(e.pointerId);
    canvas.classList.add("dragging");
    e.preventDefault();
  });
  canvas.addEventListener("pointermove", function (e) {
    if (!drag) return;
    var k = POSTER_W / canvas.getBoundingClientRect().width;
    posterPortrait.x += (e.clientX - drag.x) * k;
    posterPortrait.y += (e.clientY - drag.y) * k;
    drag = { x: e.clientX, y: e.clientY };
    schedulePortraitRender();
  });
  function endDrag() {
    drag = null;
    canvas.classList.remove("dragging");
  }
  canvas.addEventListener("pointerup", endDrag);
  canvas.addEventListener("pointercancel", endDrag);

  canvas.addEventListener("wheel", function (e) {
    if (!posterPortrait || !inPortrait(posterPoint(canvas, e))) return;
    e.preventDefault();
    zoomPortrait(clampValue(posterPortrait.zoom * (e.deltaY < 0 ? 1.08 : 1 / 1.08), 1, PORTRAIT_MAX_ZOOM));
    document.getElementById("portrait-zoom").value = posterPortrait.zoom;
  }, { passive: false });
}

document.addEventListener("DOMContentLoaded", initPortraitInteraction);
window.addEventListener("pagehide", releasePortrait);
