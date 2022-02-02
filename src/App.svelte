<script>
  import { tick } from 'svelte'
  import { scale } from 'svelte/transition'
  import { check } from './check'
  import { solutions } from './solutions'

  const answer = solutions[Math.floor(Math.random() * solutions.length)]
  const keyboardData = [
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z'
  ].map((letter) => ({ letter, state: 'unused' }))

  let guesses = []

  async function handleGuess(event) {
    let guess = event.currentTarget.guess.value.toLowerCase()

    if (guesses.length === 5 || guesses.includes(guess)) return

    let guessData = check(guess, answer)

    // check for victory
    let correctGuess = guessData.every((guess) => guess.state === 'correct')

    // fill keyboard
    guessData.forEach((guess) => {
      let guessedLetterIndex = keyboardData.findIndex(
        (l) => l.letter === guess.letter
      )

      // only valid transitions are unused -> something or present -> correct
      if (
        keyboardData[guessedLetterIndex].state === 'unused' ||
        (keyboardData[guessedLetterIndex].state === 'present' &&
          guess.state === 'correct')
      ) {
        keyboardData[guessedLetterIndex].state = guess.state
      }
    })

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
  <h1>Jordle</h1>
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
      autofocus
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
            {letter.toUpperCase()}
          </span>
        {/each}
      </li>
    {/each}
  </ol>
  <div class="keyboard">
    {#each keyboardData as { letter, state }}
      <span class="letter" data-state={state}>{letter}</span>
    {/each}
  </div>
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

  .keyboard {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    position: fixed;
    bottom: 4rem;
    max-width: 80ch;
    min-width: 40ch;
    gap: 0.5rem;
    padding-block: 1rem;
    padding-inline: 2rem;
  }

  .keyboard .letter {
    font-size: 2rem;
    text-transform: uppercase;
    width: 3rem;
    transition: background-color 0.2s ease-out;
  }

  .letter {
    align-items: center;
    aspect-ratio: 1 / 1;
    background-color: #777;
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

  .letter[data-state='absent'] {
    background-color: #333;
  }
</style>
