let GLOBALS = {
  favorites: [],
  savedProjects: [],
}

const ProjectHandler = {
  test: () => {
    console.log('O.K.')
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
    console.log(GLOBALS.favorites)
    GLOBALS.favorites = GLOBALS.favorites.filter(item => {
      return item !== id
    });
    console.log(GLOBALS.favorites)
    return `Removed ${title} from project`;
  },

  saveFavoritesAsProject: (projectName) => {
    let tmpObj = {
      _id: `0${GLOBALS.savedProjects.length}`,
      name: projectName,
      cards: GLOBALS.favorites
    }
    GLOBALS.savedProjects.push(tmpObj);
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
