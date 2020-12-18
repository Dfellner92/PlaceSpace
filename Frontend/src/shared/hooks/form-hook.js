import { useCallback, useReducer } from 'react';



const formReducer = (state, action) => {
    switch (action.type) {
        case 'INPUT_CHANGE':
            let formIsValid = true;
            // now we find if all forms are valid, 
            // for-in loop b/c inputs state is object
            for (const inputId in state.inputs) {
                if (!state.inputs[inputId]) {
                    continue;
                }
                if (inputId === action.inputId) {
                    formIsValid = formIsValid && action.isValid;
                } else {
                    formIsValid = formIsValid && state.inputs[inputId].isValid;
                }
            }

            return {
                //make copy of initial state
                ...state,
                // now update
                inputs: {
                    ...state.inputs,
                    // eg when title comes in as action.inputId, 
                    // it will update the value and isValid
                    [action.inputId]: { value: action.value, isValid: action.isValid }
                },
                isValid: formIsValid
            };
        case 'SET_DATA':
            return {
                inputs: action.inputs,
                isValid: action.formIsValid
            };
        default: 
            return state;
    }
};

export const useForm = (initialInputs, initialFormValidity) => {
    //calls formReducer and passes initial state
    const [formState, dispatch] = useReducer(formReducer, {
        inputs: initialInputs,
        isValid: initialFormValidity
    });

    // manages validity and values of form portions
    const inputHandler = useCallback((id, value, isValid) => {
        dispatch({
            type: 'INPUT_CHANGE', 
            value: value, 
            isValid: isValid, 
            inputId: id 
        });
    }, [dispatch]);

    const setFormData = useCallback((inputData, formValidity) => {
        dispatch({
            type: 'SET_DATA',
            inputs: inputData,
            formIsValid: formValidity
        });
    }, []);

    return [formState, inputHandler, setFormData]
};
