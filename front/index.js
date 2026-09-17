const formulaire = document.getElementById("formulaire");
const message = document.getElementById("message");
const recapitulatif = document.getElementById("recapitulatif");

formulaire.addEventListener("submit", function(event) {
    event.preventDefault();

    const login = document.getElementById("login").value.trim();
    const password = document.getElementById("password").value;
    const confirmation = document.getElementById("confirmation").value;
    const nom = document.getElementById("nom").value.trim();
    const prenom = document.getElementById("prenom").value.trim();
    const adresse = document.getElementById("adresse").value.trim();
    const email = document.getElementById("email").value.trim();
    const telephone = document.getElementById("telephone").value.trim();
    const date = document.getElementById("dateNaissance").value;

    if (!formulaire.checkValidity()) {
        formulaire.reportValidity();
        return;
    }

    if (login.length < 3) {
        message.textContent = "Le login doit contenir au moins 3 caractères.";
        return;
    }

    if (!/^\d{10}$/.test(telephone)) {
        message.textContent = "Le numéro de téléphone doit contenir exactement 10 chiffres.";
        return;
    }

    if (password !== confirmation) {
        message.textContent = "Les mots de passe ne correspondent pas.";
        return;
    }

    document.getElementById("recapLogin").textContent = login;
    document.getElementById("recapNom").textContent = nom;
    document.getElementById("recapPrenom").textContent = prenom;
    document.getElementById("recapAdresse").textContent = adresse;
    document.getElementById("recapEmail").textContent = email;
    document.getElementById("recapTelephone").textContent = telephone;
    document.getElementById("recapDate").textContent = date;

    formulaire.classList.add("is-hidden");
    recapitulatif.style.display = "block";
    message.textContent = "";
});
