const API = {
    projets: 'https://webcraft-api.vercel.app/data/projects.json',
    formations: 'https://webcraft-api.vercel.app/data/courses.json'
};

const lireApi = async (adresse) => {
    const reponse = await fetch(adresse);
    if (!reponse.ok) {
        throw new Error(`${adresse} a répondu avec le statut ${reponse.status}`);
    }
    return reponse.json();
};

const ajouterOptions = ($liste, valeurs) => {
    $liste.append(valeurs.map((valeur) => new Option(valeur, valeur)));
};

const temporiser = (action, pause = 300) => {
    let chrono;
    return () => {
        clearTimeout(chrono);
        chrono = setTimeout(action, pause);
    };
};

const pastilles = (technos) => technos.map((techno) => `<span class="pastille">${techno}</span>`).join('');
const listeHtml = (elements) => `<ul>${elements.map((element) => `<li>${element}</li>`).join('')}</ul>`;
const statut = (disponible) => disponible
    ? '<span class="statut statut-ok">Disponible</span>'
    : '<span class="statut statut-complet">Complet</span>';
const enEuros = (prix) => `${prix.toLocaleString('fr-FR')} €`;

const ouvrirFenetre = (id, titre, contenu) => {
    $(`#${id}-titre`).text(titre);
    $(`#${id}-contenu`).html(contenu);
    bootstrap.Modal.getOrCreateInstance(`#${id}`).show();
};

const ficheProjet = (projet) => `
    <article class="fiche">
        <img class="fiche-image" src="${projet.image}" alt="Aperçu du projet ${projet.title}" loading="lazy">
        <div class="fiche-corps">
            <p class="etiquette">${projet.category}</p>
            <h3 class="fiche-titre">${projet.title}</h3>
            <p class="fiche-ligne">Client : ${projet.client}</p>
            <div class="pastilles">${pastilles(projet.technologies)}</div>
            <div class="fiche-actions">
                <button type="button" class="bouton bouton-contour" data-details="${projet.id}">Voir détails</button>
            </div>
        </div>
    </article>`;

const fenetreProjet = (projet) => ouvrirFenetre('fenetre-projet', projet.title, `
    <img class="fenetre-image" src="${projet.image}" alt="Aperçu du projet ${projet.title}">
    <p>${projet.description}</p>
    <dl class="infos">
        <dt>Client</dt><dd>${projet.client}</dd>
        <dt>Catégorie</dt><dd>${projet.category}</dd>
        <dt>Année</dt><dd>${projet.year}</dd>
        <dt>Durée</dt><dd>${projet.duration}</dd>
        <dt>Technologies</dt><dd class="pastilles">${pastilles(projet.technologies)}</dd>
        <dt>Site</dt><dd><a href="${projet.url}" target="_blank" rel="noopener">${projet.url}</a></dd>
    </dl>
    <h3 class="fenetre-sous-titre">Fonctionnalités</h3>
    ${listeHtml(projet.features)}`);


const ficheFormation = (formation) => `
    <article class="fiche">
        <img class="fiche-image" src="${formation.image}" alt="Illustration de la formation ${formation.title}" loading="lazy">
        <div class="fiche-corps">
            <p class="etiquette">${formation.category}</p>
            <h3 class="fiche-titre">${formation.title}</h3>
            <p class="fiche-ligne"><span class="pastille pastille-niveau">${formation.level}</span> · ${formation.duration} · <strong>${enEuros(formation.price)}</strong></p>
            <p class="fiche-ligne"><span class="visually-hidden">Note : </span><span aria-hidden="true">★</span> ${formation.rating.toLocaleString('fr-FR')}/5 · ${formation.students} étudiants</p>
            <div class="pastilles">${pastilles(formation.technologies)}</div>
            ${statut(formation.available)}
            <div class="fiche-actions">
                <button type="button" class="bouton bouton-contour" data-details="${formation.id}">Voir détails</button>
                <a href="inscription.html" class="bouton bouton-plein">S'inscrire</a>
            </div>
        </div>
    </article>`;

