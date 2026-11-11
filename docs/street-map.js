(() => {
  const container = document.querySelector('[data-street-map]');
  const status = document.querySelector('[data-street-map-status]');
  if (!container || !status) return;

  const root = document.documentElement;
  const center = [5.4474, 43.5297];
  const styleUrl = () => root.dataset.theme === 'dark'
    ? 'https://tiles.openfreemap.org/styles/dark'
    : 'https://tiles.openfreemap.org/styles/positron';

  const start = () => {
    let map;
    let activeStyle = styleUrl();
    const showFallback = () => {
      map?.remove();
      status.textContent = 'Le plan est indisponible. Vous pouvez ouvrir le lieu dans OpenStreetMap.';
    };

    status.textContent = 'Chargement du plan…';
    try {
      map = new window.maplibregl.Map({
        container,
        style: activeStyle,
        center,
        zoom: 14.8,
        minZoom: 10,
        maxZoom: 19,
        attributionControl: false,
        cooperativeGestures: true,
        dragRotate: false,
        pitchWithRotate: false,
        touchPitch: false,
        locale: {
          'Map.Title': 'Plan du centre-ville d’Aix-en-Provence',
          'NavigationControl.ZoomIn': 'Zoom avant',
          'NavigationControl.ZoomOut': 'Zoom arrière',
          'CooperativeGesturesHandler.WindowsHelpText': 'Utilisez Ctrl et la molette pour zoomer',
          'CooperativeGesturesHandler.MacHelpText': 'Utilisez ⌘ et la molette pour zoomer',
          'CooperativeGesturesHandler.MobileHelpText': 'Déplacez la carte avec deux doigts',
        },
      });
    } catch {
      showFallback();
      return;
    }

    map.touchZoomRotate.disableRotation();
    const timeout = window.setTimeout(showFallback, 12000);
    map.once('load', () => {
      window.clearTimeout(timeout);
      const pin = document.createElement('span');
      pin.className = 'street-map-pin';
      new window.maplibregl.Marker({ element: pin, anchor: 'bottom' })
        .setLngLat(center)
        .addTo(map);
      pin.setAttribute('aria-hidden', 'true');
      map.addControl(new window.maplibregl.NavigationControl({ showCompass: false }), 'top-right');
      status.textContent = '';
      status.hidden = true;
      const applyTheme = () => {
        const nextStyle = styleUrl();
        if (activeStyle === nextStyle) return;
        activeStyle = nextStyle;
        map.setStyle(nextStyle);
      };
      new MutationObserver(applyTheme)
        .observe(root, { attributes: true, attributeFilter: ['data-theme'] });
      applyTheme();
    });
  };

  status.textContent = 'Le plan se charge à l’approche de cette section.';
  if (!('IntersectionObserver' in window)) {
    start();
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    if (!entries.some((entry) => entry.isIntersecting)) return;
    observer.disconnect();
    start();
  }, { rootMargin: '200px' });
  observer.observe(container);
})();
