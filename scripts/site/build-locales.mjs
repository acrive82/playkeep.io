import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const docs = join(root, "docs");

const languages = [
  ["en", "English", "/"],
  ["it", "Italiano", "/it/"],
  ["fr", "Français", "/fr/"],
  ["de", "Deutsch", "/de/"],
  ["es", "Español", "/es/"],
  ["ru", "Русский", "/ru/"],
  ["zh", "中文", "/zh/"],
  ["ja", "日本語", "/ja/"]
];

const shared = {
  brand: "playkeep.io",
  repo: "https://github.com/acrive82/playkeep.io",
  starsBadge:
    "https://img.shields.io/github/stars/acrive82/playkeep.io?style=for-the-badge&logo=github&label=Stars&color=5df2a2&labelColor=081411",
  heroImage: "/assets/playkeep-hero.png"
};

const t = {
  en: {
    lang: "en",
    title: "Playkeep | Sovereign digital game ownership",
    description:
      "Playkeep is an open protocol prototype for encrypted game distribution, token-gated access, and resilient digital ownership.",
    og: "Own the license. Mirror the bytes. Keep the game.",
    nav: ["Protocol", "Players", "Flow", "Demo", "Manifesto", "GitHub"],
    eyebrow: "Open protocol prototype",
    h1: "Own the license. Mirror the bytes. Keep the game.",
    hero:
      "Playkeep separates game ownership from publisher servers with encrypted packages, token-gated key release, and resilient storage on IPFS-ready infrastructure.",
    ctaPrimary: "View on GitHub",
    ctaSecondary: "Run the demo",
    protocolKicker: "What Playkeep does",
    protocolTitle: "A preservation-first access layer for digital games.",
    protocolLead:
      "The game package can live anywhere. The right to access it is verified through an open entitlement layer, not a single private launcher database.",
    features: [
      [
        "Encrypted public bytes",
        "Publishers seal builds before publishing them to IPFS, Filecoin, CDNs, or community mirrors. Public storage never exposes useful cleartext packages."
      ],
      [
        "On-chain ownership",
        "ERC-1155 licenses track access and transferability. The prototype targets EVM L2 deployment for low fees and broad wallet tooling."
      ],
      [
        "Token-gated keys",
        "A gatekeeper verifies wallet signatures and token ownership, then wraps the title key to the player's ephemeral device key."
      ]
    ],
    whyKicker: "Why now",
    whyTitle: "This is for players first.",
    whyLead:
      "Playkeep exists because players are pushing back against a future where purchases can become temporary permissions. The project is a technical answer to a cultural and consumer-rights problem.",
    whyPoints: [
      "Physical media is disappearing, and many players do not want access to their libraries to depend entirely on private stores.",
      "Campaigns such as Stop Killing Games show the same concern in another form: when official support ends, a purchased game should not be destroyed without a reasonable path forward.",
      "Playkeep gives publishers a practical way to support preservation, ownership portability, and piracy resistance at the same time.",
      "The ambition is to become a distribution standard: one wallet address, many consoles and stores, with every compatible platform able to verify the player's library and install the games they own."
    ],
    whyLinks: [
      ["Players push back against losing discs", "https://www.everyeye.it/notizie/giocatori-non-vogliono-addio-dischi-petizione-sony-playstation-888162.html"],
      ["Stop Killing Games and the future of games", "https://www.orizzontipolitici.it/stop-killing-games-cosa-ci-dice-la-petizione-europea-sul-futuro-dei-videogiochi/"]
    ],
    flowKicker: "The flow",
    flowTitle: "No clear game package is published.",
    steps: [
      ["01 Publisher seals", "The build is archived, hashed, and encrypted with AES-256-GCM."],
      ["02 Storage mirrors", "The encrypted package can be pinned, cached, and redistributed safely."],
      ["03 Player proves", "The wallet signs a short-lived challenge tied to the device key."],
      ["04 Client installs", "The package is decrypted locally and verified against the manifest hashes."]
    ],
    demoKicker: "Demo",
    demoTitle: "Run the full local story in one command.",
    demoLead:
      "The Docker demo creates a tiny game containing a single file, gates it through wallet ownership, decrypts it, and verifies the installed content.",
    expected: "expected output",
    manifestoKicker: "Manifesto",
    manifestoTitle: "Digital ownership should not disappear with a launcher.",
    manifestoLead:
      "Games are culture, memory, craft, and identity. Access should be durable, inspectable, recoverable, and built on open protocols rather than private silos.",
    principles: [
      "Buying a game should mean durable access.",
      "Preservation belongs in distribution from day one.",
      "Publishers deserve piracy resistance.",
      "Players deserve sovereignty.",
      "A compatible platform should never be able to erase a valid license from a player's wallet."
    ],
    readKicker: "Read more",
    readTitle: "Built in the open.",
    readLead:
      "Start with the architecture, testing strategy, and threat model. Then fork it, audit it, and help make the honest path better than the pirate path.",
    docs: [
      ["Architecture", "Ownership, storage, gatekeeping, and preservation layers."],
      ["Testing", "Unit, integration, e2e, and Docker demo boundaries."],
      ["Threat model", "What Playkeep prevents, and what no DRM can honestly promise."]
    ],
    footerA: "Playkeep is MIT licensed.",
    footerB: "Own the license. Mirror the bytes. Keep the game.",
    ariaNav: "Primary navigation",
    ariaHome: "Playkeep home",
    ariaLang: "Language",
    ariaTerminal: "Terminal demo command"
  },
  it: {
    lang: "it",
    title: "Playkeep | Proprietà digitale sovrana dei videogiochi",
    description:
      "Playkeep è un prototipo di protocollo aperto per distribuire giochi cifrati, accesso legato a token e proprietà digitale resiliente.",
    og: "Possiedi la licenza. Replica i byte. Conserva il gioco.",
    nav: ["Protocollo", "Giocatori", "Flusso", "Demo", "Manifesto", "GitHub"],
    eyebrow: "Prototipo di protocollo aperto",
    h1: "Possiedi la licenza. Replica i byte. Conserva il gioco.",
    hero:
      "Playkeep separa la proprietà del gioco dai server del publisher con pacchetti cifrati, rilascio delle chiavi legato al token e storage resiliente pronto per IPFS.",
    ctaPrimary: "Vedi su GitHub",
    ctaSecondary: "Esegui la demo",
    protocolKicker: "Cosa fa Playkeep",
    protocolTitle: "Un livello di accesso pensato prima di tutto per la preservazione.",
    protocolLead:
      "Il pacchetto del gioco può vivere ovunque. Il diritto di accesso viene verificato da un livello aperto di entitlement, non da un database privato di un launcher.",
    features: [
      [
        "Byte pubblici cifrati",
        "I publisher sigillano le build prima di pubblicarle su IPFS, Filecoin, CDN o mirror della comunità. Lo storage pubblico non espone mai pacchetti in chiaro utili."
      ],
      [
        "Proprietà on-chain",
        "Le licenze ERC-1155 tracciano accesso e trasferibilità. Il prototipo punta a EVM L2 per costi bassi e tooling wallet maturo."
      ],
      [
        "Chiavi legate al token",
        "Il gatekeeper verifica firma del wallet e proprietà del token, poi incapsula la chiave del titolo sulla chiave effimera del dispositivo."
      ]
    ],
    whyKicker: "Perché ora",
    whyTitle: "Questo progetto nasce prima di tutto per i giocatori.",
    whyLead:
      "Playkeep esiste perché i giocatori stanno reagendo a un futuro in cui un acquisto rischia di diventare un permesso temporaneo. È una risposta tecnica a un problema culturale e di tutela del consumatore.",
    whyPoints: [
      "Il supporto fisico sta scomparendo, e molti giocatori non vogliono che l'accesso alla propria libreria dipenda solo da store privati.",
      "Campagne come Stop Killing Games mostrano lo stesso problema da un'altra prospettiva: quando finisce il supporto ufficiale, un gioco acquistato non dovrebbe essere distrutto senza alternative ragionevoli.",
      "Playkeep offre ai publisher un modo concreto per sostenere preservazione, portabilità della proprietà e resistenza alla pirateria insieme.",
      "L'ambizione è diventare uno standard di distribuzione: un solo wallet address, molte console e store, con ogni piattaforma compatibile capace di verificare la libreria del giocatore e installare i giochi che possiede."
    ],
    whyLinks: [
      ["I giocatori reagiscono all'addio ai dischi", "https://www.everyeye.it/notizie/giocatori-non-vogliono-addio-dischi-petizione-sony-playstation-888162.html"],
      ["Stop Killing Games e il futuro dei videogiochi", "https://www.orizzontipolitici.it/stop-killing-games-cosa-ci-dice-la-petizione-europea-sul-futuro-dei-videogiochi/"]
    ],
    flowKicker: "Il flusso",
    flowTitle: "Nessun pacchetto di gioco in chiaro viene pubblicato.",
    steps: [
      ["01 Il publisher sigilla", "La build viene archiviata, hashata e cifrata con AES-256-GCM."],
      ["02 Lo storage replica", "Il pacchetto cifrato può essere pinnato, messo in cache e ridistribuito in sicurezza."],
      ["03 Il player prova", "Il wallet firma una challenge temporanea legata alla chiave del dispositivo."],
      ["04 Il client installa", "Il pacchetto viene decifrato localmente e verificato con gli hash del manifest."]
    ],
    demoKicker: "Demo",
    demoTitle: "Esegui tutta la storia locale con un comando.",
    demoLead:
      "La demo Docker crea un mini gioco con un solo file, lo protegge tramite proprietà wallet, lo decifra e verifica il contenuto installato.",
    expected: "output atteso",
    manifestoKicker: "Manifesto",
    manifestoTitle: "La proprietà digitale non dovrebbe sparire con un launcher.",
    manifestoLead:
      "I giochi sono cultura, memoria, mestiere e identità. L'accesso dovrebbe essere duraturo, ispezionabile, recuperabile e fondato su protocolli aperti.",
    principles: [
      "Comprare un gioco dovrebbe significare accesso duraturo.",
      "La preservazione va progettata nella distribuzione fin dal primo giorno.",
      "I publisher meritano resistenza alla pirateria.",
      "I giocatori meritano sovranità.",
      "Una piattaforma compatibile non dovrebbe mai poter cancellare una licenza valida dal wallet di un giocatore."
    ],
    readKicker: "Approfondisci",
    readTitle: "Costruito in pubblico.",
    readLead:
      "Parti da architettura, strategia di test e threat model. Poi fai fork, audit e aiuta a rendere il percorso onesto migliore di quello pirata.",
    docs: [
      ["Architettura", "Livelli di proprietà, storage, gatekeeping e preservazione."],
      ["Testing", "Confini tra unit, integration, e2e e demo Docker."],
      ["Threat model", "Cosa Playkeep previene e cosa nessun DRM può promettere onestamente."]
    ],
    footerA: "Playkeep è rilasciato con licenza MIT.",
    footerB: "Possiedi la licenza. Replica i byte. Conserva il gioco.",
    ariaNav: "Navigazione principale",
    ariaHome: "Home Playkeep",
    ariaLang: "Lingua",
    ariaTerminal: "Comando demo nel terminale"
  },
  fr: {
    lang: "fr",
    title: "Playkeep | Propriété numérique souveraine des jeux vidéo",
    description:
      "Playkeep est un prototype de protocole ouvert pour la distribution chiffrée de jeux, l'accès contrôlé par token et la propriété numérique résiliente.",
    og: "Possédez la licence. Dupliquez les octets. Gardez le jeu.",
    nav: ["Protocole", "Joueurs", "Flux", "Démo", "Manifeste", "GitHub"],
    eyebrow: "Prototype de protocole ouvert",
    h1: "Possédez la licence. Dupliquez les octets. Gardez le jeu.",
    hero:
      "Playkeep sépare la propriété du jeu des serveurs de l'éditeur grâce à des paquets chiffrés, une remise de clés liée au token et un stockage résilient prêt pour IPFS.",
    ctaPrimary: "Voir sur GitHub",
    ctaSecondary: "Lancer la démo",
    protocolKicker: "Ce que fait Playkeep",
    protocolTitle: "Une couche d'accès pensée d'abord pour la préservation.",
    protocolLead:
      "Le paquet du jeu peut vivre n'importe où. Le droit d'accès est vérifié par une couche d'entitlement ouverte, pas par la base privée d'un launcher.",
    features: [
      [
        "Octets publics chiffrés",
        "Les éditeurs scellent les builds avant de les publier sur IPFS, Filecoin, CDN ou miroirs communautaires. Le stockage public n'expose jamais de paquet utile en clair."
      ],
      [
        "Propriété on-chain",
        "Les licences ERC-1155 suivent l'accès et la transférabilité. Le prototype cible les EVM L2 pour des frais faibles et un outillage wallet mature."
      ],
      [
        "Clés contrôlées par token",
        "Le gatekeeper vérifie la signature du wallet et la possession du token, puis enveloppe la clé du titre pour la clé éphémère du dispositif."
      ]
    ],
    whyKicker: "Pourquoi maintenant",
    whyTitle: "Ce projet existe d'abord pour les joueurs.",
    whyLead:
      "Playkeep existe parce que les joueurs refusent un futur où un achat peut devenir une simple permission temporaire. C'est une réponse technique à un problème culturel et de droits des consommateurs.",
    whyPoints: [
      "Le support physique disparaît, et beaucoup de joueurs ne veulent pas que l'accès à leur bibliothèque dépende entièrement de boutiques privées.",
      "Des campagnes comme Stop Killing Games montrent le même enjeu autrement : quand le support officiel s'arrête, un jeu acheté ne devrait pas être détruit sans solution raisonnable.",
      "Playkeep donne aux éditeurs une voie concrète pour soutenir préservation, portabilité de la propriété et résistance au piratage.",
      "L'ambition est de devenir un standard de distribution : une seule adresse wallet, plusieurs consoles et boutiques, et chaque plateforme compatible capable de vérifier la bibliothèque du joueur et d'installer les jeux qu'il possède."
    ],
    whyLinks: [
      ["Les joueurs réagissent à la disparition des disques", "https://www.everyeye.it/notizie/giocatori-non-vogliono-addio-dischi-petizione-sony-playstation-888162.html"],
      ["Stop Killing Games et le futur du jeu vidéo", "https://www.orizzontipolitici.it/stop-killing-games-cosa-ci-dice-la-petizione-europea-sul-futuro-dei-videogiochi/"]
    ],
    flowKicker: "Le flux",
    flowTitle: "Aucun paquet de jeu en clair n'est publié.",
    steps: [
      ["01 L'éditeur scelle", "Le build est archivé, haché et chiffré avec AES-256-GCM."],
      ["02 Le stockage réplique", "Le paquet chiffré peut être épinglé, mis en cache et redistribué en sécurité."],
      ["03 Le joueur prouve", "Le wallet signe un défi de courte durée lié à la clé du dispositif."],
      ["04 Le client installe", "Le paquet est déchiffré localement et vérifié avec les hachages du manifeste."]
    ],
    demoKicker: "Démo",
    demoTitle: "Exécutez toute l'histoire locale en une commande.",
    demoLead:
      "La démo Docker crée un mini-jeu contenant un seul fichier, le protège par possession wallet, le déchiffre et vérifie le contenu installé.",
    expected: "sortie attendue",
    manifestoKicker: "Manifeste",
    manifestoTitle: "La propriété numérique ne devrait pas disparaître avec un launcher.",
    manifestoLead:
      "Les jeux sont culture, mémoire, savoir-faire et identité. L'accès doit être durable, inspectable, récupérable et fondé sur des protocoles ouverts.",
    principles: [
      "Acheter un jeu devrait signifier un accès durable.",
      "La préservation doit être conçue dans la distribution dès le premier jour.",
      "Les éditeurs méritent une résistance au piratage.",
      "Les joueurs méritent la souveraineté.",
      "Une plateforme compatible ne devrait jamais pouvoir effacer une licence valide du wallet d'un joueur."
    ],
    readKicker: "En savoir plus",
    readTitle: "Construit ouvertement.",
    readLead:
      "Commencez par l'architecture, la stratégie de test et le threat model. Ensuite, forkez, auditez et aidez à rendre la voie honnête meilleure que la voie pirate.",
    docs: [
      ["Architecture", "Couches de propriété, stockage, gatekeeping et préservation."],
      ["Tests", "Frontières entre unit, integration, e2e et démo Docker."],
      ["Threat model", "Ce que Playkeep empêche et ce qu'aucun DRM ne peut promettre honnêtement."]
    ],
    footerA: "Playkeep est sous licence MIT.",
    footerB: "Possédez la licence. Dupliquez les octets. Gardez le jeu.",
    ariaNav: "Navigation principale",
    ariaHome: "Accueil Playkeep",
    ariaLang: "Langue",
    ariaTerminal: "Commande de démo dans le terminal"
  },
  de: {
    lang: "de",
    title: "Playkeep | Souveränes digitales Eigentum an Videospielen",
    description:
      "Playkeep ist ein offener Protokollprototyp für verschlüsselte Spieleverteilung, token-gesteuerten Zugriff und resilientes digitales Eigentum.",
    og: "Besitze die Lizenz. Spiegele die Bytes. Behalte das Spiel.",
    nav: ["Protokoll", "Spieler", "Ablauf", "Demo", "Manifest", "GitHub"],
    eyebrow: "Offener Protokollprototyp",
    h1: "Besitze die Lizenz. Spiegele die Bytes. Behalte das Spiel.",
    hero:
      "Playkeep trennt Spieleigentum von Publisher-Servern durch verschlüsselte Pakete, token-gesteuerte Schlüsselfreigabe und resiliente, IPFS-bereite Speicherung.",
    ctaPrimary: "Auf GitHub ansehen",
    ctaSecondary: "Demo starten",
    protocolKicker: "Was Playkeep macht",
    protocolTitle: "Eine Zugriffsschicht, die Erhaltung an erste Stelle setzt.",
    protocolLead:
      "Das Spielpaket kann überall liegen. Das Zugriffsrecht wird über eine offene Entitlement-Schicht geprüft, nicht über die private Datenbank eines Launchers.",
    features: [
      [
        "Verschlüsselte öffentliche Bytes",
        "Publisher versiegeln Builds, bevor sie diese auf IPFS, Filecoin, CDNs oder Community-Mirrors veröffentlichen. Öffentliche Speicherung legt nie nutzbare Klartextpakete offen."
      ],
      [
        "On-chain Eigentum",
        "ERC-1155-Lizenzen verfolgen Zugriff und Übertragbarkeit. Der Prototyp zielt auf EVM L2 für niedrige Gebühren und breite Wallet-Werkzeuge."
      ],
      [
        "Token-gesteuerte Schlüssel",
        "Der Gatekeeper prüft Wallet-Signaturen und Tokenbesitz und verpackt dann den Titelschlüssel für den ephemeren Geräteschlüssel."
      ]
    ],
    whyKicker: "Warum jetzt",
    whyTitle: "Dieses Projekt ist zuerst für Spieler da.",
    whyLead:
      "Playkeep existiert, weil Spieler sich gegen eine Zukunft wehren, in der ein Kauf zu einer vorübergehenden Erlaubnis werden kann. Es ist eine technische Antwort auf ein kulturelles und verbraucherrechtliches Problem.",
    whyPoints: [
      "Physische Medien verschwinden, und viele Spieler wollen nicht, dass der Zugang zu ihrer Bibliothek vollständig von privaten Stores abhängt.",
      "Kampagnen wie Stop Killing Games zeigen dieselbe Sorge aus einer anderen Richtung: Wenn offizieller Support endet, sollte ein gekauftes Spiel nicht ohne vernünftige Alternative zerstört werden.",
      "Playkeep gibt Publishern einen praktischen Weg, Erhaltung, Portabilität von Eigentum und Piraterieresistenz gemeinsam zu unterstützen.",
      "Die Ambition ist ein Distributionsstandard: eine Wallet-Adresse, viele Konsolen und Stores, und jede kompatible Plattform kann die Bibliothek des Spielers prüfen und die gekauften Spiele installieren."
    ],
    whyLinks: [
      ["Spieler wehren sich gegen das Ende der Discs", "https://www.everyeye.it/notizie/giocatori-non-vogliono-addio-dischi-petizione-sony-playstation-888162.html"],
      ["Stop Killing Games und die Zukunft der Spiele", "https://www.orizzontipolitici.it/stop-killing-games-cosa-ci-dice-la-petizione-europea-sul-futuro-dei-videogiochi/"]
    ],
    flowKicker: "Der Ablauf",
    flowTitle: "Kein Spielpaket wird im Klartext veröffentlicht.",
    steps: [
      ["01 Publisher versiegelt", "Der Build wird archiviert, gehasht und mit AES-256-GCM verschlüsselt."],
      ["02 Speicher spiegelt", "Das verschlüsselte Paket kann sicher gepinnt, gecacht und weiterverteilt werden."],
      ["03 Spieler beweist", "Die Wallet signiert eine kurzlebige Challenge, die an den Geräteschlüssel gebunden ist."],
      ["04 Client installiert", "Das Paket wird lokal entschlüsselt und gegen die Manifest-Hashes geprüft."]
    ],
    demoKicker: "Demo",
    demoTitle: "Die komplette lokale Geschichte mit einem Befehl starten.",
    demoLead:
      "Die Docker-Demo erzeugt ein kleines Spiel mit einer einzigen Datei, schützt es per Wallet-Besitz, entschlüsselt es und verifiziert den installierten Inhalt.",
    expected: "erwartete Ausgabe",
    manifestoKicker: "Manifest",
    manifestoTitle: "Digitales Eigentum sollte nicht mit einem Launcher verschwinden.",
    manifestoLead:
      "Spiele sind Kultur, Erinnerung, Handwerk und Identität. Zugriff sollte dauerhaft, prüfbar, wiederherstellbar und auf offenen Protokollen gebaut sein.",
    principles: [
      "Ein Spiel zu kaufen sollte dauerhaften Zugriff bedeuten.",
      "Erhaltung gehört vom ersten Tag an in die Distribution.",
      "Publisher verdienen Schutz vor Piraterie.",
      "Spieler verdienen Souveränität.",
      "Eine kompatible Plattform sollte niemals eine gültige Lizenz aus der Wallet eines Spielers löschen können."
    ],
    readKicker: "Mehr lesen",
    readTitle: "Offen gebaut.",
    readLead:
      "Beginne mit Architektur, Teststrategie und Threat Model. Dann forke, auditiere und hilf, den ehrlichen Weg besser als den Piratenweg zu machen.",
    docs: [
      ["Architektur", "Schichten für Eigentum, Speicherung, Gatekeeping und Erhaltung."],
      ["Tests", "Grenzen zwischen Unit, Integration, E2E und Docker-Demo."],
      ["Threat Model", "Was Playkeep verhindert und was kein DRM ehrlich versprechen kann."]
    ],
    footerA: "Playkeep ist MIT-lizenziert.",
    footerB: "Besitze die Lizenz. Spiegele die Bytes. Behalte das Spiel.",
    ariaNav: "Hauptnavigation",
    ariaHome: "Playkeep Startseite",
    ariaLang: "Sprache",
    ariaTerminal: "Demo-Befehl im Terminal"
  },
  es: {
    lang: "es",
    title: "Playkeep | Propiedad digital soberana de videojuegos",
    description:
      "Playkeep es un prototipo de protocolo abierto para distribución cifrada de juegos, acceso controlado por token y propiedad digital resiliente.",
    og: "Posee la licencia. Replica los bytes. Conserva el juego.",
    nav: ["Protocolo", "Jugadores", "Flujo", "Demo", "Manifiesto", "GitHub"],
    eyebrow: "Prototipo de protocolo abierto",
    h1: "Posee la licencia. Replica los bytes. Conserva el juego.",
    hero:
      "Playkeep separa la propiedad del juego de los servidores del publisher mediante paquetes cifrados, entrega de claves ligada al token y almacenamiento resiliente preparado para IPFS.",
    ctaPrimary: "Ver en GitHub",
    ctaSecondary: "Ejecutar la demo",
    protocolKicker: "Qué hace Playkeep",
    protocolTitle: "Una capa de acceso diseñada primero para la preservación.",
    protocolLead:
      "El paquete del juego puede vivir en cualquier lugar. El derecho de acceso se verifica con una capa abierta de entitlement, no con la base de datos privada de un launcher.",
    features: [
      [
        "Bytes públicos cifrados",
        "Los publishers sellan las builds antes de publicarlas en IPFS, Filecoin, CDNs o espejos comunitarios. El almacenamiento público nunca expone paquetes útiles en claro."
      ],
      [
        "Propiedad on-chain",
        "Las licencias ERC-1155 registran acceso y transferibilidad. El prototipo apunta a EVM L2 para comisiones bajas y amplio soporte de wallets."
      ],
      [
        "Claves ligadas al token",
        "El gatekeeper verifica firmas de wallet y propiedad del token, y después envuelve la clave del título para la clave efímera del dispositivo."
      ]
    ],
    whyKicker: "Por qué ahora",
    whyTitle: "Este proyecto existe primero para los jugadores.",
    whyLead:
      "Playkeep existe porque los jugadores están rechazando un futuro en el que una compra puede convertirse en un permiso temporal. Es una respuesta técnica a un problema cultural y de derechos del consumidor.",
    whyPoints: [
      "El soporte físico está desapareciendo, y muchos jugadores no quieren que el acceso a su biblioteca dependa por completo de tiendas privadas.",
      "Campañas como Stop Killing Games muestran la misma preocupación desde otro ángulo: cuando termina el soporte oficial, un juego comprado no debería destruirse sin una alternativa razonable.",
      "Playkeep ofrece a los publishers una forma práctica de apoyar preservación, portabilidad de la propiedad y resistencia a la piratería al mismo tiempo.",
      "La ambición es convertirse en un estándar de distribución: una dirección wallet, muchas consolas y tiendas, y cada plataforma compatible capaz de verificar la biblioteca del jugador e instalar los juegos que posee."
    ],
    whyLinks: [
      ["Los jugadores reaccionan al adiós a los discos", "https://www.everyeye.it/notizie/giocatori-non-vogliono-addio-dischi-petizione-sony-playstation-888162.html"],
      ["Stop Killing Games y el futuro de los videojuegos", "https://www.orizzontipolitici.it/stop-killing-games-cosa-ci-dice-la-petizione-europea-sul-futuro-dei-videogiochi/"]
    ],
    flowKicker: "El flujo",
    flowTitle: "No se publica ningún paquete de juego en claro.",
    steps: [
      ["01 El publisher sella", "La build se archiva, se hashea y se cifra con AES-256-GCM."],
      ["02 El almacenamiento replica", "El paquete cifrado puede pinearse, cachearse y redistribuirse de forma segura."],
      ["03 El jugador prueba", "La wallet firma un desafío de corta duración ligado a la clave del dispositivo."],
      ["04 El cliente instala", "El paquete se descifra localmente y se verifica contra los hashes del manifiesto."]
    ],
    demoKicker: "Demo",
    demoTitle: "Ejecuta toda la historia local con un comando.",
    demoLead:
      "La demo Docker crea un pequeño juego con un solo archivo, lo protege mediante propiedad de wallet, lo descifra y verifica el contenido instalado.",
    expected: "salida esperada",
    manifestoKicker: "Manifiesto",
    manifestoTitle: "La propiedad digital no debería desaparecer con un launcher.",
    manifestoLead:
      "Los juegos son cultura, memoria, oficio e identidad. El acceso debería ser duradero, inspeccionable, recuperable y construido sobre protocolos abiertos.",
    principles: [
      "Comprar un juego debería significar acceso duradero.",
      "La preservación debe diseñarse en la distribución desde el primer día.",
      "Los publishers merecen resistencia a la piratería.",
      "Los jugadores merecen soberanía.",
      "Una plataforma compatible nunca debería poder borrar una licencia válida del wallet de un jugador."
    ],
    readKicker: "Leer más",
    readTitle: "Construido en abierto.",
    readLead:
      "Empieza por la arquitectura, la estrategia de pruebas y el threat model. Luego haz fork, audita y ayuda a que el camino honesto sea mejor que el camino pirata.",
    docs: [
      ["Arquitectura", "Capas de propiedad, almacenamiento, gatekeeping y preservación."],
      ["Pruebas", "Límites entre unit, integration, e2e y demo Docker."],
      ["Threat model", "Qué previene Playkeep y qué ningún DRM puede prometer honestamente."]
    ],
    footerA: "Playkeep tiene licencia MIT.",
    footerB: "Posee la licencia. Replica los bytes. Conserva el juego.",
    ariaNav: "Navegación principal",
    ariaHome: "Inicio de Playkeep",
    ariaLang: "Idioma",
    ariaTerminal: "Comando de demo en terminal"
  },
  ru: {
    lang: "ru",
    title: "Playkeep | Суверенное цифровое владение играми",
    description:
      "Playkeep — прототип открытого протокола для зашифрованной доставки игр, доступа по токену и устойчивого цифрового владения.",
    og: "Владейте лицензией. Зеркальте байты. Сохраняйте игру.",
    nav: ["Протокол", "Игроки", "Поток", "Демо", "Манифест", "GitHub"],
    eyebrow: "Прототип открытого протокола",
    h1: "Владейте лицензией. Зеркальте байты. Сохраняйте игру.",
    hero:
      "Playkeep отделяет владение игрой от серверов издателя: зашифрованные пакеты, выдача ключей по токену и устойчивое хранилище, готовое к IPFS.",
    ctaPrimary: "Открыть GitHub",
    ctaSecondary: "Запустить демо",
    protocolKicker: "Что делает Playkeep",
    protocolTitle: "Слой доступа, где сохранение стоит на первом месте.",
    protocolLead:
      "Пакет игры может жить где угодно. Право доступа проверяется открытым entitlement-слоем, а не приватной базой данных лаунчера.",
    features: [
      [
        "Зашифрованные публичные байты",
        "Издатели запечатывают сборки перед публикацией в IPFS, Filecoin, CDN или зеркалах сообщества. Публичное хранилище не раскрывает полезные пакеты в открытом виде."
      ],
      [
        "Владение on-chain",
        "Лицензии ERC-1155 отслеживают доступ и переносимость. Прототип ориентирован на EVM L2 для низких комиссий и широкой поддержки кошельков."
      ],
      [
        "Ключи по токену",
        "Gatekeeper проверяет подпись кошелька и владение токеном, затем оборачивает ключ игры для эфемерного ключа устройства."
      ]
    ],
    whyKicker: "Почему сейчас",
    whyTitle: "Этот проект в первую очередь для игроков.",
    whyLead:
      "Playkeep существует потому, что игроки не хотят будущего, где покупка превращается во временное разрешение. Это технический ответ на культурную проблему и проблему прав потребителей.",
    whyPoints: [
      "Физические носители исчезают, и многие игроки не хотят, чтобы доступ к их библиотеке полностью зависел от частных магазинов.",
      "Кампании вроде Stop Killing Games показывают ту же тревогу с другой стороны: когда официальная поддержка заканчивается, купленная игра не должна исчезать без разумной альтернативы.",
      "Playkeep дает издателям практический способ одновременно поддержать сохранение, переносимость владения и защиту от пиратства.",
      "Амбиция Playkeep — стать стандартом распространения: один адрес кошелька, множество консолей и магазинов, а каждая совместимая платформа может проверить библиотеку игрока и установить принадлежащие ему игры."
    ],
    whyLinks: [
      ["Игроки выступают против отказа от дисков", "https://www.everyeye.it/notizie/giocatori-non-vogliono-addio-dischi-petizione-sony-playstation-888162.html"],
      ["Stop Killing Games и будущее игр", "https://www.orizzontipolitici.it/stop-killing-games-cosa-ci-dice-la-petizione-europea-sul-futuro-dei-videogiochi/"]
    ],
    flowKicker: "Поток",
    flowTitle: "Пакет игры в открытом виде не публикуется.",
    steps: [
      ["01 Издатель запечатывает", "Сборка архивируется, хэшируется и шифруется с AES-256-GCM."],
      ["02 Хранилище зеркалирует", "Зашифрованный пакет можно безопасно закреплять, кэшировать и распространять."],
      ["03 Игрок доказывает", "Кошелек подписывает краткоживущий challenge, связанный с ключом устройства."],
      ["04 Клиент устанавливает", "Пакет расшифровывается локально и проверяется по хэшам манифеста."]
    ],
    demoKicker: "Демо",
    demoTitle: "Запустите полный локальный сценарий одной командой.",
    demoLead:
      "Docker-демо создает маленькую игру из одного файла, закрывает доступ владением кошелька, расшифровывает ее и проверяет установленное содержимое.",
    expected: "ожидаемый вывод",
    manifestoKicker: "Манифест",
    manifestoTitle: "Цифровое владение не должно исчезать вместе с лаунчером.",
    manifestoLead:
      "Игры — это культура, память, ремесло и идентичность. Доступ должен быть долговечным, проверяемым, восстанавливаемым и основанным на открытых протоколах.",
    principles: [
      "Покупка игры должна означать долговечный доступ.",
      "Сохранение должно быть встроено в дистрибуцию с первого дня.",
      "Издатели заслуживают защиты от пиратства.",
      "Игроки заслуживают суверенитета.",
      "Совместимая платформа никогда не должна иметь возможность стереть действительную лицензию из кошелька игрока."
    ],
    readKicker: "Подробнее",
    readTitle: "Создается открыто.",
    readLead:
      "Начните с архитектуры, стратегии тестирования и threat model. Затем форкните, проверьте и помогите сделать честный путь лучше пиратского.",
    docs: [
      ["Архитектура", "Слои владения, хранения, gatekeeping и сохранения."],
      ["Тестирование", "Границы unit, integration, e2e и Docker-демо."],
      ["Threat model", "Что предотвращает Playkeep и чего ни один DRM честно обещать не может."]
    ],
    footerA: "Playkeep распространяется по лицензии MIT.",
    footerB: "Владейте лицензией. Зеркальте байты. Сохраняйте игру.",
    ariaNav: "Основная навигация",
    ariaHome: "Главная Playkeep",
    ariaLang: "Язык",
    ariaTerminal: "Команда демо в терминале"
  },
  zh: {
    lang: "zh",
    title: "Playkeep | 主权式数字游戏所有权",
    description:
      "Playkeep 是一个开放协议原型，用于加密游戏分发、基于代币的访问控制和更有韧性的数字所有权。",
    og: "拥有许可证。镜像字节。保留游戏。",
    nav: ["协议", "玩家", "流程", "演示", "宣言", "GitHub"],
    eyebrow: "开放协议原型",
    h1: "拥有许可证。镜像字节。保留游戏。",
    hero:
      "Playkeep 通过加密包、基于代币的密钥释放，以及可接入 IPFS 的韧性存储，将游戏所有权从发行商服务器中分离出来。",
    ctaPrimary: "在 GitHub 查看",
    ctaSecondary: "运行演示",
    protocolKicker: "Playkeep 做什么",
    protocolTitle: "为数字游戏保存而设计的访问层。",
    protocolLead:
      "游戏包可以存放在任何地方。访问权由开放的 entitlement 层验证，而不是由某个私有启动器数据库决定。",
    features: [
      [
        "加密的公开字节",
        "发行商在发布到 IPFS、Filecoin、CDN 或社区镜像前先封装构建产物。公开存储永远不会暴露可用的明文包。"
      ],
      [
        "链上所有权",
        "ERC-1155 许可证追踪访问权与可转让性。该原型面向 EVM L2，以获得低费用和成熟的钱包工具。"
      ],
      [
        "代币门控密钥",
        "Gatekeeper 验证钱包签名和代币所有权，然后把游戏密钥包装给玩家设备的临时公钥。"
      ]
    ],
    whyKicker: "为什么是现在",
    whyTitle: "这个项目首先是为了玩家。",
    whyLead:
      "Playkeep 的存在，是因为玩家正在反对一种未来：所谓购买可能只是临时许可。它是对文化问题和消费者权益问题的技术回应。",
    whyPoints: [
      "实体媒介正在消失，许多玩家不希望自己的游戏库访问权完全依赖私人商店。",
      "Stop Killing Games 等运动从另一角度提出同样的问题：官方支持结束时，已购买的游戏不应在没有合理替代方案的情况下被毁掉。",
      "Playkeep 为发行商提供一种实际路径，同时支持保存、所有权可迁移和反盗版。",
      "Playkeep 的目标是成为一种发行标准：一个钱包地址，适用于多台主机和商店；任何兼容平台都能验证玩家的游戏库，并安装其拥有的游戏。"
    ],
    whyLinks: [
      ["玩家反对游戏光盘消失", "https://www.everyeye.it/notizie/giocatori-non-vogliono-addio-dischi-petizione-sony-playstation-888162.html"],
      ["Stop Killing Games 与游戏的未来", "https://www.orizzontipolitici.it/stop-killing-games-cosa-ci-dice-la-petizione-europea-sul-futuro-dei-videogiochi/"]
    ],
    flowKicker: "流程",
    flowTitle: "不会发布明文游戏包。",
    steps: [
      ["01 发行商封装", "构建产物被归档、哈希，并用 AES-256-GCM 加密。"],
      ["02 存储镜像", "加密包可以安全地固定、缓存和再分发。"],
      ["03 玩家证明", "钱包签署一个与设备密钥绑定的短期 challenge。"],
      ["04 客户端安装", "包在本地解密，并根据 manifest 哈希进行验证。"]
    ],
    demoKicker: "演示",
    demoTitle: "用一个命令运行完整本地流程。",
    demoLead:
      "Docker 演示会创建一个只含单文件的小游戏，通过钱包所有权控制访问，解密并验证已安装内容。",
    expected: "预期输出",
    manifestoKicker: "宣言",
    manifestoTitle: "数字所有权不应随着启动器消失。",
    manifestoLead:
      "游戏是文化、记忆、工艺和身份。访问权应该持久、可检查、可恢复，并建立在开放协议之上。",
    principles: [
      "购买游戏应意味着持久访问。",
      "保存能力应从分发的第一天就被设计进去。",
      "发行商值得拥有反盗版能力。",
      "玩家也值得拥有主权。",
      "兼容平台不应能够从玩家钱包中抹去有效许可证。"
    ],
    readKicker: "继续了解",
    readTitle: "开放构建。",
    readLead:
      "从架构、测试策略和威胁模型开始。然后 fork、审计，并帮助让诚实路径比盗版路径更好。",
    docs: [
      ["架构", "所有权、存储、gatekeeping 和保存层。"],
      ["测试", "Unit、integration、e2e 和 Docker 演示的边界。"],
      ["威胁模型", "Playkeep 能防止什么，以及任何 DRM 都无法诚实承诺什么。"]
    ],
    footerA: "Playkeep 使用 MIT 许可证。",
    footerB: "拥有许可证。镜像字节。保留游戏。",
    ariaNav: "主导航",
    ariaHome: "Playkeep 首页",
    ariaLang: "语言",
    ariaTerminal: "终端演示命令"
  },
  ja: {
    lang: "ja",
    title: "Playkeep | ゲームの主権的デジタル所有権",
    description:
      "Playkeep は、暗号化されたゲーム配布、トークンによるアクセス制御、回復力のあるデジタル所有権のためのオープンプロトコル試作です。",
    og: "ライセンスを所有する。バイトを複製する。ゲームを残す。",
    nav: ["プロトコル", "プレイヤー", "フロー", "デモ", "マニフェスト", "GitHub"],
    eyebrow: "オープンプロトコル試作",
    h1: "ライセンスを所有する。バイトを複製する。ゲームを残す。",
    hero:
      "Playkeep は、暗号化パッケージ、トークンに基づく鍵配布、IPFS 対応の回復力あるストレージによって、ゲーム所有権をパブリッシャーのサーバーから切り離します。",
    ctaPrimary: "GitHub で見る",
    ctaSecondary: "デモを実行",
    protocolKicker: "Playkeep の役割",
    protocolTitle: "保存を第一に考えたデジタルゲームのアクセス層。",
    protocolLead:
      "ゲームパッケージはどこに置いても構いません。アクセス権は、特定ランチャーの私有データベースではなく、オープンな entitlement 層で検証されます。",
    features: [
      [
        "暗号化された公開バイト",
        "パブリッシャーは IPFS、Filecoin、CDN、コミュニティミラーへ公開する前にビルドを封印します。公開ストレージに有用な平文パッケージは出ません。"
      ],
      [
        "オンチェーン所有権",
        "ERC-1155 ライセンスがアクセスと譲渡可能性を追跡します。試作は低手数料と広いウォレット対応のため EVM L2 を想定しています。"
      ],
      [
        "トークンゲート鍵",
        "Gatekeeper はウォレット署名とトークン所有を検証し、タイトル鍵をプレイヤー端末の一時鍵にラップします。"
      ]
    ],
    whyKicker: "なぜ今なのか",
    whyTitle: "このプロジェクトはまずプレイヤーのためにあります。",
    whyLead:
      "Playkeep は、購入が一時的な許可になってしまう未来にプレイヤーが反発しているからこそ存在します。これは文化と消費者保護の問題への技術的な答えです。",
    whyPoints: [
      "物理メディアは消えつつあり、多くのプレイヤーは自分のライブラリへのアクセスを私有ストアだけに依存させたくありません。",
      "Stop Killing Games のような運動は同じ懸念を別の形で示しています。公式サポートが終わっても、購入済みのゲームは合理的な代替策なしに失われるべきではありません。",
      "Playkeep は、保存、所有権のポータビリティ、海賊版対策を同時に支える実用的な道をパブリッシャーに提供します。",
      "目標は配信標準になることです。1つのウォレットアドレスで複数のコンソールやストアにログインし、対応プラットフォームがプレイヤーのライブラリを検証して所有するゲームをインストールできる世界です。"
    ],
    whyLinks: [
      ["ディスク廃止に反発するプレイヤー", "https://www.everyeye.it/notizie/giocatori-non-vogliono-addio-dischi-petizione-sony-playstation-888162.html"],
      ["Stop Killing Games とゲームの未来", "https://www.orizzontipolitici.it/stop-killing-games-cosa-ci-dice-la-petizione-europea-sul-futuro-dei-videogiochi/"]
    ],
    flowKicker: "フロー",
    flowTitle: "平文のゲームパッケージは公開されません。",
    steps: [
      ["01 パブリッシャーが封印", "ビルドはアーカイブ、ハッシュ化され、AES-256-GCM で暗号化されます。"],
      ["02 ストレージが複製", "暗号化パッケージは安全にピン留め、キャッシュ、再配布できます。"],
      ["03 プレイヤーが証明", "ウォレットが端末鍵に紐づく短時間の challenge に署名します。"],
      ["04 クライアントがインストール", "パッケージはローカルで復号され、manifest のハッシュで検証されます。"]
    ],
    demoKicker: "デモ",
    demoTitle: "完全なローカルフローを 1 コマンドで実行。",
    demoLead:
      "Docker デモは 1 ファイルだけの小さなゲームを作成し、ウォレット所有でゲートし、復号してインストール内容を検証します。",
    expected: "期待される出力",
    manifestoKicker: "マニフェスト",
    manifestoTitle: "デジタル所有権はランチャーと共に消えるべきではありません。",
    manifestoLead:
      "ゲームは文化、記憶、技術、アイデンティティです。アクセスは永続的で、検証可能で、復旧可能で、オープンプロトコルの上にあるべきです。",
    principles: [
      "ゲームの購入は永続的なアクセスを意味するべきです。",
      "保存は配布の初日から設計されるべきです。",
      "パブリッシャーには海賊版対策が必要です。",
      "プレイヤーには主権が必要です。",
      "対応プラットフォームは、プレイヤーのウォレットから有効なライセンスを消すことができてはなりません。"
    ],
    readKicker: "さらに読む",
    readTitle: "オープンに構築中。",
    readLead:
      "まずはアーキテクチャ、テスト戦略、脅威モデルから。次に fork し、監査し、正規の道を海賊版より良いものにしてください。",
    docs: [
      ["アーキテクチャ", "所有権、ストレージ、gatekeeping、保存の各レイヤー。"],
      ["テスト", "Unit、integration、e2e、Docker デモの境界。"],
      ["脅威モデル", "Playkeep が防げるもの、そしてどんな DRM も正直には約束できないもの。"]
    ],
    footerA: "Playkeep は MIT ライセンスです。",
    footerB: "ライセンスを所有する。バイトを複製する。ゲームを残す。",
    ariaNav: "メインナビゲーション",
    ariaHome: "Playkeep ホーム",
    ariaLang: "言語",
    ariaTerminal: "ターミナルのデモコマンド"
  }
};

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function languageLinks(current) {
  return languages
    .map(([code, name, path]) => {
      const active = code === current ? " selected" : "";
      return `<option value="${code}" data-path="${path}"${active}>${escapeHtml(name)}</option>`;
    })
    .join("");
}

