function track() {
  console.log("tracking");
  let data = {
    location: window.location.href,
    referer: document.referrer,
    screen_width: window.screen.width
  };
  fetch("https://analytics.routley.io/track", {
    method: "POST",
    body: JSON.stringify(data)
  });
}

track();