const fenetreFormation = (formation) => ouvrirFenetre('fenetre-formation', formation.title, `
    <img class="fenetre-image" src="${formation.image}" alt="Illustration de la formation ${formation.title}">
    <p>${formation.description}</p>
    <dl class="infos">
        <dt>Formateur</dt><dd>${formation.instructor}</dd>
        <dt>Catégorie</dt><dd>${formation.category}</dd>
        <dt>Niveau</dt><dd><span class="pastille pastille-niveau">${formation.level}</span></dd>
        <dt>Durée</dt><dd>${formation.duration}</dd>
        <dt>Prix</dt><dd>${enEuros(formation.price)}</dd>
        <dt>Note</dt><dd><span aria-hidden="true">★</span> ${formation.rating.toLocaleString('fr-FR')}/5</dd>
        <dt>Étudiants</dt><dd>${formation.students}</dd>
        <dt>Places</dt><dd>${statut(formation.available)}</dd>
        <dt>Technologies</dt><dd class="pastilles">${pastilles(formation.technologies)}</dd>
    </dl>
    <h3 class="fenetre-sous-titre">Modules</h3>
    ${listeHtml(formation.modules)}`);

const catalogues = [
    {
        api: API.projets,
        cle: 'projects',
        elements: [],
        liste: '#liste-projets',
        chargement: '#chargement-projets',
        alerte: '#alerte-projets',
        recherche: '#recherche-projet',
        texteRecherche: (projet) => `${projet.title} ${projet.client} ${projet.description}`,
        filtres: [
            { select: '#choix-techno-projet', source: 'technologies', garde: (projet, choix) => projet.technologies.includes(choix) },
            { select: '#choix-categorie-projet', source: 'categories', garde: (projet, choix) => projet.category === choix }
        ],
        fiche: ficheProjet,
        fenetre: fenetreProjet,
        messageVide: 'Aucun projet ne correspond à ces critères.',
        messageErreur: "Les projets n'ont pas pu être récupérés. Vérifiez votre connexion puis rechargez la page."
    },
    {
        api: API.formations,
        cle: 'courses',
        elements: [],
        liste: '#liste-formations',
        chargement: '#chargement-formations',
        alerte: '#alerte-formations',
        recherche: '#recherche-formation',
        texteRecherche: (formation) => `${formation.title} ${formation.instructor} ${formation.description}`,
        filtres: [
            { select: '#choix-categorie-formation', source: 'categories', garde: (formation, choix) => formation.category === choix },
            { select: '#choix-niveau-formation', source: 'levels', garde: (formation, choix) => formation.level === choix },
            { select: '#choix-techno-formation', source: 'technologies', garde: (formation, choix) => formation.technologies.includes(choix) }
        ],
        fiche: ficheFormation,
        fenetre: fenetreFormation,
        messageVide: 'pas de formations',
        messageErreur: "erreur sur le chargement des formations"
    }
];

const afficher = (catalogue, elements) => {
    const $liste = $(catalogue.liste);
    if (elements.length === 0) {
        $liste.html(`<p class="aucun-resultat">${catalogue.messageVide}</p>`);
        return;
    }
    $liste.html(elements.map(catalogue.fiche).join(''));
};

const filtrer = (catalogue) => {
    const motCle = $(catalogue.recherche).val().trim().toLowerCase();

    const retenus = catalogue.elements.filter((element) => {
        const texteOk = catalogue.texteRecherche(element).toLowerCase().includes(motCle);
        const filtresOk = catalogue.filtres.every(({ select, garde }) => {
            const choix = $(select).val();
            return choix === '' || garde(element, choix);
        });
        return texteOk && filtresOk;
    });
    afficher(catalogue, retenus);
};

const charger = async (catalogue) => {
    try {
        const json = await lireApi(catalogue.api);
        catalogue.elements = json[catalogue.cle];
        catalogue.filtres.forEach(({ select, source }) => ajouterOptions($(select), json[source]));
        afficher(catalogue, catalogue.elements);
    } catch (erreur) {
        console.error(erreur);
        $(catalogue.alerte).text(catalogue.messageErreur).prop('hidden', false);
    } finally {
        $(catalogue.chargement).prop('hidden', true);
    }
};

