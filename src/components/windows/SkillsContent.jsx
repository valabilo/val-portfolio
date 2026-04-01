// src/components/windows/SkillsContent.jsx
import { useState, useEffect, useRef } from "react";

/* ── Test Row ────────────────────────────────────────────────── */
function TestRow({ test, delay }) {
  const [visible, setVisible] = useState(false);
  const [barWidth, setBarWidth] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), delay);
    const t2 = setTimeout(() => setBarWidth(test.pct), delay + 60);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [delay, test.pct]);

  return (
    <div className={`test-row${visible ? " visible" : ""}`}>
      <span className={`test-icon ${test.tag}`}>✓</span>
      <span className="test-name">{test.name}</span>
      <div className="test-bar-wrap">
        <div
          className={`test-bar ${test.tag === "pass" ? "green" : "amber"}`}
          style={{ width: `${barWidth}%` }}
        />
      </div>
      <span className={`test-tag ${test.tag}`}>
        {test.tag === "pass" ? "PASS" : "LEARN"}
      </span>
    </div>
  );
}

/* ── Component ───────────────────────────────────────────────── */
export function SkillsContent({ skillSuites, initialized }) {
  const [progress, setProgress] = useState("Initializing...");
  const startedRef = useRef(false);

  const suites = skillSuites ?? [];
  const allTests = suites.flatMap((s) => s.tests);

  useEffect(() => {
    if (!initialized || startedRef.current || !allTests.length) return;
    startedRef.current = true;

    allTests.forEach((_, idx) => {
      setTimeout(
        () => {
          const done = idx + 1;
          setProgress(
            done === allTests.length
              ? `${allTests.length} tests · 0.42s`
              : `Running... ${done}/${allTests.length}`,
          );
        },
        idx * 120 + 200,
      );
    });
  }, [initialized, allTests.length]); // eslint-disable-line react-hooks/exhaustive-deps

  const passCount = allTests.filter((t) => t.tag === "pass").length;
  const learnCount = allTests.filter((t) => t.tag !== "pass").length;
  let globalIdx = 0;

  return (
    <div className="test-runner">
      {/* Header */}
      <div className="test-runner-header">
        <span style={{ color: "var(--amber)" }}>RUNS</span>
        &nbsp; skills.test.js &nbsp;|&nbsp;
        <span
          style={{
            color: progress.includes("tests ·")
              ? "var(--green)"
              : "var(--text-dim)",
          }}>
          {progress}
        </span>
      </div>

      {/* Suite list */}
      <div className="test-runner-body">
        {suites.map((suite) => (
          <div key={suite.id} style={{ marginBottom: 20 }}>
            <div className="test-suite-label">
              {suite.label}
              <span style={{ color: "var(--green)" }}>{suite.countText}</span>
            </div>
            {suite.tests.map((test) => {
              const delay = globalIdx++ * 120 + 200;
              return <TestRow key={test.name} test={test} delay={delay} />;
            })}
          </div>
        ))}

        {/* Summary */}
        <div className="test-summary">
          <span>
            Test Suites:{" "}
            <span style={{ color: "var(--text)" }}>{suites.length}</span>
          </span>
          <span>
            Tests:{" "}
            <span style={{ color: "var(--green)" }}>{passCount} passed</span>
          </span>
          {learnCount > 0 && (
            <span>
              {learnCount}{" "}
              <span style={{ color: "var(--amber)" }}>learning</span>
            </span>
          )}
          <span>
            Time: <span style={{ color: "var(--text)" }}>0.42s</span>
          </span>
          {allTests.length > 0 && (
            <span style={{ color: "var(--green)" }}>
              Coverage: {Math.round((passCount / allTests.length) * 100)}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
