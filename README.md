# CYBER//GUIDE

Guide interactif (style terminal « hacker ») : **chaque concept = un schéma + une explication + un exemple**.
Site 100 % statique : pas de build, pas de dépendance. Tu ajoutes du savoir en éditant de simples fichiers JavaScript.

## Lancer en local

Double-clique `index.html`, ou (recommandé) :

```bash
python3 -m http.server 8000      # puis ouvre http://localhost:8000
```

## Mettre en ligne sur GitHub Pages

```bash
git init && git add . && git commit -m "CYBER//GUIDE"
git branch -M main
git remote add origin https://github.com/<ton-user>/<ton-repo>.git
git push -u origin main
```

Puis sur GitHub : **Settings → Pages → Build and deployment → Source : Deploy from a branch → Branch : `main` / `(root)`**.
Le site est disponible sur `https://<ton-user>.github.io/<ton-repo>/` après ~1 minute. (Le fichier `.nojekyll` est déjà inclus.)

> Astuce : mets l'URL de ton dépôt dans `content/config.js` (`repoUrl`) pour afficher le lien « source » dans le menu.

## Ajouter du savoir

| Je veux…                         | Je fais…                                                                                      |
|----------------------------------|-----------------------------------------------------------------------------------------------|
| Ajouter un **concept**           | Copie un bloc `{ id: …, title: …, … }` dans le tableau `concepts` d'un fichier `content/0X-*.js` |
| Ajouter un **module**            | Copie `content/_template.js` → `content/06-mon-module.js`, puis ajoute son chemin dans `content/manifest.js` |
| Ajouter un **terme au glossaire**| Ajoute `{ term, def, link }` dans `content/glossary.js`                                       |
| Changer le nom / l'auteur        | `content/config.js`                                                                            |

Un concept est un objet : `id`, `title`, `added`, `tags`, `summary`, `diagrams`, `explain`, `example(s)`, `table`, `keypoints`, `warn`, `related`, `sections`.
Voir `content/_template.js` (commenté) et les modules existants comme exemples.

## Les schémas (champ `diagrams`)

Un concept peut avoir plusieurs schémas. Chacun a un `type` :

### `flow` — nœuds sur une grille + flèches
```js
{ type:'flow', title:'…', colW:210, rowH:104,
  nodes:[ { id:'a', label:'CLIENT', sub:'texte secondaire', icon:'monitor', x:0, y:0, c:'c' } ],   // x,y = colonne/ligne (décimaux OK)
  edges:[ { from:'a', to:'b', label:'1 · requête', c:'c', anim:true, dashed:false, bi:false, offset:0 } ],
  zones:[ { label:'Serveur', nodes:['b','c'], c:'g', pad:20 } ],                                    // cadres en pointillés
  caption:'légende (HTML autorisé)' }
```
`icon` : `monitor server db cloud lock unlock user shield key box skull gear file globe switch`.
`offset` décale une flèche (utile pour dessiner requête **et** réponse entre les mêmes nœuds). `\n` dans `label`/`sub` = retour à la ligne.

### `sequence` — échanges dans le temps
```js
{ type:'sequence', actors:[{id:'C',label:'CLIENT',icon:'monitor',c:'c'},{id:'S',label:'SERVEUR',c:'g'}],
  steps:[ {from:'C',to:'S',text:'GET /',sub:'REQUEST',c:'c'},
          {note:'texte dans un encadré', at:'S'}          // ou span:['C','S']
        ] }
```

### `hub` — un centre et des branches
```js
{ type:'hub', center:'CLOUD', spokes:[{label:'Calcul', sub:'…', c:'a'}, …] }
```

### `stack` — couches empilées (comparer des architectures)
```js
{ type:'stack', columns:[ { title:'VM', c:'b', layers:[ {row:[{label:'App'},{label:'App'}]}, {label:'Hyperviseur'} ], note:'…' } ] }
```

### `matrix` — tableau de responsabilités
```js
{ type:'matrix', head:[{name:'IaaS',sub:'EC2'}, …], legend:{c:'TOI',p:'FOURNISSEUR'},
  rows:[ {label:'OS', cells:['c','p','p'], notes:{2:'selon le service'}} ] }
```

### `tiles` — cartes (ports, méthodes, définitions…)
```js
{ type:'tiles', cols:4, items:[ {big:'443', title:'HTTPS', text:'…', extra:'…', tag:'TLS', c:'g'} ] }
```

### `bars` — barres de progression / comparaison
```js
{ type:'bars', items:[ {label:'Site web', value:12, text:'12 %', c:'r'} ] }
```

### `steps` — étapes numérotées
```js
{ type:'steps', c:'v', items:[ {title:'Ouvrir F12', text:'…'} ] }
```

### `svg` — ton propre SVG
```js
{ type:'svg', svg:'<svg viewBox="0 0 400 200">…</svg>' }
```

Couleurs (`c`) : `g` vert · `c` cyan · `m` magenta · `a` ambre · `v` violet · `r` rouge · `b` bleu · `o` orange · `w` gris · ou n'importe quel `#hex`.

## Les exemples (champ `example` / `examples`)

```js
example: { title:'terminal — …', lang:'bash', code:`$ commande
# commentaire
< sortie de la commande`, legend:[['mot','explication']], note:'remarque' }
```
`lang` : `bash` (colore `$ cmd`, `# commentaire`, `< sortie`), `http` (méthode, statut, en-têtes), `json`, `text`.
Le bouton **copier** ne copie que les commandes.

## Fonctions incluses

Recherche (`Ctrl+K` ou `/`) · navigation `←` `→` · suivi de progression (« marquer comme appris », stocké dans ton navigateur) · glossaire filtrable · « Ajoutés récemment » · responsive mobile · animation de démarrage (désactivable dans `config.js`).

## Structure

```
index.html
assets/css/style.css        thème
assets/js/core.js           registre GUIDE
assets/js/diagrams.js       moteur de schémas
assets/js/app.js            routeur, recherche, progression
content/config.js           réglages
content/manifest.js         liste des fichiers de contenu
content/0X-*.js             un fichier par module
content/glossary.js         glossaire
content/_template.js        modèle à copier
```
