# 3D Solar System Simulation (Frontend Assignment)

This is a fully interactive 3D simulation of the Solar System built using HTML, CSS, JavaScript, and Three.js. It was created as part of a frontend developer assignment to demonstrate skills in 3D rendering, real-time animation, responsive UI, and user interaction — without using any CSS animations.

---

## Project Features

1. Sun placed at the center of the solar system
2. All 8 planets orbit around the Sun with individual speeds
3. Each planet is mapped with a realistic texture
4. Saturn and Uranus include 3D ring geometry
5. Fully functional control panel for interacting with the simulation
6. Real-time speed control sliders for each planet
7. Pause and Resume animation toggle
8. Light and Dark theme toggle button
9. Reset button to restore all planetary speeds to default
10. Minimize and Maximize control panel toggle for mobile-friendly view
11. Hover tooltip shows the name of each planet
12. Click to highlight any planet
13. Background filled with thousands of randomly generated stars
14. Smooth camera orbit control using mouse or touch

---

## File Structure

- index.html        → Main HTML structure and control panel
- style.css         → Styling for layout, mobile responsiveness, and theming
- main.js           → All logic, 3D rendering, animation, interaction
- textures/         → HD images of the planets, sun, and rings

---

## How It Works

- The simulation uses Three.js to render a 3D scene.
- The Sun is a large glowing sphere placed in the center.
- Each planet is created with a unique size, orbit radius, and texture.
- Planets orbit the sun by rotating their parent Object3D group.
- The animation loop is powered by requestAnimationFrame and THREE.Clock.
- UI sliders directly update each planet’s orbital speed in real time.
- The toggle panel lets users collapse the entire control UI to view the full system on small screens.

---

## How to Run

1. Clone the repository:
   git clone https://github.com/Sarandeveloper06/3D-Solar-System.git

2. Open the project folder in VS Code or any code editor.

3. Make sure your browser supports modules (Chrome, Edge, Firefox).

4. Right-click on `index.html` and open it in a live server OR run:
   python -m http.server
   Then open http://localhost:8000

---

## Deployment

This project is live and accessible via GitHub Pages:

https://sarandeveloper06.github.io/3D-Solar-System/

---

## Credits

- Textures collected from free-to-use HD space assets
- Built fully by Saran S using readable code
- No CSS animations were used — all movement is JavaScript-driven

---

## License

This is an academic/portfolio project. Feel free to fork, learn, and build on it.



