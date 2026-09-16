/* =========================
   HAMBURGER MENU
========================= */

const menuBtn =
    document.getElementById("menuBtn");

const nav =
    document.getElementById("nav");


if (menuBtn) {

    menuBtn.addEventListener("click", function () {

        nav.classList.toggle("open");

        if (nav.classList.contains("open")) {

            menuBtn.textContent = "✕";

        } else {

            menuBtn.textContent = "☰";

        }

    });

}


/* =========================
   CLOSE MENU AFTER LINK CLICK
========================= */

if (nav) {

    const links =
        nav.querySelectorAll("a");

    links.forEach(function (link) {

        link.addEventListener("click", function () {

            nav.classList.remove("open");

            if (menuBtn) {

                menuBtn.textContent = "☰";

            }

        });

    });

}


/* =========================
   DARK / LIGHT MODE
========================= */

const themeBtn =
    document.getElementById("themeBtn");


const savedTheme =
    localStorage.getItem("internify-theme");


if (savedTheme === "light") {

    document.body.classList.add("light");

}


if (themeBtn) {

    themeBtn.textContent =
        document.body.classList.contains("light")
            ? "☀"
            : "☾";


    themeBtn.addEventListener("click", function () {

        document.body.classList.toggle("light");


        const isLight =
            document.body.classList.contains("light");


        localStorage.setItem(
            "internify-theme",
            isLight ? "light" : "dark"
        );


        themeBtn.textContent =
            isLight ? "☀" : "☾";

    });

}


/* =========================
   CONTACT FORM VALIDATION
========================= */

const form =
    document.getElementById("contactForm");


if (form) {

    const name =
        document.getElementById("name");

    const email =
        document.getElementById("email");

    const message =
        document.getElementById("message");


    const nameError =
        document.getElementById("nameError");

    const emailError =
        document.getElementById("emailError");

    const messageError =
        document.getElementById("messageError");


    const success =
        document.getElementById("successMessage");


    form.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            let valid = true;


            /* Clear previous errors */

            nameError.textContent = "";
            emailError.textContent = "";
            messageError.textContent = "";

            success.style.display = "none";


            name.classList.remove("invalid");
            email.classList.remove("invalid");
            message.classList.remove("invalid");


            /* NAME */

            if (name.value.trim().length < 3) {

                nameError.textContent =
                    "Name must be at least 3 characters.";

                name.classList.add("invalid");

                valid = false;

            }


            /* EMAIL */

            const emailPattern =
                /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;


            if (
                !emailPattern.test(
                    email.value.trim()
                )
            ) {

                emailError.textContent =
                    "Please enter a valid email address.";

                email.classList.add("invalid");

                valid = false;

            }


            /* MESSAGE */

            if (
                message.value.trim().length < 20
            ) {

                messageError.textContent =
                    "Message must be at least 20 characters.";

                message.classList.add("invalid");

                valid = false;

            }


            /* SUCCESS */

            if (valid) {

                success.textContent =
                    "✓ Message submitted successfully!";

                success.style.display = "block";

                form.reset();

            }

        }
    );

}
