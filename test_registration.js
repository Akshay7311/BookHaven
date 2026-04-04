const testRegistrationWithPhone = async () => {
    const email = `test_phone_${Math.random().toString(36).substring(7)}@example.com`;
    const phone = "+1 234 567 890";
    console.log(`[Testing Registration with Phone]: ${email}, ${phone}`);
    
    try {
        const response = await fetch('http://localhost:5001/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: "Antigravity Phone User",
                email: email,
                password: "password123",
                phone: phone
            })
        });

        const data = await response.json();
        
        if (response.ok) {
            console.log('[Registration Success]:', data.email, 'Phone:', data.phone || 'MISSING');
        } else {
            console.error('[Registration Failed]:', data.message || 'Unknown error');
        }
    } catch (error) {
        console.error('[Network Error]:', error.message);
    }
};

testRegistrationWithPhone();
