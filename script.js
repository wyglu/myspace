// script.js - Version finale complète
// Journal intime numérique - Toutes fonctionnalités

/* ------------------------------------- */
/*         CONFIGURATION & CONSTANTES    */
/* ------------------------------------- */

const SECRET_PASSWORD = "KLW"; // Mot de passe (en minuscules)

/* ------------------------------------- */
/*         SYSTÈME DE CONNEXION          */
/* ------------------------------------- */

// Vérifier si déjà connecté
if (sessionStorage.getItem('loggedIn') === 'true') {
    document.addEventListener('DOMContentLoaded', debloquerContenu);
}

function verifierMotDePasse() {
    const passwordInput = document.getElementById('password-input');
    const errorMsg = document.getElementById('login-error');
    
    if (passwordInput.value.toLowerCase() === SECRET_PASSWORD.toLowerCase()) {
        errorMsg.textContent = '✨ Accès autorisé ! ✨';
        errorMsg.style.color = '#a8e6cf';
        sessionStorage.setItem('loggedIn', 'true');
        setTimeout(debloquerContenu, 500);
        return true;
    } else {
        errorMsg.textContent = '❌ Mot de passe incorrect... réessaie ❌';
        passwordInput.style.borderColor = '#ff6b6b';
        passwordInput.value = '';
        return false;
    }
}

function debloquerContenu() {
    const loginScreen = document.getElementById('login-screen');
    const contentOverlay = document.getElementById('content-overlay');
    const mainContent = document.getElementById('main-content');
    
    loginScreen.classList.add('hidden');
    contentOverlay.classList.add('hidden');
    mainContent.classList.add('unlocked');
    
    pluieEtoiles();
}

function pluieEtoiles() {
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const etoile = document.createElement('div');
            etoile.classList.add('etoile-filante', 'petite');
            etoile.textContent = '✨';
            etoile.style.left = Math.random() * 100 + '%';
            etoile.style.top = '-10%';
            etoile.style.animation = 'etoileFilante 2s linear forwards';
            etoile.style.position = 'fixed';
            etoile.style.zIndex = '10000';
            document.body.appendChild(etoile);
            setTimeout(() => etoile.remove(), 2000);
        }, i * 100);
    }
}

function verrouiller() {
    sessionStorage.removeItem('loggedIn');
    location.reload();
}

/* ------------------------------------- */
/*         GESTION DE LA PHOTO           */
/* ------------------------------------- */

function initPhoto() {
    const uploadPhoto = document.getElementById('upload-photo');
    const photoProfil = document.getElementById('photo-profil');
    
    if (!uploadPhoto || !photoProfil) return;
    
    const photoSauvegardee = localStorage.getItem('photo-profil');
    if (photoSauvegardee) {
        photoProfil.src = photoSauvegardee;
    } else {
        photoProfil.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" viewBox="0 0 150 150"><circle cx="75" cy="75" r="70" fill="%23e8a2af" /><circle cx="75" cy="55" r="20" fill="%23f5e6e8" /><circle cx="55" cy="50" r="4" fill="%232c2a4a" /><circle cx="95" cy="50" r="4" fill="%232c2a4a" /><path d="M55 80 Q75 100, 95 80" stroke="%23f5e6e8" stroke-width="4" fill="none" /></svg>';
    }
    
    uploadPhoto.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                photoProfil.src = event.target.result;
                localStorage.setItem('photo-profil', event.target.result);
            };
            reader.readAsDataURL(file);
        }
    });
}

/* ------------------------------------- */
/*    CHAMPS PERSONNALISÉS (PROFIL)      */
/* ------------------------------------- */

function initChampsPersonnalises() {
    const btnAjouter = document.getElementById('btn-ajouter-champ');
    const container = document.getElementById('champs-personnalises');
    
    if (!btnAjouter || !container) return;
    
    // Charger les champs sauvegardés
    const champsSauvegardes = localStorage.getItem('champs-personnalises');
    if (champsSauvegardes) {
        const champs = JSON.parse(champsSauvegardes);
        champs.forEach(champ => ajouterChampPersonnalise(champ.nom, champ.valeur));
    }
    
    btnAjouter.addEventListener('click', () => {
        const nom = prompt("Quel est le nom de l'info ? (ex: 'Son film préféré', 'Son animal totem', etc.)");
        if (!nom) return;
        
        const valeur = prompt(`Que veux-tu mettre pour "${nom}" ?`);
        if (valeur === null) return;
        
        ajouterChampPersonnalise(nom, valeur);
        sauvegarderChampsPersonnalises();
    });
}

