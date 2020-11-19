// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

const LOGIN_URL = "http://localhost:3000/api/login" 
const LOGOUT_URL = "http://localhost:3000/api/logout" 

Cypress.Commands.add('authenticateSession', () =>{
    const userCredentials = {
        "username":"tester01",
        "password":"GteteqbQQgSr88SwNExUQv2ydb7xuf8c"
    }
    cy.request({
        method: 'POST',
        url: LOGIN_URL, // baseUrl is prepended to url
        //form: true, // indicates the body should be form urlencoded and sets Content-Type: application/x-www-form-urlencoded headers
        headers: {
            "Content-Type": "application/json;charset=UTF-8"
        },
        body: JSON.stringify(userCredentials)
    }).then((response => {
        //cy.log(response.body)
        expect(response.status).to.eq(200)
        Cypress.env({loginToken:response.body}) //creating a global variable for generated token
    }))
})

Cypress.Commands.add('logout', () => {
    cy.request({
        method: 'POST',
        url: LOGOUT_URL,
        headers: {
            'X-User-Auth':JSON.stringify(Cypress.env().loginToken),
            "Content-Type": "application/json;charset=UTF-8"
        }
    }).then((response => {
        expect(response.status).to.eq(200)
        const responseAsString= JSON.stringify(response.body)
        expect(responseAsString).to.have.string('OK')
    }))
})