# ToDo-List

A small, web-based To-Do List app built with plain HTML, CSS, and JavaScript.

**Files:**
- [index.html](index.html) — main page and UI
- [toDo.css](toDo.css) — styles and neon-themed palette variations
- [toDoList.js](toDoList.js) — app logic for adding, completing, and deleting tasks

**Features**
- Add and remove tasks
- Mark tasks completed (visual strike-through)
- Simple counter for tasks and completed items
- Lightweight, dependency-free frontend (works locally)

**Preview**
Open [index.html](index.html) in your browser to view the app.

**Installation / Run Locally**
1. Clone or download the repository.
2. Open `index.html` in your browser (double-click or use `file://` path).

No build step or server is required.

**Usage**
- Type a task into the input field and click "Add Task".
- Use the delete button next to a task to remove it.
- Completed tasks receive a `completed` class and will show as struck-through.

**Development Notes**
- The UI uses a custom font linked in `index.html` and is styled in `toDo.css`.
- If you change colors or effects, update `toDo.css`.
- JavaScript logic is in `toDoList.js`. Functions are small and easy to modify.

**Styling / Palette**
This project includes a neon palette and glow effects. Color variables are not in CSS variables; change the hex values in `toDo.css` to adjust the theme.

**Contributing**
Small fixes and improvements are welcome. Open an issue or submit a PR with a short description of your changes.

**License**
Use or modify freely for learning and small projects. No license file included.

---

If you'd like, I can:
- Add a short Quick Start section with a local live-server command
- Convert the color values into CSS variables for easier theming
- Add a license file (MIT)
