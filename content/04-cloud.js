GUIDE.addModule({
  id: 'cloud', num: '04', title: 'Cloud Computing Fundamentals', icon: '☁', color: 'a',
  tagline: `Louer de la puissance informatique plutôt que la posséder : modèles de déploiement, IaaS/PaaS/SaaS, EC2, fournisseurs et sécurité cloud.`,
  concepts: [

    /* ------------------------------------------------------------------ */
    {
      id: 'cloud-computing', title: 'Qu\'est-ce que le Cloud Computing ?', added: '2026-11-08', tags: ['cloud', 'bases'],
      summary: `Utiliser des ressources informatiques <b>via Internet</b> plutôt que de dépendre uniquement d'un ordinateur local ou de serveurs gérés sur place.`,
      diagrams: [
        {
          type: 'flow', title: 'Du local au cloud', colW: 230, rowH: 100,
          nodes: [
            { id: 'loc', label: 'Ordinateur local', sub: 'ou serveurs sur place', icon: 'monitor', x: 0, y: 0, c: 'w' },
            { id: 'you', label: 'TOI', sub: 'navigateur / CLI / appli', icon: 'user', x: 0, y: 1.2, c: 'c' },
            { id: 'cl', label: 'CLOUD', sub: 'ressources à la demande', icon: 'cloud', x: 2, y: 0.6, c: 'a' }
          ],
          edges: [{ from: 'you', to: 'cl', label: 'Internet', c: 'a', anim: true, bi: true }],
          caption: `Au lieu d'acheter et d'héberger le matériel, tu <b>consommes</b> des ressources chez un fournisseur.`
        },
        {
          type: 'hub', title: 'Ce que le cloud met à disposition', center: 'CLOUD', c: 'a',
          spokes: [{ label: 'Calcul', sub: 'serveurs virtuels', c: 'a' }, { label: 'Stockage', sub: 'fichiers, objets', c: 'c' }, { label: 'Réseau', sub: 'réseaux virtuels', c: 'g' },
          { label: 'Bases de données', sub: 'SQL, NoSQL…', c: 'v' }, { label: 'Logiciels', sub: 'applications en ligne', c: 'm' }, { label: 'Services de sécurité', sub: 'identités, détection', c: 'r' }]
        }
      ],
      explain: [
        `Le cloud, c'est <b>l'informatique à la demande</b> : calcul, stockage, réseau, bases de données, logiciels et services de sécurité, accessibles par Internet et facturés selon l'usage.`,
        `Concrètement, quand tu lances une VM chez un fournisseur, elle tourne dans un datacenter que tu ne vois jamais : c'est de la <b>virtualisation à très grande échelle</b>, avec une interface (console web, ligne de commande, API) pour tout piloter.`
      ],
      example: {
        title: 'terminal — piloter le cloud avec une commande (AWS CLI)', lang: 'bash',
        code: `$ aws s3 ls
< 2026-11-01 10:12:44 mon-bucket-de-test
$ aws ec2 describe-instances --query "Reservations[].Instances[].InstanceId"
< [ "i-0abc123def456…" ]`,
        note: `Nécessite un compte et des identifiants configurés (<code>aws configure</code>). Les sorties ci-dessus sont des exemples.`
      },
      keypoints: [`Ressources informatiques <b>via Internet</b>, à la demande.`, `Calcul, stockage, réseau, bases de données, logiciels, sécurité.`, `Se pilote par console, CLI ou API.`],
      related: ['caracteristiques-cloud', 'modeles-deploiement']
    },

    /* ------------------------------------------------------------------ */
    {
      id: 'caracteristiques-cloud', title: 'Caractéristiques et avantages du Cloud', added: '2026-11-08', tags: ['cloud'],
      summary: `Six propriétés qui font la force du cloud : <b>scalabilité</b>, libre-service, paiement à l'usage, sécurité outillée, haute disponibilité et accès mondial.`,
      diagrams: [{
        type: 'tiles', title: 'Les 6 caractéristiques', cols: 3,
        items: [
          { title: 'Scalability', text: `Augmenter ou diminuer les ressources selon la charge.`, c: 'a' },
          { title: 'On-demand self-service', text: `Créer ou supprimer des ressources à la demande.`, c: 'c' },
          { title: 'Pay only for what you use', text: `Payer selon la consommation et la tarification du service.`, c: 'g' },
          { title: 'Security', text: `Outils et contrôles fournis par le prestataire ; <b>la configuration reste essentielle</b>.`, c: 'r' },
          { title: 'High availability', text: `Concevoir les services pour rester disponibles malgré certaines défaillances.`, c: 'v' },
          { title: 'Global access', text: `Rendre les applications accessibles depuis différentes régions.`, c: 'b' }
        ]
      }],
      explain: [
        `<b>Exemple :</b> une boutique en ligne prépare une promotion. Grâce à la <b>scalabilité</b> et au <b>libre-service</b>, elle ajoute des serveurs pour le pic de trafic puis les supprime ensuite : elle ne paie que ce qu'elle a utilisé.`,
        `Côté sécurité, le fournisseur met des outils à disposition, mais c'est <b>toi</b> qui dois les configurer correctement — un point central du principe de responsabilité partagée.`
      ],
      keypoints: [`Scalabilité + libre-service + paiement à l'usage = souplesse économique.`, `Haute disponibilité = architecture pensée pour résister aux pannes.`, `Sécurité = outils du fournisseur <b>et</b> bonne configuration par le client.`],
      related: ['cloud-security', 'cloud-computing']
    },

    /* ------------------------------------------------------------------ */
    {
      id: 'modeles-deploiement', title: 'Cloud Deployment Models', added: '2026-11-08', tags: ['cloud', 'architecture'],
      summary: `<b>Public</b>, <b>Private</b> ou <b>Hybrid</b> : où tourne l'infrastructure et qui la partage.`,
      diagrams: [
        {
          type: 'tiles', title: 'Trois modèles', cols: 3,
          items: [
            { big: 'Public', title: 'Public Cloud', text: `Infrastructure <b>mutualisée</b> entre clients, avec isolation logique.`, extra: `Cas d'usage : startups, sites web, applications mondiales.`, c: 'b' },
            { big: 'Private', title: 'Private Cloud', text: `Environnement Cloud <b>dédié à une organisation</b>.`, extra: `Cas d'usage : besoins spécifiques de contrôle ou de conformité.`, c: 'v' },
            { big: 'Hybrid', title: 'Hybrid Cloud', text: `Combinaison d'environnements <b>publics et privés</b> qui interagissent.`, extra: `Cas d'usage : données sensibles en privé, capacité supplémentaire en public.`, c: 'g' }
          ]
        },
        {
          type: 'flow', title: 'Hybrid Cloud en pratique', colW: 240, rowH: 100,
          nodes: [
            { id: 'p', label: 'Données sensibles', sub: 'restent en privé', icon: 'lock', x: 0, y: 0.5, c: 'v' },
            { id: 'u', label: 'Capacité supplémentaire', sub: 'pics de charge en public', icon: 'cloud', x: 2, y: 0.5, c: 'b' }
          ],
          zones: [{ label: 'Private Cloud', nodes: ['p'], c: 'v' }, { label: 'Public Cloud', nodes: ['u'], c: 'b' }],
          edges: [{ from: 'p', to: 'u', label: 'interagissent', c: 'g', anim: true, bi: true }]
        }
      ],
      explain: [
        `Dans le <b>public cloud</b>, plusieurs clients partagent la même infrastructure physique, séparés par une <b>isolation logique</b>. Le <b>private cloud</b> est réservé à une seule organisation, utile quand on exige plus de contrôle ou de conformité. L'<b>hybride</b> combine les deux : on garde les données sensibles en privé et on « déborde » dans le public quand il faut de la capacité.`
      ],
      keypoints: [`Public = mutualisé · Private = dédié · Hybrid = les deux qui coopèrent.`, `Choix guidé par <b>contrôle, conformité, coût et besoin de capacité</b>.`],
      related: ['modeles-service', 'cloud-computing']
    },

    /* ------------------------------------------------------------------ */
    {
      id: 'modeles-service', title: 'Cloud Service Models : IaaS, PaaS, SaaS', added: '2026-11-08', tags: ['cloud', 'iaas', 'paas', 'saas'],
      summary: `Trois niveaux de service qui déterminent <b>ce que le fournisseur gère</b> et ce qui reste à ta charge.`,
      diagrams: [{
        type: 'matrix', title: 'Qui gère quoi ?', corner: 'Couche',
        head: [{ name: 'IaaS', sub: 'Amazon EC2' }, { name: 'PaaS', sub: 'Azure App Service, Google App Engine' }, { name: 'SaaS', sub: 'Gmail, Zoom' }],
        legend: { c: 'TOI (client)', p: 'FOURNISSEUR' },
        rows: [
          { label: 'Application', cells: ['c', 'c', 'p'], notes: { 1: 'ton code', 2: 'tu l\'utilises' } },
          { label: 'Données', cells: ['c', 'c', 'c'], notes: { 2: 'selon le service' } },
          { label: 'Environnement d\'exécution', cells: ['c', 'p', 'p'] },
          { label: 'Système d\'exploitation', cells: ['c', 'p', 'p'] },
          { label: 'Infra : calcul, stockage, réseau, matériel', cells: ['p', 'p', 'p'] }
        ],
        caption: `La répartition exacte <b>dépend du service et du fournisseur</b> ; ce tableau donne le repère général.`
      }],
      explain: [
        `<b>IaaS</b> (Infrastructure as a Service) : le fournisseur te donne l'infrastructure (calcul, stockage, réseau, matériel) ; toi tu gères l'OS, les applications, les données et les configurations.`,
        `<b>PaaS</b> (Platform as a Service) : il fournit aussi l'OS et l'environnement d'exécution ; toi tu apportes ton <b>code applicatif</b> et tes données.`,
        `<b>SaaS</b> (Software as a Service) : une application complète accessible en ligne ; tu gères l'utilisation, les comptes et les données selon le service.`,
        `<b>Repère :</b> IaaS = tu gères davantage · PaaS = tu développes et déploies · SaaS = tu utilises le logiciel.`
      ],
      table: {
        title: 'RÉCAPITULATIF', head: ['Modèle', 'Fourni par le prestataire', 'Responsabilité du client', 'Exemple'],
        rows: [
          ['IaaS', 'Infrastructure : calcul, stockage, réseau, matériel.', 'OS, applications, données et configurations.', 'Amazon EC2'],
          ['PaaS', 'Infrastructure, OS et environnement d\'exécution.', 'Code applicatif et données.', 'Azure App Service, Google App Engine'],
          ['SaaS', 'Application complète accessible en ligne.', 'Utilisation, comptes et données selon le service.', 'Gmail, Zoom']
        ]
      },
      example: {
        title: 'scénario — héberger un site web selon le modèle', lang: 'text',
        code: `IaaS → tu loues une VM (EC2) : tu installes l'OS à jour, nginx, ton code, tes règles réseau.
PaaS → tu "pousses" ton code : la plateforme gère l'OS, le runtime et le déploiement.
SaaS → tu n'héberges rien : tu utilises un outil déjà prêt (messagerie, visio…).`
      },
      keypoints: [`<b>IaaS</b> = infra · <b>PaaS</b> = plateforme · <b>SaaS</b> = logiciel prêt à l'emploi.`, `Plus on monte vers SaaS, moins on gère — mais moins on contrôle.`, `Les <b>données</b> et les <b>accès</b> restent toujours ta responsabilité.`],
      related: ['ec2', 'cloud-security']
    },

    /* ------------------------------------------------------------------ */
    {
      id: 'ec2', title: 'Amazon EC2', added: '2026-11-08', tags: ['aws', 'iaas', 'ec2'],
      summary: `<b>EC2</b> (Elastic Compute Cloud) permet de créer et d'exécuter des <b>serveurs virtuels</b> appelés <b>instances</b> dans AWS.`,
      diagrams: [{
        type: 'steps', title: 'Lancer un serveur web sur EC2', c: 'a',
        items: [
          { title: 'Choisir', text: `système, calcul, mémoire, stockage, réseau` },
          { title: 'Lancer l\'instance', text: `par ex. Linux Ubuntu` },
          { title: 'Installer un serveur web', text: `nginx, Apache…` },
          { title: 'Règles réseau', text: `autoriser <b>uniquement</b> le trafic nécessaire` }
        ]
      }],
      explain: [
        `Une <b>instance</b> est une VM dans le cloud AWS. Tu choisis son système d'exploitation, sa puissance de calcul, sa mémoire, son stockage et ses paramètres réseau, puis tu peux les adapter selon tes besoins et la tarification.`,
        `<b>Exemple du cours :</b> lancer une instance Linux Ubuntu, y installer un serveur web et configurer les règles réseau (<b>Security Group</b>) pour n'autoriser que le trafic nécessaire — par exemple HTTP/HTTPS pour tous, SSH seulement depuis ton adresse IP.`
      ],
      example: {
        title: 'terminal — lancer et ouvrir une instance (AWS CLI, valeurs à remplacer)', lang: 'bash',
        code: `$ aws ec2 run-instances --image-id ami-xxxxxxxx --instance-type t3.micro \\
    --key-name ma-cle --security-group-ids sg-xxxxxxxx
$ ssh -i ma-cle.pem ubuntu@<ip-publique>
$ sudo apt update && sudo apt install -y nginx
$ aws ec2 authorize-security-group-ingress --group-id sg-xxxxxxxx \\
    --protocol tcp --port 443 --cidr 0.0.0.0/0
# n'ouvre que ce qui est nécessaire : ici HTTPS`,
        note: `<code>ami-…</code>, <code>sg-…</code> et la clé sont des <b>espaces réservés</b>. Pense à arrêter l'instance après tes tests pour éviter des frais.`
      },
      keypoints: [`EC2 = <b>serveurs virtuels</b> (instances) dans AWS — un exemple d'IaaS.`, `On choisit OS, CPU, RAM, stockage, réseau.`, `Les <b>Security Groups</b> décident du trafic autorisé : applique le moindre privilège.`],
      related: ['modeles-service', 'cloud-security']
    },

    /* ------------------------------------------------------------------ */
    {
      id: 'fournisseurs-cloud', title: 'Principaux fournisseurs Cloud', added: '2026-11-08', tags: ['cloud', 'aws', 'azure', 'gcp'],
      summary: `Six grands acteurs, chacun avec ses services phares.`,
      diagrams: [{
        type: 'tiles', title: 'Qui fait quoi ?', cols: 3,
        items: [
          { big: 'AWS', title: 'Amazon Web Services', text: `EC2, S3, IAM, Lambda, VPC, GuardDuty.`, c: 'a' },
          { big: 'Azure', title: 'Microsoft Azure', text: `Virtual Machines, Entra ID, Blob Storage, App Service.`, c: 'b' },
          { big: 'GCP', title: 'Google Cloud', text: `BigQuery, Google Kubernetes Engine, Vertex AI.`, c: 'g' },
          { big: 'Alibaba', title: 'Alibaba Cloud', text: `Services Cloud, présence importante en Asie.`, c: 'o' },
          { big: 'IBM', title: 'IBM Cloud', text: `Cloud d'entreprise, hybride et solutions IA.`, c: 'c' },
          { big: 'Oracle', title: 'Oracle Cloud', text: `Bases de données et applications d'entreprise.`, c: 'r' }
        ]
      }],
      explain: [
        `Les concepts (IaaS/PaaS/SaaS, IAM, réseau virtuel…) sont <b>les mêmes partout</b> ; seuls les noms changent. Apprendre AWS en profondeur te permet de te repérer vite sur Azure ou Google Cloud.`
      ],
      keypoints: [`AWS, Azure, Google Cloud = les trois grands.`, `Alibaba (Asie), IBM (hybride/IA) et Oracle (bases de données) complètent le paysage.`, `Même logique, vocabulaire différent.`],
      related: ['entreprises-cloud', 'ec2']
    },

    /* ------------------------------------------------------------------ */
    {
      id: 'entreprises-cloud', title: 'Utilisation du Cloud par les entreprises', added: '2026-11-08', tags: ['cloud', 'cas d\'usage'],
      summary: `Le cloud absorbe des charges très variables : streaming, musique, photos, e-commerce.`,
      diagrams: [{
        type: 'tiles', title: 'Exemples', cols: 4,
        items: [
          { title: 'Netflix', text: `Diffusion vidéo à grande échelle.`, c: 'r' }, { title: 'Spotify', text: `Services musicaux.`, c: 'g' },
          { title: 'Instagram', text: `Photos et vidéos.`, c: 'm' }, { title: 'Boutiques en ligne', text: `Absorber les pics de trafic pendant les promotions.`, c: 'a' }
        ]
      }],
      explain: [`Ces entreprises ont des besoins qui varient énormément dans la journée ou selon les événements : la scalabilité du cloud leur évite de dimensionner du matériel pour le pire moment. <i>Les architectures réelles peuvent combiner plusieurs fournisseurs et infrastructures.</i>`],
      keypoints: [`Charges variables → scalabilité du cloud.`, `Les architectures réelles sont souvent <b>multi-fournisseurs</b>.`],
      related: ['caracteristiques-cloud', 'fournisseurs-cloud']
    },

    /* ------------------------------------------------------------------ */
    {
      id: 'cloud-security', title: 'Cloud Security — notions à connaître', added: '2026-11-08', tags: ['cloud', 'sécurité', 'aws', 'iam'],
      summary: `Le fournisseur protège l'infrastructure ; <b>toi</b> tu protèges tes identités, tes données, tes configurations et tes applications.`,
      diagrams: [
        {
          type: 'flow', title: 'Principe de responsabilité partagée', colW: 190, rowH: 100,
          nodes: [
            { id: 'inf', label: 'Infrastructure Cloud', sub: 'matériel, datacenters,\nservices de base', icon: 'cloud', x: 0, y: 0.5, c: 'b' },
            { id: 'id', label: 'Identités', sub: 'comptes, rôles', icon: 'key', x: 2.4, y: 0, c: 'a' }, { id: 'da', label: 'Données', icon: 'db', x: 3.6, y: 0, c: 'a' },
            { id: 'co', label: 'Configurations', icon: 'gear', x: 2.4, y: 1, c: 'a' }, { id: 'ap', label: 'Applications', icon: 'file', x: 3.6, y: 1, c: 'a' }
          ],
          zones: [{ label: 'Fournisseur', nodes: ['inf'], c: 'b' }, { label: 'Client (toi)', nodes: ['id', 'da', 'co', 'ap'], c: 'a' }],
          edges: [{ from: 'inf', to: 'id', label: 'responsabilité\npartagée', c: 'g', bi: true, dashed: true }]
        },
        {
          type: 'tiles', title: 'Six services AWS à connaître', cols: 3,
          items: [
            { big: 'IAM', title: 'Identités & permissions', text: `Gérer les identités, rôles et permissions.`, c: 'a' },
            { big: 'VPC', title: 'Réseau virtuel', text: `Définir un réseau virtuel isolé dans le Cloud.`, c: 'b' },
            { big: 'SG', title: 'Security Groups', text: `Contrôler le trafic réseau autorisé vers et depuis les instances AWS.`, c: 'o' },
            { big: 'CloudTrail', title: 'Journalisation', text: `Enregistrer les activités et appels API AWS.`, c: 'c' },
            { big: 'GuardDuty', title: 'Détection', text: `Détecter des menaces à partir de signaux et journaux.`, c: 'r' },
            { big: 'Sec. Hub', title: 'Vue centralisée', text: `Centraliser et organiser les résultats de sécurité AWS.`, c: 'm' }
          ]
        }
      ],
      explain: [
        `La plupart des incidents cloud viennent de <b>mauvaises configurations</b> côté client (un stockage public par erreur, une clé d'accès exposée, un port ouvert à tout Internet), pas d'une faille de l'infrastructure du fournisseur.`,
        `Les six services ci-dessus forment un réflexe : <b>qui</b> a le droit (IAM), <b>où</b> ça tourne (VPC), <b>quel trafic</b> passe (Security Groups), <b>qui a fait quoi</b> (CloudTrail), <b>qu'est-ce qui est suspect</b> (GuardDuty), <b>le tout en un seul tableau</b> (Security Hub).`
      ],
      example: {
        title: 'IAM — une politique de moindre privilège (lecture seule sur un bucket)', lang: 'json',
        code: `{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Action": ["s3:GetObject"],
    "Resource": "arn:aws:s3:::mon-bucket-de-test/*"
  }]
}`,
        note: `Au lieu de donner « tous les droits », on n'autorise <b>qu'une action</b> sur <b>qu'une ressource</b> : c'est le <b>principe du moindre privilège</b>.`
      },
      warn: `Le fournisseur sécurise le cloud « lui-même » ; la sécurité de <b>ce que tu y mets</b> et de <b>comment tu le configures</b> t'appartient.`,
      keypoints: [`<b>Responsabilité partagée</b> : fournisseur = infrastructure ; client = identités, données, configurations, applications.`, `IAM · VPC · Security Groups · CloudTrail · GuardDuty · Security Hub.`, `Moindre privilège + journalisation + détection = base d'un cloud sûr.`],
      related: ['ec2', 'modeles-service']
    }
  ]
});
