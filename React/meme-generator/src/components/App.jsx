import { useEffect, useState } from "react"

function App() {
    const [meme, setMeme] = useState({
        topText: "One does not simply",
        bottomText: "Walk into mordor",
        imageUrl: "http://i.imgflip.com/1bij.jpg"
    });
    const [allMemes, setAllMemes] = useState([]);

    useEffect(() => {
        fetch('https://api.imgflip.com/get_memes')
            .then(res => res.json())
            .then(data => setAllMemes(data.data.memes))
    }, []);

    const getMemeImage = () => {
        const randomNum = Math.floor(Math.random() * allMemes.length);
        const newMemeUrl = allMemes[randomNum].url;
        const newMemeAlt = allMemes[randomNum].name;
        setMeme(prevMeme => ({
            ...prevMeme,
            imageUrl: newMemeUrl,
            imageAlt: newMemeAlt
        }));
    }

    const handleChange = (event) =>{
        // console.log(event);
        const {value, name} = event.currentTarget;
        setMeme(prevMeme =>({
            ...prevMeme,
            [name]: value
        }));
    }

  return (
    <main>
            <div className="form">
                <label>Top Text
                    <input
                        type="text"
                        placeholder="One does not simply"
                        name="topText"
                        onChange={handleChange}
                        value={meme.topText}
                    />
                </label>

                <label>Bottom Text
                    <input
                        type="text"
                        placeholder="Walk into Mordor"
                        name="bottomText"
                        onChange={handleChange}
                        value={meme.bottomText}
                    />
                </label>
                <button onClick={getMemeImage}>Get a new meme image 🖼</button>
            </div>
            <div className="meme">
                <img src={meme.imageUrl} alt={meme.imageAlt}/>
                <span className="top">{meme.topText}</span>
                <span className="bottom">{meme.bottomText}</span>
            </div>
        </main>
  )
}

export default App
