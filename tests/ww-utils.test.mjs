import assert from "node:assert/strict";
import test from "node:test";
import { extractYouTubeId, formatTimecode, googleDriveDownloadUrl, isAcceptedMedia } from "../lib/ww.ts";

test("formats editorial timecodes", () => {
  assert.equal(formatTimecode(65.9), "01:05");
  assert.equal(formatTimecode(3661), "01:01:01");
});

test("recognizes supported public media links", () => {
  assert.equal(extractYouTubeId("https://youtu.be/abc123"), "abc123");
  assert.equal(extractYouTubeId("https://www.youtube.com/watch?v=abc123"), "abc123");
  assert.match(googleDriveDownloadUrl("https://drive.google.com/file/d/file123/view"), /id=file123/);
});

test("enforces the real upload contract", () => {
  assert.equal(isAcceptedMedia({ name: "bloco.mpeg", type: "video/mpeg", size: 1024 }), true);
  assert.equal(isAcceptedMedia({ name: "bloco.txt", type: "text/plain", size: 1024 }), false);
  assert.equal(isAcceptedMedia({ name: "bloco.mp3", type: "audio/mpeg", size: 25 * 1024 * 1024 }), false);
});
