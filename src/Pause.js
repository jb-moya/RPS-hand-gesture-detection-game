import StringEffect from "./StringEffect.js";
import Button from "./Button.js";
import confButton from './assets/new_png/button3.png';
import resumeMainMenuButton from './assets/new_png/button4.png';

const Pause = ({ pauseFunctions, currentConfThresh }) => {
  return <div className="pause_menu_container">
    <div className="conf_thresh_text"><StringEffect text="Confidence Threshold" /></div>
    <div className="pause_options confidence_threshold_container">
      <Button 
        image={confButton} 
        text={"0.6"} 
        classes_img={`conf_option`}
        classes_text={`${currentConfThresh === 0.6 ? "conf_option_selected" : ""}`}
        onClickFunction={() => pauseFunctions.changeConfThresh(0.6)}/>
      <Button 
        image={confButton} 
        text={"0.7"} 
        classes_img={`conf_option`}
        classes_text={`${currentConfThresh === 0.7 ? "conf_option_selected" : ""}`}
        onClickFunction={() => pauseFunctions.changeConfThresh(0.7)}/>
      <Button 
        image={confButton} 
        text={"0.8"} 
        classes_img={`conf_option`}
        classes_text={`${currentConfThresh === 0.8 ? "conf_option_selected" : ""}`}
        onClickFunction={() => pauseFunctions.changeConfThresh(0.8)}/>
    </div>
    <div className="pause_options resume_main_menu">
      <Button image={resumeMainMenuButton}
        text={"Main Menu"}
        onClickFunction={() => {pauseFunctions.togglePauseGame(); pauseFunctions.toggleMainMenu()}}
        classes_img="" />
      <Button image={resumeMainMenuButton}
        text={"Resume"}
        onClickFunction={() => pauseFunctions.togglePauseGame()}
        classes_img="" />
    </div>
  </div>
}

export default Pause;