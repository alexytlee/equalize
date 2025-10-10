// Handle form submission
document.getElementById("notifyForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const emailInput = this.querySelector(".email-input");
  const email = emailInput.value;

  // Validate email
  if (!email || !isValidEmail(email)) {
    showMessage("Please enter a valid email address", "error");
    return;
  }

  // Simulate API call
  // In production, you would send this to your backend
  console.log("Email submitted:", email);

  // Show success message
  showMessage("Thanks! We'll notify you when we launch.", "success");

  // Clear form
  emailInput.value = "";
});

function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function showMessage(message, type) {
  // Remove existing message if any
  const existingMessage = document.querySelector(
    ".success-message, .error-message"
  );
  if (existingMessage) {
    existingMessage.remove();
  }

  // Create new message element
  const messageDiv = document.createElement("div");
  messageDiv.className =
    type === "success" ? "success-message" : "error-message";
  messageDiv.textContent = message;

  // Add to DOM
  const ctaSection = document.querySelector(".cta-section");
  ctaSection.appendChild(messageDiv);

  // Remove after 5 seconds
  setTimeout(() => {
    messageDiv.style.opacity = "0";
    messageDiv.style.transition = "opacity 0.5s ease";
    setTimeout(() => messageDiv.remove(), 500);
  }, 5000);
}

// Add smooth scroll behavior
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// Add parallax effect to floating circles
window.addEventListener("mousemove", (e) => {
  const circles = document.querySelectorAll(".float-circle");
  const x = e.clientX / window.innerWidth;
  const y = e.clientY / window.innerHeight;

  circles.forEach((circle, index) => {
    const speed = (index + 1) * 20;
    circle.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
  });
});
