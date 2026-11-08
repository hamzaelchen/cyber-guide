GUIDE.addModule({
  id: 'virtualisation', num: '03', title: 'Virtualisation & Conteneurs', icon: '▣', color: 'c',
  tagline: `Faire tourner plusieurs « machines » sur un seul matériel : hyperviseurs, VM, conteneurs Docker et labs de cybersécurité.`,
  concepts: [

    /* ------------------------------------------------------------------ */
    {
      id: 'un-serveur-une-app', title: 'Avant la virtualisation : One Server = One Application', added: '2026-11-08', tags: ['virtualisation', 'histoire'],
      summary: `Avant, chaque service avait <b>son propre serveur physique</b> : cher, peu utilisé, lent à déployer et difficile à faire grandir.`,
      diagrams: [
        {
          type: 'flow', title: 'Avant : un serveur par service', colW: 190, rowH: 96,
          nodes: [
            { id: 'a', label: 'Serveur 1', sub: 'site web', icon: 'server', x: 0, y: 0, c: 'r' }, { id: 'b', label: 'Serveur 2', sub: 'base de données', icon: 'server', x: 1, y: 0, c: 'r' },
            { id: 'c', label: 'Serveur 3', sub: 'email', icon: 'server', x: 2, y: 0, c: 'r' }, { id: 'd', label: 'Serveur 4', sub: 'application interne', icon: 'server', x: 3, y: 0, c: 'r' }
          ],
          zones: [{ label: '4 machines physiques à acheter, alimenter, refroidir', nodes: ['a', 'b', 'c', 'd'], c: 'r' }]
        },
        {
          type: 'bars', title: 'Utilisation des ressources (valeurs illustratives)', max: 100,
          items: [
            { label: 'Site web', value: 12, text: '≈ 5–20 %', c: 'r' }, { label: 'Base de données', value: 8, text: '≈ 5–20 %', c: 'r' },
            { label: 'Email', value: 18, text: '≈ 5–20 %', c: 'r' }, { label: 'Appli interne', value: 6, text: '≈ 5–20 %', c: 'r' },
            { label: 'Après virtualisation', value: 80, text: 'bien meilleure', c: 'g' }
          ],
          caption: `Les barres sont <b>illustratives</b> : retiens l'ordre de grandeur « parfois seulement 5 à 20 % » d'utilisation avant la virtualisation.`
        },
        {
          type: 'tiles', title: 'Les quatre problèmes', cols: 4,
          items: [
            { title: 'Coûts élevés', text: `achat, énergie, refroidissement`, c: 'r' }, { title: 'Faible utilisation', text: `parfois seulement 5 à 20 %`, c: 'o' },
            { title: 'Déploiement lent', text: `commander et installer une machine`, c: 'a' }, { title: 'Mise à l\'échelle difficile', text: `grandir = racheter du matériel`, c: 'm' }
          ]
        }
      ],
      explain: [
        `Une entreprise pouvait utiliser un serveur physique par service : un pour le site web, un pour la base de données, un pour l'email, un pour l'application interne. Chaque machine tournait souvent <b>très en dessous de sa capacité</b>, mais coûtait pleinement en matériel, électricité et refroidissement.`,
        `La virtualisation répond à ce gâchis : au lieu de multiplier les machines, on <b>partage</b> une machine physique entre plusieurs « machines virtuelles » isolées.`
      ],
      keypoints: [`Avant : <b>1 serveur = 1 application</b>.`, `Conséquences : coûts élevés, faible utilisation (5–20 %), déploiement lent, mise à l'échelle difficile.`, `La virtualisation mutualise le matériel.`],
      related: ['hyperviseur', 'avantages-virtu']
    },

    /* ------------------------------------------------------------------ */
    {
      id: 'hyperviseur', title: 'Virtualisation et hyperviseur', added: '2026-11-08', tags: ['virtualisation', 'vm', 'hyperviseur'],
      summary: `La <b>virtualisation</b> fait fonctionner un ordinateur physique comme plusieurs ordinateurs séparés ; l'<b>hyperviseur</b> crée et gère ces <b>machines virtuelles</b> (VM).`,
      diagrams: [
        {
          type: 'tiles', title: 'Trois définitions', cols: 3,
          items: [
            { title: 'Virtualisation', text: `Un ordinateur physique fonctionne comme <b>plusieurs ordinateurs séparés</b>.`, c: 'c' },
            { title: 'Hyperviseur', text: `Crée, exécute et gère les VM en <b>répartissant les ressources matérielles</b>.`, c: 'g' },
            { title: 'VM (Virtual Machine)', text: `Ordinateur virtuel avec son propre OS, ses applications et ses paramètres, sur du matériel partagé.`, c: 'v' }
          ]
        },
        {
          type: 'stack', title: 'Deux types d\'hyperviseurs',
          columns: [
            { title: 'Type 1 — Bare Metal', sub: 'directement sur le matériel', c: 'g', layers: [{ row: [{ label: 'VM 1', sub: 'OS + apps' }, { label: 'VM 2', sub: 'OS + apps' }, { label: 'VM 3', sub: 'OS + apps' }] }, { label: 'Hyperviseur', c: 'g' }, { label: 'Matériel physique', c: 'w' }], note: `Ex. : <b>VMware ESXi, Hyper-V, Xen</b>.` },
            { title: 'Type 2 — Hosted', sub: 'comme une application', c: 'a', layers: [{ row: [{ label: 'VM 1', sub: 'OS + apps' }, { label: 'VM 2', sub: 'OS + apps' }, { label: 'VM 3', sub: 'OS + apps' }] }, { label: 'Hyperviseur (application)', c: 'a' }, { label: 'Système d\'exploitation hôte', c: 'b' }, { label: 'Matériel physique', c: 'w' }], note: `Ex. : <b>VirtualBox, VMware Workstation</b>.` }
          ]
        }
      ],
      explain: [
        `L'<b>hyperviseur</b> est le chef d'orchestre : il découpe le CPU, la RAM et le stockage du serveur physique et les distribue aux VM. Chaque VM croit avoir sa propre machine.`,
        `Le <b>Type 1</b> (bare metal) tourne directement sur le matériel : c'est celui des datacenters. Le <b>Type 2</b> (hosted) tourne comme un logiciel sur ton Windows/macOS/Linux : c'est celui que tu utilises pour ton laboratoire (VirtualBox, VMware Workstation).`
      ],
      example: {
        title: 'terminal — piloter VirtualBox (type 2) en ligne de commande', lang: 'bash',
        code: `$ VBoxManage list vms
< "Kali" {3b1c…}
< "Windows-cible" {9f42…}
< "Ubuntu-Server" {c07a…}`,
        note: `Chaque ligne est une VM gérée par l'hyperviseur. Les noms/identifiants dépendent de ta machine.`
      },
      keypoints: [`Hyperviseur = logiciel qui crée et gère les VM.`, `<b>Type 1</b> sur le matériel (ESXi, Hyper-V, Xen) · <b>Type 2</b> sur un OS hôte (VirtualBox, VMware Workstation).`, `Chaque VM = son OS, ses apps, ses paramètres.`],
      related: ['analogie-immeuble', 'vm-vs-container']
    },

    /* ------------------------------------------------------------------ */
    {
      id: 'analogie-immeuble', title: 'Analogie de l\'immeuble', added: '2026-11-08', tags: ['virtualisation', 'analogie'],
      summary: `Pour retenir : le serveur est un <b>immeuble</b>, les VM sont des <b>appartements</b>, les systèmes sont les <b>locataires</b> et l'hyperviseur est le <b>gestionnaire</b>.`,
      diagrams: [{
        type: 'flow', title: 'L\'immeuble virtuel', colW: 190, rowH: 120,
        nodes: [
          { id: 'g', label: 'GESTIONNAIRE', sub: '= hyperviseur', icon: 'user', x: 1.5, y: 0, c: 'g' },
          { id: 'a1', label: 'Appartement 1', sub: 'VM · locataire Kali', icon: 'monitor', x: 0, y: 1, c: 'c' },
          { id: 'a2', label: 'Appartement 2', sub: 'VM · locataire Windows', icon: 'monitor', x: 1, y: 1, c: 'b' },
          { id: 'a3', label: 'Appartement 3', sub: 'VM · locataire Ubuntu', icon: 'monitor', x: 2, y: 1, c: 'v' },
          { id: 'a4', label: 'Appartement 4', sub: 'VM · Security Onion', icon: 'monitor', x: 3, y: 1, c: 'm' }
        ],
        zones: [{ label: 'IMMEUBLE = serveur physique (CPU, RAM, stockage partagés)', nodes: ['g', 'a1', 'a2', 'a3', 'a4'], c: 'a', pad: 26 }],
        edges: [
          { from: 'g', to: 'a1', label: 'alloue les ressources', c: 'g', dashed: true }, { from: 'g', to: 'a2', c: 'g', dashed: true },
          { from: 'g', to: 'a3', c: 'g', dashed: true }, { from: 'g', to: 'a4', c: 'g', dashed: true }
        ]
      }],
      explain: [
        `<b>Immeuble = serveur physique</b>, <b>appartements = machines virtuelles</b>, <b>locataires = systèmes et applications</b>, <b>gestionnaire = hyperviseur</b>.`,
        `Chaque appartement fonctionne <b>indépendamment</b> (ce qui se passe chez un locataire n'affecte pas les autres), tout en partageant les ressources du bâtiment : électricité, eau… c'est-à-dire CPU, RAM et stockage. Le gestionnaire décide qui reçoit quoi.`
      ],
      example: {
        title: 'exemple concret — répartition des ressources (valeurs d\'exemple)', lang: 'text',
        code: `Serveur physique : 64 Go de RAM, 16 cœurs
 ├─ VM Kali            →  8 Go, 2 cœurs
 ├─ VM Windows cible   → 16 Go, 4 cœurs
 ├─ VM Ubuntu Server   →  8 Go, 2 cœurs
 └─ VM Security Onion  → 16 Go, 4 cœurs   (reste disponible pour de nouvelles VM)`
      },
      keypoints: [`Immeuble → serveur · Appartements → VM · Locataires → systèmes/apps · Gestionnaire → hyperviseur.`, `Indépendance logique, partage physique.`],
      related: ['hyperviseur']
    },

    /* ------------------------------------------------------------------ */
    {
      id: 'vm-vs-container', title: 'VM vs Container', added: '2026-11-08', tags: ['conteneurs', 'docker', 'vm'],
      summary: `Une <b>VM</b> virtualise une machine complète avec son OS ; un <b>conteneur</b> isole une application en <b>partageant le noyau</b> de l'OS hôte.`,
      diagrams: [{
        type: 'stack', title: 'Deux façons d\'isoler',
        columns: [
          { title: 'Machine virtuelle (VM)', c: 'b', layers: [{ row: [{ label: 'App', c: 'b' }, { label: 'App', c: 'b' }, { label: 'App', c: 'b' }] }, { row: [{ label: 'OS invité', c: 'v' }, { label: 'OS invité', c: 'v' }, { label: 'OS invité', c: 'v' }] }, { label: 'Hyperviseur', c: 'g' }, { label: 'Matériel', c: 'w' }], note: `Chaque VM embarque <b>son propre OS</b>.` },
          { title: 'Container', c: 'o', layers: [{ row: [{ label: 'App + dép.', c: 'o' }, { label: 'App + dép.', c: 'o' }, { label: 'App + dép.', c: 'o' }] }, { label: 'Moteur de conteneurs (Docker)', c: 'a' }, { label: 'OS hôte — noyau partagé', c: 'b' }, { label: 'Matériel', c: 'w' }], note: `Les conteneurs <b>partagent le noyau</b> de l'hôte.` }
        ]
      }],
      explain: [
        `Une VM contient un système d'exploitation complet : elle est <b>plus lourde</b> mais très isolée, et peut faire tourner un OS différent de l'hôte. Un conteneur ne contient que l'application et ses dépendances : il est <b>plus léger et démarre plus vite</b>.`,
        `Les deux se complètent : on lance souvent des conteneurs <i>dans</i> des VM, ou on utilise des VM pour les OS complets (Kali, Windows) et Docker pour déployer rapidement des applications de test.`
      ],
      table: {
        title: 'COMPARAISON', head: ['Machine virtuelle (VM)', 'Container'],
        rows: [
          ['Possède son propre OS invité.', 'Partage le noyau de l\'OS hôte.'],
          ['Virtualise une machine complète.', 'Isole principalement une application et ses dépendances.'],
          ['Généralement plus lourde en ressources.', 'Généralement plus léger et rapide à démarrer.'],
          ['Gérée par un hyperviseur.', 'Géré par un moteur de conteneurs, comme Docker.']
        ]
      },
      example: {
        title: 'terminal — un conteneur démarre en un instant', lang: 'bash',
        code: `$ docker run --rm alpine echo "bonjour depuis un conteneur"
< bonjour depuis un conteneur`,
        note: `<code>--rm</code> supprime le conteneur à la fin. Comparé au démarrage complet d'une VM, c'est quasi immédiat.`
      },
      keypoints: [`VM = OS complet, géré par un <b>hyperviseur</b>.`, `Container = app + dépendances, noyau <b>partagé</b>, géré par <b>Docker</b>.`, `Conteneur : plus léger/rapide. VM : isolation plus forte et OS indépendant.`],
      related: ['image-container', 'hyperviseur']
    },

    /* ------------------------------------------------------------------ */
    {
      id: 'image-container', title: 'Container Image et Container', added: '2026-11-08', tags: ['docker', 'conteneurs'],
      summary: `Une <b>image</b> est le modèle préconstruit ; un <b>conteneur</b> est une instance créée à partir de cette image.`,
      diagrams: [{
        type: 'flow', title: 'De l\'image aux conteneurs', colW: 220, rowH: 90,
        nodes: [
          { id: 'img', label: 'CONTAINER IMAGE', sub: 'modèle préconstruit\n(app + dépendances)', icon: 'box', x: 0, y: 1, c: 'o' },
          { id: 'c1', label: 'Container #1', sub: 'instance', icon: 'box', x: 2, y: 0, c: 'g' },
          { id: 'c2', label: 'Container #2', sub: 'instance', icon: 'box', x: 2, y: 1, c: 'g' },
          { id: 'c3', label: 'Container #3', sub: 'instance', icon: 'box', x: 2, y: 2, c: 'g' }
        ],
        edges: [{ from: 'img', to: 'c1', label: 'docker run', c: 'o', anim: true }, { from: 'img', to: 'c2', c: 'o', anim: true }, { from: 'img', to: 'c3', c: 'o', anim: true }],
        caption: `Une image → autant de conteneurs que tu veux. Analogie : <b>la recette</b> (image) et <b>les plats</b> (conteneurs).`
      }],
      explain: [
        `L'<b>image</b> contient tout ce qu'il faut pour exécuter l'application : code, dépendances, configuration de base. Elle est <b>en lecture seule</b> et réutilisable. Chaque <b>conteneur</b> lancé depuis elle est une instance indépendante qui s'exécute réellement.`
      ],
      example: {
        title: 'terminal — les 4 commandes Docker du cours', lang: 'bash',
        code: `$ docker pull ubuntu
# télécharge l'image ubuntu
$ docker run -it ubuntu bash
# lance un conteneur interactif depuis l'image
< root@3f2a9c1d7b4e:/#
$ docker ps
# liste les conteneurs en cours d'exécution
$ docker images
# liste les images présentes sur ta machine`,
        legend: [['pull', `récupère une image`], ['run -it … bash', `crée un conteneur et ouvre un shell dedans`], ['ps', `conteneurs actifs`], ['images', `images locales`]]
      },
      keypoints: [`<b>Image</b> = modèle · <b>Container</b> = instance.`, `<code>docker pull</code> · <code>docker run</code> · <code>docker ps</code> · <code>docker images</code>.`, `Plusieurs conteneurs peuvent naître de la même image.`],
      related: ['vm-vs-container', 'lab-cyber']
    },

    /* ------------------------------------------------------------------ */
    {
      id: 'avantages-virtu', title: 'Avantages de la virtualisation', added: '2026-11-08', tags: ['virtualisation'],
      summary: `Huit raisons pour lesquelles la virtualisation est devenue la norme, des datacenters aux labs de cybersécurité.`,
      diagrams: [{
        type: 'tiles', title: 'Les 8 avantages', cols: 4,
        items: [
          { title: 'Cost savings', text: `Réduction des coûts matériels et d'exploitation.`, c: 'g' }, { title: 'Better resource usage', text: `Meilleure utilisation du CPU, de la RAM et du stockage.`, c: 'c' },
          { title: 'Safe testing', text: `Laboratoires isolés pour les tests de cybersécurité.`, c: 'r' }, { title: 'Faster deployment', text: `Création rapide de nouvelles machines.`, c: 'a' },
          { title: 'Flexibility', text: `Différents systèmes et configurations.`, c: 'v' }, { title: 'Portability', text: `Déplacement ou migration des VM.`, c: 'b' },
          { title: 'Scalability', text: `Adaptation des ressources à la demande.`, c: 'o' }, { title: 'Centralized management', text: `Gestion centralisée des machines virtuelles.`, c: 'm' }
        ]
      }],
      explain: [
        `Pour un étudiant en cybersécurité, l'avantage n°1 est le <b>Safe testing</b> : tu peux casser, infecter ou mal configurer une VM sans risque, puis revenir à un <b>instantané</b> (snapshot) propre en quelques secondes.`,
        `Pour une entreprise, ce sont surtout les <b>économies</b>, la meilleure utilisation des ressources et la rapidité de déploiement.`
      ],
      example: {
        title: 'terminal — snapshot avant une expérience risquée', lang: 'bash',
        code: `$ VBoxManage snapshot "Windows-cible" take "etat-propre"
# … tu lances tes tests dans la VM …
$ VBoxManage snapshot "Windows-cible" restore "etat-propre"
# retour instantané à l'état d'origine`
      },
      keypoints: [`Coûts ↓ · Utilisation ↑ · Déploiement plus rapide.`, `Isolation : on teste sans risque pour la machine hôte.`, `Les VM se déplacent, se copient, se restaurent facilement.`],
      related: ['lab-cyber', 'un-serveur-une-app']
    },

    /* ------------------------------------------------------------------ */
    {
      id: 'lab-cyber', title: 'Utilisation en laboratoire cybersécurité', added: '2026-11-08', tags: ['lab', 'kali', 'soc', 'pentest'],
      summary: `Un lab virtuel typique : <b>Kali</b> pour les tests autorisés, <b>Windows</b> comme cible, <b>Ubuntu Server</b> pour héberger des services, <b>Security Onion</b> pour la supervision.`,
      diagrams: [{
        type: 'flow', title: 'Architecture d\'un lab isolé', colW: 210, rowH: 100,
        nodes: [
          { id: 'k', label: 'Kali Linux', sub: 'tests autorisés', icon: 'skull', x: 0, y: 0, c: 'r' },
          { id: 'w', label: 'Windows', sub: 'machine cible', icon: 'monitor', x: 3, y: 0, c: 'b' },
          { id: 'sw', label: 'Réseau virtuel', sub: 'switch isolé', icon: 'switch', x: 1.5, y: 1, c: 'v' },
          { id: 'u', label: 'Ubuntu Server', sub: 'héberge des services', icon: 'server', x: 0, y: 2, c: 'g' },
          { id: 'so', label: 'Security Onion', sub: 'supervision', icon: 'shield', x: 3, y: 2, c: 'm' },
          { id: 'd', label: 'Docker', sub: 'apps de test en conteneurs', icon: 'box', x: 1.5, y: 2.6, c: 'a' }
        ],
        zones: [
          { label: 'Ordinateur physique + hyperviseur', nodes: ['k', 'w', 'sw', 'u', 'so', 'd'], c: 'w', pad: 34 },
          { label: 'Réseau virtuel isolé', nodes: ['k', 'w', 'sw', 'u', 'so'], c: 'v', pad: 4 }
        ],
        edges: [
          { from: 'k', to: 'sw', c: 'r', anim: true, bi: true }, { from: 'w', to: 'sw', c: 'b', anim: true, bi: true },
          { from: 'u', to: 'sw', c: 'g', anim: true, bi: true }, { from: 'so', to: 'sw', label: 'observe le trafic', c: 'm', dashed: true },
          { from: 'd', to: 'u', c: 'a', dashed: true }
        ]
      }],
      explain: [
        `Un laboratoire peut contenir <b>Kali Linux</b> (outils d'audit, pour des tests <b>autorisés</b>), <b>Windows</b> comme machine cible, <b>Ubuntu Server</b> pour héberger des services, et <b>Security Onion</b> pour la supervision (détection, logs). Les VM sont placées dans un <b>réseau virtuel isolé</b> : ce qui se passe dans le lab reste dans le lab.`,
        `<b>Docker</b> permet aussi de déployer rapidement des applications de test en conteneurs. Ce lab te sert à la fois côté attaque (pentest) et côté défense (SOC) : tu génères une action avec Kali et tu observes ce qu'elle laisse comme traces dans Security Onion.`
      ],
      example: {
        title: 'terminal — isoler une VM sur un réseau interne VirtualBox', lang: 'bash',
        code: `$ VBoxManage modifyvm "Kali"          --nic1 intnet --intnet1 "lab-isole"
$ VBoxManage modifyvm "Windows-cible" --nic1 intnet --intnet1 "lab-isole"
# les deux VM se voient entre elles, mais PAS Internet ni ton réseau réel`,
        note: `Réseau « interne » = isolé de l'extérieur. Ajoute une 2ᵉ carte en NAT sur la VM qui a besoin de télécharger des paquets.`
      },
      warn: `N'utilise tes outils offensifs (Kali, scanners, exploits) que dans ton lab ou sur des cibles pour lesquelles tu as une <b>autorisation écrite</b>.`,
      keypoints: [`Kali = attaque autorisée · Windows = cible · Ubuntu = services · Security Onion = supervision.`, `Réseau virtuel <b>isolé</b> = tests sans danger.`, `Docker = applications de test jetables.`],
      related: ['avantages-virtu', 'ports', 'image-container']
    }
  ]
});
