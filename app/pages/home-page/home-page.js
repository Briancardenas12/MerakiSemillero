import { CellsPage } from '@cells/cells-page';
import { html, css } from 'lit-element';
import '@cells-demo/demo-app-template/demo-app-template.js';
import '@bbva-web-components/bbva-web-link/bbva-web-link.js'; //Componentes externos
import '@bbva-experience-components/bbva-button-default/bbva-button-default.js';

class HomePage extends CellsPage {
  static get is() {
    return 'home-page';
  }
  static get properties() {
    return {
      title: { type: String },
      company: { type: String },
      pokemonList: { type: Array },
    };
  }

  static get styles() {
    return css`
      .container {
        padding: 16px;
        background-image: url('https://example.com/your-background-image.jpg'); /* Reemplaza con la URL de tu imagen de fondo */
        background-size: cover;
        background-position: center;
      }
      .pokemon-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin: 16px 0;
      }
      .pokemon-card {
        width: 100%;
        max-width: 400px;
        margin-bottom: 16px;
        background-color: #f3f3f3; /* Color de fondo de la tarjeta */
        border: 1px solid #ccc; /* Borde de la tarjeta */
        border-radius: 8px; /* Bordes redondeados */
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Sombra de la tarjeta */
        overflow: hidden;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 16px;
      }
      .pokemon-image {
        width: 120px;
        height: 120px;
        margin-bottom: 16px;
      }
      .pokemon-name {
        font-size: 1.2em;
        font-weight: bold;
        margin-bottom: 8px;
      }
      .pokemon-weight {
        margin-bottom: 8px;
      }
      .pokemon-type span {
        margin-right: 8px;
        background-color: #ffeb3b; /* Color de fondo del tipo de Pokémon */
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 0.9em;
      }
      .evolutions-button {
        margin-top: 8px;
      }
      h3 {
        color: #333;
        text-align: center;
      }
    `;
  }

  constructor() {
    super();
    this.title = 'Taller 1 Páginas Declarativas';
    this.pokemonList = [];
    this.fetchPokemonData();
  }

  async fetchPokemonData() {
    try {
      // Obtener todos los Pokémon (puedes ajustar el offset y limit si es necesario)
      const response = await fetch(
        'https://pokeapi.co/api/v2/pokemon?offset=0&limit=10'
      );
      const data = await response.json();

      // Obtener detalles de cada Pokémon
      const detailedData = await Promise.all(
        data.results.map((pokemon) =>
          fetch(pokemon.url).then((res) => res.json())
        )
      );

      // Filtrar los Pokémon base (sin evoluciones)
      const basePokemon = await Promise.all(
        detailedData.map(async(pokemon) => {
          const speciesResponse = await fetch(pokemon.species.url);
          const speciesData = await speciesResponse.json();
          return speciesData.evolves_from_species ? null : pokemon;
        })
      );

      // Filtrar los nulls de la lista final
      this.pokemonList = basePokemon.filter((pokemon) => pokemon !== null);
      console.log(this.pokemonList);
    } catch (error) {
      console.error('Error fetching Pokémon data:', error);
    }
  }

  render() {
    return html` <div class="container">
      <h3>${this.title}</h3>
      <bbva-button-default
        @click=${this.goToAboutMe}
        class="evolutions-button"
        text="About me"
      ></bbva-button-default>
      ${this.pokemonList
    ? this.pokemonList.map(
      (pokemon) => html`
              <div class="pokemon-container">
                <bbva-web-card-product class="pokemon-card">
                  <!-- Imagen del Pokémon -->
                  <img
                    class="pokemon-image"
                    slot="media"
                    src="${pokemon.sprites.front_default}"
                    alt="${pokemon.name}"
                  />
                  <!-- Nombre del Pokémon -->
                  <div class="pokemon-name" slot="title">${pokemon.name}</div>
                  <!-- Peso del Pokémon -->
                  <div class="pokemon-name" slot="title">
                    ${pokemon.weight} Kg
                  </div>
                  <!-- Tipos del Pokémon -->
                  <div class="pokemon-type" slot="details">
                    ${pokemon.types.map(
    (typeInfo) => html`<span>${typeInfo.type.name}</span>`
  )}
                  </div>
                </bbva-web-card-product>
                <bbva-button-default
                  @click=${this.goToEvolution}
                  class="evolutions-button"
                  text="Evoluciones"
                ></bbva-button-default>
              </div>
            `
    )
    : ''}
    </div>`;
  }

  goToEvolution() {
    this.navigate('evolution');
  }

  goToAboutMe() {
    this.navigate('aboutme');
  }
}

window.customElements.define(HomePage.is, HomePage);
