GUIDE.addModule({
  id: 'networking', num: '01', title: 'Client-Server & Networking', icon: '⇄', color: 'g',
  tagline: `Qui demande, qui répond, et par où ça passe : client, serveur, requêtes, protocoles, ports et DNS.`,
  concepts: [

    /* ------------------------------------------------------------------ */
    {
      id: 'client-serveur', title: 'Client, serveur et service', added: '2026-11-08', tags: ['bases', 'réseau'],
      summary: `Le <b>client</b> initie une demande, le <b>serveur</b> la reçoit et répond, et le <b>service</b> est la fonctionnalité que le serveur propose.`,
      diagrams: [{
        type: 'flow', title: 'Le modèle client-serveur',
        nodes: [
          { id: 'cl', label: 'CLIENT', sub: 'navigateur, appli mobile', icon: 'monitor', x: 0, y: 1, c: 'c' },
          { id: 'web', label: 'Service Web', sub: 'site web', icon: 'globe', x: 2, y: 0, c: 'g' },
          { id: 'db', label: 'Service BDD', sub: 'base de données', icon: 'db', x: 2, y: 2, c: 'a' }
        ],
        zones: [{ label: 'Serveur (machine)', nodes: ['web', 'db'], c: 'g' }],
        edges: [
          { from: 'cl', to: 'web', label: '1 · REQUEST', c: 'c', anim: true, offset: -10 },
          { from: 'web', to: 'cl', label: '2 · RESPONSE', c: 'g', dashed: true, offset: 10 },
          { from: 'web', to: 'db', label: 'interroge', c: 'a', dashed: true }
        ],
        caption: `C'est <b>toujours le client qui commence</b> : le serveur attend et répond.`
      }],
      explain: [
        `Un <b>client</b> est une application ou un appareil qui demande quelque chose : ton navigateur, une application mobile, un outil comme <code>curl</code>. Il <b>initie</b> la conversation.`,
        `Un <b>serveur</b> est un système (une machine, une VM, un conteneur) qui écoute, reçoit les demandes et renvoie une réponse. Un même serveur peut héberger plusieurs <b>services</b> : un site web, une base de données, un service de messagerie…`,
        `Attention aux mots : « serveur » désigne parfois la <i>machine</i>, parfois le <i>logiciel</i> qui rend le service (nginx, Apache, MySQL). Le contexte te dit lequel.`
      ],
      example: {
        title: 'terminal — un client (curl) interroge un serveur', lang: 'bash',
        code: `$ curl -I https://example.com
< HTTP/2 200
< content-type: text/html
< (… autres en-têtes …)`,
        note: `<code>curl</code> joue le rôle du client ; <code>example.com</code> héberge le service web. La sortie est abrégée.`
      },
      keypoints: [`Le <b>client</b> initie, le <b>serveur</b> répond.`, `Un <b>service</b> = une fonctionnalité exposée (web, base de données, SSH…).`, `Un serveur peut héberger plusieurs services, chacun sur un <b>port</b> différent.`],
      related: ['request-response', 'ports']
    },

    /* ------------------------------------------------------------------ */
    {
      id: 'request-response', title: 'Request & Response', added: '2026-11-08', tags: ['bases', 'http'],
      summary: `Le client envoie une <b>requête</b>, le serveur la traite et renvoie une <b>réponse</b> — ou une erreur si la requête est incorrecte ou la ressource introuvable.`,
      diagrams: [
        {
          type: 'sequence', title: 'Un échange complet (et un échec)', actors: [{ id: 'C', label: 'CLIENT', icon: 'monitor', c: 'c' }, { id: 'S', label: 'SERVEUR', icon: 'server', c: 'g' }],
          steps: [
            { from: 'C', to: 'S', text: 'GET /products', sub: 'REQUEST', c: 'c' },
            { from: 'S', to: 'C', text: '200 OK + contenu', sub: 'RESPONSE · succès', c: 'g' },
            { from: 'C', to: 'S', text: 'GET /page-inconnue', sub: 'REQUEST', c: 'c' },
            { from: 'S', to: 'C', text: '404 Not Found', sub: 'RESPONSE · erreur', c: 'r' }
          ]
        },
        {
          type: 'tiles', title: 'Les codes de statut à connaître',
          items: [
            { big: '200', title: 'OK', text: `La requête a réussi.`, c: 'g' },
            { big: '400', title: 'Bad Request', text: `La requête est incorrecte ou mal formée.`, c: 'a' },
            { big: '404', title: 'Not Found', text: `La ressource demandée est introuvable.`, c: 'r' }
          ]
        }
      ],
      explain: [
        `Toute communication web suit le même schéma : <b>request → response</b>. Le client formule une demande précise (quelle ressource, avec quelle méthode), le serveur la traite et répond avec un <b>code de statut</b> et, souvent, un contenu.`,
        `Le premier chiffre du code donne la famille : <b>2xx</b> succès, <b>3xx</b> redirection, <b>4xx</b> erreur côté client, <b>5xx</b> erreur côté serveur. Une requête mal formée ou une ressource indisponible produit donc une erreur, pas un silence.`
      ],
      example: {
        title: 'terminal — provoquer un 404', lang: 'bash',
        code: `$ curl -i https://example.com/page-qui-nexiste-pas
< HTTP/2 404
< content-type: text/html
< (… corps de la page d'erreur …)`,
        note: `<code>-i</code> affiche les en-têtes de réponse. Le <b>404</b> prouve que le serveur a bien répondu : c'est la <i>ressource</i> qui n'existe pas.`
      },
      keypoints: [`Request = ce que le client demande ; Response = ce que le serveur renvoie.`, `<b>2xx</b> OK · <b>4xx</b> faute du client · <b>5xx</b> faute du serveur.`, `Un code d'erreur est une information précieuse en analyse de sécurité.`],
      related: ['http-https', 'req-res-example']
    },

    /* ------------------------------------------------------------------ */
    {
      id: 'protocole', title: 'Protocol (protocole)', added: '2026-11-08', tags: ['bases', 'réseau'],
      summary: `Un protocole est un <b>ensemble de règles</b> qui permet à deux machines de se comprendre : quelles commandes, quel format, quelles réponses, quelle gestion d'erreurs.`,
      diagrams: [
        {
          type: 'tiles', title: 'Ce que définit un protocole', cols: 4,
          items: [
            { title: 'Commandes', text: `les ordres compris par chaque côté`, c: 'c' },
            { title: 'Format & syntaxe', text: `la forme exacte des messages`, c: 'g' },
            { title: 'Réponses attendues', text: `ce qu'on doit renvoyer à chaque demande`, c: 'a' },
            { title: 'Gestion des erreurs', text: `que faire quand ça se passe mal`, c: 'r' }
          ]
        },
        {
          type: 'tiles', title: 'Protocoles courants',
          items: [
            { big: 'HTTP/S', title: 'Web', text: `Pages web et API.`, tag: '80 / 443', c: 'g' },
            { big: 'SSH', title: 'Accès distant sécurisé', text: `Administrer une machine à distance.`, tag: '22', c: 'v' },
            { big: 'FTP', title: 'Transfert de fichiers', text: `Envoyer et récupérer des fichiers.`, tag: '21', c: 'a' },
            { big: 'DNS', title: 'Résolution de noms', text: `Nom de domaine → adresse IP.`, tag: '53', c: 'c' }
          ]
        }
      ],
      explain: [
        `Imagine deux personnes qui ne parlent pas la même langue : elles ne peuvent pas échanger. Un protocole est la <b>langue commune</b> et la politesse qui va avec (qui parle en premier, comment on dit « ok », comment on signale une erreur).`,
        `Chaque service réseau utilise son protocole : le navigateur parle <b>HTTP/HTTPS</b> au serveur web, l'administrateur parle <b>SSH</b> à un serveur Linux, etc.`
      ],
      example: {
        title: 'terminal — deux protocoles, deux usages', lang: 'bash',
        code: `# HTTP : récupérer une page
$ curl http://example.com

# SSH : ouvrir un shell distant (sur une machine que tu administres)
$ ssh utilisateur@192.168.56.10`,
        note: `Même réseau, protocoles différents : ce n'est pas la commande qui compte mais <b>le protocole que le serveur attend</b>.`
      },
      keypoints: [`Protocole = règles de communication partagées.`, `Un protocole ≠ un port : le port désigne <i>où</i> on frappe, le protocole <i>comment</i> on parle.`, `Connaître le protocole d'un service, c'est savoir comment l'interroger… ou l'attaquer.`],
      related: ['ports', 'http-https']
    },

    /* ------------------------------------------------------------------ */
    {
      id: 'ports', title: 'Ports réseau', added: '2026-11-08', tags: ['bases', 'réseau', 'nmap'],
      summary: `Un port est un <b>numéro</b> qui identifie un point d'accès à un service sur une machine. Une machine héberge plusieurs services, chacun sur un port différent.`,
      diagrams: [
        {
          type: 'flow', title: 'Une machine, plusieurs portes d\'entrée',
          nodes: [
            { id: 'cl', label: 'CLIENT', icon: 'monitor', x: 0, y: 1.5, c: 'c' },
            { id: 'p22', label: ':22  SSH', sub: 'accès distant sécurisé', x: 2, y: 0, c: 'v' },
            { id: 'p80', label: ':80  HTTP', sub: 'web non chiffré', x: 2, y: 1, c: 'r' },
            { id: 'p443', label: ':443  HTTPS', sub: 'web chiffré (TLS)', x: 2, y: 2, c: 'g' },
            { id: 'p3306', label: ':3306  MySQL', sub: 'base de données', x: 2, y: 3, c: 'a' }
          ],
          zones: [{ label: 'Serveur 192.168.56.10', nodes: ['p22', 'p80', 'p443', 'p3306'], c: 'w' }],
          edges: [
            { from: 'cl', to: 'p22', c: 'v', anim: true }, { from: 'cl', to: 'p80', c: 'r', anim: true },
            { from: 'cl', to: 'p443', c: 'g', anim: true }, { from: 'cl', to: 'p3306', c: 'a', anim: true }
          ],
          caption: `Comme un immeuble : <b>l'adresse IP</b> trouve le bâtiment, <b>le port</b> trouve la bonne porte.`
        },
        {
          type: 'tiles', title: 'Les ports à connaître par cœur', cols: 4,
          items: [
            { big: '22', title: 'SSH', text: `Accès distant sécurisé`, c: 'v' },
            { big: '21', title: 'FTP (contrôle)', text: `Transfert de fichiers`, c: 'a' },
            { big: '53', title: 'DNS', text: `Résolution des noms de domaine`, c: 'c' },
            { big: '80', title: 'HTTP', text: `Web non chiffré`, c: 'r' },
            { big: '443', title: 'HTTPS', text: `Web chiffré avec TLS`, c: 'g' },
            { big: '3306', title: 'MySQL', text: `Base de données`, c: 'b' },
            { big: '5432', title: 'PostgreSQL', text: `Base de données`, c: 'o' },
            { big: '3389', title: 'RDP', text: `Accès distant Windows`, c: 'm' }
          ]
        }
      ],
      explain: [
        `Une machine n'a qu'<b>une adresse IP</b> mais peut offrir beaucoup de services. Le <b>port</b> (de 0 à 65535) permet au système d'envoyer chaque paquet au bon programme.`,
        `En sécurité, la liste des <b>ports ouverts</b> est la surface d'attaque visible d'une machine : chaque service exposé est une porte à examiner. C'est exactement ce que fait un scan de ports sur un <b>lab autorisé</b>.`
      ],
      examples: [
        {
          title: 'terminal — voir les ports en écoute sur TA machine (Linux)', lang: 'bash',
          code: `$ ss -tlnp
< State   Local Address:Port   Process
< LISTEN  0.0.0.0:22           sshd
< LISTEN  127.0.0.1:3306       mysqld`,
          note: `<code>-t</code> TCP · <code>-l</code> en écoute · <code>-n</code> numéros · <code>-p</code> processus. La sortie dépend de ta machine.`
        },
        {
          title: 'terminal — scan d\'un lab que tu possèdes', lang: 'bash',
          code: `$ nmap -p 22,80,443 192.168.56.10
< PORT    STATE  SERVICE
< 22/tcp  open   ssh
< 80/tcp  open   http
< 443/tcp closed https`,
          note: `⚠ Ne scanne que des machines <b>qui t'appartiennent</b> ou que tu es autorisé à tester (labs TryHackMe, VM perso).`
        }
      ],
      keypoints: [`Port = numéro identifiant un service sur une machine.`, `Ports connus : <b>22</b> SSH · <b>53</b> DNS · <b>80</b> HTTP · <b>443</b> HTTPS · <b>3306</b> MySQL · <b>5432</b> PostgreSQL · <b>3389</b> RDP · <b>21</b> FTP.`, `Plus il y a de ports ouverts, plus la surface d'attaque est grande.`],
      related: ['protocole', 'dns', 'lab-cyber']
    },

    /* ------------------------------------------------------------------ */
    {
      id: 'dns', title: 'DNS (Domain Name System)', added: '2026-11-08', tags: ['bases', 'réseau'],
      summary: `Le DNS traduit un <b>nom de domaine</b> lisible (<code>example.com</code>) en <b>adresse IP</b> pour localiser le serveur. C'est le GPS d'Internet.`,
      diagrams: [{
        type: 'flow', title: 'Résolution d\'un nom de domaine',
        nodes: [
          { id: 'nav', label: 'NAVIGATEUR', sub: 'tu tapes example.com', icon: 'monitor', x: 0, y: 1, c: 'c' },
          { id: 'dns', label: 'SERVEUR DNS', sub: 'annuaire des noms', icon: 'globe', x: 2, y: 0, c: 'v' },
          { id: 'srv', label: 'SERVEUR WEB', sub: 'à l\'adresse IP obtenue', icon: 'server', x: 2, y: 2, c: 'g' }
        ],
        edges: [
          { from: 'nav', to: 'dns', label: '1 · example.com ?', c: 'c', anim: true, offset: -10 },
          { from: 'dns', to: 'nav', label: '2 · adresse IP', c: 'v', dashed: true, offset: 10 },
          { from: 'nav', to: 'srv', label: '3 · connexion à l\'IP', c: 'g', anim: true }
        ]
      }],
      explain: [
        `Les machines communiquent avec des <b>adresses IP</b>, mais les humains retiennent des <b>noms</b>. Avant de contacter <code>example.com</code>, ton navigateur demande au DNS : « quelle est l'adresse IP de ce nom ? ». Une fois la réponse obtenue, il se connecte au serveur.`,
        `<b>Analogie :</b> un GPS transforme un nom de lieu en coordonnées. Le DNS transforme un nom de domaine en adresse IP. Sans DNS, il faudrait mémoriser des suites de chiffres pour chaque site.`
      ],
      example: {
        title: 'terminal — interroger le DNS', lang: 'bash',
        code: `$ nslookup example.com
< Name:    example.com
< Address: <adresse IP du serveur>

$ dig example.com +short
< <adresse IP du serveur>`,
        note: `Les adresses réelles peuvent changer ; retiens la logique : <b>nom en entrée, IP en sortie</b>.`
      },
      keypoints: [`DNS : nom de domaine → adresse IP.`, `Il utilise le port <b>53</b>.`, `Une résolution DNS précède presque toute connexion à un site.`, `En cybersécurité, les requêtes DNS sont une source de logs précieuse pour repérer des comportements suspects.`],
      related: ['ports', 'client-serveur']
    }
  ]
});
