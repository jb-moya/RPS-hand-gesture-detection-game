import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import player1Nameplate from './assets/new_png/nameplate_player.png';
import handScissors from './assets/new_png/RPS_hand_scissors.png';
import countdownReady from './assets/new_png/countdown_ready.png';
import player2Nameplate from './assets/new_png/nameplate_ai.png';
import portraitRock from './assets/new_png/portrait_rock.png';
import countdownSet from './assets/new_png/countdown_set.png';
import stagePlayer from './assets/new_png/stage_player.png';
import countdownGo from './assets/new_png/countdown_go.png';
import handPaper from './assets/new_png/RPS_hand_paper.png';
import pauseButton from './assets/new_png/button_pause.png';
import portraitAi from './assets/new_png/portrait_ai.png';
import handRock from './assets/new_png/RPS_hand_rock.png';
import handIdle from './assets/gif/RPS_hand_idle.gif';
import itsATieSfx from './assets/audio/its_a_tie.ogg';
import criticalSfx from './assets/audio/critical.ogg';
import youLoseSfx from './assets/audio/you_lose.ogg';
import stageAI from './assets/new_png/stage_ai.png';
import textbox from './assets/new_png/textbox.png';
import youLose from './assets/new_png/youlose.png';
import youWinSfx from './assets/audio/you_win.ogg';
import damageSfx from './assets/audio/damage.mp3';
import youWin from './assets/new_png/youwin.png';
import readySfx from './assets/audio/ready.ogg';
import draw from './assets/new_png/draw.png';
import StringEffect from "./StringEffect.js";
import setSfx from './assets/audio/set.ogg';
import goSfx from './assets/audio/go.ogg';
import AIPlayer from './AIPlayer.js';
import useSound from 'use-sound';
import Button from "./Button.js";
import Pause from "./Pause.js";
import chalk from 'chalk';

