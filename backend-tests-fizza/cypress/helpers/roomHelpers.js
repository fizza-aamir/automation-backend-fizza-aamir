/// <reference types="cypress" />
import faker from 'faker'

const ENDPOINT_GET_ROOMS = "http://localhost:3000/api/rooms"
const ENDPOINT_POST_ROOM = "http://localhost:3000/api/room/new"
const ENDPOINT_GET_ROOM = "http://localhost:3000/api/room/"

function createRandomRoomPayload(){
    const roomNr= faker.random.number({min:1, max:5000})

    let roomCategories=['Double', 'Single', 'Twin']
    const random = Math.floor(Math.random() * roomCategories.length) // generates random integer =>0 and <3 so 0, 1 or 2
    const randomRoomCategory=roomCategories[random]

    const floorNr= faker.random.number(200)
    const roomPrice= faker.random.number({min: 500, max: 10000})

    let roomFeatures= ['Balcony', 'Ensuite', 'Sea View', 'Penthouse']
    const randomf= Math.floor(Math.random() * roomFeatures.length)
    const randomRoomFeature= [roomFeatures[random]]////////

    const roomPayload= {
        "feature":randomRoomFeature,
        "category":randomRoomCategory,
        "number": roomNr,
        "floor": floorNr,
        "available":true,
        "price":roomPrice
}
    return roomPayload
}


function createRoom(cy){
    cy.authenticateSession().then((response => {
        let fakeRoomPayload= createRandomRoomPayload()
        cy.request({
            method: 'POST',
            url: ENDPOINT_POST_ROOM,
            headers: {
                'X-User-Auth':JSON.stringify(Cypress.env().loginToken),
                "Content-Type": "application/json"
            },
            body:fakeRoomPayload
        }).then((response => {
            cy.log(JSON.stringify(response.body))
            const responseBodyAsString= JSON.stringify(response.body)
            expect(responseBodyAsString).to.have.string(fakeRoomPayload.number)
        }))
    }))
    
}
function deleteLastAfterGet(cy){
    cy.request({
        method: 'GET',
        url: ENDPOINT_GET_ROOMS,
        headers: {
            'X-User-Auth':JSON.stringify(Cypress.env().loginToken),
            "Content-Type": "application/json"
        }
        }).then((response => {
            cy.log('all rooms= '+ JSON.stringify(response.body))
            let lastId= response.body[response.body.length -1].id
            cy.log('last id= '+lastId)

            cy.request({
                method:'DELETE',
                url: ENDPOINT_GET_ROOM + lastId,
                headers: {
                    'X-User-Auth':JSON.stringify(Cypress.env().loginToken),
                    "Content-Type": "application/json"
                }
            }).then((response => {
                const responseAsString= JSON.stringify(response.body)
                expect(responseAsString).to.have.string('true')
            }))
        }))
    
}

function createAndDeleteRoom(cy){
    cy.authenticateSession().then((response => {
        let fakeRoomPayload= createRandomRoomPayload()
        cy.request({
            method: 'POST',
            url: ENDPOINT_POST_ROOM,
            headers: {
                'X-User-Auth':JSON.stringify(Cypress.env().loginToken),
                "Content-Type": "application/json"
            },
            body:fakeRoomPayload
        }).then((response => {
            cy.log(JSON.stringify(response.body))
            const responseBodyAsString= JSON.stringify(response.body)
            expect(responseBodyAsString).to.have.string(fakeRoomPayload.number)

            deleteLastAfterGet(cy)
        }))
    }))
}

function editAfterGet(cy){
    cy.request({
        method: 'GET',
        url: ENDPOINT_GET_ROOMS,
        headers: {
            'X-User-Auth':JSON.stringify(Cypress.env().loginToken),
            "Content-Type": "application/json"
        }
        }).then((response => {
            cy.log('all rooms= '+ JSON.stringify(response.body))
            let lastId= response.body[response.body.length -1].id
            cy.log('last id= '+lastId)

            let lastRoomNr=response.body[response.body.length -1].number
            let lastFloorNr=response.body[response.body.length -1].floor
            let lastCategory=response.body[response.body.length -1].category
            let lastPrice=response.body[response.body.length -1].price
            let lastAvailable =response.body[response.body.length -1].available
            let lastFeature= response.body[response.body.length -1].feature
            let lastCreated =response.body[response.body.length -1].created
            let editedPrice=faker.random.number({min:500, max:10000})

            let editPayload= { 
                "id":lastId,
                "feature":lastFeature,
                "category":lastCategory,
                "number":lastRoomNr,
                "floor": lastFloorNr,
                "available":lastAvailable,
                "price":editedPrice,
                "created":lastCreated
            }

            cy.request({
                method:'PUT',
                url: ENDPOINT_GET_ROOM + lastId,
                headers: {
                    'X-User-Auth':JSON.stringify(Cypress.env().loginToken),
                    "Content-Type": "application/json"
                },
                body: editPayload
            }).then((response => {
                const responseAsString= JSON.stringify(response.body)
                cy.log(responseAsString)
                expect(responseAsString).to.have.string(editPayload.price)
                
            }))
        }))
}
function createAndEditRoom(cy){
    cy.authenticateSession().then((response => {
        let fakeRoomPayload= createRandomRoomPayload()
        cy.request({
            method: 'POST',
            url: ENDPOINT_POST_ROOM,
            headers: {
                'X-User-Auth':JSON.stringify(Cypress.env().loginToken),
                "Content-Type": "application/json"
            },
            body:fakeRoomPayload
        }).then((response => {
            cy.log(JSON.stringify(response.body))
            const responseBodyAsString= JSON.stringify(response.body)
            expect(responseBodyAsString).to.have.string(fakeRoomPayload.number)

            editAfterGet(cy)
        }))
    }))
}
module.exports= {
    createRandomRoomPayload,
    createRoom,
    createAndDeleteRoom, 
    createAndEditRoom
}