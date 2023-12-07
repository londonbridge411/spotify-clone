import "./Music Control.css";
import play from "../assets/circle-play-solid.svg";
import pause from "../assets/circle-pause-solid.svg";
import prev from "../assets/backward-step-solid.svg";
import next from "../assets/forward-step-solid.svg";
import shuffle from "../assets/shuffle-solid.svg";
import repeat from "../assets/repeat-solid.svg";
import {
  Component,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export function SetSongID(id: string) {}

export default function MusicControl() {
  return (
    <>
      <div id="Soundbar">
        <div className="controls">
          <img className="control-btn" src={prev} />
          <img className="control-btn" src={play} />
          <img className="control-btn" src={next} />
        </div>
      </div>
    </>
  );
}
