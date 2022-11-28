import logo from './images/Bob_pouce.png';
import opensea from './images/opensea.png';
import metamask from './images/Metamask.png';
import scan from './images/qrscan.png';
import polygon from './images/polygon.png';
import bob_finger from './images/Bob_finger.png';

import './App.css';
import getWeb3 from "./getWeb3";
import getbob from './getbob';
import { useState } from "react";
import bobsjson from "./bobs.json";
import QrReader from "react-qr-reader";
import Modal from 'react-awesome-modal';
import Social from "./Social";
import Confetti from "react-confetti";



function App() {

  const [connected, setConnected] = useState(false);
  //Constantes affichage
  const [pourcentage, setpourcentage] = useState("");
  const [sur, setsur] = useState("");
  const [de, setde] = useState("");
  const [Plateau, setPlateau] = useState("");
  const [Biere, setBiere] = useState("");
  const [Vin, setVin] = useState("");
  const [Emporter, setEmporter] = useState("");
  const [address, setAddress] = useState("");
  const [op, setOp] = useState("0");

  //Constantes coches, croix, interrogation
  const [Avantages, setAvantages] = useState("❓"); //✔️
  const [Bonus, setBonus] = useState("❓"); //❌
  const [visible, setVisible] = useState(false); //affichage des alertes popup
  const [title, setTitle] = useState("");
  const [alert_msg, setAlertMsg] = useState("");
  const [img_head, setImg_head] = useState("");
  const [img_text, setImg_text] = useState("");
  const [link, setLink] = useState("");
  const [random_bob1, setRand1] = useState('/images/'+((Math.floor(Math.random() * 500)) +1).toString()+'.png');
  const [random_bob2, setRand2] = useState('/images/'+((Math.floor(Math.random() * 500)) +1).toString()+'.png');
  const [account, setAccount] = useState("Connecter Metamask");

  //Constantes calcul
  const [selected, setSelected] = useState("environment");
  const [startScan, setStartScan] = useState(false);
  const [data, setData] = useState("");
  const [discounts, setDiscounts] = useState([]);
  const [number_bob, setnumber_bob] = useState('');

  //Constantes de style
  const [plan_onoff, setplan_onoff] = useState("off");
  const [fade_inout, setfade_inout] = useState("");
  

  //Gestion des alertes
  const openModal = () => {
    setVisible(true);
  };

  const closeModal = () => {
    setVisible(false);
  };

  const handleScan = async (scanData) => {
    console.log(`loaded data data`, scanData);
    if (scanData && scanData !== "") {
      console.log(`loaded >>>`, scanData);
      if (scanData.startsWith("ethereum")) {
        setData(scanData.slice(9, 51));
      } else {
        setData(scanData);
      }
      setStartScan(false);
    }
    if (data != '') {
      bobby();
    }
  }; 

  const handleChange_data = (e) => {
    setData(e.target.value);
  };

  const connect = async () => {

      if (window.ethereum) {
        console.log("yes");
        
        try {
          const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
          });
          console.log(accounts[0]);
          setAccount(accounts[0]);

        } catch (error) {
          // catch any errors for any of the above operations.
          setTitle("");
          setImg_head(bob_finger);
          setAlertMsg("Verifiez vos notifications Metamask");
          setImg_text(metamask);
          setLink("https://metamask.io/download/");
          openModal();
          console.error(error);
        }
      }
      
  };

  const bobby = async () => {
    var bobs = [];
    var bobs_tmp = [];
    var bob_tmp = [];
    setAddress("Adresse : " + data);

    //clean div display bobs
    var par = document.getElementById("bobs");
    par.innerHTML = " ";

    try{
      // get the blockchain interface
      const web3 = await getWeb3();
      console.log('web3 sent back by getWeb3: ', web3);

      // bring in user's Metamask account address
      const accounts = await web3.eth.getAccounts();
      console.log('using account in Metamask :', accounts);
      setAccount(accounts[0]);

      if (accounts.length != 0) {
        setConnected(true);
      }

      // Get the contract instance
      const NFTContract = await getbob();
      console.log('smart contract de la collection NFT:', NFTContract);

      // Optimisation
      var datas = Array(500).fill(data); //tableau rempli 500 fois avec l'adresse choisie
      var ii = Array.from({length: 500}, (_, i) => i + 1) //tableau de 1 à 500

      bob_tmp = await NFTContract.methods.balanceOfBatch(datas, ii).call(); //Check pour les 500 token d'un coup, si il y a appartenance
      console.log('datas = ', datas);
      console.log('ii = ', ii);
      console.log('bobs = ', bob_tmp);

      for (let i = 0; i < 500; i++) {
        if (bob_tmp[i] == 1) {
          bobs_tmp.push(i+1);
          console.log('bobs = ', bobs_tmp);
        }
      }

      bobs = [...bobs_tmp];
      console.log('Mes bobs : ', bobs);
      //From bobs, compute the advantages the customer has
      var discounts_tmp = [0,0,0,0];
      for (const id of bobs) {
        console.log(id);
        //parse le gros fichier bobs.json
        var discounts_current_bob = bobsjson[id];
        //Affiche le bob : APPEND TO THE CONTENTS
        if (!startScan) { //si scan pas allumé
          console.log(b);
          var b='/images/'+id+'.png';
          par.innerHTML += "<img src="+b+" height='100vmin' alt='Un de mes Bobs'/>";
          setOp("100");
        }

        for (let j = 0; j < 4; j++) {
          //Get .id => recupere un tableau de reduc dans l'ordre background hand head ground 
          //Compare them to the previous and keep the best one
          if (discounts_current_bob[j] > discounts_tmp[j]) {
            discounts_tmp[j] = discounts_current_bob[j];
          }
        } 

      }
      setDiscounts(discounts_tmp);
      setTimeout(function () {
        setOp("0");
      }, 2500);


      //Affichage tableau remises
      setpourcentage('%');
      setsur('Remises à chaque Soirée Spéciale'); 
      setde('');
      setPlateau('▹ Plateaux de Fromages et de Charcuteries');
      setBiere('▹ Bière');
      setVin('▹ Vin');
      setEmporter('▹ Produits à emporter');

      //Modification des emoji ? X V
      //Si aucun bob
      if (bobs.length == 0) {
        setAvantages("❌");
        setBonus("❌");
      } else if (bobs.length != 0 && (discounts_tmp[0]+discounts_tmp[1]+discounts_tmp[2]+discounts_tmp[3] == 0))  {  
        //Si bob donne que des 0
        setAvantages("✔️");
        setBonus("❌");
        var bob_par = document.getElementById("bobtail");
        bob_par.innerHTML = "Vous avez le droit exclusif de commander un Cocktail secret.  <br></br>\
         Vous avez même l'immense privilège de poser vos yeux sur la recette.  <br></br>\
         Faites en bon usage 🍹";
      } else { 
        setAvantages("✔️");
        setBonus("✔️");
        var bob_par = document.getElementById("bobtail");
        bob_par.innerHTML = "Vous avez le droit exclusif de commander un Cocktail secret.  <br></br>\
         Vous avez même l'immense privilège de poser vos yeux sur la recette.  <br></br>\
         Faites en bon usage 🍹";
      }

      //Nombre de bobs
      if (bobs.length == 0) {
        setnumber_bob("Aucun Bob Trouvé !");
      } else if (bobs.length == 1) {
        setnumber_bob("1 Bob Trouvé !");
      } else {
        setnumber_bob(bobs.length+" Bob Trouvés!");
      }

    } catch (error) {
      // catch any errors for any of the above operations.
      setTitle("");
      setImg_head(bob_finger);
      setAlertMsg("Verifiez que Metamask est bien connecté");
      setImg_text(metamask);
      setLink("https://metamask.io/download/");
      openModal();

      console.error(error);
    }

  };

  const handleError = (err) => {
    console.error(err);
  };

  const appear = () => {
    //Appartition du texte
    setplan_onoff('on');

    //Scroll down
    document.getElementById('scroll').scrollIntoView();
  
  };

  const reveal = () => {
    if (!connected) { //si pas co a metamask
      setTitle("");
      setAlertMsg("Verifiez que Metamask est bien connecté.");
      setImg_head(bob_finger);
      setImg_text(metamask);
      setLink("https://metamask.io/download/");
      openModal();
    } else if (number_bob == 0) { //si aucun bob
      setTitle("Vous devez posséder un Bob");
      setAlertMsg("Trouvez le vôtre ➡");
      setImg_head('/images/60.png');
      setImg_text(opensea);
      setLink("https://opensea.io/fr/Le-Bon-Melange?tab=created");
      openModal();
    } else {
      //Sinon afficher la recette
      setfade_inout("fade-in");
      var fade = document.getElementById("fade");
      fade.innerHTML = "<span><h3 id='coc'> Le <i>Dessert</i>, </h3> <br></br>\
      <h3 id='coc2'> dit Le <i>Cocktail du Patron</i> 🤠 </h3></span> \
        <p id='gauche'> - Une dose de Rhum ambré  <br></br>\
        - Une dose d'Amaretto <br></br>\
        - Deux doses de Crème de Rhum   <br></br>\
        - Allongé au Lait  <br></br>\
        - Bonus Chantilly pour les gourmand    <br></br>\
        - Sublimé par un ingrédient secret\
      </p>";

    setTimeout(function () {
      setfade_inout("fade-out");
    }, 30000);

    setTimeout(function () {
      fade.innerHTML = " ";
    }, 40000);

    }
  };

  const apercu = () => {
    var rand = (Math.floor(Math.random() * 500)) +1;
    var img1 = '/images/'+rand.toString()+'.png';
    var rand = (Math.floor(Math.random() * 500)) +1;
    var img2 = '/images/'+rand.toString()+'.png';
    setRand1(img1);
    setRand2(img2);
    //setLink("https://opensea.io/fr/Le-Bon-Melange?tab=created");
  }

  return (
    <div className="App">
      <div className="App-inside">

        <div className='polygon'>
          <img src={polygon} className="Crypto-logo" />  
          <p id='polygon'>Polygon Network</p>
          <button type="button" id="metamask" onClick={connect}> {account} </button>
        </div>

        <div className='Title'>
          <img src={logo} alt="logo" className="App-logo" />
          <h1><span>  Bob Avantages  </span></h1>
        </div>

        <div className="QR">
          <h3 id="research"> Rechercher une adresse </h3>
          <div className='address'>
            <form>
              <input type="text" placeholder="0x..." value={data} onChange={handleChange_data}/>
            </form>
            <button id="scan"
              onClick={() => {
                setStartScan(!startScan);
              }}
            >
              {startScan ? "" : ""} 
              <img src={scan} alt="scan" className="Crypto-logo-scan" />       
            </button>
            <button type="button" id="valider" onClick={bobby}> Valider </button>
          </div>

          <div className="qrscan">
          {startScan && (
            <>
              <select onChange={(e) => setSelected(e.target.value)}>
                <option value={"environment"}>Camera Arrière</option>
                <option value={"user"}>Camera Avant</option>
              </select>
              <QrReader
                facingMode={selected}
                delay={1000}
                onError={handleError}
                onScan={handleScan}
                style={{ width: "250px", "margin-left": "35%"}}
              />
            </>
          )}
          </div>

          <div className='Display'>
            <h2 id="ad"> {address} </h2>
            <p id="ad_b"> <br></br>{number_bob} </p> 
            <div id='bobs'> </div>
            <Confetti opacity={op} />
          </div>

        </div>

        <div className='Bobtail'>
          <h2 id="part"> {Avantages} Bob'tail </h2>
          <h3 id="bobtail"></h3>
          <button type="button" id="planning" onClick={reveal}> 🔮 Révéler </button>
          <h3 className={fade_inout} id="fade">          </h3>
        </div>
        
        <div className='Soirees'>
          <h2 id="part"> {Avantages} Avantages à chaque Soirée Spéciale </h2>
          <button type="button" id="planning" onClick={appear}> 📅 Planning </button>
        </div>

        <div className='Bonus'>
          <h2 id="part"> {Bonus} Bonus Rareté </h2>
          <table size="sm" bordered responsive>
              <thead>
                  <tr>
                      <th>{sur}</th>
                      <th>{de}</th>
                  </tr>
              </thead>
              <tbody>
                  <tr>
                      <td>{Vin}</td>
                      <td>{discounts[0]}{pourcentage}</td>
                  </tr>
                  <tr>
                      <td>{Plateau}</td>
                      <td>{discounts[1]}{pourcentage}</td>
                  </tr>
                  <tr>
                      <td>{Emporter}</td>
                      <td>{discounts[2]}{pourcentage}</td>
                  </tr>
                  <tr>
                      <td>{Biere}</td>
                      <td>{discounts[3]}{pourcentage}</td>
                  </tr>
              </tbody>
          </table>
        </div>

        <hr id="scroll"/>

        <div className={plan_onoff} >
          <h2 id="part2"> 📅 Planning des Soirées 🍺 </h2> 

          <div> 
            <h3 id="part3"> ▹ <u>7 Janvier </u> : Soirée Stand up </h3>
            <p id="part4"> Avantage #Bob: Un shooter offert </p>
          </div>

          <div> 
            <h3 id="part3"> ▹ <u>3 Décembre</u> : IRL Guilde AI #2 - <i>Cross The Ages</i> </h3>
            <p id="part4"> Avantage #Bob: Bientôt révélé...</p>
          </div>

          <div> 
            <h3 id="part3"> ▹ <u>1er Décembre</u> : Soirée Magicien </h3>
            <p id="part4"> Avantage #Bob: Un Shooter offert </p>
          </div>

          <div> 
            <h3 id="part3"> ▹ <u>30 Novembre</u> : Meetcoin #3 - Meetup Crypto </h3>
            <p id="part4"> Avantage #Bob: 2 Tirs en + à la fléchette de la fortune</p>
          </div>

          <div>
            <h3 id="part3"> ▹ <u>19 Novembre</u> : Soirée <i>Galaxy Gamers</i> </h3>
            <p id="part4"> Avantage #Bob: 2 Tirs en + à la fléchette de la fortune </p>
          </div>

          <div>
            <h3 id="part3"> ▹ <u>28 Octobre</u> : Soirée Halloween </h3>
            <p id="part4"> Avantage #Bob: 2e essai au jeu Horror Box </p>
          </div>

          <div>
            <h3 id="part3"> ▹ <u>14 Octobre</u> : Meetup Crypto #2 </h3>
            <p id="part4"> Avantage #Bob: 2 Tirs en + à la fléchette de la fortune </p>
          </div>

          <div>
            <h3 id="part3"> ▹ <u>4 Octobre</u> : IRL Guilde AI #1 - <i>Cross The Ages</i> </h3>
            <p id="part4"> Tous les participants ont reçu leur Bob. <br></br>
              Avantage #Bob: Un shooter offert à chaque partie démarrée.</p>
          </div>

          <div>
            <h3 id="part3"> ▹ <u>9 Septembre</u> : Meetup Crypto #1 </h3>
            <p id="part4"> 1ère soirée Crypto au Bon Mélange. <br></br>
            Les 1ers Bobs sont distribués.</p>
          </div>
          
        </div>

        <hr className={plan_onoff} id="barre"/>

        
        
        <div className='Own'>

          
          <div className='jeveuxmonbob'>
          <h2 id="part5"> Vous n'avez pas encore votre Bob ?</h2> 
            <p id='gauche2'>
              Un Bob offert à chaque Soirée Spéciale. <br></br>
              Impatient ? En vente libre sur Opensea.
            </p>
            <a href="https://opensea.io/fr/Le-Bon-Melange?tab=created" target="_blank">
              <img src={opensea} id="opensea"/>
            </a>
          </div>

          <div className='stack'>
            <button type="button" id="aper" onClick={apercu}> Clic 📸 </button>     
            <div className='randoms'>
              <img src={random_bob1} className='bob_top'/>       
              <img src={random_bob2} className='bob_bottom'/>
            </div>
            <a href="https://opensea.io/fr/Le-Bon-Melange?tab=created" target="_blank">
              <button type="button" id="jeveux"> Je veux mon Bob </button>     
            </a>
          </div>

        </div>

      </div>

      <Modal visible={visible} width="40%" height="20%" effect="fadeInUp" onClickAway={closeModal}>
        <div className="modal"> 
          <div className='align_head'>
            <h3 id="modh3">{title}</h3>
            <img src={img_head} height="120px"/>
          </div>
          <div className='align'>
            <p id="pmod">{alert_msg}</p>
            <a href={link} target="_blank">
              <img src={img_text} className="Crypto-logo-modal" opacity="0" />
            </a>
          </div>
          <a href="javascript:void(0);" onClick={closeModal}>Fermer</a>
        </div>
      </Modal>
      
      <Social />

    </div>
  );
}

export default App;
