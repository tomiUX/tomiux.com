/* TomiUX — drawer analytics
 * Sends a GA event whenever a Mini Audit or Hands-On panel is shown inside a drawer.
 * Catches the opening click AND the prev/next arrows, so every report viewed is counted.
 * Safe to load on any page: it does nothing if the drawers or gtag aren't present.
 */
(function () {
  if (typeof window.gtag !== 'function') return;

  function nameFor(id) {
    var tile = document.querySelector('[data-ec="' + id + '"], [data-ho="' + id + '"]');
    var label = tile && tile.querySelector('.specimen-name');
    return (label && label.textContent.trim()) || id;
  }

  function watch(attr, eventName) {
    var panels = document.querySelectorAll('[' + attr + ']');
    if (!panels.length) return;

    Array.prototype.forEach.call(panels, function (panel) {
      var wasVisible = !panel.hidden;

      new MutationObserver(function () {
        var isVisible = !panel.hidden;
        if (isVisible && !wasVisible) {
          var id = panel.getAttribute(attr);
          gtag('event', eventName, {
            drawer_item: nameFor(id),
            drawer_item_id: id
          });
        }
        wasVisible = isVisible;
      }).observe(panel, { attributes: true, attributeFilter: ['hidden'] });
    });
  }

  watch('data-ec-panel', 'mini_audit_view');
  watch('data-ho-panel', 'hands_on_view');
})();
