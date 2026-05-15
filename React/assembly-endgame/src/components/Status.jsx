import clsx from "clsx";

function StatusBar(props) {
    const { isGameOver, farewellMessage, isGameWon, isGameLost } = props;
    
    const className = clsx("status-bar", {
        "won": isGameWon,
        "lost": isGameLost,
        "farewell": farewellMessage && !isGameOver
    });

    if (!isGameOver && !farewellMessage){
        return <div className="status-bar hidden"></div>
    }

    return (
        <div className={className} aria-live="polite">
            {isGameWon && (
                <>
                    <h1>You win!</h1>
                    <p>Well done! 🎉</p>
                </>
            )}
            {isGameLost && (
                <>
                    <h1>Game Over!</h1>
                    <p>You lose! Better start learning Assembly 😭</p>
                </>
            )}
            {!isGameOver && farewellMessage &&
                <p>{farewellMessage}</p>
            }
        </div>
    )
}

export default StatusBar