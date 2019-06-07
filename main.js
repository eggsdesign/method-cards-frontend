import blocksToHtml from '@sanity/block-content-to-html'
const SANITY_PROJECT_ID = 'r1vilzq1'
import ProjectHandler from './projects.js'

// SERVER COMMUNICATION -------------------------------------------------------------

// Define the sanity communication module we call 'client'
var client = window.SanityClient({
  projectId: SANITY_PROJECT_ID,
  dataset: 'production',
  useCdn: true
})


// Fetch all documents of type method. "..." means get all content in the method object. The following stuff makes sure we also fetch referenced files to get the image urls
var query = `*[_type=="method"]{
  ...,
  "imageUrl": image.asset->url,
  "phase": phase->phaseTitle
}`


client
  .fetch(query) // Talk to server: request data based on query
  .then(renderPageContent) // Send received data into renderCards function
  .catch(()=>{ console.log("Error!") }) // ...but if data fetch fails, do this

let GLOBALS = {
  cards: [],
  phases: ['All'],
  activePhaseFilter: 'All',
}

function renderPageContent(cardsData) {
  createGlobals(cardsData)
  renderFilter()
  renderCards(cardsData)
  renderDetailsPages(cardsData)
  renderSavedProjectsDropdown(ProjectHandler.getGLOBALS().savedProjects)
  addSaveProjectButton()
  addClearProjectButton()
}

// END of SERVER COMMUNICATION ---------------------------------------------------------

// Some setup

function createGlobals(cardsData) {
  GLOBALS.cards = cardsData
  GLOBALS.cards.map(card => {
    if (GLOBALS.phases.indexOf(card.phase) < 0) {
      GLOBALS.phases.push(card.phase)
    }
  })
}

// PAGE RENDERING ----------------------------------------------------------------------
function renderFavorites() {
  let projectElement = document.getElementById('favorites')
  // Get favoritted cards from all cards
  let favorites = ProjectHandler.getGLOBALS().favorites;
  let addedCards = GLOBALS.cards.filter(card => {
    return favorites.includes(card._id)
  });
  console.log(addedCards);

  // Remove elements from html
  while (projectElement.firstChild) {
    projectElement.removeChild(projectElement.firstChild);
  }

  // Create elements
  addedCards.map(card => {
    let item = document.createElement('li');
    item.innerHTML = card.title;
    item.dataset['id'] = card._id;
    let itemRemove = document.createElement('i');
    item.append(itemRemove);
    itemRemove.innerHTML = "\u24b3";
    itemRemove.addEventListener('click', () => {
      ProjectHandler.removeFavorite(card.title, card._id);
      renderFavorites()
    });
    projectElement.append(item);
  });
}

function addSaveProjectButton() {
  let button = document.getElementById('saveProject');
  button.addEventListener('mousedown', () => {
    let name = null
    if (ProjectHandler.getGLOBALS().favorites.length > 0) {
      name = prompt('Enter project name')
    } else {
      showUserMessage('No cards added to project', 'warning')
      return
    }
    if (name !== null && name.length > 0) {
      renderSavedProjectsDropdown(ProjectHandler.saveFavoritesAsProject(name))
    } else {
      showUserMessage('Project needs a name, try again', 'warning')
    }
  }, false)
}

function addClearProjectButton() {
  let button = document.getElementById('clearProject');
  button.addEventListener('mousedown', () => {
    ProjectHandler.clearFavorites();
    renderFavorites();
  });
}

const projectTemplate = (props) => {
  return (`
    <option data-title="${props}">
      ${props}
    </option>
  `)
}

function renderSavedProjectsDropdown(savedProjects) {
  let container = document.getElementById('projects');

  // Remove elements from html
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }

  let projectsSelect = document.createElement('select');
  projectsSelect.classList.add('project-container');

  let emptyOption = document.createElement('option');
  emptyOption.classList.add('project-button')
  emptyOption.innerHTML = projectTemplate('Projects')
  projectsSelect.append(emptyOption)

  savedProjects.map(project => {
    let option = document.createElement('option');
    option.classList.add('project-button')
    option.setAttribute('value', project.name);
    option.innerHTML = projectTemplate(project.name)
    projectsSelect.append(option)
  })

  projectsSelect.addEventListener('change', loadProject)
  document.getElementById('projects').append(projectsSelect)
}

function loadProject(event) {
  if (ProjectHandler.loadProject(event.target.value)) {
    renderFavorites();
  }
}

const filterTemplate = (props) => {
  return (`
    <option data-phase="${props}">
      ${props}
    </option>
  `)
}

function renderFilter() {
  let filter = document.createElement('select')
  filter.classList.add('filter-container')
  GLOBALS.phases.map(phase => {
    let option = document.createElement('option');
    option.classList.add('filter-button')
    option.setAttribute('value', phase);
    option.innerHTML = filterTemplate(phase)
    filter.append(option)
  })
  filter.addEventListener('change', setPhaseFilter)
  document.getElementById('filter').append(filter)
}