function ajouterChampPersonnalise(nom, valeur) {
    const container = document.getElementById('champs-personnalises');
    const champDiv = document.createElement('div');
    champDiv.className = 'champ-personnalise';
    champDiv.dataset.nom = nom;
    
    champDiv.innerHTML = `
        <strong>${nom} :</strong>
        <span class="valeur-editable">${valeur}</span>
        <button class="modifier-champ" title="Modifier">✏️</button>
        <button class="supprimer-champ" title="Supprimer">🗑️</button>
    `;
    
    container.appendChild(champDiv);
    
    // Rendre la valeur modifiable au clic
    const valeurSpan = champDiv.querySelector('.valeur-editable');
    valeurSpan.addEventListener('dblclick', function() {
        const input = document.createElement('input');
        input.type = 'text';
        input.value = this.textContent;
        input.style.padding = '4px 8px';
        input.style.borderRadius = '15px';
        input.style.border = '2px solid var(--accent-principal)';
        input.style.background = 'rgba(44, 42, 74, 0.8)';
        input.style.color = 'var(--texte)';
        
        this.replaceWith(input);
        input.focus();
        
        input.addEventListener('blur', () => {
            const nouveauSpan = document.createElement('span');
            nouveauSpan.className = 'valeur-editable';
            nouveauSpan.textContent = input.value || valeur;
            input.replaceWith(nouveauSpan);
            rendreModifiable(nouveauSpan);
            sauvegarderChampsPersonnalises();
        });
    });
    
    // Bouton modifier
    champDiv.querySelector('.modifier-champ').addEventListener('click', () => {
        const valeurSpan = champDiv.querySelector('.valeur-editable');
        const input = document.createElement('input');
        input.type = 'text';
        input.value = valeurSpan.textContent;
        input.style.padding = '4px 8px';
        input.style.borderRadius = '15px';
        input.style.border = '2px solid var(--accent-principal)';
        input.style.background = 'rgba(44, 42, 74, 0.8)';
        input.style.color = 'var(--texte)';
        
        valeurSpan.replaceWith(input);
        input.focus();
        
        input.addEventListener('blur', () => {
            const nouveauSpan = document.createElement('span');
            nouveauSpan.className = 'valeur-editable';
            nouveauSpan.textContent = input.value || valeurSpan.textContent;
            input.replaceWith(nouveauSpan);
            rendreModifiable(nouveauSpan);
            sauvegarderChampsPersonnalises();
        });
    });
    
    // Bouton supprimer
    champDiv.querySelector('.supprimer-champ').addEventListener('click', () => {
        if (confirm(`Supprimer "${nom}" ?`)) {
            champDiv.remove();
            sauvegarderChampsPersonnalises();
        }
    });
}

function rendreModifiable(element) {
    element.addEventListener('dblclick', function() {
        const input = document.createElement('input');
        input.type = 'text';
        input.value = this.textContent;
        input.style.padding = '4px 8px';
        input.style.borderRadius = '15px';
        input.style.border = '2px solid var(--accent-principal)';
        input.style.background = 'rgba(44, 42, 74, 0.8)';
        input.style.color = 'var(--texte)';
        
        this.replaceWith(input);
        input.focus();
        
        input.addEventListener('blur', () => {
            const nouveauSpan = document.createElement('span');
            nouveauSpan.className = 'valeur-editable';
            nouveauSpan.textContent = input.value || this.textContent;
            input.replaceWith(nouveauSpan);
            rendreModifiable(nouveauSpan);
            sauvegarderChampsPersonnalises();
        });
    });
}

function sauvegarderChampsPersonnalises() {
    const champs = [];
    document.querySelectorAll('#champs-personnalises .champ-personnalise').forEach(div => {
        const nom = div.dataset.nom;
        const valeur = div.querySelector('.valeur-editable').textContent;
        champs.push({ nom, valeur });
    });
    localStorage.setItem('champs-personnalises', JSON.stringify(champs));
}