const OnGame = ({ mainFunction, characterSelectedMain, difficultySelected, eel }) => {
  const weight = 640;
  const height = 480;
  const enable_video_inference = true;
  const maximumHistoryLength = 5;
  const defaultVolume = .05;
  const exaggeratedVolume = .1;
  const countdownSpeedMS = 500; //default 1000
  const roundCooldownMS = 1000; //default 2000
  const gameStartDelay = 1000;

  let character = characterSelectedMain;
  const difficulty = difficultySelected;

  const payoffMatrix = {
    rock: { rock: 0, paper: -1, scissors: 1, },
    paper: { rock: 1, paper: 0, scissors: -1, },
    scissors: { rock: -1, paper: 1, scissors: 0, },
  }
  
  const [playerAttackHistory, setPlayerAttackHistory] = useState([]);
  const [scores, setScores] = useState([0, 0]); // [player, ai]
  
  const [gameStart, setGameStart] = useState(false);
  const gameStartRef = useRef();
  
  const [counter, setCounter] = useState(0);

  const [allowDetection, setAllowDetection] = useState(false);
  
  const [yoloDetected, setYoloDetected] = useState({ value: '' });

  const [playerAttack, setPlayerAttack] = useState('');
  const [isPlayerAlreadyAttacked, setIsPlayerAlreadyAttacked] = useState(false);

  const choices = ['rock', 'paper', 'scissors'];

  const [isPaused, setIsPaused] = useState(false);

  const [confThreshSelected, setConfThreshSelected] = useState(0.8);

  const [currentRoundWinner, setCurrentRoundWinner] = useState('');

  const countdownImage = [countdownReady, countdownSet, countdownGo];
  const payoffImage = [youWin, youLose, draw];
  const handImage = [handIdle, handRock, handPaper, handScissors];
  const [aiAttack, setAiAttack] = useState(0);

  const randomMovement = 'transform 800ms cubic-bezier( 0.79, 0.33, 0.14, 0.53 )';
  const countdownElement = document.getElementById('countdown');
  const typewriterContainer = document.getElementsByClassName('typewriter_container')[0];
  const payOffMessageElement = document.getElementsByClassName('payoff_message')[0];

  const player1PortraitImage = document.getElementsByClassName('player_1_portrait')[0];
  const player2PortraitImage = document.getElementsByClassName('player_2_portrait')[0];
  
  const player1ScoreRef = useRef(null);
  const player2ScoreRef = useRef(null);

  const useSoundEffect = (sound, volume = defaultVolume) => {
    return useSound(sound, {
      volume: volume,
    });
  };

  const [playYouLoseSfx] = useSoundEffect(youLoseSfx);
  const [playYouWinSfx] = useSoundEffect(youWinSfx);
  const [playItsATieSfx] = useSoundEffect(itsATieSfx);
  const [playReadySfx] = useSoundEffect(readySfx);
  const [playSetSfx] = useSoundEffect(setSfx);
  const [playGoSfx] = useSoundEffect(goSfx);
  const [playCriticalSfx] = useSoundEffect(criticalSfx, exaggeratedVolume);
  const [playDamageSfx] = useSoundEffect(damageSfx, exaggeratedVolume);

  const countdownSfxCycle = [playReadySfx, playSetSfx, playGoSfx];

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

  const getPayoff = (playerAttack, aiAttack) => {
    return payoffMatrix[playerAttack][aiAttack];
  }

  useEffect(() => {
    eel.hello();
    setTimeout(() => {
      setGameStart(true);

      if (enable_video_inference) {
        setupWebcam();
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
    gameStartRef.current = gameStart;

    const captureFrame = async() => {
      try {
        if (!gameStartRef.current) { return; }
        
        let video = document.getElementById('webcam');
        let canvas = document.getElementById('canvas');
        let context = canvas.getContext('2d');

        context.drawImage(video, 0, 0, weight, height);

        canvas.style.display = 'none';
 
        let frameData = canvas.toDataURL('image/jpeg');
        
        let detectedData = await eel.detect(frameData, confThreshSelected, weight, height)();
      
        if (detectedData.length !== 0) {
          context.clearRect(0, 0, canvas.width, canvas.height);

          canvas.style.display = 'block';

          let detectedClass = '';
          
          let className = detectedData[0];
          let confidence = detectedData[1];
          let x1 = detectedData[2];
          let y1 = detectedData[3];
          let x2 = detectedData[4];
          let y2 = detectedData[5];

          context.drawImage(video, x1, y1, x2 - x1, y2 - y1, x1, y1, x2 - x1, y2 - y1);
          context.beginPath();
          context.lineWidth = "2";
          context.strokeStyle = "red";
          context.rect(x1, y1, x2 - x1, y2 - y1);
          context.stroke();

          context.font = "16px Arial";
          context.fillStyle = "red";
          context.fillText(`${className} (${confidence})`, x1, y1 - 5);

          detectedClass = className;
          console.log(chalk.green("detectedClass: " + detectedClass))

          setYoloDetected({ value: detectedClass });
        } else {
          setYoloDetected({ value: '' });
        }

        setTimeout(() => {
          captureFrame();
        }, 500);

      } catch (error) {
        console.error('Error in captureFrame:', error);
      }
    }
    
    captureFrame();

  }, [gameStart]); 

  useEffect(() => {
    if (playerAttack === '') { 
      setIsPlayerAlreadyAttacked(false);  
    }
    else {
      setIsPlayerAlreadyAttacked(true);
    }
  }, [playerAttack]);
  
  useEffect(() => {
    if (!allowDetection) { return; }
    if (isPlayerAlreadyAttacked) { return; }
    if (yoloDetected.value === '') { return; }
    
    console.log("yoloDetected: " + yoloDetected.value)
    setPlayerAttack(yoloDetected.value);
    setYoloDetected({ value: '' });
  }, [allowDetection, yoloDetected, isPlayerAlreadyAttacked]);

  useEffect(() => {
    if (isPaused) { return; }
    if (!gameStart) { return; }

    if (!allowDetection) {
      payOffMessageElement.innerHTML = ``;
    }
    
    let intervalId = null;
    const startInterval = () => {
      
      intervalId = setInterval(() => {
        if (counter === 2 && playerAttack == '') { return; }

        setCounter((prevCounter) => (prevCounter + 1) % 3);
      }, allowDetection ? roundCooldownMS : countdownSpeedMS);
    };
    
    startInterval();

    return () => {
      clearInterval(intervalId);
    };
  }, [allowDetection, counter, playerAttack, gameStart, isPaused]);

  useEffect(() => {
    countdownSfxCycle[counter]();
    console.log(`isDetectedON: ${allowDetection}, counter: ${counter}`)

    if (counter === 2) {
      setAllowDetection(true);
    } else if (counter === 0) {
      setAllowDetection(false);
      setPlayerAttack('');
      setAiAttack(0);
    }
    
  }, [counter]);

  useEffect(() => {
    if (playerAttack === '') { return; }
  
    setPlayerAttackHistory((prevPlayerAttackHistory) => {
      const updatedHistory = [playerAttack, ...prevPlayerAttackHistory.slice(0, maximumHistoryLength - 1)];
      return updatedHistory;
    });
  }, [playerAttack]);
  
  
  useEffect(() => {
    if (playerAttackHistory.length === 0) { return; }

    let randomAiAttack;
    if (difficulty === 'hard') {
      let AiAttackProbabilities = AIPlayer.adaptAiAttack(playerAttackHistory);
      randomAiAttack = choices[AIPlayer.weightedRandom(AiAttackProbabilities)];
    }
    else {
      randomAiAttack = AIPlayer.randomAttack();
    }

    // console.log("changed ai attack: " + randomAiAttack)
    setAiAttack(choices.indexOf(randomAiAttack) + 1);
  }, [playerAttackHistory]);

  useEffect(() => {
    if (currentRoundWinner === '') { return; }
    if (currentRoundWinner === 'player') {
      player1ScoreRef.current.classList.add('score-enlarge');
    }
    else if (currentRoundWinner === 'ai') {
      player2ScoreRef.current.classList.add('score-enlarge');
    }

    setTimeout(() => {
      player1ScoreRef.current.classList.remove('score-enlarge');
      player2ScoreRef.current.classList.remove('score-enlarge');
    }, 1000);

    setCurrentRoundWinner('');
  }, [currentRoundWinner]);

  useEffect(() => {
    if (playerAttack === '' || aiAttack === 0) { return; }

    let payoff = getPayoff(playerAttack, choices[aiAttack - 1]);

    if (payoff === 1) {
      setCurrentRoundWinner('player');
      playDamageSfx();
      if (playerAttack === choices[character]) {
        playCriticalSfx();
        setScores((prevScores) => [prevScores[0] + 2, prevScores[1]]);

        const whiteFlash = document.createElement('div');
        whiteFlash.classList.add('white-flash');
        document.body.appendChild(whiteFlash);

        setTimeout(() => {
          whiteFlash.remove();
        }, 75);
      }
      else {
        setScores((prevScores) => [prevScores[0] + 1, prevScores[1]]);
      }

      player2PortraitImage.style.animation = "blink 1s forwards";
      countdownElement.src = payoffImage[0];
      payOffMessageElement.innerHTML = `${playerAttack} beats ${choices[aiAttack - 1]}. You Win!`
      
      setTimeout(() => {
        playYouWinSfx();
      }, 400);

    } else if (payoff === -1) {
      setCurrentRoundWinner('ai');
      playDamageSfx();
      setScores((prevScores) => [prevScores[0], prevScores[1] + 1]);
      player1PortraitImage.style.animation = "blink 1s forwards";

      countdownElement.src = payoffImage[1];
      payOffMessageElement.innerHTML = `${choices[aiAttack - 1]} beats ${playerAttack}. You Lose!`
      
      setTimeout(() => {
        playYouLoseSfx();
      }, 400);

    } else {
      setCurrentRoundWinner('draw');
      countdownElement.src = payoffImage[2];
      payOffMessageElement.innerHTML = `${playerAttack} draws with ${choices[aiAttack - 1]}. It's a draw!`
      
      setTimeout(() => {
        playItsATieSfx();
      }, 400);
    }

    typewriterContainer.classList.add('typewriter');

    setTimeout(() => {
      player1PortraitImage.style.animation = "";
      player2PortraitImage.style.animation = "";

      typewriterContainer.classList.remove('typewriter');
    }, roundCooldownMS);

    const countdownImage = document.getElementById('countdown');

    countdownImage.classList.add('hue-rotate');
    setTimeout(() => {
      countdownImage.classList.remove('hue-rotate');
    }, roundCooldownMS);

  }, [playerAttack, aiAttack]);

  useEffect (() => {
    const countdownContainer = document.getElementsByClassName('countdown_container')[0];

    countdownContainer.style.transition = randomMovement;
    countdownContainer.style.opacity = 0;

    let randomX = Math.floor(Math.random() * 30) + 40;
    let randomY = Math.floor(Math.random() * 30) + 40;

    countdownContainer.style.left = `${randomX}%`;
    countdownContainer.style.top = `${randomY}%`;

    /* offsetHeight is a technique used to make sure that the initial styles are applied
      before the subsequent styles with transitions, ensuring that the transition effect starts
      from the correct state. It's a workaround to deal with the way browsers optimize style changes. - chatGPT */
    countdownContainer.offsetHeight;
    
    countdownContainer.style.transition = `transform 400ms, left 200ms, top 200ms, opacity 200ms cubic-bezier( 0.79, 0.33, 0.14, 0.53 )`;
    countdownContainer.style.opacity = 1;
    
    countdownContainer.style.left = '50%';
    countdownContainer.style.top = '50%';
  }, [playerAttack, aiAttack]);

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
              <div ref={player1ScoreRef} className="score"><StringEffect text={scores[0]}/></div>
              <div className="separator"><StringEffect text=":"/></div>
              <div ref={player2ScoreRef} className="score"><StringEffect text={scores[1]}/></div>
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