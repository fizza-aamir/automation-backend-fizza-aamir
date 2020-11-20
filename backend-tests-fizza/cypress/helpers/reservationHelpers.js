/// <reference types="cypress" />
import faker from 'faker'

const ENDPOINT_GET_RESERVATIONS = "http://localhost:3000/api/reservations"
const ENDPOINT_POST_RESERVATION = "http://localhost:3000/api/reservation/new"
const ENDPOINT_GET_RESERVATION = "http://localhost:3000/api/reservation/"

function createReservation(cy){
    cy.authenticateSession().then((response => {
        let fakeStartDate= faker.date.recent()
        let fakeEndDate= faker.date.future()

        const payload={
            "client":1,
            "room":1,
            "bill":1,
            "start":fakeStartDate,
            "end":fakeEndDate
        } 
        cy.request({
           method:'POST',
           url: ENDPOINT_POST_RESERVATION,
           headers: {
            'X-User-Auth':JSON.stringify(Cypress.env().loginToken),
            "Content-Type": "application/json"
        }, 
        body: payload
        }).then((response => {
            cy.log(JSON.stringify(response.body))
            const responseAsString= JSON.stringify(response.body)
            expect(responseAsString).to.have.string(payload.start)
        }))
        //Assertion from all reservations
        cy.request({
            method: 'GET',
            url:  ENDPOINT_GET_RESERVATIONS ,
            headers: {
                'X-User-Auth':JSON.stringify(Cypress.env().loginToken),
                "Content-Type": "application/json"
            }
        }).then((response => {
            const responseAsString= JSON.stringify(response.body)
            expect(responseAsString).to.have.string(payload.start)
        }))
    }))
}
function deleteLastAfterGet(cy){
    
        cy.request({
            method: 'GET',
            url:  ENDPOINT_GET_RESERVATIONS ,
            headers: {
                'X-User-Auth':JSON.stringify(Cypress.env().loginToken),
                "Content-Type": "application/json"
            }
        }).then((response => {
            cy.log(JSON.stringify(response.body))
            let lastId= response.body[response.body.length -1].id //we can see its content by JSON.stringify 
                                                                //but its behaving like an array in this form
            cy.log('last id= '+lastId)
            let lastEndDate= response.body[response.body.length -1].end

            cy.request({
                method:'DELETE',
                url: ENDPOINT_GET_RESERVATION + lastId,
                headers: {
                    'X-User-Auth':JSON.stringify(Cypress.env().loginToken),
                    "Content-Type": "application/json"
                }
            }).then((response => {
                const responseAsString= JSON.stringify(response)
                cy.log('response after delete= '+ responseAsString)
                expect(responseAsString).to.have.string('true')  //Assertion that it has deleted
            }))

            //Assertion from all reservations that this id is deleted
            cy.request({
                method: 'GET',
                url:  ENDPOINT_GET_RESERVATIONS ,
                headers: {
                    'X-User-Auth':JSON.stringify(Cypress.env().loginToken),
                    "Content-Type": "application/json"
                }
            }).then((response => {
                const responseAsString= JSON.stringify(response.body)
                expect(responseAsString).to.not.have.string(lastEndDate)
            }))
        }))
    
}
function createAndDeleteReservation(cy){
    cy.authenticateSession().then((response => {
        let fakeStartDate= faker.date.recent()
        let fakeEndDate= faker.date.future()

        const payload={
            "client":1,
            "room":1,
            "bill":1,
            "start":fakeStartDate,
            "end":fakeEndDate
        } 
        cy.request({
           method:'POST',
           url: ENDPOINT_POST_RESERVATION,
           headers: {
            'X-User-Auth':JSON.stringify(Cypress.env().loginToken),
            "Content-Type": "application/json"
        }, 
        body: payload
        }).then((response => {
            cy.log(JSON.stringify(response.body))
            deleteLastAfterGet(cy)
        }))
    }))
}
module.exports = {
    createReservation,
    createAndDeleteReservation
}