/* ------------------------------------- */
/*         GESTION DE LA TIMELINE        */
/* ------------------------------------- */

let timelineItems, inputSouvenir, inputDate, btnAjouter;

function initTimeline() {
    btnAjouter = document.getElementById('btn-ajouter');
    inputSouvenir = document.getElementById('nouveau-souvenir');
    inputDate = document.getElementById('date-souvenir');
    timelineItems = document.getElementById('timeline-items');
    
    if (!btnAjouter || !inputSouvenir || !inputDate || !timelineItems) return;
    
    const aujourdhui = new Date().toISOString().split('T')[0];
    inputDate.value = aujourdhui;
    
    const souvenirsSauvegardes = localStorage.getItem('souvenirs-timeline');
    if (souvenirsSauvegardes) {
        const souvenirs = JSON.parse(souvenirsSauvegardes);
        souvenirs.forEach(s => ajouterSouvenirTimeline(s.texte, s.date));
    }
    
    btnAjouter.addEventListener('click', ajouterSouvenirHandler);
    inputSouvenir.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') btnAjouter.click();
    });
}

function ajouterSouvenirHandler() {
    const texte = inputSouvenir.value.trim();
    const date = inputDate.value;
    
    if (texte !== '') {
        ajouterSouvenirTimeline(texte, date);
        inputSouvenir.value = '';
        inputSouvenir.focus();
    }
}

function ajouterSouvenirTimeline(texte, date) {
    const [annee, mois, jour] = date.split('-');
    const dateFormatee = `${jour}/${mois}/${annee}`;
    const moisAnnee = `${mois}/${annee}`;
    
    let monthGroup = document.querySelector(`.timeline-month[data-month="${moisAnnee}"]`);
    
    if (!monthGroup) {
        monthGroup = document.createElement('div');
        monthGroup.className = 'timeline-month';
        monthGroup.setAttribute('data-month', moisAnnee);
        
        const nomMois = new Date(annee, mois-1, 1).toLocaleString('fr', { month: 'long' });
        monthGroup.textContent = `${nomMois} ${annee}`.toUpperCase();
        
        timelineItems.appendChild(monthGroup);
    }
    
    const item = document.createElement('div');
    item.className = 'timeline-item';
    item.innerHTML = `
        <div class="timeline-date">${dateFormatee}</div>
        <div class="timeline-content">
            <span class="timeline-text">${texte}</span>
            <button class="timeline-delete">✖</button>
        </div>
    `;
    
    monthGroup.insertAdjacentElement('afterend', item);
    
    const btnDelete = item.querySelector('.timeline-delete');
    btnDelete.addEventListener('click', function() {
        item.remove();
        
        const monthItems = document.querySelectorAll('.timeline-item');
        const itemsDansMois = Array.from(monthItems).filter(el => 
            el.previousElementSibling === monthGroup
        );
        
        if (itemsDansMois.length === 0) monthGroup.remove();
        
        sauvegarderTimeline();
    });
    
    trierTimeline();
    sauvegarderTimeline();
}

function trierTimeline() {
    const items = Array.from(document.querySelectorAll('.timeline-item'));
    
    items.sort((a, b) => {
        const dateA = a.querySelector('.timeline-date').textContent.split('/').reverse().join('-');
        const dateB = b.querySelector('.timeline-date').textContent.split('/').reverse().join('-');
        return dateB.localeCompare(dateA);
    });
    
    timelineItems.innerHTML = '';
    items.forEach(item => timelineItems.appendChild(item));
}

function sauvegarderTimeline() {
    const souvenirs = [];
    document.querySelectorAll('.timeline-item').forEach(item => {
        const date = item.querySelector('.timeline-date').textContent;
        const texte = item.querySelector('.timeline-text').textContent;
        const [jour, mois, annee] = date.split('/');
        souvenirs.push({ texte, date: `${annee}-${mois}-${jour}` });
    });
    localStorage.setItem('souvenirs-timeline', JSON.stringify(souvenirs));
}

/* ------------------------------------- */
/*         GESTION DES CADEAUX           */
/* ------------------------------------- */

let inputCadeau, btnAjouterCadeau, listeCadeaux;

