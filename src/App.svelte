<script>
  import { tick } from 'svelte'
  import { scale } from 'svelte/transition'
  import { check } from './check'

  let guesses = []
  const answer = 'sales'

  async function handleGuess(event) {
    let guess = event.currentTarget.guess.value.toLowerCase()

    if (guesses.length === 5 || guesses.includes(guess)) return

    let guessData = check(guess, answer)
    let correctGuess = guessData.every((guess) => guess.state === 'correct')
    guesses = [...guesses, guessData]

    if (correctGuess) {
      await tick()
      alert(
        `you won in ${guesses.length} ${guesses.length > 1 ? 'tries' : 'try'}!`
      )
      return
    }

    if (guesses.length === 5) {
      await tick()
      alert(
        `sorry! you didn't win this time. you should have guessed ${answer}`
      )
      return
    }
    event.currentTarget.reset()
  }

  function handleInput(event) {
    if (!/[A-Za-z]/.test(event.key)) {
      event.preventDefault()
    }
  }
</script>

<main>
  <h1>Sverdle</h1>
  <form on:submit|preventDefault={handleGuess}>
    <input
      on:keypress={handleInput}
      name="guess"
      type="text"
      minlength="5"
      maxlength="5"
      required
      autocomplete="off"
      autocapitalize="none"
      autocorrect="off"
      spellcheck="false"
    />
  </form>

  <ol>
    {#each guesses as guessData}
      <li class="guess">
        {#each guessData as { letter, state }, i}
          <span
            in:scale={{ duration: 200, delay: i * 300 }}
            data-state={state}
            class="letter"
          >
            {letter}
          </span>
        {/each}
      </li>
    {/each}
  </ol>
</main>

<style>
  h1 {
    color: tomato;
    font-family: monospace;
    font-weight: 100;
    font-size: 3.5rem;
  }

  main {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
    margin-block-start: 5rem;
    position: relative;
  }

  input {
    font-size: 1.5rem;
    width: 5ch;
    text-align: center;
  }

  .guess {
    font-family: monospace;
    font-size: 2rem;
    margin-block-start: 1rem;
    display: flex;
    gap: 0.5rem;
    z-index: 1;
  }

  .letter {
    align-items: center;
    aspect-ratio: 1 / 1;
    background-color: darkgrey;
    color: whitesmoke;
    border-radius: 3px;
    display: flex;
    height: auto;
    justify-content: center;
    outline: 1px solid;
    width: 2.5rem;
  }

  .letter[data-state='correct'] {
    background-color: forestgreen;
  }

  .letter[data-state='present'] {
    background-color: goldenrod;
  }
</style>
