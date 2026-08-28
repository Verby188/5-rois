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
  "Paramètres": {"en": "Settings", "it": "Impostazioni", "es": "Ajustes", "de": "Einstellungen", "pt": "Definições", "nl": "Instellingen", "pl": "Ustawienia"},
  "Thème": {"en": "Theme", "it": "Tema", "es": "Tema", "de": "Design", "pt": "Tema", "nl": "Thema", "pl": "Motyw"},
  "Langue": {"en": "Language", "it": "Lingua", "es": "Idioma", "de": "Sprache", "pt": "Idioma", "nl": "Taal", "pl": "Język"},
  "Sons": {"en": "Sounds", "it": "Suoni", "es": "Sonidos", "de": "Töne", "pt": "Sons", "nl": "Geluiden", "pl": "Dźwięki"},
  "Rejoins la communauté !": {"en": "Join the community!", "it": "Unisciti alla community!", "es": "¡Únete a la comunidad!", "de": "Tritt der Community bei!", "pt": "Junta-te à comunidade!", "nl": "Word lid van de community!", "pl": "Dołącz do społeczności!"},
  "Mises à jour, entraide et bonne humeur sur notre Discord 5 Rois.": {"en": "Updates, help and good vibes on our 5 Rois Discord.", "it": "Aggiornamenti, aiuto e buonumore sul nostro Discord 5 Rois.", "es": "Novedades, ayuda y buen rollo en nuestro Discord de 5 Rois.", "de": "Updates, Hilfe und gute Laune auf unserem 5 Rois Discord.", "pt": "Novidades, ajuda e boa disposição no nosso Discord 5 Rois.", "nl": "Updates, hulp en gezelligheid op onze 5 Rois Discord.", "pl": "Aktualizacje, pomoc i dobra atmosfera na naszym Discordzie 5 Rois."},
  "Rejoindre le Discord": {"en": "Join the Discord", "it": "Unisciti al Discord", "es": "Unirse al Discord", "de": "Discord beitreten", "pt": "Entrar no Discord", "nl": "Word lid van de Discord", "pl": "Dołącz do Discorda"},
  "Lancer le tutoriel interactif": {"en":"Start the interactive tutorial", "it":"Avvia il tutorial interattivo", "es":"Iniciar el tutorial interactivo", "de":"Interaktives Tutorial starten", "pt":"Iniciar o tutorial interativo", "nl":"Interactieve tutorial starten", "pl":"Uruchom interaktywny samouczek"},
  "Sélectionnée — défausse ou abats": {"en":"Selected — discard or go out", "it":"Selezionata — scarta o chiudi", "es":"Seleccionada — descarta o cierra", "de":"Ausgewählt — ablegen oder rausgehen", "pt":"Selecionada — descarta ou fecha", "nl":"Geselecteerd — afleggen of uitkomen", "pl":"Wybrana — odrzuć lub wyłóż"},
  "Five Crowns": {"en":"Five Crowns", "it":"Five Crowns", "es":"Five Crowns", "de":"Five Crowns", "pt":"Five Crowns", "nl":"Five Crowns", "pl":"Five Crowns"},
  "Multijoueur en ligne": {"en":"Online multiplayer", "it":"Multigiocatore online", "es":"Multijugador en línea", "de":"Online-Mehrspieler", "pt":"Multijogador online", "nl":"Online multiplayer", "pl":"Gra online z innymi"},
  "Chaque joueur sur son propre appareil": {"en":"Each player on their own device", "it":"Ogni giocatore sul proprio dispositivo", "es":"Cada jugador en su propio dispositivo", "de":"Jeder Spieler auf seinem eigenen Gerät", "pt":"Cada jogador no seu próprio dispositivo", "nl":"Elke speler op zijn eigen apparaat", "pl":"Każdy gracz na własnym urządzeniu"},
  "Jouer en local": {"en":"Play locally", "it":"Gioca in locale", "es":"Jugar en local", "de":"Lokal spielen", "pt":"Jogar localmente", "nl":"Lokaal spelen", "pl":"Gra lokalna"},
  "Même appareil, 1 à 8 joueurs avec passation": {"en":"Same device, 1 to 8 players, pass and play", "it":"Stesso dispositivo, da 1 a 8 giocatori a turno", "es":"Mismo dispositivo, de 1 a 8 jugadores por turnos", "de":"Gleiches Gerät, 1 bis 8 Spieler im Wechsel", "pt":"Mesmo dispositivo, 1 a 8 jogadores à vez", "nl":"Zelfde apparaat, 1 tot 8 spelers om de beurt", "pl":"To samo urządzenie, 1 do 8 graczy po kolei"},
  "Reprendre la partie": {"en":"Resume game", "it":"Riprendi la partita", "es":"Reanudar la partida", "de":"Spiel fortsetzen", "pt":"Retomar o jogo", "nl":"Spel hervatten", "pl":"Wznów grę"},
  "Continuer votre partie solo en cours": {"en":"Continue your solo game in progress", "it":"Continua la tua partita in solitario", "es":"Continúa tu partida en solitario", "de":"Setze dein laufendes Solospiel fort", "pt":"Continua o teu jogo a solo", "nl":"Ga verder met je lopende solospel", "pl":"Kontynuuj bieżącą grę solo"},
  "Règles du jeu": {"en":"Game rules", "it":"Regole del gioco", "es":"Reglas del juego", "de":"Spielregeln", "pt":"Regras do jogo", "nl":"Spelregels", "pl":"Zasady gry"},
  "Suites, familles, Bonus et stratégies": {"en":"Runs, books, Wild cards and strategy", "it":"Scale, tris, jolly e strategie", "es":"Escaleras, tríos, comodines y estrategias", "de":"Folgen, Sätze, Joker und Strategien", "pt":"Sequências, trios, curingas e estratégias", "nl":"Reeksen, sets, Bonus en strategieën", "pl":"Sekwensy, komplety, Bonus i strategie"},
  "Amis": {"en":"Friends", "it":"Amici", "es":"Amigos", "de":"Freunde", "pt":"Amigos", "nl":"Vrienden", "pl":"Znajomi"},
  "Gérer votre liste d'amis": {"en":"Manage your friends list", "it":"Gestisci la tua lista amici", "es":"Gestiona tu lista de amigos", "de":"Verwalte deine Freundesliste", "pt":"Gere a tua lista de amigos", "nl":"Beheer je vriendenlijst", "pl":"Zarządzaj listą znajomych"},
  "Classement global": {"en":"Global ranking", "it":"Classifica globale", "es":"Clasificación global", "de":"Globale Rangliste", "pt":"Classificação global", "nl":"Wereldranglijst", "pl":"Ranking globalny"},
  "Victoires, % victoires, score moyen": {"en":"Wins, win rate, average score", "it":"Vittorie, % vittorie, punteggio medio", "es":"Victorias, % victorias, puntuación media", "de":"Siege, Siegquote, Durchschnittspunktzahl", "pt":"Vitórias, % vitórias, pontuação média", "nl":"Overwinningen, winst%, gemiddelde score", "pl":"Zwycięstwa, % zwycięstw, średni wynik"},
  "Suites (même couleur) & Familles (même valeur) — Jokers et Bonus sont wild": {"en":"Runs (same colour) & Books (same value) — Jokers and Wild cards are wild", "it":"Scale (stesso colore) e Tris (stesso valore) — Jolly e carta jolly sono wild", "es":"Escaleras (mismo color) y Tríos (mismo valor) — Comodines y carta comodín son wild", "de":"Folgen (gleiche Farbe) & Sätze (gleicher Wert) — Joker und Wild-Karte sind wild", "pt":"Sequências (mesma cor) e Trios (mesmo valor) — Jokers e carta curinga são wild", "nl":"Reeksen (zelfde kleur) & Sets (zelfde waarde) — Jokers en Bonus zijn wild", "pl":"Sekwensy (ten sam kolor) i Komplety (ta sama wartość) — Jokery i Bonus są dzikie"},
  "Bienvenue !": {"en":"Welcome!", "it":"Benvenuto!", "es":"¡Bienvenido!", "de":"Willkommen!", "pt":"Bem-vindo!", "nl":"Welkom!", "pl":"Witaj!"},
  "Connexion": {"en":"Log in", "it":"Accedi", "es":"Iniciar sesión", "de":"Anmelden", "pt":"Entrar", "nl":"Inloggen", "pl":"Logowanie"},
  "Inscription": {"en":"Sign up", "it":"Registrati", "es":"Registrarse", "de":"Registrieren", "pt":"Registar", "nl":"Registreren", "pl":"Rejestracja"},
  "Se connecter": {"en":"Log in", "it":"Accedi", "es":"Iniciar sesión", "de":"Anmelden", "pt":"Entrar", "nl":"Inloggen", "pl":"Zaloguj się"},
  "Créer le compte": {"en":"Create account", "it":"Crea account", "es":"Crear cuenta", "de":"Konto erstellen", "pt":"Criar conta", "nl":"Account aanmaken", "pl":"Utwórz konto"},
  "Continuer sans compte": {"en":"Continue without an account", "it":"Continua senza account", "es":"Continuar sin cuenta", "de":"Ohne Konto fortfahren", "pt":"Continuar sem conta", "nl":"Doorgaan zonder account", "pl":"Kontynuuj bez konta"},
  "Mot de passe oublié ?": {"en":"Forgot password?", "it":"Password dimenticata?", "es":"¿Olvidaste la contraseña?", "de":"Passwort vergessen?", "pt":"Esqueceste-te da palavra-passe?", "nl":"Wachtwoord vergeten?", "pl":"Nie pamiętasz hasła?"},
  "Mot de passe oublié": {"en":"Forgot password", "it":"Password dimenticata", "es":"Olvidé la contraseña", "de":"Passwort vergessen", "pt":"Esqueci a palavra-passe", "nl":"Wachtwoord vergeten", "pl":"Nie pamiętam hasła"},
  "Se déconnecter": {"en":"Log out", "it":"Esci", "es":"Cerrar sesión", "de":"Abmelden", "pt":"Sair", "nl":"Uitloggen", "pl":"Wyloguj się"},
  "Connexion en cours…": {"en":"Connecting…", "it":"Connessione…", "es":"Conectando…", "de":"Verbinde…", "pt":"A ligar…", "nl":"Bezig met inloggen…", "pl":"Logowanie…"},
  "Chargement…": {"en":"Loading…", "it":"Caricamento…", "es":"Cargando…", "de":"Wird geladen…", "pt":"A carregar…", "nl":"Laden…", "pl":"Ładowanie…"},
  "Partie locale": {"en":"Local game", "it":"Partita locale", "es":"Partida local", "de":"Lokales Spiel", "pt":"Jogo local", "nl":"Lokaal spel", "pl":"Gra lokalna"},
  "Format de partie": {"en":"Game format", "it":"Formato partita", "es":"Formato de partida", "de":"Spielformat", "pt":"Formato de jogo", "nl":"Spelformaat", "pl":"Format gry"},
  "Complète": {"en":"Full", "it":"Completa", "es":"Completa", "de":"Komplett", "pt":"Completa", "nl":"Volledig", "pl":"Pełna"},
  "Rapide": {"en":"Quick", "it":"Rapida", "es":"Rápida", "de":"Schnell", "pt":"Rápida", "nl":"Snel", "pl":"Szybka"},
  "11 manches · 3→13 cartes": {"en":"11 rounds · 3→13 cards", "it":"11 mani · 3→13 carte", "es":"11 rondas · 3→13 cartas", "de":"11 Runden · 3→13 Karten", "pt":"11 mãos · 3→13 cartas", "nl":"11 rondes · 3→13 kaarten", "pl":"11 rund · 3→13 kart"},
  "8 manches · 6→13 cartes": {"en":"8 rounds · 6→13 cards", "it":"8 mani · 6→13 carte", "es":"8 rondas · 6→13 cartas", "de":"8 Runden · 6→13 Karten", "pt":"8 mãos · 6→13 cartas", "nl":"8 rondes · 6→13 kaarten", "pl":"8 rund · 6→13 kart"},
  "Nombre de joueurs": {"en":"Number of players", "it":"Numero di giocatori", "es":"Número de jugadores", "de":"Anzahl der Spieler", "pt":"Número de jogadores", "nl":"Aantal spelers", "pl":"Liczba graczy"},
  "Configuration": {"en":"Setup", "it":"Configurazione", "es":"Configuración", "de":"Konfiguration", "pt":"Configuração", "nl":"Instellingen", "pl":"Ustawienia"},
  "Jouer !": {"en":"Play!", "it":"Gioca!", "es":"¡Jugar!", "de":"Spielen!", "pt":"Jogar!", "nl":"Spelen!", "pl":"Graj!"},
  "Joueur": {"en":"Player", "it":"Giocatore", "es":"Jugador", "de":"Spieler", "pt":"Jogador", "nl":"Speler", "pl":"Gracz"},
  "Multijoueur": {"en":"Multiplayer", "it":"Multigiocatore", "es":"Multijugador", "de":"Mehrspieler", "pt":"Multijogador", "nl":"Multiplayer", "pl":"Wieloosobowa"},
  "Créer une partie": {"en":"Create a game", "it":"Crea una partita", "es":"Crear una partida", "de":"Spiel erstellen", "pt":"Criar um jogo", "nl":"Spel aanmaken", "pl":"Utwórz grę"},
  "Créer la partie": {"en":"Create game", "it":"Crea partita", "es":"Crear partida", "de":"Spiel erstellen", "pt":"Criar jogo", "nl":"Spel aanmaken", "pl":"Utwórz grę"},
  "Adversaires IA": {"en":"AI opponents", "it":"Avversari IA", "es":"Rivales IA", "de":"KI-Gegner", "pt":"Adversários IA", "nl":"AI-tegenstanders", "pl":"Przeciwnicy AI"},
  "Rejoindre une partie": {"en":"Join a game", "it":"Unisciti a una partita", "es":"Unirse a una partida", "de":"Spiel beitreten", "pt":"Entrar num jogo", "nl":"Deelnemen aan spel", "pl":"Dołącz do gry"},
  "Rejoindre →": {"en":"Join →", "it":"Unisciti →", "es":"Unirse →", "de":"Beitreten →", "pt":"Entrar →", "nl":"Deelnemen →", "pl":"Dołącz →"},
  "Code de la partie": {"en":"Game code", "it":"Codice partita", "es":"Código de partida", "de":"Spielcode", "pt":"Código do jogo", "nl":"Spelcode", "pl":"Kod gry"},
  "Ton code :": {"en":"Your code:", "it":"Il tuo codice:", "es":"Tu código:", "de":"Dein Code:", "pt":"O teu código:", "nl":"Jouw code:", "pl":"Twój kod:"},
  "Partage ce code avec les autres joueurs": {"en":"Share this code with the other players", "it":"Condividi questo codice con gli altri giocatori", "es":"Comparte este código con los demás jugadores", "de":"Teile diesen Code mit den anderen Spielern", "pt":"Partilha este código com os outros jogadores", "nl":"Deel deze code met de andere spelers", "pl":"Udostępnij ten kod innym graczom"},
  "Copier le code": {"en":"Copy code", "it":"Copia codice", "es":"Copiar código", "de":"Code kopieren", "pt":"Copiar código", "nl":"Code kopiëren", "pl":"Kopiuj kod"},
  "Copier": {"en":"Copy", "it":"Copia", "es":"Copiar", "de":"Kopieren", "pt":"Copiar", "nl":"Kopiëren", "pl":"Kopiuj"},
  "Inviter par SMS": {"en":"Invite by SMS", "it":"Invita via SMS", "es":"Invitar por SMS", "de":"Per SMS einladen", "pt":"Convidar por SMS", "nl":"Uitnodigen via sms", "pl":"Zaproś przez SMS"},
  "Inviter un ami": {"en":"Invite a friend", "it":"Invita un amico", "es":"Invitar a un amigo", "de":"Freund einladen", "pt":"Convidar um amigo", "nl":"Een vriend uitnodigen", "pl":"Zaproś znajomego"},
  "Démarrer la partie !": {"en":"Start the game!", "it":"Inizia la partita!", "es":"¡Empezar la partida!", "de":"Spiel starten!", "pt":"Começar o jogo!", "nl":"Spel starten!", "pl":"Rozpocznij grę!"},
  "Retour au lobby": {"en":"Back to lobby", "it":"Torna alla lobby", "es":"Volver al vestíbulo", "de":"Zurück zur Lobby", "pt":"Voltar ao átrio", "nl":"Terug naar lobby", "pl":"Powrót do poczekalni"},
  "Spectateur": {"en":"Spectator", "it":"Spettatore", "es":"Espectador", "de":"Zuschauer", "pt":"Espetador", "nl":"Toeschouwer", "pl":"Obserwator"},
  "Réessayer →": {"en":"Retry →", "it":"Riprova →", "es":"Reintentar →", "de":"Erneut versuchen →", "pt":"Tentar de novo →", "nl":"Opnieuw proberen →", "pl":"Spróbuj ponownie →"},
  "Pioche": {"en":"Draw", "it":"Mazzo", "es":"Robar", "de":"Nachziehen", "pt":"Baralho", "nl":"Trekstapel", "pl":"Talia"},
  "Défausse": {"en":"Discard", "it":"Scarta", "es":"Descarta", "de":"Ablegen", "pt":"Descarta", "nl":"Aflegstapel", "pl":"Stos odrzuconych"},
  "Défausser": {"en":"Discard", "it":"Scarta", "es":"Descartar", "de":"Ablegen", "pt":"Descartar", "nl":"Afleggen", "pl":"Odrzuć"},
  "Votre main": {"en":"Your hand", "it":"La tua mano", "es":"Tu mano", "de":"Deine Hand", "pt":"A tua mão", "nl":"Jouw hand", "pl":"Twoja ręka"},
  "Main cachée": {"en":"Hidden hand", "it":"Mano nascosta", "es":"Mano oculta", "de":"Verdeckte Hand", "pt":"Mão escondida", "nl":"Verborgen hand", "pl":"Ukryta ręka"},
  "Votre tour": {"en":"Your turn", "it":"Il tuo turno", "es":"Tu turno", "de":"Du bist dran", "pt":"A tua vez", "nl":"Jouw beurt", "pl":"Twoja tura"},
  "À ton tour !": {"en":"Your turn!", "it":"Tocca a te!", "es":"¡Te toca!", "de":"Du bist dran!", "pt":"É a tua vez!", "nl":"Jouw beurt!", "pl":"Twoja tura!"},
  "C'est ton tour !": {"en":"It's your turn!", "it":"È il tuo turno!", "es":"¡Es tu turno!", "de":"Du bist am Zug!", "pt":"É a tua vez!", "nl":"Het is jouw beurt!", "pl":"To twoja tura!"},
  "Exposez !": {"en":"Go out!", "it":"Chiudi!", "es":"¡Cierra!", "de":"Geh raus!", "pt":"Fecha!", "nl":"Kom uit!", "pl":"Wyłóż!"},
  "Exposer": {"en":"Go out", "it":"Chiudere", "es":"Cerrar", "de":"Rausgehen", "pt":"Fechar", "nl":"Uitkomen", "pl":"Wyłóż"},
  "Annuler un coup": {"en":"Undo a move", "it":"Annulla una mossa", "es":"Deshacer una jugada", "de":"Zug rückgängig machen", "pt":"Anular uma jogada", "nl":"Zet ongedaan maken", "pl":"Cofnij ruch"},
  "Annuler": {"en":"Cancel", "it":"Annulla", "es":"Cancelar", "de":"Abbrechen", "pt":"Cancelar", "nl":"Annuleren", "pl":"Anuluj"},
  "Passer": {"en":"Skip", "it":"Salta", "es":"Saltar", "de":"Überspringen", "pt":"Saltar", "nl":"Passen", "pl":"Pasuj"},
  "Passer ✕": {"en":"Skip ✕", "it":"Salta ✕", "es":"Saltar ✕", "de":"Überspringen ✕", "pt":"Saltar ✕", "nl":"Passen ✕", "pl":"Pasuj ✕"},
  "Quitter": {"en":"Leave", "it":"Esci", "es":"Salir", "de":"Verlassen", "pt":"Sair", "nl":"Afsluiten", "pl":"Wyjdź"},
  "Suivant →": {"en":"Next →", "it":"Avanti →", "es":"Siguiente →", "de":"Weiter →", "pt":"Seguinte →", "nl":"Volgende →", "pl":"Dalej →"},
  "Continuer": {"en":"Continue", "it":"Continua", "es":"Continuar", "de":"Weiter", "pt":"Continuar", "nl":"Doorgaan", "pl":"Kontynuuj"},
  "Fin de Manche": {"en":"End of round", "it":"Fine mano", "es":"Fin de ronda", "de":"Rundenende", "pt":"Fim da mão", "nl":"Einde ronde", "pl":"Koniec rundy"},
  "Manche Suivante": {"en":"Next round", "it":"Mano successiva", "es":"Siguiente ronda", "de":"Nächste Runde", "pt":"Mão seguinte", "nl":"Volgende ronde", "pl":"Następna runda"},
  "Classement Final": {"en":"Final ranking", "it":"Classifica finale", "es":"Clasificación final", "de":"Endstand", "pt":"Classificação final", "nl":"Eindstand", "pl":"Wynik końcowy"},
  "Revanche !": {"en":"Rematch!", "it":"Rivincita!", "es":"¡Revancha!", "de":"Revanche!", "pt":"Desforra!", "nl":"Revanche!", "pl":"Rewanż!"},
  "Le plateau": {"en":"The board", "it":"Il tavolo", "es":"La mesa", "de":"Das Spielfeld", "pt":"A mesa", "nl":"Het speelveld", "pl":"Plansza"},
  "Plis organisés": {"en":"Organised melds", "it":"Combinazioni organizzate", "es":"Combinaciones organizadas", "de":"Geordnete Kombinationen", "pt":"Combinações organizadas", "nl":"Geordende groepen", "pl":"Ułożone grupy"},
  "Dans un pli": {"en":"In a meld", "it":"In una combinazione", "es":"En una combinación", "de":"In einer Kombination", "pt":"Numa combinação", "nl":"In een groep", "pl":"W grupie"},
  "Réaction": {"en":"Reaction", "it":"Reazione", "es":"Reacción", "de":"Reaktion", "pt":"Reação", "nl":"Reactie", "pl":"Reakcja"},
  "Réactions emoji": {"en":"Emoji reactions", "it":"Reazioni emoji", "es":"Reacciones emoji", "de":"Emoji-Reaktionen", "pt":"Reações emoji", "nl":"Emoji-reacties", "pl":"Reakcje emoji"},
  "secondes restantes": {"en":"seconds left", "it":"secondi rimasti", "es":"segundos restantes", "de":"Sekunden übrig", "pt":"segundos restantes", "nl":"seconden over", "pl":"pozostało sekund"},
  "Révéler ma main 🃏": {"en":"Reveal my hand 🃏", "it":"Rivela la mia mano 🃏", "es":"Revelar mi mano 🃏", "de":"Meine Hand aufdecken 🃏", "pt":"Revelar a minha mão 🃏", "nl":"Mijn hand tonen 🃏", "pl":"Pokaż moją rękę 🃏"},
  "Passez l'appareil, puis révélez votre main.": {"en":"Pass the device, then reveal your hand.", "it":"Passa il dispositivo, poi rivela la tua mano.", "es":"Pasa el dispositivo y revela tu mano.", "de":"Gib das Gerät weiter und decke dann deine Hand auf.", "pt":"Passa o dispositivo e revela a tua mão.", "nl":"Geef het apparaat door en toon dan je hand.", "pl":"Przekaż urządzenie, a potem pokaż swoją rękę."},
  "C'est parti ! 🎴": {"en":"Let's go! 🎴", "it":"Si comincia! 🎴", "es":"¡Vamos! 🎴", "de":"Los geht's! 🎴", "pt":"Vamos lá! 🎴", "nl":"Daar gaan we! 🎴", "pl":"Zaczynamy! 🎴"},
  "Classement Global": {"en":"Global ranking", "it":"Classifica globale", "es":"Clasificación global", "de":"Globale Rangliste", "pt":"Classificação global", "nl":"Wereldranglijst", "pl":"Ranking globalny"},
  "Les 2": {"en":"Both", "it":"Entrambe", "es":"Ambas", "de":"Beide", "pt":"Ambas", "nl":"Beide", "pl":"Oba"},
  "Victoires": {"en":"Wins", "it":"Vittorie", "es":"Victorias", "de":"Siege", "pt":"Vitórias", "nl":"Overwinningen", "pl":"Zwycięstwa"},
  "% Victoires": {"en":"Win rate", "it":"% Vittorie", "es":"% Victorias", "de":"Siegquote", "pt":"% Vitórias", "nl":"Winst%", "pl":"% zwycięstw"},
  "Moy. score": {"en":"Avg. score", "it":"Punt. medio", "es":"Punt. media", "de":"Ø Punkte", "pt":"Pont. média", "nl":"Gem. score", "pl":"Śr. wynik"},
  "Rang": {"en":"Rank", "it":"Pos.", "es":"Puesto", "de":"Rang", "pt":"Posição", "nl":"Rang", "pl":"Miejsce"},
  "Score": {"en":"Score", "it":"Punteggio", "es":"Puntuación", "de":"Punkte", "pt":"Pontuação", "nl":"Score", "pl":"Wynik"},
  "Aucune partie jouée": {"en":"No games played", "it":"Nessuna partita giocata", "es":"Ninguna partida jugada", "de":"Keine Spiele gespielt", "pt":"Nenhum jogo jogado", "nl":"Nog geen spel gespeeld", "pl":"Brak rozegranych gier"},
  "Dernières parties": {"en":"Recent games", "it":"Ultime partite", "es":"Últimas partidas", "de":"Letzte Spiele", "pt":"Últimos jogos", "nl":"Laatste spellen", "pl":"Ostatnie gry"},
  "Mes amis": {"en":"My friends", "it":"I miei amici", "es":"Mis amigos", "de":"Meine Freunde", "pt":"Os meus amigos", "nl":"Mijn vrienden", "pl":"Moi znajomi"},
  "Ajouter un ami": {"en":"Add a friend", "it":"Aggiungi un amico", "es":"Añadir un amigo", "de":"Freund hinzufügen", "pt":"Adicionar um amigo", "nl":"Vriend toevoegen", "pl":"Dodaj znajomego"},
  "Aucun ami pour l'instant": {"en":"No friends yet", "it":"Ancora nessun amico", "es":"Aún no tienes amigos", "de":"Noch keine Freunde", "pt":"Ainda sem amigos", "nl":"Nog geen vrienden", "pl":"Brak znajomych"},
  "Demandes reçues": {"en":"Received requests", "it":"Richieste ricevute", "es":"Solicitudes recibidas", "de":"Erhaltene Anfragen", "pt":"Pedidos recebidos", "nl":"Ontvangen verzoeken", "pl":"Otrzymane zaproszenia"},
  "Avatar": {"en":"Avatar", "it":"Avatar", "es":"Avatar", "de":"Avatar", "pt":"Avatar", "nl":"Avatar", "pl":"Awatar"},
  "Enregistrer": {"en":"Save", "it":"Salva", "es":"Guardar", "de":"Speichern", "pt":"Guardar", "nl":"Opslaan", "pl":"Zapisz"},
  "Réinitialiser": {"en":"Reset", "it":"Reimposta", "es":"Restablecer", "de":"Zurücksetzen", "pt":"Repor", "nl":"Herstellen", "pl":"Zresetuj"},
  "Parrainage": {"en":"Referral", "it":"Invita un amico", "es":"Programa de referidos", "de":"Empfehlung", "pt":"Indicação", "nl":"Doorverwijzing", "pl":"Polecenie"},
  "Parrainage & thèmes exclusifs": {"en":"Referral & exclusive themes", "it":"Inviti e temi esclusivi", "es":"Referidos y temas exclusivos", "de":"Empfehlungen & exklusive Designs", "pt":"Indicações e temas exclusivos", "nl":"Doorverwijzing & exclusieve thema's", "pl":"Polecenia i motywy ekskluzywne"},
  "Thèmes débloqués :": {"en":"Unlocked themes:", "it":"Temi sbloccati:", "es":"Temas desbloqueados:", "de":"Freigeschaltete Designs:", "pt":"Temas desbloqueados:", "nl":"Ontgrendelde thema's:", "pl":"Odblokowane motywy:"},
  "Couleurs des cartes": {"en":"Card colours", "it":"Colori delle carte", "es":"Colores de las cartas", "de":"Kartenfarben", "pt":"Cores das cartas", "nl":"Kaartkleuren", "pl":"Kolory kart"},
  "Couleurs standard": {"en":"Standard colours", "it":"Colori standard", "es":"Colores estándar", "de":"Standardfarben", "pt":"Cores padrão", "nl":"Standaardkleuren", "pl":"Kolory standardowe"},
  "Palettes prédéfinies": {"en":"Preset palettes", "it":"Tavolozze predefinite", "es":"Paletas predefinidas", "de":"Vordefinierte Paletten", "pt":"Paletas predefinidas", "nl":"Vooraf ingestelde paletten", "pl":"Gotowe palety"},
  "Vos couleurs — appuyez pour modifier": {"en":"Your colours — tap to change", "it":"I tuoi colori — tocca per modificare", "es":"Tus colores — toca para cambiar", "de":"Deine Farben — zum Ändern tippen", "pt":"As tuas cores — toca para alterar", "nl":"Jouw kleuren — tik om te wijzigen", "pl":"Twoje kolory — dotknij, aby zmienić"},
  "Deutéranopie": {"en":"Deuteranopia", "it":"Deuteranopia", "es":"Deuteranopía", "de":"Deuteranopie", "pt":"Deuteranopia", "nl":"Deuteranopie", "pl":"Deuteranopia"},
  "Mise à jour prête — Appuyez pour redémarrer": {"en":"Update ready — Tap to restart", "it":"Aggiornamento pronto — Tocca per riavviare", "es":"Actualización lista — Toca para reiniciar", "de":"Update bereit — Zum Neustart tippen", "pt":"Atualização pronta — Toca para reiniciar", "nl":"Update klaar — tik om te herstarten", "pl":"Aktualizacja gotowa — dotknij, aby zrestartować"},
  "Carte Bonus": {"en":"Wild card", "it":"Carta jolly", "es":"Carta comodín", "de":"Wild-Karte", "pt":"Carta curinga", "nl":"Bonuskaart", "pl":"Karta Bonus"},
  "La carte Bonus": {"en":"The Wild card", "it":"La carta jolly", "es":"La carta comodín", "de":"Die Wild-Karte", "pt":"A carta curinga", "nl":"De Bonuskaart", "pl":"Karta Bonus"},
  "La Carte Bonus": {"en":"The Wild card", "it":"La carta jolly", "es":"La carta comodín", "de":"Die Wild-Karte", "pt":"A carta curinga", "nl":"De Bonuskaart", "pl":"Karta Bonus"},
  "Joker": {"en":"Joker", "it":"Jolly", "es":"Comodín", "de":"Joker", "pt":"Joker", "nl":"Joker", "pl":"Joker"},
  "Valet (J)": {"en":"Jack (J)", "it":"Fante (J)", "es":"Jota (J)", "de":"Bube (J)", "pt":"Valete (J)", "nl":"Boer (B)", "pl":"Walet (W)"},
  "Dame (Q)": {"en":"Queen (Q)", "it":"Donna (Q)", "es":"Reina (Q)", "de":"Dame (Q)", "pt":"Dama (Q)", "nl":"Vrouw (V)", "pl":"Dama (D)"},
  "Roi (K)": {"en":"King (K)", "it":"Re (K)", "es":"Rey (K)", "de":"König (K)", "pt":"Rei (K)", "nl":"Koning (K)", "pl":"Król (K)"},
  "Valeur faciale": {"en":"Face value", "it":"Valore nominale", "es":"Valor nominal", "de":"Nennwert", "pt":"Valor facial", "nl":"Nominale waarde", "pl":"Wartość nominalna"},
  "Valeur des cartes": {"en":"Card values", "it":"Valore delle carte", "es":"Valor de las cartas", "de":"Kartenwerte", "pt":"Valor das cartas", "nl":"Kaartwaarde", "pl":"Wartość kart"},
  "20 pts (wildcard !)": {"en":"20 pts (wild!)", "it":"20 pti (jolly!)", "es":"20 pts (¡comodín!)", "de":"20 Pkt (wild!)", "pt":"20 pts (curinga!)", "nl":"20 ptn (wildcard!)", "pl":"20 pkt (dzika karta!)"},
  "Étoile": {"en":"Star", "it":"Stella", "es":"Estrella", "de":"Stern", "pt":"Estrela", "nl":"Ster", "pl":"Gwiazda"},
  "Trèfle": {"en":"Club", "it":"Fiori", "es":"Trébol", "de":"Kreuz", "pt":"Paus", "nl":"Klaveren", "pl":"Trefl"},
  "Retour": {"en":"Back", "it":"Indietro", "es":"Atrás", "de":"Zurück", "pt":"Voltar", "nl":"Terug", "pl":"Wstecz"},
  "11 pts": {"en":"11 pts", "it":"11 pti", "es":"11 pts", "de":"11 Pkt", "pt":"11 pts", "nl":"11 ptn", "pl":"11 pkt"},
  "12 pts": {"en":"12 pts", "it":"12 pti", "es":"12 pts", "de":"12 Pkt", "pt":"12 pts", "nl":"12 ptn", "pl":"12 pkt"},
  "13 pts": {"en":"13 pts", "it":"13 pti", "es":"13 pts", "de":"13 Pkt", "pt":"13 pts", "nl":"13 ptn", "pl":"13 pkt"},
  "50 pts": {"en":"50 pts", "it":"50 pti", "es":"50 pts", "de":"50 Pkt", "pt":"50 pts", "nl":"50 ptn", "pl":"50 pkt"},
  "11 manches · Bonus change chaque manche · Plus bas score gagne": {"en":"11 rounds · Wild card changes each round · Lowest score wins", "it":"11 mani · Il jolly cambia a ogni mano · Vince il punteggio più basso", "es":"11 rondas · El comodín cambia cada ronda · Gana la puntuación más baja", "de":"11 Runden · Wild-Karte wechselt jede Runde · Niedrigste Punktzahl gewinnt", "pt":"11 mãos · A carta curinga muda a cada mão · Ganha a pontuação mais baixa", "nl":"11 rondes · Bonus wisselt elke ronde · Laagste score wint", "pl":"11 rund · Bonus zmienia się co rundę · Wygrywa najniższy wynik"},
  "Obtenir le score le plus bas après 11 manches. Formez des": {"en":"Get the lowest score after 11 rounds. Form", "it":"Ottieni il punteggio più basso dopo 11 mani. Forma", "es":"Consigue la puntuación más baja tras 11 rondas. Forma", "de":"Erreiche nach 11 Runden die niedrigste Punktzahl. Bilde", "pt":"Obtém a pontuação mais baixa após 11 mãos. Forma", "nl":"Behaal de laagste score na 11 rondes. Vorm ", "pl":"Uzyskaj najniższy wynik po 11 rundach. Twórz "},
  "pour minimiser vos points de pénalité.": {"en":"to minimise your penalty points.", "it":"per ridurre al minimo i punti di penalità.", "es":"para minimizar tus puntos de penalización.", "de":"um deine Strafpunkte zu minimieren.", "pt":"para minimizar os teus pontos de penalização.", "nl":"om je strafpunten te beperken.", "pl":"aby zminimalizować punkty karne."},
  "116 cartes (2 jeux de 58) en 5 couleurs : ⭐ Étoiles, ♥ Cœurs, ♣ Trèfles, ♠ Piques, ♦ Carreaux. Chaque couleur a 11 cartes (3 à 10, J, Q, K) + 6 Jokers.": {"en":"116 cards (2 decks of 58) in 5 colours: ⭐ Stars, ♥ Hearts, ♣ Clubs, ♠ Spades, ♦ Diamonds. Each colour has 11 cards (3 to 10, J, Q, K) + 6 Jokers.", "it":"116 carte (2 mazzi da 58) in 5 colori: ⭐ Stelle, ♥ Cuori, ♣ Fiori, ♠ Picche, ♦ Quadri. Ogni colore ha 11 carte (da 3 a 10, J, Q, K) + 6 jolly.", "es":"116 cartas (2 barajas de 58) en 5 colores: ⭐ Estrellas, ♥ Corazones, ♣ Tréboles, ♠ Picas, ♦ Diamantes. Cada color tiene 11 cartas (3 a 10, J, Q, K) + 6 comodines.", "de":"116 Karten (2 Decks à 58) in 5 Farben: ⭐ Sterne, ♥ Herz, ♣ Kreuz, ♠ Pik, ♦ Karo. Jede Farbe hat 11 Karten (3 bis 10, B, D, K) + 6 Joker.", "pt":"116 cartas (2 baralhos de 58) em 5 cores: ⭐ Estrelas, ♥ Copas, ♣ Paus, ♠ Espadas, ♦ Ouros. Cada cor tem 11 cartas (3 a 10, J, Q, K) + 6 jokers.", "nl":"116 kaarten (2 sets van 58) in 5 kleuren: ⭐ Sterren, ♥ Harten, ♣ Klaveren, ♠ Schoppen, ♦ Ruiten. Elke kleur heeft 11 kaarten (3 t/m 10, B, V, K) + 6 Jokers.", "pl":"116 kart (2 talie po 58) w 5 kolorach: ⭐ Gwiazdy, ♥ Kier, ♣ Trefl, ♠ Pik, ♦ Karo. Każdy kolor ma 11 kart (3 do 10, W, D, K) + 6 Jokerów."},
  "La carte Bonus change à chaque manche : c'est la carte dont la valeur = nombre de cartes distribuées. Manche 3 → les 3 sont Bonus. Manche 13 → les Rois sont Bonus. Elle remplace n'importe quelle carte dans une combinaison !": {"en":"The Wild card changes every round: it is the card whose value = the number of cards dealt. Round 3 → the 3s are wild. Round 13 → the Kings are wild. It replaces any card in a meld!", "it":"La carta jolly cambia a ogni mano: è la carta il cui valore = numero di carte distribuite. Mano 3 → i 3 sono jolly. Mano 13 → i Re sono jolly. Sostituisce qualsiasi carta in una combinazione!", "es":"La carta comodín cambia cada ronda: es la carta cuyo valor = número de cartas repartidas. Ronda 3 → los 3 son comodines. Ronda 13 → los Reyes son comodines. ¡Sustituye a cualquier carta en una combinación!", "de":"Die Wild-Karte wechselt jede Runde: Es ist die Karte, deren Wert = Anzahl der ausgeteilten Karten. Runde 3 → die 3en sind wild. Runde 13 → die Könige sind wild. Sie ersetzt jede Karte in einer Kombination!", "pt":"A carta curinga muda a cada mão: é a carta cujo valor = número de cartas distribuídas. Mão 3 → os 3 são curingas. Mão 13 → os Reis são curingas. Substitui qualquer carta numa combinação!", "nl":"De Bonuskaart wisselt elke ronde: het is de kaart waarvan de waarde = aantal uitgedeelde kaarten. Ronde 3 → de 3's zijn Bonus. Ronde 13 → de Koningen zijn Bonus. Hij vervangt elke kaart in een combinatie!", "pl":"Karta Bonus zmienia się co rundę: to karta, której wartość = liczba rozdanych kart. Runda 3 → trójki są Bonusem. Runda 13 → Króle są Bonusem. Zastępuje dowolną kartę w układzie!"},
  "vos cartes en suites/familles (en gardant une à défausser), étalez vos combinaisons. Les autres joueurs ont encore": {"en":"your cards into runs/books (keeping one to discard), lay down your melds. The other players still get", "it":"le tue carte in scale/tris (tenendone una da scartare), cala le combinazioni. Gli altri giocatori hanno ancora", "es":"tus cartas en escaleras/tríos (guardando una para descartar), baja tus combinaciones. Los demás jugadores tienen aún", "de":"deine Karten in Folgen/Sätze ordnen kannst (eine zum Ablegen behalten), lege deine Kombinationen aus. Die anderen Spieler haben noch", "pt":"as tuas cartas em sequências/trios (guardando uma para descartar), baixa as combinações. Os outros jogadores têm ainda", "nl":"je kaarten in reeksen/sets (houd er één om af te leggen), leg je combinaties neer. De andere spelers krijgen nog", "pl":"swoje karty w sekwensy/komplety (zostawiając jedną do odrzucenia), wyłóż swoje układy. Pozostali gracze mają jeszcze"},
  "pour optimiser leur main. Seules les cartes restantes en main comptent comme pénalités.": {"en":"to optimise their hand. Only the cards left in hand count as penalties.", "it":"per ottimizzare la loro mano. Solo le carte rimaste in mano contano come penalità.", "es":"para optimizar su mano. Solo las cartas que quedan en la mano cuentan como penalización.", "de":"um ihre Hand zu optimieren. Nur die Karten auf der Hand zählen als Strafpunkte.", "pt":"para otimizar a mão. Só as cartas que ficam na mão contam como penalização.", "nl":"om hun hand te optimaliseren. Alleen de resterende kaarten in de hand tellen als strafpunten.", "pl":"aby zoptymalizować rękę. Tylko karty pozostałe w ręce liczą się jako punkty karne."},
  "\"La partie n'est pas perdue tant que les Rois ne sont pas le Bonus\"": {"en":"\"The game isn't lost until the Kings are wild\"", "it":"\"La partita non è persa finché i Re non sono jolly\"", "es":"\"La partida no está perdida hasta que los Reyes sean comodines\"", "de":"\"Das Spiel ist nicht verloren, solange die Könige nicht wild sind\"", "pt":"\"O jogo não está perdido enquanto os Reis não forem curingas\"", "nl":"\"Het spel is pas verloren als de Koningen de Bonus zijn\"", "pl":"\"Gra nie jest przegrana, dopóki Króle nie są Bonusem\""},
  "Ex : 5♣ 6♣ 7♣ ou 9⭐ 10⭐ J⭐ Q⭐": {"en":"E.g. 5♣ 6♣ 7♣ or 9⭐ 10⭐ J⭐ Q⭐", "it":"Es. 5♣ 6♣ 7♣ o 9⭐ 10⭐ J⭐ Q⭐", "es":"Ej. 5♣ 6♣ 7♣ o 9⭐ 10⭐ J⭐ Q⭐", "de":"z.B. 5♣ 6♣ 7♣ oder 9⭐ 10⭐ J⭐ Q⭐", "pt":"Ex.: 5♣ 6♣ 7♣ ou 9⭐ 10⭐ J⭐ Q⭐", "nl":"Bijv.: 5♣ 6♣ 7♣ of 9⭐ 10⭐ B⭐ V⭐", "pl":"Np.: 5♣ 6♣ 7♣ lub 9⭐ 10⭐ W⭐ D⭐"},
  "Ex : 8♣ 8⭐ 8♠ ou K♣ K♥ K♦ K⭐": {"en":"E.g. 8♣ 8⭐ 8♠ or K♣ K♥ K♦ K⭐", "it":"Es. 8♣ 8⭐ 8♠ o K♣ K♥ K♦ K⭐", "es":"Ej. 8♣ 8⭐ 8♠ o K♣ K♥ K♦ K⭐", "de":"z.B. 8♣ 8⭐ 8♠ oder K♣ K♥ K♦ K⭐", "pt":"Ex.: 8♣ 8⭐ 8♠ ou K♣ K♥ K♦ K⭐", "nl":"Bijv.: 8♣ 8⭐ 8♠ of K♣ K♥ K♦ K⭐", "pl":"Np.: 8♣ 8⭐ 8♠ lub K♣ K♥ K♦ K⭐"},
  "Connexion perdue — Vérifiez votre réseau": {"en":"Connection lost — Check your network", "it":"Connessione persa — Controlla la rete", "es":"Conexión perdida — Comprueba tu red", "de":"Verbindung verloren — Prüfe dein Netzwerk", "pt":"Ligação perdida — Verifica a tua rede", "nl":"Verbinding verbroken — controleer je netwerk", "pl":"Utracono połączenie — sprawdź sieć"},
  "Objectif": {"en":"Goal", "it":"Obiettivo", "es":"Objetivo", "de":"Ziel", "pt":"Objetivo", "nl":"Doel", "pl":"Cel"},
  "Suites": {"en":"Runs", "it":"Scale", "es":"Escaleras", "de":"Folgen", "pt":"Sequências", "nl":"Reeksen", "pl":"Sekwensy"},
  "suites": {"en":"runs", "it":"scale", "es":"escaleras", "de":"Folgen", "pt":"sequências", "nl":"reeksen", "pl":"sekwensy"},
  "Familles": {"en":"Books", "it":"Tris", "es":"Tríos", "de":"Sätze", "pt":"Trios", "nl":"Sets", "pl":"Komplety"},
  "familles": {"en":"books", "it":"tris", "es":"tríos", "de":"Sätze", "pt":"trios", "nl":"sets", "pl":"komplety"},
  "Conseils": {"en":"Tips", "it":"Consigli", "es":"Consejos", "de":"Tipps", "pt":"Dicas", "nl":"Tips", "pl":"Wskazówki"},
  "Déroulement d'un tour": {"en":"How a turn works", "it":"Svolgimento di un turno", "es":"Desarrollo de un turno", "de":"Ablauf eines Zuges", "pt":"Como decorre um turno", "nl":"Verloop van een beurt", "pl":"Przebieg tury"},
  "même couleur": {"en":"same colour", "it":"stesso colore", "es":"mismo color", "de":"gleiche Farbe", "pt":"mesma cor", "nl":"zelfde kleur", "pl":"ten sam kolor"},
  "même valeur": {"en":"same value", "it":"stesso valore", "es":"mismo valor", "de":"gleicher Wert", "pt":"mesmo valor", "nl":"zelfde waarde", "pl":"ta sama wartość"},
  "en séquence.": {"en":"in sequence.", "it":"in sequenza.", "es":"en secuencia.", "de":"in Folge.", "pt":"em sequência.", "nl":"op volgorde.", "pl":"po kolei."},
  ", quelle que soit la couleur.": {"en":", regardless of colour.", "it":", indipendentemente dal colore.", "es":", sin importar el color.", "de":", unabhängig von der Farbe.", "pt":", independentemente da cor.", "nl":", ongeacht de kleur.", "pl":", niezależnie od koloru."},
  "3 cartes ou plus de la": {"en":"3 or more cards of the", "it":"3 o più carte dello", "es":"3 o más cartas del", "de":"3 oder mehr Karten der", "pt":"3 ou mais cartas da", "nl":"3 of meer kaarten van ", "pl":"3 lub więcej kart o "},
  "Piochez 1 carte (pioche ou défausse)": {"en":"Draw 1 card (deck or discard)", "it":"Pesca 1 carta (mazzo o scarti)", "es":"Roba 1 carta (mazo o descarte)", "de":"Ziehe 1 Karte (Stapel oder Ablage)", "pt":"Tira 1 carta (baralho ou descarte)", "nl":"Trek 1 kaart (trekstapel of aflegstapel)", "pl":"Dobierz 1 kartę (z talii lub stosu odrzuconych)"},
  "Défaussez 1 carte": {"en":"Discard 1 card", "it":"Scarta 1 carta", "es":"Descarta 1 carta", "de":"Lege 1 Karte ab", "pt":"Descarta 1 carta", "nl":"Leg 1 kaart af", "pl":"Odrzuć 1 kartę"},
  "Organisez vos cartes en suites/familles": {"en":"Organise your cards into runs/books", "it":"Organizza le carte in scale/tris", "es":"Organiza tus cartas en escaleras/tríos", "de":"Ordne deine Karten in Folgen/Sätze", "pt":"Organiza as cartas em sequências/trios", "nl":"Rangschik je kaarten in reeksen/sets", "pl":"Ułóż karty w sekwensy/komplety"},
  "Les Jokers et Bonus remplacent n'importe quelle carte.": {"en":"Jokers and Wild cards replace any card.", "it":"Jolly e carta jolly sostituiscono qualsiasi carta.", "es":"Comodines y carta comodín sustituyen a cualquier carta.", "de":"Joker und Wild-Karten ersetzen jede Karte.", "pt":"Jokers e cartas curinga substituem qualquer carta.", "nl":"Jokers en Bonus vervangen elke kaart.", "pl":"Jokery i Bonus zastępują dowolną kartę."},
  "Gardez un œil sur la carte Bonus du tour": {"en":"Keep an eye on this round's Wild card", "it":"Tieni d'occhio la carta jolly del turno", "es":"Vigila la carta comodín de la ronda", "de":"Behalte die Wild-Karte der Runde im Auge", "pt":"Fica atento à carta curinga da mão", "nl":"Houd de Bonuskaart van de ronde in de gaten", "pl":"Miej na oku kartę Bonus danej rundy"},
  "Méfiez-vous des Jokers (50 pts si non combinés !)": {"en":"Beware of Jokers (50 pts if unmelded!)", "it":"Attenzione ai jolly (50 pti se non combinati!)", "es":"Cuidado con los comodines (¡50 pts si no se combinan!)", "de":"Vorsicht bei Jokern (50 Pkt, wenn nicht kombiniert!)", "pt":"Cuidado com os jokers (50 pts se não combinados!)", "nl":"Pas op met Jokers (50 ptn als ze niet gecombineerd zijn!)", "pl":"Uważaj na Jokery (50 pkt, jeśli nie w układzie!)"},
  "Si un Joker est défaussé, seul le joueur suivant peut le prendre": {"en":"If a Joker is discarded, only the next player may take it", "it":"Se un jolly viene scartato, solo il giocatore successivo può prenderlo", "es":"Si se descarta un comodín, solo el siguiente jugador puede tomarlo", "de":"Wird ein Joker abgelegt, darf ihn nur der nächste Spieler nehmen", "pt":"Se um joker for descartado, só o jogador seguinte o pode tirar", "nl":"Als een Joker wordt afgelegd, mag alleen de volgende speler hem pakken", "pl":"Jeśli Joker zostanie odrzucony, może go wziąć tylko następny gracz"},
  "Si toutes vos cartes forment des combinaisons →": {"en":"If all your cards form melds →", "it":"Se tutte le tue carte formano combinazioni →", "es":"Si todas tus cartas forman combinaciones →", "de":"Wenn alle deine Karten Kombinationen bilden →", "pt":"Se todas as tuas cartas formarem combinações →", "nl":"Als al je kaarten combinaties vormen →", "pl":"Jeśli wszystkie twoje karty tworzą układy →"},
  "un dernier tour": {"en":"one last turn", "it":"un ultimo turno", "es":"un último turno", "de":"eine letzte Runde", "pt":"um último turno", "nl":"een laatste beurt", "pl":"jedna ostatnia tura"},
  "Quand vous pouvez organiser": {"en":"When you can organise", "it":"Quando puoi organizzare", "es":"Cuando puedas organizar", "de":"Wenn du", "pt":"Quando conseguires organizar", "nl":"Wanneer je ", "pl":"Gdy możesz ułożyć "},
  "toutes": {"en":"all", "it":"tutte", "es":"todas", "de":"alle", "pt":"todas", "nl":"al", "pl":"wszystkie"},
  "et des": {"en":"and", "it":"e", "es":"y", "de":"und", "pt":"e", "nl":"en ", "pl":"oraz "},
  "ou": {"en":"or", "it":"o", "es":"o", "de":"oder", "pt":"ou", "nl":"of", "pl":"lub"},
  "Tu pioches ": {"en":"You draw ", "it":"Peschi ", "es":"Robas ", "de":"Du ziehst ", "pt":"Tiras ", "nl":"Je trekt ", "pl":"Dobierasz "},
  "Tu prends ": {"en":"You take ", "it":"Prendi ", "es":"Tomas ", "de":"Du nimmst ", "pt":"Tiras ", "nl":"Je pakt ", "pl":"Bierzesz "},
  "Tu défausses ": {"en":"You discard ", "it":"Scarti ", "es":"Descartas ", "de":"Du legst ab ", "pt":"Descartas ", "nl":"Je legt ", "pl":"Odrzucasz "},
  ". Sélectionne une carte à défausser.": {"en":". Select a card to discard.", "it":". Seleziona una carta da scartare.", "es":". Selecciona una carta para descartar.", "de":". Wähle eine Karte zum Ablegen.", "pt":". Seleciona uma carta para descartar.", "nl":" af. Kies een kaart om af te leggen.", "pl":". Wybierz kartę do odrzucenia."},
  "un Joker": {"en":"a Joker", "it":"un jolly", "es":"un comodín", "de":"einen Joker", "pt":"um joker", "nl":"een Joker", "pl":"Jokera"},
  "Piochez une carte": {"en":"Draw a card", "it":"Pesca una carta", "es":"Roba una carta", "de":"Ziehe eine Karte", "pt":"Tira uma carta", "nl":"Trek een kaart", "pl":"Dobierz kartę"},
  "Piochez une carte.": {"en":"Draw a card.", "it":"Pesca una carta.", "es":"Roba una carta.", "de":"Ziehe eine Karte.", "pt":"Tira uma carta.", "nl":"Trek een kaart.", "pl":"Dobierz kartę."},
  "Clique la pioche ou la défausse": {"en":"Tap the deck or the discard pile", "it":"Tocca il mazzo o gli scarti", "es":"Toca el mazo o el descarte", "de":"Tippe auf den Stapel oder die Ablage", "pt":"Toca no baralho ou no descarte", "nl":"Klik op de trekstapel of de aflegstapel", "pl":"Kliknij talię lub stos odrzuconych"},
  "Sélectionne la carte à défausser": {"en":"Select the card to discard", "it":"Seleziona la carta da scartare", "es":"Selecciona la carta a descartar", "de":"Wähle die Karte zum Ablegen", "pt":"Seleciona a carta a descartar", "nl":"Kies de kaart om af te leggen", "pl":"Wybierz kartę do odrzucenia"},
  "Sélectionne la carte à défausser.": {"en":"Select the card to discard.", "it":"Seleziona la carta da scartare.", "es":"Selecciona la carta a descartar.", "de":"Wähle die Karte zum Ablegen.", "pt":"Seleciona a carta a descartar.", "nl":"Kies de kaart om af te leggen.", "pl":"Wybierz kartę do odrzucenia."},
  "Sélectionne d'abord une carte à défausser.": {"en":"First select a card to discard.", "it":"Prima seleziona una carta da scartare.", "es":"Primero selecciona una carta para descartar.", "de":"Wähle zuerst eine Karte zum Ablegen.", "pt":"Primeiro seleciona uma carta para descartar.", "nl":"Kies eerst een kaart om af te leggen.", "pl":"Najpierw wybierz kartę do odrzucenia."},
  "La carte à défausser doit être en main.": {"en":"The card to discard must be in your hand.", "it":"La carta da scartare deve essere in mano.", "es":"La carta a descartar debe estar en tu mano.", "de":"Die abzulegende Karte muss auf der Hand sein.", "pt":"A carta a descartar tem de estar na mão.", "nl":"De af te leggen kaart moet in je hand zijn.", "pl":"Karta do odrzucenia musi być w ręce."},
  "Remets la carte en main avant de la défausser.": {"en":"Put the card back in your hand before discarding it.", "it":"Rimetti la carta in mano prima di scartarla.", "es":"Devuelve la carta a tu mano antes de descartarla.", "de":"Nimm die Karte zurück auf die Hand, bevor du sie ablegst.", "pt":"Volta a pôr a carta na mão antes de a descartares.", "nl":"Leg de kaart terug in je hand voordat je hem aflegt.", "pl":"Odłóż kartę do ręki przed jej odrzuceniem."},
  "Toutes tes cartes sont dans des plis": {"en":"All your cards are in melds", "it":"Tutte le tue carte sono in combinazioni", "es":"Todas tus cartas están en combinaciones", "de":"Alle deine Karten sind in Kombinationen", "pt":"Todas as tuas cartas estão em combinações", "nl":"Al je kaarten zitten in groepen", "pl":"Wszystkie twoje karty są w grupach"},
  "Sélectionne une carte, puis \"+ Nouveau pli\"": {"en":"Select a card, then \"+ New meld\"", "it":"Seleziona una carta, poi \"+ Nuova combinazione\"", "es":"Selecciona una carta y luego \"+ Nueva combinación\"", "de":"Wähle eine Karte, dann \"+ Neue Kombination\"", "pt":"Seleciona uma carta e depois \"+ Nova combinação\"", "nl":"Kies een kaart en dan \"+ Nieuwe groep\"", "pl":"Wybierz kartę, a potem \"+ Nowa grupa\""},
  "Sélectionnée — défausse, abat ou mets dans un pli": {"en":"Selected — discard, go out, or add to a meld", "it":"Selezionata — scarta, chiudi o metti in una combinazione", "es":"Seleccionada — descarta, cierra o ponla en una combinación", "de":"Ausgewählt — ablegen, rausgehen oder in eine Kombination legen", "pt":"Selecionada — descarta, fecha ou põe numa combinação", "nl":"Geselecteerd — afleggen, uitkomen of in een groep leggen", "pl":"Wybrana — odrzuć, wyłóż lub dodaj do grupy"},
  "Impossible d'abattre ! Vérifiez vos combinaisons.": {"en":"Cannot go out! Check your melds.", "it":"Impossibile chiudere! Controlla le combinazioni.", "es":"¡No puedes cerrar! Revisa tus combinaciones.", "de":"Rausgehen nicht möglich! Prüfe deine Kombinationen.", "pt":"Não podes fechar! Verifica as tuas combinações.", "nl":"Uitkomen niet mogelijk! Controleer je combinaties.", "pl":"Nie można wyłożyć! Sprawdź swoje układy."},
  "Impossible d'abattre ! Les cartes restantes ne forment pas des combinaisons.": {"en":"Cannot go out! The remaining cards do not form melds.", "it":"Impossibile chiudere! Le carte rimaste non formano combinazioni.", "es":"¡No puedes cerrar! Las cartas restantes no forman combinaciones.", "de":"Rausgehen nicht möglich! Die restlichen Karten bilden keine Kombinationen.", "pt":"Não podes fechar! As cartas restantes não formam combinações.", "nl":"Uitkomen niet mogelijk! De resterende kaarten vormen geen combinaties.", "pl":"Nie można wyłożyć! Pozostałe karty nie tworzą układów."},
  "Ce Joker est réservé au joueur suivant !": {"en":"This Joker is reserved for the next player!", "it":"Questo jolly è riservato al giocatore successivo!", "es":"¡Este comodín está reservado al siguiente jugador!", "de":"Dieser Joker ist für den nächsten Spieler reserviert!", "pt":"Este joker está reservado ao jogador seguinte!", "nl":"Deze Joker is voor de volgende speler!", "pl":"Ten Joker jest dla następnego gracza!"},
  "Joker réservé au joueur suivant": {"en":"Joker reserved for the next player", "it":"Jolly riservato al giocatore successivo", "es":"Comodín reservado al siguiente jugador", "de":"Joker für den nächsten Spieler reserviert", "pt":"Joker reservado ao jogador seguinte", "nl":"Joker gereserveerd voor de volgende speler", "pl":"Joker zarezerwowany dla następnego gracza"},
  "Chargement de la pub…": {"en":"Loading ad…", "it":"Caricamento pubblicità…", "es":"Cargando anuncio…", "de":"Werbung wird geladen…", "pt":"A carregar anúncio…", "nl":"Advertentie laden…", "pl":"Ładowanie reklamy…"},
  "Pub non disponible, réessaie plus tard.": {"en":"Ad unavailable, try again later.", "it":"Pubblicità non disponibile, riprova più tardi.", "es":"Anuncio no disponible, inténtalo más tarde.", "de":"Werbung nicht verfügbar, versuch es später.", "pt":"Anúncio indisponível, tenta mais tarde.", "nl":"Advertentie niet beschikbaar, probeer het later opnieuw.", "pl":"Reklama niedostępna, spróbuj później."},
  "Pub indisponible sur cette plateforme.": {"en":"Ads unavailable on this platform.", "it":"Pubblicità non disponibile su questa piattaforma.", "es":"Anuncios no disponibles en esta plataforma.", "de":"Werbung auf dieser Plattform nicht verfügbar.", "pt":"Anúncios indisponíveis nesta plataforma.", "nl":"Advertentie niet beschikbaar op dit platform.", "pl":"Reklama niedostępna na tej platformie."},
  "Sauvegarde illisible, impossible de reprendre.": {"en":"Save file unreadable, cannot resume.", "it":"Salvataggio illeggibile, impossibile riprendere.", "es":"Guardado ilegible, no se puede reanudar.", "de":"Spielstand unlesbar, Fortsetzen nicht möglich.", "pt":"Gravação ilegível, não é possível retomar.", "nl":"Opgeslagen spel onleesbaar, hervatten niet mogelijk.", "pl":"Zapis nieczytelny, nie można wznowić."},
  "Temps écoulé — pioche automatique": {"en":"Time's up — automatic draw", "it":"Tempo scaduto — pesca automatica", "es":"Tiempo agotado — robo automático", "de":"Zeit abgelaufen — automatisches Ziehen", "pt":"Tempo esgotado — tirada automática", "nl":"Tijd om — automatisch trekken", "pl":"Czas minął — automatyczne dobranie"},
  "Dernier tour ! Piochez puis défaussez.": {"en":"Last turn! Draw then discard.", "it":"Ultimo turno! Pesca e poi scarta.", "es":"¡Último turno! Roba y descarta.", "de":"Letzter Zug! Ziehen, dann ablegen.", "pt":"Último turno! Tira e depois descarta.", "nl":"Laatste beurt! Trek en leg dan af.", "pl":"Ostatnia tura! Dobierz i odrzuć."},
  "Email et mot de passe requis.": {"en":"Email and password required.", "it":"Email e password obbligatori.", "es":"Correo y contraseña obligatorios.", "de":"E-Mail und Passwort erforderlich.", "pt":"E-mail e palavra-passe obrigatórios.", "nl":"E-mail en wachtwoord vereist.", "pl":"Wymagany e-mail i hasło."},
  "Email ou mot de passe incorrect.": {"en":"Incorrect email or password.", "it":"Email o password errati.", "es":"Correo o contraseña incorrectos.", "de":"E-Mail oder Passwort falsch.", "pt":"E-mail ou palavra-passe incorretos.", "nl":"E-mail of wachtwoord onjuist.", "pl":"Nieprawidłowy e-mail lub hasło."},
  "Email déjà utilisé.": {"en":"Email already in use.", "it":"Email già in uso.", "es":"Correo ya utilizado.", "de":"E-Mail bereits verwendet.", "pt":"E-mail já utilizado.", "nl":"E-mail al in gebruik.", "pl":"E-mail już używany."},
  "Mot de passe incorrect.": {"en":"Incorrect password.", "it":"Password errata.", "es":"Contraseña incorrecta.", "de":"Falsches Passwort.", "pt":"Palavra-passe incorreta.", "nl":"Wachtwoord onjuist.", "pl":"Nieprawidłowe hasło."},
  "Mot de passe trop court (min 6 caractères).": {"en":"Password too short (min 6 characters).", "it":"Password troppo corta (min 6 caratteri).", "es":"Contraseña muy corta (mín. 6 caracteres).", "de":"Passwort zu kurz (min. 6 Zeichen).", "pt":"Palavra-passe muito curta (mín. 6 caracteres).", "nl":"Wachtwoord te kort (min. 6 tekens).", "pl":"Hasło za krótkie (min. 6 znaków)."},
  "Aucun compte avec cet email.": {"en":"No account with this email.", "it":"Nessun account con questa email.", "es":"No hay cuenta con este correo.", "de":"Kein Konto mit dieser E-Mail.", "pt":"Nenhuma conta com este e-mail.", "nl":"Geen account met dit e-mailadres.", "pl":"Brak konta z tym adresem e-mail."},
  "Email envoyé ! Vérifie ta boîte de réception.": {"en":"Email sent! Check your inbox.", "it":"Email inviata! Controlla la posta.", "es":"¡Correo enviado! Revisa tu bandeja.", "de":"E-Mail gesendet! Prüfe dein Postfach.", "pt":"E-mail enviado! Verifica a caixa de entrada.", "nl":"E-mail verzonden! Controleer je inbox.", "pl":"E-mail wysłany! Sprawdź skrzynkę odbiorczą."},
  "Entre ton email ci-dessus d'abord.": {"en":"Enter your email above first.", "it":"Inserisci prima la tua email qui sopra.", "es":"Introduce antes tu correo arriba.", "de":"Gib zuerst oben deine E-Mail ein.", "pt":"Introduz primeiro o teu e-mail acima.", "nl":"Voer eerst je e-mailadres hierboven in.", "pl":"Najpierw wpisz e-mail powyżej."},
  "Erreur de connexion.": {"en":"Connection error.", "it":"Errore di connessione.", "es":"Error de conexión.", "de":"Verbindungsfehler.", "pt":"Erro de ligação.", "nl":"Inlogfout.", "pl":"Błąd logowania."},
  "Erreur réseau. Réessaie.": {"en":"Network error. Try again.", "it":"Errore di rete. Riprova.", "es":"Error de red. Inténtalo de nuevo.", "de":"Netzwerkfehler. Versuch's nochmal.", "pt":"Erro de rede. Tenta de novo.", "nl":"Netwerkfout. Probeer opnieuw.", "pl":"Błąd sieci. Spróbuj ponownie."},
  "Erreur réseau. Réessayez.": {"en":"Network error. Please try again.", "it":"Errore di rete. Riprovare.", "es":"Error de red. Vuelva a intentarlo.", "de":"Netzwerkfehler. Bitte erneut versuchen.", "pt":"Erro de rede. Tente novamente.", "nl":"Netwerkfout. Probeer opnieuw.", "pl":"Błąd sieci. Spróbuj ponownie."},
  "Erreur lors de la mise à jour. Réessaie.": {"en":"Update error. Try again.", "it":"Errore durante l'aggiornamento. Riprova.", "es":"Error al actualizar. Inténtalo de nuevo.", "de":"Fehler beim Aktualisieren. Versuch's nochmal.", "pt":"Erro ao atualizar. Tenta de novo.", "nl":"Fout bij het bijwerken. Probeer opnieuw.", "pl":"Błąd podczas aktualizacji. Spróbuj ponownie."},
  "Compte désactivé.": {"en":"Account disabled.", "it":"Account disattivato.", "es":"Cuenta desactivada.", "de":"Konto deaktiviert.", "pt":"Conta desativada.", "nl":"Account uitgeschakeld.", "pl":"Konto wyłączone."},
  "Choisis un pseudo.": {"en":"Choose a nickname.", "it":"Scegli un nickname.", "es":"Elige un apodo.", "de":"Wähle einen Spitznamen.", "pt":"Escolhe uma alcunha.", "nl":"Kies een gebruikersnaam.", "pl":"Wybierz pseudonim."},
  "Ce pseudo est déjà pris.": {"en":"This nickname is taken.", "it":"Questo nickname è già in uso.", "es":"Este apodo ya está en uso.", "de":"Dieser Spitzname ist vergeben.", "pt":"Esta alcunha já está em uso.", "nl":"Deze gebruikersnaam is al bezet.", "pl":"Ten pseudonim jest już zajęty."},
  "Pseudo trop court (min 2 caractères).": {"en":"Nickname too short (min 2 characters).", "it":"Nickname troppo corto (min 2 caratteri).", "es":"Apodo muy corto (mín. 2 caracteres).", "de":"Spitzname zu kurz (min. 2 Zeichen).", "pt":"Alcunha muito curta (mín. 2 caracteres).", "nl":"Gebruikersnaam te kort (min. 2 tekens).", "pl":"Pseudonim za krótki (min. 2 znaki)."},
  "Changement de pseudo": {"en":"Nickname change", "it":"Cambio nickname", "es":"Cambio de apodo", "de":"Spitzname ändern", "pt":"Mudança de alcunha", "nl":"Gebruikersnaam wijzigen", "pl":"Zmiana pseudonimu"},
  "Pseudo mis à jour !": {"en":"Nickname updated!", "it":"Nickname aggiornato!", "es":"¡Apodo actualizado!", "de":"Spitzname aktualisiert!", "pt":"Alcunha atualizada!", "nl":"Gebruikersnaam bijgewerkt!", "pl":"Pseudonim zaktualizowany!"},
  "Créez d'abord une partie !": {"en":"Create a game first!", "it":"Prima crea una partita!", "es":"¡Crea antes una partida!", "de":"Erstelle zuerst ein Spiel!", "pt":"Cria primeiro um jogo!", "nl":"Maak eerst een spel aan!", "pl":"Najpierw utwórz grę!"},
  "Recréation impossible — le code a changé. Créez une nouvelle partie.": {"en":"Cannot recreate — the code has changed. Create a new game.", "it":"Impossibile ricreare — il codice è cambiato. Crea una nuova partita.", "es":"No se puede recrear — el código ha cambiado. Crea una nueva partida.", "de":"Neuerstellen nicht möglich — der Code hat sich geändert. Erstelle ein neues Spiel.", "pt":"Não é possível recriar — o código mudou. Cria um novo jogo.", "nl":"Opnieuw aanmaken niet mogelijk — de code is gewijzigd. Maak een nieuw spel aan.", "pl":"Nie można odtworzyć — kod się zmienił. Utwórz nową grę."},
  "Invitation reçue !": {"en":"Invitation received!", "it":"Invito ricevuto!", "es":"¡Invitación recibida!", "de":"Einladung erhalten!", "pt":"Convite recebido!", "nl":"Uitnodiging ontvangen!", "pl":"Otrzymano zaproszenie!"},
  "Invitation par SMS": {"en":"SMS invitation", "it":"Invito via SMS", "es":"Invitación por SMS", "de":"SMS-Einladung", "pt":"Convite por SMS", "nl":"Uitnodiging via sms", "pl":"Zaproszenie przez SMS"},
  "Un ami": {"en":"A friend", "it":"Un amico", "es":"Un amigo", "de":"Ein Freund", "pt":"Um amigo", "nl":"Een vriend", "pl":"Znajomy"},
  "Un utilisateur": {"en":"A user", "it":"Un utente", "es":"Un usuario", "de":"Ein Benutzer", "pt":"Um utilizador", "nl":"Een gebruiker", "pl":"Użytkownik"},
  "Hôte": {"en":"Host", "it":"Host", "es":"Anfitrión", "de":"Gastgeber", "pt":"Anfitrião", "nl":"Host", "pl":"Gospodarz"},
  "Invité": {"en":"Guest", "it":"Ospite", "es":"Invitado", "de":"Gast", "pt":"Convidado", "nl":"Gast", "pl":"Gość"},
  "Invité ✓": {"en":"Invited ✓", "it":"Invitato ✓", "es":"Invitado ✓", "de":"Eingeladen ✓", "pt":"Convidado ✓", "nl":"Uitgenodigd ✓", "pl":"Zaproszony ✓"},
  "Déjà invité ✓": {"en":"Already invited ✓", "it":"Già invitato ✓", "es":"Ya invitado ✓", "de":"Bereits eingeladen ✓", "pt":"Já convidado ✓", "nl":"Al uitgenodigd ✓", "pl":"Już zaproszony ✓"},
  "Copié !": {"en":"Copied!", "it":"Copiato!", "es":"¡Copiado!", "de":"Kopiert!", "pt":"Copiado!", "nl":"Gekopieerd!", "pl":"Skopiowano!"},
  "Aucun résultat": {"en":"No results", "it":"Nessun risultato", "es":"Sin resultados", "de":"Keine Ergebnisse", "pt":"Sem resultados", "nl":"Geen resultaten", "pl":"Brak wyników"},
  "Demande annulée.": {"en":"Request cancelled.", "it":"Richiesta annullata.", "es":"Solicitud cancelada.", "de":"Anfrage abgebrochen.", "pt":"Pedido cancelado.", "nl":"Verzoek geannuleerd.", "pl":"Zaproszenie anulowane."},
  "Réservé": {"en":"Locked", "it":"Riservato", "es":"Reservado", "de":"Gesperrt", "pt":"Reservado", "nl":"Gereserveerd", "pl":"Zarezerwowany"},
  "Même prendre la carte du dessus ne t'aiderait pas : il te resterait toujours deux cartes seules. Pioche pour voir.": {"en":"Even taking the top card wouldn't help: you'd still have two lone cards. Draw to see.", "it":"Anche prendere la carta in cima non aiuterebbe: resterebbero comunque due carte sole. Pesca per vedere.", "es":"Ni tomar la carta de arriba ayudaría: seguirías con dos cartas solas. Roba para ver.", "de":"Selbst die oberste Karte zu nehmen würde nicht helfen: du hättest immer noch zwei einzelne Karten. Zieh, um zu sehen.", "pt":"Mesmo pegar a carta do topo não ajudaria: continuarias com duas cartas sós. Compra para ver.", "nl":"Zelfs de bovenste kaart pakken zou niet helpen: je zou nog steeds twee losse kaarten overhouden. Trek om te zien.", "pl":"Nawet wzięcie wierzchniej karty by nie pomogło: i tak zostałyby ci dwie luźne karty. Dobierz, aby zobaczyć."},
  "Ni la pioche ni la défausse ne peuvent caser ton 4 et ton 5 ici. Pioche pour voir ce qu'il se passe.": {"en":"Neither the deck nor the discard can group your 4 and 5 here. Draw to see what happens.", "it":"Né il mazzo né gli scarti possono sistemare il tuo 4 e 5 qui. Pesca per vedere.", "es":"Ni el mazo ni el descarte pueden agrupar tu 4 y tu 5 aquí. Roba para ver.", "de":"Weder Stapel noch Ablage können deine 4 und 5 hier gruppieren. Zieh, um zu sehen.", "pt":"Nem o baralho nem o descarte podem agrupar o teu 4 e 5 aqui. Compra para ver.", "nl":"Noch de trekstapel noch de aflegstapel kan je 4 en je 5 hier kwijt. Trek om te zien wat er gebeurt.", "pl":"Ani talia, ani stos odrzuconych nie pomieszczą tu twojej 4 i 5. Dobierz, aby zobaczyć, co się stanie."},
  "Astuce : maintiens une carte appuyée pour la déplacer et ranger ta main comme tu veux.": {"en":"Tip: hold a card to move it and arrange your hand however you like.", "it":"Consiglio: tieni premuta una carta per spostarla e ordinare la mano come vuoi.", "es":"Consejo: mantén pulsada una carta para moverla y ordenar tu mano como quieras.", "de":"Tipp: Halte eine Karte gedrückt, um sie zu verschieben und deine Hand nach Belieben zu ordnen.", "pt":"Dica: mantém uma carta premida para a mover e organizar a mão como quiseres.", "nl":"Tip: houd een kaart ingedrukt om hem te verplaatsen en je hand te ordenen zoals jij wilt.", "pl":"Wskazówka: przytrzymaj kartę, aby ją przesunąć i ułożyć rękę wedle uznania."},
  "Touche pour fermer": {"en":"Tap to close", "it":"Tocca per chiudere", "es":"Toca para cerrar", "de":"Zum Schließen tippen", "pt":"Toca para fechar", "nl":"Tik om te sluiten", "pl":"Dotknij, aby zamknąć"},
  "Atout aux 5. Tu as trois 10 : une belle famille. Mais attention — pour finir une manche, il faut caser TOUTES ses cartes, pas juste une.": {"en":"Wild is 5s. You have three 10s: a nice set. But careful — to end a round you must group ALL your cards, not just some.", "it":"Jolly ai 5. Hai tre 10: un bel tris. Ma attenzione — per finire una mano devi sistemare TUTTE le carte, non solo alcune.", "es":"Comodín en los 5. Tienes tres 10: un buen grupo. Pero cuidado — para terminar una ronda debes agrupar TODAS tus cartas, no solo algunas.", "de":"Joker sind 5er. Du hast drei 10er: ein schöner Satz. Aber Achtung — um eine Runde zu beenden, musst du ALLE Karten gruppieren, nicht nur einige.", "pt":"Trunfo nos 5. Tens três 10: um belo conjunto. Mas atenção — para terminar uma mão tens de agrupar TODAS as cartas, não só algumas.", "nl":"Bonus op de 5's. Je hebt drie 10's: een mooie set. Maar let op — om een ronde te beëindigen moet je AL je kaarten plaatsen, niet slechts één.", "pl":"Bonus na 5. Masz trzy 10: ładny komplet. Ale uwaga — aby zakończyć rundę, trzeba ułożyć WSZYSTKIE karty, nie tylko jeden układ."},
  "Regarde : ces deux cartes-là restent seules, hors de la famille. Tant qu'elles ne forment pas un groupe, tu ne peux pas abattre.": {"en":"Look: these two stay alone, outside the set. Until they form a group, you can't go out.", "it":"Guarda: queste due restano sole, fuori dal tris. Finché non formano un gruppo, non puoi chiudere.", "es":"Mira: estas dos quedan solas, fuera del grupo. Hasta que formen un grupo, no puedes cerrar.", "de":"Schau: diese zwei bleiben allein, außerhalb des Satzes. Solange sie keine Gruppe bilden, kannst du nicht rausgehen.", "pt":"Olha: estas duas ficam sós, fora do conjunto. Enquanto não formarem um grupo, não podes fechar.", "nl":"Kijk: die twee kaarten blijven los, buiten de set. Zolang ze geen groep vormen, kun je niet uitkomen.", "pl":"Spójrz: te dwie karty zostają luźne, poza kompletem. Dopóki nie utworzą grupy, nie możesz wyłożyć."},
  "Pioche pour voir.": {"en":"Draw to see.", "it":"Pesca per vedere.", "es":"Roba para ver.", "de":"Zieh, um zu sehen.", "pt":"Compra para ver.", "nl":"Trek om te zien.", "pl":"Dobierz, aby zobaczyć."},
  "« Abattre » reste éteint : ta famille est là, mais deux cartes traînent encore. On ne gagne que si TOUT est casé. La prochaine leçon montre comment y arriver.": {"en":"\"Go out\" stays off: your set is there, but two cards still linger. You only win if EVERYTHING is grouped. The next lesson shows how.", "it":"\"Chiudi\" resta spento: il tris c'è, ma due carte restano. Si vince solo se TUTTO è sistemato. La prossima lezione mostra come.", "es":"\"Cerrar\" sigue apagado: tu grupo está, pero dos cartas quedan. Solo ganas si TODO está agrupado. La próxima lección muestra cómo.", "de":"\"Rausgehen\" bleibt aus: dein Satz ist da, aber zwei Karten bleiben. Du gewinnst nur, wenn ALLES gruppiert ist. Die nächste Lektion zeigt wie.", "pt":"\"Fechar\" fica apagado: o teu conjunto está lá, mas duas cartas ficam. Só ganhas se TUDO estiver agrupado. A próxima lição mostra como.", "nl":"\"Uitkomen\" blijft uit: je set is er, maar twee kaarten blijven over. Je wint alleen als ALLES geplaatst is. De volgende les laat zien hoe.", "pl":"„Wyłóż” pozostaje wygaszone: komplet jest, ale dwie karty wciąż zostają. Wygrywasz tylko, gdy WSZYSTKO jest ułożone. Następna lekcja pokaże jak."},
  "Le 3 est isolé. Sélectionne-le.": {"en":"The 3 is isolated. Select it.", "it":"Il 3 è isolato. Selezionalo.", "es":"El 3 está aislado. Selecciónalo.", "de":"Die 3 ist allein. Wähle sie.", "pt":"O 3 está isolado. Seleciona-o.", "nl":"De 3 staat los. Selecteer hem.", "pl":"Trójka jest luźna. Wybierz ją."},
  "Astuce : maintiens une carte appuyée pour la déplacer et ranger ta suite côte à côte. Essaie, puis continue.": {"en":"Tip: hold a card to move it and line up your run. Try it, then continue.", "it":"Consiglio: tieni premuta una carta per spostarla e allineare la scala. Prova, poi continua.", "es":"Consejo: mantén pulsada una carta para moverla y alinear tu escalera. Pruébalo y continúa.", "de":"Tipp: Halte eine Karte gedrückt, um sie zu verschieben und deine Folge zu ordnen. Probiere es, dann weiter.", "pt":"Dica: mantém uma carta premida para a mover e alinhar a sequência. Experimenta e continua.", "nl":"Tip: houd een kaart ingedrukt om hem te verplaatsen en je reeks naast elkaar te leggen. Probeer het, ga dan verder.", "pl":"Wskazówka: przytrzymaj kartę, aby ją przesunąć i ułożyć sekwens obok siebie. Spróbuj, a potem kontynuuj."},
  "Leçon": {"en":"Lesson", "it":"Lezione", "es":"Lección", "de":"Lektion", "pt":"Lição", "nl":"Les", "pl":"Lekcja"},
  "Bienvenue ! Quelques manches pour apprendre. Ici, 3 cartes : regroupe-les avant l'adversaire.": {"en":"Welcome! A few rounds to learn. Here, 3 cards: group them before your opponent.", "it":"Benvenuto! Poche mani per imparare. Qui, 3 carte: raggruppale prima dell'avversario.", "es":"¡Bienvenido! Unas rondas para aprender. Aquí, 3 cartas: agrúpalas antes que tu rival.", "de":"Willkommen! Ein paar Runden zum Lernen. Hier 3 Karten: Gruppiere sie vor dem Gegner.", "pt":"Bem-vindo! Algumas mãos para aprender. Aqui, 3 cartas: agrupa-as antes do adversário.", "nl":"Welkom! Een paar rondes om te leren. Hier: 3 kaarten, groepeer ze vóór je tegenstander.", "pl":"Witaj! Kilka rund na naukę. Tutaj 3 karty: ułóż je przed przeciwnikiem."},
  "Cette pastille montre l'atout du tour : ce sont les 3. Il change à chaque manche.": {"en":"This badge shows the round's wild: it's the 3s. It changes every round.", "it":"Questo segno mostra la jolly del turno: sono i 3. Cambia a ogni mano.", "es":"Esta marca muestra el comodín del turno: son los 3. Cambia cada ronda.", "de":"Dieses Zeichen zeigt den Joker der Runde: die 3er. Er ändert sich jede Runde.", "pt":"Este selo mostra o trunfo da mão: são os 3. Muda a cada mão.", "nl":"Dit bolletje toont de troef van de ronde: dat zijn de 3's. Hij wisselt elke ronde.", "pl":"Ta plakietka pokazuje atut rundy: to trójki. Zmienia się co rundę."},
  "Le Valet de la défausse ne t'aide pas. Pioche une carte.": {"en":"The Jack on the discard doesn't help. Draw a card.", "it":"Il Fante negli scarti non ti aiuta. Pesca una carta.", "es":"La Jota del descarte no te ayuda. Roba una carta.", "de":"Der Bube auf dem Ablagestapel hilft nicht. Zieh eine Karte.", "pt":"O Valete do descarte não ajuda. Compra uma carta.", "nl":"De Boer op de aflegstapel helpt je niet. Trek een kaart.", "pl":"Walet ze stosu odrzuconych ci nie pomoże. Dobierz kartę."},
  "Tu as trois 9 : une famille ! Le jeu la reconnaît tout seul. Regarde : « Abattre » s'est allumé.": {"en":"You have three 9s: a set! The game spots it. Look: \"Go out\" lit up.", "it":"Hai tre 9: un tris! Il gioco lo riconosce. Guarda: \"Chiudi\" si è acceso.", "es":"Tienes tres 9: ¡un grupo! El juego lo detecta. Mira: \"Cerrar\" se encendió.", "de":"Du hast drei 9er: ein Satz! Das Spiel erkennt es. Schau: \"Rausgehen\" leuchtet.", "pt":"Tens três 9: um conjunto! O jogo reconhece. Olha: \"Fechar\" acendeu.", "nl":"Je hebt drie 9's: een set! Het spel herkent hem vanzelf. Kijk: \"Uitkomen\" is opgelicht.", "pl":"Masz trzy 9: komplet! Gra sama go rozpoznaje. Spójrz: „Wyłóż” się zaświeciło."},
  "Sélectionne le 7, isolé, puis « Abattre » pour finir avec une main vide.": {"en":"Select the lone 7, then \"Go out\" to finish with an empty hand.", "it":"Seleziona il 7 isolato, poi \"Chiudi\" per finire con la mano vuota.", "es":"Selecciona el 7 solitario y luego \"Cerrar\" para acabar con la mano vacía.", "de":"Wähle die einzelne 7, dann \"Rausgehen\", um mit leerer Hand zu enden.", "pt":"Seleciona o 7 isolado, depois \"Fechar\" para acabar de mão vazia.", "nl":"Selecteer de 7, die los staat, en dan \"Uitkomen\" om met een lege hand te eindigen.", "pl":"Wybierz luźną 7, a potem „Wyłóż”, aby skończyć z pustą ręką."},
  "Bravo, première manche gagnée ! Tu n'as rien assemblé : range tes cartes, le jeu voit tes groupes.": {"en":"Well done, first round won! You assembled nothing: arrange your cards, the game sees your groups.", "it":"Bravo, prima mano vinta! Non hai montato nulla: ordina le carte, il gioco vede i gruppi.", "es":"¡Bien, primera ronda ganada! No montaste nada: ordena tus cartas, el juego ve tus grupos.", "de":"Super, erste Runde gewonnen! Du hast nichts gebaut: Ordne die Karten, das Spiel sieht die Gruppen.", "pt":"Boa, primeira mão ganha! Não montaste nada: organiza as cartas, o jogo vê os grupos.", "nl":"Goed gedaan, eerste ronde gewonnen! Je hebt niets samengesteld: orden je kaarten, het spel ziet je groepen.", "pl":"Brawo, pierwsza runda wygrana! Nic nie składałeś: ułóż karty, gra widzi twoje grupy."},
  "Atout aux 4. À chaque tour tu choisis : piocher au hasard, ou prendre la carte visible de la défausse.": {"en":"Wild is 4s. Each turn you choose: draw blind, or take the visible discard.", "it":"Jolly ai 4. Ogni turno scegli: pescare al buio o prendere lo scarto visibile.", "es":"Comodín en los 4. Cada turno eliges: robar a ciegas o tomar el descarte visible.", "de":"Joker sind 4er. Jede Runde wählst du: blind ziehen oder den offenen Ablagestapel nehmen.", "pt":"Trunfo nos 4. Em cada turno escolhes: comprar às cegas ou pegar o descarte visível.", "nl":"Bonus op de 4's. Elke beurt kies je: willekeurig trekken, of de zichtbare kaart van de aflegstapel pakken.", "pl":"Bonus na 4. W każdej turze wybierasz: dobrać w ciemno lub wziąć widoczną kartę ze stosu odrzuconych."},
  "Le 8 complète tes cartes de la même couleur en une suite. Prends-le sur la défausse.": {"en":"The 8 completes your same-color cards into a run. Take it from the discard.", "it":"L'8 completa le tue carte dello stesso colore in una scala. Prendilo dagli scarti.", "es":"El 8 completa tus cartas del mismo color en una escalera. Tómalo del descarte.", "de":"Die 8 vervollständigt deine gleichfarbigen Karten zu einer Folge. Nimm sie vom Ablagestapel.", "pt":"O 8 completa as tuas cartas da mesma cor numa sequência. Tira-o do descarte.", "nl":"De 8 maakt je kaarten van dezelfde kleur af tot een reeks. Pak hem van de aflegstapel.", "pl":"Ósemka uzupełnia twoje karty tego samego koloru w sekwens. Weź ją ze stosu odrzuconych."},
  "Quatre cartes qui se suivent, même couleur : une suite. « Abattre » s'allume.": {"en":"Four consecutive same-color cards: a run. \"Go out\" lights up.", "it":"Quattro carte consecutive dello stesso colore: una scala. \"Chiudi\" si accende.", "es":"Cuatro cartas seguidas del mismo color: una escalera. \"Cerrar\" se enciende.", "de":"Vier aufeinanderfolgende gleichfarbige Karten: eine Folge. \"Rausgehen\" leuchtet.", "pt":"Quatro cartas seguidas da mesma cor: uma sequência. \"Fechar\" acende.", "nl":"Vier opeenvolgende kaarten, zelfde kleur: een reeks. \"Uitkomen\" licht op.", "pl":"Cztery kolejne karty, ten sam kolor: sekwens. „Wyłóż” się zapala."},
  "Le 2 est isolé. Sélectionne-le puis abats.": {"en":"The 2 is isolated. Select it, then go out.", "it":"Il 2 è isolato. Selezionalo e chiudi.", "es":"El 2 está aislado. Selecciónalo y cierra.", "de":"Die 2 ist allein. Wähle sie, dann geh raus.", "pt":"O 2 está isolado. Seleciona-o e fecha.", "nl":"De 2 staat los. Selecteer hem en kom uit.", "pl":"Dwójka jest luźna. Wybierz ją i wyłóż."},
  "Une suite : même couleur qui se suit. Voyons une famille de plus près.": {"en":"A run: same color in sequence. Let's look at a set.", "it":"Una scala: stesso colore in sequenza. Vediamo un tris.", "es":"Una escalera: mismo color en secuencia. Veamos un grupo.", "de":"Eine Folge: gleiche Farbe in Reihe. Schauen wir einen Satz an.", "pt":"Uma sequência: mesma cor seguida. Vejamos um conjunto.", "nl":"Een reeks: zelfde kleur op volgorde. Laten we een set van dichterbij bekijken.", "pl":"Sekwens: ten sam kolor po kolei. Przyjrzyjmy się bliżej kompletowi."},
  "Atout aux 5. Tu as trois 10 de couleurs différentes : une famille — même valeur, peu importe la couleur.": {"en":"Wild is 5s. You have three 10s of different colors: a set — same value, any color.", "it":"Jolly ai 5. Hai tre 10 di colori diversi: un tris — stesso valore, colore libero.", "es":"Comodín en los 5. Tienes tres 10 de colores distintos: un grupo — mismo valor, cualquier color.", "de":"Joker sind 5er. Du hast drei 10er in verschiedenen Farben: ein Satz — gleicher Wert, egal welche Farbe.", "pt":"Trunfo nos 5. Tens três 10 de cores diferentes: um conjunto — mesmo valor, qualquer cor.", "nl":"Bonus op de 5's. Je hebt drie 10's van verschillende kleuren: een set — zelfde waarde, ongeacht de kleur.", "pl":"Bonus na 5. Masz trzy 10 w różnych kolorach: komplet — ta sama wartość, niezależnie od koloru."},
  "Pioche. Trois cartes suffisent pour une famille — inutile d'en chercher une 4e.": {"en":"Draw. Three cards are enough for a set — no need for a 4th.", "it":"Pesca. Tre carte bastano per un tris — inutile cercarne una 4ª.", "es":"Roba. Tres cartas bastan para un grupo — no busques una 4ª.", "de":"Zieh. Drei Karten reichen für einen Satz — keine 4. nötig.", "pt":"Compra. Três cartas chegam para um conjunto — não precisas de uma 4ª.", "nl":"Trek. Drie kaarten volstaan voor een set — een 4e zoeken is nutteloos.", "pl":"Dobierz. Trzy karty wystarczą na komplet — nie trzeba szukać czwartej."},
  "Ta famille est là, mais deux cartes restent seules. On ne gagne que si TOUT est casé — « Abattre » reste éteint. Apprenons à finir.": {"en":"Your set is there, but two cards stay alone. You only win if EVERYTHING is grouped — \"Go out\" stays off. Let's learn to finish.", "it":"Il tris c'è, ma due carte restano sole. Si vince solo se TUTTO è sistemato — \"Chiudi\" resta spento. Impariamo a finire.", "es":"Tu grupo está, pero dos cartas quedan solas. Solo ganas si TODO está agrupado — \"Cerrar\" sigue apagado. Aprendamos a terminar.", "de":"Dein Satz ist da, aber zwei Karten bleiben allein. Du gewinnst nur, wenn ALLES gruppiert ist — \"Rausgehen\" bleibt aus. Lernen wir das Ende.", "pt":"O teu conjunto está lá, mas duas cartas ficam sós. Só ganhas se TUDO estiver agrupado — \"Fechar\" fica apagado. Vamos aprender a terminar.", "nl":"Je set is er, maar twee kaarten blijven los. Je wint alleen als ALLES geplaatst is — \"Uitkomen\" blijft uit. Laten we leren afmaken.", "pl":"Komplet jest, ale dwie karty zostają luźne. Wygrywasz tylko, gdy WSZYSTKO jest ułożone — „Wyłóż” pozostaje wygaszone. Nauczmy się kończyć."},
  "Atout aux 6. Ta main cache deux groupes à la fois : une suite et une famille. On pioche pour compléter.": {"en":"Wild is 6s. Your hand hides two groups at once: a run and a set. Draw to complete.", "it":"Jolly ai 6. La tua mano nasconde due gruppi: una scala e un tris. Pesca per completare.", "es":"Comodín en los 6. Tu mano esconde dos grupos: una escalera y un grupo. Roba para completar.", "de":"Joker sind 6er. Deine Hand verbirgt zwei Gruppen: eine Folge und einen Satz. Zieh zum Vervollständigen.", "pt":"Trunfo nos 6. A tua mão esconde dois grupos: uma sequência e um conjunto. Compra para completar.", "nl":"Bonus op de 6's. Je hand verbergt twee groepen tegelijk: een reeks en een set. We trekken om af te maken.", "pl":"Bonus na 6. Twoja ręka kryje dwie grupy naraz: sekwens i komplet. Dobieramy, aby uzupełnić."},
  "Pioche.": {"en":"Draw.", "it":"Pesca.", "es":"Roba.", "de":"Zieh.", "pt":"Compra.", "nl":"Trek.", "pl":"Dobierz."},
  "Astuce : maintiens une carte appuyée pour la déplacer et ranger ta main. Ça n'change rien au jeu, mais ça aide à voir tes groupes.": {"en":"Tip: hold a card to move it and tidy your hand. It changes nothing in play, but helps you see your groups.", "it":"Consiglio: tieni premuta una carta per spostarla e ordinare la mano. Non cambia il gioco, ma aiuta a vedere i gruppi.", "es":"Consejo: mantén pulsada una carta para moverla y ordenar tu mano. No cambia el juego, pero ayuda a ver tus grupos.", "de":"Tipp: Halte eine Karte gedrückt, um sie zu verschieben und die Hand zu ordnen. Ändert nichts am Spiel, hilft aber, die Gruppen zu sehen.", "pt":"Dica: mantém uma carta premida para a mover e arrumar a mão. Não muda o jogo, mas ajuda a ver os grupos.", "nl":"Tip: houd een kaart ingedrukt om hem te verplaatsen en je hand te ordenen. Dat verandert niets aan het spel, maar helpt je je groepen te zien.", "pl":"Wskazówka: przytrzymaj kartę, aby ją przesunąć i uporządkować rękę. Nic to nie zmienia w grze, ale pomaga dostrzec grupy."},
  "Une suite ET une famille : le jeu voit les deux, « Abattre » s'allume.": {"en":"A run AND a set: the game sees both, \"Go out\" lights up.", "it":"Una scala E un tris: il gioco vede entrambi, \"Chiudi\" si accende.", "es":"Una escalera Y un grupo: el juego ve ambos, \"Cerrar\" se enciende.", "de":"Eine Folge UND ein Satz: das Spiel sieht beide, \"Rausgehen\" leuchtet.", "pt":"Uma sequência E um conjunto: o jogo vê ambos, \"Fechar\" acende.", "nl":"Een reeks ÉN een set: het spel ziet beide, \"Uitkomen\" licht op.", "pl":"Sekwens I komplet: gra widzi oba, „Wyłóż” się zapala."},
  "Il ne reste que le 3. Sélectionne-le et abats.": {"en":"Only the 3 is left. Select it and go out.", "it":"Resta solo il 3. Selezionalo e chiudi.", "es":"Solo queda el 3. Selecciónalo y cierra.", "de":"Nur die 3 bleibt. Wähle sie und geh raus.", "pt":"Só resta o 3. Seleciona-o e fecha.", "nl":"Alleen de 3 blijft over. Selecteer hem en kom uit.", "pl":"Została tylko 3. Wybierz ją i wyłóż."},
  "Bravo ! Deux groupes dans une main, c'est la clé. Dernière leçon : une fin de partie que tu crois perdue…": {"en":"Well done! Two groups in one hand is the key. Last lesson: an ending you think is lost…", "it":"Bravo! Due gruppi in una mano è la chiave. Ultima lezione: un finale che credi perso…", "es":"¡Bien! Dos grupos en una mano es la clave. Última lección: un final que crees perdido…", "de":"Super! Zwei Gruppen in einer Hand ist der Schlüssel. Letzte Lektion: ein Ende, das du verloren glaubst…", "pt":"Boa! Dois grupos numa mão é a chave. Última lição: um final que julgas perdido…", "nl":"Goed gedaan! Twee groepen in één hand, dat is de sleutel. Laatste les: een speleinde dat je verloren waant…", "pl":"Brawo! Dwie grupy w jednej ręce to klucz. Ostatnia lekcja: końcówka, którą uważasz za przegraną…"},
  "Dernière manche, atout = Roi. L'adversaire mène et va abattre. Ta main semble perdue… regardons mieux.": {"en":"Last round, wild = King. The opponent leads and will go out. Your hand looks lost… let's look closer.", "it":"Ultima mano, jolly = Re. L'avversario è avanti e sta per chiudere. La tua mano sembra persa… guardiamo meglio.", "es":"Última ronda, comodín = Rey. El rival va ganando y va a cerrar. Tu mano parece perdida… miremos mejor.", "de":"Letzte Runde, Joker = König. Der Gegner führt und geht gleich raus. Deine Hand scheint verloren… schauen wir genauer.", "pt":"Última mão, trunfo = Rei. O adversário lidera e vai fechar. A tua mão parece perdida… olhemos melhor.", "nl":"Laatste ronde, Bonus = Koning. De tegenstander leidt en gaat uitkomen. Je hand lijkt verloren… laten we beter kijken.", "pl":"Ostatnia runda, atut = Król. Przeciwnik prowadzi i zaraz wyłoży. Twoja ręka wydaje się przegrana… przyjrzyjmy się lepiej."},
  "Réflexe : « quatre 5, belle famille ». Mais ça laisse trop de cartes seules. Il y a mieux.": {"en":"Instinct: \"four 5s, nice set\". But it leaves too many lone cards. There's better.", "it":"Istinto: \"quattro 5, bel tris\". Ma lascia troppe carte sole. C'è di meglio.", "es":"Instinto: \"cuatro 5, buen grupo\". Pero deja muchas cartas solas. Hay algo mejor.", "de":"Reflex: \"vier 5er, schöner Satz\". Aber es bleiben zu viele Einzelkarten. Es geht besser.", "pt":"Instinto: \"quatro 5, belo conjunto\". Mas deixa cartas a mais sozinhas. Há melhor.", "nl":"Reflex: \"vier 5's, mooie set\". Maar dat laat te veel losse kaarten. Er is iets beters.", "pl":"Odruch: „cztery 5, ładny komplet”. Ale to zostawia za dużo luźnych kart. Jest lepszy sposób."},
  "Prends le 3 sur la défausse. Une seule carte va tout changer.": {"en":"Take the 3 from the discard. One card changes everything.", "it":"Prendi il 3 dagli scarti. Una sola carta cambia tutto.", "es":"Toma el 3 del descarte. Una sola carta lo cambia todo.", "de":"Nimm die 3 vom Ablagestapel. Eine Karte ändert alles.", "pt":"Tira o 3 do descarte. Uma só carta muda tudo.", "nl":"Pak de 3 van de aflegstapel. Eén kaart verandert alles.", "pl":"Weź 3 ze stosu odrzuconych. Jedna karta zmieni wszystko."},
  "Le 3 forme une suite avec ton 4 et ton 5. Ce 5 quitte la bande des 5 — et les trois autres 5 forment enfin une vraie famille. Une carte pouvait servir à deux endroits.": {"en":"The 3 makes a run with your 4 and 5. That 5 leaves the pack of 5s — and the other three 5s finally form a real set. One card could serve two places.", "it":"Il 3 forma una scala col tuo 4 e 5. Quel 5 lascia il gruppo dei 5 — e gli altri tre 5 formano finalmente un vero tris. Una carta poteva servire in due posti.", "es":"El 3 forma escalera con tu 4 y 5. Ese 5 deja el grupo de 5 — y los otros tres 5 forman por fin un grupo real. Una carta podía servir en dos sitios.", "de":"Die 3 bildet eine Folge mit deiner 4 und 5. Diese 5 verlässt das 5er-Rudel — und die anderen drei 5er bilden endlich einen echten Satz. Eine Karte konnte zwei Zwecken dienen.", "pt":"O 3 forma sequência com o teu 4 e 5. Esse 5 sai do grupo dos 5 — e os outros três 5 formam enfim um conjunto real. Uma carta podia servir em dois lugares.", "nl":"De 3 vormt een reeks met je 4 en je 5. Die 5 verlaat de groep van 5's — en de andere drie 5's vormen eindelijk een echte set. Eén kaart kon op twee plekken dienen.", "pl":"Trójka tworzy sekwens z twoją 4 i 5. Ta 5 opuszcza grupę piątek — a pozostałe trzy 5 tworzą w końcu prawdziwy komplet. Jedna karta mogła posłużyć w dwóch miejscach."},
  "Le jeu voit tout : deux suites, une famille. Presque tout est casé…": {"en":"The game sees it all: two runs, a set. Almost everything is grouped…", "it":"Il gioco vede tutto: due scale, un tris. Quasi tutto è sistemato…", "es":"El juego lo ve todo: dos escaleras, un grupo. Casi todo está agrupado…", "de":"Das Spiel sieht alles: zwei Folgen, ein Satz. Fast alles ist gruppiert…", "pt":"O jogo vê tudo: duas sequências, um conjunto. Quase tudo agrupado…", "nl":"Het spel ziet alles: twee reeksen, een set. Bijna alles is geplaatst…", "pl":"Gra widzi wszystko: dwa sekwensy, jeden komplet. Prawie wszystko ułożone…"},
  "À toi de finir. Défausse la carte qui ne sert à rien. Laquelle jettes-tu ?": {"en":"Your turn to finish. Discard the useless card. Which do you throw?", "it":"Tocca a te finire. Scarta la carta inutile. Quale butti?", "es":"Te toca terminar. Descarta la carta inútil. ¿Cuál tiras?", "de":"Beende du. Wirf die nutzlose Karte ab. Welche wirfst du?", "pt":"Termina tu. Descarta a carta inútil. Qual deitas fora?", "nl":"Aan jou om af te maken. Leg de kaart af die nergens toe dient. Welke gooi je weg?", "pl":"Twoja kolej, aby skończyć. Odrzuć kartę, która do niczego nie służy. Którą wyrzucasz?"},
  "Presque ! Celle-ci complétait ta suite. Réessaie.": {"en":"Almost! That one completed your run. Try again.", "it":"Quasi! Quella completava la scala. Riprova.", "es":"¡Casi! Esa completaba tu escalera. Inténtalo de nuevo.", "de":"Fast! Die vervollständigte deine Folge. Versuch's nochmal.", "pt":"Quase! Essa completava a tua sequência. Tenta de novo.", "nl":"Bijna! Deze maakte je reeks af. Probeer opnieuw.", "pl":"Prawie! Ta uzupełniała twój sekwens. Spróbuj ponownie."},
  "Tu as gagné — et tu l'as fait toi-même. C'est ça, 5 Rois : voir ce que les autres ne voient pas. À toi de jouer, pour de vrai !": {"en":"You won — and you did it yourself. That's 5 Kings: seeing what others miss. Now play for real!", "it":"Hai vinto — da solo. Questo è 5 Re: vedere ciò che gli altri non vedono. Ora gioca sul serio!", "es":"¡Ganaste — y tú solo! Eso es 5 Reyes: ver lo que otros no ven. ¡Ahora juega de verdad!", "de":"Gewonnen — ganz allein. Das ist 5 Könige: sehen, was andere übersehen. Jetzt spiel richtig!", "pt":"Ganhaste — sozinho. É isto o 5 Reis: ver o que os outros não veem. Agora joga a sério!", "nl":"Je hebt gewonnen — en helemaal zelf. Dat is 5 Rois: zien wat anderen niet zien. Nu is het aan jou, echt!", "pl":"Wygrałeś — i to sam. Oto 5 Rois: dostrzec to, czego inni nie widzą. Teraz graj naprawdę!"},
  "Première partie ?": {"en":"First time?", "it":"Prima partita?", "es":"¿Primera vez?", "de":"Erstes Spiel?", "pt":"Primeira vez?", "nl":"Eerste spel?", "pl":"Pierwsza gra?"},
  "Apprends à jouer en 5 manches guidées. Ça prend deux minutes.": {"en":"Learn to play in 5 guided rounds. Takes two minutes.", "it":"Impara a giocare in 5 mani guidate. Due minuti.", "es":"Aprende a jugar en 5 rondas guiadas. Dos minutos.", "de":"Lerne das Spiel in 5 geführten Runden. Zwei Minuten.", "pt":"Aprende a jogar em 5 mãos guiadas. Dois minutos.", "nl":"Leer spelen in 5 begeleide rondes. Dat duurt twee minuten.", "pl":"Naucz się grać w 5 prowadzonych rundach. Zajmuje to dwie minuty."},
  "Commencer le tuto": {"en":"Start tutorial", "it":"Inizia il tutorial", "es":"Empezar tutorial", "de":"Tutorial starten", "pt":"Começar tutorial", "nl":"Tutorial starten", "pl":"Rozpocznij samouczek"},
  "Plus tard": {"en":"Later", "it":"Più tardi", "es":"Más tarde", "de":"Später", "pt":"Mais tarde", "nl":"Later", "pl":"Później"},
  "Tutoriel": {"en":"Tutorial", "it":"Tutorial", "es":"Tutorial", "de":"Tutorial", "pt":"Tutorial", "nl":"Tutorial", "pl":"Samouczek"},
  "Apprends à jouer en 5 manches guidées": {"en":"Learn to play in 5 guided rounds", "it":"Impara a giocare in 5 mani guidate", "es":"Aprende a jugar en 5 rondas guiadas", "de":"Lerne das Spiel in 5 geführten Runden", "pt":"Aprende a jogar em 5 mãos guiadas", "nl":"Leer spelen in 5 begeleide rondes", "pl":"Naucz się grać w 5 prowadzonych rundach"},
  "Dépose la carte à l'endroit voulu.": {"en":"Drop the card where you want it.", "it":"Rilascia la carta dove vuoi.", "es":"Suelta la carta donde quieras.", "de":"Lege die Karte an die gewünschte Stelle.", "pt":"Larga a carta onde quiseres.", "nl":"Laat de kaart op de gewenste plek los.", "pl":"Upuść kartę w wybranym miejscu."},
  "Choisis ton pseudo": {"en":"Choose your nickname", "it":"Scegli il tuo soprannome", "es":"Elige tu apodo", "de":"Wähle deinen Spielernamen", "pt":"Escolhe o teu apelido", "nl":"Kies je gebruikersnaam", "pl":"Wybierz pseudonim"},
  "Ton compte n'a pas encore de pseudo. Choisis-en un pour apparaître au classement.": {"en":"Your account has no nickname yet. Pick one to appear in the ranking.", "it":"Il tuo account non ha ancora un soprannome. Scegline uno per apparire in classifica.", "es":"Tu cuenta aún no tiene apodo. Elige uno para aparecer en la clasificación.", "de":"Dein Konto hat noch keinen Spielernamen. Wähle einen, um in der Rangliste zu erscheinen.", "pt":"A tua conta ainda não tem apelido. Escolhe um para apareceres na classificação.", "nl":"Je account heeft nog geen gebruikersnaam. Kies er een om in de ranglijst te verschijnen.", "pl":"Twoje konto nie ma jeszcze pseudonimu. Wybierz go, aby pojawić się w rankingu."},
  "Ton pseudo": {"en":"Your nickname", "it":"Il tuo soprannome", "es":"Tu apodo", "de":"Dein Spielername", "pt":"O teu apelido", "nl":"Je gebruikersnaam", "pl":"Twój pseudonim"},
  "Valider": {"en":"Confirm", "it":"Conferma", "es":"Confirmar", "de":"Bestätigen", "pt":"Confirmar", "nl":"Bevestigen", "pl":"Zatwierdź"},
  "Cinq": {"en":"Five", "it":"Cinque", "es":"Cinco", "de":"Fünf", "pt":"Cinco", "nl":"Vijf", "pl":"Pięć"},
  "Couronnes": {"en":"Crowns", "it":"Corone", "es":"Coronas", "de":"Kronen", "pt":"Coroas", "nl":"Kronen", "pl":"Koron"},
  "Cinq Couronnes": {"en":"Five Crowns", "it":"Cinque Corone", "es":"Cinco Coronas", "de":"Fünf Kronen", "pt":"Cinco Coroas", "nl":"Vijf Kronen", "pl":"Pięć Koron"},
  "Bienvenue dans Cinq Couronnes !": {"en":"Welcome to Five Crowns!", "it":"Benvenuto in Cinque Corone!", "es":"¡Bienvenido a Cinco Coronas!", "de":"Willkommen bei Fünf Kronen!", "pt":"Bem-vindo a Cinco Coroas!", "nl":"Welkom bij Vijf Kronen!", "pl":"Witaj w Pięciu Koronach!"},
  "En attente des joueurs...": {"en":"Waiting for players...", "it":"In attesa di giocatori...", "es":"Esperando jugadores...", "de":"Warte auf Spieler...", "pt":"À espera de jogadores...", "nl":"Wachten op spelers...", "pl":"Oczekiwanie na graczy..."},
  "Connecté": {"en":"Connected", "it":"Connesso", "es":"Conectado", "de":"Verbunden", "pt":"Ligado", "nl":"Verbonden", "pl":"Połączono"},
  "carte": {"en":"card", "it":"carta", "es":"carta", "de":"Karte", "pt":"carta", "nl":"kaart", "pl":"karta"},
  "cartes": {"en":"cards", "it":"carte", "es":"cartas", "de":"Karten", "pt":"cartas", "nl":"kaarten", "pl":"kart"},
  "en main": {"en":"in hand", "it":"in mano", "es":"en mano", "de":"auf der Hand", "pt":"na mão", "nl":"in de hand", "pl":"w ręce"},
  "pts": {"en":"pts", "it":"pti", "es":"pts", "de":"Pkt", "pt":"pts", "nl":"ptn", "pl":"pkt"},
  "À toi": {"en":"Your turn,", "it":"Tocca a te,", "es":"Te toca,", "de":"Du bist dran,", "pt":"É a tua vez,", "nl":"Jouw beurt", "pl":"Twoja kolej"},
  "À toi,": {"en":"Your turn,", "it":"Tocca a te,", "es":"Te toca,", "de":"Du bist dran,", "pt":"É a tua vez,", "nl":"Jouw beurt,", "pl":"Twoja kolej,"},
  "Dernier tour pour": {"en":"Last turn for", "it":"Ultimo turno per", "es":"Último turno para", "de":"Letzter Zug für", "pt":"Último turno para", "nl":"Laatste beurt voor", "pl":"Ostatnia tura dla"},
  "Main de": {"en":"Hand of", "it":"Mano di", "es":"Mano de", "de":"Hand von", "pt":"Mão de", "nl":"Hand van", "pl":"Ręka gracza"},
  "En attente de": {"en":"Waiting for", "it":"In attesa di", "es":"Esperando a", "de":"Warte auf", "pt":"À espera de", "nl":"Wachten op", "pl":"Oczekiwanie na"},
  "L'IA joue…": {"en":"AI is playing…", "it":"L'IA sta giocando…", "es":"La IA está jugando…", "de":"Die KI spielt…", "pt":"A IA está a jogar…", "nl":"De AI speelt…", "pl":"AI gra…"},
  "Tri": {"en":"Sort", "it":"Ordina", "es":"Ordenar", "de":"Sortieren", "pt":"Ordenar", "nl":"Sorteren", "pl":"Sortuj"},
  "+ Nouveau pli": {"en":"+ New meld", "it":"+ Nuova combinazione", "es":"+ Nueva combinación", "de":"+ Neue Kombination", "pt":"+ Nova combinação", "nl":"+ Nieuwe groep", "pl":"+ Nowa grupa"},
  "Abattre 👑": {"en":"Go out 👑", "it":"Chiudi 👑", "es":"Cerrar 👑", "de":"Rausgehen 👑", "pt":"Fechar 👑", "nl":"Uitkomen 👑", "pl":"Wyłóż 👑"},
  "Peut abattre !": {"en":"Can go out!", "it":"Puoi chiudere!", "es":"¡Puedes cerrar!", "de":"Kann rausgehen!", "pt":"Podes fechar!", "nl":"Kan uitkomen!", "pl":"Można wyłożyć!"},
  "Vide": {"en":"Empty", "it":"Vuoto", "es":"Vacío", "de":"Leer", "pt":"Vazio", "nl":"Leeg", "pl":"Pusty"},
  "victoire": {"en":"win", "it":"vittoria", "es":"victoria", "de":"Sieg", "pt":"vitória", "nl":"overwinning", "pl":"zwycięstwo"},
  "partie": {"en":"game", "it":"partita", "es":"partida", "de":"Spiel", "pt":"jogo", "nl":"spel", "pl":"gra"},
  "moy.": {"en":"avg", "it":"media", "es":"med.", "de":"Ø", "pt":"méd.", "nl":"gem.", "pl":"śr."},
  "pts moy.": {"en":"avg pts", "it":"pti medi", "es":"pts med.", "de":"Ø Punkte", "pt":"pts méd.", "nl":"gem. ptn", "pl":"śr. pkt"},
  "toi": {"en":"you", "it":"tu", "es":"tú", "de":"du", "pt":"tu", "nl":"jij", "pl":"ty"},
  "Ta position :": {"en":"Your position:", "it":"La tua posizione:", "es":"Tu posición:", "de":"Deine Position:", "pt":"A tua posição:", "nl":"Jouw positie:", "pl":"Twoja pozycja:"},
  "Tu n'apparais pas encore dans le classement": {"en":"You're not in the ranking yet", "it":"Non sei ancora in classifica", "es":"Aún no apareces en la clasificación", "de":"Du bist noch nicht in der Rangliste", "pt":"Ainda não apareces na classificação", "nl":"Je staat nog niet in de ranglijst", "pl":"Nie ma cię jeszcze w rankingu"},
  "Aucun joueur pour l'instant": {"en":"No players yet", "it":"Ancora nessun giocatore", "es":"Aún no hay jugadores", "de":"Noch keine Spieler", "pt":"Ainda sem jogadores", "nl":"Nog geen spelers", "pl":"Brak graczy"},
  "Aucune partie rapide pour l'instant": {"en":"No quick games yet", "it":"Ancora nessuna partita rapida", "es":"Aún no hay partidas rápidas", "de":"Noch keine Schnellspiele", "pt":"Ainda sem jogos rápidos", "nl":"Nog geen snelle spellen", "pl":"Brak szybkich gier"},
  "Aucune partie complète pour l'instant": {"en":"No full games yet", "it":"Ancora nessuna partita completa", "es":"Aún no hay partidas completas", "de":"Noch keine kompletten Spiele", "pt":"Ainda sem jogos completos", "nl":"Nog geen volledige spellen", "pl":"Brak pełnych gier"},
  "Humain": {"en":"Human", "it":"Umano", "es":"Humano", "de":"Mensch", "pt":"Humano", "nl":"Mens", "pl":"Człowiek"},
  "IA": {"en":"AI", "it":"IA", "es":"IA", "de":"KI", "pt":"IA", "nl":"AI", "pl":"AI"},
  "Il faut au moins un joueur humain !": {"en":"You need at least one human player!", "it":"Serve almeno un giocatore umano!", "es":"¡Necesitas al menos un jugador humano!", "de":"Es braucht mindestens einen menschlichen Spieler!", "pt":"É preciso pelo menos um jogador humano!", "nl":"Er is minstens één menselijke speler nodig!", "pl":"Potrzebny jest co najmniej jeden gracz-człowiek!"},
  "Manche": {"en":"Round", "it":"Mano", "es":"Ronda", "de":"Runde", "pt":"Mão", "nl":"Ronde", "pl":"Runda"},
  "Bonus:": {"en":"Wild:", "it":"Jolly:", "es":"Comodín:", "de":"Wild:", "pt":"Curinga:", "nl":"Bonus:", "pl":"Bonus:"},
  "commence": {"en":"starts", "it":"inizia", "es":"empieza", "de":"beginnt", "pt":"começa", "nl":"begint", "pl":"zaczyna"},
  "Fin": {"en":"End of", "it":"Fine", "es":"Fin de", "de":"Ende", "pt":"Fim", "nl":"Einde", "pl":"Koniec"},
  "Pénalité:": {"en":"Penalty:", "it":"Penalità:", "es":"Penalización:", "de":"Strafe:", "pt":"Penalização:", "nl":"Straf:", "pl":"Kara:"},
  "défausse": {"en":"discards", "it":"scarta", "es":"descarta", "de":"legt ab", "pt":"descarta", "nl":"legt af", "pl":"odrzuca"},
  "défausse automatiquement": {"en":"discards automatically", "it":"scarta automaticamente", "es":"descarta automáticamente", "de":"legt automatisch ab", "pt":"descarta automaticamente", "nl":"legt automatisch af", "pl":"odrzuca automatycznie"},
  "pioche…": {"en":"draws…", "it":"pesca…", "es":"roba…", "de":"zieht…", "pt":"tira…", "nl":"trekt…", "pl":"dobiera…"},
  "pioche une carte.": {"en":"draws a card.", "it":"pesca una carta.", "es":"roba una carta.", "de":"zieht eine Karte.", "pt":"tira uma carta.", "nl":"trekt een kaart.", "pl":"dobiera kartę."},
  "prend la défausse": {"en":"takes the discard", "it":"prende dagli scarti", "es":"toma del descarte", "de":"nimmt die Ablage", "pt":"tira do descarte", "nl":"pakt van de aflegstapel", "pl":"bierze ze stosu odrzuconych"},
  "prend la défausse.": {"en":"takes the discard.", "it":"prende dagli scarti.", "es":"toma del descarte.", "de":"nimmt die Ablage.", "pt":"tira do descarte.", "nl":"pakt van de aflegstapel.", "pl":"bierze ze stosu odrzuconych."},
  "ABAT ! 🎉 Les autres ont un dernier tour.": {"en":"GOES OUT! 🎉 The others get one last turn.", "it":"CHIUDE! 🎉 Gli altri hanno un ultimo turno.", "es":"¡CIERRA! 🎉 Los demás tienen un último turno.", "de":"GEHT RAUS! 🎉 Die anderen haben einen letzten Zug.", "pt":"FECHA! 🎉 Os outros têm um último turno.", "nl":"KOMT UIT! 🎉 De anderen krijgen een laatste beurt.", "pl":"WYŁOŻYŁ! 🎉 Pozostali mają ostatnią turę."},
  "Dernier tour !": {"en":"Last turn!", "it":"Ultimo turno!", "es":"¡Último turno!", "de":"Letzter Zug!", "pt":"Último turno!", "nl":"Laatste beurt!", "pl":"Ostatnia tura!"},
  "remporte la partie avec": {"en":"wins the game with", "it":"vince la partita con", "es":"gana la partida con", "de":"gewinnt das Spiel mit", "pt":"ganha o jogo com", "nl":"wint het spel met", "pl":"wygrywa grę z wynikiem"},
  "pts !": {"en":"pts!", "it":"pti!", "es":"pts!", "de":"Pkt!", "pt":"pts!", "nl":"ptn!", "pl":"pkt!"},
  "parties": {"en":"games", "it":"partite", "es":"partidas", "de":"Spiele", "pt":"jogos", "nl":"spellen", "pl":"gry"},
  "victoires": {"en":"wins", "it":"vittorie", "es":"victorias", "de":"Siege", "pt":"vitórias", "nl":"overwinningen", "pl":"zwycięstwa"},
  "moy. pts": {"en":"avg pts", "it":"pti medi", "es":"pts medios", "de":"Ø Pkt", "pt":"pts médios", "nl":"gem. ptn", "pl":"śr. pkt"},
  "record": {"en":"best", "it":"record", "es":"récord", "de":"Bestwert", "pt":"recorde", "nl":"record", "pl":"rekord"},
  "Email": {"en":"Email", "it":"Email", "es":"Correo", "de":"E-Mail", "pt":"E-mail", "nl":"E-mail", "pl":"E-mail"},
  "Mot de passe": {"en":"Password", "it":"Password", "es":"Contraseña", "de":"Passwort", "pt":"Palavra-passe", "nl":"Wachtwoord", "pl":"Hasło"},
  "Pseudo (ex: Mathieu)": {"en":"Nickname (e.g. Mathieu)", "it":"Nickname (es. Mathieu)", "es":"Apodo (ej. Mathieu)", "de":"Spitzname (z.B. Mathieu)", "pt":"Alcunha (ex.: Mathieu)", "nl":"Gebruikersnaam (bijv. Mathieu)", "pl":"Pseudonim (np. Mateusz)"},
  "Nouveau pseudo": {"en":"New nickname", "it":"Nuovo nickname", "es":"Nuevo apodo", "de":"Neuer Spitzname", "pt":"Nova alcunha", "nl":"Nieuwe gebruikersnaam", "pl":"Nowy pseudonim"},
  "Pseudo de l'ami...": {"en":"Friend's nickname...", "it":"Nickname dell'amico...", "es":"Apodo del amigo...", "de":"Spitzname des Freundes...", "pt":"Alcunha do amigo...", "nl":"Gebruikersnaam van vriend...", "pl":"Pseudonim znajomego..."},
  "Ton nom": {"en":"Your name", "it":"Il tuo nome", "es":"Tu nombre", "de":"Dein Name", "pt":"O teu nome", "nl":"Je naam", "pl":"Twoje imię"},
  "Code de parrainage (optionnel)": {"en":"Referral code (optional)", "it":"Codice invito (facoltativo)", "es":"Código de referido (opcional)", "de":"Empfehlungscode (optional)", "pt":"Código de indicação (opcional)", "nl":"Doorverwijzingscode (optioneel)", "pl":"Kod polecający (opcjonalnie)"},
  "CODE": {"en":"CODE", "it":"CODICE", "es":"CÓDIGO", "de":"CODE", "pt":"CÓDIGO", "nl":"CODE", "pl":"KOD"}
};

(function(){
  "use strict";

  var LANGS = window.__CR_LANGS__ || {};

  var LANG_NAMES = {fr:"Français", en:"English", it:"Italiano", es:"Español", de:"Deutsch", pt:"Português", nl:"Nederlands", pl:"Polski"};
  var LANG_FLAGS = {fr:"🇫🇷", en:"🇬🇧", it:"🇮🇹", es:"🇪🇸", de:"🇩🇪", pt:"🇵🇹", nl:"🇳🇱", pl:"🇵🇱"};
  var ORDER = ["fr","en","it","es","de","pt","nl","pl"];

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