function initCadeaux() {
    btnAjouterCadeau = document.getElementById('btn-ajouter-cadeau');
    inputCadeau = document.getElementById('nouveau-cadeau');
    listeCadeaux = document.getElementById('liste-cadeaux');
    
    if (!btnAjouterCadeau || !inputCadeau || !listeCadeaux) return;
    
    const cadeauxSauvegardes = localStorage.getItem('cadeaux');
    if (cadeauxSauvegardes) {
        const cadeaux = JSON.parse(cadeauxSauvegardes);
        cadeaux.forEach(cadeau => ajouterCadeau(cadeau));
    }
    
    btnAjouterCadeau.addEventListener('click', ajouterCadeauHandler);
    inputCadeau.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') btnAjouterCadeau.click();
    });
}

function ajouterCadeauHandler() {
    const texte = inputCadeau.value.trim();
    if (texte !== '') {
        ajouterCadeau(texte);
        inputCadeau.value = '';
        inputCadeau.focus();
    }
}

function ajouterCadeau(texte) {
    const nouveauLi = document.createElement('li');
    nouveauLi.innerHTML = `🎁 ${texte}`;
    
    const btnSupprimer = document.createElement('button');
    btnSupprimer.innerHTML = '✖';
    btnSupprimer.style.marginLeft = 'auto';
    btnSupprimer.style.background = 'none';
    btnSupprimer.style.border = 'none';
    btnSupprimer.style.color = 'var(--accent-principal)';
    btnSupprimer.style.cursor = 'pointer';
    btnSupprimer.style.fontSize = '1.1em';
    btnSupprimer.style.opacity = '0.5';
    
    btnSupprimer.addEventListener('mouseenter', () => btnSupprimer.style.opacity = '1');
    btnSupprimer.addEventListener('mouseleave', () => btnSupprimer.style.opacity = '0.5');
    btnSupprimer.addEventListener('click', () => {
        nouveauLi.remove();
        sauvegarderCadeaux();
    });
    
    nouveauLi.appendChild(btnSupprimer);
    listeCadeaux.appendChild(nouveauLi);
    sauvegarderCadeaux();
}

function sauvegarderCadeaux() {
    const cadeaux = [];
    document.querySelectorAll('#liste-cadeaux li').forEach(li => {
        let texte = li.textContent.replace('✖', '').replace('🎁', '').trim();
        cadeaux.push(texte);
    });
    localStorage.setItem('cadeaux', JSON.stringify(cadeaux));
}

/* ------------------------------------- */
/*         GESTION AIME / N'AIME PAS     */
/* ------------------------------------- */

let inputAime, btnAime, listeAime;
let inputNaime, btnNaime, listeNaime;

function initAimePasAime() {
    inputAime = document.getElementById('nouveau-aime');
    btnAime = document.getElementById('btn-ajouter-aime');
    listeAime = document.getElementById('liste-aime');
    
    inputNaime = document.getElementById('nouveau-naime');
    btnNaime = document.getElementById('btn-ajouter-naime');
    listeNaime = document.getElementById('liste-naime');
    
    if (!inputAime || !btnAime || !listeAime || !inputNaime || !btnNaime || !listeNaime) return;
    
    chargerAimes();
    chargerNaimes();
    
    btnAime.addEventListener('click', () => {
        const texte = inputAime.value.trim();
        if (texte !== '') {
            ajouterAime(texte);
            inputAime.value = '';
            inputAime.focus();
        }
    });
    
    inputAime.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') btnAime.click();
    });
    
    btnNaime.addEventListener('click', () => {
        const texte = inputNaime.value.trim();
        if (texte !== '') {
            ajouterNaime(texte);
            inputNaime.value = '';
            inputNaime.focus();
        }
    });
    
    inputNaime.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') btnNaime.click();
    });
}

function ajouterAime(texte) {
    const li = document.createElement('li');
    li.innerHTML = `
        <span>❤️ ${texte}</span>
        <button class="delete-item">✖</button>
    `;
    
    const btnDelete = li.querySelector('.delete-item');
    btnDelete.addEventListener('click', () => {
        li.remove();
        sauvegarderAimes();
    });
    
    listeAime.appendChild(li);
    sauvegarderAimes();
}

