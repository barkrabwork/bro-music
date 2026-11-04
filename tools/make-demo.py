"""Generates demo tracks (WAV tones), PNG covers and demo-tracks/tracks.json.

Run from the bro-music folder:  python -I tools/make-demo.py
Only used for the demo; the real tracks.json is built by the upload script.
"""
import json
import math
import os
import struct
import wave
import zlib

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
OUT = os.path.join(ROOT, "demo-tracks")
SR = 12000
BARS = 240


def hz(note):
    return 440.0 * 2 ** ((note - 69) / 12)


def synth(scale, pattern, step, total, wobble, ramp=True):
    n = int(total * SR)
    buf = [0.0] * n
    note_len = int(step * 1.6 * SR)
    for k in range(int(total / step)):
        f = hz(scale[pattern[k % len(pattern)]])
        start = int(k * step * SR)
        for i in range(min(note_len, n - start)):
            t = i / SR
            env = math.exp(-t * 5.0)
            s = math.sin(2 * math.pi * f * t) + 0.35 * math.sin(4 * math.pi * f * t)
            buf[start + i] += s * env
    out = []
    for i, v in enumerate(buf):
        t = i / n
        mod = 0.55 + 0.45 * math.sin(2 * math.pi * wobble * t) ** 2
        grow = (0.35 + 0.65 * math.sin(math.pi * t)) if ramp else 1.0
        out.append(v * mod * grow)
    return out


def phone_ring(total):
    n = int(total * SR)
    out = [0.0] * n
    for i in range(n):
        t = i / SR
        phase = t % 3.0
        if phase < 1.6:
            gate = 1.0 if (phase % 0.4) < 0.2 else 0.0
            f = 440.0 if (phase % 0.2) < 0.1 else 480.0
            out[i] = gate * math.sin(2 * math.pi * f * t)
    return out


def write_wav(path, samples):
    peak = max(abs(v) for v in samples) or 1.0
    with wave.open(path, "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(b"".join(struct.pack("<h", int(v / peak * 0.8 * 32767)) for v in samples))


def peaks(samples):
    seg = len(samples) / BARS
    vals = []
    for b in range(BARS):
        chunk = samples[int(b * seg):int((b + 1) * seg)] or [0.0]
        vals.append(max(abs(v) for v in chunk))
    top = max(vals) or 1.0
    return [int(round(100 * (v / top) ** 0.8)) for v in vals]


def write_png(path, size, c1, c2, phase):
    raw = bytearray()
    for y in range(size):
        raw.append(0)
        for x in range(size):
            g = (x + y) / (2 * size)
            ripple = 0.08 * math.sin((x * 0.09) + phase) * math.cos((y * 0.07) - phase)
            k = min(1.0, max(0.0, g + ripple))
            raw.extend(int(c1[i] + (c2[i] - c1[i]) * k) for i in range(3))

    def chunk(tag, data):
        body = struct.pack(">I", len(data)) + tag + data
        return body + struct.pack(">I", zlib.crc32(tag + data) & 0xFFFFFFFF)

    png = (b"\x89PNG\r\n\x1a\n"
           + chunk(b"IHDR", struct.pack(">IIBBBBB", size, size, 8, 2, 0, 0, 0))
           + chunk(b"IDAT", zlib.compress(bytes(raw), 9))
           + chunk(b"IEND", b""))
    with open(path, "wb") as f:
        f.write(png)


MINOR = [57, 60, 62, 64, 67, 69, 72, 74]
LOW = [45, 48, 50, 52, 55, 57, 60, 62]
DREAM = [60, 62, 64, 67, 69, 72, 74, 76]

TRACKS = [
    ("sets-2025/summer-set.wav", "Summer Set", lambda: synth(MINOR, [0, 2, 4, 5, 4, 2, 6, 3], 0.25, 28, 3), "sets-2025/summer-set.png"),
    ("sets-2025/night-drive.wav", "Night Drive", lambda: synth(LOW, [0, 4, 2, 5, 1, 4, 3, 6], 0.35, 32, 2), None),
    ("sets-2025/deep-focus.wav", "Deep Focus", lambda: synth(DREAM, [0, 3, 5, 2, 4, 1, 6, 3], 0.45, 30, 4), None),
    ("demos/demo-one.wav", "Demo One", lambda: synth(MINOR, [0, 1, 2, 3, 4, 5, 6, 7], 0.3, 18, 2, ramp=False), "demos/demo-one.png"),
    ("demos/demo-two.wav", "Demo Two", lambda: synth(DREAM, [7, 5, 3, 1, 2, 4, 6, 0], 0.3, 16, 3, ramp=False), None),
    ("demos/phone-ring.wav", "Phone Ring", lambda: phone_ring(12), None),
]

COVERS = {
    "sets-2025/summer-set.png": ((255, 85, 0), (90, 20, 120), 0.0),
    "demos/demo-one.png": ((20, 120, 200), (10, 20, 60), 1.6),
}


def main():
    entries = []
    for rel, title, make, cover in TRACKS:
        path = os.path.join(OUT, *rel.split("/"))
        os.makedirs(os.path.dirname(path), exist_ok=True)
        samples = make()
        write_wav(path, samples)
        entry = {
            "id": rel,
            "title": title,
            "folder": os.path.dirname(rel),
            "duration": round(len(samples) / SR, 2),
            "peaks": peaks(samples),
        }
        if cover:
            entry["cover"] = cover
        entries.append(entry)
        print("wrote", rel)
    for rel, (c1, c2, ph) in COVERS.items():
        write_png(os.path.join(OUT, *rel.split("/")), 240, c1, c2, ph)
        print("wrote", rel)
    with open(os.path.join(OUT, "tracks.json"), "w", encoding="utf-8") as f:
        json.dump({"tracks": entries}, f, ensure_ascii=False, separators=(",", ":"))
    print("wrote tracks.json")


if __name__ == "__main__":
    main()
