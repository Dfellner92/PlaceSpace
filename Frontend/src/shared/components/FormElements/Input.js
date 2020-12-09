// using useReducer allows for more dynamic state change
// (ie) change several values under different conditions
// useEffect will allow for
import React, { useReducer, useEffect } from 'react';

import { validate } from '../../util/validators';
import './Input.css';

const inputReducer = (state, action) => {
    switch (action.type) {
        // waits for a change action
        case 'CHANGE':
            return {
                //spread operator makes a copy of ingoing state
                ...state,
                //new state values
                value: action.val,
                isValid: validate(action.val, action.validators)
            };
        case 'TOUCH':
            return {
                ...state,
                isTouched: true
            };
        default: 
            return state;
    }
};

const Input = props => {
    //functions from useReducer, inputState is state, dispatch runs inputReducer 
    const [inputState, dispatch] = useReducer(inputReducer, {
        value: '', 
        isValid: false,
        isTouched: false
    });

    const { id, onInput } = props;
    const { value, isValid } = inputState

    useEffect(() => {
        onInput(id, value, isValid)
        // both are 
    }, [id, onInput, value, isValid])

    const changeHandler = event => {
        // event.target.value recognizes where changeHandler is called 
        dispatch({
            type: 'CHANGE', 
            val: event.target.value, 
            validators: props.validators 
        });
    };
    
    const touchHandler = () => {
        dispatch({
            type: 'TOUCH'
        });
    }
    
    const element = 
        props.element === 'input' ? (
            <input 
                id={props.id} 
                type={props.type} 
                placeholder={props.placeholder}
                onChange={changeHandler}
                onBlur={touchHandler}
                // two way binding
                value={inputState.value}
            /> 
        ) : (
            <textarea 
                id={props.id} 
                rows={props.rows || 3}
                onChange={changeHandler}
                onBlur={touchHandler}
                value={inputState.value}
            />
    );



    

    return <div className={`form-control ${!inputState.isValid && inputState.isTouched &&
        'form-control--invalid'}`}
    >
         <label htmlFor={props.id}>{props.label}</label>
        {element}
        {/* essentially an extra validator */}            
        {!inputState.isValid && inputState.isTouched && <p>{props.errorText}</p>}
    </div>
};

export default Input;