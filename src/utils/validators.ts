const enthropyFormula = (prob: number) => -prob * Math.log2(prob)

export const calcEnthropy = (password: string) => {
  let frequency: Record<string, number> = {}
  password
    .split('')
    .map(letter =>
      typeof frequency[letter] === 'number'
        ? (frequency[letter] += 1)
        : (frequency[letter] = 1),
    )

  return Object.values(frequency).reduce(
    (prevValue, currValue) =>
      prevValue + enthropyFormula(currValue / password.length),
    0,
  )
}

function hasLowerCase(str: string) {
  return /[a-z]/.test(str) ? 26 : 0
}

function hasUpperCase(str: string) {
  return /[A-Z]/.test(str) ? 26 : 0
}

function hasNumbers(str: string) {
  return /[0-9]/.test(str) ? 10 : 0
}

function hasSpecialSign(str: string) {
  return /[`~!@#$%^&*()-=_+[\]}\\|;:,.]/.test(str) ? 32 : 0
}

function hasNotAllowedSigns(str: string) {
  return /['"<>]/.test(str) ? 32 : 0
}

//https://www.omnicalculator.com/other/password-entropy#password-entropy-formula
export const checkIfPasswordIsStrongEnough = (password: string) => {
  if (password.length < 8 || password.length > 24) {
    return 'Hasło powinnno zawierać od 8 do 24 znaków.'
  }
  if (hasNotAllowedSigns(password)) {
    return 'Znaki \' " < > są niedozwolone w haśle.'
  }
  const lowerPoints = hasLowerCase(password)
  const upperPoints = hasUpperCase(password)
  const numbersPoints = hasNumbers(password)
  const specialPoints = hasSpecialSign(password)
  if (!lowerPoints || !upperPoints || !numbersPoints || !specialPoints) {
    return 'Hasło powinno zawierać dużą i małą literę, cyfrę oraz znak specjalny.'
  }
  const R =
    hasLowerCase(password) +
    hasUpperCase(password) +
    hasNumbers(password) +
    hasSpecialSign(password)

  const L = password.length

  return L * Math.log2(R) > 50
    ? false
    : 'Zbyt słabe hasło. Spróbuj bardziej je zróżnicować lub użyj zaufanego generatora.'
}
