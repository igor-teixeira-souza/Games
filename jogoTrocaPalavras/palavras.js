const phrases = [
  {
    part1: "Eu acabei de eliminar ",
    part2: " com um tiro no coração!",
  },
  {
    part1: "Vamos construir uma base ",
    part2: " antes que a tempestade chegue!",
  },
  {
    part1: "Encontrei uma arma lendária ",
    part2: " escondida em um baú!",
  },
  {
    part1: "O novo skin do ",
    part2: " é a melhor coisa do jogo!",
  },
  {
    part1: "Ninguém espera um ataque ",
    part2: " no meio do combate!",
  },
];

let currentPhraseIndex = 0;

function selectPhrase(index) {
  currentPhraseIndex = index;
  document.getElementById("currentPhrase").textContent =
    phrases[index].part1 + "_________" + phrases[index].part2;
  document.getElementById("userInput").value = "";
  document.getElementById("userInput").focus();
}

function generateSentence() {
  const userInput = document.getElementById("userInput").value.trim();
  if (!userInput) {
    alert("Digite algo criativo!");
    return;
  }

  const selectedPhrase = phrases[currentPhraseIndex];
  const result =
    selectedPhrase.part1 +
    '<span class="user-input">' +
    userInput +
    "</span>" +
    selectedPhrase.part2;

  document.getElementById("result").innerHTML = result;
}

// Initialize with first phrase
selectPhrase(0);

// Allow Enter key to submit
document.getElementById("userInput").addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    generateSentence();
  }
});
