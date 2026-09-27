const formulaire = document.getElementById("formulaire");
const resume = document.getElementById("resume");

formulaire.addEventListener("submit", (event) => {
    event.preventDefault();

    const mdp = document.getElementById("mdp").value;
    const confirmation = document.getElementById("confirmerPass").value;

    if (mdp !== confirmation) {
        return;
    }

    const login = document.getElementById("login").value;
    const nom = document.getElementById("nom").value;
    const prenom = document.getElementById("prenom").value;
    const adresse = document.getElementById("adresse").value;
    const email = document.getElementById("email").value;
    const telephone = document.getElementById("telephone").value;
    const date = document.getElementById("date").value;

    document.getElementById("resume-login").textContent = login;
    document.getElementById("resume-nom").textContent = nom;
    document.getElementById("resume-prenom").textContent = prenom;
    document.getElementById("resume-adresse").textContent = adresse;
    document.getElementById("resume-email").textContent = email;
    document.getElementById("resume-telephone").textContent = telephone;
    document.getElementById("resume-date").textContent = date;

    formulaire.style.display = "none";
    resume.style.display = "block";
});
