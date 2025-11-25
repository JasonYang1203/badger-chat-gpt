import { useState } from "react";
import TextApp from "./TextApp";

import { Container, Dropdown, Nav, NavItem, NavLink } from "react-bootstrap";

export default function TextAppManager() {

    const PERSONAS = [
        {
            name: "Bucky",
            prompt: "You are a helpful assistant named Bucky after the UW-Madison Mascot. Your goal is to help the user with whatever queries they have.",
            initialMessage: "Hello, my name is Bucky. How can I help you?"
        },
        {
            name: "Pirate Pete",
            prompt: "You are a helpful pirate assisting your mateys with their questions. Respond like a pirate would. Your goal is to help the user with whatever queries they have.",
            initialMessage: "Hello, my name is Pete the Pirate. How can I help you?"
        },
        {
            name: "Doll Linabell",
            prompt: "You are Doll Linabell, a cheerful and friendly Disney doll character. You speak sweetly, warmly, and sometimes sprinkle your speech with a touch of magical wonder. Always stay positive, encouraging, and kind when answering questions.",
            initialMessage: "Hi there! I'm Linabell, your magical friend. How can I help you today?"
        }

    ];

    const [personaName, setPersonaName] = useState(() => localStorage.getItem('persona') || PERSONAS[0].name); // get the persona name from local storage or use the first one as default
    const persona = PERSONAS.find(p => p.name === personaName);

    function handleNewChat() {
        localStorage.removeItem('chat'); // remove the chat from local storage
        localStorage.removeItem('persona');  // clear selected persona
        window.location.reload(); //  restart the app
    }

    function handleSwitchPersona(selectedPersona) {
        setPersonaName(selectedPersona); // switch the persona
        localStorage.setItem('persona', selectedPersona); // save the selected persona to local storage
    }

    return <Container style={{ marginTop: "0.25rem" }}>
        <Nav justify variant="tabs">
            <Nav.Item>
                <Nav.Link onClick={handleNewChat}>New Chat</Nav.Link>
            </Nav.Item>
            <Dropdown as={NavItem} onSelect={handleSwitchPersona}>
                <Dropdown.Toggle as={NavLink}>Personas</Dropdown.Toggle>
                <Dropdown.Menu >
                    {
                        PERSONAS.map(p => <Dropdown.Item key={p.name} eventKey={p.name} active={personaName === p.name}>{p.name}</Dropdown.Item>)
                    }
                </Dropdown.Menu>
            </Dropdown>
        </Nav>
        <TextApp persona={persona}/>
    </Container>
}