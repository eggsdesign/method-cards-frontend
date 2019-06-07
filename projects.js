let GLOBALS = {
  favorites: [],
  savedProjects: [],
}

const ProjectHandler = {
  saveProjects: (name) => {
    let stringified = JSON.stringify(GLOBALS.savedProjects);
    window.localStorage.setItem('method-cards-projects', stringified);
  },

  getProjectsFromStorage: () => {
    let projects = window.localStorage.getItem('method-cards-projects')
    GLOBALS.savedProjects = JSON.parse(projects);
    return JSON.parse(projects)
  },

  getGLOBALS: () => {
    return GLOBALS
  },

  addAsFavorite: (id) => {
    if (GLOBALS.favorites.indexOf(id) >= 0) {
      return 'Card already added to project';
    }

    GLOBALS.favorites.push(id)
    return 'Added card to project';
  },

  removeFavorite: (title, id) => {
    GLOBALS.favorites = GLOBALS.favorites.filter(item => {
      return item !== id
    });
    return `Removed ${title} from project`;
  },

  saveFavoritesAsProject: (projectName) => {
    let tmpObj = {
      _id: `0${GLOBALS.savedProjects.length}`,
      name: projectName,
      cards: GLOBALS.favorites
    }
    GLOBALS.savedProjects.push(tmpObj);
    ProjectHandler.saveProjects(tmpObj.name)
    return GLOBALS.savedProjects;
  },

  clearFavorites: () => {
    GLOBALS.favorites = [];
    return 'Cards cleared from working project';
  },

  deleteProject: () => {
    // TODO
  },

  loadProject: (title) => {
    let result = GLOBALS.savedProjects.filter(i => {
      return i.name === title
    });
    if (result.length <= 0) {
      return false
    }
    GLOBALS.favorites = result[0].cards;

    return true;
  },
}

export default ProjectHandler;