const brancherEvenements = (catalogue) => {
    $(catalogue.recherche).on('input', temporiser(() => filtrer(catalogue)));
    $(catalogue.filtres.map(({ select }) => select).join(', ')).on('change', () => filtrer(catalogue));
    $(catalogue.liste).on('click', '[data-details]', (evenement) => {
        const id = Number(evenement.currentTarget.dataset.details);
        catalogue.fenetre(catalogue.elements.find((element) => element.id === id));
    });
};

/* ---------- Formulaire d'inscription ---------- */
// utilisation de claude code pour creer le regex pour l'email et le telephone international
const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Format international : commence par +, puis 8 à 15 chiffres
// (espaces, points et tirets tolérés pour la lisibilité)
const estTelephoneInternational = (saisie) => {
    const numero = saisie.trim();
    const nbChiffres = numero.replace(/\D/g, '').length;
    return /^\+[\d\s.-]+$/.test(numero) && nbChiffres >= 8 && nbChiffres <= 15;
};


const controles = [
    { champ: '#prenom', estValide: (v) => v.trim().length >= 2, erreur: 'Le prénom doit comporter au moins 2 caractères.' },
    { champ: '#nom', estValide: (v) => v.trim().length >= 2, erreur: 'Le nom doit comporter au moins 2 caractères.' },
    { champ: '#email', estValide: (v) => REGEX_EMAIL.test(v.trim()), erreur: 'Adresse email invalide : vérifiez le format (exemple : prenom.nom@entreprise.fr).' },
    { champ: '#telephone', estValide: estTelephoneInternational, erreur: "Numéro attendu au format international, avec l'indicatif du pays (exemple : +33 6 12 34 56 78)." },
    { champ: '#formation', estValide: (v) => v !== '', erreur: 'Sélectionnez la formation qui vous intéresse.' },
    { champ: '#niveau', estValide: (v) => v !== '', erreur: 'Sélectionnez votre niveau actuel.' },
    { champ: '#motivation', estValide: (v) => v.trim().length >= 50, erreur: 'Expliquez votre motivation en 50 caractères minimum.' }
];


const verifier = ({ champ, estValide, erreur }) => {
    const $champ = $(champ);
    const ok = estValide($champ.val());

    $champ
        .toggleClass('is-valid', ok)
        .toggleClass('is-invalid', !ok)
        .attr('aria-invalid', String(!ok));
    $(`#${$champ.attr('aria-describedby')}`).text(ok ? '' : erreur);

    return ok;
};

// API 2
const remplirListeFormations = async () => {
    try {
        const { courses } = await lireApi(API.formations);
        ajouterOptions($('#formation'), courses.map(({ title }) => title));
    } catch (erreur) {
        console.error(erreur);
        $('#alerte-liste-formations')
            .text("La liste des formations est indisponible pour le moment. Rechargez la page dans quelques instants.")
            .prop('hidden', false);
    } finally {
        $('#chargement-liste-formations').prop('hidden', true);
    }
};

// Validation globale à l'envoi
const envoyerFormulaire = (evenement) => {
    evenement.preventDefault();
    const bilan = controles.map(verifier);
    const premiereErreur = bilan.indexOf(false);

    $('#recap-erreurs').prop('hidden', premiereErreur === -1);
    if (premiereErreur !== -1) {
        $(controles[premiereErreur].champ).trigger('focus');
        return;
    }

    const prenom = $('#prenom').val().trim();
    const formation = $('#formation').val();
    $('#confirmation-texte').text(`Merci ${prenom} vous etes inscrit à ${formation}`);
    bootstrap.Modal.getOrCreateInstance('#fenetre-confirmation').show();
    const $formulaire = $(evenement.currentTarget);
    $formulaire[0].reset();
    $formulaire.find('.is-valid').removeClass('is-valid').removeAttr('aria-invalid');
};

const preparerFormulaire = () => {
    remplirListeFormations();
    controles.forEach((controle) => {
        $(controle.champ).on('input change', () => verifier(controle));
    });
    $('#formulaire-inscription').on('submit', envoyerFormulaire);
};

$(() => {
    const page = $('body').data('page');

    if (page === 'accueil') {
        catalogues.forEach((catalogue) => {
            charger(catalogue);
            brancherEvenements(catalogue);
        });
    }

    if (page === 'inscription') {
        preparerFormulaire();
    }
});
