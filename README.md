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

The main page shows the active window, selected-target entry and exit times, and a quick enable/disable switch. The session-chart legend is interactive: click Cloud, Target, Moon, Gusts, Minimum Altitude or Available Window to hide or restore that layer.

Each target detail includes an astronomical survey image and the exact active-rig sensor field of view. Drag the cyan sensor frame, rotate it with the position-angle control, switch between visible-light and infrared surveys, and save a separate composition for each target and rig profile.

To add an observing site visually, open **Sites → Choose exact point on map**. Search for an area, tap anywhere on the map, drag the marker for precision, or centre on phone GPS. Name the point, optionally add Bortle/SQM, and save it as the active site. Map tiles use OpenStreetMap.

Every saved site owns its own sky-window calibration and modeled/measured light-pollution fields. Use **LP estimate** to open that coordinate on LightPollutionMap.app, then store the displayed decimal Bortle and SQM through **Edit / map**. AstroWindow applies a filter-aware light-pollution penalty: broadband galaxies, reflection nebulae and dark nebulae are affected more strongly than Ha/OIII or SII/OIII imaging.

The minimum target altitude is a global scoring limit under **Rig → Scoring Limits** and is drawn as the red dashed line on the main session chart.
