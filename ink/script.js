window.onload = function () {
  const cfg = window.clutterConfig;
  
  if (!cfg || !cfg.siteId) return;

  const data = {
    visitor_user_agent: navigator.userAgent,
    site_id: cfg.siteId,
    referrer: document.referrer,
    page: window.location.pathname,
  };

  fetch(cfg.devMode ? "http://localhost:6787/api/event" : "https://paper.phy0.in/api/event", {
    method: 'post',
    body: JSON.stringify(data)
  })
}
