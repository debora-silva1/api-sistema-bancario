const express = require('express');
const bancoApi = require('./controladores/bancoAPI')

const rotas = express();

rotas.get('/listarContas', bancoApi.listarContas);
rotas.get('/extrato', bancoApi.extrato)
rotas.get('/saldo', bancoApi.saldo);

rotas.post('/cadastrarConta', bancoApi.cadastrarConta);
rotas.post('/deposita', bancoApi.deposita);
rotas.post('/sacar', bancoApi.sacar)
rotas.post('/transacoes/transferir', bancoApi.transferir)

rotas.put('/contas/:numeroConta/usuario', bancoApi.atualizarUsuario)

rotas.delete('/removeConta', bancoApi.removeConta);

module.exports = rotas;