function ajouterNaime(texte) {
    const li = document.createElement('li');
    li.innerHTML = `
        <span>🖤 ${texte}</span>
        <button class="delete-item">✖</button>
    `;
    
    const btnDelete = li.querySelector('.delete-item');
    btnDelete.addEventListener('click', () => {
        li.remove();
        sauvegarderNaimes();
    });
    
    listeNaime.appendChild(li);
    sauvegarderNaimes();
}

function sauvegarderAimes() {
    const aimes = [];
    document.querySelectorAll('#liste-aime li').forEach(li => {
        const texte = li.querySelector('span').textContent.replace('❤️', '').trim();
        aimes.push(texte);
    });
    localStorage.setItem('aimes', JSON.stringify(aimes));
}

function sauvegarderNaimes() {
    const naimes = [];
    document.querySelectorAll('#liste-naime li').forEach(li => {
        const texte = li.querySelector('span').textContent.replace('🖤', '').trim();
        naimes.push(texte);
    });
    localStorage.setItem('naimes', JSON.stringify(naimes));
}

function chargerAimes() {
    const aimesSauvegardes = localStorage.getItem('aimes');
    if (aimesSauvegardes) {
        const aimes = JSON.parse(aimesSauvegardes);
        listeAime.innerHTML = '';
        aimes.forEach(aime => ajouterAime(aime));
    }
}

function chargerNaimes() {
    const naimesSauvegardes = localStorage.getItem('naimes');
    if (naimesSauvegardes) {
        const naimes = JSON.parse(naimesSauvegardes);
        listeNaime.innerHTML = '';
        naimes.forEach(naime => ajouterNaime(naime));
    }
}

/* ------------------------------------- */
/*      SECTION MESSAGES LIBRES          */
/* ------------------------------------- */

let inputMessage, btnMessage, messagesContainer;

function initMessagesLibres() {
    inputMessage = document.getElementById('nouveau-message');
    btnMessage = document.getElementById('btn-ajouter-message');
    messagesContainer = document.getElementById('messages-container');
    
    if (!inputMessage || !btnMessage || !messagesContainer) return;
    
    // Initialiser les emojis
    document.querySelectorAll('.emoji-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const emoji = btn.dataset.emoji;
            const start = inputMessage.selectionStart;
            const end = inputMessage.selectionEnd;
            inputMessage.value = inputMessage.value.substring(0, start) + emoji + inputMessage.value.substring(end);
            inputMessage.focus();
            inputMessage.selectionStart = inputMessage.selectionEnd = start + emoji.length;
        });
    });
    
    chargerMessages();
    
    btnMessage.addEventListener('click', ajouterMessageHandler);
    
    inputMessage.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'Enter') {
            btnMessage.click();
        }
    });
}

function ajouterMessageHandler() {
    const texte = inputMessage.value.trim();
    if (texte !== '') {
        ajouterMessage(texte);
        inputMessage.value = '';
        inputMessage.focus();
    }
}

