const fetch = require('node-fetch');

async function testCall() {
    try {
        const response = await fetch('http://localhost:3000/api/call', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                phoneNumber: '+14155551234' // Test phone number
            })
        });

        const data = await response.json();
        console.log('Call response:', data);
    } catch (error) {
        console.error('Error testing call:', error);
    }
}

testCall(); 