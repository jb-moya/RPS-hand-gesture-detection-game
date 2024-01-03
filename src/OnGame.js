import React, { useState, useEffect } from "react";
import "./App.css";
import player1Nameplate from './assets/new_png/nameplate_player.png';
import player2Nameplate from './assets/new_png/nameplate_ai.png';
import stagePlayer from './assets/new_png/stage_player.png';
import stageAI from './assets/new_png/stage_ai.png';
import textbox from './assets/new_png/textbox.png';

import countdownReady from './assets/new_png/countdown_ready.png';
import countdownSet from './assets/new_png/countdown_set.png';
import countdownGo from './assets/new_png/countdown_go.png';

import handIdle from './assets/gif/RPS_hand_idle.gif';
import handRock from './assets/new_png/RPS_hand_rock.png';
import handPaper from './assets/new_png/RPS_hand_paper.png';
import handScissors from './assets/new_png/RPS_hand_scissors.png';
import youLose from './assets/new_png/youlose.png';
import youWin from './assets/new_png/youwin.png';
import draw from './assets/new_png/draw.png';
import portraitRock from './assets/new_png/portrait_rock.png';
import portraitAi from './assets/new_png/portrait_ai.png';
import pauseButton from './assets/new_png/button_pause.png';
import StringEffect from "./StringEffect.js";

import Pause from "./Pause.js";

import Button from "./Button.js";

