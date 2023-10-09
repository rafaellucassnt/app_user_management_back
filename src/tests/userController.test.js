const User = require('../models/userModel');
const {
    getAllUsers,
    createUser,
    getUserById,
    updateUser,
    deleteUser,
} = require('../controllers/userController');

describe('userController', () => {
    let mockRequest;
    let mockResponse;

    beforeEach(() => {
        mockRequest = {};
        mockResponse = {
            status: jest.fn(() => mockResponse),
            json: jest.fn(),
            send: jest.fn(),
        };
    });

    describe('getAllUsers', () => {
        it('deve retornar uma lista de usuários', async () => {
            User.find = jest.fn().mockResolvedValue(['user1', 'user2']);

            await getAllUsers(mockRequest, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(['user1', 'user2']);
        });

        it('deve lidar com erros de busca de usuários', async () => {
            User.find = jest.fn().mockRejectedValue(new Error('Erro ao buscar usuários'));

            await getAllUsers(mockRequest, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Erro Interno do Servidor' });
        });
    });

    describe('createUser', () => {
        it('deve criar um novo usuário com dados válidos', async () => {
            const newUser = { name: 'novousuario22', password: 'senha', email: 'email2@example.com' };
            mockRequest.body = newUser;

            User.prototype.save = jest.fn().mockResolvedValue(newUser);

            await createUser(mockRequest, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({
                name: "novousuario22",
                password: "senha",
                email: "email2@example.com"
            }));
        });

        it('deve lidar com erros ao criar um usuário', async () => {
            User.prototype.save = jest.fn().mockRejectedValue(new Error('Erro ao criar usuário'));

            await createUser(mockRequest, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Erro Interno do Servidor' });
        });

        it('deve lidar com campos em branco', async () => {
            const newUser = { name: '', password: 'senha', email: 'email@example.com' };
            mockRequest.body = newUser;

            await createUser(mockRequest, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Campos obrigatórios não podem estar em branco' });
        });
    });
    describe('getUserById', () => {
        it('deve retornar um usuário existente pelo ID', async () => {
            const userId = 'user123';
            const user = { _id: userId, name: 'usuarioteste', password: 'senha', email: 'email@example.com' };

            User.findById = jest.fn().mockResolvedValue(user);

            mockRequest.params = { id: userId };

            await getUserById(mockRequest, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(user);
        });

        it('deve lidar com usuário não encontrado', async () => {
            User.findById = jest.fn().mockResolvedValue(null);

            mockRequest.params = { id: 'user456' };

            await getUserById(mockRequest, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Usuário não encontrado!' });
        });

        it('deve lidar com erros ao buscar um usuário', async () => {
            User.findById = jest.fn().mockRejectedValue(new Error('Erro ao buscar usuário'));

            mockRequest.params = { id: 'user789' };

            await getUserById(mockRequest, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Erro Interno do Servidor' });
        });
    });

    describe('updateUser', () => {
        it('deve atualizar um usuário existente', async () => {
            const userId = 'user123';
            const updatedUser = { _id: userId, name: 'novousuario', password: 'novasenha', email: 'novemail@example.com' };

            User.findByIdAndUpdate = jest.fn().mockResolvedValue(updatedUser);

            mockRequest.params = { id: userId };
            mockRequest.body = updatedUser;

            await updateUser(mockRequest, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(updatedUser);
        });

        it('deve lidar com usuário não encontrado ao atualizar', async () => {
            User.findByIdAndUpdate = jest.fn().mockResolvedValue(null);

            mockRequest.params = { id: 'usuario_inexistente_id' };
            mockRequest.body = {
                name: 'Novo Nome',
                password: 'Nova Senha',
                email: 'novoemail@example.com',
            };

            await updateUser(mockRequest, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Usuário não encontrado!' });
        });

        it('deve lidar com erros ao atualizar um usuário', async () => {
            User.findByIdAndUpdate = jest.fn().mockRejectedValue(new Error('Erro ao atualizar usuário'));

            mockRequest.params = { id: 'user789' };
            mockRequest.body = { name: 'novousuario', password: 'novasenha', email: 'novemail@example.com' };

            await updateUser(mockRequest, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Erro Interno do Servidor' });
        });
    });

    describe('deleteUser', () => {
        it('deve excluir um usuário existente', async () => {
            const userId = 'user123';

            User.findByIdAndRemove = jest.fn().mockResolvedValue({ _id: userId });

            mockRequest.params = { id: userId };

            await deleteUser(mockRequest, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(204);
            expect(mockResponse.send).toHaveBeenCalled();
        });

        it('deve lidar com usuário não encontrado ao excluir', async () => {
            User.findByIdAndRemove = jest.fn().mockResolvedValue(null);

            mockRequest.params = { id: 'user456' };

            await deleteUser(mockRequest, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Usuário não encontrado!' });
        });

        it('deve lidar com erros ao excluir um usuário', async () => {
            User.findByIdAndRemove = jest.fn().mockRejectedValue(new Error('Erro ao excluir usuário'));

            mockRequest.params = { id: 'user789' };

            await deleteUser(mockRequest, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Erro Interno do Servidor' });
        });
    });
});