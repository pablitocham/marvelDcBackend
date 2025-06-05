import assert from 'assert';
import http from 'http';

const api_url = 'http://localhost:5000';

let generatedEmail = `testuser${Date.now()}@example.com`;
let generatedPassword = `password${Date.now()}`;

const testRegister = () => {
    return new Promise((resolve, reject) => {
        const postData = JSON.stringify({
            first_name: 'Test',
            last_name: 'User',
            age: 30,
            email: generatedEmail,
            password: generatedPassword,
        });

        const req = http.request(`${api_url}/api/sessions/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData),
            },
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                console.log('Register status:', res.statusCode);
                console.log('Register response:', data);
                try {
                    assert.strictEqual(res.statusCode, 200);
                    console.log('Register test passed');
                    resolve();
                } catch (err) {
                    console.error('Register test failed:', err);
                    reject(err);
                }
            });
        });

        req.on('error', error => {
            console.error('Request error (register):', error);
            reject(error);
        });

        req.write(postData);
        req.end();
    });
};

const testLogin = () => {
    return new Promise((resolve, reject) => {
        const postData = JSON.stringify({
            email: generatedEmail,
            password: generatedPassword,
        });

        const req = http.request(`${api_url}/api/sessions/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData),
            },
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                console.log('Login status:', res.statusCode);
                console.log('Login response:', data);
                try {
                    assert.strictEqual(res.statusCode, 200);
                    console.log('Login test passed');
                    resolve();
                } catch (err) {
                    console.error('Login test failed:', err);
                    reject(err);
                }
            });
        });

        req.on('error', error => {
            console.error('Request error (login):', error);
            reject(error);
        });

        req.write(postData);
        req.end();
    });
};

const runTests = async () => {
    try {
        await testRegister();
        await testLogin();
        console.log('All tests passed successfully!');
    } catch (error) {
        console.error('Some tests failed:', error);
    }
};

runTests();


