import './App.scss';
import {useEffect, useRef, useState} from "react";
import quoteApi from "./api/quoteApi";
import EventBoxComponent from "./components/EventBoxComponent";

function App() {
    const [quote, setQuote] = useState({});
    const [receivedQuotes, setReceivedQuotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [liking, setLiking] = useState(false);
    const indexRef = useRef(0);

    useEffect(() => {
        fetchFirstQuote();
    }, [])

    async function fetchFirstQuote() {
        try {
            const quote = await quoteApi.getQuote();
            setQuote(quote);
            setReceivedQuotes([quote])
        } finally {
            setLoading(false);
        }
    }

    async function newQuote() {
        try {
            const quote = await quoteApi.getUniqueQuote(receivedQuotes);
            setQuote(quote);
            indexRef.current = receivedQuotes.length;
            setReceivedQuotes((prevReceivedQuotes) => [...prevReceivedQuotes, quote]);
        } finally {
            setLoading(false);
        }
    }

    async function like() {
        try {
            if (!quote.liked) {
                setLiking(true);
                const likeCount = await quoteApi.likeQuote(quote);
                if (likeCount > 0) {
                    //set liked to true on the quote in the receivedQuotes array and maintain the order of the quotes
                    setReceivedQuotes(prevReceivedQuotes =>
                        prevReceivedQuotes.map((item) => item.id === quote.id ? {...item, liked: true} : item ));

                    setQuote({...quote, liked: true});
                } else {
                    console.log("Failed to like quote for some reason, id=" + quote.id);
                }
            }
        } finally {
            setLiking(false);
        }
    }

    function previous() {
        console.log("previous, index=",indexRef.current);
        if (indexRef.current > 0) {
            indexRef.current = indexRef.current - 1;
            setQuote(receivedQuotes[indexRef.current]);
        }
    }

    function next() {
        if (indexRef.current < receivedQuotes.length) {
            indexRef.current = indexRef.current + 1;
            setQuote(receivedQuotes[indexRef.current]);
        }
    }

    function jumpToFirst() {
        indexRef.current = 0;
        setQuote(receivedQuotes[indexRef.current]);
    }

    function jumpToLast() {
        indexRef.current = receivedQuotes.length - 1;
        setQuote(receivedQuotes[indexRef.current]);
    }

    return (
        <div className="app">
            <div className="quoteView">
                <p>
                    "{loading ? "Loading..." : quote.quoteText}"
                </p>
                <p className="author">
                    {loading ? "" : quote.author}
                </p>
            </div>
            <div className="buttonBar">
                <div className="logo">
                    <div className="logo-header">CODE-BULTER</div>
                    <div className="logo-main">Quote</div>
                </div>
                <button className="newQuoteButton" disabled={loading} onClick={newQuote}>
                    {loading ? "Loading..." : "New Quote"}
                </button>
                <button className="likeButton" disabled={liking || quote.liked} onClick={like}>
                    {liking ? "Liking..." : "Like"}
                </button>
                <button className="previousButton" disabled={indexRef.current === 0} onClick={previous}>
                    Previous
                </button>
                <button className="nextButton" disabled={indexRef.current >= (receivedQuotes.length - 1)}
                        onClick={next}>
                    Next
                </button>
                <button className="firstButton" onClick={jumpToFirst}>
                    First
                </button>
                <button className="lastButton" onClick={jumpToLast}>
                    Last
                </button>
            </div>
            <EventBoxComponent/>
        </div>
    );
}

export default App;
