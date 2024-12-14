export async function saveDataAndChatHistory() {
    const response = await fetch('http://localhost:3000/api/save_data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            ehr_data: {
                name: {
                    prefix: 'Mr.',
                    firstname: 'John',
                    surname: 'Doe',
                },
                age: 30,
                gender: 'male',
                chief_complaint: ['Headache', 'Fever'],
                present_illness: ['Coughing for 3 days', 'Sore throat'],
                past_illness: ['Chickenpox', 'Asthma'],
                family_history: [
                    { relation: 'Father', condition: 'Diabetes' },
                    { relation: 'Mother', condition: 'Hypertension' },
                ],
                personal_history: [
                    { type: 'Smoking', description: 'Smokes 10 cigarettes a day' },
                    { type: 'Alcohol', description: 'Drinks occasionally' },
                ],
            },
            chat_history: [
                { role: 'patient', content: 'I have been feeling unwell.' },
                { role: 'doctor', content: 'Can you describe your symptoms?' },
            ],
        }),
    });

    if (!response.ok) {
        console.error('Failed to save data and chat history:', await response.json());
    } else {
        console.log('Data and chat history saved successfully!');
    }
}

saveDataAndChatHistory();