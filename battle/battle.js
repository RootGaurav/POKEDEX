

document.addEventListener('DOMContentLoaded', () => {
    let pokemon1Select = document.getElementById('pokemon1-select');
    let pokemon2Select = document.getElementById('pokemon2-select');
    let startBattleButton = document.getElementById('start-battle');
    let moveSelectContainer1 = document.getElementById('move-select-container1');
    let moveSelectContainer2 = document.getElementById('move-select-container2');
    let pokemonMovesSelect1 = document.getElementById('pokemon-moves1');
    let pokemonMovesSelect2 = document.getElementById('pokemon-moves2');
    let attackButton1 = document.querySelector("#attack1");
    let attackButton2 = document.querySelector("#attack2");
    // Initial health for both pokemons
    let healthBar1 = document.querySelector('.health1');
    let healthBar2 = document.querySelector('.health2');
    populatePokemonSelect();
    let pokemon1;
    let pokemon2;
    let pokebody1;
    let pokebody2;
    
    let health1 = 100;
    let health2 = 100;
    



    // JavaScript: Fetching Pokémon data including images

    // Function to fetch Pokémon data and populate the UI
    async function fetchAndDisplayPokemon(pokemonUrl, elementId) {
        try {
            const response = await fetch(pokemonUrl);
            const pokemonData = await response.json();
            // Set the image source to the sprite URL
            document.querySelector(`#${elementId} .pokemon-sprite`).src = pokemonData.sprites.front_default;
            // Set the alt text to the Pokémon's name
            document.querySelector(`#${elementId} .pokemon-sprite`).alt = pokemonData.name;
            
            // ... (other UI updates like setting the name and initializing health)
        } catch (error) {
            console.error('Error fetching Pokémon data:', error);
        }
    }

    // // Start the battle and fetch data for the selected Pokémon
    // document.getElementById('start-battle').addEventListener('click', async () => {
    //     const pokemon1Url = document.getElementById('pokemon1-select').value;
    //     const pokemon2Url = document.getElementById('pokemon2-select').value;
    //     await fetchAndDisplayPokemon(pokemon1Url, 'pokemon1');
    //     await fetchAndDisplayPokemon(pokemon2Url, 'pokemon2');
    //     // ... (rest of the battle initialization code)

    // });


// Fetch and populate Pokémon select options
async function populatePokemonSelect() {
    try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
        const data = await response.json();
        const pokemonList = data.results;
        pokemonList.forEach(pokemon => {
            const option1 = new Option(pokemon.name, pokemon.url);
            const option2 = new Option(pokemon.name, pokemon.url);
            pokemon1Select.add(option1);
            pokemon2Select.add(option2);
        });
    } catch (error) {
        console.error('Error fetching Pokémon list:', error);
    }
}

// Start the battle and fetch data for the selected Pokémon
startBattleButton.addEventListener('click', async () => {
    const pokemon1Url = pokemon1Select.value;
    const pokemon2Url = pokemon2Select.value;
    const pokemon1Data = await fetch(pokemon1Url).then(res => res.json());
    const pokemon2Data = await fetch(pokemon2Url).then(res => res.json());
    // Initialize the battle UI with Pokémon sprites and health bars
    document.querySelector('#pokemon1 .pokemon-sprite').src = pokemon1Data.sprites.other.showdown.front_default;
    document.querySelector('#pokemon2 .pokemon-sprite').src = pokemon2Data.sprites.other.showdown.front_default;
    pokemonMovesSelect1.innerHTML='';
    pokemonMovesSelect2.innerHTML='';
    pokebody1 = pokemon1Data.sprites.other.dream_world.front_default;
    pokebody2 = pokemon2Data.sprites.other.dream_world.front_default;
    console.log(pokebody1);
    // Populate moves for the selected Pokémon
    pokemon1Data.moves.forEach(move => {
        const moveOption = new Option(move.move.name, move.move.url);
        pokemonMovesSelect1.add(moveOption);
    });
    pokemon2Data.moves.forEach(move => {
        const moveOption = new Option(move.move.name, move.move.url);
        pokemonMovesSelect2.add(moveOption);
    });
    pokemon1=pokemon1Data.name;
    pokemon2=pokemon2Data.name;
    

// Initialize health bar
healthBar1.style.width = 100 + '%'; // Update
healthBar2.style.width = 100 + '%'; // Update


//initializing hp
let hp1 = document.querySelector('#hp1');
hp1.innerHTML = 100 + '%'; 
hp1.style.color='white';
let hp2 = document.querySelector('#hp2');
hp2.innerHTML = 100 + '%'; 
hp2.style.color='white';

//hiding prev winner
let winner=document.getElementById("winnerdiv");
winner.style.zIndex=-4;

//enabling buttons
document.getElementById("attack1").disabled = false;
document.getElementById("attack2").disabled = false;


//restoring health
health1=100;
health2=100;
});



// Handle attack button click
// attackButton1.addEventListener('click', async () => {
//     const moveUrl = pokemonMovesSelect1.value;
//     const moveData = await fetch(moveUrl).then(res => res.json());
//     // Perform the move and animate
//     console.log(moveData);


// });




// Add event listeners to the attack buttons
attackButton1.addEventListener('click', function () {
    const intensity = Math.floor(Math.random() * 21) + 10;
    health2 -= intensity; // Decrease health by 10%
    if (health2 <= 0)
        {
            health2= 0; // Ensure health doesn't go below 0%
            let winner=document.getElementById("winnerdiv");
            document.getElementById("winner").innerHTML=`${pokemon1} WINS !!!`;
            document.getElementById("attack1").disabled = true;
            document.getElementById("attack2").disabled = true;
            document.getElementById("winner").style.color="#09c7fb";
            document.getElementById("winimage").src = pokebody1;
            winner.style.zIndex=4;

            
        }
     // Ensure health doesn't go below 0%
    let healthBar2 = document.querySelector('.health2');
    healthBar2.style.width = health2 + '%'; // Update

    let hp2 = document.querySelector('#hp2');
    hp2.innerHTML = health2 + '%'; 
    if(health2<30) hp2.style.color='RED';
    // Update
    
    document.getElementById("pokemon2").classList.add('shake');
setTimeout(() => {
    document.getElementById("pokemon2").classList.remove('shake');
}, 500);
    
});




attackButton2.addEventListener('click', function () {
    const intensity = Math.floor(Math.random() * 21) + 10;
    health1 -= intensity;     
    if (health1 <= 0)
        {
            health1 = 0; // Ensure health doesn't go below 0%
            let winner=document.getElementById("winnerdiv");
            document.getElementById("winner").style.color="#93fb9d";
            document.getElementById("winner").innerHTML=`${pokemon2} WINS !!!`;
            document.getElementById("winimage").src = pokebody2;
            document.getElementById("attack1").disabled = true;
            document.getElementById("attack2").disabled = true;
            winner.style.zIndex=4;
            
        }
    let healthBar1 = document.querySelector('.health1');
    healthBar1.style.width = health1+ '%'; // Update

    let hp1 = document.querySelector('#hp1');
    hp1.innerHTML = health1 + '%';
    if(health1<30) hp1.style.color='RED';

    document.getElementById("pokemon1").classList.add('shake');
setTimeout(() => {
    document.getElementById("pokemon1").classList.remove('shake');
}, 500);
});




function updateHealthBar(currentHealth) {
    const healthBar1 = document.querySelector('#pokemon2 .health1');
    if(healthBar1)
    healthBar1.style.width = currentHealth + '%';
    const healthBar2 = document.querySelector('#pokemon2 .health2');
    if(healthBar2)
    healthBar2.style.width = currentHealth + '%';

}


});

