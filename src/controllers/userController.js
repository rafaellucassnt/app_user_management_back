const User = require('../models/userModel');

// Função para verificar se um objeto está vazio
function isObjectEmpty(obj) {
    return Object.keys(obj).length === 0;
}

// Listar todos os usuários
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'Erro Interno do Servidor' });
    }
};

// Criar um novo usuário
exports.createUser = async (req, res) => {
    try {
        const { name, password, email } = req.body;

        if (!name || !password || !email) {
            return res.status(400).json({ error: 'Campos obrigatórios não podem estar em branco' });
        }

        const newUser = new User(req.body);
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ error: 'Erro Interno do Servidor' });
    }
};


// Detalhar um usuário
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            res.status(404).json({ error: 'Usuário não encontrado!' });
        } else {
            res.status(200).json(user);
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro Interno do Servidor' });
    }
};

// Atualizar um usuário
exports.updateUser = async (req, res) => {
    try {
        const { name, password, email } = req.body;
        const userId = req.params.id;

        if (!name || !password || !email) {
            return res.status(400).json({ error: 'Campos obrigatórios não podem estar em branco' });
        }

        const user = await User.findByIdAndUpdate(userId, { name, password, email }, { new: true });

        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado!' });
        }

        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ error: 'Erro Interno do Servidor' });
    }
};

// Deletar um usuário
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndRemove(req.params.id);
        if (!user) {
            res.status(404).json({ error: 'Usuário não encontrado!' });
        } else {
            res.status(204).send();
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro Interno do Servidor' });
    }
};
