//Definindo itens a ser adivinhado
const words = [
    {word: "ViraVira", clue: "Cura"},
    {word: "Picareta", clue: "Cosmético"},
    {word: "Paraquedas", clue: "Cosmético"},
    {word: "TorresTortas", clue: "Local"},
    {word: "FontesSalgadas", clue: "Local"},
    {word: "Desempuxadora", clue: "Item"},
    {word: "Quicante", clue: "Armadilha"},
    {word: "VarinhaEstelar", clue: "Cosmético"},
    {word: "Peixoto", clue: "Skin"},
];

export default function getWord() {
    const index = Math.floor(Math.random() * words.length)

    return words[index];
}