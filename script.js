"use strict";

document.addEventListener("DOMContentLoaded", function () {
    const SUPABASE_URL =
        "https://hhjfukdarhrmxdurqzeo.supabase.co";

    const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_xGel2wLMMQqG8kJTIl-wTA_YZfoBOws";

    // Update the copyright year.
    const yearElement = document.getElementById("currentYear");

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // Mobile navigation.
    const menuButton = document.getElementById("menuButton");
    const navigation = document.getElementById("navigation");

    if (menuButton && navigation) {
        menuButton.addEventListener("click", function () {
            const isOpen = navigation.classList.toggle("open");

            menuButton.setAttribute(
                "aria-expanded",
                String(isOpen)
            );
        });

        navigation.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", function () {
                navigation.classList.remove("open");

                menuButton.setAttribute(
                    "aria-expanded",
                    "false"
                );
            });
        });
    }

    // Admissions form.
    const admissionForm = document.getElementById("admissionForm");
    const admissionMessage =
        document.getElementById("admissionMessage");

    if (admissionForm && admissionMessage) {
        admissionForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            if (
                !SUPABASE_PUBLISHABLE_KEY ||
                SUPABASE_PUBLISHABLE_KEY ===
                    "PASTE_YOUR_PUBLISHABLE_KEY_HERE"
            ) {
                admissionMessage.textContent =
                    "The database connection is not configured yet.";
                return;
            }

            const submitButton =
                admissionForm.querySelector('button[type="submit"]');

            const originalButtonText = submitButton
                ? submitButton.textContent
                : "";

            admissionMessage.textContent =
                "Submitting your application. Please wait.";

            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = "Submitting...";
            }

            const application = {
                full_name: document
                    .getElementById("applicantName").value.trim(),

                email: document
                    .getElementById("applicantEmail").value.trim(),

                class_applying_for: document
                    .getElementById("classApplying").value,

                guardian_name: document
                    .getElementById("guardianName").value.trim(),

                phone: document
                    .getElementById("guardianPhone").value.trim(),

                application_status: "pending"
            };

            try {
                const response = await fetch(
                    SUPABASE_URL +
                    "/rest/v1/admission_applications",
                    {
                        method: "POST",

                        headers: {
                            "apikey": SUPABASE_PUBLISHABLE_KEY,
                            "Authorization":
                                "Bearer " + SUPABASE_PUBLISHABLE_KEY,
                            "Content-Type": "application/json",
                    "Content-Profile": "public",        "Prefer": "return=minimal"
                        },

                        body: JSON.stringify(application)
                    }
                );

                if (!response.ok) {
    const details = await response.text();

    console.error(
        "Admission submission failed:",
        response.status,
        details
    );

    admissionMessage.textContent =
        "Submission failed (HTTP " +
        response.status +
        "): " +
        details.slice(0, 250);

    return;
}

                admissionMessage.textContent =
                    "Application submitted successfully! " +
                    "Please contact the school for follow-up.";

                admissionForm.reset();

            } catch (error) {
                admissionMessage.textContent =
                    "We could not submit your application. " +
                    "Please check your internet connection and try again. " +
                    "If the problem continues, contact the school.";

                console.error("Admission submission error:", error);

            } finally {
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent = originalButtonText;
                }
            }
        });
    }

    // Result checker remains disabled until securely configured.
    const resultForm = document.getElementById("resultForm");
    const resultMessage = document.getElementById("resultMessage");

    if (resultForm && resultMessage) {
        resultForm.addEventListener("submit", function (event) {
            event.preventDefault();

            resultMessage.textContent =
                "Result checking is not enabled yet. " +
                "No PIN has been verified.";
        });
    }

    // School portals remain disabled until authentication is configured.
    const portalMessage = document.getElementById("portalMessage");

    document.querySelectorAll(".portal-button").forEach(function (button) {
        button.addEventListener("click", function () {
            if (portalMessage) {
                portalMessage.textContent =
                    button.dataset.portal +
                    " login is not enabled yet. " +
                    "Secure authentication must be configured first.";
            }
        });
    });
});