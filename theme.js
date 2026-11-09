"use strict";

const themeControl = document.querySelector("#theme-toggle");
function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    themeControl.textContent = theme === "dark" ? "Switch to light theme" : "Switch to dark theme";
}

let savedTheme = "light";
try {
    const preference = localStorage.getItem("portfolio-theme");
    if (preference === "dark" || preference === "light") savedTheme = preference;
} catch {
    // Storage can be blocked; the theme still works for the current page.
}
applyTheme(savedTheme);
themeControl.hidden = false;
themeControl.addEventListener("click", () => {
    const theme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    const update = () => {
        applyTheme(theme);
        try { localStorage.setItem("portfolio-theme", theme); } catch { /* Keep the applied theme. */ }
    };
    if (document.startViewTransition && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        document.startViewTransition(update);
    } else {
        update();
    }
});
