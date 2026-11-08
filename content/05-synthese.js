GUIDE.addModule({
  id: 'synthese', num: '05', title: 'Synthèse & Prochaine étape', icon: '✓', color: 'm',
  tagline: `Les termes essentiels en un coup d'œil, puis la suite du parcours : les systèmes d'exploitation.`,
  concepts: [

    {
      id: 'glossaire', type: 'glossary', title: 'Glossaire essentiel', added: '2026-11-08', tags: ['révision', 'glossaire'],
      summary: `Tous les termes clés du guide, avec une définition courte et un lien vers le concept détaillé. Utilise le filtre pour retrouver un mot.`,
      keypoints: [`Relis le glossaire avant un entretien ou un examen : si tu peux expliquer chaque terme avec tes mots, tu as les bases.`, `Tu peux ajouter tes propres termes dans <code>content/glossary.js</code>.`]
    },

    {
      id: 'operating-systems', title: 'Prochaine étape : Operating Systems', added: '2026-11-08', tags: ['os', 'linux', 'révision'],
      summary: `Un <b>Operating System (OS)</b> gère le matériel et fournit les services nécessaires aux applications. C'est la brique suivante du parcours TryHackMe.`,
      diagrams: [{
        type: 'hub', title: 'Les 6 notions à étudier', center: 'OPERATING\nSYSTEM', c: 'm',
        spokes: [
          { label: 'Kernel', sub: 'cœur du système', c: 'c' }, { label: 'Processes', sub: 'programmes en exécution', c: 'g' }, { label: 'Memory Management', sub: 'gestion de la mémoire', c: 'a' },
          { label: 'File System', sub: 'organisation des fichiers', c: 'v' }, { label: 'Users & Permissions', sub: 'comptes et droits', c: 'b' }, { label: 'System Security', sub: 'protection du système', c: 'r' }
        ]
      }],
      explain: [
        `L'OS est l'intermédiaire entre le matériel et les applications : il lance les <b>processus</b>, distribue la <b>mémoire</b>, organise les <b>fichiers</b>, contrôle les <b>utilisateurs et leurs permissions</b> et protège le système. Le <b>noyau (kernel)</b> en est le cœur — et c'est ce que les conteneurs partagent avec leur hôte.`,
        `<b>Module TryHackMe :</b> « Operating Systems Introduction ».`,
        `<b>Conseil de révision :</b> maîtrise les échanges client-serveur, les ports et DNS, HTTP et les sessions, les différences VM/conteneur, puis les modèles IaaS/PaaS/SaaS et les bases de la sécurité AWS. Ces fondations sont utiles pour les <b>labs réseau, SOC, pentesting et Cloud Security</b>.`
      ],
      example: {
        title: 'terminal Linux — un premier regard sur chaque notion', lang: 'bash',
        code: `$ uname -a            # kernel : version du noyau
$ ps aux | head       # processes : programmes en cours
$ free -h             # memory management : RAM utilisée
$ ls -l /etc          # file system + permissions
$ id                  # users & permissions : qui suis-je ?`,
        note: `Essaie-les dans ta VM Ubuntu/Kali : chaque commande illustre une des six notions du schéma.`
      },
      keypoints: [`OS = kernel, processus, mémoire, fichiers, utilisateurs & permissions, sécurité système.`, `Prochain module TryHackMe : <b>Operating Systems Introduction</b>.`, `Fondations → labs réseau, SOC, pentesting, Cloud Security.`],
      related: ['vm-vs-container', 'lab-cyber']
    }
  ]
});
