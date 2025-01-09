import './EventBoxComponent.css'
import {useEffect, useState} from "react";
import {SSE_URL} from "../constants/constants";
import quoteApi from "../api/quoteApi";


function EventBoxComponent() {

    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadFavouriteQuotes();

        const sse = new EventSource(SSE_URL);

        sse.onmessage = (event) => {
            setMessages((messages) =>
                messages.includes(event.data) ? [...messages] : [event.data, ...messages]
            )
        };

        return () => {
            sse.close();
        };
    }, []);

    async function loadFavouriteQuotes() {
        try {
            setLoading(true);
            const quotes = await quoteApi.getLikedQuotes();
            setMessages(quotes.map(quote => quote.quoteText + " - " + quote.author));
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="eventBox">
            <button className="favouritesButton" disabled={loading} onClick={loadFavouriteQuotes}>
                {loading ? "Loading Favourite Quotes..." : "Favourite Quotes (Click to refresh)"}
            </button>
            <div className="messageBox">
                {messages.map((message, index) => (
                    <div className={index % 2 === 0 ? "messageEven" : "messageOdd"} key={index}>{message}</div>
                ))}
            </div>
        </div>
    );

}

export default EventBoxComponent;