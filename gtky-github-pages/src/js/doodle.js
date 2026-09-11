export function bindDoodle(root) {
  const stage = root.querySelector(".doodle-layer");
  if (!stage) return;
  const canvas = stage.querySelector("canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const resize = () => {
    const box = stage.getBoundingClientRect();
    const ratio = window.devicePixelRatio || 1;
    canvas.width = Math.max(1, Math.floor(box.width * ratio));
    canvas.height = Math.max(1, Math.floor(box.height * ratio));
    canvas.style.width = `${box.width}px`;
    canvas.style.height = `${box.height}px`;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.strokeStyle = "#3d2418";
    ctx.lineWidth = 2.2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  };
  resize();
  let drawing = false;
  const pos = (event) => {
    const box = canvas.getBoundingClientRect();
    return { x: event.clientX - box.left, y: event.clientY - box.top };
  };
  canvas.addEventListener("pointerdown", (event) => {
    drawing = true;
    canvas.setPointerCapture?.(event.pointerId);
    const p = pos(event);
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
  });
  canvas.addEventListener("pointermove", (event) => {
    if (!drawing) return;
    const p = pos(event);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
  });
  const stop = () => {
    drawing = false;
  };
  canvas.addEventListener("pointerup", stop);
  canvas.addEventListener("pointercancel", stop);
  stage.querySelector("[data-act='doodle-clear']")?.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  });
}