const OnGame = ({ mainFunction, characterSelectedMain, difficultySelected, eel }) => {
  const weight = 640;
  const height = 480;
  const enable_video_inference = false; 

  let character = characterSelectedMain;
  console.log("characterSelectedMain: " + characterSelectedMain)

  const payoffMatrix = {
    rock: { rock: 0, paper: -1, scissors: 1, },
    paper: { rock: 1, paper: 0, scissors: -1, },
    scissors: { rock: -1, paper: 1, scissors: 0, },
  }
  
  const [playerAttackHistory, setPlayerAttackHistory] = useState([]);
  const [scores, setScores] = useState([0, 0]); // [player, ai
  const [gameStart, setGameStart] = useState(false);
  const difficulty = difficultySelected;
  const [counter, setCounter] = useState(0);
  const [isDetectOn, setIsDetectOn] = useState(true);
  const [playerAttack, setPlayerAttack] = useState('');
  const choices = ['rock', 'paper', 'scissors'];

  const [isPaused, setIsPaused] = useState(false);

  const [confThreshSelected, setConfThreshSelected] = useState(0.6);

  const countdownImage = [countdownReady, countdownSet, countdownGo];
  const payoffImage = [youWin, youLose, draw];
  const handImage = [handIdle, handRock, handPaper, handScissors];
  const [aiAttack, setAiAttack] = useState(0);
  const countdownSpeedMS = 200; //default 1000
  const roundCooldownMS = 500; //default 2000
  const gameStartDelay = 1000;

  const randomMovement = 'transform 800ms cubic-bezier( 0.79, 0.33, 0.14, 0.53 )';
  const countdownElement = document.getElementById('countdown');
  const typewriterContainer = document.getElementsByClassName('typewriter_container')[0];
  const payyOffMessageElement = document.getElementsByClassName('payoff_message')[0];

  const player1PortraitImage = document.getElementsByClassName('player_1_portrait')[0];
  const player2PortraitImage = document.getElementsByClassName('player_2_portrait')[0];

  const setupWebcam = () => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(function (stream) {
        document.getElementById('webcam').srcObject = stream;

        document.getElementById('webcam').onloadedmetadata = function (e) {
          document.getElementById('webcam').play();
        };
      })
      .catch(function (err) {
        console.error('Error accessing webcam:', err);
      });
  }

  const captureFrame = async () => {
    try {
      console.log("capturing")

      let video = document.getElementById('webcam');
      let canvas = document.getElementById('canvas');
      let context = canvas.getContext('2d');

      context.drawImage(video, 0, 0, weight, height);

      canvas.style.display = 'none';

      let frameData = canvas.toDataURL('image/jpeg');
      let detectedData = await eel.detect(frameData, weight, height)();
      
      context.clearRect(0, 0, canvas.width, canvas.height);

      canvas.style.display = 'block';

      for (let box of detectedData) {
        let { x1, y1, x2, y2 } = box.coordinates;
        let className = box.class_name;
        let confidence = box.confidence;

        context.drawImage(video, x1, y1, x2 - x1, y2 - y1, x1, y1, x2 - x1, y2 - y1);
        context.beginPath();
        context.lineWidth = "2";
        context.strokeStyle = "red";
        context.rect(x1, y1, x2 - x1, y2 - y1);
        context.stroke();

        context.font = "16px Arial";
        context.fillStyle = "red";
        context.fillText(`${className} (${confidence})`, x1, y1 - 5);
      }

      if (enable_video_inference) {
        console.log("UULIT DAPAT")
        setTimeout(() => captureFrame(), 1000);
      }
    } catch (error) {
      console.error('Error in captureFrame:', error);
    }
  }

  const adaptAiAttack = (playerAttack) => {
    let recentPlayerAttack = playerAttackHistory.slice(-5);
    let counts = {rock: 1, paper: 1, scissors: 1};

    for (let attack of recentPlayerAttack) {
      console.log("attack: " + attack)
      counts[attack] += 1;
    }

    for (const choice in counts) {
      const count = counts[choice];
      if (count > 1) {
        counts[choice] -= 1;
      }
    }

    const total = Object.values(counts).reduce((sum, count) => sum + count, 0);

    const probabilities = [
      counts.scissors / total,
      counts.rock / total,
      counts.paper / total,
    ];

    console.log(" hehe = ? probabilities: " + probabilities[0] + " " + probabilities[1] + " " + probabilities[2])
    return probabilities;
  }

  const getPayoff = (playerAttack, aiAttack) => {
    return payoffMatrix[playerAttack][aiAttack];
  }

  useEffect(() => {
    eel.hello();
    eel.hello();

    setTimeout(() => {
      setGameStart(true);

      if (enable_video_inference) {
        setupWebcam();
        captureFrame();
      }
    }, gameStartDelay);

    const countdownContainer = document.querySelector('.countdown_container');

    const animateTranslate = () => {
      const randomTop = Math.random() * 2 + 49;
      const randomLeft = Math.random() * 2 + 49;

      countdownContainer.style.transform = `translate(-${randomLeft}%, -${randomTop}%)`;
      countdownContainer.style.transition = randomMovement;

      setTimeout(animateTranslate, 800); // Adjust the delay as needed
    };

    animateTranslate();

    return () => {
      clearTimeout(animateTranslate)
    };
  }, []);


  useEffect(() => {
    if (gameStart === false) { return; }

    if (!isDetectOn) {
      setPlayerAttack('');
      setAiAttack(0);
      payyOffMessageElement.innerHTML = ``;
    }

    const keyEventListener = detectKey();
    document.addEventListener('keydown', keyEventListener);

    let intervalId = null;
    const startInterval = () => {
      intervalId = setInterval(() => {

          if (counter !== 2 && playerAttack === '') {
            setCounter((prevCounter) => (prevCounter + 1) % 3);
          }
          else if (counter === 2 && playerAttack !== '') {
            setCounter((prevCounter) => (prevCounter + 1) % 3);
            setIsDetectOn(false);
          }
      }, isDetectOn ? roundCooldownMS : countdownSpeedMS);
    };

    startInterval();

    return () => {
      document.removeEventListener('keydown', keyEventListener);
      clearInterval(intervalId);
    };
  }, [isDetectOn, counter, playerAttack, gameStart]);


  const detectKey = () => {
    return function(event) {
      if (isDetectOn === false) { console.log("detect off!"); return;}

      if (playerAttack !== '') { console.log("player attack already!"); return; }

      if (event.key === 'a') {
        setPlayerAttack('rock');
      }
      else if (event.key === 's') {
        setPlayerAttack('paper');
      }
      else if (event.key === 'd') {
        setPlayerAttack('scissors');
      }
    };
  };

  useEffect(() => {
    if (playerAttack === '') { return; }

    // console.log("playerAttac: " + playerAttack)
    setPlayerAttackHistory((prevPlayerAttackHistory) => [...prevPlayerAttackHistory, playerAttack]);
  }, [playerAttack]);

  useEffect(() => {
    console.log("playerAttackHistory: " + playerAttackHistory[0])
    console.log("playerAttackHistory: " + playerAttackHistory[1])

    let randomAiAttack;
    if (difficulty === 'hard') {
      let AiAttackProbabilities = adaptAiAttack(playerAttackHistory);
      randomAiAttack = choices[weightedRandom(AiAttackProbabilities)];
    }
    else {
      // equal chance
      randomAiAttack = choices[Math.floor(Math.random() * choices.length)];
    }

    setAiAttack(choices.indexOf(randomAiAttack) + 1);
  }, [playerAttackHistory]);

  useEffect(() => {
    if (playerAttack === '' || aiAttack === 0) { return; }

    let payoff = getPayoff(playerAttack, choices[aiAttack - 1]);

    if (payoff === 1) {
      console.log("NANALO")
      console.log("playerAttack: " + playerAttack)
      console.log("characterSelected: " + choices[character])

      if (playerAttack === choices[character]) {
        setScores((prevScores) => [prevScores[0] + 2, prevScores[1]]);
      }
      else {
        setScores((prevScores) => [prevScores[0] + 1, prevScores[1]]);
      }

      player2PortraitImage.style.animation = "blink 1s forwards";
      countdownElement.src = payoffImage[0];
      payyOffMessageElement.innerHTML = `${playerAttack} beats ${choices[aiAttack - 1]}. You Win!`
    } else if (payoff === -1) {
      setScores((prevScores) => [prevScores[0], prevScores[1] + 1]);
      player1PortraitImage.style.animation = "blink 1s forwards";

      countdownElement.src = payoffImage[1];
      payyOffMessageElement.innerHTML = `${choices[aiAttack - 1]} beats ${playerAttack}. You Lose!`
    } else {
      countdownElement.src = payoffImage[2];
      payyOffMessageElement.innerHTML = `${playerAttack} draws with ${choices[aiAttack - 1]}. It's a draw!`
    }

    typewriterContainer.classList.add('typewriter');

    setTimeout(() => {
      player1PortraitImage.style.animation = "";
      player2PortraitImage.style.animation = "";

      typewriterContainer.classList.remove('typewriter');
    }, roundCooldownMS);

    const countdownContainer = document.getElementsByClassName('countdown_container')[0];
    const countdownImage = document.getElementById('countdown');

    console.log("countdownContainer: " + countdownContainer)

    countdownImage.classList.add('hue-rotate');
    // Remove the class after a delay
    setTimeout(() => {
      countdownImage.classList.remove('hue-rotate');
    }, roundCooldownMS);

  }, [playerAttack, aiAttack]);

  const weightedRandom = (probabilities) => {
    const total = probabilities.reduce((acc, prob) => acc + prob, 0);
    const randomValue = Math.random() * total;

    let cumulativeProbability = 0;
    for (let i = 0; i < probabilities.length; i++) {
      cumulativeProbability += probabilities[i];
      if (randomValue < cumulativeProbability) {
        return i; // Return the index of the chosen element
      }
    }

    // This should not happen under normal circumstances, but just in case
    return probabilities.length - 1;
  }

  useEffect (() => {
    if (counter === 2) { setIsDetectOn(true); }
    else { setIsDetectOn(false); }

    const countdownContainer = document.getElementsByClassName('countdown_container')[0];

    countdownContainer.style.transition = randomMovement;
    countdownContainer.style.opacity = 0;

    let randomX = Math.floor(Math.random() * 10) + 45;
    let randomY = Math.floor(Math.random() * 10) + 45;

    countdownContainer.style.left = `${randomX}%`;
    countdownContainer.style.top = `${randomY}%`;

    countdownContainer.offsetHeight;
    
    countdownContainer.style.transition = `transform 400ms, left 200ms, top 200ms, opacity 200ms cubic-bezier( 0.79, 0.33, 0.14, 0.53 )`;
    countdownContainer.style.opacity = 1;
    
    countdownContainer.style.left = '50%';
    countdownContainer.style.top = '50%';
  }, [counter, playerAttack, aiAttack]);

  const togglePauseGame = () => {
    setIsPaused(prevIsPaused => !prevIsPaused);
  }

  const changeConfThresh = (newConfThresh) => {
    if (newConfThresh === confThreshSelected) { return; }

    console.log("newConfThresh: " + newConfThresh )
    setConfThreshSelected(newConfThresh);
  }

  const pauseFunctions = {
    togglePauseGame: togglePauseGame,
    changeConfThresh: changeConfThresh,
    toggleMainMenu: mainFunction.toggleMainMenu,
  };

  return (
    <div className={`App overlay ${isPaused ? 'overlay-active' : 'overlay-deactive'}`}>
      {isPaused ? (<Pause pauseFunctions={pauseFunctions} currentConfThresh={confThreshSelected}/>)
      : (<Button image={pauseButton} onClickFunction={togglePauseGame} classes_img="pause_button" />)}

      <div className="nameplate_container">
        <div className="player_1_nameplate_container">
          <div className="player_1_username"><StringEffect text="Player"/></div>
          <img className="player_1_nameplate" src={player1Nameplate} alt="" />
          <img className="player_1_portrait" src={portraitRock} alt="" />
        </div>
          <div className="score_container">
              <div className="score"><StringEffect text={scores[0]}/></div>
              <div className="separator"><StringEffect text=":"/></div>
              <div className="score"><StringEffect text={scores[1]}/></div>
          </div>
        <div className="player_2_nameplate_container">
          <div className="player_2_username"><StringEffect text="A.I."/></div>
          <img className="player_2_nameplate" src={player2Nameplate} alt="" />
          <img className="player_2_portrait" src={portraitAi} alt="" />
        </div>
      </div>

      <div className="stage_container">
          <video id="webcam" width="640" height="480" autoPlay></video>
          <canvas id="canvas" width="640" height="480"></canvas>

          <img className="stage_player" src={stagePlayer} alt="" />

          <div className="stage_ai_container">
            <img className="stage_ai" src={stageAI} alt="" />
            <img className="hand_idle" src={handImage[aiAttack]} alt="" />
          </div>
      </div>

      <div className="payoff_message_container">
          <img className="payoff_message_background" src={textbox} alt="" />
          <div className="typewriter_container">
            <StringEffect text="" className="payoff_message"/>
          </div>
      </div>

      <div className="countdown_container">
        {gameStart &&
          <img id="countdown" className="countdown" src={countdownImage[counter]} alt="" />
        }
      </div>
    </div>
  );
}

export default OnGame;