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
import { useGlobalAudioPlayer } from 'react-use-audio-player';

import mainMenuMusic from './assets/audio/music_1.mp3';
import onGameMusic from './assets/audio/music_2.mp3';
import StringEffect from "./StringEffect.js";

const App = () => {
  const { cursorPosition } = useContext(CursorPositionContext);
  const [mainMenuActive, setMainMenuActive] = useState(true);
  const [difficulty, setDifficulty] = useState('easy');
  const [character, setCharacter] = useState(0);
  const characters = [characterRock, characterPaper, characterScissors];
  const { load, play, fade, seek } = useGlobalAudioPlayer();
  
  const songs = [mainMenuMusic, onGameMusic];
  const [songIndex, setSongIndex] = useState(0);

  const eel = window["eel"];
  eel.set_host("ws://localhost:8888");
  

  const playBGMusic = () => {
    const music = load(songs[songIndex], {
      volume: 0.25,
      loop: true,
    });

    // seek at random position
    const randomPosition = Math.floor(Math.random() * 100);
    seek(randomPosition);

    play(music);
    fade(0, .25, 1000);
  }
  
  useEffect(() => {
    playBGMusic();
  }, [songIndex]);

  const changeSong = () => {
    if (songIndex == 0) {
      setSongIndex(1);
    } else {
      setSongIndex(0);
    }
  }

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
    changeSong();
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
                <StringEffect className="value" text="Name: "/>
                <StringEffect text={character == 0 ? "Caelus" : character == 1 ? "Origami" : "Trim"} />
                <br />
                <StringEffect className="value" text="Affinity:" />
                <StringEffect text={character == 0 ? "Rock" : character == 1 ? "Paper" : "Scissors"} />
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
