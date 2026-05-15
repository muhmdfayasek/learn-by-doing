import clsx from "clsx";

export default function Langchip(props) {
    const styles = {
        backgroundColor: props.backgroundColor,
        color: props.color
    }

    let className = clsx("lang-chip", props.lostLive && "lost-live");

    return (
        <span className={className} style={styles}>{props.name}</span>
    )
}