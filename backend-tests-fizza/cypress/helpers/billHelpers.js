/// <reference types="cypress" />

const ENDPOINT_GET_BILLS = "http://localhost:3000/api/bills"
const ENDPOINT_POST_BILL = "http://localhost:3000/api/bill/new"
const ENDPOINT_GET_BILL = "http://localhost:3000/api/bill/"

function createBill(cy){
    cy.authenticateSession().then((response => {
        const payload = {
            "value":"1150",
            "paid":false
        }
        cy.request({
            method: 'POST',
            url: ENDPOINT_POST_BILL,
            headers: {
                'X-User-Auth':JSON.stringify(Cypress.env().loginToken),
                "Content-Type": "application/json"
            }, 
            body: payload
        }).then((response => {
            cy.log(JSON.stringify(response.body))
            
        }))
    }))
}

function getAllBillsAndEditLast(cy){
    cy.authenticateSession().then((response => {
        cy.request({
            method: 'GET',
            url:  ENDPOINT_GET_BILLS, //get all bills
            headers: {
             'X-User-Auth':JSON.stringify(Cypress.env().loginToken),
             "Content-Type": "application/json"
         }
         }).then((response2 => {
             cy.log(JSON.stringify(response2.body))
             let lastId= response2.body[response2.body.length -1].id
             cy.log(lastId)
             let lastValue=response2.body[response2.body.length -1].value
             let lastCreated=response2.body[response2.body.length -1].created
             let lastPaid=response2.body[response2.body.length -1].paid
             cy.log(lastValue)
             cy.log(lastCreated)
             
            let editPayload={"value":lastValue, "id":lastId, "created":lastCreated, "paid":true}

            cy.log(editPayload)
            cy.log(JSON.stringify(editPayload))
            cy.request({
             method:'PUT',
             url: ENDPOINT_GET_BILL+ lastId, // get one bill
             headers: {
                 'X-User-Auth':JSON.stringify(Cypress.env().loginToken),
                 "Content-Type": "application/json"
             },
             body: editPayload

         }).then((response3 => {
             cy.log(JSON.stringify(response3.body))
         }))
         }))
    }))
}

module.exports = {
    createBill,
    getAllBillsAndEditLast
}