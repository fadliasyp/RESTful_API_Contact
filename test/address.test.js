import { logger } from "../src/application/logging.js"
import { web } from "../src/application/web.js"
import { createTestAddress, createTestContact, createTestUser, getTestAddress, getTestContact, removeAllTestAddresses, removeAllTestContact, removeTestUser } from "./test-util.js"
import supertest from "supertest"

describe("POST /api/contacts/:contactId/addresses", function () {
    beforeEach(async () => {
        await createTestUser()
        await createTestContact()
    })
    afterEach(async () => {
        await removeAllTestAddresses()
        await removeAllTestContact()
        await removeTestUser()
    })

    it("should can create new address", async () => {
        const testContact = await getTestContact()

        const result = await supertest(web)
        .post('/api/contacts/' + testContact.id + '/addresses')
        .set("Authorization", "test")
        .send({
            street: 'jalan test',
            city: 'kota test',
            province: 'provinsi test',
            country: 'indonesia',
            postal_code: '12345'
        })

        logger.info(result.body)
        expect(result.status).toBe(200)
        expect(result.body.data.id).toBeDefined();
        expect(result.body.data.street).toBe('jalan test');
    })
    it("should reject if address request is invalid", async () => {
        const testContact = await getTestContact()

        const result = await supertest(web)
        .post('/api/contacts/' + testContact.id + '/addresses')
        .set("Authorization", "test")
        .send({
            street: '',
            city: '',
            province: "",
            country: '',
            postal_code: ""
        })

        logger.info(result.body)
        expect(result.status).toBe(400)
    })
    it("should reject if address request is invalid", async () => {
        const testContact = await getTestContact()

        const result = await supertest(web)
        .post('/api/contacts/' + (testContact.id + 1)+ '/addresses')
        .set("Authorization", "test")
        .send({
            street: 'jalan test',
            city: 'kota test',
            province: 'provinsi test',
            country: 'indonesia',
            postal_code: '12345'
        })

        logger.info(result.body)
        expect(result.status).toBe(404)
    })
})

describe("GET /api/contacts/:contactId/addresses/:addressId", function () {
    beforeEach(async () => {
        await createTestUser()
        await createTestContact()
        await createTestAddress()
    })
    afterEach(async () => {
        await removeAllTestAddresses()
        await removeAllTestContact()
        await removeTestUser()
    })

    it("should can get contact and address", async () => {
        const testContact = await getTestContact()
        const testAddress = await getTestAddress()

        const result = await supertest(web)
        .get('/api/contacts/' + testContact.id + '/addresses/' + testAddress.id)
        .set("Authorization", "test")



        logger.info(result.body)
        expect(result.status).toBe(200)
        expect(result.body.data.id).toBe(testAddress.id);
        expect(result.body.data.street).toBe(testAddress.street);
    })
    it("should reject if contact is not found", async () => {
        const testContact = await getTestContact()
        const testAddress = await getTestAddress()

        const result = await supertest(web)
        .get('/api/contacts/' + (testContact.id + 1) + '/addresses/' + testAddress.id)
        .set("Authorization", "test")



        logger.info(result.body)
        expect(result.status).toBe(404)

    })
})

describe('PUT /api/contacts/:contactId/addresses/:addressId', function () {
    beforeEach(async () => {
        await createTestUser()
        await createTestContact()
        await createTestAddress()
    })
    afterEach(async () => {
        await removeAllTestAddresses()
        await removeAllTestContact()
        await removeTestUser()
    })
    it("should can update address", async () => {
        const testContact = await getTestContact()
        const testAddress = await getTestAddress()

        const result = await supertest(web)
        .put('/api/contacts/' + testContact.id + '/addresses/' + testAddress.id)
        .set("Authorization", "test")
        .send({
            street: 'street',
            city: 'city',
            province: 'provinsi',
            country: 'indonesia',
            postal_code: '11111'
        })
        expect(result.status).toBe(200)
        expect(result.body.data.id).toBe(testAddress.id);
        expect(result.body.data.street).toBe('street');
    })

    it("should reject if address request is invalid", async () => {
        const testContact = await getTestContact()
        const testAddress = await getTestAddress()

        const result = await supertest(web)
        .put('/api/contacts/' + testContact.id + '/addresses/' + testAddress.id)
        .set("Authorization", "test")
        .send({
            street: 'street',
            city: '',
            province: 'provinsi',
            country: '',
            postal_code: '11111'
        })
        expect(result.status).toBe(400)
    })
    it("should reject if address not found", async () => {
        const testContact = await getTestContact()
        const testAddress = await getTestAddress()

        const result = await supertest(web)
        .put('/api/contacts/' + testContact.id + '/addresses/' + (testAddress.id + 1))
        .set("Authorization", "test")
        .send({
            street: 'street',
            city: 'city',
            province: 'provinsi',
            country: 'indonesia',
            postal_code: '11111'
        })
        expect(result.status).toBe(404)
    })

    it("should reject if contact not found", async () => {
        const testContact = await getTestContact()
        const testAddress = await getTestAddress()

        const result = await supertest(web)
        .put('/api/contacts/' + (testContact.id + 1) + '/addresses/' + testAddress.id)
        .set("Authorization", "test")
        .send({
            street: 'street',
            city: 'city',
            province: 'provinsi',
            country: 'indonesia',
            postal_code: '11111'
        })
        expect(result.status).toBe(404)
    })
})

describe('DELETE /api/contacts/:contactId/addresses/:addressId', function () {
    beforeEach(async () => {
        await createTestUser()
        await createTestContact()
        await createTestAddress()
    })
    afterEach(async () => {
        await removeAllTestAddresses()
        await removeAllTestContact()
        await removeTestUser()
    })

    it('should can remove address', async () => {
        const testContact = await getTestContact()
        let testAddress = await getTestAddress()
        
        const result = await supertest(web)
        .delete('/api/contacts/' + testContact.id + '/addresses/' + testAddress.id)
        .set("Authorization", "test")

        expect(result.status).toBe(200)
        expect(result.body.data).toBe("OK")
    
        testAddress = await getTestAddress()
        expect(testAddress).toBeNull()
    })
    
    it('should can reject if address is not found', async () => {
        const testContact = await getTestContact()
        let testAddress = await getTestAddress()
        
        const result = await supertest(web)
        .delete('/api/contacts/' + testContact.id + '/addresses/' + (testAddress.id + 1))
        .set("Authorization", "test")

        expect(result.status).toBe(404)
    })
    it('should can reject if contact is not found', async () => {
        const testContact = await getTestContact()
        let testAddress = await getTestAddress()
        
        const result = await supertest(web)
        .delete('/api/contacts/' + (testContact.id + 1) + '/addresses/' + testAddress.id)
        .set("Authorization", "test")

        expect(result.status).toBe(404)
    })
})

describe('GET /api/contacts/:contactId/addresses', function () {
    beforeEach(async () => {
        await createTestUser()
        await createTestContact()
        await createTestAddress()
    })
    afterEach(async () => {
        await removeAllTestAddresses()
        await removeAllTestContact()
        await removeTestUser()
    })
    it('should can list address', async () => {
        const testContact = await getTestContact()

        const result = await supertest(web)
        .get('/api/contacts/' + testContact.id + '/addresses')
        .set("Authorization", "test")

        expect(result.status).toBe(200)
        expect(result.body.data.length).toBe(1)
    })
    it('should reject if contact is not found', async () => {
        const testContact = await getTestContact()

        const result = await supertest(web)
        .get('/api/contacts/' + (testContact.id + 1) + '/addresses')
        .set("Authorization", "test")

        expect(result.status).toBe(404)
    })
})