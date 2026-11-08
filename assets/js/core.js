/* CYBER//GUIDE — core registry. Les fichiers de /content s'enregistrent ici. */
window.GUIDE = {
  config: {},
  modules: [],
  glossary: [],
  addModule(m) { this.modules.push(m); },
  addGlossary(list) { this.glossary.push(...list); }
};
