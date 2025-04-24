// Call the Go backend and update response
function fetchBackendData() {
  fetch("/api/hello")
    .then(res => res.json())
    .then(data => {
      document.getElementById("response").innerText = data.message;
    });
}

// Basic animation
document.getElementById("animateBtn").addEventListener("click", () => {
  // Animate the box
  anime({
    targets: "#box",
    translateX: 250,
    rotate: "1turn",
    backgroundColor: "#00F2E7",
    duration: 1000,
    easing: "easeInOutQuad",
    direction: "alternate",
    complete: fetchBackendData
  });
});

// Animation sequence
document.getElementById("sequenceBtn").addEventListener("click", () => {
  // Reset position first
  anime({
    targets: "#box",
    translateX: 0,
    duration: 0
  });
  
  // Create sequence
  anime({
    targets: "#box",
    keyframes: [
      {translateY: -50, backgroundColor: "#ffbe0b", scale: 1.2},
      {translateX: 120, backgroundColor: "#fb5607"},
      {translateY: 50, backgroundColor: "#ff006e", borderRadius: "50%"},
      {translateX: 0, backgroundColor: "#8338ec", scale: 1},
      {translateY: 0, backgroundColor: "#3a86ff", borderRadius: "8px"}
    ],
    duration: 4000,
    easing: "easeOutElastic(1, .8)",
    complete: fetchBackendData
  });
});

// Staggered animation
document.getElementById("staggerBtn").addEventListener("click", () => {
  anime({
    targets: ".circle",
    scale: [
      {value: 1.5, duration: 500, easing: "easeOutSine"},
      {value: 1, duration: 500, easing: "easeInOutQuad"}
    ],
    translateY: [
      {value: -30, duration: 500, easing: "easeOutSine"},
      {value: 0, duration: 500, easing: "easeInOutQuad"}
    ],
    opacity: [
      {value: 0.6, duration: 500},
      {value: 1, duration: 500}
    ],
    delay: anime.stagger(200),
    complete: fetchBackendData
  });
});

// Timeline animation
document.getElementById("timelineBtn").addEventListener("click", () => {
  const timeline = anime.timeline({
    easing: "easeOutExpo",
    duration: 750,
    complete: fetchBackendData
  });
  
  // Add animations to the timeline
  timeline
    .add({
      targets: "#box",
      translateX: 250,
      backgroundColor: "#ff7eb9",
      borderRadius: ["8px", "50%"]
    })
    .add({
      targets: ".circle",
      translateX: 250,
      backgroundColor: "#7eb0ff",
      delay: anime.stagger(100)
    })
    .add({
      targets: [".circle", "#box"],
      translateX: 0,
      translateY: 30,
      scale: 1.2,
      duration: 1000
    })
    .add({
      targets: [".circle", "#box"],
      translateY: 0,
      scale: 1,
      delay: anime.stagger(100, {from: "last"})
    });
}); 