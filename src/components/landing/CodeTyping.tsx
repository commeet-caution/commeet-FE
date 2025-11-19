import { useState, useEffect } from "react";

const lines = [
  "const user = connect(student, professor);",
  "const schedule = fetchAvailableTimes(user);",
  "commeetPortal.start();",
];

export default function CodeTyping() {
  const [index, setIndex] = useState(0);
  const [typed, setTyped] = useState("");

  useEffect(() => {
    const line = lines[index];
    let i = 0;

    const typing = setInterval(() => {
      setTyped(line.slice(0, i));
      i++;

      if (i > line.length) {
        clearInterval(typing);
        setTimeout(() => {
          setIndex((prev) => (prev + 1) % lines.length);
        }, 1200);
      }
    }, 40);

    return () => clearInterval(typing);
  }, [index]);

  return (
    <pre className="code-typing">
{`> ${typed}`}
    </pre>
  );
}
