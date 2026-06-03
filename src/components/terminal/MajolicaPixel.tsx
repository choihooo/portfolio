"use client";

// Blue Majolica (마조리카) pixel art character
// A wizard/sorceress character in blue tones — hat, robe, staff
export default function MajolicaPixel() {
  const B = "#58a6ff"; // blue body
  const D = "#1f6feb"; // dark blue
  const L = "#79c0ff"; // light blue highlight
  const W = "#ffffff"; // white (eyes, staff tip)
  const P = "#0d1117"; // pupil
  const S = "#d2a8ff"; // star/sparkle (purple)
  const _ = null;

  // 16x20 pixel art — wizard with pointed hat
  const grid: (string | null)[][] = [
    // Hat (pointed)
    [_, _, _, _, _, _, S, _, _, _, _, _, _, _, _, _],  // 0
    [_, _, _, _, _, _, B, _, _, _, _, _, _, _, _, _],  // 1
    [_, _, _, _, _, B, L, B, _, _, _, _, _, _, _, _],  // 2
    [_, _, _, _, _, B, B, B, _, _, _, _, _, _, _, _],  // 3
    [_, _, _, _, B, B, L, B, B, _, _, _, _, _, _, _],  // 4
    [_, _, _, _, B, B, B, B, B, _, _, _, _, _, _, _],  // 5
    [_, _, _, B, B, B, L, B, B, B, _, _, _, _, _, _],  // 6
    // Hat brim
    [_, _, B, B, B, B, B, B, B, B, B, _, _, _, _, _],  // 7
    // Face
    [_, _, _, B, W, P, B, P, W, B, _, _, _, _, _, _],  // 8
    [_, _, _, B, B, B, B, B, B, B, _, _, _, _, _, _],  // 9
    [_, _, _, B, B, B, L, B, B, B, _, _, _, _, _, _],  // 10
    [_, _, _, _, B, B, B, B, B, _, _, _, _, _, _, _],  // 11
    // Robe body
    [_, _, _, D, D, B, B, B, D, D, _, _, _, _, _, _],  // 12
    [_, _, _, D, B, B, L, B, B, D, _, _, _, _, _, _],  // 13
    [_, _, D, D, B, B, B, B, B, D, D, _, _, _, _, _],  // 14
    [_, _, D, B, B, B, L, B, B, B, D, _, _, _, _, _],  // 15
    [_, _, _, D, B, B, B, B, B, D, _, _, _, _, _, _],  // 16
    [_, _, _, _, D, B, B, B, D, _, _, _, _, _, _, _],  // 17
    // Feet
    [_, _, _, _, _, D, _, D, _, _, _, _, _, _, _, _],  // 18
    [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],  // 19
  ];

  const pixelSize = 5;

  return (
    <div
      style={{
        width: 16 * pixelSize,
        height: 20 * pixelSize,
        position: "relative",
        imageRendering: "pixelated",
      }}
    >
      {grid.flatMap((row, y) =>
        row.map((color, x) =>
          color ? (
            <div
              key={`${x}-${y}`}
              style={{
                position: "absolute",
                left: x * pixelSize,
                top: y * pixelSize,
                width: pixelSize,
                height: pixelSize,
                background: color,
              }}
            />
          ) : null
        )
      )}
    </div>
  );
}