// Function to decrease health


const defenderId = 'pokemon2'; // Assuming Pokémon 2 is the defender
const defenderHealth = 50; // Example health value
// Update health bars and display messages
// ...
// Animate the attack (e.g., shake the defender)
document.getElementById(defenderId).classList.add('shake');
setTimeout(() => {
    document.getElementById(defenderId).classList.remove('shake');
}, 500);

//     // JavaScript: Function to populate moves with tooltips

// // Function to fetch and display moves with information on hover
// async function fetchAndDisplayMoves(pokemonUrl, movesSelectElement) {
//     try {
//         const response = await fetch(pokemonUrl);
//         const pokemonData = await response.json();
//         // Clear existing options
//         movesSelectElement.innerHTML = '';
//         // Populate moves with tooltips
//         for (const move of pokemonData.moves) {
//             const moveResponse = await fetch(move.move.url);
//             const moveData = await moveResponse.json();
//             // Create an option element with the move name and information tooltip
//             const moveOption = new Option(move.move.name, move.move.url);
//             moveOption.title = `Type: ${moveData.type.name}, Power: ${moveData.power}, PP: ${moveData.pp}, Accuracy: ${moveData.accuracy}`;
//             movesSelectElement.add(moveOption);
//         }
//     } catch (error) {
//         console.error('Error fetching moves:', error);
//     }
// }

// // Example usage:
// // Assuming you have a select element for moves
// const movesSelectElement = document.getElementById('pokemon-moves');
// const pokemonUrl = 'https://pokeapi.co/api/v2/pokemon/1/'; // Replace with the actual URL
// fetchAndDisplayMoves(pokemonUrl, movesSelectElement);