function setPhaseFilter(event) {
  if (event.target.value === GLOBALS.activePhaseFilter) return
  GLOBALS.activePhaseFilter = event.target.value

  // Remove cards before adding new
  var cardsContainer = document.getElementById('cards');
  while (cardsContainer.firstChild) {
    cardsContainer.removeChild(cardsContainer.firstChild);
  }

  if (GLOBALS.activePhaseFilter === 'All') {
    renderCards(GLOBALS.cards)
  } else {
    let filteredCards = GLOBALS.cards.filter(card => {
      return card.phase === GLOBALS.activePhaseFilter
    })
    GLOBALS.filteredCards = filteredCards
    renderCards(GLOBALS.filteredCards)
  }

}

const cardTemplate = (props) => {
  return (`
    <div class=card-text>
      <span class="card-phase">${props.phase}</span>
      <h2 class="card-title">${props.title}</h2>
      <p class="card-subtext">${props.subtitle}</p>
    </div>

    <div class="img-container">
      <img src="${props.imageUrl}?h=500" class="card-image">
    </div>
  `)
}


// Function to handle card rendering
function renderCards (cardsData) {
  // Generate a container element to collect generated cards
  let cardList = document.createElement('div')
  cardList.classList.add("cards-container")

  // Step through all entries in the 'data' array, generate html-elements and append to cardList container element
  cardsData.map((dataEntry, key) => {
    let card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = cardTemplate(dataEntry);
    card.dataset['key'] = key;
    card.dataset['hash'] = dataEntry._id;

    let favBtn = document.createElement('button');
    favBtn.innerHTML = 'Add to project';
    favBtn.dataset['id'] = dataEntry._id;
    card.append(favBtn);

    cardList.append(card);

    // Handle clicks on cards
    card.addEventListener('click', (event) => {
      window.location.hash = dataEntry._id;
      document.body.style.overflow = 'hidden';
    });

    favBtn.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      let result = ProjectHandler.addAsFavorite(event.target.dataset['id']);
      showUserMessage(result);
      renderFavorites();
    });
  })

  // Add card container cardList to an element in the page
  document.getElementById('cards').append(cardList)
}

// -- MESSAGES

function showUserMessage(message, level) {
  let container = document.getElementById('userMessage');
  let colorClass = level || 'neutral';
  container.classList.add('show');
  container.classList.add(colorClass);

  window.setTimeout(() => {
    container.innerHTML = message;
    window.setTimeout(() => {
      container.classList.remove('show')
      container.classList.remove(colorClass)
      container.innerHTML = '';
    }, 2000);
  }, 300);
}

window.addEventListener('keyup', event => {
  if (!window.location.hash) return false

  let cardList = (GLOBALS.activePhaseFilter !== 'All')? GLOBALS.filteredCards : GLOBALS.cards
  let currentId = window.location.hash.substr(1)
  let currentCard = document.querySelectorAll(`[data-hash='${currentId}']`)[0]
  let currentKey = parseInt(currentCard.dataset['key'])
  let previous, next

  if (currentKey === 0) {
    previous = cardList.length - 1
    next = currentKey + 1
  } else if (currentKey === cardList.length - 1) {
    previous = currentKey - 1
    next = 0
  } else {
    previous = currentKey - 1
    next = currentKey + 1
  }

  for (let page of Object.entries(window.methodDetailsPages)){
    page[1].hidden = true
  }

  switch (event.which) {
    case 39:
      window.location.hash = cardList[next]._id
      // Next card
      break
    case 37:
      window.location.hash = cardList[previous]._id
      // Previous card
      break
  }
})

// Card details pages
const cardDetailsPageTemplate = (props) => {
  const description = blocksToHtml({
    blocks: props.description
  })

  const instruction = blocksToHtml({
    blocks: props.instruction
  })

  // These elements are injected into a div.method-page in the renderDetailsPages() function
  return (`
    <div class="method-page-inner">
      <span>${props.phase}</span>
      <h1>${props.title}</h1>
      <p>${props.subtitle}</p>
      <div>
        <h2>When to use it</h2>
        ${description}
      </div>
      <div>
        <h2>How to use it</h2>
        ${instruction}
      </div>
      <div class="img-container">
        <img src="${props.imageUrl}?h=500" class="card-image">
      </div>
    </div>
  `)
}


// Function to handle card rendering
function renderDetailsPages (cardsData) {
  let pageContainer = document.getElementById('page-container')
  window.methodDetailsPages = {}

  cardsData.map((cardData) => {
    let cardPage = document.createElement('div')
    cardPage.classList.add('method-page')
    cardPage.innerHTML = cardDetailsPageTemplate(cardData)
    cardPage.hidden = true

    pageContainer.append(cardPage)

    // Add the card page to globally available object attached to window object
    window.methodDetailsPages[cardData._id] = cardPage
  })

  pageContainer.hidden = true
}


// When deselecting a page, ie clicking outside of the modal, hide the overlay
document.getElementById('page-container').addEventListener('click', (e)=>{
  document.body.style.overflow = 'auto';
  if (e.path[0].id == 'page-container'){
    document.getElementById('page-container').hidden = true

    for (let page of Object.entries(window.methodDetailsPages)){
      page[1].hidden = true
    }

    history.replaceState(null, null, ' ');
  }
})


// Show the proper page when url changes (this is what makes tha modal appear)
window.addEventListener('hashchange', ()=>{
  document.getElementById('page-container').hidden = false
  let pageId = window.location.hash.substring(1)
  window.methodDetailsPages[pageId].hidden = false
})

// END of PAGE RENDERING -----------------------------------------------------------------
