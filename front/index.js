const formulaire = document.getElementById("formulaire");
const message = document.getElementById("message");

formulaire.addEventListener("submit", function(event) {

    event.preventDefault();

    let login = document.getElementById("login").value;
    let password = document.getElementById("password").value;
    let confirmation = document.getElementById("confirmation").value;
    let nom = document.getElementById("nom").value;
    let prenom = document.getElementById("prenom").value;
    let adresse = document.getElementById("adresse").value;
    let email = document.getElementById("email").value;
    let telephone = document.getElementById("telephone").value;
    let date = document.getElementById("dateNaissance").value;

    // Vérification des champs
    if (login == "" || password == "" || confirmation == "" ||
        nom == "" || prenom == "" || adresse == "" ||
        email == "" || telephone == "" || date == "") {

        message.textContent = "Veuillez remplir tous les champs.";
        return;
    }

    // Vérification de l'email
    if (!email.includes("@")) {
        message.textContent = "Email invalide.";
        return;
    }

    // Vérification du mot de passe
    if (password != confirmation) {
        message.textContent = "Les mots de passe ne correspondent pas.";
        return;
    }

    // Affichage du récapitulatif
    document.getElementById("recapLogin").textContent = login;
    document.getElementById("recapNom").textContent = nom;
    document.getElementById("recapPrenom").textContent = prenom;
    document.getElementById("recapAdresse").textContent = adresse;
    document.getElementById("recapEmail").textContent = email;
    document.getElementById("recapTelephone").textContent = telephone;
    document.getElementById("recapDate").textContent = date;

    formulaire.style.display = "none";
    document.getElementById("recapitulatif").style.display = "block";
});
```