function hreflangLinks() {
  return [
    ...languages.map(
      ([code, , path]) =>
        `<link rel="alternate" hreflang="${code}" href="https://playkeep.io${path}">`
    ),
    '<link rel="alternate" hreflang="x-default" href="https://playkeep.io/">'
  ].join("\n    ");
}

function render(locale, copy) {
  const docCards = [
    ["/ARCHITECTURE.md", copy.docs[0][0], copy.docs[0][1]],
    ["/TESTING.md", copy.docs[1][0], copy.docs[1][1]],
    ["/THREAT_MODEL.md", copy.docs[2][0], copy.docs[2][1]]
  ];

  return `<!doctype html>
<html lang="${copy.lang}">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(copy.title)}</title>
    <meta name="description" content="${escapeHtml(copy.description)}">
    <link rel="canonical" href="https://playkeep.io${languages.find(([code]) => code === locale)[2]}">
    ${hreflangLinks()}
    <meta property="og:title" content="Playkeep">
    <meta property="og:description" content="${escapeHtml(copy.og)}">
    <meta property="og:type" content="website">
    <meta property="og:image" content="${shared.heroImage}">
    <meta name="theme-color" content="#050807">
    <link rel="preload" href="${shared.heroImage}" as="image">
    <link rel="stylesheet" href="/assets/site.css">
    <script src="/assets/site.js" defer></script>
  </head>
  <body>
    <div class="page">
      <nav class="nav" aria-label="${escapeHtml(copy.ariaNav)}">
        <div class="nav-inner">
          <a class="brand" href="#top" aria-label="${escapeHtml(copy.ariaHome)}">
            <span class="mark" aria-hidden="true"></span>
            <span>${shared.brand}</span>
          </a>
          <div class="nav-links">
            <a href="#protocol">${escapeHtml(copy.nav[0])}</a>
            <a href="#players">${escapeHtml(copy.nav[1])}</a>
            <a href="#flow">${escapeHtml(copy.nav[2])}</a>
            <a href="#demo">${escapeHtml(copy.nav[3])}</a>
            <a href="#manifesto">${escapeHtml(copy.nav[4])}</a>
            <a class="github-link" href="${shared.repo}">${escapeHtml(copy.nav[5])}</a>
          </div>
          <div class="language-picker">
            <label class="sr-only" for="language-select">${escapeHtml(copy.ariaLang)}</label>
            <select id="language-select" class="language-select" name="language" data-current-lang="${locale}">
              ${languageLinks(locale)}
            </select>
          </div>
        </div>
      </nav>

      <main id="top">
        <section class="hero" aria-labelledby="hero-title">
          <div class="hero-media" aria-hidden="true">
            <img src="${shared.heroImage}" alt="">
          </div>
          <div class="hero-content">
            <p class="eyebrow">${escapeHtml(copy.eyebrow)}</p>
            <h1 id="hero-title">${escapeHtml(copy.h1)}</h1>
            <p class="hero-copy">${escapeHtml(copy.hero)}</p>
            <div class="hero-actions">
              <a class="button primary" href="${shared.repo}">${escapeHtml(copy.ctaPrimary)}</a>
              <a class="button secondary" href="#demo">${escapeHtml(copy.ctaSecondary)}</a>
            </div>
          </div>
        </section>

        <section class="section" id="protocol">
          <div class="inner">
            <div class="section-head">
              <p class="section-kicker">${escapeHtml(copy.protocolKicker)}</p>
              <h2>${escapeHtml(copy.protocolTitle)}</h2>
              <p class="lead">${escapeHtml(copy.protocolLead)}</p>
            </div>
            <div class="grid">
              ${copy.features
                .map(
                  ([title, body]) => `<article class="feature">
                <h3>${escapeHtml(title)}</h3>
                <p>${escapeHtml(body)}</p>
              </article>`
                )
                .join("\n              ")}
            </div>
          </div>
        </section>

        <section class="section alt player-context" id="players">
          <div class="inner manifest">
            <div>
              <p class="section-kicker">${escapeHtml(copy.whyKicker)}</p>
              <h2>${escapeHtml(copy.whyTitle)}</h2>
              <p class="lead">${escapeHtml(copy.whyLead)}</p>
              <div class="context-links">
                ${copy.whyLinks
                  .map(
                    ([label, href]) =>
                      `<a href="${escapeHtml(href)}" target="_blank" rel="noreferrer">${escapeHtml(label)}</a>`
                  )
                  .join("\n                ")}
              </div>
            </div>
            <div class="context-list">
              ${copy.whyPoints
                .map(
                  (item, index) => `<div class="context-item">
                <span>${String(index + 1).padStart(2, "0")}</span>
                <p>${escapeHtml(item)}</p>
              </div>`
                )
                .join("\n              ")}
            </div>
          </div>
        </section>

        <section class="section" id="flow">
          <div class="inner">
            <div class="section-head">
              <p class="section-kicker">${escapeHtml(copy.flowKicker)}</p>
              <h2>${escapeHtml(copy.flowTitle)}</h2>
            </div>
            <div class="flow">
              ${copy.steps
                .map(
                  ([title, body]) => `<div class="step">
                <strong>${escapeHtml(title)}</strong>
                <p>${escapeHtml(body)}</p>
              </div>`
                )
                .join("\n              ")}
            </div>
          </div>
        </section>

        <section class="section alt" id="demo">
          <div class="inner manifest">
            <div>
              <p class="section-kicker">${escapeHtml(copy.demoKicker)}</p>
              <h2>${escapeHtml(copy.demoTitle)}</h2>
              <p class="lead">${escapeHtml(copy.demoLead)}</p>
            </div>
            <div class="terminal" aria-label="${escapeHtml(copy.ariaTerminal)}">
              <div class="terminal-top" aria-hidden="true">
                <span class="dot"></span>
                <span class="dot"></span>
                <span class="dot"></span>
              </div>
              <pre><code>docker compose up --build --abort-on-container-exit demo-install

# ${escapeHtml(copy.expected)}
Playkeep demo install verified
Hello PlayKeep.io</code></pre>
            </div>
          </div>
        </section>

        <section class="section" id="manifesto">
          <div class="inner">
            <div class="section-head">
              <p class="section-kicker">${escapeHtml(copy.manifestoKicker)}</p>
              <h2>${escapeHtml(copy.manifestoTitle)}</h2>
              <p class="lead">${escapeHtml(copy.manifestoLead)}</p>
            </div>
            <div class="principles">
              ${copy.principles.map((item) => `<div class="principle">${escapeHtml(item)}</div>`).join("\n              ")}
            </div>
          </div>
        </section>

        <section class="section">
          <div class="inner manifest">
            <div>
              <p class="section-kicker">${escapeHtml(copy.readKicker)}</p>
              <h2>${escapeHtml(copy.readTitle)}</h2>
              <p class="lead">${escapeHtml(copy.readLead)}</p>
            </div>
            <div class="grid">
              ${docCards
                .map(
                  ([href, title, body]) => `<a class="feature" href="${href}">
                <h3>${escapeHtml(title)}</h3>
                <p>${escapeHtml(body)}</p>
              </a>`
                )
                .join("\n              ")}
            </div>
          </div>
        </section>
      </main>

      <footer class="footer">
        <div class="inner">
          <span>${escapeHtml(copy.footerA)}</span>
          <span>${escapeHtml(copy.footerB)}</span>
          <a class="stars-badge" href="${shared.repo}" aria-label="GitHub repository for Playkeep">
            <img src="${shared.starsBadge}" alt="GitHub stars">
          </a>
        </div>
      </footer>
    </div>
  </body>
</html>
`;
}

function renderSitemap() {
  const links = languages
    .map(
      ([code, , path]) =>
        `<xhtml:link rel="alternate" hreflang="${code}" href="https://playkeep.io${path}" />`
    )
    .join("\n      ");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${languages
  .map(
    ([, , path]) => `  <url>
    <loc>https://playkeep.io${path}</loc>
      ${links}
      <xhtml:link rel="alternate" hreflang="x-default" href="https://playkeep.io/" />
  </url>`
  )
  .join("\n")}
</urlset>
`;
}

for (const [locale, , path] of languages) {
  const targetDir = path === "/" ? docs : join(docs, locale);
  await mkdir(targetDir, { recursive: true });
  await writeFile(join(targetDir, "index.html"), render(locale, t[locale]), "utf8");
}

await writeFile(join(docs, "sitemap.xml"), renderSitemap(), "utf8");

console.log(`Generated ${languages.length} localized pages.`);