function ajouterMessage(texte, date = null, id = null) {
    const messageDate = date ? new Date(date) : new Date();
    const dateFormatee = messageDate.toLocaleString('fr', { 
        day: '2-digit', 
        month: 'long', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    const messageId = id || 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    const dateISO = messageDate.toISOString();
    
    const messageCard = document.createElement('div');
    messageCard.className = 'message-card';
    messageCard.dataset.id = messageId;
    messageCard.dataset.date = dateISO;
    messageCard.dataset.texte = texte;
    
    messageCard.innerHTML = `
        <div class="message-header">
            <span class="message-date">${dateFormatee}</span>
            <div class="message-actions-card">
                <button class="message-edit" title="Modifier">✏️</button>
                <button class="message-delete" title="Supprimer">🗑️</button>
            </div>
        </div>
        <div class="message-content">${texte.replace(/\n/g, '<br>')}</div>
        <div class="message-footer">
            <div class="message-reactions" data-message-id="${messageId}">
                <button class="reaction-btn" data-reaction="❤️">❤️ <span class="reaction-count">0</span></button>
                <button class="reaction-btn" data-reaction="😊">😊 <span class="reaction-count">0</span></button>
                <button class="reaction-btn" data-reaction="😘">😘 <span class="reaction-count">0</span></button>
                <button class="reaction-btn" data-reaction="✨">✨ <span class="reaction-count">0</span></button>
            </div>
        </div>
    `;
    
    messagesContainer.prepend(messageCard);
    initMessageEvents(messageCard, messageId, texte);
    sauvegarderMessages();
}

function initMessageEvents(messageCard, messageId, texteOriginal) {
    const btnDelete = messageCard.querySelector('.message-delete');
    btnDelete.addEventListener('click', () => {
        if (confirm('Supprimer ce message ?')) {
            messageCard.remove();
            sauvegarderMessages();
        }
    });
    
    const btnEdit = messageCard.querySelector('.message-edit');
    btnEdit.addEventListener('click', () => {
        const contentDiv = messageCard.querySelector('.message-content');
        const currentText = messageCard.dataset.texte;
        
        const editArea = document.createElement('div');
        editArea.className = 'message-edit-mode';
        editArea.innerHTML = `
            <textarea class="message-edit-textarea">${currentText}</textarea>
            <div class="message-edit-actions">
                <button class="message-save">💾 Sauvegarder</button>
                <button class="message-cancel">✖ Annuler</button>
            </div>
        `;
        
        contentDiv.style.display = 'none';
        messageCard.querySelector('.message-footer').style.display = 'none';
        messageCard.insertBefore(editArea, messageCard.querySelector('.message-footer'));
        
        const textarea = editArea.querySelector('textarea');
        textarea.focus();
        
        editArea.querySelector('.message-save').addEventListener('click', () => {
            const newText = textarea.value.trim();
            if (newText !== '') {
                contentDiv.innerHTML = newText.replace(/\n/g, '<br>');
                messageCard.dataset.texte = newText;
                contentDiv.style.display = 'block';
                messageCard.querySelector('.message-footer').style.display = 'block';
                editArea.remove();
                sauvegarderMessages();
            }
        });
        
        editArea.querySelector('.message-cancel').addEventListener('click', () => {
            contentDiv.style.display = 'block';
            messageCard.querySelector('.message-footer').style.display = 'block';
            editArea.remove();
        });
    });
    
    const reactionBtns = messageCard.querySelectorAll('.reaction-btn');
    reactionBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const countSpan = btn.querySelector('.reaction-count');
            let count = parseInt(countSpan.textContent);
            count++;
            countSpan.textContent = count;
            
            btn.style.transform = 'scale(1.2)';
            setTimeout(() => btn.style.transform = 'scale(1)', 200);
            
            sauvegarderMessages();
        });
    });
}

function sauvegarderMessages() {
    const messages = [];
    document.querySelectorAll('.message-card').forEach(card => {
        const reactions = {};
        card.querySelectorAll('.reaction-btn').forEach(btn => {
            const reaction = btn.dataset.reaction;
            const count = parseInt(btn.querySelector('.reaction-count').textContent);
            reactions[reaction] = count;
        });
        
        messages.push({
            id: card.dataset.id,
            texte: card.dataset.texte,
            date: card.dataset.date,
            reactions: reactions
        });
    });
    localStorage.setItem('messages-libres', JSON.stringify(messages));
}

function chargerMessages() {
    const messagesSauvegardes = localStorage.getItem('messages-libres');
    if (messagesSauvegardes) {
        const messages = JSON.parse(messagesSauvegardes);
        messages.forEach(msg => {
            ajouterMessage(msg.texte, msg.date, msg.id);
            
            setTimeout(() => {
                const card = document.querySelector(`[data-id="${msg.id}"]`);
                if (card && msg.reactions) {
                    Object.entries(msg.reactions).forEach(([reaction, count]) => {
                        const btn = card.querySelector(`[data-reaction="${reaction}"] .reaction-count`);
                        if (btn) btn.textContent = count;
                    });
                }
            }, 100);
        });
    }
}

/* ------------------------------------- */
/*         INFOS MODIFIABLES             */
/* ------------------------------------- */

