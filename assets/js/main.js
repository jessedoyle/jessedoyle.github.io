---
# Enable Liquid
---

document.documentElement.className = document.documentElement.className.replace(/\bno-js\b/, 'js');

if (typeof(window.addEventListener) === 'function') {
  window.addEventListener('load', function() {
    requestAnimationFrame(function() { document.body.className = document.body.className.replace(/\bis-loading\b/, '') });
  });
}

if (typeof console != 'undefined') {
  console.clear();
  console.log('%cHi there! You can contact me at %c{{ site.email }}.', 'color: #3D3D3D; font-size: 14px;', 'color: #3D3D3D; font-size: 14px; font-weight: bold;');
}
