/* Position organic button close control to match SVG heading text
   - Finds .organic-button-wrapper instances and positions .organic-button-close
   - Dispatches `organic-button:close` event and hides wrapper on close
*/
(function () {
  function debounce(fn, wait = 100) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), wait);
    };
  }

  function positionOne(wrapper) {
    try {
      const svg = wrapper.querySelector('svg');
      const text = svg?.querySelector('.organic-button-heading-svg');
      const btn = wrapper.querySelector('.organic-button-close');
      if (!svg || !text || !btn) return;

      // get screen coordinates
      const textRect = text.getBoundingClientRect();
      const wrapperRect = wrapper.getBoundingClientRect();
      const btnRect = btn.getBoundingClientRect();
      const gap = 8; // px gap between text and button

      // place button just to the right of text's right edge (clamped inside wrapper)
      let left = textRect.right - wrapperRect.left + gap;
      left = Math.max(0, Math.min(left, wrapperRect.width - btnRect.width));
      const top = textRect.top - wrapperRect.top + textRect.height / 2 - btnRect.height / 2;

      // apply inline styles (overrides Tailwind positioning classes if present)
      btn.style.position = 'absolute';
      btn.style.left = `${left}px`;
      btn.style.top = `${top}px`;
      btn.style.right = 'auto';
      btn.style.transform = 'none';
      btn.style.opacity = '1';

      // expose a data attribute with computed position for debugging
      btn.setAttribute('data-position-left', Math.round(left));
      btn.setAttribute('data-position-top', Math.round(top));
    } catch (e) {
      // ignore positioning errors
      console.error('organic-button position error', e);
    }
  }

  function positionAll() {
    document.querySelectorAll('.organic-button-wrapper').forEach(positionOne);
  }

  const debouncedAll = debounce(positionAll, 120);

  // initial and responsive hooks
  window.addEventListener('load', () => {
    positionAll();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(positionAll);
  });
  window.addEventListener('resize', debouncedAll);

  // watch for DOM changes that might affect layout
  const mo = new MutationObserver(debouncedAll);
  mo.observe(document.body, { childList: true, subtree: true });

  // Close button behavior: dispatch event and hide wrapper
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.organic-button-close');
    if (!btn) return;
    const wrapper = btn.closest('.organic-button-wrapper');
    const ev = new CustomEvent('organic-button:close', { bubbles: true, detail: { button: btn, wrapper } });
    wrapper?.dispatchEvent(ev);
    // default behavior: hide the wrapper visually
    if (wrapper) wrapper.style.display = 'none';
  });
})();
