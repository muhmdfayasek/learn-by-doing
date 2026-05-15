import clsx from "clsx";

export default function Key(props) {
    const { cap, clickFunc, isCorrect, isWrong, isGameOver } = props;
    const className = clsx("key pointer", {
        "correct": isCorrect,
        "wrong": isWrong,
    });
    return (
        <button 
            className={className}
            onClick={() => clickFunc(cap)}
            disabled={isGameOver || isCorrect || isWrong}
        >{cap.toUpperCase()}</button>
    )
}