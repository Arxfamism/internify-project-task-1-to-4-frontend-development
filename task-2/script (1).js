document.addEventListener("DOMContentLoaded", function () {
  const billingToggle = document.getElementById("billingToggle");
  const filterButtons = document.querySelectorAll(".filter");
  const planCards = document.querySelectorAll(".plan-card");
  const chooseButtons = document.querySelectorAll(".choose-btn");
  const message = document.getElementById("message");
  const emptyMessage = document.getElementById("emptyMessage");

  let yearly = false;
  let currentFilter = "all";

  function updatePrices() {
    document.querySelectorAll(".amount").forEach(function (amount) {
      const value = yearly ? amount.dataset.yearly : amount.dataset.monthly;
      amount.textContent = yearly ? Math.round(Number(value) / 12) : value;
    });

    document.querySelectorAll(".period").forEach(function (period) {
      period.textContent = yearly ? "/month, billed yearly" : "/month";
    });
  }

  function filterPlans(category) {
    currentFilter = category;
    let visibleCount = 0;

    planCards.forEach(function (card) {
      const matches = category === "all" || card.dataset.category === category;
      card.style.display = matches ? "flex" : "none";
      if (matches) visibleCount++;
    });

    emptyMessage.hidden = visibleCount !== 0;
  }

  billingToggle.addEventListener("click", function () {
    yearly = !yearly;
    billingToggle.setAttribute("aria-pressed", String(yearly));
    updatePrices();
    showMessage(yearly ? "Yearly billing selected — you save 20%." : "Monthly billing selected.");
  });

  filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      filterButtons.forEach(function (item) {
        item.classList.remove("active");
      });

      button.classList.add("active");
      filterPlans(button.dataset.filter);
      showMessage("Showing " + button.textContent + " plans.");
    });
  });

  chooseButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const plan = button.dataset.plan;
      const period = yearly ? "yearly" : "monthly";
      showMessage("You selected the " + plan + " plan with " + period + " billing.");
    });
  });

  function showMessage(text) {
    message.textContent = text;
    message.classList.remove("show");
    void message.offsetWidth;
    message.classList.add("show");
  }

  updatePrices();
  filterPlans(currentFilter);
});
