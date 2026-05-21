document.addEventListener("DOMContentLoaded", () => {

    const splashScreen = document.getElementById("splash-screen");
    const loginScreen = document.getElementById("login-screen");

    const profileGrid = document.getElementById("profile-selection-container");
    const profileGates = document.querySelectorAll(".profile-gate");

    const loginForm = document.getElementById("login-form");

    const formHeadingRole = document.getElementById("form-heading-role");

    const btnBackToProfiles = document.getElementById("btn-back-to-profiles");

    let activeRole = "Consumer";

    // =========================================================
    // SPLASH SCREEN AUTO TRANSITION
    // =========================================================

    setTimeout(() => {

        if (splashScreen) {
            splashScreen.classList.remove("active");
        }

        if (loginScreen) {
            loginScreen.classList.add("active");
        }

    }, 2500);

    // =========================================================
    // PROFILE CARD CLICK ENGINE
    // =========================================================

    profileGates.forEach(gate => {

        gate.addEventListener("click", function () {

            activeRole = this.getAttribute("data-role");

            // CLICKED CARD SCALE
            this.classList.add("selected-animate");

            // OTHER CARD FADE
            profileGates.forEach(otherGate => {

                if (otherGate !== this) {
                    otherGate.classList.add("fade-out-animate");
                }

            });

            // DELAY THEN SHOW LOGIN FORM
            setTimeout(() => {

                profileGrid.classList.add("hidden");

                formHeadingRole.textContent =
                    `Unlock ${activeRole} System Portal`;

                loginForm.classList.remove("hidden");

            }, 2000);

        });

    });

    // =========================================================
    // BACK BUTTON ENGINE
    // =========================================================

    btnBackToProfiles.addEventListener("click", () => {

        loginForm.classList.add("hidden");

        profileGrid.classList.remove("hidden");

        // RESET ANIMATION STATES
        profileGates.forEach(gate => {

            gate.classList.remove(
                "selected-animate",
                "fade-out-animate"
            );

            gate.style.transform = "";

        });

    });

    // =========================================================
    // LOGIN SUBMIT ENGINE
    // =========================================================

    loginForm.addEventListener("submit", (event) => {

        event.preventDefault();

        const fullName =
            document.getElementById("username").value;

        const email =
            document.getElementById("email").value;

        const phone =
            document.getElementById("phone").value;

        const password =
            document.getElementById("password").value;

        // =====================================================
        // COMPLETE USER PROFILE OBJECT
        // =====================================================

        const userProfile = {

            name: fullName,
            email: email,
            phone: phone,
            password: password,
            role: activeRole

        };

        // SAVE SESSION USER
        sessionStorage.setItem(
            "currentLoggedInUser",
            JSON.stringify(userProfile)
        );

        // =====================================================
        // REDIRECT
        // =====================================================

        if (activeRole === "Consumer") {

            window.location.href = "consumer.html";

        } else {

            window.location.href = "producer.html";

        }

    });

});