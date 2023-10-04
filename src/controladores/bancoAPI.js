const bancoDeDados = require('../bancodedados');

const listarContas = (req, res) => {
    const { senha_banco } = req.query

    if (bancoDeDados.banco.senha === senha_banco) {
        res.status(200).json(bancoDeDados.contas)
        return
    }
    else (
        res.status(403).json({ mensagem: 'A senha do banco informada é inválida' })
    )
}

const cadastrarConta = (req, res) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body

    if (!nome || nome.trim() === '') {
        res.status(400).json({ mensagem: 'campo nome não pode ser vazio' })
        return
    }
    if (!cpf || cpf.trim() === '') {
        res.status(400).json({ mensagem: 'campo cpf não pode ser vazio' })
        return
    }
    if (!data_nascimento || data_nascimento.trim() === '') {
        res.status(400).json({ mensagem: 'campo data de nascimento não pode ser vazio' })
        return
    }
    if (!telefone || telefone.trim() === '') {
        res.status(400).json({ mensagem: 'campo telefone não pode ser vazio' })
        return
    }
    if (!email || email.trim() === '') {
        res.status(400).json({ mensagem: 'campo e-mail não pode ser vazio' })
        return
    }
    if (!senha || senha.trim() === '') {
        res.status(400).json({ mensagem: 'campo senha não pode ser vazio' })
        return
    }


    for (let dados of bancoDeDados.contas) {
        if ((cpf === dados.usuario.cpf) || (email === dados.usuario.email)) {
            res.status(400).json({ mensagem: 'Já existe uma conta com o cpf ou e-mail informado' })
            return
        }
    }

    let novoNumero = 1;

    if (bancoDeDados.contas.length > 0) {
        const id = bancoDeDados.contas[bancoDeDados.contas.length - 1].numero
        novoNumero = parseInt(id) + 1
    }

    const novaConta = {
        numero: novoNumero,
        saldo: 0,
        usuario: {
            nome: nome,
            cpf: cpf,
            data_nascimento: data_nascimento,
            telefone: telefone,
            email: email,
            senha: senha
        }
    }

    bancoDeDados.contas.push(novaConta)
    return res.status(201).json();
}

const saldo = (req, res) => {
    const { numero_conta, senha } = req.query

    const encontraConta = bancoDeDados.contas.filter((conta) => {
        return conta.numero === parseInt(numero_conta) && conta.usuario.senha === senha
    });

    if (encontraConta.length === 0) {
        return res.status(400).json({ mensagem: 'Conta bancária não encontrada!' })
    }

    return res.status(200).json({ saldo: encontraConta[0].saldo })
}

const removeConta = (req, res) => {
    const { numeroConta } = req.query

    if (!numeroConta || numeroConta === 0) {
        res.status(400).json({ mensagem: 'Número da conta Inválido' })
        return
    }

    const indiceConta = bancoDeDados.contas.findIndex((conta) => {
        return conta.numero === parseInt(numeroConta)
    })

    if (bancoDeDados.contas[indiceConta].saldo === 0) {

        bancoDeDados.contas.splice(indiceConta)

        return res.status(204).json()
    }

    return res.status(400).json({ mensagem: 'A conta só pode ser removida se o saldo for zero' })

}

const deposita = (req, res) => {
    const { numero_conta, valor } = req.body

    if (numero_conta.trim() === '' || !valor) {
        res.status(400).json({ mensagem: 'O número da conta e o valor são obrigatórios!' })
        return
    }

    if (valor <= 0) {
        return res.status(400).json({ mensagem: 'O valor deve ser acima de zero!' })
    }

    const indiceConta = bancoDeDados.contas.findIndex((conta) => {
        return conta.numero === parseInt(numero_conta)
    });

    const deposito = {
        data: new Date(),
        numero_conta: bancoDeDados.contas[indiceConta].numero,
        valor: valor,
    }

    bancoDeDados.depositos.push(deposito)

    bancoDeDados.contas[indiceConta].saldo += valor

    return res.status(200).json()
}

const sacar = (req, res) => {
    const { numero_conta, valor, senha } = req.body

    if (!numero_conta) {
        res.status(400).json({ mensagem: 'Campo numero da conta obrigatório!' })
    }
    if (!valor) {
        res.status(400).json({ mensagem: 'Campo valor obrigatório!' })
    }
    if (!senha) {
        res.status(400).json({ mensagem: 'Campo senha obrigatório!' })
    }

    const indiceConta = bancoDeDados.contas.findIndex((contas) => {
        return contas.numero === parseInt(numero_conta)
    })

    if (bancoDeDados.contas[indiceConta].usuario.senha !== senha) {
        res.status(403).json({ mensagem: 'senha inválida!' })
    }
    if (bancoDeDados.contas[indiceConta].saldo < valor) {
        res.status(400).json({ mensagem: 'saldo insuficiente' })
    }

    const saques = {
        data: new Date(),
        numero_conta: bancoDeDados.contas[indiceConta].numero,
        valor: valor
    }

    bancoDeDados.saques.push(saques)

    bancoDeDados.contas[indiceConta].saldo -= valor

    res.status(200).json()

}

