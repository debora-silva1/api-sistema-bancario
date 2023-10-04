module.exports = {
    banco: {
        nome: 'Cubos Bank',
        numero: '123',
        agencia: '0001',
        senha: 'Cubos123Bank'
    },
    contas: [
        {
            "numero": 1,
            "saldo": 1200,
            "usuario": {
                "nome": "Foo Bar1",
                "cpf": "00011122214",
                "data_nascimento": "2021-03-15",
                "telefone": "71999998818",
                "email": "foo2@bar.com",
                "senha": "12345"
            }
        },
        {
            "numero": 2,
            "saldo": 1200,
            "usuario": {
                "nome": "Foo Bar1",
                "cpf": "00011122212",
                "data_nascimento": "2021-03-15",
                "telefone": "71999998818",
                "email": "foo1@bar.com",
                "senha": "12345"
            }
        }
    ],
    saques: [],
    depositos: [],
    transferencias: []
}