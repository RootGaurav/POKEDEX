const MAX_POKEMON = 151;
let pokemooon = [];
const listWrapper = document.querySelector(".container");
// const searchInput = document.querySelector("#search-input");
// const numberFilter = document.querySelector("#number");
// const nameFilter = document.querySelector("#name");
// const notFoundMessage = document.querySelector("#not-found-message");

let allPokemons = [];


fetch(`https://pokeapi.co/api/v2/pokemon?limit=${MAX_POKEMON}`)
  .then((response) => response.json())
  .then((data) => {
    allPokemons = data.results;
    displayPokemons(allPokemons);
  });

async function fetchPokemonDataBeforeRedirect(id) {
  try {
    const [pokemon, pokemonSpecies] = await Promise.all([
      fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((res) =>
        res.json()
      ),
      fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`).then((res) =>
        res.json()
      ),
    ]);
    return true;
  } catch (error) {
    console.error("Failed to fetch Pokemon data before redirect");
  }
}

let body = document.querySelector("body");


async function getapi(url) {
  const ans =
    await fetch(url);
  return ans.json();
}


async function getalldata2(url) {
  const result = await getapi(url);
  return result['types'];


}


async function getalldata(allpokemon) {
  await allpokemon.forEach((poke) => {
    getalldata2(poke.url);
  });
}



function displayPokemons(allpokemon) {


  listWrapper.innerHTML = "";

  allpokemon.forEach((pokemon) => {

    const pokemonID = pokemon.url.split("/")[6];
    const listItem = document.createElement("div");
    listItem.className = "item";

    getalldata2(pokemon.url)
      .then((res) => {
        const poketype = res
        console.log(poketype)
        pokemooon.push(poketype)
        listItem.innerHTML = `

      
        <div class="image">
        <img src="https://raw.githubusercontent.com/pokeapi/sprites/master/sprites/pokemon/other/dream-world/${pokemonID}.svg" alt="${pokemon.name}" />
        </div>
        <div class="content1">
            <h2>${pokemon.name.toUpperCase()}</h2>
        </div>
        <div class="content2">
                <div class="dp">
                    <img src="images/pokemon-icon.png" alt="">
                </div>
                <div class="name${pokemonID} name">
                </div>
                    
        </div>
        </div>
    

    `;


        for (let i = 0; i < poketype.length; i++) {
          const na = document.createElement("div");
          na.className = "tag";
          na.innerHTML = `
    <div id="tagit">
      ${poketype[i]["type"]["name"]} 
    </div>
     `;

          document.querySelector(`.name${pokemonID}`).appendChild(na);
        }

      });




    listItem.addEventListener("click", async () => {
      const success = await fetchPokemonDataBeforeRedirect(pokemonID);
      if (success) {
        window.location.href = `./detail.html?id=${pokemonID}`;
      }
    });





    listWrapper.appendChild(listItem);
  });

}







