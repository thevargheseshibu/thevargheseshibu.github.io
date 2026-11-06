import { ease, phase } from "./cinematic-scene";
import { systemEdges, systemNodes } from "../data/engineering";

type Point = [number, number, number];
const positions: Point[] = [
  [-3.8, 0, 0],
  [-1.4, 0, -2.2],
  [-1.4, 0, 1.5],
  [1.3, 0, -1.1],
  [1.3, 0, 2.5],
  [4, 0, 0.5],
  [-3.8, 0, 3.8],
  [4, 0, 3.8],
];

/** Small perspective renderer. Canvas and accessible HTML nodes share the same 3D projection. */
export function createWorld(canvas: HTMLCanvasElement, buttons: HTMLElement[]) {
  const ctx = canvas.getContext("2d")!;
  let width = 1,
    height = 1,
    progress = 0,
    yaw = -0.32,
    pitch = 0.68,
    zoom = 1,
    active = "worker",
    route: string[] = [];
  const project = ([x, y, z]: Point) => {
    const a = x * Math.cos(yaw) - z * Math.sin(yaw);
    const b = x * Math.sin(yaw) + z * Math.cos(yaw);
    const by = y * Math.cos(pitch) - b * Math.sin(pitch);
    const bz = y * Math.sin(pitch) + b * Math.cos(pitch);
    const unfold = ease(phase(progress, 0.57, 0.88));
    const mobile = width < 700;
    const k =
      (Math.min(width / (mobile ? 12 : 17), height / (mobile ? 8 : 12)) * zoom * (0.2 + 0.8 * unfold) * 11) / (11 + bz);
    return [width * (mobile ? 0.5 : 0.43) + a * k, height * (mobile ? 0.45 : 0.56) + by * k, k];
  };
  const line = (points: number[][], color: string, lineWidth = 1) => {
    ctx.beginPath();
    points.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  };
  const draw = () => {
    ctx.clearRect(0, 0, width, height);
    const enter = ease(phase(progress, 0.27, 0.5));
    const exit = 1 - ease(phase(progress, 0.6, 0.8));
    ctx.globalAlpha = enter * exit;
    // Camera travels through physical portal ribs, with no time-driven movement.
    const travel = phase(progress, 0.25, 0.72) * 15;
    for (let i = 23; i >= 0; i--) {
      const z = i * 1.4 - travel;
      if (z < 0.2) continue;
      const scale = 1.8 / z;
      const w = width * 0.34 * scale,
        h = height * 0.55 * scale;
      const cx = width * 0.5,
        cy = height * 0.48;
      line(
        [
          [cx - w, cy + h],
          [cx - w, cy - h],
          [cx + w, cy - h],
          [cx + w, cy + h],
        ],
        `rgba(211,185,133,${Math.min(0.8, scale * 0.65)})`,
        i % 3 === 0 ? 2 : 1,
      );
      line(
        [
          [cx - w, cy + h],
          [cx + w, cy + h],
        ],
        "#68715c",
      );
    }
    ctx.globalAlpha = ease(phase(progress, 0.52, 0.75));
    for (let x = -7; x <= 7; x++) line([project([x, 0.6, -5]), project([x, 0.6, 6])], "#293b32");
    for (let z = -5; z <= 6; z++) line([project([-7, 0.6, z]), project([7, 0.6, z])], "#293b32");
    systemEdges.forEach(([from, to], i) => {
      const a = positions[systemNodes.findIndex((n) => n.id === from)];
      const b = positions[systemNodes.findIndex((n) => n.id === to)];
      const middle: Point = [b[0], 0.3, a[2]];
      const highlighted = route.length ? route.includes(from) && route.includes(to) : from === active || to === active;
      const path = [project([a[0], 0.3, a[2]]), project(middle), project([b[0], 0.3, b[2]])];
      line(path, highlighted ? "#e1cb9d" : "#526756", highlighted ? 2 : 1);
      const t = (progress * 8 + i * 0.17) % 1;
      const segment = t < 0.5 ? ([path[0], path[1], t * 2] as const) : ([path[1], path[2], (t - 0.5) * 2] as const);
      const [p, q, f] = segment;
      ctx.fillStyle = "#eddab5";
      ctx.beginPath();
      ctx.arc(p[0] + (q[0] - p[0]) * f, p[1] + (q[1] - p[1]) * f, highlighted ? 3 : 1.5, 0, Math.PI * 2);
      ctx.fill();
    });
    positions.forEach(([x, y, z], i) => {
      const chosen = systemNodes[i].id === active;
      const top = y - (chosen ? 0.8 : 0.45);
      const corners: Point[] = [
        [x - 0.6, top, z - 0.4],
        [x + 0.6, top, z - 0.4],
        [x + 0.6, top, z + 0.4],
        [x - 0.6, top, z + 0.4],
      ];
      const face = corners.map(project);
      ctx.beginPath();
      face.forEach(([px, py], j) => (j ? ctx.lineTo(px, py) : ctx.moveTo(px, py)));
      ctx.closePath();
      ctx.fillStyle = chosen ? "#4b5540" : "#1d3028";
      ctx.fill();
      line([...face, face[0]], chosen ? "#efdbb3" : "#8e9474", 1.2);
      corners.forEach((p, j) => line([face[j], project([p[0], 0.6, p[2]])], chosen ? "#ae9c74" : "#52614e"));
      const [px, py] = project([x, top, z]);
      const button = buttons[i];
      if (button) {
        button.style.left = `${px}px`;
        button.style.top = `${py - 22}px`;
      }
    });
    ctx.globalAlpha = 1;
  };
  const resize = () => {
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    const dpr = Math.min(devicePixelRatio, 1.75);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw();
  };
  const observer = new ResizeObserver(resize);
  observer.observe(canvas);
  return {
    render(p: number) {
      progress = p;
      draw();
    },
    select(id: string, trace: string[]) {
      active = id;
      route = trace;
      draw();
    },
    orbit(dx: number, dy: number) {
      yaw += dx * 0.006;
      pitch = Math.max(0.25, Math.min(1.15, pitch + dy * 0.004));
      draw();
    },
    zoom(value: number) {
      zoom = Math.max(0.65, Math.min(1.45, zoom + value));
      draw();
    },
    reset() {
      yaw = -0.32;
      pitch = 0.68;
      zoom = 1;
      draw();
    },
    destroy() {
      observer.disconnect();
    },
  };
}
