GUIDE.addModule({
  id: 'http', num: '02', title: 'HTTP, HTTPS & Sessions', icon: '↯', color: 'v',
  tagline: `Comment le Web dialogue, se souvient de toi grâce aux cookies… et comment on l'attaque : méthodes, sessions, DevTools, risques.`,
  concepts: [

    /* ------------------------------------------------------------------ */
    {
      id: 'http-https', title: 'HTTP et HTTPS', added: '2026-11-08', tags: ['http', 'tls', 'chiffrement'],
      summary: `<b>HTTP</b> est le protocole du Web. <b>HTTPS</b> est HTTP protégé par <b>TLS</b>, qui chiffre les échanges entre le client et le serveur.`,
      diagrams: [{
        type: 'flow', title: 'Ce qu\'un observateur voit sur le réseau', colW: 190, rowH: 120,
        nodes: [
          { id: 'c1', label: 'CLIENT', icon: 'monitor', x: 0, y: 0, c: 'c' },
          { id: 'spy', label: 'Observateur', sub: 'sur le même réseau', icon: 'skull', x: 1.5, y: 0, c: 'r' },
          { id: 's1', label: 'SERVEUR', sub: 'port 80', icon: 'server', x: 3, y: 0, c: 'g' },
          { id: 'c2', label: 'CLIENT', icon: 'monitor', x: 0, y: 1.4, c: 'c' },
          { id: 'tls', label: 'Tunnel TLS', sub: 'contenu illisible', icon: 'lock', x: 1.5, y: 1.4, c: 'g' },
          { id: 's2', label: 'SERVEUR', sub: 'port 443', icon: 'server', x: 3, y: 1.4, c: 'g' }
        ],
        zones: [{ label: 'HTTP — non chiffré', nodes: ['c1', 'spy', 's1'], c: 'r' }, { label: 'HTTPS — HTTP + TLS', nodes: ['c2', 'tls', 's2'], c: 'g' }],
        edges: [
          { from: 'c1', to: 'spy', label: 'texte lisible', c: 'r', anim: true }, { from: 'spy', to: 's1', label: 'texte lisible', c: 'r', anim: true },
          { from: 'c2', to: 'tls', label: 'chiffré', c: 'g', anim: true }, { from: 'tls', to: 's2', label: 'chiffré', c: 'g', anim: true }
        ]
      }],
      explain: [
        `<b>HTTP</b> (Hypertext Transfer Protocol) définit comment un client demande des ressources web et comment le serveur répond. Par lui-même, il envoie tout <b>en clair</b> : mots de passe, cookies, contenus.`,
        `<b>HTTPS</b> ajoute une couche <b>TLS</b> : les échanges sont chiffrés entre le client et le serveur, et le certificat du site permet de vérifier à qui tu parles. Un observateur sur le réseau (Wi-Fi public, par exemple) ne voit plus le contenu.`,
        `Le cadenas du navigateur ne garantit pas que le site est « sûr » : il garantit que la <i>connexion</i> est chiffrée et que le certificat correspond au domaine.`
      ],
      example: {
        title: 'terminal — voir la négociation TLS', lang: 'bash',
        code: `$ curl -v https://example.com 2>&1 | head -n 12
< * Connected to example.com port 443
< * SSL connection using TLSv1.3 / …
< * Server certificate: subject: CN=…
< > GET / HTTP/2`,
        note: `Les lignes <code>*</code> montrent la poignée de main TLS <b>avant</b> que la requête HTTP ne parte, déjà chiffrée.`
      },
      keypoints: [`HTTP = protocole du Web (port <b>80</b>), en clair.`, `HTTPS = HTTP + <b>TLS</b> (port <b>443</b>), chiffré.`, `TLS protège la confidentialité et l'intégrité du transport — pas l'application derrière.`],
      related: ['stateless', 'ports']
    },

    /* ------------------------------------------------------------------ */
    {
      id: 'stateless', title: 'HTTP Stateless (sans état)', added: '2026-11-08', tags: ['http', 'sessions'],
      summary: `HTTP est <b>stateless</b> : chaque requête est traitée indépendamment, sans mémoire automatique des requêtes précédentes.`,
      diagrams: [{
        type: 'sequence', title: 'Le serveur « oublie » entre deux requêtes',
        actors: [{ id: 'C', label: 'CLIENT', icon: 'monitor', c: 'c' }, { id: 'S', label: 'SERVEUR', icon: 'server', c: 'g' }],
        steps: [
          { from: 'C', to: 'S', text: 'POST /login (identifiants)', sub: 'requête n°1', c: 'c' },
          { from: 'S', to: 'C', text: '200 OK — identifiants valides', c: 'g' },
          { note: `Fin de la requête n°1.\nLe protocole ne conserve rien tout seul.`, at: 'S', c: 'a' },
          { from: 'C', to: 'S', text: 'GET /profile', sub: 'requête n°2 — sans aucun contexte', c: 'c' },
          { from: 'S', to: 'C', text: '« Qui es-tu ? »', sub: 'selon l\'appli : 401 ou redirection vers /login', c: 'r' }
        ]
      }],
      explain: [
        `Dans un protocole <b>stateless</b>, le serveur traite chaque requête comme si c'était la première. Avantage : c'est simple et facile à répartir sur plusieurs serveurs. Inconvénient : <b>sans mécanisme supplémentaire, le serveur ne saurait pas qu'un utilisateur s'est déjà authentifié</b>.`,
        `Les applications ajoutent donc elles-mêmes un « état » par-dessus HTTP : c'est le rôle des <b>sessions, cookies et tokens</b> (concept suivant).`
      ],
      example: {
        title: 'terminal — deux requêtes indépendantes', lang: 'bash',
        code: `# Requête 1 : on s'authentifie (exemple d'API fictive)
$ curl -X POST https://api.example.test/login -d "user=alice&pass=…"
< 200 OK

# Requête 2 : SANS cookie ni token → le serveur ne te reconnaît pas
$ curl https://api.example.test/profile
< 401 Unauthorized`,
        note: `Les domaines <code>.test</code> sont réservés aux exemples. Le comportement exact dépend de l'application.`
      },
      keypoints: [`Stateless = pas de mémoire native entre deux requêtes.`, `L'état (qui est connecté ?) est ajouté par l'application.`, `C'est pour ça que les identifiants de session sont des cibles de choix pour les attaquants.`],
      related: ['sessions', 'security-risks']
    },

    /* ------------------------------------------------------------------ */
    {
      id: 'sessions', title: 'Sessions, cookies et tokens', added: '2026-11-08', tags: ['http', 'authentification'],
      summary: `Pour « se souvenir » de toi malgré HTTP stateless, le serveur crée une <b>session</b> ou émet un <b>token</b>, souvent transporté dans un <b>cookie</b>.`,
      diagrams: [
        {
          type: 'sequence', title: 'Cycle de vie d\'une connexion', gap: 300,
          actors: [{ id: 'C', label: 'CLIENT', icon: 'monitor', c: 'c' }, { id: 'S', label: 'SERVEUR', icon: 'server', c: 'v' }],
          steps: [
            { from: 'C', to: 'S', text: 'Connexion (identifiants)', c: 'c' },
            { note: `Vérifie les identifiants,\npuis crée une session ou émet un token`, at: 'S', c: 'v' },
            { from: 'S', to: 'C', text: 'Réponse + identifiant de session', sub: 'Set-Cookie: session=…', c: 'v' },
            { from: 'C', to: 'S', text: 'Requêtes suivantes + cookie', sub: 'Cookie: session=…', c: 'c' },
            { note: `Le serveur retrouve la session\n→ l'utilisateur est reconnu`, at: 'S', c: 'g' }
          ]
        },
        {
          type: 'tiles', title: 'Trois mots à ne pas confondre',
          items: [
            { title: 'Cookie', text: `Donnée stockée dans le <b>navigateur</b> et renvoyée automatiquement selon ses règles.`, c: 'a' },
            { title: 'Session ID', text: `Identifiant permettant au <b>serveur</b> de retrouver une session utilisateur.`, c: 'v' },
            { title: 'Token', text: `Jeton représentant une identité, une session ou des autorisations.`, c: 'm' }
          ]
        }
      ],
      explain: [
        `Une fois connecté, le serveur te donne un identifiant (session ID ou token). Ton navigateur le range dans un <b>cookie</b> et le renvoie à chaque requête : c'est ainsi que le serveur te « reconnaît » alors que HTTP, lui, n'a aucune mémoire.`,
        `Un <b>token</b> peut aussi voyager ailleurs que dans un cookie — par exemple dans l'en-tête <code>Authorization: Bearer …</code> pour une API. Dans tous les cas : <b>qui possède l'identifiant possède ta session</b>.`
      ],
      example: {
        title: 'en-têtes HTTP — un cookie bien configuré', lang: 'http',
        code: `HTTP/1.1 200 OK
Set-Cookie: session=a1b2c3d4; HttpOnly; Secure; SameSite=Lax; Path=/

GET /account HTTP/1.1
Host: example.com
Cookie: session=a1b2c3d4`,
        legend: [
          ['HttpOnly', `le JavaScript de la page ne peut pas lire le cookie`],
          ['Secure', `envoyé uniquement en HTTPS`],
          ['SameSite', `limite l'envoi du cookie depuis d'autres sites`]
        ]
      },
      keypoints: [`Session/token = mécanisme d'état ajouté <b>par-dessus</b> HTTP.`, `Le cookie transporte souvent le session ID.`, `Les attributs <b>HttpOnly / Secure / SameSite</b> sont la première défense.`],
      related: ['stateless', 'security-risks']
    },

    /* ------------------------------------------------------------------ */
    {
      id: 'methodes-http', title: 'Les neuf méthodes HTTP', added: '2026-11-08', tags: ['http', 'api', 'pentest'],
      summary: `La méthode dit au serveur <b>quelle action</b> le client veut faire sur une ressource : lire, créer, remplacer, modifier, supprimer…`,
      diagrams: [{
        type: 'tiles', title: 'GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS, CONNECT, TRACE', cols: 3,
        items: [
          { big: 'GET', title: 'Récupérer une ressource', extra: `Ex. : consulter un profil.`, tag: 'LECTURE', c: 'b' },
          { big: 'POST', title: 'Envoyer des données / créer', extra: `Ex. : envoyer un formulaire.`, tag: 'CRÉATION', c: 'g' },
          { big: 'PUT', title: 'Remplacer une ressource', extra: `Ex. : remplacer un profil.`, tag: 'REMPLACEMENT', c: 'a' },
          { big: 'PATCH', title: 'Modifier partiellement', extra: `Ex. : changer l'email.`, tag: 'MODIFICATION', c: 'o' },
          { big: 'DELETE', title: 'Supprimer une ressource', extra: `Ex. : supprimer un compte.`, tag: 'SUPPRESSION', c: 'r' },
          { big: 'HEAD', title: 'Comme GET, sans corps', extra: `Ex. : vérifier les en-têtes.`, tag: 'EN-TÊTES', c: 'c' },
          { big: 'OPTIONS', title: 'Méthodes/options prises en charge', extra: `Ex. : examiner les méthodes disponibles.`, tag: 'INFO', c: 'v' },
          { big: 'CONNECT', title: 'Établir un tunnel via un proxy', extra: `Ex. : tunnel HTTPS.`, tag: 'TUNNEL', c: 'w' },
          { big: 'TRACE', title: 'Diagnostic du chemin de la requête', extra: `Ex. : tester le traitement HTTP.`, tag: 'DIAGNOSTIC', c: 'm' }
        ]
      }],
      explain: [
        `Les quatre premières correspondent au cycle classique d'une API : <b>lire</b> (GET), <b>créer</b> (POST), <b>remplacer</b> (PUT), <b>modifier partiellement</b> (PATCH), puis <b>supprimer</b> (DELETE). La différence PUT/PATCH : PUT envoie la ressource complète, PATCH uniquement les champs à changer.`,
        `<b>HEAD</b> et <b>OPTIONS</b> servent à « poser des questions » sans récupérer le contenu ; <b>CONNECT</b> ouvre un tunnel (typiquement HTTPS à travers un proxy) ; <b>TRACE</b> est une méthode de diagnostic, souvent désactivée.`,
        `En test de sécurité, <b>OPTIONS</b> est un bon premier réflexe pour voir ce qu'un endpoint autorise (sur une cible que tu as le droit de tester).`
      ],
      example: {
        title: 'terminal — une même ressource, plusieurs méthodes (API fictive)', lang: 'bash',
        code: `$ curl -X GET     https://api.example.test/users/42
$ curl -X POST    https://api.example.test/users -d '{"name":"Alice"}'
$ curl -X PATCH   https://api.example.test/users/42 -d '{"email":"new@mail.test"}'
$ curl -X DELETE  https://api.example.test/users/42
$ curl -X OPTIONS -i https://api.example.test/users/42
< Allow: GET, PATCH, DELETE, OPTIONS`
      },
      keypoints: [`<b>GET</b> lit · <b>POST</b> envoie/crée · <b>PUT</b> remplace · <b>PATCH</b> modifie · <b>DELETE</b> supprime.`, `<b>HEAD, OPTIONS, CONNECT, TRACE</b> : info, tunnel, diagnostic.`, `Une méthode activée n'est pas une faille : tout dépend des <b>contrôles d'accès</b> derrière.`],
      related: ['security-risks', 'req-res-example']
    },

    /* ------------------------------------------------------------------ */
    {
      id: 'req-res-example', title: 'Exemple de requête et réponse HTTP', added: '2026-11-08', tags: ['http', 'bases'],
      summary: `Une requête HTTP, c'est une <b>ligne de demande</b>, des <b>en-têtes</b> et parfois un <b>corps</b>. La réponse a la même forme avec une <b>ligne de statut</b>.`,
      diagrams: [{
        type: 'stack', title: 'Anatomie d\'un message HTTP',
        columns: [
          { title: 'Requête (client → serveur)', c: 'c', layers: [{ label: 'Ligne de requête', sub: 'GET /products HTTP/1.1', c: 'm' }, { label: 'En-têtes', sub: 'Host: example.com', c: 'a' }, { label: '(ligne vide)', c: 'w' }, { label: 'Corps (optionnel)', sub: 'données envoyées', c: 'c' }] },
          { title: 'Réponse (serveur → client)', c: 'g', layers: [{ label: 'Ligne de statut', sub: 'HTTP/1.1 200 OK', c: 'g' }, { label: 'En-têtes', sub: 'Content-Type: text/html', c: 'a' }, { label: '(ligne vide)', c: 'w' }, { label: 'Corps', sub: 'la page, le JSON…', c: 'c' }] }
        ]
      }],
      explain: [
        `Dans la requête, <b>GET</b> est la méthode, <b>/products</b> la ressource demandée, <b>HTTP/1.1</b> la version du protocole et <b>Host</b> le nom d'hôte visé.`,
        `Dans la réponse, <b>200 OK</b> indique que la requête a réussi, et <b>Content-Type</b> précise le type de contenu renvoyé (ici du HTML).`
      ],
      examples: [{
        title: 'requête HTTP', lang: 'http',
        code: `GET /products HTTP/1.1
Host: example.com`,
        legend: [['GET', 'la méthode'], ['/products', 'la ressource'], ['HTTP/1.1', 'la version'], ['Host', `le nom d'hôte`]]
      }, {
        title: 'réponse HTTP', lang: 'http',
        code: `HTTP/1.1 200 OK
Content-Type: text/html`,
        legend: [['200 OK', 'la requête a réussi'], ['Content-Type', 'le type du contenu renvoyé']]
      }],
      keypoints: [`Requête : <b>méthode + ressource + version</b>, puis en-têtes.`, `Réponse : <b>version + code + message</b>, puis en-têtes et corps.`, `Les en-têtes portent les métadonnées (hôte, type de contenu, cookies…).`],
      related: ['request-response', 'devtools']
    },

    /* ------------------------------------------------------------------ */
    {
      id: 'devtools', title: 'Observer HTTP avec le navigateur', added: '2026-11-08', tags: ['http', 'outils', 'pentest'],
      summary: `Les outils de développement (<b>F12</b>) te laissent voir chaque requête et réponse HTTP échangée par une page — l'outil n°1 pour apprendre.`,
      diagrams: [
        {
          type: 'steps', title: 'Procédure', c: 'v',
          items: [{ title: 'Ouvrir un site' }, { title: 'Appuyer sur F12', text: `ouvre les DevTools` }, { title: 'Onglet Network' }, { title: 'Recharger la page', text: `les requêtes apparaissent` }, { title: 'Sélectionner une requête' }]
        },
        {
          type: 'tiles', title: 'Ce qu\'il faut examiner', cols: 3,
          items: [
            { title: 'Request Method', text: `GET, POST…`, c: 'm' }, { title: 'Request URL', text: `la ressource et ses paramètres`, c: 'c' },
            { title: 'Status Code', text: `200, 301, 404…`, c: 'g' }, { title: 'Request Headers', text: `Host, Cookie, User-Agent…`, c: 'a' },
            { title: 'Response Headers', text: `Content-Type, Set-Cookie…`, c: 'o' }, { title: 'Payload', text: `données envoyées, lorsqu'il y en a`, c: 'v' }
          ]
        }
      ],
      explain: [
        `Ouvre un site, appuie sur <b>F12</b>, va dans l'onglet <b>Network</b>, recharge la page puis clique sur une requête : tu vois exactement ce que le navigateur a envoyé et ce que le serveur a répondu.`,
        `Teste sur un formulaire de connexion (sur un site ou un lab où tu en as le droit) : repère la méthode (<b>POST</b>), le <b>Payload</b> envoyé et le <b>Set-Cookie</b> de la réponse. Tu viens de voir sessions et cookies en action.`
      ],
      example: {
        title: 'terminal — le même regard en ligne de commande', lang: 'bash',
        code: `$ curl -v https://example.com/ 2>&1 | grep -E "^(>|<)"
< > GET / HTTP/2
< > Host: example.com
< < HTTP/2 200
< < content-type: text/html`,
        note: `<code>&gt;</code> = ce que tu envoies · <code>&lt;</code> = ce que le serveur renvoie. Même information que l'onglet Network.`
      },
      keypoints: [`<b>F12 → Network → recharger → cliquer</b> une requête.`, `Regarde méthode, URL, code de statut, en-têtes et payload.`, `C'est la base du travail d'analyse web (proxy comme Burp ensuite).`],
      related: ['req-res-example', 'sessions']
    },

    /* ------------------------------------------------------------------ */
    {
      id: 'security-risks', title: 'Risques de sécurité', added: '2026-11-08', tags: ['sécurité', 'sessions', 'owasp'],
      summary: `Sessions et méthodes HTTP mal protégées ouvrent la porte à des attaques classiques : <b>hijacking</b>, <b>fixation</b>, <b>CSRF</b>, mauvaise configuration.`,
      diagrams: [
        {
          type: 'sequence', title: 'Session Hijacking — vol d\'un identifiant de session', gap: 250,
          actors: [{ id: 'V', label: 'VICTIME', icon: 'user', c: 'c' }, { id: 'S', label: 'SERVEUR', icon: 'server', c: 'g' }, { id: 'A', label: 'ATTAQUANT', icon: 'skull', c: 'r' }],
          steps: [
            { from: 'V', to: 'S', text: 'Connexion', c: 'c' },
            { from: 'S', to: 'V', text: 'Session ID', c: 'g' },
            { note: `L'attaquant récupère le session ID\n(réseau non chiffré, XSS, fuite…)`, span: ['V', 'A'], c: 'r' },
            { from: 'A', to: 'S', text: 'Requête avec le session ID volé', sub: 'Cookie: session=…', c: 'r' },
            { from: 'S', to: 'A', text: 'Accès à la session de la victime', c: 'r' }
          ]
        },
        {
          type: 'tiles', title: 'Les quatre risques du cours',
          items: [
            { title: 'Session Hijacking', text: `Vol ou réutilisation d'un identifiant de session pour usurper une session.`, tag: 'VOL', c: 'r' },
            { title: 'Session Fixation', text: `Faire utiliser à une victime un identifiant de session <b>connu de l'attaquant</b>.`, tag: 'FIXATION', c: 'o' },
            { title: 'CSRF', text: `Amener un utilisateur authentifié à déclencher une action non souhaitée.`, tag: 'FORCÉ', c: 'a' },
            { title: 'Mauvaise configuration HTTP', text: `Autoriser PUT ou DELETE sans contrôles d'accès suffisants.`, tag: 'CONFIG', c: 'm' }
          ]
        }
      ],
      explain: [
        `Ces attaques ont un point commun : elles visent le <b>mécanisme d'état</b> ajouté à HTTP. Si l'identifiant de session est volé, prévisible, imposé ou utilisé à ton insu, l'attaquant agit « en ton nom ».`,
        `<b>Défenses de base :</b> HTTPS partout, cookies <code>HttpOnly; Secure; SameSite</code>, <b>nouvel identifiant de session après connexion</b> (contre la fixation), jetons anti-CSRF, expiration des sessions, et <b>contrôles d'authentification et d'autorisation</b> sur chaque méthode (PUT, DELETE…).`
      ],
      example: {
        title: 'en-têtes — côté défense', lang: 'http',
        code: `HTTP/1.1 200 OK
Set-Cookie: session=NOUVEL_ID_APRES_LOGIN; HttpOnly; Secure; SameSite=Strict
Strict-Transport-Security: max-age=31536000
Allow: GET, POST`,
        note: `Régénérer le session ID à la connexion bloque la <b>fixation</b> ; <code>Secure</code> et HSTS limitent l'écoute réseau ; restreindre <code>Allow</code> réduit la surface.`
      },
      warn: `Une méthode HTTP activée n'est <b>pas automatiquement une vulnérabilité</b> : il faut analyser l'authentification, les autorisations et le comportement réel de l'application. Ne teste que des cibles autorisées (labs, VM perso, programmes de bug bounty).`,
      keypoints: [`Hijacking = <b>voler</b> la session · Fixation = <b>imposer</b> la session · CSRF = <b>forcer</b> une action.`, `Mauvaise config = PUT/DELETE sans contrôle d'accès.`, `La défense repose sur cookies durcis, HTTPS, anti-CSRF et autorisations côté serveur.`],
      related: ['sessions', 'methodes-http']
    }
  ]
});
