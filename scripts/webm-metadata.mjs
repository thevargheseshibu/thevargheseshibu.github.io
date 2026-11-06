/**
 * Add Duration to the index-free WebM header produced by Chromium MediaRecorder.
 * Source: https://www.matroska.org/technical/elements.html (Info / TimestampScale / Duration).
 * The guardrails deliberately reject other layouts rather than shifting indexed offsets.
 */
export function withWebmDuration(input, durationMs) {
  const bytes = Buffer.from(input);
  const segment = bytes.indexOf(Buffer.from("18538067", "hex"));
  if (
    segment < 0 ||
    segment > 100 ||
    !bytes.subarray(segment + 4, segment + 12).equals(Buffer.from("01ffffffffffffff", "hex"))
  ) {
    throw new Error("Expected an unknown-size, index-free MediaRecorder Segment");
  }
  const info = segment + 12;
  if (
    !bytes.subarray(info, info + 4).equals(Buffer.from("1549a966", "hex")) ||
    !(bytes[info + 4] & 0x80) ||
    bytes[info + 4] === 0xff
  ) {
    throw new Error("Expected a compact Info element at the start of the Segment");
  }
  const size = bytes[info + 4] & 0x7f;
  const payload = bytes.subarray(info + 5, info + 5 + size);
  const timestampScale = payload.indexOf(Buffer.from("2ad7b183", "hex"));
  if (timestampScale < 0 || payload.readUIntBE(timestampScale + 4, 3) !== 1000000) {
    throw new Error("Expected millisecond Segment ticks");
  }
  const existing = payload.indexOf(Buffer.from("448988", "hex"));
  if (existing >= 0) {
    bytes.writeDoubleBE(durationMs, info + 5 + existing + 3);
    return bytes;
  }
  const duration = Buffer.alloc(11);
  duration[0] = 0x44;
  duration[1] = 0x89;
  duration[2] = 0x88;
  duration.writeDoubleBE(durationMs, 3);
  if (size + duration.length >= 127) throw new Error("Info header exceeds compact-size limit");
  const prefix = Buffer.from(bytes.subarray(0, info + 5));
  prefix[info + 4] = 0x80 | (size + duration.length);
  return Buffer.concat([prefix, payload, duration, bytes.subarray(info + 5 + size)]);
}
