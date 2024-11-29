import './EventBoxComponent.css'
import {useEffect, useState} from "react";
import {SSE_URL} from "../constants/constants";


function EventBoxComponent() {

    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const sse = new EventSource(SSE_URL);

        sse.onmessage = (event) => {
            setMessages((messages) => [event.data, ...messages]);
        };

        return () => {
            sse.close();
        };
    }, []);


    return (
        <div className="eventBox">
            <div className="eventBoxTitle">Liked Quotes Feed</div>
            <div className="messageBox">
                {messages.map((message, index) => (
                    <div className={index%2 === 0 ? "messageEven" : "messageOdd"} key={index}>{message}</div>
                ))}
            </div>
        </div>
    );

}

export default EventBoxComponent;