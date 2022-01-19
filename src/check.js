/**
 * @param {string} guess
 * @param {string} answer
 */

export function check(guess, answer) {
  let guessLetters = guess.split('')
  let answerLetters = answer.split('')
  let remainingLetters = [...answerLetters]
  let results = guessLetters.map((letter) => ({ letter, state: 'absent' }))

  guessLetters.forEach((letter, index) => {
    if (answerLetters[index] === letter) {
      results[index].state = 'correct'
      remainingLetters.splice(remainingLetters.indexOf(letter), 1)
    }
  })

  guessLetters.forEach((letter, index) => {
    if (!remainingLetters.includes(letter) || !answer.includes(letter)) return

    if (results[index].state !== 'correct') {
      results[index].state = 'present'
      remainingLetters.splice(remainingLetters.indexOf(letter), 1)
    }
  })

  return results
}
