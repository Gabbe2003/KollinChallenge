import { useCallback, useEffect, useMemo, useState } from 'react';
import { fetchAssignment } from './util/apiCall';
import { IGraphQLResponse } from './interface/data';
import { FaHeart } from 'react-icons/fa';
import { FaCheck, FaLightbulb, FaCircle } from 'react-icons/fa';

const UserPage = () => {
    const [hint, setHint] = useState<string>('');
   
    const [assignments, setAssignments] = useState<Array<IGraphQLResponse | null>>([]);
    const [selectedAssignment, setSelectedAssignment] = useState<IGraphQLResponse | null>(null);
    const [selectedAnswer, setSelectedAnswer] = useState<string>('');
    

    const ids = useMemo(() => [
        "b1cdace3-479d-4c35-8bf4-9dadc5bdc71",
        "a983b41f-8b70-4970-8466-c0545ec1d3d0",
        "cb6393ff-2f29-44c1-91ee-9da296b1edd2",
        "bde984b3-7e98-42ad-8650-bd08d9c64473",
        "9de29654-bc7a-4552-a367-f438cbd1ce0d"
    ], []);

   
 
    const loadAssignments = useCallback(async () => {
        const assignments = await Promise.all(ids.map(id => fetchAssignment(id)));
        const validAssignments = assignments.filter((assignment): assignment is IGraphQLResponse => assignment !== null);
    
        validAssignments.forEach((assignment) => {
            assignment.data.getAssignment.heart = 3;
            assignment.data.getAssignment.completed = false;
        });
    
        setAssignments(validAssignments);
        setSelectedAssignment(validAssignments[0] || null);
    }, [ids]); 

    useEffect(() => {
        loadAssignments();
    }, [loadAssignments]);
    
   

    const selectAssignment = (assignment: IGraphQLResponse | null) => {
        setSelectedAssignment(assignment);
    };


    const resetProg = () => {
        setHint('');
        setSelectedAnswer('');
        setAssignments([]);
        loadAssignments();
    }

    const checkAnswer = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        if (!selectedAnswer || !selectedAssignment || selectedAssignment.data.getAssignment.completed) {
            return;
        }
        
        const correctAnswer = selectedAssignment.data.getAssignment.answerOptions.find(item => item.correct);
        if (correctAnswer && correctAnswer.text === selectedAnswer) {
            const updatedAssignment = {
                ...selectedAssignment,
                data: {
                    ...selectedAssignment.data,
                    getAssignment: {
                        ...selectedAssignment.data.getAssignment,
                        completed: true 
                    }
                }
            };
            const successMsg = 'Good jobb!'
            setSelectedAssignment(updatedAssignment);
            updateAssignmentsList(updatedAssignment);
            alert (successMsg);
            
        } else {
            if (selectedAssignment.data.getAssignment.heart > 1) {
                const updatedAssignment = {
                    ...selectedAssignment,
                    data: {
                        ...selectedAssignment.data,
                        getAssignment: {
                            ...selectedAssignment.data.getAssignment,
                            heart: selectedAssignment.data.getAssignment.heart - 1 
                        }
                    }
                };
                setSelectedAssignment(updatedAssignment);
                updateAssignmentsList(updatedAssignment);
                const falseMsg = 'Wrong answer!'
                alert(falseMsg);

            } else {
                resetProg();
            }
        }
        setSelectedAnswer('');
    };
    
    const updateAssignmentsList = (updatedAssignment: IGraphQLResponse) => {
        const updatedAssignments = assignments.map(assignment =>
            assignment === selectedAssignment ? updatedAssignment : assignment
        );
        setAssignments(updatedAssignments);
    };
    
   
    const getHint = () => {
        setHint(`Hint: ${selectedAssignment?.data.getAssignment.hints}`);
    }

    return (
        <div className='text-center mt-4'>
            <h1>Tirgonometriska funktioner & identiteter</h1>

            <div className='container bg-white text-dark user-page-container' id='div-container'>
                <div className='position-absolute top-0 end-0'>
                    <button className="btn" onClick={resetProg}>
                        <FaCircle />
                    </button>
                </div>
                <div className='d-flex gap-2 justify-content-center align-items-center mb-4 p-4'>
                    {assignments.map((assignment, index) => (
                        <div key={index} onClick={() => selectAssignment(assignment)}>
                            <div
                                className={`assignment-button ${selectedAssignment === assignment ? 'selected' : ''}`}
                                style={{
                                    backgroundColor:
                                        assignment?.data.getAssignment.heart === 3 ? 'green' :
                                        assignment?.data.getAssignment.heart === 2 ? 'yellow' : 'red'
                                }}>
                                {assignment?.data.getAssignment.completed ? <FaCheck /> : null}
                            </div>
                        </div>
                    ))}
                    {selectedAssignment && (
                        <div className='d-flex'>
                            {Array.from({ length: selectedAssignment.data.getAssignment.heart }, (_, i) => (
                                <FaHeart key={i} className='text-danger' />
                            ))}
                        </div>
                    )}
                </div>
                <div>
                    <form onSubmit={checkAnswer}>
                        {selectedAssignment && (
                            <div>
                                <p>{selectedAssignment.data.getAssignment.questionText}</p>
                                <div className='mt-4 d-grid gap-2'>
                                    {selectedAssignment.data.getAssignment.answerOptions.map((item, index) => (
                                        <div
                                            key={index}
                                            className={`answer-option ${selectedAnswer === item.text ? 'selected' : ''}`}>
                                            <label>
                                                <input
                                                    type="radio"
                                                    value={item.text}
                                                    checked={selectedAnswer === item.text}
                                                    onChange={() => setSelectedAnswer(item.text)}
                                                />
                                                {item.text}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                                <div className='d-flex flex-column mb-4'>
                                    <button type="submit" className='btn mb-3 bg-info text-white mt-3'>Check</button>
                                    <button onClick={getHint} className='btn w-100'>
                                        <FaLightbulb />
                                    </button>
                                    <p>{hint === null ? '' : hint }</p>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};    

export default UserPage;