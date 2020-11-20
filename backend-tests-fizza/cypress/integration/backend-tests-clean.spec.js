/// <reference types="cypress" />

import * as billHelpers from '../helpers/billHelpers'
import * as reservationHelpers from '../helpers/reservationHelpers'
import * as roomHelpers from '../helpers/roomHelpers'
describe('Test Suite Backend Clean Code', function(){

    it('Test case 1a-create new bill', function(){
        billHelpers.createBill(cy)
        cy.logout()
    })
    it('Test Case 1b- Get bills and edit Last', function(){
        billHelpers.getAllBillsAndEditLast(cy)
        cy.logout()
    })
    it('Testcase 2- Create and Delete Reservation', function(){
        reservationHelpers.createAndDeleteReservation(cy)
        cy.logout()
    })
    it('not a test', function(){
       // cy.log(JSON.stringify(roomHelpers.createRandomRoomPayload(cy)))
       roomHelpers.createRoom(cy)    
    })
    it('Testcase 3- Create and Edit Room', function(){
        roomHelpers.createAndEditRoom(cy)
        cy.logout()
    })
    it('Testcase 4- Create and Delete Room', function(){
        roomHelpers.createAndDeleteRoom(cy)
        cy.logout()
    })
})