function Loader() {
    return (
        <div className="loader-container" aria-live="polite">
            <div className="loader"></div>
            <p>Getting your recipe...</p>
        </div>
    );
}

export default Loader