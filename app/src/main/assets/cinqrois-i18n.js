/* ═══════════════════════════════════════════════════════════════════════
   5 Rois — Internationalisation (adapté du moteur U9)
   ═══════════════════════════════════════════════════════════════════════
   Langues : fr (source) · en · it · es · de · pt

   BRANCHEMENT (à faire dans index.html, plus tard) :
     <script src="cinqrois-i18n.js"></script>
     ...juste avant la balise </body>, APRÈS le gros bloc <script> du jeu.

   ⚠️ CONFLIT À RÉGLER AU BRANCHEMENT
   index.html contient déjà une i18n interne (27 clés) qu'il faut RETIRER,
   sinon les deux systèmes se battent sur les mêmes textes :
     - const LANGS = { fr:{...}, en:{...} }      → à supprimer
     - let _lang / function _T / function applyLang / toggleLang → à supprimer
     - les 18 appels _T(...)                      → remplacer par crT(...)
     - le bouton #lang-btn et son onclick         → ce fichier le reprend
       automatiquement s'il existe (voir hookExistingBtn)
   Tant que l'ancien système est là, ce fichier fonctionne quand même :
   il traduit tout le reste du DOM. Seuls les textes du menu principal
   seront réécrits en FR par l'ancien applyLang() après chaque bascule.

   CE QUI EST COUVERT AUTOMATIQUEMENT (aucune modif du jeu nécessaire) :
     - tout le HTML statique (menu, règles, auth, popups, boutons…)
     - les attributs placeholder
     - tout DOM régénéré (render(), buildLS(), renderLeaderboard()…)
       grâce au MutationObserver

   CE QUI DEMANDE UNE MODIF DU CODE (à faire dans un second temps) :
     Les messages construits en JS avec interpolation ne peuvent pas être
     retrouvés par le dictionnaire une fois rendus. Exemple :
       setMsg(`Tu pioches ${dv(card.val)+card.suit}. Sélectionne…`)
     → devient :
       setMsg(crT('Tu pioches ')+dv(card.val)+card.suit+crT('. Sélectionne…'))
     Les fragments nécessaires sont déjà présents dans le dictionnaire
     (section « FRAGMENTS DYNAMIQUES » en bas). Utiliser window.crT(fr).
   ═══════════════════════════════════════════════════════════════════════ */

