import OnGame from "./OnGame.js";
import React, { useEffect, useReducer } from "react";

import { useContext, useState } from "react";
import { CursorPositionContext } from "./CursorPositionDetection.js";

import { debounce } from "lodash";

import Button from "./Button.js";
import playButton from "./assets/new_png/button2.png";
import mainTitle from "./assets/new_png/main_title.png";

import characterPaper from "./assets/new_png/char_paper_256.png";
import characterRock from "./assets/new_png/char_rock_256.png";
import characterScissors from "./assets/new_png/char_scissors_256.png";
import { useGlobalAudioPlayer } from "react-use-audio-player";

import mainMenuMusic from "./assets/audio/music_1.mp3";
import onGameMusic from "./assets/audio/music_2.mp3";
import StringEffect from "./StringEffect.js";

import chalk from "chalk";

const WINDOWSIZE_SMALL = 768;

export const WindowSizeContext = React.createContext(
    window.innerWidth <= WINDOWSIZE_SMALL ? true : false
);

const App = () => {
    const { cursorPosition } = useContext(CursorPositionContext);
    const [mainMenuActive, setMainMenuActive] = useState(true);
    const [difficulty, setDifficulty] = useState("easy");
    const [character, setCharacter] = useState(0);
    const characters = [characterRock, characterPaper, characterScissors];
    const { load, play, fade, seek } = useGlobalAudioPlayer();

    const [isWindowSmall, setWindowSmall] = useState(false);

    const roundCountOptions = [0, 1, 3, 5];
    const [roundCount, setRoundCount] = useState(0);

    const songs = [mainMenuMusic, onGameMusic];
    const [songIndex, setSongIndex] = useState(0);

    const eel = window["eel"];
    eel.set_host("ws://localhost:8888");

    const defaultVolume = 0.05;

    const playBGMusic = () => {
        const music = load(songs[songIndex], {
            volume: defaultVolume,
            loop: true,
        });

        // seek at random position
        const randomPosition = Math.floor(Math.random() * 100);
        seek(randomPosition);

        play(music);
        fade(0, defaultVolume, 1000);
    };

    useEffect(() => {
        playBGMusic();
    }, [songIndex]);

    const changeSong = () => {
        if (songIndex == 0) {
            setSongIndex(1);
        } else {
            setSongIndex(0);
        }
    };

    const handleResize = debounce(() => {
        const newBrowserWidth = window.innerWidth;
        if (newBrowserWidth <= WINDOWSIZE_SMALL) {
            setWindowSmall(true);
        } else {
            setWindowSmall(false);
        }

        console.log(chalk.red("isWindowSmall: " + isWindowSmall));
    }, 50);

    useEffect(() => {
        if (isWindowSmall) {
            // toggleContainersState({ type: "SHOWN_AND_CONTRACTED" });
        } else {
            // toggleContainersState({ type: "HIDDEN_AND_EXPANDED" });
        }
    }, []);

    useEffect(() => {
        window.addEventListener("resize", handleResize);

        handleResize();

        // if (currentContainersState.isAuto) {
        //     toggleContainersState({ type: "TOGGLE_BOTH" });
        // }

        // // after manual toggle sidebar, reset auto toggle
        // if (currentContainersState.toBeReset) {
        //     if (!isWindowSmall) {
        //         toggleContainersState({ type: "TOGGLE_MAIN_CONTAINER" });
        //     }
        //     toggleContainersState({ type: "TOGGLE_AUTO" });
        //     toggleContainersState({ type: "TOGGLE_RESET", payload: false });
        // }

        // if (currentContainersState.overlay === "overlay-active") {
        //     toggleContainersState({ type: "TOGGLE_OVERLAY" });
        // }

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [isWindowSmall]);

    useEffect(() => {
        const backgroundGIFContainer = document.querySelector(
            ".background-container"
        );
        const backgroundGIF = document.querySelector(".background-image");

        const x = (cursorPosition.x / backgroundGIFContainer.offsetWidth) * 100;
        const y =
            (cursorPosition.y / backgroundGIFContainer.offsetHeight) * 100;

        const zoomLevel = 105;
        const panSensitivity = 5;

        const backgroundSize = `${zoomLevel}%`;
        const backgroundPosition = `${50 + x / panSensitivity}% ${
            50 + y / panSensitivity
        }%`;

        backgroundGIF.style.backgroundSize = backgroundSize;
        backgroundGIF.style.backgroundPosition = backgroundPosition;
    }, [cursorPosition]);

    const toggleMainMenu = () => {
        setMainMenuActive(!mainMenuActive);
        changeSong();
    };

    const toggleDifficulty = () => {
        if (difficulty == "easy") {
            setDifficulty("hard");
        } else {
            setDifficulty("easy");
        }
    };

    const toggleCharacter = () => {
        if (character == 2) {
            setCharacter(0);
        } else {
            setCharacter(character + 1);
        }
    };

    const toggleRoundCount = () => {
        // cycle through round count options
        roundCount == 3 ? setRoundCount(0) : setRoundCount(roundCount + 1);
    };  

    const mainMenu = {
        toggleMainMenu: toggleMainMenu,
    };

    return (
        <WindowSizeContext.Provider value={isWindowSmall}>
            <div className="background-container">
                <div className="background-image"></div>
            </div>

            {mainMenuActive == true ? (
                <div className="menu_and_title_container">
                    <img
                        className="main_title"
                        src={mainTitle}
                        alt="main title"
                    />
                    <div className="main_menu_container">
                        <div className="character_selection">
                            <Button
                                image={characters[character]}
                                onClickFunction={toggleCharacter}
                                classes_img={`character_option`}
                            />
                            <div className="character_info">
                                <StringEffect className="value" text="Name: " />
                                <StringEffect
                                    text={
                                        character == 0
                                            ? "Caelus"
                                            : character == 1
                                            ? "Origami"
                                            : "Trim"
                                    }
                                />
                                <br />
                                <StringEffect
                                    className="value"
                                    text="Affinity:"
                                />
                                <StringEffect
                                    text={
                                        character == 0
                                            ? "Rock"
                                            : character == 1
                                            ? "Paper"
                                            : "Scissors"
                                    }
                                />
                            </div>
                        </div>

                        <Button
                            classes_img={`main_menu_button`}
                            image={playButton}
                            text={difficulty}
                            onClickFunction={toggleDifficulty}
                        />
                        <Button
                            classes_img={`main_menu_button`}
                            image={playButton}
                            text="Play"
                            onClickFunction={toggleMainMenu}
                        />
                        <Button
                            classes_img={`main_menu_button`}
                            classes_text={`round_count`}
                            classes="round_count_button"
                            image={playButton}
                            text={`${
                                roundCountOptions[roundCount] == 0
                                    ? "Infinite"
                                    : "best of " + roundCountOptions[roundCount]
                            }`}
                            onClickFunction={toggleRoundCount}
                        />
                    </div>
                </div>
            ) : (
                <OnGame
                    mainFunction={mainMenu}
                    characterSelectedMain={character}
                    difficultySelected={difficulty}
                    bestOfSelected={roundCountOptions[roundCount]}
                    eel={eel}
                />
            )}
        </WindowSizeContext.Provider>
    );
};

export default App;
