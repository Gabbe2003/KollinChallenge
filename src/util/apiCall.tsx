import axios from 'axios';

const REACT_APP_API_URL = 'https://jgsbshesm5advigzznyid7juny.appsync-api.eu-north-1.amazonaws.com/graphql'
const REACT_APP_AUTH_TOKEN = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlhTVVAwa3ZaUHl3S296bkU1SkNGMW1KbnJnT29CdTRjVHBTMDViQWc4RXMifQ.eyJzdWIiOiIyNjQyMSIsImlkIjoyNjQyMSwiZiI6IjlhOTJmNjMxYzNmNjNkZDgzOGNiNzZjZTcwNDZiNmM5IiwibWF4QWxsb3dlZERldmljZXMiOjEsImdyb3VwcyI6WyJQVUJMSUMiXSwiYXVkIjoiaW50ZXJuYWwiLCJleHAiOjE3MTcxMDE0MDgsImlhdCI6MTcxNDUwOTQwOCwiaXNzIjoiaHR0cHM6Ly9hcGkudG50b3Iuc2Uvb2lkYyJ9.QmNBGduFAihbzKd2ETRQ1DukxHta8_G-CRK8RHtLhAqFDcD9pcK6mbdZCRYx-TKG2Ovyi1LS7MpcG-mYNsq8kNrMOHWVgJtDNyJEjgdYQMFZwsfGikKu5KRNHHf1j8g8tYqEcT7Yw_Azv9uMeiGU1CcL1jGRBhbaqVo3G1pXCxVupHbHsKQn237DC7n2fbaiVVM2S2J1bOFSATbfj35yDJmgZzLOQWqGebl4UkfFZcgWImWcj1IwVRogrCWRK5HZbeElgIu02mlcD8XrFpOV1oFgEnMiMmHjdbgPvm_RX4-FkJTJXUXflVRQYhBFVtOH9bf-t1FTY8FM7kV19uRhHw"

const headers = {
    'Content-Type': 'application/json',
    'Authorization': REACT_APP_AUTH_TOKEN
};

export const fetchAssignment = async (id: string) => {
    const graphqlQuery = {
        query: `
            query GetAssignment($id: ID!) {
                getAssignment(id: $id) {
                    id
                    difficultyScore
                    questionText
                    solutionText
                    hints
                    answerOptions {
                        id
                        text
                        correct
                    }
                    createdAt
                    updatedAt
                }
            }
        `,
        variables: { id }
    };

    try {
        const response = await axios.post(REACT_APP_API_URL, graphqlQuery, { headers });
        if (response.data && response.data.data.getAssignment) {
            return response.data;
        } else {
            return null;
        }
    } catch (error) {
        console.error(`Failed to fetch data for ID ${id}:`, error);
        return null;
    }
};
