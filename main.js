import blocksToHtml from '@sanity/block-content-to-html'
import { createInflateRaw } from 'zlib';
const SANITY_PROJECT_ID = 'r1vilzq1'


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
  activePhaseFilter: 'All'
}

function renderPageContent(cardsData) {
  createGlobals(cardsData)
  renderFilter()
  renderCards(cardsData)
  renderDetailsPages(cardsData)
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

const filterTemplate = (props) => {
  return (`
    <button data-phase="${props}">
      ${props}
    </button>
  `)
}

function renderFilter() {
  let filter = document.createElement('div')
  filter.classList.add('filter-container')
  GLOBALS.phases.map(phase => {
    let button = document.createElement('div');
    button.classList.add('filter-button')
    button.innerHTML = filterTemplate(phase)
    button.addEventListener('click', setPhaseFilter)
    filter.append(button)
  })
  document.getElementById('filter').append(filter)
}

function setPhaseFilter(event) {
  if (event.target.dataset['phase'] === GLOBALS.activePhaseFilter) return

  GLOBALS.activePhaseFilter = event.target.dataset['phase']

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
    let card = document.createElement('div')
    card.classList.add('card')
    card.innerHTML = cardTemplate(dataEntry)
    card.dataset['key'] = key
    card.dataset['hash'] = dataEntry._id
    cardList.append(card)

    // Handle clicks on cards
    card.addEventListener('click', (event)=>{
      window.location.hash = dataEntry._id
      document.body.style.overflow = 'hidden';
    })
  })

  // Add card container cardList to an element in the page
  document.getElementById('cards').append(cardList)
}

window.addEventListener('keyup', event => {
  if (!window.location.hash) return false

  let cardList = (GLOBALS.activePhaseFilter !== 'All')? GLOBALS.filteredCards : GLOBALS.cards
  console.log(cardList)
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

// ------------------


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
