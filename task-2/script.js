const monthlyBtn =
    document.getElementById("monthlyBtn");

const yearlyBtn =
    document.getElementById("yearlyBtn");

const amounts =
    document.querySelectorAll(".amount");

const filters =
    document.querySelectorAll(".filter");

const cards =
    document.querySelectorAll(".card");

const toast =
    document.getElementById("toast");


// Monthly / Yearly

function changePlan(type) {

    amounts.forEach(amount => {

        amount.textContent =
            amount.dataset[type];

    });

    monthlyBtn.classList.toggle(
        "active",
        type === "monthly"
    );

    yearlyBtn.classList.toggle(
        "active",
        type === "yearly"
    );
}


monthlyBtn.addEventListener(
    "click",
    () => changePlan("monthly")
);


yearlyBtn.addEventListener(
    "click",
    () => changePlan("yearly")
);


// Filters

filters.forEach(filter => {

    filter.addEventListener(
        "click",
        () => {

            filters.forEach(btn =>
                btn.classList.remove("active")
            );

            filter.classList.add("active");

            const category =
                filter.dataset.filter;


            cards.forEach(card => {

                if (
                    category === "all" ||
                    card.dataset.category === category
                ) {

                    card.style.display = "block";

                } else {

                    card.style.display = "none";

                }

            });

        }
    );

});


// Choose Plan Buttons

const chooseButtons =
    document.querySelectorAll(".choose");

chooseButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            const plan =
                button
                .closest(".card")
                .querySelector("h2")
                .textContent;

            toast.textContent =
                plan + " plan selected!";

            toast.classList.add("show");


            setTimeout(() => {

                toast.classList.remove("show");

            }, 2000);

        }
    );

});
