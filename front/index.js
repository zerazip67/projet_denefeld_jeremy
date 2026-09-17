const formulaire = document.getElementById("formulaire");
const message = document.getElementById("message");

formulaire.addEventListener("submit", function(event) {
    event.preventDefault();

    const password = document.getElementById("password").value;
    const confirmation = document.getElementById("confirmation").value;
    const email = document.getElementById("email").value;

    if (!formulaire.checkValidity()) {
        message.textContent = "Veuillez remplir tous les champs correctement.";
        return;
    }

    if (!email.includes("@")) {
        message.textContent = "L'adresse email n'est pas valide.";
        return;
    }

    if (password !== confirmation) {
        message.textContent = "Les mots de passe ne correspondent pas.";
        return;
    }

    document.getElementById("recapLogin").textContent =
        document.getElementById("login").value;

    document.getElementById("recapNom").textContent =
        document.getElementById("nom").value;

    document.getElementById("recapPrenom").textContent =
        document.getElementById("prenom").value;

    document.getElementById("recapAdresse").textContent =
        document.getElementById("adresse").value;

    document.getElementById("recapEmail").textContent =
        document.getElementById("email").value;

    document.getElementById("recapTelephone").textContent =
        document.getElementById("telephone").value;

    document.getElementById("recapDate").textContent =
        document.getElementById("dateNaissance").value;

    formulaire.style.display = "none";
    document.getElementById("recapitulatif").style.display = "block";
});