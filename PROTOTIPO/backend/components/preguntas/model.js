// preguntas/model.js
const mongoose = require('mongoose');

// Definir el esquema para las preguntas
const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  options: [
    { optionText: String, isCorrect: Boolean }
  ]
});

// Crear el modelo a partir del esquema
const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
