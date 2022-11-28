import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faFacebook,
    faTwitter,
    faInstagram
  } from "@fortawesome/free-brands-svg-icons";
import './App.css';

export default function SocialFollow() {
  return (
    <div>

      <div class="social-container">
      <h3 id='suivez'>Suivez-nous sur nos réseaux</h3>
      <a href="https://www.facebook.com/lebonmelange.blagnac/"
        className="facebook social" target="_blank">
        <FontAwesomeIcon icon={faFacebook} size="2x" />
      </a>
      <a href="https://twitter.com/PoncetNathan1" className="twitter social" target="_blank">
        <FontAwesomeIcon icon={faTwitter} size="2x" />
      </a>
      <a href="https://www.instagram.com/le_bon_melange/?hl=fr"
        className="instagram social" target="_blank">
        <FontAwesomeIcon icon={faInstagram} size="2x" />
      </a>
      </div>

      <div className="plaisir">
        <h3 id='suivez'> Le Bon Mélange. <br></br >Au plaisir du Goùt. <br></br> ☎️ 05 32 59 54 61 </h3>
      </div>  
    </div>
  );
}