const atualizarUsuario = (req, res) => {
    const { numeroConta } = req.params
    const usuario = req.body

    if ((!usuario.nome) || (!usuario.cpf) || (!usuario.data_nascimento) || (!usuario.telefone) || (!usuario.email) || (!usuario.senha)) {
        res.status(400).jason({ mensagem: 'Todos os campos são obrigatórios!' })
    }

    const filtraCpf = bancoDeDados.contas.filter((conta) => {
        return conta.cpf === usuario.cpf
    })

    if (filtraCpf.length > 0 && filtraCpf[0].usuario.cpf === usuario.cpf) {
        res.status(404).json({ mensagem: 'O CPF informado já existe cadastrado' })
    }
    const filtraEmail = bancoDeDados.contas.filter((conta) => {
        return conta.email === usuario.email
    })

    if (filtraEmail.length > 0 && filtraEmail[0].usuario.email === usuario.email) {
        res.status(404).json({ mensagem: 'O E-mail informado já existe cadastrado' })
    }

    const filtraConta = bancoDeDados.contas.filter((conta) => {
        return conta.numero === parseInt(numeroConta)
    });

    if (filtraEmail[0].numero === parseInt(numeroConta)) {
        res.status(404).json({ mensagem: 'O numero da conta não existe!' })
    }

    const atualizaDadosDoUsuario = {
        nome: usuario.nome,
        cpf: usuario.cpf,
        data_nascimento: usuario.data_nascimento,
        telefone: usuario.telefone,
        email: usuario.email,
        senha: usuario.senha
    }

    filtraConta[0].usuario = atualizaDadosDoUsuario

    return res.status(204).json()

}

const transferir = (req, res) => {
   
    const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body;
    
    if (!numero_conta_destino || !numero_conta_origem || !valor || !senha) {
        return res.status(400).json({ mensagem: "Não foi preenchido corretamente!" })
    }

    const [contaOrigem] = bancoDeDados.contas.filter(conta => conta.numero === parseInt(numero_conta_origem))


    if (!contaOrigem) {
        return res.status(404).json({ mensagem: "Conta origem inválida." });
    }

    const [contaDestino] = bancoDeDados.contas.filter(conta => conta.numero === parseInt(numero_conta_destino))
    if (!contaDestino) {
        return res.status(404).json({ mensagem: "Conta destino inválida." });
    }

    if (senha !== contaOrigem.usuario.senha) {
        return res.status(401).json({ mensagem: "Senha incorreta!" });
    }

    if (valor > contaOrigem.saldo) {
        return res.status(403).json({ mensagem: "Saldo insuficiente!" })
    }

    contaOrigem.saldo -= valor;
    contaDestino.saldo += valor;

    const registro = {
        data: new Date(),
        numero_conta_origem: parseInt(numero_conta_origem),
        numero_conta_destino: parseInt(numero_conta_destino),
        valor: parseFloat(valor)
    }

    bancoDeDados.transferencias.push(registro)

    res.status(204).json();
}

const extrato = (req, res) => {
    const { numero_conta, senha } = req.query;

    if (!numero_conta || !senha) {
        return res.status(400).json({ mensagem: "Não foi preenchido corretamente!" })
    }

    const [conta] = bancoDeDados.contas.filter(conta => conta.numero === parseInt(numero_conta))


    if (!conta) {
        return res.status(404).json({ mensagem: "Conta origem inválida." });
    }

    if (senha !== conta.usuario.senha) {
        return res.status(401).json({ mensagem: "Senha incorreta!" });
    }

    const depositos = bancoDeDados.depositos.filter(deposito => deposito.numero_conta === parseInt(numero_conta));
    const saques = bancoDeDados.saques.filter(saque => saque.numero_conta === parseInt(numero_conta));
    const transferenciasEnviadas = bancoDeDados.transferencias.filter(transferencia => transferencia.numero_conta_origem === parseInt(numero_conta));
    const transferenciasRecebidas = bancoDeDados.transferencias.filter(transferencia => transferencia.numero_conta_destino === parseInt(numero_conta));


    const extratoConta = {
        depositos: depositos,
        saques: saques,
        transferenciasEnviadas: transferenciasEnviadas,
        transferenciasRecebidas: transferenciasRecebidas
    }

    res.status(200).json(extratoConta);
}

module.exports = {
    listarContas,
    cadastrarConta,
    saldo,
    removeConta,
    deposita,
    sacar,
    atualizarUsuario,
    transferir,
    extrato
}