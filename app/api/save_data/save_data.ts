import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';

export async function saveDataAndChatHistory(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed. Use POST only.' });
    }

    const jsonData = req.body;
    const ehr_data = jsonData.ehr_data
    const chat_history = jsonData.chat_history

    try {
        // Ensure that `ehr_data` and `chat_history` are provided
        if (!ehr_data || !chat_history || !Array.isArray(chat_history)) {
            return res.status(400).json({ error: 'EHR data and chat history are required. Chat history must be an array.' });
        }

        // Save EHR data
        const { data: patientData, error: patientError } = await supabase
            .from('Patient')
            .insert([{
                prefix: ehr_data.name.prefix,
                firstname: ehr_data.name.firstname,
                surname: ehr_data.name.surname,
                age: ehr_data.age,
                gender: ehr_data.gender,
            }])
            .select();

        if (patientError) throw patientError;

        const patientId = patientData[0].id;

        const { error: complaintError } = await supabase
            .from('ChiefComplaint')
            .insert(ehr_data.chief_complaint.map((complaint: string) => ({ patient_id: patientId, complaint })));

        if (complaintError) throw complaintError;

        const { error: illnessError } = await supabase
            .from('PresentIllness')
            .insert(ehr_data.present_illness.map((desc: string) => ({ patient_id: patientId, description: desc })));

        if (illnessError) throw illnessError;

        const { error: pastIllnessError } = await supabase
            .from('PastIllness')
            .insert(ehr_data.past_illness.map((illness: string) => ({ patient_id: patientId, illness })));

        if (pastIllnessError) throw pastIllnessError;

        const { error: familyHistoryError } = await supabase
            .from('FamilyHistory')
            .insert(
                ehr_data.family_history.map((history: { relation: string; condition: string }) => ({
                    patient_id: patientId,
                    relation: history.relation,
                    condition: history.condition,
                }))
            );

        if (familyHistoryError) throw familyHistoryError;

        const { error: personalHistoryError } = await supabase
            .from('PersonalHistory')
            .insert(
                ehr_data.personal_history.map((history: { type: string; description: string }) => ({
                    patient_id: patientId,
                    type: history.type,
                    description: history.description,
                }))
            );

        if (personalHistoryError) throw personalHistoryError;

        // Save chat history
        const { error: chatHistoryError } = await supabase
            .from('ChatHistory')
            .insert(
                chat_history.map((message: { role: string; content: string }) => ({
                    role: message.role,
                    content: message.content,
                    timestamp: new Date().toISOString(), // Optional: Save timestamp for each message
                }))
            );

        if (chatHistoryError) throw chatHistoryError;

        res.status(200).json({ message: 'Data and chat history saved successfully!' });
    } catch (error) {
        console.error('Error saving data and chat history:', error);
        res.status(500).json({ error: 'Failed to save data and chat history.' });
    }
}