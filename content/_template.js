/*
  MODÈLE — copie ce fichier en content/06-mon-module.js, change les champs,
  puis ajoute 'content/06-mon-module.js' dans content/manifest.js.

  Pour ajouter un concept à un module EXISTANT : copie un bloc { id: …, … }
  dans le tableau `concepts` du module voulu. C'est tout.
*/
GUIDE.addModule({
  id: 'mon-module',          // unique, sans espace
  num: '06',                 // ordre d'affichage
  title: 'Mon nouveau module',
  icon: '⚡',
  color: 'c',                // g=vert c=cyan m=magenta a=ambre v=violet r=rouge b=bleu o=orange (ou '#hex')
  tagline: `Une phrase qui résume le module.`,
  concepts: [
    {
      id: 'mon-concept',            // unique dans tout le site (sert dans l'URL #/c/mon-concept)
      title: 'Mon concept',
      added: '2026-12-01',          // la date alimente « Ajoutés récemment » sur l'accueil
      tags: ['tag1', 'tag2'],
      summary: `Définition courte. HTML autorisé : <b>gras</b>, <code>code</code>.`,

      // 1) un ou plusieurs schémas  (types : flow, sequence, hub, stack, matrix, tiles, bars, steps)
      diagrams: [{
        type: 'flow', title: 'Mon schéma',
        nodes: [
          { id: 'a', label: 'CLIENT', sub: 'navigateur', icon: 'monitor', x: 0, y: 0, c: 'c' },
          { id: 'b', label: 'SERVEUR', sub: 'service web', icon: 'server', x: 2, y: 0, c: 'g' }
        ],
        edges: [{ from: 'a', to: 'b', label: 'requête', c: 'c', anim: true }]
      }],

      // 2) explication : un paragraphe par élément
      explain: [`Premier paragraphe.`, `Deuxième paragraphe.`],

      // 3) exemple(s) — langages : bash (lignes "$ cmd", "# commentaire", "< sortie"), http, json, text
      example: {
        title: 'terminal — exemple', lang: 'bash',
        code: `$ echo "salut"
< salut`,
        note: `Remarque sous l'exemple.`
      },

      // 4) optionnel
      table: { title: 'TABLEAU', head: ['Col A', 'Col B'], rows: [['a1', 'b1']] },
      keypoints: [`Point clé 1`, `Point clé 2`],
      warn: `Mise en garde (affichée en rouge).`,
      related: ['dns', 'ports'],   // ids d'autres concepts
      sections: [{ title: 'Section libre', html: `<p>HTML libre.</p>` }]
    }
  ]
});
