"use strict";

// History contains field names and guidance only, never contact details.
const form_errors = [];
const form = document.querySelector("#contact-form");
const fields = [...form.querySelectorAll("[required]")];
const comments = form.elements.comments;
const errorArea = document.querySelector("#form-error-list");
const information = document.querySelector("#form-info");
const historyField = form.elements["form-errors"];
const edited = new Set();
const revealed = new Set();
let attempted = false;

function validate(field) {
    field.setCustomValidity("");
    const label = field.dataset.label;
    let message = "";
    if (field.validity.valueMissing) {
        message = `${label}: please enter ${label === "Email" ? "your email address" : label === "Name" ? "your name" : "a message"}.`;
    } else if (field.validity.typeMismatch) {
        message = "Email: enter an address such as student@example.com.";
    } else if (field.minLength > 0 && field.value.length < field.minLength) {
        message = `${label}: enter at least ${field.minLength} characters (currently ${field.value.length}).`;
    } else if (field.validity.tooLong || (field.maxLength > 0 && field.value.length > field.maxLength)) {
        message = `${label}: use no more than ${field.maxLength} characters.`;
    }
    field.setCustomValidity(message);
    return message;
}

function renderErrors() {
    errorArea.replaceChildren();
    for (const field of fields) {
        const visible = attempted || revealed.has(field);
        const message = visible ? field.validationMessage : "";
        document.querySelector(`#${field.id}-error`).textContent = message;
        if (visible) field.setAttribute("aria-invalid", String(!field.validity.valid));
        if (message) {
            const item = document.createElement("li");
            item.textContent = message;
            errorArea.append(item);
        }
    }
    document.querySelector("#error-heading").textContent = errorArea.children.length
        ? "Please correct the following fields:" : "No errors to show.";
}

function updateCount() {
    const remaining = comments.maxLength - comments.value.length;
    information.classList.toggle("length-warning", remaining <= 100);
    information.textContent = remaining === 0
        ? "0 characters remaining. You have reached the limit; delete text to make room."
        : `${remaining.toLocaleString("en-US")} characters remaining.${remaining <= 100 ? " You are near the message limit." : ""}`;
}

for (const field of fields) {
    field.addEventListener("input", () => {
        edited.add(field);
        validate(field);
        renderErrors();
        if (field === comments) updateCount();
    });
    field.addEventListener("blur", () => {
        if (edited.has(field)) {
            revealed.add(field);
            validate(field);
            renderErrors();
        }
    });
}

// Disable automatic validation only after enhancements are initialized.
// Every button/Enter submission now reaches this single attempt handler.
form.addEventListener("submit", (event) => {
    attempted = true;
    const invalidFields = [];
    for (const field of fields) {
        const message = validate(field);
        if (!field.validity.valid) {
            invalidFields.push(field);
            form_errors.push({ field: field.name, message });
        }
    }
    renderErrors();
    if (invalidFields.length) {
        event.preventDefault();
        invalidFields[0].focus();
        form.reportValidity();
    } else {
        historyField.value = JSON.stringify(form_errors);
        // Allow the normal browser POST, including the complete error history.
    }
});
updateCount();
document.querySelectorAll("[data-js-only]").forEach((element) => { element.hidden = false; });
form.noValidate = true;
