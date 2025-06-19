/// <reference types="cypress" />
import { faker } from '@faker-js/faker';
import produtosSchema from '../contracts/produtos.contract'

describe('Testes da Funcionalidade Usuários', () => {

  it('Deve validar contrato de usuários', () => {
    cy.request('produtos').then(response => {
      expect(response.status).to.equal(200);

      return produtosSchema.validateAsync(response.body);
    })
  });

  it('Deve listar usuários cadastrados', () => {
    cy.request({
            method: 'GET',
            url: 'usuarios'
        }).then((response) => {
            expect(response.status).to.equal(200)
            expect(response.body).to.have.property('usuarios')
            expect(response.duration).to.be.lessThan(20)
        }) 
  });

  it('Deve cadastrar um usuário com sucesso', () => {
    cy.request({
      method: 'POST',
      url: 'usuarios',
      body:{
          "nome": faker.person.fullName(),
          "email": faker.internet.email(),
          "password": faker.internet.password(),
          "administrador": "true"
        } 
    }).then((response) => {
      expect(response.status).to.equal(201)
      expect(response.body.message).to.equal('Cadastro realizado com sucesso')
    })
  });

  it('Deve validar um usuário com email inválido', () => {
      cy.request({
      method: 'POST',
      url: 'usuarios',
      body: {
        "nome": faker.person.fullName(),
        "email": "fulano@qa.com",
        "password": faker.internet.password(),
        "administrador": "true"
      },
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.equal(400)
      expect(response.body.message).to.equal('Este email já está sendo usado')
    })
  });

  it('Deve editar um usuário previamente cadastrado', () => {
    cy.cadastrarUsuarios().then (response =>{
      let id = response.body.id

          cy.request('usuarios').then(response => {
        let id = response.body.usuarios[0]._id
        cy.request({
            method: 'PUT',
            url: `usuarios/${id}`,
            body: {
                "nome": faker.person.fullName(),
                "email": faker.internet.email(),
                "password": faker.internet.password(),
                "administrador": "true"
            }
        }).then(response => {
            expect(response.body.message).to.equal('Registro alterado com sucesso')
        })
    })

    })
  });

  it('Deve deletar um usuário previamente cadastrado', () => {
  const nome  = `Usuário EBAC ${Math.floor(Math.random() * 1e6)}`;
  const email = `usuario${Date.now()}@qa.com`;
  const senha = 'Senha@123';

  // 1) Cadastra o usuário
  cy.cadastrarUsuariosSemFaker(nome, email, senha)
    .then(responseCadastro => {
      expect(responseCadastro.status).to.be.oneOf([200, 201]);
      const userId = responseCadastro.body._id;

      // 2) Busca todos os carrinhos
      cy.request('GET', 'carrinhos')
        .then(responseCarrinhos => {
          const carts = responseCarrinhos.body.carrinhos;

          // 3) Procura carrinho associado ao usuário
          const cart = carts.find(c =>
            c.idUsuario  === userId ||
            c.usuarioId  === userId ||
            c.usuario_id === userId
          );

          if (cart) {
            // 4) Deleta o carrinho
            cy.request('DELETE', `carrinhos/${cart._id}`)
              .then(responseDelCarrinho => {
                expect(responseDelCarrinho.status).to.equal(200);
                expect(responseDelCarrinho.body.message).to.equal('Registro excluído com sucesso');

                // 5) Deleta o usuário
                cy.request('DELETE', `usuarios/${userId}`)
                  .then(responseDelUsuario => {
                    expect(responseDelUsuario.status).to.equal(200);
                    expect(responseDelUsuario.body.message).to.equal('Registro excluído com sucesso');
                  });
              });

          } else {
            // 4b) Não achou carrinho → Deleta direto o usuário
            cy.request('DELETE', `usuarios/${userId}`)
              .then(responseDelUsuario => {
                expect(responseDelUsuario.status).to.equal(200);
                expect(responseDelUsuario.body.message).to.equal('Registro excluído com sucesso');
              });
          }
        });
    });
});





});
