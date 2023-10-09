const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Listar todos os usuários
router.get('/users', userController.getAllUsers);

// Criar um novo usuário
router.post('/users', userController.createUser);

// Detalhar um usuário
router.get('/users/:id', userController.getUserById);

// Atualizar um usuário
router.put('/users/:id', userController.updateUser);

// Deletar um usuário
router.delete('/users/:id', userController.deleteUser);

module.exports = router;