window.__CR_LANGS__ = {

  /* ── Menu principal / lobby ─────────────────────────────────────── */
  "Five Crowns": {"en":"Five Crowns","it":"Five Crowns","es":"Five Crowns","de":"Five Crowns","pt":"Five Crowns"},
  "Multijoueur en ligne": {"en":"Online multiplayer","it":"Multigiocatore online","es":"Multijugador en línea","de":"Online-Mehrspieler","pt":"Multijogador online"},
  "Chaque joueur sur son propre appareil": {"en":"Each player on their own device","it":"Ogni giocatore sul proprio dispositivo","es":"Cada jugador en su propio dispositivo","de":"Jeder Spieler auf seinem eigenen Gerät","pt":"Cada jogador no seu próprio dispositivo"},
  "Jouer en local": {"en":"Play locally","it":"Gioca in locale","es":"Jugar en local","de":"Lokal spielen","pt":"Jogar localmente"},
  "Même appareil, 1 à 8 joueurs avec passation": {"en":"Same device, 1 to 8 players, pass and play","it":"Stesso dispositivo, da 1 a 8 giocatori a turno","es":"Mismo dispositivo, de 1 a 8 jugadores por turnos","de":"Gleiches Gerät, 1 bis 8 Spieler im Wechsel","pt":"Mesmo dispositivo, 1 a 8 jogadores à vez"},
  "Reprendre la partie": {"en":"Resume game","it":"Riprendi la partita","es":"Reanudar la partida","de":"Spiel fortsetzen","pt":"Retomar o jogo"},
  "Continuer votre partie solo en cours": {"en":"Continue your solo game in progress","it":"Continua la tua partita in solitario","es":"Continúa tu partida en solitario","de":"Setze dein laufendes Solospiel fort","pt":"Continua o teu jogo a solo"},
  "Règles du jeu": {"en":"Game rules","it":"Regole del gioco","es":"Reglas del juego","de":"Spielregeln","pt":"Regras do jogo"},
  "Suites, familles, Bonus et stratégies": {"en":"Runs, books, Wild cards and strategy","it":"Scale, tris, jolly e strategie","es":"Escaleras, tríos, comodines y estrategias","de":"Folgen, Sätze, Joker und Strategien","pt":"Sequências, trios, curingas e estratégias"},
  "Amis": {"en":"Friends","it":"Amici","es":"Amigos","de":"Freunde","pt":"Amigos"},
  "Gérer votre liste d'amis": {"en":"Manage your friends list","it":"Gestisci la tua lista amici","es":"Gestiona tu lista de amigos","de":"Verwalte deine Freundesliste","pt":"Gere a tua lista de amigos"},
  "Classement global": {"en":"Global ranking","it":"Classifica globale","es":"Clasificación global","de":"Globale Rangliste","pt":"Classificação global"},
  "Victoires, % victoires, score moyen": {"en":"Wins, win rate, average score","it":"Vittorie, % vittorie, punteggio medio","es":"Victorias, % victorias, puntuación media","de":"Siege, Siegquote, Durchschnittspunktzahl","pt":"Vitórias, % vitórias, pontuação média"},
  "Suites (même couleur) & Familles (même valeur) — Jokers et Bonus sont wild": {"en":"Runs (same colour) & Books (same value) — Jokers and Wild cards are wild","it":"Scale (stesso colore) e Tris (stesso valore) — Jolly e carta jolly sono wild","es":"Escaleras (mismo color) y Tríos (mismo valor) — Comodines y carta comodín son wild","de":"Folgen (gleiche Farbe) & Sätze (gleicher Wert) — Joker und Wild-Karte sind wild","pt":"Sequências (mesma cor) e Trios (mesmo valor) — Jokers e carta curinga são wild"},

  /* ── Authentification ───────────────────────────────────────────── */
  "Bienvenue !": {"en":"Welcome!","it":"Benvenuto!","es":"¡Bienvenido!","de":"Willkommen!","pt":"Bem-vindo!"},
  "Connexion": {"en":"Log in","it":"Accedi","es":"Iniciar sesión","de":"Anmelden","pt":"Entrar"},
  "Inscription": {"en":"Sign up","it":"Registrati","es":"Registrarse","de":"Registrieren","pt":"Registar"},
  "Se connecter": {"en":"Log in","it":"Accedi","es":"Iniciar sesión","de":"Anmelden","pt":"Entrar"},
  "Créer le compte": {"en":"Create account","it":"Crea account","es":"Crear cuenta","de":"Konto erstellen","pt":"Criar conta"},
  "Continuer sans compte": {"en":"Continue without an account","it":"Continua senza account","es":"Continuar sin cuenta","de":"Ohne Konto fortfahren","pt":"Continuar sem conta"},
  "Mot de passe oublié ?": {"en":"Forgot password?","it":"Password dimenticata?","es":"¿Olvidaste la contraseña?","de":"Passwort vergessen?","pt":"Esqueceste-te da palavra-passe?"},
  "Mot de passe oublié": {"en":"Forgot password","it":"Password dimenticata","es":"Olvidé la contraseña","de":"Passwort vergessen","pt":"Esqueci a palavra-passe"},
  "Se déconnecter": {"en":"Log out","it":"Esci","es":"Cerrar sesión","de":"Abmelden","pt":"Sair"},
  "Connexion en cours…": {"en":"Connecting…","it":"Connessione…","es":"Conectando…","de":"Verbinde…","pt":"A ligar…"},
  "Chargement…": {"en":"Loading…","it":"Caricamento…","es":"Cargando…","de":"Wird geladen…","pt":"A carregar…"},

  /* ── Configuration de partie ────────────────────────────────────── */
  "Partie locale": {"en":"Local game","it":"Partita locale","es":"Partida local","de":"Lokales Spiel","pt":"Jogo local"},
  "Format de partie": {"en":"Game format","it":"Formato partita","es":"Formato de partida","de":"Spielformat","pt":"Formato de jogo"},
  "Complète": {"en":"Full","it":"Completa","es":"Completa","de":"Komplett","pt":"Completa"},
  "Rapide": {"en":"Quick","it":"Rapida","es":"Rápida","de":"Schnell","pt":"Rápida"},
  "11 manches · 3→13 cartes": {"en":"11 rounds · 3→13 cards","it":"11 mani · 3→13 carte","es":"11 rondas · 3→13 cartas","de":"11 Runden · 3→13 Karten","pt":"11 mãos · 3→13 cartas"},
  "8 manches · 6→13 cartes": {"en":"8 rounds · 6→13 cards","it":"8 mani · 6→13 carte","es":"8 rondas · 6→13 cartas","de":"8 Runden · 6→13 Karten","pt":"8 mãos · 6→13 cartas"},
  "Nombre de joueurs": {"en":"Number of players","it":"Numero di giocatori","es":"Número de jugadores","de":"Anzahl der Spieler","pt":"Número de jogadores"},
  "Configuration": {"en":"Setup","it":"Configurazione","es":"Configuración","de":"Konfiguration","pt":"Configuração"},
  "Jouer !": {"en":"Play!","it":"Gioca!","es":"¡Jugar!","de":"Spielen!","pt":"Jogar!"},
  "Joueur": {"en":"Player","it":"Giocatore","es":"Jugador","de":"Spieler","pt":"Jogador"},

  /* ── Multijoueur / réseau ───────────────────────────────────────── */
  "Multijoueur": {"en":"Multiplayer","it":"Multigiocatore","es":"Multijugador","de":"Mehrspieler","pt":"Multijogador"},
  "Créer une partie": {"en":"Create a game","it":"Crea una partita","es":"Crear una partida","de":"Spiel erstellen","pt":"Criar um jogo"},
  "Créer la partie": {"en":"Create game","it":"Crea partita","es":"Crear partida","de":"Spiel erstellen","pt":"Criar jogo"},
  "Adversaires IA": {"en":"AI opponents","it":"Avversari IA","es":"Rivales IA","de":"KI-Gegner","pt":"Adversários IA"},
  "Rejoindre une partie": {"en":"Join a game","it":"Unisciti a una partita","es":"Unirse a una partida","de":"Spiel beitreten","pt":"Entrar num jogo"},
  "Rejoindre →": {"en":"Join →","it":"Unisciti →","es":"Unirse →","de":"Beitreten →","pt":"Entrar →"},
  "Code de la partie": {"en":"Game code","it":"Codice partita","es":"Código de partida","de":"Spielcode","pt":"Código do jogo"},
  "Ton code :": {"en":"Your code:","it":"Il tuo codice:","es":"Tu código:","de":"Dein Code:","pt":"O teu código:"},
  "Partage ce code avec les autres joueurs": {"en":"Share this code with the other players","it":"Condividi questo codice con gli altri giocatori","es":"Comparte este código con los demás jugadores","de":"Teile diesen Code mit den anderen Spielern","pt":"Partilha este código com os outros jogadores"},
  "Copier le code": {"en":"Copy code","it":"Copia codice","es":"Copiar código","de":"Code kopieren","pt":"Copiar código"},
  "Copier": {"en":"Copy","it":"Copia","es":"Copiar","de":"Kopieren","pt":"Copiar"},
  "Inviter par SMS": {"en":"Invite by SMS","it":"Invita via SMS","es":"Invitar por SMS","de":"Per SMS einladen","pt":"Convidar por SMS"},
  "Inviter un ami": {"en":"Invite a friend","it":"Invita un amico","es":"Invitar a un amigo","de":"Freund einladen","pt":"Convidar um amigo"},
  "Démarrer la partie !": {"en":"Start the game!","it":"Inizia la partita!","es":"¡Empezar la partida!","de":"Spiel starten!","pt":"Começar o jogo!"},
  "Retour au lobby": {"en":"Back to lobby","it":"Torna alla lobby","es":"Volver al vestíbulo","de":"Zurück zur Lobby","pt":"Voltar ao átrio"},
  "Spectateur": {"en":"Spectator","it":"Spettatore","es":"Espectador","de":"Zuschauer","pt":"Espetador"},
  "Réessayer →": {"en":"Retry →","it":"Riprova →","es":"Reintentar →","de":"Erneut versuchen →","pt":"Tentar de novo →"},

  /* ── Écran de jeu ───────────────────────────────────────────────── */
  "Pioche": {"en":"Draw","it":"Mazzo","es":"Robar","de":"Nachziehen","pt":"Baralho"},
  "Défausse": {"en":"Discard","it":"Scarti","es":"Descarte","de":"Ablage","pt":"Descarte"},
  "Défausser": {"en":"Discard","it":"Scarta","es":"Descartar","de":"Ablegen","pt":"Descartar"},
  "Votre main": {"en":"Your hand","it":"La tua mano","es":"Tu mano","de":"Deine Hand","pt":"A tua mão"},
  "Main cachée": {"en":"Hidden hand","it":"Mano nascosta","es":"Mano oculta","de":"Verdeckte Hand","pt":"Mão escondida"},
  "Votre tour": {"en":"Your turn","it":"Il tuo turno","es":"Tu turno","de":"Du bist dran","pt":"A tua vez"},
  "À ton tour !": {"en":"Your turn!","it":"Tocca a te!","es":"¡Te toca!","de":"Du bist dran!","pt":"É a tua vez!"},
  "C'est ton tour !": {"en":"It's your turn!","it":"È il tuo turno!","es":"¡Es tu turno!","de":"Du bist am Zug!","pt":"É a tua vez!"},
  "Exposez !": {"en":"Go out!","it":"Chiudi!","es":"¡Cierra!","de":"Geh raus!","pt":"Fecha!"},
  "Exposer": {"en":"Go out","it":"Chiudere","es":"Cerrar","de":"Rausgehen","pt":"Fechar"},
  "Annuler un coup": {"en":"Undo a move","it":"Annulla una mossa","es":"Deshacer una jugada","de":"Zug rückgängig machen","pt":"Anular uma jogada"},
  "Annuler": {"en":"Cancel","it":"Annulla","es":"Cancelar","de":"Abbrechen","pt":"Cancelar"},
  "Passer": {"en":"Skip","it":"Salta","es":"Saltar","de":"Überspringen","pt":"Saltar"},
  "Passer ✕": {"en":"Skip ✕","it":"Salta ✕","es":"Saltar ✕","de":"Überspringen ✕","pt":"Saltar ✕"},
  "Quitter": {"en":"Leave","it":"Esci","es":"Salir","de":"Verlassen","pt":"Sair"},
  "Suivant →": {"en":"Next →","it":"Avanti →","es":"Siguiente →","de":"Weiter →","pt":"Seguinte →"},
  "Continuer": {"en":"Continue","it":"Continua","es":"Continuar","de":"Weiter","pt":"Continuar"},
  "Fin de Manche": {"en":"End of round","it":"Fine mano","es":"Fin de ronda","de":"Rundenende","pt":"Fim da mão"},
  "Manche Suivante": {"en":"Next round","it":"Mano successiva","es":"Siguiente ronda","de":"Nächste Runde","pt":"Mão seguinte"},
  "Classement Final": {"en":"Final ranking","it":"Classifica finale","es":"Clasificación final","de":"Endstand","pt":"Classificação final"},
  "Revanche !": {"en":"Rematch!","it":"Rivincita!","es":"¡Revancha!","de":"Revanche!","pt":"Desforra!"},
  "Le plateau": {"en":"The board","it":"Il tavolo","es":"La mesa","de":"Das Spielfeld","pt":"A mesa"},
  "Plis organisés": {"en":"Organised melds","it":"Combinazioni organizzate","es":"Combinaciones organizadas","de":"Geordnete Kombinationen","pt":"Combinações organizadas"},
  "Dans un pli": {"en":"In a meld","it":"In una combinazione","es":"En una combinación","de":"In einer Kombination","pt":"Numa combinação"},
  "Réaction": {"en":"Reaction","it":"Reazione","es":"Reacción","de":"Reaktion","pt":"Reação"},
  "Réactions emoji": {"en":"Emoji reactions","it":"Reazioni emoji","es":"Reacciones emoji","de":"Emoji-Reaktionen","pt":"Reações emoji"},
  "secondes restantes": {"en":"seconds left","it":"secondi rimasti","es":"segundos restantes","de":"Sekunden übrig","pt":"segundos restantes"},
  "Révéler ma main 🃏": {"en":"Reveal my hand 🃏","it":"Rivela la mia mano 🃏","es":"Revelar mi mano 🃏","de":"Meine Hand aufdecken 🃏","pt":"Revelar a minha mão 🃏"},
  "Passez l'appareil, puis révélez votre main.": {"en":"Pass the device, then reveal your hand.","it":"Passa il dispositivo, poi rivela la tua mano.","es":"Pasa el dispositivo y revela tu mano.","de":"Gib das Gerät weiter und decke dann deine Hand auf.","pt":"Passa o dispositivo e revela a tua mão."},
  "C'est parti ! 🎴": {"en":"Let's go! 🎴","it":"Si comincia! 🎴","es":"¡Vamos! 🎴","de":"Los geht's! 🎴","pt":"Vamos lá! 🎴"},

  /* ── Classement ─────────────────────────────────────────────────── */
  "Classement Global": {"en":"Global ranking","it":"Classifica globale","es":"Clasificación global","de":"Globale Rangliste","pt":"Classificação global"},
  "Les 2": {"en":"Both","it":"Entrambe","es":"Ambas","de":"Beide","pt":"Ambas"},
  "Victoires": {"en":"Wins","it":"Vittorie","es":"Victorias","de":"Siege","pt":"Vitórias"},
  "% Victoires": {"en":"Win rate","it":"% Vittorie","es":"% Victorias","de":"Siegquote","pt":"% Vitórias"},
  "Moy. score": {"en":"Avg. score","it":"Punt. medio","es":"Punt. media","de":"Ø Punkte","pt":"Pont. média"},
  "Rang": {"en":"Rank","it":"Pos.","es":"Puesto","de":"Rang","pt":"Posição"},
  "Score": {"en":"Score","it":"Punteggio","es":"Puntuación","de":"Punkte","pt":"Pontuação"},
  "Aucune partie jouée": {"en":"No games played","it":"Nessuna partita giocata","es":"Ninguna partida jugada","de":"Keine Spiele gespielt","pt":"Nenhum jogo jogado"},
  "Dernières parties": {"en":"Recent games","it":"Ultime partite","es":"Últimas partidas","de":"Letzte Spiele","pt":"Últimos jogos"},

  /* ── Amis / profil ──────────────────────────────────────────────── */
  "Mes amis": {"en":"My friends","it":"I miei amici","es":"Mis amigos","de":"Meine Freunde","pt":"Os meus amigos"},
  "Ajouter un ami": {"en":"Add a friend","it":"Aggiungi un amico","es":"Añadir un amigo","de":"Freund hinzufügen","pt":"Adicionar um amigo"},
  "Aucun ami pour l'instant": {"en":"No friends yet","it":"Ancora nessun amico","es":"Aún no tienes amigos","de":"Noch keine Freunde","pt":"Ainda sem amigos"},
  "Demandes reçues": {"en":"Received requests","it":"Richieste ricevute","es":"Solicitudes recibidas","de":"Erhaltene Anfragen","pt":"Pedidos recebidos"},
  "Avatar": {"en":"Avatar","it":"Avatar","es":"Avatar","de":"Avatar","pt":"Avatar"},
  "Enregistrer": {"en":"Save","it":"Salva","es":"Guardar","de":"Speichern","pt":"Guardar"},
  "Réinitialiser": {"en":"Reset","it":"Reimposta","es":"Restablecer","de":"Zurücksetzen","pt":"Repor"},
  "Parrainage": {"en":"Referral","it":"Invita un amico","es":"Programa de referidos","de":"Empfehlung","pt":"Indicação"},
  "Parrainage & thèmes exclusifs": {"en":"Referral & exclusive themes","it":"Inviti e temi esclusivi","es":"Referidos y temas exclusivos","de":"Empfehlungen & exklusive Designs","pt":"Indicações e temas exclusivos"},
  "Thèmes débloqués :": {"en":"Unlocked themes:","it":"Temi sbloccati:","es":"Temas desbloqueados:","de":"Freigeschaltete Designs:","pt":"Temas desbloqueados:"},
  "Couleurs des cartes": {"en":"Card colours","it":"Colori delle carte","es":"Colores de las cartas","de":"Kartenfarben","pt":"Cores das cartas"},
  "Couleurs standard": {"en":"Standard colours","it":"Colori standard","es":"Colores estándar","de":"Standardfarben","pt":"Cores padrão"},
  "Palettes prédéfinies": {"en":"Preset palettes","it":"Tavolozze predefinite","es":"Paletas predefinidas","de":"Vordefinierte Paletten","pt":"Paletas predefinidas"},
  "Vos couleurs — appuyez pour modifier": {"en":"Your colours — tap to change","it":"I tuoi colori — tocca per modificare","es":"Tus colores — toca para cambiar","de":"Deine Farben — zum Ändern tippen","pt":"As tuas cores — toca para alterar"},
  "Deutéranopie": {"en":"Deuteranopia","it":"Deuteranopia","es":"Deuteranopía","de":"Deuteranopie","pt":"Deuteranopia"},
  "Mise à jour prête — Appuyez pour redémarrer": {"en":"Update ready — Tap to restart","it":"Aggiornamento pronto — Tocca per riavviare","es":"Actualización lista — Toca para reiniciar","de":"Update bereit — Zum Neustart tippen","pt":"Atualização pronta — Toca para reiniciar"},

  /* ── Cartes / valeurs ───────────────────────────────────────────── */
  "Carte Bonus": {"en":"Wild card","it":"Carta jolly","es":"Carta comodín","de":"Wild-Karte","pt":"Carta curinga"},
  "La carte Bonus": {"en":"The Wild card","it":"La carta jolly","es":"La carta comodín","de":"Die Wild-Karte","pt":"A carta curinga"},
  "La Carte Bonus": {"en":"The Wild card","it":"La carta jolly","es":"La carta comodín","de":"Die Wild-Karte","pt":"A carta curinga"},
  "Joker": {"en":"Joker","it":"Jolly","es":"Comodín","de":"Joker","pt":"Joker"},
  "Valet (J)": {"en":"Jack (J)","it":"Fante (J)","es":"Jota (J)","de":"Bube (J)","pt":"Valete (J)"},
  "Dame (Q)": {"en":"Queen (Q)","it":"Donna (Q)","es":"Reina (Q)","de":"Dame (Q)","pt":"Dama (Q)"},
  "Roi (K)": {"en":"King (K)","it":"Re (K)","es":"Rey (K)","de":"König (K)","pt":"Rei (K)"},
  "Valeur faciale": {"en":"Face value","it":"Valore nominale","es":"Valor nominal","de":"Nennwert","pt":"Valor facial"},
  "Valeur des cartes": {"en":"Card values","it":"Valore delle carte","es":"Valor de las cartas","de":"Kartenwerte","pt":"Valor das cartas"},
  "20 pts (wildcard !)": {"en":"20 pts (wild!)","it":"20 pti (jolly!)","es":"20 pts (¡comodín!)","de":"20 Pkt (wild!)","pt":"20 pts (curinga!)"},
  "Étoile": {"en":"Star","it":"Stella","es":"Estrella","de":"Stern","pt":"Estrela"},
  "Trèfle": {"en":"Club","it":"Fiori","es":"Trébol","de":"Kreuz","pt":"Paus"},

  /* ── Règles (fragments : le HTML découpe ces phrases) ───────────── */
  "Retour": {"en":"Back","it":"Indietro","es":"Atrás","de":"Zurück","pt":"Voltar"},
  "11 pts": {"en":"11 pts","it":"11 pti","es":"11 pts","de":"11 Pkt","pt":"11 pts"},
  "12 pts": {"en":"12 pts","it":"12 pti","es":"12 pts","de":"12 Pkt","pt":"12 pts"},
  "13 pts": {"en":"13 pts","it":"13 pti","es":"13 pts","de":"13 Pkt","pt":"13 pts"},
  "50 pts": {"en":"50 pts","it":"50 pti","es":"50 pts","de":"50 Pkt","pt":"50 pts"},
  "11 manches · Bonus change chaque manche · Plus bas score gagne": {"en":"11 rounds · Wild card changes each round · Lowest score wins","it":"11 mani · Il jolly cambia a ogni mano · Vince il punteggio più basso","es":"11 rondas · El comodín cambia cada ronda · Gana la puntuación más baja","de":"11 Runden · Wild-Karte wechselt jede Runde · Niedrigste Punktzahl gewinnt","pt":"11 mãos · A carta curinga muda a cada mão · Ganha a pontuação mais baixa"},
  "Obtenir le score le plus bas après 11 manches. Formez des": {"en":"Get the lowest score after 11 rounds. Form","it":"Ottieni il punteggio più basso dopo 11 mani. Forma","es":"Consigue la puntuación más baja tras 11 rondas. Forma","de":"Erreiche nach 11 Runden die niedrigste Punktzahl. Bilde","pt":"Obtém a pontuação mais baixa após 11 mãos. Forma"},
  "pour minimiser vos points de pénalité.": {"en":"to minimise your penalty points.","it":"per ridurre al minimo i punti di penalità.","es":"para minimizar tus puntos de penalización.","de":"um deine Strafpunkte zu minimieren.","pt":"para minimizar os teus pontos de penalização."},
  "116 cartes (2 jeux de 58) en 5 couleurs : ⭐ Étoiles, ♥ Cœurs, ♣ Trèfles, ♠ Piques, ♦ Carreaux. Chaque couleur a 11 cartes (3 à 10, J, Q, K) + 6 Jokers.": {"en": "116 cards (2 decks of 58) in 5 colours: ⭐ Stars, ♥ Hearts, ♣ Clubs, ♠ Spades, ♦ Diamonds. Each colour has 11 cards (3 to 10, J, Q, K) + 6 Jokers.", "it": "116 carte (2 mazzi da 58) in 5 colori: ⭐ Stelle, ♥ Cuori, ♣ Fiori, ♠ Picche, ♦ Quadri. Ogni colore ha 11 carte (da 3 a 10, J, Q, K) + 6 jolly.", "es": "116 cartas (2 barajas de 58) en 5 colores: ⭐ Estrellas, ♥ Corazones, ♣ Tréboles, ♠ Picas, ♦ Diamantes. Cada color tiene 11 cartas (3 a 10, J, Q, K) + 6 comodines.", "de": "116 Karten (2 Decks à 58) in 5 Farben: ⭐ Sterne, ♥ Herz, ♣ Kreuz, ♠ Pik, ♦ Karo. Jede Farbe hat 11 Karten (3 bis 10, B, D, K) + 6 Joker.", "pt": "116 cartas (2 baralhos de 58) em 5 cores: ⭐ Estrelas, ♥ Copas, ♣ Paus, ♠ Espadas, ♦ Ouros. Cada cor tem 11 cartas (3 a 10, J, Q, K) + 6 jokers."},
  "La carte Bonus change à chaque manche : c'est la carte dont la valeur = nombre de cartes distribuées. Manche 3 → les 3 sont Bonus. Manche 13 → les Rois sont Bonus. Elle remplace n'importe quelle carte dans une combinaison !": {"en":"The Wild card changes every round: it is the card whose value = the number of cards dealt. Round 3 → the 3s are wild. Round 13 → the Kings are wild. It replaces any card in a meld!","it":"La carta jolly cambia a ogni mano: è la carta il cui valore = numero di carte distribuite. Mano 3 → i 3 sono jolly. Mano 13 → i Re sono jolly. Sostituisce qualsiasi carta in una combinazione!","es":"La carta comodín cambia cada ronda: es la carta cuyo valor = número de cartas repartidas. Ronda 3 → los 3 son comodines. Ronda 13 → los Reyes son comodines. ¡Sustituye a cualquier carta en una combinación!","de":"Die Wild-Karte wechselt jede Runde: Es ist die Karte, deren Wert = Anzahl der ausgeteilten Karten. Runde 3 → die 3en sind wild. Runde 13 → die Könige sind wild. Sie ersetzt jede Karte in einer Kombination!","pt":"A carta curinga muda a cada mão: é a carta cujo valor = número de cartas distribuídas. Mão 3 → os 3 são curingas. Mão 13 → os Reis são curingas. Substitui qualquer carta numa combinação!"},
  "vos cartes en suites/familles (en gardant une à défausser), étalez vos combinaisons. Les autres joueurs ont encore": {"en": "your cards into runs/books (keeping one to discard), lay down your melds. The other players still get", "it": "le tue carte in scale/tris (tenendone una da scartare), cala le combinazioni. Gli altri giocatori hanno ancora", "es": "tus cartas en escaleras/tríos (guardando una para descartar), baja tus combinaciones. Los demás jugadores tienen aún", "de": "deine Karten in Folgen/Sätze ordnen kannst (eine zum Ablegen behalten), lege deine Kombinationen aus. Die anderen Spieler haben noch", "pt": "as tuas cartas em sequências/trios (guardando uma para descartar), baixa as combinações. Os outros jogadores têm ainda"},
  "pour optimiser leur main. Seules les cartes restantes en main comptent comme pénalités.": {"en":"to optimise their hand. Only the cards left in hand count as penalties.","it":"per ottimizzare la loro mano. Solo le carte rimaste in mano contano come penalità.","es":"para optimizar su mano. Solo las cartas que quedan en la mano cuentan como penalización.","de":"um ihre Hand zu optimieren. Nur die Karten auf der Hand zählen als Strafpunkte.","pt":"para otimizar a mão. Só as cartas que ficam na mão contam como penalização."},
  "\"La partie n'est pas perdue tant que les Rois ne sont pas le Bonus\"": {"en":"\"The game isn't lost until the Kings are wild\"","it":"\"La partita non è persa finché i Re non sono jolly\"","es":"\"La partida no está perdida hasta que los Reyes sean comodines\"","de":"\"Das Spiel ist nicht verloren, solange die Könige nicht wild sind\"","pt":"\"O jogo não está perdido enquanto os Reis não forem curingas\""},
  "Ex : 5♣ 6♣ 7♣ ou 9⭐ 10⭐ J⭐ Q⭐": {"en":"E.g. 5♣ 6♣ 7♣ or 9⭐ 10⭐ J⭐ Q⭐","it":"Es. 5♣ 6♣ 7♣ o 9⭐ 10⭐ J⭐ Q⭐","es":"Ej. 5♣ 6♣ 7♣ o 9⭐ 10⭐ J⭐ Q⭐","de":"z.B. 5♣ 6♣ 7♣ oder 9⭐ 10⭐ J⭐ Q⭐","pt":"Ex.: 5♣ 6♣ 7♣ ou 9⭐ 10⭐ J⭐ Q⭐"},
  "Ex : 8♣ 8⭐ 8♠ ou K♣ K♥ K♦ K⭐": {"en":"E.g. 8♣ 8⭐ 8♠ or K♣ K♥ K♦ K⭐","it":"Es. 8♣ 8⭐ 8♠ o K♣ K♥ K♦ K⭐","es":"Ej. 8♣ 8⭐ 8♠ o K♣ K♥ K♦ K⭐","de":"z.B. 8♣ 8⭐ 8♠ oder K♣ K♥ K♦ K⭐","pt":"Ex.: 8♣ 8⭐ 8♠ ou K♣ K♥ K♦ K⭐"},
  "Connexion perdue — Vérifiez votre réseau": {"en":"Connection lost — Check your network","it":"Connessione persa — Controlla la rete","es":"Conexión perdida — Comprueba tu red","de":"Verbindung verloren — Prüfe dein Netzwerk","pt":"Ligação perdida — Verifica a tua rede"},
  "Objectif": {"en":"Goal","it":"Obiettivo","es":"Objetivo","de":"Ziel","pt":"Objetivo"},
  "Suites": {"en":"Runs","it":"Scale","es":"Escaleras","de":"Folgen","pt":"Sequências"},
  "suites": {"en":"runs","it":"scale","es":"escaleras","de":"Folgen","pt":"sequências"},
  "Familles": {"en":"Books","it":"Tris","es":"Tríos","de":"Sätze","pt":"Trios"},
  "familles": {"en":"books","it":"tris","es":"tríos","de":"Sätze","pt":"trios"},
  "Conseils": {"en":"Tips","it":"Consigli","es":"Consejos","de":"Tipps","pt":"Dicas"},
  "Déroulement d'un tour": {"en":"How a turn works","it":"Svolgimento di un turno","es":"Desarrollo de un turno","de":"Ablauf eines Zuges","pt":"Como decorre um turno"},
  "même couleur": {"en":"same colour","it":"stesso colore","es":"mismo color","de":"gleiche Farbe","pt":"mesma cor"},
  "même valeur": {"en":"same value","it":"stesso valore","es":"mismo valor","de":"gleicher Wert","pt":"mesmo valor"},
  "en séquence.": {"en":"in sequence.","it":"in sequenza.","es":"en secuencia.","de":"in Folge.","pt":"em sequência."},
  ", quelle que soit la couleur.": {"en":", regardless of colour.","it":", indipendentemente dal colore.","es":", sin importar el color.","de":", unabhängig von der Farbe.","pt":", independentemente da cor."},
  "3 cartes ou plus de la": {"en":"3 or more cards of the","it":"3 o più carte dello","es":"3 o más cartas del","de":"3 oder mehr Karten der","pt":"3 ou mais cartas da"},
  "Piochez 1 carte (pioche ou défausse)": {"en":"Draw 1 card (deck or discard)","it":"Pesca 1 carta (mazzo o scarti)","es":"Roba 1 carta (mazo o descarte)","de":"Ziehe 1 Karte (Stapel oder Ablage)","pt":"Tira 1 carta (baralho ou descarte)"},
  "Défaussez 1 carte": {"en":"Discard 1 card","it":"Scarta 1 carta","es":"Descarta 1 carta","de":"Lege 1 Karte ab","pt":"Descarta 1 carta"},
  "Organisez vos cartes en suites/familles": {"en":"Organise your cards into runs/books","it":"Organizza le carte in scale/tris","es":"Organiza tus cartas en escaleras/tríos","de":"Ordne deine Karten in Folgen/Sätze","pt":"Organiza as cartas em sequências/trios"},
  "Les Jokers et Bonus remplacent n'importe quelle carte.": {"en":"Jokers and Wild cards replace any card.","it":"Jolly e carta jolly sostituiscono qualsiasi carta.","es":"Comodines y carta comodín sustituyen a cualquier carta.","de":"Joker und Wild-Karten ersetzen jede Karte.","pt":"Jokers e cartas curinga substituem qualquer carta."},
  "Gardez un œil sur la carte Bonus du tour": {"en":"Keep an eye on this round's Wild card","it":"Tieni d'occhio la carta jolly del turno","es":"Vigila la carta comodín de la ronda","de":"Behalte die Wild-Karte der Runde im Auge","pt":"Fica atento à carta curinga da mão"},
  "Méfiez-vous des Jokers (50 pts si non combinés !)": {"en":"Beware of Jokers (50 pts if unmelded!)","it":"Attenzione ai jolly (50 pti se non combinati!)","es":"Cuidado con los comodines (¡50 pts si no se combinan!)","de":"Vorsicht bei Jokern (50 Pkt, wenn nicht kombiniert!)","pt":"Cuidado com os jokers (50 pts se não combinados!)"},
  "Si un Joker est défaussé, seul le joueur suivant peut le prendre": {"en":"If a Joker is discarded, only the next player may take it","it":"Se un jolly viene scartato, solo il giocatore successivo può prenderlo","es":"Si se descarta un comodín, solo el siguiente jugador puede tomarlo","de":"Wird ein Joker abgelegt, darf ihn nur der nächste Spieler nehmen","pt":"Se um joker for descartado, só o jogador seguinte o pode tirar"},
  "Si toutes vos cartes forment des combinaisons →": {"en":"If all your cards form melds →","it":"Se tutte le tue carte formano combinazioni →","es":"Si todas tus cartas forman combinaciones →","de":"Wenn alle deine Karten Kombinationen bilden →","pt":"Se todas as tuas cartas formarem combinações →"},
  "un dernier tour": {"en":"one last turn","it":"un ultimo turno","es":"un último turno","de":"eine letzte Runde","pt":"um último turno"},
  "Quand vous pouvez organiser": {"en":"When you can organise","it":"Quando puoi organizzare","es":"Cuando puedas organizar","de":"Wenn du","pt":"Quando conseguires organizar"},
  "toutes": {"en":"all","it":"tutte","es":"todas","de":"alle","pt":"todas"},
  "et des": {"en":"and","it":"e","es":"y","de":"und","pt":"e"},
  "ou": {"en":"or","it":"o","es":"o","de":"oder","pt":"ou"},

  /* ── FRAGMENTS DYNAMIQUES (pour window.crT — nécessitent une modif du JS) ── */
  "Tu pioches ": {"en":"You draw ","it":"Peschi ","es":"Robas ","de":"Du ziehst ","pt":"Tiras "},
  "Tu prends ": {"en":"You take ","it":"Prendi ","es":"Tomas ","de":"Du nimmst ","pt":"Tiras "},
  "Tu défausses ": {"en":"You discard ","it":"Scarti ","es":"Descartas ","de":"Du legst ab ","pt":"Descartas "},
  ". Sélectionne une carte à défausser.": {"en":". Select a card to discard.","it":". Seleziona una carta da scartare.","es":". Selecciona una carta para descartar.","de":". Wähle eine Karte zum Ablegen.","pt":". Seleciona uma carta para descartar."},
  "un Joker": {"en":"a Joker","it":"un jolly","es":"un comodín","de":"einen Joker","pt":"um joker"},
  "Piochez une carte": {"en":"Draw a card","it":"Pesca una carta","es":"Roba una carta","de":"Ziehe eine Karte","pt":"Tira uma carta"},
  "Piochez une carte.": {"en":"Draw a card.","it":"Pesca una carta.","es":"Roba una carta.","de":"Ziehe eine Karte.","pt":"Tira uma carta."},
  "Clique la pioche ou la défausse": {"en":"Tap the deck or the discard pile","it":"Tocca il mazzo o gli scarti","es":"Toca el mazo o el descarte","de":"Tippe auf den Stapel oder die Ablage","pt":"Toca no baralho ou no descarte"},
  "Sélectionne la carte à défausser": {"en":"Select the card to discard","it":"Seleziona la carta da scartare","es":"Selecciona la carta a descartar","de":"Wähle die Karte zum Ablegen","pt":"Seleciona a carta a descartar"},
  "Sélectionne la carte à défausser.": {"en":"Select the card to discard.","it":"Seleziona la carta da scartare.","es":"Selecciona la carta a descartar.","de":"Wähle die Karte zum Ablegen.","pt":"Seleciona a carta a descartar."},
  "Sélectionne d'abord une carte à défausser.": {"en":"First select a card to discard.","it":"Prima seleziona una carta da scartare.","es":"Primero selecciona una carta para descartar.","de":"Wähle zuerst eine Karte zum Ablegen.","pt":"Primeiro seleciona uma carta para descartar."},
  "La carte à défausser doit être en main.": {"en":"The card to discard must be in your hand.","it":"La carta da scartare deve essere in mano.","es":"La carta a descartar debe estar en tu mano.","de":"Die abzulegende Karte muss auf der Hand sein.","pt":"A carta a descartar tem de estar na mão."},
  "Remets la carte en main avant de la défausser.": {"en":"Put the card back in your hand before discarding it.","it":"Rimetti la carta in mano prima di scartarla.","es":"Devuelve la carta a tu mano antes de descartarla.","de":"Nimm die Karte zurück auf die Hand, bevor du sie ablegst.","pt":"Volta a pôr a carta na mão antes de a descartares."},
  "Toutes tes cartes sont dans des plis": {"en":"All your cards are in melds","it":"Tutte le tue carte sono in combinazioni","es":"Todas tus cartas están en combinaciones","de":"Alle deine Karten sind in Kombinationen","pt":"Todas as tuas cartas estão em combinações"},
  "Sélectionne une carte, puis \"+ Nouveau pli\"": {"en":"Select a card, then \"+ New meld\"","it":"Seleziona una carta, poi \"+ Nuova combinazione\"","es":"Selecciona una carta y luego \"+ Nueva combinación\"","de":"Wähle eine Karte, dann \"+ Neue Kombination\"","pt":"Seleciona uma carta e depois \"+ Nova combinação\""},
  "Sélectionnée — défausse, abat ou mets dans un pli": {"en":"Selected — discard, go out, or add to a meld","it":"Selezionata — scarta, chiudi o metti in una combinazione","es":"Seleccionada — descarta, cierra o ponla en una combinación","de":"Ausgewählt — ablegen, rausgehen oder in eine Kombination legen","pt":"Selecionada — descarta, fecha ou põe numa combinação"},
  "Impossible d'abattre ! Vérifiez vos combinaisons.": {"en":"Cannot go out! Check your melds.","it":"Impossibile chiudere! Controlla le combinazioni.","es":"¡No puedes cerrar! Revisa tus combinaciones.","de":"Rausgehen nicht möglich! Prüfe deine Kombinationen.","pt":"Não podes fechar! Verifica as tuas combinações."},
  "Impossible d'abattre ! Les cartes restantes ne forment pas des combinaisons.": {"en":"Cannot go out! The remaining cards do not form melds.","it":"Impossibile chiudere! Le carte rimaste non formano combinazioni.","es":"¡No puedes cerrar! Las cartas restantes no forman combinaciones.","de":"Rausgehen nicht möglich! Die restlichen Karten bilden keine Kombinationen.","pt":"Não podes fechar! As cartas restantes não formam combinações."},
  "Ce Joker est réservé au joueur suivant !": {"en":"This Joker is reserved for the next player!","it":"Questo jolly è riservato al giocatore successivo!","es":"¡Este comodín está reservado al siguiente jugador!","de":"Dieser Joker ist für den nächsten Spieler reserviert!","pt":"Este joker está reservado ao jogador seguinte!"},
  "Joker réservé au joueur suivant": {"en":"Joker reserved for the next player","it":"Jolly riservato al giocatore successivo","es":"Comodín reservado al siguiente jugador","de":"Joker für den nächsten Spieler reserviert","pt":"Joker reservado ao jogador seguinte"},
  "Chargement de la pub…": {"en":"Loading ad…","it":"Caricamento pubblicità…","es":"Cargando anuncio…","de":"Werbung wird geladen…","pt":"A carregar anúncio…"},
  "Pub non disponible, réessaie plus tard.": {"en":"Ad unavailable, try again later.","it":"Pubblicità non disponibile, riprova più tardi.","es":"Anuncio no disponible, inténtalo más tarde.","de":"Werbung nicht verfügbar, versuch es später.","pt":"Anúncio indisponível, tenta mais tarde."},
  "Pub indisponible sur cette plateforme.": {"en":"Ads unavailable on this platform.","it":"Pubblicità non disponibile su questa piattaforma.","es":"Anuncios no disponibles en esta plataforma.","de":"Werbung auf dieser Plattform nicht verfügbar.","pt":"Anúncios indisponíveis nesta plataforma."},
  "Sauvegarde illisible, impossible de reprendre.": {"en":"Save file unreadable, cannot resume.","it":"Salvataggio illeggibile, impossibile riprendere.","es":"Guardado ilegible, no se puede reanudar.","de":"Spielstand unlesbar, Fortsetzen nicht möglich.","pt":"Gravação ilegível, não é possível retomar."},
  "Temps écoulé — pioche automatique": {"en":"Time's up — automatic draw","it":"Tempo scaduto — pesca automatica","es":"Tiempo agotado — robo automático","de":"Zeit abgelaufen — automatisches Ziehen","pt":"Tempo esgotado — tirada automática"},
  "Dernier tour ! Piochez puis défaussez.": {"en":"Last turn! Draw then discard.","it":"Ultimo turno! Pesca e poi scarta.","es":"¡Último turno! Roba y descarta.","de":"Letzter Zug! Ziehen, dann ablegen.","pt":"Último turno! Tira e depois descarta."},

  /* ── Erreurs / auth (messages JS sans interpolation) ─────────────── */
  "Email et mot de passe requis.": {"en":"Email and password required.","it":"Email e password obbligatori.","es":"Correo y contraseña obligatorios.","de":"E-Mail und Passwort erforderlich.","pt":"E-mail e palavra-passe obrigatórios."},
  "Email ou mot de passe incorrect.": {"en":"Incorrect email or password.","it":"Email o password errati.","es":"Correo o contraseña incorrectos.","de":"E-Mail oder Passwort falsch.","pt":"E-mail ou palavra-passe incorretos."},
  "Email déjà utilisé.": {"en":"Email already in use.","it":"Email già in uso.","es":"Correo ya utilizado.","de":"E-Mail bereits verwendet.","pt":"E-mail já utilizado."},
  "Mot de passe incorrect.": {"en":"Incorrect password.","it":"Password errata.","es":"Contraseña incorrecta.","de":"Falsches Passwort.","pt":"Palavra-passe incorreta."},
  "Mot de passe trop court (min 6 caractères).": {"en":"Password too short (min 6 characters).","it":"Password troppo corta (min 6 caratteri).","es":"Contraseña muy corta (mín. 6 caracteres).","de":"Passwort zu kurz (min. 6 Zeichen).","pt":"Palavra-passe muito curta (mín. 6 caracteres)."},
  "Aucun compte avec cet email.": {"en":"No account with this email.","it":"Nessun account con questa email.","es":"No hay cuenta con este correo.","de":"Kein Konto mit dieser E-Mail.","pt":"Nenhuma conta com este e-mail."},
  "Email envoyé ! Vérifie ta boîte de réception.": {"en":"Email sent! Check your inbox.","it":"Email inviata! Controlla la posta.","es":"¡Correo enviado! Revisa tu bandeja.","de":"E-Mail gesendet! Prüfe dein Postfach.","pt":"E-mail enviado! Verifica a caixa de entrada."},
  "Entre ton email ci-dessus d'abord.": {"en":"Enter your email above first.","it":"Inserisci prima la tua email qui sopra.","es":"Introduce antes tu correo arriba.","de":"Gib zuerst oben deine E-Mail ein.","pt":"Introduz primeiro o teu e-mail acima."},
  "Erreur de connexion.": {"en":"Connection error.","it":"Errore di connessione.","es":"Error de conexión.","de":"Verbindungsfehler.","pt":"Erro de ligação."},
  "Erreur réseau. Réessaie.": {"en":"Network error. Try again.","it":"Errore di rete. Riprova.","es":"Error de red. Inténtalo de nuevo.","de":"Netzwerkfehler. Versuch's nochmal.","pt":"Erro de rede. Tenta de novo."},
  "Erreur réseau. Réessayez.": {"en":"Network error. Please try again.","it":"Errore di rete. Riprovare.","es":"Error de red. Vuelva a intentarlo.","de":"Netzwerkfehler. Bitte erneut versuchen.","pt":"Erro de rede. Tente novamente."},
  "Erreur lors de la mise à jour. Réessaie.": {"en":"Update error. Try again.","it":"Errore durante l'aggiornamento. Riprova.","es":"Error al actualizar. Inténtalo de nuevo.","de":"Fehler beim Aktualisieren. Versuch's nochmal.","pt":"Erro ao atualizar. Tenta de novo."},
  "Compte désactivé.": {"en":"Account disabled.","it":"Account disattivato.","es":"Cuenta desactivada.","de":"Konto deaktiviert.","pt":"Conta desativada."},
  "Choisis un pseudo.": {"en":"Choose a nickname.","it":"Scegli un nickname.","es":"Elige un apodo.","de":"Wähle einen Spitznamen.","pt":"Escolhe uma alcunha."},
  "Ce pseudo est déjà pris.": {"en":"This nickname is taken.","it":"Questo nickname è già in uso.","es":"Este apodo ya está en uso.","de":"Dieser Spitzname ist vergeben.","pt":"Esta alcunha já está em uso."},
  "Pseudo trop court (min 2 caractères).": {"en":"Nickname too short (min 2 characters).","it":"Nickname troppo corto (min 2 caratteri).","es":"Apodo muy corto (mín. 2 caracteres).","de":"Spitzname zu kurz (min. 2 Zeichen).","pt":"Alcunha muito curta (mín. 2 caracteres)."},
  "Changement de pseudo": {"en":"Nickname change","it":"Cambio nickname","es":"Cambio de apodo","de":"Spitzname ändern","pt":"Mudança de alcunha"},
  "Pseudo mis à jour !": {"en":"Nickname updated!","it":"Nickname aggiornato!","es":"¡Apodo actualizado!","de":"Spitzname aktualisiert!","pt":"Alcunha atualizada!"},
  "Créez d'abord une partie !": {"en":"Create a game first!","it":"Prima crea una partita!","es":"¡Crea antes una partida!","de":"Erstelle zuerst ein Spiel!","pt":"Cria primeiro um jogo!"},
  "Recréation impossible — le code a changé. Créez une nouvelle partie.": {"en":"Cannot recreate — the code has changed. Create a new game.","it":"Impossibile ricreare — il codice è cambiato. Crea una nuova partita.","es":"No se puede recrear — el código ha cambiado. Crea una nueva partida.","de":"Neuerstellen nicht möglich — der Code hat sich geändert. Erstelle ein neues Spiel.","pt":"Não é possível recriar — o código mudou. Cria um novo jogo."},
  "Invitation reçue !": {"en":"Invitation received!","it":"Invito ricevuto!","es":"¡Invitación recibida!","de":"Einladung erhalten!","pt":"Convite recebido!"},
  "Invitation par SMS": {"en":"SMS invitation","it":"Invito via SMS","es":"Invitación por SMS","de":"SMS-Einladung","pt":"Convite por SMS"},
  "Un ami": {"en":"A friend","it":"Un amico","es":"Un amigo","de":"Ein Freund","pt":"Um amigo"},
  "Un utilisateur": {"en":"A user","it":"Un utente","es":"Un usuario","de":"Ein Benutzer","pt":"Um utilizador"},
  "Hôte": {"en":"Host","it":"Host","es":"Anfitrión","de":"Gastgeber","pt":"Anfitrião"},
  "Invité": {"en":"Guest","it":"Ospite","es":"Invitado","de":"Gast","pt":"Convidado"},
  "Invité ✓": {"en":"Invited ✓","it":"Invitato ✓","es":"Invitado ✓","de":"Eingeladen ✓","pt":"Convidado ✓"},
  "Déjà invité ✓": {"en":"Already invited ✓","it":"Già invitato ✓","es":"Ya invitado ✓","de":"Bereits eingeladen ✓","pt":"Já convidado ✓"},
  "Copié !": {"en":"Copied!","it":"Copiato!","es":"¡Copiado!","de":"Kopiert!","pt":"Copiado!"},
  "Aucun résultat": {"en":"No results","it":"Nessun risultato","es":"Sin resultados","de":"Keine Ergebnisse","pt":"Sem resultados"},
  "Demande annulée.": {"en":"Request cancelled.","it":"Richiesta annullata.","es":"Solicitud cancelada.","de":"Anfrage abgebrochen.","pt":"Pedido cancelado."},
  "Réservé": {"en":"Locked","it":"Riservato","es":"Reservado","de":"Gesperrt","pt":"Reservado"},

  /* ── Réorganisation manuelle ────────────────────────────────────── */
  "Dépose la carte à l'endroit voulu.": {"en": "Drop the card where you want it.", "it": "Rilascia la carta dove vuoi.", "es": "Suelta la carta donde quieras.", "de": "Lege die Karte an die gewünschte Stelle.", "pt": "Larga a carta onde quiseres."},

  /* ── Réparation de profil ───────────────────────────────────────── */
  "Choisis ton pseudo": {"en": "Choose your nickname", "it": "Scegli il tuo soprannome", "es": "Elige tu apodo", "de": "Wähle deinen Spielernamen", "pt": "Escolhe o teu apelido"},
  "Ton compte n'a pas encore de pseudo. Choisis-en un pour apparaître au classement.": {"en": "Your account has no nickname yet. Pick one to appear in the ranking.", "it": "Il tuo account non ha ancora un soprannome. Scegline uno per apparire in classifica.", "es": "Tu cuenta aún no tiene apodo. Elige uno para aparecer en la clasificación.", "de": "Dein Konto hat noch keinen Spielernamen. Wähle einen, um in der Rangliste zu erscheinen.", "pt": "A tua conta ainda não tem apelido. Escolhe um para apareceres na classificação."},
  "Ton pseudo": {"en": "Your nickname", "it": "Il tuo soprannome", "es": "Tu apodo", "de": "Dein Spielername", "pt": "O teu apelido"},
  "Valider": {"en": "Confirm", "it": "Conferma", "es": "Confirmar", "de": "Bestätigen", "pt": "Confirmar"},

  /* ── Titre du jeu + salle d'attente ─────────────────────────────── */
  "Cinq": {"en": "Five", "it": "Cinque", "es": "Cinco", "de": "Fünf", "pt": "Cinco"},
  "Couronnes": {"en": "Crowns", "it": "Corone", "es": "Coronas", "de": "Kronen", "pt": "Coroas"},
  "Cinq Couronnes": {"en": "Five Crowns", "it": "Cinque Corone", "es": "Cinco Coronas", "de": "Fünf Kronen", "pt": "Cinco Coroas"},
  "Bienvenue dans Cinq Couronnes !": {"en": "Welcome to Five Crowns!", "it": "Benvenuto in Cinque Corone!", "es": "¡Bienvenido a Cinco Coronas!", "de": "Willkommen bei Fünf Kronen!", "pt": "Bem-vindo a Cinco Coroas!"},
  "En attente des joueurs...": {"en": "Waiting for players...", "it": "In attesa di giocatori...", "es": "Esperando jugadores...", "de": "Warte auf Spieler...", "pt": "À espera de jogadores..."},
  "Connecté": {"en": "Connected", "it": "Connesso", "es": "Conectado", "de": "Verbunden", "pt": "Ligado"},

  /* ── Plateau de jeu (boutons, compteurs, messages de tour) ───────── */
  "carte": {"en": "card", "it": "carta", "es": "carta", "de": "Karte", "pt": "carta"},
  "cartes": {"en": "cards", "it": "carte", "es": "cartas", "de": "Karten", "pt": "cartas"},
  "en main": {"en": "in hand", "it": "in mano", "es": "en mano", "de": "auf der Hand", "pt": "na mão"},
  "pts": {"en": "pts", "it": "pti", "es": "pts", "de": "Pkt", "pt": "pts"},
  "À toi": {"en": "Your turn,", "it": "Tocca a te,", "es": "Te toca,", "de": "Du bist dran,", "pt": "É a tua vez,"},
  "À toi,": {"en": "Your turn,", "it": "Tocca a te,", "es": "Te toca,", "de": "Du bist dran,", "pt": "É a tua vez,"},
  "Dernier tour pour": {"en": "Last turn for", "it": "Ultimo turno per", "es": "Último turno para", "de": "Letzter Zug für", "pt": "Último turno para"},
  "Main de": {"en": "Hand of", "it": "Mano di", "es": "Mano de", "de": "Hand von", "pt": "Mão de"},
  "En attente de": {"en": "Waiting for", "it": "In attesa di", "es": "Esperando a", "de": "Warte auf", "pt": "À espera de"},
  "L'IA joue…": {"en": "AI is playing…", "it": "L'IA sta giocando…", "es": "La IA está jugando…", "de": "Die KI spielt…", "pt": "A IA está a jogar…"},
  "Tri": {"en": "Sort", "it": "Ordina", "es": "Ordenar", "de": "Sortieren", "pt": "Ordenar"},
  "+ Nouveau pli": {"en": "+ New meld", "it": "+ Nuova combinazione", "es": "+ Nueva combinación", "de": "+ Neue Kombination", "pt": "+ Nova combinação"},
  "Abattre 👑": {"en": "Go out 👑", "it": "Chiudi 👑", "es": "Cerrar 👑", "de": "Rausgehen 👑", "pt": "Fechar 👑"},
  "Peut abattre !": {"en": "Can go out!", "it": "Puoi chiudere!", "es": "¡Puedes cerrar!", "de": "Kann rausgehen!", "pt": "Podes fechar!"},
  "Sélectionne une carte, puis \"+ Nouveau pli\"": {"en": "Select a card, then \"+ New meld\"", "it": "Seleziona una carta, poi \"+ Nuova combinazione\"", "es": "Selecciona una carta y luego \"+ Nueva combinación\"", "de": "Wähle eine Karte, dann \"+ Neue Kombination\"", "pt": "Seleciona uma carta e depois \"+ Nova combinação\""},
  "Vide": {"en": "Empty", "it": "Vuoto", "es": "Vacío", "de": "Leer", "pt": "Vazio"},

  /* ── Classement (pluriels + stats interpolées) ──────────────────── */
  "victoire": {"en": "win", "it": "vittoria", "es": "victoria", "de": "Sieg", "pt": "vitória"},
  "partie": {"en": "game", "it": "partita", "es": "partida", "de": "Spiel", "pt": "jogo"},
  "moy.": {"en": "avg", "it": "media", "es": "med.", "de": "Ø", "pt": "méd."},
  "pts moy.": {"en": "avg pts", "it": "pti medi", "es": "pts med.", "de": "Ø Punkte", "pt": "pts méd."},
  "toi": {"en": "you", "it": "tu", "es": "tú", "de": "du", "pt": "tu"},
  "Ta position :": {"en": "Your position:", "it": "La tua posizione:", "es": "Tu posición:", "de": "Deine Position:", "pt": "A tua posição:"},
  "Tu n'apparais pas encore dans le classement": {"en": "You're not in the ranking yet", "it": "Non sei ancora in classifica", "es": "Aún no apareces en la clasificación", "de": "Du bist noch nicht in der Rangliste", "pt": "Ainda não apareces na classificação"},
  "Aucun joueur pour l'instant": {"en": "No players yet", "it": "Ancora nessun giocatore", "es": "Aún no hay jugadores", "de": "Noch keine Spieler", "pt": "Ainda sem jogadores"},
  "Aucune partie rapide pour l'instant": {"en": "No quick games yet", "it": "Ancora nessuna partita rapida", "es": "Aún no hay partidas rápidas", "de": "Noch keine Schnellspiele", "pt": "Ainda sem jogos rápidos"},
  "Aucune partie complète pour l'instant": {"en": "No full games yet", "it": "Ancora nessuna partita completa", "es": "Aún no hay partidas completas", "de": "Noch keine kompletten Spiele", "pt": "Ainda sem jogos completos"},

  /* ── Configuration locale (boutons + valeurs d'input) ───────────── */
  "Humain": {"en": "Human", "it": "Umano", "es": "Humano", "de": "Mensch", "pt": "Humano"},
  "IA": {"en": "AI", "it": "IA", "es": "IA", "de": "KI", "pt": "IA"},
  "Il faut au moins un joueur humain !": {"en": "You need at least one human player!", "it": "Serve almeno un giocatore umano!", "es": "¡Necesitas al menos un jugador humano!", "de": "Es braucht mindestens einen menschlichen Spieler!", "pt": "É preciso pelo menos um jogador humano!"},

  /* ── FRAGMENTS pour crT() (messages interpolés du jeu) ──────────── */
  "Manche": {"en": "Round", "it": "Mano", "es": "Ronda", "de": "Runde", "pt": "Mão"},
  "Bonus:": {"en": "Wild:", "it": "Jolly:", "es": "Comodín:", "de": "Wild:", "pt": "Curinga:"},
  "commence": {"en": "starts", "it": "inizia", "es": "empieza", "de": "beginnt", "pt": "começa"},
  "Fin": {"en": "End of", "it": "Fine", "es": "Fin de", "de": "Ende", "pt": "Fim"},
  "Pénalité:": {"en": "Penalty:", "it": "Penalità:", "es": "Penalización:", "de": "Strafe:", "pt": "Penalização:"},
  "Défausse": {"en": "Discard", "it": "Scarta", "es": "Descarta", "de": "Ablegen", "pt": "Descarta"},
  "défausse": {"en": "discards", "it": "scarta", "es": "descarta", "de": "legt ab", "pt": "descarta"},
  "défausse automatiquement": {"en": "discards automatically", "it": "scarta automaticamente", "es": "descarta automáticamente", "de": "legt automatisch ab", "pt": "descarta automaticamente"},
  "pioche…": {"en": "draws…", "it": "pesca…", "es": "roba…", "de": "zieht…", "pt": "tira…"},
  "pioche une carte.": {"en": "draws a card.", "it": "pesca una carta.", "es": "roba una carta.", "de": "zieht eine Karte.", "pt": "tira uma carta."},
  "prend la défausse": {"en": "takes the discard", "it": "prende dagli scarti", "es": "toma del descarte", "de": "nimmt die Ablage", "pt": "tira do descarte"},
  "prend la défausse.": {"en": "takes the discard.", "it": "prende dagli scarti.", "es": "toma del descarte.", "de": "nimmt die Ablage.", "pt": "tira do descarte."},
  "ABAT ! 🎉 Les autres ont un dernier tour.": {"en": "GOES OUT! 🎉 The others get one last turn.", "it": "CHIUDE! 🎉 Gli altri hanno un ultimo turno.", "es": "¡CIERRA! 🎉 Los demás tienen un último turno.", "de": "GEHT RAUS! 🎉 Die anderen haben einen letzten Zug.", "pt": "FECHA! 🎉 Os outros têm um último turno."},
  "Dernier tour !": {"en": "Last turn!", "it": "Ultimo turno!", "es": "¡Último turno!", "de": "Letzter Zug!", "pt": "Último turno!"},
  "remporte la partie avec": {"en": "wins the game with", "it": "vince la partita con", "es": "gana la partida con", "de": "gewinnt das Spiel mit", "pt": "ganha o jogo com"},
  "pts !": {"en": "pts!", "it": "pti!", "es": "pts!", "de": "Pkt!", "pt": "pts!"},
  "parties": {"en": "games", "it": "partite", "es": "partidas", "de": "Spiele", "pt": "jogos"},
  "victoires": {"en": "wins", "it": "vittorie", "es": "victorias", "de": "Siege", "pt": "vitórias"},
  "moy. pts": {"en": "avg pts", "it": "pti medi", "es": "pts medios", "de": "Ø Pkt", "pt": "pts médios"},
  "record": {"en": "best", "it": "record", "es": "récord", "de": "Bestwert", "pt": "recorde"},

  /* ── Placeholders ───────────────────────────────────────────────── */
  "Email": {"en":"Email","it":"Email","es":"Correo","de":"E-Mail","pt":"E-mail"},
  "Mot de passe": {"en":"Password","it":"Password","es":"Contraseña","de":"Passwort","pt":"Palavra-passe"},
  "Pseudo (ex: Mathieu)": {"en":"Nickname (e.g. Mathieu)","it":"Nickname (es. Mathieu)","es":"Apodo (ej. Mathieu)","de":"Spitzname (z.B. Mathieu)","pt":"Alcunha (ex.: Mathieu)"},
  "Nouveau pseudo": {"en":"New nickname","it":"Nuovo nickname","es":"Nuevo apodo","de":"Neuer Spitzname","pt":"Nova alcunha"},
  "Pseudo de l'ami...": {"en":"Friend's nickname...","it":"Nickname dell'amico...","es":"Apodo del amigo...","de":"Spitzname des Freundes...","pt":"Alcunha do amigo..."},
  "Ton nom": {"en":"Your name","it":"Il tuo nome","es":"Tu nombre","de":"Dein Name","pt":"O teu nome"},
  "Code de parrainage (optionnel)": {"en":"Referral code (optional)","it":"Codice invito (facoltativo)","es":"Código de referido (opcional)","de":"Empfehlungscode (optional)","pt":"Código de indicação (opcional)"},
  "CODE": {"en":"CODE","it":"CODICE","es":"CÓDIGO","de":"CODE","pt":"CÓDIGO"}
};

