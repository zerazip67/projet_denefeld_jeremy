const formulaire = document.getElementById("formulaire");
const message = document.getElementById("message");
const boutonInscription = document.querySelector("button[type='submit']");
const recapitulatif = document.getElementById("recapitulatif");

boutonInscription.addEventListener("click", function(event) {
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

    if (login == "" || password == "" || confirmation == "" ||
        nom == "" || prenom == "" || adresse == "" ||
        email == "" || telephone == "" || date == "") {

        message.textContent = "Veuillez remplir tous les champs.";
        return;
    }

    if (!email.includes("@")) {
        message.textContent = "Email invalide.";
        return;
    }

    if (password != confirmation) {
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

    formulaire.style.display = "none";
    recapitulatif.style.display = "block";
    message.textContent = "";
});
```
