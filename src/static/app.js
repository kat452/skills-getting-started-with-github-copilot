document.addEventListener("DOMContentLoaded", () => {
  const activitiesList = document.getElementById("activities-list");
  const activitySelect = document.getElementById("activity");
  const signupForm = document.getElementById("signup-form");
  const messageDiv = document.getElementById("message");
  const nightModeToggle = document.getElementById("night-mode-toggle");

  // Fetch activities from the API
  fetch("/activities")
    .then((response) => response.json())
    .then((activities) => {
      activitiesList.innerHTML = ""; // Clear loading message
      activitySelect.innerHTML = '<option value="">-- Select an activity --</option>'; // Reset dropdown

      for (const [name, details] of Object.entries(activities)) {
        // Create activity card
        const card = document.createElement("div");
        card.className = "activity-card";

        // Add activity details
        card.innerHTML = `
          <h4>${name}</h4>
          <p><strong>Description:</strong> ${details.description}</p>
          <p><strong>Schedule:</strong> ${details.schedule}</p>
          <p><strong>Max Participants:</strong> ${details.max_participants}</p>
          <p><strong>Participants:</strong></p>
          <ul class="participants-list">
            ${details.participants.map((participant) => `<li>${participant}</li>`).join("")}
          </ul>
        `;

        // Append card to activities list
        activitiesList.appendChild(card);

        // Add activity to dropdown
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        activitySelect.appendChild(option);
      }
    })
    .catch((error) => {
      console.error("Error fetching activities:", error);
      activitiesList.innerHTML = "<p>Failed to load activities. Please try again later.</p>";
    });

  // Handle form submission
  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const activity = document.getElementById("activity").value;

    try {
      const response = await fetch(
        `/activities/${encodeURIComponent(activity)}/signup?email=${encodeURIComponent(email)}`,
        {
          method: "POST",
        }
      );

      const result = await response.json();

      if (response.ok) {
        messageDiv.textContent = result.message;
        messageDiv.className = "success";
        signupForm.reset();
      } else {
        messageDiv.textContent = result.detail || "An error occurred";
        messageDiv.className = "error";
      }

      messageDiv.classList.remove("hidden");

      // Hide message after 5 seconds
      setTimeout(() => {
        messageDiv.classList.add("hidden");
      }, 5000);
    } catch (error) {
      messageDiv.textContent = "Failed to sign up. Please try again.";
      messageDiv.className = "error";
      messageDiv.classList.remove("hidden");
      console.error("Error signing up:", error);
    }
  });

  // Toggle night mode
  nightModeToggle.addEventListener("click", () => {
    document.body.classList.toggle("night-mode");
    document.querySelector("header").classList.toggle("night-mode");
    document.querySelectorAll("section").forEach((section) => {
      section.classList.toggle("night-mode");
    });
    document.querySelectorAll(".activity-card").forEach((card) => {
      card.classList.toggle("night-mode");
    });

    // Update button text
    nightModeToggle.textContent =
      nightModeToggle.textContent === "Night Mode" ? "Day Mode" : "Night Mode";
  });

  // Initialize app
  fetchActivities();
});