(function(){
  "use strict";

  var LANGS = window.__CR_LANGS__ || {};

  var LANG_NAMES = {fr:"Français", en:"English", it:"Italiano", es:"Español", de:"Deutsch", pt:"Português"};
  var LANG_FLAGS = {fr:"🇫🇷", en:"🇬🇧", it:"🇮🇹", es:"🇪🇸", de:"🇩🇪", pt:"🇵🇹"};
  var ORDER = ["fr","en","it","es","de","pt"];

  // Réutilise la clé de stockage déjà utilisée par index.html
  var _lang = "fr";
  try {
    _lang = localStorage.getItem("cinqr_lang") ||
      ((navigator.language || "fr").slice(0,2).toLowerCase());
  } catch(e){}
  if (ORDER.indexOf(_lang) === -1) _lang = "fr";

  function translate(txt){
    if (_lang === "fr") return null;
    var d = LANGS[txt];
    if (d && d[_lang]) return d[_lang];
    return null;
  }

  // Préfixe emoji en tête de chaîne : "🥇 Victoires" -> prefix "🥇 ", rest "Victoires"
  // Plage élargie vs U9 : inclut U+2400-U+25FF (formes géométriques) pour couvrir ▶️
  var EMOJI_RE = /^((?:[\u2190-\u27BF\u2B00-\u2BFF]|[\uD800-\uDBFF][\uDC00-\uDFFF])(?:\uFE0F|\u200D(?:[\u2190-\u27BF\u2B00-\u2BFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]))*)\s*/;
  function splitEmoji(s){
    var m = EMOJI_RE.exec(s);
    if (m) return { prefix: m[0], rest: s.slice(m[0].length) };
    return { prefix: "", rest: s };
  }

  function translateWide(key){
    var tr = translate(key);
    if (tr != null) return tr;
    var sp = splitEmoji(key);
    if (sp.prefix) {
      var tr2 = translate(sp.rest.trim());
      if (tr2 != null) return sp.prefix + tr2;
    }
    return null;
  }

  // Helper global pour les messages construits en JS.
  //   setMsg(crT('Tu pioches ') + carte + crT('. Sélectionne une carte à défausser.'))
  window.crT = function(fr){
    if (!fr) return fr;
    if (_lang === "fr") return fr;
    var d = LANGS[fr];
    return (d && d[_lang]) ? d[_lang] : fr;
  };

  // Zones à ne jamais traduire : saisies, pseudos éditables, sélecteur de langue.
  // (Les pseudos joueurs sont de toute façon protégés : ils ne matchent aucune clé.)
  function isSkipped(parent){
    var tag = parent.nodeName;
    if (tag === "SCRIPT" || tag === "STYLE" || tag === "TEXTAREA" || tag === "INPUT") return true;
    if (parent.isContentEditable) return true;
    if (parent.id === "lang-btn" || parent.id === "cr-lang-btn") return true;
    if (parent.closest && parent.closest("#cr-lang-menu")) return true;
    // Ne pas toucher aux noms de joueurs / pseudos affichés
    if (parent.closest && parent.closest(".lb-name, .pname, .pdot")) return true;
    return false;
  }

  function applyNode(node){
    var parent = node.parentNode;
    if (!parent || isSkipped(parent)) return;

    var raw = node.__cr_fr__ != null ? node.__cr_fr__ : node.nodeValue;
    var key = (raw || "").trim();
    if (!key) return;

    if (_lang !== "fr") {
      // 1) essai sur la chaîne BRUTE (respecte les espaces significatifs : "Poser ", "Tu pioches ")
      var trRaw = translateWide(raw);
      if (trRaw != null) {
        if (node.__cr_fr__ == null) node.__cr_fr__ = raw;
        if (node.nodeValue !== trRaw) node.nodeValue = trRaw;
        return;
      }
    }

    if (_lang === "fr") {
      if (node.__cr_fr__ != null && node.nodeValue !== node.__cr_fr__) {
        node.nodeValue = node.__cr_fr__;
      }
      return;
    }

    var tr = translateWide(key);
    if (tr != null) {
      if (node.__cr_fr__ == null) node.__cr_fr__ = raw;
      var lead  = (raw.match(/^\s*/) || [""])[0];
      var trail = (raw.match(/\s*$/) || [""])[0];
      var want  = lead + tr.trim() + trail;
      if (node.nodeValue !== want) node.nodeValue = want;
    }
  }

  function applyAttr(el){
    if (!el || !el.getAttribute) return;
    var raw = el.__cr_ph_fr__ != null ? el.__cr_ph_fr__ : el.getAttribute("placeholder");
    var key = (raw || "").trim();
    if (!key) return;
    if (_lang === "fr") {
      if (el.__cr_ph_fr__ != null && el.getAttribute("placeholder") !== el.__cr_ph_fr__) {
        el.setAttribute("placeholder", el.__cr_ph_fr__);
      }
      return;
    }
    var tr = translateWide(key);
    if (tr != null) {
      if (el.__cr_ph_fr__ == null) el.__cr_ph_fr__ = raw;
      if (el.getAttribute("placeholder") !== tr) el.setAttribute("placeholder", tr);
    }
  }

  function walkAttrs(root){
    if (!root || !root.querySelectorAll) return;
    var els = root.querySelectorAll("[placeholder]");
    for (var i=0; i<els.length; i++) applyAttr(els[i]);
  }

  function walk(root){
    if (!root) return;
    var it = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
    var n, batch = [];
    while (n = it.nextNode()) batch.push(n);
    for (var i=0; i<batch.length; i++) applyNode(batch[i]);
    walkAttrs(root);
  }

  // Le jeu régénère du DOM (render, buildLS, renderLeaderboard, popups…) :
  // on re-traduit à chaque mutation, groupé par frame.
  var _scheduled = false;
  function scheduleWalk(){
    if (_scheduled) return;
    _scheduled = true;
    requestAnimationFrame(function(){
      _scheduled = false;
      walk(document.body);
    });
  }

  function startObserver(){
    var obs = new MutationObserver(function(){ scheduleWalk(); });
    obs.observe(document.body, {childList:true, subtree:true, characterData:true});
  }

  function setLang(l){
    if (ORDER.indexOf(l) === -1) return;
    _lang = l;
    try { localStorage.setItem("cinqr_lang", l); } catch(e){}
    updateBtn();
    walk(document.body);
    // Certains textes (valeurs d'<input>) échappent au TreeWalker :
    // on prévient le jeu pour qu'il reconstruise ce qu'il faut.
    try { document.dispatchEvent(new CustomEvent("cr-lang-changed",{detail:{lang:l}})); } catch(e){}
  }
  window.crSetLang = setLang;
  window.crGetLang = function(){ return _lang; };

  function updateBtn(){
    var b = document.getElementById("lang-btn") || document.getElementById("cr-lang-btn");
    if (b) b.textContent = LANG_FLAGS[_lang] || "🌐";
  }

  function toggleMenu(anchor){
    var m = document.getElementById("cr-lang-menu");
    if (m) { m.style.display = (m.style.display === "none" ? "block" : "none"); return; }
    m = document.createElement("div");
    m.id = "cr-lang-menu";
    ORDER.forEach(function(l){
      var it = document.createElement("div");
      it.className = "cr-lang-item";
      it.textContent = LANG_FLAGS[l] + "  " + LANG_NAMES[l];
      it.onclick = function(){ setLang(l); m.style.display = "none"; };
      m.appendChild(it);
    });
    document.body.appendChild(m);
  }

  // Reprend le bouton drapeau déjà présent dans index.html (#lang-btn).
  // S'il n'existe pas, on en crée un flottant.
  function buildUI(){
    var existing = document.getElementById("lang-btn");
    if (existing) {
      existing.onclick = function(e){ e.stopPropagation(); toggleMenu(existing); };
      updateBtn();
    } else if (!document.getElementById("cr-lang-btn")) {
      var b = document.createElement("button");
      b.id = "cr-lang-btn";
      b.title = "Langue / Language";
      b.textContent = LANG_FLAGS[_lang] || "🌐";
      b.onclick = function(e){ e.stopPropagation(); toggleMenu(b); };
      document.body.appendChild(b);
    }

    var st = document.createElement("style");
    st.textContent =
      "#cr-lang-btn{position:fixed;right:12px;bottom:12px;z-index:9999;width:40px;height:40px;border-radius:50%;border:1px solid rgba(200,160,0,.4);background:rgba(6,40,20,.9);color:#fff;font-size:1.1rem;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,.4);display:flex;align-items:center;justify-content:center;padding:0}" +
      "#cr-lang-menu{position:fixed;right:12px;bottom:60px;z-index:10000;background:#062814;border:1px solid rgba(200,160,0,.4);border-radius:10px;padding:4px;box-shadow:0 4px 16px rgba(0,0,0,.55)}" +
      ".cr-lang-item{padding:8px 14px;color:#fff;font-size:.9rem;cursor:pointer;border-radius:6px;white-space:nowrap}" +
      ".cr-lang-item:hover{background:rgba(255,255,255,.12)}";
    document.head.appendChild(st);

    document.addEventListener("click", function(){
      var m = document.getElementById("cr-lang-menu");
      if (m) m.style.display = "none";
    });
  }

  function init(){
    buildUI();
    walk(document.body);
    startObserver();
    // Au premier chargement, le jeu a pu construire des valeurs d'<input> avant
    // que ce fichier soit là (repli identité) : on lui demande de les refaire.
    try { document.dispatchEvent(new CustomEvent("cr-lang-changed",{detail:{lang:_lang}})); } catch(e){}
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
