export interface IAnswerOption {
    id: string | null;
    text: string;
    correct: boolean;
}

export interface IAssignment {
    id: string;
    difficultyScore: number;
    questionText: string;
    solutionText: string;
    hints: string[];
    answerOptions: IAnswerOption[];
    createdAt: string;
    updatedAt: string;
    heart: number;
    completed: boolean;
}

export interface AssignmentData {
    getAssignment: IAssignment;
}

export interface IGraphQLResponse {
    data: AssignmentData;
}

export interface IUserPageState {
    assignment: IAssignment | null;
    error: string | null;
}
