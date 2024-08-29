import supertest from "supertest"
import { web } from "../src/application/web.js"
import { logger } from "../src/application/logging.js";
import { createTestUser, removeTestUser, getTestUser } from "./test-util.js";
import bcrypt from "bcrypt"

describe('POST /api/users', function (){

    afterEach(async () => {
        await removeTestUser()
    })

       
    it('should can register new user', async () => {
       const result = await supertest(web)
       .post('/api/users')
       .send({
          username: 'test',
          password: 'rahasia',
          name:'test'
       })

       logger.info(result.body)
       expect(result.status).toBe(200)
       expect(result.body.data.username).toBe('test')
    });


    it('should reject if invalid', async () => {
       const result = await supertest(web)
       .post('/api/users')
       .send({
          username: '',
          password: '',
          name:''
       })

       logger.info(result.body)
       expect(result.status).toBe(400)
       expect(result.body.errors).toBeDefined();
       
    });

    it('should reject if register duplikat', async () => {
        let result = await supertest(web)
        .post('/api/users')
        .send({
           username: 'test',
           password: 'rahasia',
           name:'test'
        })
 
        logger.info(result.body)
        expect(result.status).toBe(200)
        expect(result.body.data.username).toBe('test');

        result = await supertest(web)
        .post('/api/users')
        .send({
           username: 'test',
           password: 'rahasia',
           name:'test'
        })
 
        logger.info(result.body)
        expect(result.status).toBe(400)
       
     });

})

describe("POST /api/users/login", function (){
    
    beforeEach(async () => {
        await createTestUser()
    })

    afterEach(async () => {
        await removeTestUser()
    })

    it('should can login user', async () => {
        const result = await supertest(web)
        .post('/api/users/login')
        .send({
           username: 'test',
           password: 'rahasia'
        })

        logger.info(result.body)
        expect(result.status).toBe(200)
        expect(result.body.data.token).toBeDefined()
        expect(result.body.data.token).not.toBe("test");
    })
    
    it('should reject login if request is invalid', async () => {
        const result = await supertest(web)
        .post('/api/users/login')
        .send({
           username: '',
           password: ''
        })

        logger.info(result.body)
        expect(result.status).toBe(400)
        expect(result.body.errors).toBeDefined();
    })
    
    it('should reject login if password is wrong', async () => {
        const result = await supertest(web)
        .post('/api/users/login')
        .send({
           username: 'test',
           password: 'salah'
        })

        logger.info(result.body)
        expect(result.status).toBe(401)
        expect(result.body.errors).toBeDefined();
    })
    
    it('should reject login if username is wrong', async () => {
        const result = await supertest(web)
        .post('/api/users/login')
        .send({
           username: 'salah',
           password: 'salah'
        })

        logger.info(result.body)
        expect(result.status).toBe(401)
        expect(result.body.errors).toBeDefined();
    })
})

describe("GET /api/users/current", function (){
    
    beforeEach(async () => {
        await createTestUser()
    })

    afterEach(async () => {
        await removeTestUser()
    })

    it("should get current user", async () => {
        const result = await supertest(web)
        .get('/api/users/current')
        .set('Authorization', 'test')

        expect(result.status).toBe(200)
        expect(result.body.data.username).toBe('test');
        expect(result.body.data.name).toBe('test')

    
    })
    it("should reject if token invalid", async () => {
        const result = await supertest(web)
        .get('/api/users/current')
        .set('Authorization', 'salah')

        expect(result.status).toBe(401)
        expect(result.body.errors).toBeDefined();
       
    
    })

})

describe("PATCH /api/users/current", function (){

    beforeEach(async () => {
        await createTestUser()
    })

    afterEach(async () => {
        await removeTestUser()
    })

    it("should can update user", async() => {
        const result = await supertest(web)
        .patch('/api/users/current')
        .set('Authorization', 'test')
        .send({
            name: "eko",
            password: "rahasia lagi",
        })
        expect(result.status).toBe(200)
        expect(result.body.data.name).toBe("eko")
        expect(result.body.data.username).toBe("test")

        const user = await getTestUser()
        expect(await bcrypt.compare("rahasia lagi", user.password)).toBe(true)
    })
    it("should can update user name", async() => {
        const result = await supertest(web)
        .patch('/api/users/current')
        .set('Authorization', 'test')
        .send({
            name: "eko"
        })
        expect(result.status).toBe(200)
        expect(result.body.data.name).toBe("eko")
        expect(result.body.data.username).toBe("test")
    })
    it("should can update user name", async() => {
        const result = await supertest(web)
        .patch('/api/users/current')
        .set('Authorization', 'test')
        .send({
            password: "rahasia lagi"
        })
        expect(result.status).toBe(200)

        const user = await getTestUser()
        expect(await bcrypt.compare("rahasia lagi", user.password)).toBe(true)
    })
    it("should can update reject", async() => {
        const result = await supertest(web)
        .patch('/api/users/current')
        .set('Authorization', 'salah')
        .send({})
        expect(result.status).toBe(401)
    })

})

describe("DELETE /api/users/logout", function (){
    beforeEach(async () => {
        await createTestUser()
    })
    afterEach(async () => {
        await removeTestUser()
    })

    it("should can logout", async() => {
        const result = await supertest(web)
        .delete('/api/users/logout')
        .set('Authorization', 'test')

        expect(result.status).toBe(200)
        expect(result.body.data).toBe("oke")

        const user = await getTestUser()
        expect(user.token).toBeNull()
    })
    it("should can reject logout", async() => {
        const result = await supertest(web)
        .delete('/api/users/logout')
        .set('Authorization', 'salah')

        expect(result.status).toBe(401)
    })

})


