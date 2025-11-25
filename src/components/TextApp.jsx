import React, { useEffect, useRef, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { BeatLoader } from 'react-spinners';

import TextAppMessageList from './TextAppMessageList';
import Constants from '../constants/Constants';

function TextApp(props) {

    // Set to true to block the user from sending another message
    const [isLoading, setIsLoading] = useState(false);
    const justMounted = useRef(true);

    // Set to the messages that are currently in the chat. This is saved to local storage so that it persists across page reloads.
    const [messages, setMessages] = useState(() => {
        const saved = localStorage.getItem('chat');
        return saved ? JSON.parse(saved) : [];
    });
    const inputRef = useRef();

    /**
     * Called when the TextApp initially mounts.
     */
    async function handleWelcome() {
        if (messages.length === 0) {
            addMessage(Constants.Roles.Assistant, props.persona.initialMessage);   // Initial message from the assistant         
        }
    }

    /**
     * Called whenever the "Send" button is pressed.
     * @param {Event} e default form event; used to prevent from reloading the page.
     */
    async function handleSend(e) {
        e?.preventDefault();
        const input = inputRef.current.value?.trim();
        setIsLoading(true);
        if(input) {
            addMessage(Constants.Roles.User, input);
            inputRef.current.value = "";
            
            // Make the API call to get the response from the assistant
            const response = await fetch('https://cs571api.cs.wisc.edu/rest/s25/hw11/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CS571-ID': 'bid_bc69ed46c77aa7b48b9f05b514a9558c980d9921773473356ef62094c5746503'
                },
                body: JSON.stringify([
                    { role: Constants.Roles.Developer, content: props.persona.prompt }, // every API call will include the prompt
                    ...messages,
                    { role: Constants.Roles.User, content: input }
                ])
            });
    
            if (!response.ok) { // if the response is not ok, then we have an error
                const err = await response.json();
                addMessage(Constants.Roles.Assistant, `Error: ${err.msg}`);
            } else { // if the response is ok, then we have a message
                const data = await response.json();
                addMessage(Constants.Roles.Assistant, data.msg);
            }            
        }
        setIsLoading(false);
    }

    /**
     * Adds a message to the ongoing TextAppMessageList
     * 
     * @param {string} role The role of the message; either "user", "assistant", or "developer"
     * @param {*} content The content of the message
     */
    function addMessage(role, content) {
        setMessages(o => [...o, {
            role: role,
            content: content
        }]);
    }


    // This is where we set the initial message from the assistant.
    useEffect(() => {
        if (justMounted.current) {
            justMounted.current = false; // first load, don't reset messages
            return;
        }
        // user switched persona, reset conversation
        setMessages([
            {
                role: Constants.Roles.Assistant,
                content: props.persona.initialMessage
            }
        ]);
    }, [props.persona]);    

    
    // Always save the messages to local storage whenever they change
    useEffect(() => {
        localStorage.setItem('chat', JSON.stringify(messages));
    }, [messages]);
    

    return (
        <div className="app">
            <TextAppMessageList messages={messages}/>
            {isLoading ? <BeatLoader color="#36d7b7"/> : <></>}
            <div className="input-area">
                <Form className="inline-form" onSubmit={handleSend}>
                    <Form.Control
                        ref={inputRef}
                        style={{ marginRight: "0.5rem", display: "flex" }}
                        placeholder="Type a message..."
                        aria-label='Type and submit to send a message.'
                    />
                    <Button type='submit' disabled={isLoading}>Send</Button>
                </Form>
            </div>
        </div>
    );
}

export default TextApp;
