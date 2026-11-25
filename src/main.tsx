import {
  StrictMode,
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

type Direction = "up" | "down" | "left" | "right";
type Position = { x: number; y: number };
type DestinationSplash = Position & { id: number };

const displays = [
  {
    id: "rice",
    label: "Rice Alumnus",
    story: [
      "I’m a proud Rice alumnus. I graduated in May 2025 with a B.S. in Computer Science and a B.A. in Mathematics.",
      "I was also a member of Lovett College.",
    ],
    position: { left: "17.5%", top: "28%", width: "10%", height: "27%" },
    interactionPoint: { x: 22, y: 64 },
  },
  {
    id: "research",
    label: "Biomedical Researcher",
    story: [
      "I published two hepatology papers at Northwestern Medicine under Dr. Richard Green.",
      "I also studied acute myeloid leukemia at MD Anderson Cancer Center under Dr. Cassian Yee.",
    ],
    position: { left: "25.5%", top: "27%", width: "8.5%", height: "25%" },
    interactionPoint: { x: 29.5, y: 61.5 },
  },
  {
    id: "datadog",
    label: "Software Engineer at Datadog",
    story: [
      "I’m a full-stack engineer on the Billing Hub team, building performant cost and usage endpoints that help customers understand their bills.",
      "I work in TypeScript, Go, and Python, and I’m diving deeper into data engineering with Apache Iceberg, Spark, and Trino.",
    ],
    position: { left: "32.5%", top: "24%", width: "8%", height: "23%" },
    interactionPoint: { x: 36.5, y: 59 },
  },
  {
    id: "rockets",
    label: "Rockets Fan",
    story: [
      "I’ve been a Rockets fan since childhood, and I play a lot of basketball myself.",
    ],
    position: { left: "38.5%", top: "22%", width: "7%", height: "23%" },
    interactionPoint: { x: 42, y: 57 },
  },
  {
    id: "komune",
    label: "Engineer at Komune",
    story: [
      "I’m also an engineer at Komune, a fashion boutique whose clothes I really like. They mostly have curated brands from Asian designers!",
      "I implemented sub-300ms keyword and semantic search across its 1,300+ item Shopify catalog.",
    ],
    href: "https://komune.space/shop",
    position: { left: "44%", top: "18%", width: "8%", height: "26%" },
    interactionPoint: { x: 48, y: 54.5 },
  },
];

const registerTarget = {
  id: "register",
  label: "Register",
  interactionPoint: { x: 65, y: 63 },
};

const recordPlayerTarget = {
  id: "record-player",
  label: "Record Player",
  interactionPoint: { x: 31, y: 72 },
};

const directionForKey: Record<string, Direction> = {
  w: "up",
  a: "left",
  s: "down",
  d: "right",
};

const directionKeys: Record<Direction, string> = {
  up: "W",
  left: "A",
  down: "S",
  right: "D",
};

type HotspotStyle = CSSProperties & {
  "--left": string;
  "--top": string;
  "--width": string;
  "--height": string;
};

type AvatarStyle = CSSProperties & {
  "--avatar-x": string;
  "--avatar-y": string;
};

function constrainPosition(position: Position): Position {
  const x = Math.min(78, Math.max(20, position.x));
  const topEdge = x <= 52 ? 72 - x * 0.38 : 22 + x * 0.58;
  const bottomEdge = x <= 50 ? 50 + x * 0.92 : 142 - x * 0.92;

  return {
    x,
    y: Math.min(bottomEdge - 2, Math.max(topEdge + 1, position.y)),
  };
}

function advancePosition(position: Position, directions: Direction[], distance: number): Position {
  let horizontal = 0;
  let vertical = 0;

  if (directions.includes("left")) horizontal -= 1;
  if (directions.includes("right")) horizontal += 1;
  if (directions.includes("up")) vertical -= 1;
  if (directions.includes("down")) vertical += 1;

  const magnitude = Math.hypot(horizontal, vertical) || 1;
  return constrainPosition({
    x: position.x + (horizontal / magnitude) * distance,
    y: position.y + (vertical / magnitude) * distance,
  });
}

function interactionDistance(position: Position, target: Position) {
  return Math.hypot(position.x - target.x, (position.y - target.y) * 1.15);
}

function App() {
  const [selected, setSelected] = useState<string | null>(null);
  const [avatarPosition, setAvatarPosition] = useState<Position>({ x: 52, y: 78 });
  const [activeDirections, setActiveDirections] = useState<Direction[]>([]);
  const [facing, setFacing] = useState<Direction>("right");
  const [spotifyOpen, setSpotifyOpen] = useState(false);
  const [destination, setDestination] = useState<Position | null>(null);
  const [destinationSplash, setDestinationSplash] = useState<DestinationSplash | null>(null);
  const activeDirectionsRef = useRef(new Set<Direction>());
  const avatarPositionRef = useRef(avatarPosition);
  const sceneRef = useRef<HTMLDivElement>(null);

  const selectedDisplay = displays.find((display) => display.id === selected);
  const registerOpen = selected === "register";
  const detailOpen = Boolean(selectedDisplay) || registerOpen;

  const targets = [...displays, registerTarget, recordPlayerTarget];
  const closestTarget = targets.reduce((closest, target) => {
    const distance = interactionDistance(avatarPosition, target.interactionPoint);
    return distance < closest.distance ? { target, distance } : closest;
  }, { target: targets[0], distance: Number.POSITIVE_INFINITY });
  const nearbyTarget = closestTarget.distance <= 8.5 ? closestTarget.target : null;
  const recordPlayerNearby = nearbyTarget?.id === "record-player";

  const stopAllDirections = useCallback(() => {
    activeDirectionsRef.current.clear();
    setActiveDirections([]);
  }, []);

  const startDirection = useCallback((direction: Direction) => {
    if (detailOpen) return;

    setDestination(null);
    setFacing(direction);
    if (!activeDirectionsRef.current.has(direction)) {
      activeDirectionsRef.current.add(direction);
      setActiveDirections([...activeDirectionsRef.current]);
      setAvatarPosition((position) => advancePosition(position, [direction], 1.05));
    }
  }, [detailOpen]);

  const stopDirection = useCallback((direction: Direction) => {
    activeDirectionsRef.current.delete(direction);
    setActiveDirections([...activeDirectionsRef.current]);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelected(null);
        return;
      }

      const direction = directionForKey[event.key.toLowerCase()];
      if (!direction || event.metaKey || event.ctrlKey || event.altKey) return;
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;

      event.preventDefault();
      startDirection(direction);
    };

    const onKeyUp = (event: KeyboardEvent) => {
      const direction = directionForKey[event.key.toLowerCase()];
      if (!direction) return;
      event.preventDefault();
      stopDirection(direction);
    };

    const onWindowBlur = () => {
      stopAllDirections();
      window.setTimeout(() => {
        if (document.activeElement instanceof HTMLIFrameElement) {
          sceneRef.current?.focus({ preventScroll: true });
        }
      }, 180);
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", onWindowBlur);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", onWindowBlur);
    };
  }, [startDirection, stopAllDirections, stopDirection]);

  useEffect(() => {
    if (detailOpen) stopAllDirections();
    if (detailOpen) setDestination(null);
  }, [detailOpen, stopAllDirections]);

  useEffect(() => {
    avatarPositionRef.current = avatarPosition;
  }, [avatarPosition]);

  useEffect(() => {
    if (recordPlayerNearby) setSpotifyOpen(true);
  }, [recordPlayerNearby]);

  useEffect(() => {
    if (!destinationSplash) return;
    const timeout = window.setTimeout(() => setDestinationSplash(null), 620);
    return () => window.clearTimeout(timeout);
  }, [destinationSplash]);

  useEffect(() => {
    if (detailOpen || activeDirections.length === 0) return;

    let frame = 0;
    let previousTime = performance.now();

    const move = (time: number) => {
      const elapsed = Math.min((time - previousTime) / 1000, 0.04);
      previousTime = time;
      setAvatarPosition((position) => advancePosition(position, activeDirections, elapsed * 14));
      frame = requestAnimationFrame(move);
    };

    frame = requestAnimationFrame(move);
    return () => cancelAnimationFrame(frame);
  }, [activeDirections, detailOpen]);

  useEffect(() => {
    if (detailOpen || !destination) return;

    let frame = 0;
    let previousTime = performance.now();

    const moveToDestination = (time: number) => {
      const elapsed = Math.min((time - previousTime) / 1000, 0.04);
      previousTime = time;

      const current = avatarPositionRef.current;
      const horizontal = destination.x - current.x;
      const vertical = destination.y - current.y;
      const distance = Math.hypot(horizontal, vertical);
      const step = elapsed * 14;

      if (distance <= Math.max(step, 0.45)) {
        avatarPositionRef.current = destination;
        setAvatarPosition(destination);
        setDestination(null);
        return;
      }

      const nextPosition = constrainPosition({
        x: current.x + (horizontal / distance) * step,
        y: current.y + (vertical / distance) * step,
      });
      avatarPositionRef.current = nextPosition;
      setAvatarPosition(nextPosition);
      frame = requestAnimationFrame(moveToDestination);
    };

    frame = requestAnimationFrame(moveToDestination);
    return () => cancelAnimationFrame(frame);
  }, [destination, detailOpen]);

  const releasePointer = (event: ReactPointerEvent<HTMLButtonElement>, direction: Direction) => {
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    stopDirection(direction);
  };

  const avatarStyle: AvatarStyle = {
    "--avatar-x": `${avatarPosition.x}%`,
    "--avatar-y": `${avatarPosition.y}%`,
  };

  const interactWithNearbyTarget = () => {
    if (!nearbyTarget) return;
    if (nearbyTarget.id === "record-player") {
      setSpotifyOpen((open) => !open);
    } else {
      setSelected(nearbyTarget.id);
    }
  };

  const interactionLabel = nearbyTarget?.id === "register"
    ? "Use register"
    : nearbyTarget?.id === "record-player"
      ? spotifyOpen ? "Hide Spotify" : "Play Mint"
      : "Pick it up";

  const walkToPointer = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (detailOpen || event.button !== 0) return;
    const target = event.target as Element;
    if (target.closest("button, a, iframe, .world-prompt, .spotify-player")) return;

    const bounds = event.currentTarget.getBoundingClientRect();
    const nextDestination = constrainPosition({
      x: ((event.clientX - bounds.left) / bounds.width) * 100,
      y: ((event.clientY - bounds.top) / bounds.height) * 100,
    });
    const horizontal = nextDestination.x - avatarPosition.x;
    const vertical = nextDestination.y - avatarPosition.y;

    stopAllDirections();
    setFacing(Math.abs(horizontal) > Math.abs(vertical)
      ? horizontal < 0 ? "left" : "right"
      : vertical < 0 ? "up" : "down");
    setDestinationSplash({ ...nextDestination, id: performance.now() });
    setDestination(nextDestination);
  };

  return (
    <main className="site">
      <section className="storefront" aria-labelledby="intro-title">
        <header className="intro-header">
          <h1 id="intro-title">Hi, my name’s Danny.</h1>
          <p>I’m a product engineer who enjoys stepping into different worlds, wearing their uniforms, and appreciating good clothes.</p>
        </header>

        <div className="game-layout">
          <div className="scene-scroll">
            <div className="scene-frame" ref={sceneRef} tabIndex={-1} onPointerDown={walkToPointer}>
              <img
                className="store-scene"
                src="/images/danny-uniform-shop-pixel-v3.png"
                alt="A warm beige, semi-top-down pixel-art boutique with five uniforms on the left wall and a checkout register on the right"
              />

              {displays.map((display) => {
                const style: HotspotStyle = {
                  "--left": display.position.left,
                  "--top": display.position.top,
                  "--width": display.position.width,
                  "--height": display.position.height,
                };

                return (
                  <div
                    className={`scene-hotspot garment-hotspot${nearbyTarget?.id === display.id ? " is-nearby" : ""}`}
                    key={display.id}
                    style={style}
                    data-label={display.label}
                    aria-hidden="true"
                  />
                );
              })}

              <div
                className={`scene-hotspot register-hotspot${nearbyTarget?.id === "register" ? " is-nearby" : ""}`}
                data-label="Register"
                aria-hidden="true"
              />

              <div
                className={`record-player${recordPlayerNearby ? " is-nearby" : ""}${spotifyOpen ? " is-playing" : ""}`}
                data-label="Mint — Dorian Concept"
                aria-hidden="true"
              >
                <img src="/images/record-player-pixel-v1.png" alt="" />
              </div>

              <div
                className={`avatar avatar--${facing}${activeDirections.length || destination ? " is-walking" : ""}`}
                style={avatarStyle}
                aria-label="Danny, wearing a Blackmerle jacket and black jeans"
                role="img"
              >
                <span className="avatar-sprite" />
              </div>

              {destinationSplash && (
                <span
                  className="destination-splash"
                  key={destinationSplash.id}
                  style={{ left: `${destinationSplash.x}%`, top: `${destinationSplash.y}%` }}
                  aria-hidden="true"
                />
              )}

              {nearbyTarget && !selected && (
                <div className="world-prompt" style={avatarStyle} role="status" aria-live="polite">
                  <span>{nearbyTarget.label}</span>
                  <button type="button" onClick={interactWithNearbyTarget}>
                    {interactionLabel}
                  </button>
                </div>
              )}

              {spotifyOpen && (
                <div className="spotify-player">
                  <button
                    className="spotify-close"
                    type="button"
                    aria-label="Close Spotify player"
                    onClick={() => setSpotifyOpen(false)}
                  >
                    ×
                  </button>
                  <iframe
                    src="https://open.spotify.com/embed/track/3nibd5HsrZLO2nc0q6gJoG?utm_source=generator&theme=0"
                    title="Mint by Dorian Concept on Spotify"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                  />
                </div>
              )}

              {selected && (
                <button
                  className="dialog-shade"
                  type="button"
                  aria-label="Close dialogue"
                  onClick={() => setSelected(null)}
                />
              )}

              <aside className={`pixel-dialog${detailOpen ? " is-open" : ""}`} aria-live="polite">
                {selectedDisplay && (
                  <>
                    <h2>{selectedDisplay.label}</h2>
                    <div className="dialog-copy">
                      {selectedDisplay.story.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>
                    {"href" in selectedDisplay && selectedDisplay.href && (
                      <a href={selectedDisplay.href} target="_blank" rel="noreferrer">
                        Visit Komune
                      </a>
                    )}
                  </>
                )}

                {registerOpen && (
                  <>
                    <h2>Keep in touch</h2>
                    <div className="register-actions">
                      <a href="https://www.linkedin.com/in/dannyzhang1020" target="_blank" rel="noreferrer">
                        LinkedIn
                      </a>
                      <a href="/danny-zhang-resume.pdf" target="danny-resume" rel="noreferrer">
                        Résumé
                      </a>
                    </div>
                  </>
                )}

                <button className="dialog-close" type="button" onClick={() => setSelected(null)} aria-label="Close dialogue">
                  ×
                </button>
              </aside>
            </div>
          </div>

          <aside className="control-panel" aria-label="Store controls">
            <div className="d-pad" aria-label="Movement controls">
              {(["up", "left", "down", "right"] as Direction[]).map((direction) => (
                <button
                  className={`control-key control-key--${direction}${activeDirections.includes(direction) ? " is-active" : ""}`}
                  key={direction}
                  type="button"
                  aria-label={`Move ${direction}`}
                  aria-pressed={activeDirections.includes(direction)}
                  onPointerDown={(event) => {
                    event.preventDefault();
                    event.currentTarget.setPointerCapture?.(event.pointerId);
                    startDirection(direction);
                  }}
                  onPointerUp={(event) => releasePointer(event, direction)}
                  onPointerCancel={(event) => releasePointer(event, direction)}
                  onClick={(event) => {
                    if (event.detail === 0) {
                      setDestination(null);
                      setFacing(direction);
                      setAvatarPosition((position) => advancePosition(position, [direction], 1.5));
                    }
                  }}
                >
                  {directionKeys[direction]}
                </button>
              ))}
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
