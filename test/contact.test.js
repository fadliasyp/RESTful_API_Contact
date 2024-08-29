import supertest from "supertest"
import { createManyTestContact, createTestContact, createTestUser, getTestContact, removeAllTestContact, removeTestUser } from "./test-util.js"
import { web } from "../src/application/web.js"
import { logger } from "../src/application/logging.js"

describe("POST /api/contacts", function () {

    beforeEach(async () => {
        await createTestUser()
    })

    afterEach(async () => {
        await removeAllTestContact()
        await removeTestUser()
    })
    it("should can create new contact", async () => {
        const result = await supertest(web)
        .post('/api/contacts')
        .set("Authorization", "test")
        .send({
            first_name: "test",
            last_name: "test",
            email: "test@pzn.com",
            phone: "0890000"
        })
        expect(result.status).toBe(200)
        expect(result.body.data.id).toBeDefined();
        expect(result.body.data.first_name).toBe('test');
        
    })
    it("should reject is request not valid", async () => {
        const result = await supertest(web)
        .post('/api/contacts')
        .set("Authorization", "test")
        .send({
            first_name: "",
            last_name: "test",
            email: "test@pzn.com",
            phone: "0890000"
        })
        expect(result.status).toBe(400)
        expect(result.body.errors).toBeDefined()
    })
})

describe("GET /api/contacts/:contactId", function () {
    beforeEach(async () => {
        await createTestUser()
        await createTestContact()
    })
    afterEach(async () => {
        await removeAllTestContact()
        await removeTestUser()
    })

    it("should get contact", async () => {
        const testContact = await getTestContact()

        const result = await supertest(web)
        .get('/api/contacts/' + testContact.id)
        .set("Authorization", "test")

        logger.info(result.body)
        expect(result.status).toBe(200)
        expect(result.body.data.id).toBe(testContact.id);
        expect(result.body.data.first_name).toBe(testContact.first_name);
    })
    it("should return 404 if contact not found", async () => {
        const testContact = await getTestContact()

        const result = await supertest(web)
        .get('/api/contacts/' + (testContact.id + 1))
        .set("Authorization", "test")

        logger.info(result.body)
        expect(result.status).toBe(404)
    })
       
})

describe("PUT /api/contacts/:contactId", function () {
    beforeEach(async () => {
        await createTestUser()
        await createTestContact()
    })
    afterEach(async () => {
        await removeAllTestContact()
        await removeTestUser()
    })

    it("should can update contact", async () => {
        const testContact = await getTestContact()
    
        const result = await supertest(web)
        .put('/api/contacts/' + testContact.id)
        .set("Authorization", "test")
        .send({
            first_name: 'eko',
            last_name: 'eko',
            email: 'test@pzn.com',
            phone: '0890000'
        })
        expect(result.status).toBe(200)
        expect(result.body.data.id).toBe(testContact.id);
        expect(result.body.data.first_name).toBe('eko');

    })

    it("should reject is contact not valid", async () => {
        const testContact = await getTestContact()
    
        const result = await supertest(web)
        .put('/api/contacts/' + testContact.id)
        .set("Authorization", "test")
        .send({
            first_name: '',
            last_name: '',
            email: 'test@pzn.com',
            phone: '0890000'
        })
        expect(result.status).toBe(400)
        
    })

    it("should reject is request not valid", async () => {
        const testContact = await getTestContact()
    
        const result = await supertest(web)
        .put('/api/contacts/' + (testContact.id + 1))
        .set("Authorization", "test")
        .send({
            first_name: 'eko',
            last_name: 'eko',
            email: 'test@pzn.com',
            phone: '0890000'
        })
        expect(result.status).toBe(404)
        
    })
})

describe("DELETE /api/contacts/:contactId", function () {
    beforeEach(async () => {
        await createTestUser()
        await createTestContact()
    })
    afterEach(async () => {
        await removeAllTestContact()
        await removeTestUser()
    })

    it("should can delete contact", async () => {
        const testContact = await getTestContact();
        const result = await supertest(web)
        .delete('/api/contacts/' + testContact.id)
        .set("Authorization", "test")

        logger.info(result.body)
        expect(result.status).toBe(200)
        expect(result.body.data).toBe("OK")
    })
})


describe("GET /api/contacts", function () {
    beforeEach(async () => {
        await createTestUser()
        await createManyTestContact()
    })
    afterEach(async () => {
        await removeAllTestContact()
        await removeTestUser()
    })

    it('should can search without parameter', async () => {
        const result = await supertest(web)
        .get('/api/contacts')
        .set("Authorization", "test")


        logger.info(result.body)
        expect(result.status).toBe(200);
        expect(result.body.data.length).toBe(10);
        expect(result.body.paging.page).toBe(1);
        expect(result.body.paging.total_page).toBe(2);
        expect(result.body.paging.total_items).toBe(15);


    })
    it('should can search to page 2', async () => {
        const result = await supertest(web)
        .get('/api/contacts')
        .query({
            page: 2
        })
        .set("Authorization", "test")


        logger.info(result.body)
        expect(result.status).toBe(200);
        expect(result.body.data.length).toBe(5);
        expect(result.body.paging.page).toBe(2);
        expect(result.body.paging.total_page).toBe(2);
        expect(result.body.paging.total_items).toBe(15);


    })
    it('should can search to using name', async () => {
        const result = await supertest(web)
        .get('/api/contacts')
        .query({
            name: 'test1'
        })
        .set("Authorization", "test")


        logger.info(result.body)
        expect(result.status).toBe(200);
        expect(result.body.data.length).toBe(6);
        expect(result.body.paging.page).toBe(1);
        expect(result.body.paging.total_page).toBe(1);
        expect(result.body.paging.total_items).toBe(6)

    })
    it('should can search to using email', async () => {
        const result = await supertest(web)
        .get('/api/contacts')
        .query({
            email:'test1'
        })
        .set("Authorization", "test")


        logger.info(result.body)
        expect(result.status).toBe(200);
        expect(result.body.data.length).toBe(6);
        expect(result.body.paging.page).toBe(1);
        expect(result.body.paging.total_page).toBe(1);
        expect(result.body.paging.total_items).toBe(6)

    })
    it('should can search to using phone', async () => {
        const result = await supertest(web)
        .get('/api/contacts')
        .query({
            phone: '08900001'
        })
        .set("Authorization", "test")


        logger.info(result.body)
        expect(result.status).toBe(200);
        expect(result.body.data.length).toBe(6);
        expect(result.body.paging.page).toBe(1);
        expect(result.body.paging.total_page).toBe(1);
        expect(result.body.paging.total_items).toBe(6)

    })
})