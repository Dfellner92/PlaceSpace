//      useCallback is to avoid infinite 
// loop between titleInputHandler and 
// Input's useEffect-onInput.

//      useReducer is used to manage multiple
// states
import React, { useCallback, useReducer } from 'react';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../shared/util/validators';
import './NewPlace.css';

const formReducer = (state, action) => {
    switch (action.type) {
        case 'INPUT_CHANGE':
            let formIsValid = true;
            // now we find if all forms are valid, 
            // for-in loop b/c inputs state is object
            for (const inputId in state.inputs) {
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
        default: 
            return state;
    }
};

const NewPlace = () => {
    //calls formReducer and passes initial state
    const [formState, dispatch] = useReducer(formReducer, {
        inputs: {
            title: {
                value: '',
                isValid: false
            },
            description: {
                value: '',
                isValid: false
            }
        },
        isValid: false
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

    const placeSubmitHandler = event => {
        event.preventDefault();
        console.log(formState.inputs); // this will be sent to backend (inputs validated)
    }
    
    return <form className="place-form" onSubmit={placeSubmitHandler}>
        <Input 
            id="title"
            element="input" 
            type="text" 
            label="Title" 
            validators={[ VALIDATOR_REQUIRE() ]} 
            errorText="Please enter a valid title"
            onInput={inputHandler}
        />
        <Input 
            id="description"
            //dont need type bc its textarea
            element="textarea" 
            label="Description" 
            validators={[ VALIDATOR_MINLENGTH(5)]} 
            errorText="Please enter a valid description (at least 5 characters)."
            onInput={inputHandler}
        />
        <Input 
            id="address"
            //dont need type bc its textarea
            element="input" 
            label="Address" 
            validators={[ VALIDATOR_REQUIRE() ]} 
            errorText="Please enter a valid address"
            onInput={inputHandler}
        />
        <Button type="submit" disabled={!formState.isValid}>
            ADD PLACE
        </Button>
    </form>;
};

export default NewPlace;