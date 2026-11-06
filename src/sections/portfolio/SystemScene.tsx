import { useEffect, useRef, useState } from "react";
import { useChapter } from "../../lib/use-chapter";
import { createWorld } from "../../lib/cinematic-world";
import { systemNodes } from "../../data/engineering";
import { kerasobha } from "../../data/content";
import { SceneFooter } from "./PortraitScenes";

export default function SystemScene() {
  const root = useRef<HTMLElement>(null),
    canvas = useRef<HTMLCanvasElement>(null);
  const world = useRef<ReturnType<typeof createWorld> | null>(null);
  const [selected, setSelected] = useState("worker"),
    [trace, setTrace] = useState(false);
  const drag = useRef<{ x: number; y: number } | null>(null);
  useEffect(() => {
    const renderer = createWorld(
      canvas.current!,
      Array.from(root.current!.querySelectorAll<HTMLElement>(".spatial-node")),
    );
    world.current = renderer;
    return () => renderer.destroy();
  }, []);
  const { go } = useChapter(root, 2, 1, (el, p) => {
    world.current?.render(0.53 + p * 0.47);
    el.querySelector<HTMLElement>(".system-model-label")!.style.transform = `translateY(${-p * 70}px)`;
    el.querySelector<HTMLElement>(".system-model-label")!.style.opacity = String(1 - p);
  });
  useEffect(() => {
    world.current?.select(selected, trace ? ["browser", "worker", "enquiries", "d1"] : []);
  }, [selected, trace]);
  const node = systemNodes.find((n) => n.id === selected)!;
  return (
    <>
      <section
        id="engineering"
        ref={root}
        className="portfolio-scene spatial-scene"
        data-scene="system"
        aria-labelledby="engineering-title"
      >
        <div className="scene-stage">
          <canvas ref={canvas} className="spatial-canvas" aria-hidden="true" />
          <div className="scene-heading">
            <p className="scene-label">03 / Beneath the interface</p>
            <h2 id="engineering-title">
              Every layer.
              <br />
              <em>One architecture.</em>
            </h2>
          </div>
          <div className="system-model-label" aria-hidden="true">
            Structure unfolds.
          </div>
          <div
            className="spatial-orbit"
            role="group"
            tabIndex={0}
            aria-label="Architecture model. Drag or use arrow keys to rotate."
            onKeyDown={(e) => {
              const motion: Record<string, [number, number]> = {
                ArrowLeft: [-15, 0],
                ArrowRight: [15, 0],
                ArrowUp: [0, -15],
                ArrowDown: [0, 15],
              };
              if (motion[e.key]) {
                e.preventDefault();
                world.current?.orbit(...motion[e.key]);
              }
            }}
            onPointerDown={(e) => {
              if (e.target !== e.currentTarget) return;
              drag.current = { x: e.clientX, y: e.clientY };
              e.currentTarget.setPointerCapture(e.pointerId);
            }}
            onPointerMove={(e) => {
              if (!drag.current) return;
              world.current?.orbit(e.clientX - drag.current.x, e.clientY - drag.current.y);
              drag.current = { x: e.clientX, y: e.clientY };
            }}
            onPointerUp={() => {
              drag.current = null;
            }}
            onPointerCancel={() => {
              drag.current = null;
            }}
          >
            {systemNodes.map((n, i) => (
              <button
                className={`spatial-node${selected === n.id ? " selected" : ""}`}
                key={n.id}
                aria-pressed={selected === n.id}
                aria-controls="spatial-inspector"
                onClick={() => {
                  setSelected(n.id);
                  go(0.9);
                }}
              >
                <small>0{i + 1}</small>
                {n.label}
              </button>
            ))}
          </div>
          <aside className="spatial-inspector" id="spatial-inspector" aria-live="polite">
            <p className="scene-label">Inspect / {node.id}</p>
            <h3>{node.label}</h3>
            <p>{node.description}</p>
            <small>Architecture model · No live requests</small>
          </aside>
          <div className="spatial-controls">
            <button
              onClick={() => {
                setTrace(!trace);
                go(0.9);
              }}
              aria-pressed={trace}
            >
              Trace an enquiry ↗
            </button>
            <button onClick={() => world.current?.zoom(-0.12)} aria-label="Zoom out">
              −
            </button>
            <button onClick={() => world.current?.reset()}>Reset</button>
            <button onClick={() => world.current?.zoom(0.12)} aria-label="Zoom in">
              +
            </button>
          </div>
          <p className="spatial-hint">
            {trace ? "Browser → Worker → Enquiries → D1" : "Select a component. Drag the space to orbit."}
          </p>
          <SceneFooter title="Systems / Kerasobha on the edge" next="stack" />
        </div>
      </section>
      <div className="system-decisions">
        <p className="scene-label">Design decisions / Inspect the reasoning</p>
        {kerasobha.decisions.map((d, i) => (
          <details key={d.title}>
            <summary>
              <span>0{i + 1}</span>
              {d.title}
              <b>+</b>
            </summary>
            <p>{d.body}</p>
          </details>
        ))}
      </div>
    </>
  );
}
