---
# Enable Liquid
---

// Simple Modernizr - Detect Javascript
document.documentElement.className = document.documentElement.className.replace(/\bno-js\b/, 'js');

// Trigger CSS animation
if ('addEventListener' in window) {
  window.addEventListener('load', function() {
    document.body.className = document.body.className.replace(/\bis-loading\b/, '');
  });
}

// Apparently IE <= 9 has console undefined until dev tools are opened.
if (typeof console != 'undefined') {
  console.clear();
  console.log("%cHi there! You can contact me at %c{{ site.email }}.", "color: #3D3D3D; font-size: 14px;", "color: #3D3D3D; font-size: 14px; font-weight: bold;");
}