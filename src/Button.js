import StringEffect from "./StringEffect.js";
import clickSound from './assets/audio/button_click.mp3';
import hoverSound from './assets/audio/one_beep.mp3';

import useSound from 'use-sound';

const Button = ({ image, classes = "", classes_img = "", classes_text = "", text = "", onClickFunction = () => {} }) => {
  const [playClickSound] = useSound(clickSound, {
    volume: 0.25,
  });
  const [playHoverSound] = useSound(hoverSound, {
    volume: 0.20,
  });

  return <div className={`button_container ${classes}`}>
    <img onClick={() => { playClickSound(); onClickFunction(); }} onMouseOver={playHoverSound} className={`button_image ${classes_img}`} src={image} alt="" />
    {text && <span className="button_text"><StringEffect className={classes_text} text={text} /></span>}
  </div>
}

export default Button;