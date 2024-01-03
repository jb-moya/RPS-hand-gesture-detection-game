import OnGame from "./OnGame.js";
import { useEffect } from "react";

import { useContext, useState } from "react";
import { CursorPositionContext } from "./CursorPositionDetection.js";

import Button from "./Button.js";
import playButton from './assets/new_png/button2.png';
import mainTitle from './assets/new_png/main_title.png';

import characterPaper from './assets/new_png/char_paper_128.png';
import characterRock from './assets/new_png/char_rock_128.png';
import characterScissors from './assets/new_png/char_scissors_128.png';

const App = () => {
  const { cursorPosition } = useContext(CursorPositionContext);
  const [mainMenuActive, setMainMenuActive] = useState(true);
  const [difficulty, setDifficulty] = useState('easy');
  const [character, setCharacter] = useState(0);
  const characters = [characterPaper, characterRock, characterScissors];

  const eel = window["eel"];
  eel.set_host("ws://localhost:8888");

  useEffect(() => {
    const backgroundGIFContainer = document.querySelector('.background-container');
    const backgroundGIF = document.querySelector('.background-image');

    const x = cursorPosition.x / backgroundGIFContainer.offsetWidth * 100;
    const y = cursorPosition.y / backgroundGIFContainer.offsetHeight * 100;
    
    const zoomLevel = 105; 
    const panSensitivity = 5;

    const backgroundSize = `${zoomLevel}%`;
    const backgroundPosition = `${50 + x / panSensitivity}% ${50 + y / panSensitivity}%`;

    backgroundGIF.style.backgroundSize = backgroundSize;
    backgroundGIF.style.backgroundPosition = backgroundPosition;

  }, [cursorPosition]);
  
  const toggleMainMenu = () => {
    setMainMenuActive(!mainMenuActive);
  }

  const toggleDifficulty = () => {
    if (difficulty == 'easy') {
      setDifficulty('hard');
    } else {
      setDifficulty('easy');
    }
  }

  const toggleCharacter = () => {
    if (character == 2) {
      setCharacter(0);
    } else {
      setCharacter(character + 1);
    }

    console.log("currecnt character selected: " + character)
  }

  const mainMenu = {
    toggleMainMenu: toggleMainMenu,
  }

  return (
    <>
      <div className="background-container">
        <div className="background-image"></div>
      </div>

      {mainMenuActive == true ? (
        <>
          <img className="main_title" src={mainTitle} alt="main title"/>
          <div className="main_menu_container">
            <div className="character_selection">
              <Button 
                image={characters[character]}
                onClickFunction={toggleCharacter}
                classes_img={`character_option`}
              />
              <div className="character_info">
                <span className="value">Name:</span>
                <span>{character == 0 ? "Origami" : character == 1 ? "Caelus" : "Trim"}</span>
                <br />
                <span className="value">Affinity:</span>
                <span>{character == 0 ? "Paper" : character == 1 ? "Rock" : "Scissors"}</span>
              </div>
            </div>
            <Button image={playButton} text={difficulty} onClickFunction={toggleDifficulty}/> 
            <Button image={playButton} text="Play" onClickFunction={toggleMainMenu}/> 
          </div>
        </>
       ) : (
        <OnGame mainFunction={mainMenu} characterSelectedMain={character} difficultySelected={difficulty} eel={eel}/>
        )}

    </>
  );
}

export default App;
