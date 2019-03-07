const cardTemplate = (props) => {
  return (`
      <div class="card">
        <div class=card-text>
            <h2 class="card-title">${props.title}</h2>
            <p class="card-subtext">${props.subtext}</p>
        </div>
        <div class="img-container">
            <img src="${props.imgurl}" class="card-image">
         </div>
    </div>
      `)
}

// Our hand made data array. Could also be data from third party or whatever.
const data = [
  {
    title: "Kick-off workshop",
    subtext: "Share insights, define goals",
    imgurl: "https://images.unsplash.com/flagged/photo-1550946107-8842ae9426db?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=667&q=80 667w"
  },
  {
    title: "Observation",
    subtext: "Visualize and understand the service from a user's perspective",
    imgurl: "https://images.unsplash.com/photo-1417577354685-3ab67e9716a3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=751&q=80 751w"
  },
]

// Generate a container element to collect generated cards
let cardList = document.createElement('div')
cardList.classList.add("cards-container")

// Step through all entries in the 'data' array, generate html-elements and append to cardList container element
data.map((dataEntry) => {
  cardList.innerHTML += cardTemplate(dataEntry)
})

// Add card container cardList to an element in the page
document.getElementById('cards').append(cardList)