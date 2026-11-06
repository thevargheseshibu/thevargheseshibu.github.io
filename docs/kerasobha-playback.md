# Kerasobha playback repair

## Cause

The original 4K real-time browser screen recording contained repeated frozen frames. FFmpeg `freezedetect` detected multiple visible holds of roughly 0.4–1 second in the 1080p derivative. Checking only advancing `currentTime` did not detect those visual freezes.

## Replacement

`scripts/render-kerasobha-smooth.mjs` renders evenly spaced public-website scroll positions offline at a 3840x2160 viewport. Visible source movies are paused and sampled against the output clock. Capture speed does not determine playback frame timing. The packager removes 4.017 seconds of idle frames inherited from the source website, then blends the ending into the actual first recorded frame. The final film is approximately 19.98 seconds at 60 fps. Its freeze scan reports zero holds of 0.4 seconds or longer at the same detection threshold. The replacement retains a continuous forward journey; source films inside the captured website retain their own lower native resolutions.

The new versioned movie URLs prevent cached old recordings from being reused. The player preloads when the section approaches, retains a poster until decoded media is ready, preserves the timestamp and pause choice when switching HD/4K, and uses separate enter/exit visibility thresholds to avoid repeated pause/play at viewport edges. The moving frame settles sooner with a small scrub delay, keeping the controls flat and tappable.

Quality claims refer to output dimensions and delivery frame rate, not the native resolution/frame rate of all embedded source films. The read-only film does not embed a live third-party iframe or add a pinned scroll hold.

Verification includes FFmpeg frame/freeze analysis, changing decoded frames in the browser, rendition dimensions, timestamp continuity during a quality switch, manual pause/resume, offscreen pause/resume, native scrolling through the project, and reduced-motion behavior.

Run `node scripts/render-kerasobha-smooth.mjs` followed by `node scripts/package-kerasobha-film.mjs`, with `FFMPEG_PATH` set. The real-time predecessors are archived outside public assets in ignored artifacts.