function initInfosModifiables() {
    const elementsModifiables = ['prenom', 'surnom', 'anniversaire', 'plat', 'couleur', 'verset'];
    
    elementsModifiables.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('dblclick', function() {
                const input = document.createElement('input');
                input.type = 'text';
                input.value = this.textContent;
                input.style.padding = '8px';
                input.style.border = '2px solid #e8a2af';
                input.style.borderRadius = '20px';
                input.style.background = '#2c2a4a';
                input.style.color = '#f5e6e8';
                input.style.fontFamily = 'Quicksand, sans-serif';
                
                this.parentNode.replaceChild(input, this);
                
                input.addEventListener('blur', function() {
                    const nouveauSpan = document.createElement('span');
                    nouveauSpan.id = id;
                    nouveauSpan.textContent = this.value || '?';
                    this.parentNode.replaceChild(nouveauSpan, this);
                    initInfosModifiables();
                });
                
                input.focus();
            });
        }
    });
}

/* ------------------------------------- */
/*         ÉTOILES FILANTES              */
/* ------------------------------------- */

function creerEtoiles() {
    const nombresEtoiles = 8;
    
    for (let i = 0; i < nombresEtoiles; i++) {
        setTimeout(() => {
            const etoile = document.createElement('div');
            etoile.classList.add('etoile-filante');
            
            const taille = Math.random();
            if (taille < 0.15) etoile.classList.add('tres-petite');
            else if (taille < 0.35) etoile.classList.add('petite');
            else if (taille < 0.6) etoile.classList.add('moyenne');
            else if (taille < 0.85) etoile.classList.add('grande');
            else etoile.classList.add('tres-grande');
            
            if (Math.random() > 0.7) etoile.classList.add('lente');
            else if (Math.random() > 0.8) etoile.classList.add('rapide');
            
            const etoiles = ['⭐', '🌟', '✨', '💫', '✧', '★', '☆'];
            etoile.textContent = etoiles[Math.floor(Math.random() * etoiles.length)];
            
            etoile.style.top = (Math.random() * 80 + 10) + '%';
            etoile.style.left = (Math.random() * 20 - 5) + '%';
            etoile.style.transform = `rotate(${Math.random() * 30 - 15}deg)`;
            etoile.style.animationDelay = Math.random() * 12 + 's';
            etoile.style.opacity = (0.4 + Math.random() * 0.5).toString();
            
            document.body.appendChild(etoile);
            
            setTimeout(() => {
                etoile.style.opacity = '0';
                setTimeout(() => etoile.remove(), 1000);
            }, 12000);
            
        }, i * 600);
    }
    
    setTimeout(creerEtoiles, 10000);
}

function initEtoilesClic() {
    document.addEventListener('click', function(e) {
        const etoile = document.createElement('div');
        etoile.classList.add('etoile-filante', 'petite');
        
        const etoiles = ['⭐', '🌟', '✨', '💫', '🌠'];
        etoile.textContent = etoiles[Math.floor(Math.random() * etoiles.length)];
        
        etoile.style.left = (e.clientX - 50) + 'px';
        etoile.style.top = (e.clientY - 25) + 'px';
        etoile.style.animation = 'etoileFilante 3s linear forwards';
        etoile.style.position = 'absolute';
        etoile.style.zIndex = '1000';
        etoile.style.opacity = '1';
        etoile.style.filter = 'drop-shadow(0 0 25px gold)';
        etoile.style.transform = `rotate(${Math.random() * 60 - 30}deg)`;
        
        document.body.appendChild(etoile);
        
        setTimeout(() => {
            etoile.style.opacity = '0';
            setTimeout(() => etoile.remove(), 500);
        }, 2800);
    });
}

/* ------------------------------------- */
/*         INITIALISATION PRINCIPALE     */
/* ------------------------------------- */

document.addEventListener('DOMContentLoaded', function() {
    // Connexion
    const loginBtn = document.getElementById('login-btn');
    const passwordInput = document.getElementById('password-input');
    const logoutBtn = document.getElementById('logout-btn');
    
    if (loginBtn && passwordInput) {
        loginBtn.addEventListener('click', verifierMotDePasse);
        passwordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') verifierMotDePasse();
        });
    }
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', verrouiller);
    }
    
    // Initialiser toutes les fonctionnalités
    initPhoto();
    initChampsPersonnalises();  // NOUVEAU : champs personnalisés
    initTimeline();
    initCadeaux();
    initAimePasAime();
    initMessagesLibres();       // NOUVEAU : messages libres
    initInfosModifiables();
    
    // Démarrer les étoiles
    creerEtoiles();
    initEtoilesClic();
});