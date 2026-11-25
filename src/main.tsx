import { StrictMode, useEffect, useState, type CSSProperties } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const displays = [
  {
    id: "rice",
    label: "Rice Alumnus",
    story: [
      "I’m a proud Rice alumnus. I graduated in May 2025 with a B.S. in Computer Science and a B.A. in Mathematics.",
      "I was also a member of Lovett College.",
    ],
    position: { left: "17.5%", top: "28%", width: "10%", height: "27%" },
  },
  {
    id: "research",
    label: "Biomedical Researcher",
    story: [
      "I published two hepatology papers at Northwestern Medicine under Dr. Richard Green.",
      "I also studied acute myeloid leukemia at MD Anderson Cancer Center under Dr. Cassian Yee.",
    ],
    position: { left: "25.5%", top: "27%", width: "8.5%", height: "25%" },
  },
  {
    id: "datadog",
    label: "Software Engineer at Datadog",
    story: [
      "I’m a full-stack engineer on the Billing Hub team, building performant cost and usage endpoints that help customers understand their bills.",
      "I work in TypeScript, Go, and Python, and I’m diving deeper into data engineering with Apache Iceberg, Spark, and Trino.",
    ],
    position: { left: "32.5%", top: "24%", width: "8%", height: "23%" },
  },
  {
    id: "rockets",
    label: "Rockets Fan",
    story: [
      "I’ve been a Rockets fan since childhood, and I play a lot of basketball myself.",
    ],
    position: { left: "38.5%", top: "22%", width: "7%", height: "23%" },
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
  },
];

type HotspotStyle = CSSProperties & {
  "--left": string;
  "--top": string;
  "--width": string;
  "--height": string;
};

function App() {
  const [selected, setSelected] = useState<string | null>(null);
  const selectedDisplay = displays.find((display) => display.id === selected);
  const registerOpen = selected === "register";
  const detailOpen = Boolean(selectedDisplay) || registerOpen;

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelected(null);
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  return (
    <main className="site">
      <section className="storefront" aria-labelledby="intro-title">
        <header className="intro-header">
          <h1 id="intro-title">Hi, my name’s Danny.</h1>
          <p>I’m a product engineer who enjoys stepping into different worlds, wearing their uniforms, and appreciating good clothes.</p>
        </header>

        <div className="scene-scroll">
          <div className="scene-frame">
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
                <button
                  className={`scene-hotspot garment-hotspot${selected === display.id ? " is-selected" : ""}`}
                  key={display.id}
                  type="button"
                  style={style}
                  data-label={display.label}
                  aria-label={`Inspect ${display.label}`}
                  onClick={() => setSelected(display.id)}
                />
              );
            })}

            <button
              className={`scene-hotspot register-hotspot${registerOpen ? " is-selected" : ""}`}
              type="button"
              data-label="Checkout"
              aria-label="Open contact and résumé links"
              onClick={() => setSelected("register")}
            />

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

      </section>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
