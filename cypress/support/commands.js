import { faker } from '@faker-js/faker';

Cypress.Commands.add('token', (email, senha) => {
    cy.request({
        method: 'POST',
        url: 'login',
        body: {
            "email": email,
            "password": senha 
        }
    }).then((response) => {
        expect(response.status).to.equal(200)
        return response.body.authorization
    })
 })

 Cypress.Commands.add('cadastrarProduto' , (token, produto, preco, descricao, quantidade) =>{
    cy.request({
        method: 'POST', 
        url: 'produtos',
        headers: {authorization: token}, 
        body: {
            "nome": produto,
            "preco": preco,
            "descricao": descricao,
            "quantidade": quantidade
          }, 
          failOnStatusCode: false
    })
 })

 Cypress.Commands.add('cadastrarUsuarios' , () =>{
    cy.request({
      method: 'POST',
      url: 'usuarios',
      body: {
        "nome": faker.person.fullName(),
        "email": faker.internet.email(),
        "password": faker.internet.password(),
        "administrador": "true"
      },
      failOnStatusCode: false
    })
 })

 Cypress.Commands.add('cadastrarUsuariosSemFaker' , (usuario, email, senha) =>{
    cy.request({
      method: 'POST',
      url: 'usuarios',
      body: {
        "nome": usuario,
        "email": email,
        "password": senha,
        "administrador": "true"
      },
      failOnStatusCode: false
    })
 })