# AstroWindow

Static, installable astrophotography weather and session planner. No API keys or server are required.

## GitHub Pages

1. Upload everything in this folder to the root of a GitHub repository.
2. Open **Settings → Pages**.
3. Under **Build and deployment**, select **Deploy from a branch**, `main`, `/ (root)`.
4. Open the generated HTTPS address. On mobile, use **Add to Home Screen** to install it.

Do not open `index.html` directly from the file system: location, offline caching, and installation require HTTPS or localhost.

Weather data: Open-Meteo. Astronomy calculations: SunCalc plus local coordinate transforms.

## Measuring an available sky window

Open **Rig → Available Sky Window → Start guided measurement** on your phone. Capture the left and right compass edges, then the bottom and top altitude edges. Enable the window and save it. Target ranking and generated plans will count only times when the target centre is inside the measured opening.

Phone compass accuracy can be degraded near a metal mount, tripod, car or reinforced wall. Calibrate the compass first and measure a few steps away from the rig.

Target cards distinguish the geometric window from weather usability. A target can be inside the measured opening but have zero weather-usable hours. Its rank remains a meaningful best-hours score, and the card explains which condition prevented an hour from reaching the usable threshold.
