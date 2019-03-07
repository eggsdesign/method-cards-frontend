const SANITY_PROJECT_ID = 'r1vilzq1'

const cardTemplate = (props) => {
  return (`
    <div class="card">

      <div class=card-text>
        <h2 class="card-title">${props.title}</h2>
        <p class="card-subtext">${props.subtitle}</p>
      </div>

      <div class="img-container">
        <img src="${props.imageUrl}" class="card-image">
      </div>

    </div>
  `)
}

// Define the sanity communication module we call 'client'
var client = window.SanityClient({
  projectId: SANITY_PROJECT_ID,
  dataset: 'production',
  useCdn: true
})


// Fetch all documents of type method. "..." means get all content in the method object. The following stuff makes sure we also fetch referenced files to get the image urls
var query = `*[_type=="method"]{
  ...,
  "imageUrl": image.asset->url}`


client
  .fetch(query) // Talk to server: request data based on query
  .then(renderCards) // Send received data into renderCards function
  .catch(()=>{ console.log("Error!") }) // ...but if data fetch fails, do this


// Function to handle card rendering
function renderCards (cardsData) {
  // Generate a container element to collect generated cards
  let cardList = document.createElement('div')
  cardList.classList.add("cards-container")

  // Step through all entries in the 'data' array, generate html-elements and append to cardList container element
  cardsData.map((dataEntry) => {
    cardList.innerHTML += cardTemplate(dataEntry)
  })

  // Add card container cardList to an element in the page
  document.getElementById('cards').append(cardList)
}
