import logo from './Bob_pouce.png';
import opensea from './opensea.png';
import metamask from './Metamask.png';
import scan from './qrscan.png';
import polygon from './polygon.png';
import bob_finger from './Bob_finger.png';
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

  //Constantes calcul
  const [selected, setSelected] = useState("environment");
  const [startScan, setStartScan] = useState(false);
  const [data, setData] = useState("");
  const [discounts, setDiscounts] = useState([]);
  const [number_bob, setnumber_bob] = useState('');

  //Constantes de style
  const [color, setColor] = useState("avant");
  const [color2, setColor2] = useState("avant");
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
      setPlateau('Plateaux de Fromages et de Charcuteries');
      setBiere('Bière');
      setVin('Vin');
      setEmporter('Produits à emporter');

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
    var sc = document.getElementById('scroll');
    sc.scrollIntoView();
    sc.innerHTML = '<hr \> \
    <h2 id="part2"> Planning des Soirées </h2> \
    <div className={color2}> \
      <h3 id="part3"> 3 Décembre : IRL Guilde AI #2 - <i>Cross The Ages</i> </h3>\
      <p id="part4"> Avantage : Bientôt révélé...</p>\
    </div>\
    <div className={color}>\
      <h3 id="part3"> 19 Novembre : Soirée <i>Galaxy Gamers</i> </h3>\
      <p id="part4"> Avantage : Bientôt révélé...</p>\
    </div>\
    <div className="apres">\
      <h3 id="part3"> 14 Octobre : Meetup Crypto #2 </h3>\
      <p id="part4"> Avantage : 2 Tirs en + à la fléchette de la fortune </p>\
    </div>\
    <div className="apres">\
      <h3 id="part3"> 4 Octobre : IRL Guilde AI #1 - <i>Cross The Ages</i> </h3>\
      <p id="part4"> Tous les participants ont reçu leur Bob. <br></br>\
        Avantage : Un shot offert à chaque partie démarrée.</p>\
    </div>\
    <div className="apres">\
      <h3 id="part3"> 9 Septembre : Meetup Crypto #1 </h3>\
      <p id="part4"> 1ère soirée Crypto au Bon Mélange. <br></br>\
      Les 1ers Bobs sont distribués.</p>\
    </div>';

    
    //Find today's date
    const date = new Date();
    const [month, day] = [date.getMonth(), date.getDate()];
    //And change style color
    //Pour la date du 19 Novembre
    if (month == 10 && day>19 ) { //getmonth returns previous month
      setColor("apres");
    }
    //Pour la date du 3 Décembre
    if (month == 11 && day>3 ) { //getmonth returns previous month
      setColor2("apres");
    }


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
      fade.innerHTML = "<span><h3> Le <i>Dessert</i>, dit Le <i>Cocktail du Patron</i> 🤠 </h3></span> \
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

        <div className='Title'>
          <img src={logo} alt="logo" className="App-logo" />
          <h1><span>  Bob Avantages  </span></h1>
        </div>

        <div className="QR">
          <img src={scan} alt="scan" className="Crypto-logo-scan" />
          <button id="scan"
            onClick={() => {
              setStartScan(!startScan);
            }}
          >
            {startScan ? "Stop Scan" : "Scan QR Code"} 
            <img src={metamask} alt="metamask" className="Crypto-logo" />
            <img src={polygon} alt="polygon" className="Crypto-logo" />        
          </button>

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
                style={{ width: "300px", "margin-left": "40%"}}
              />
            </>
          )}

          <form>
            <input type="text" placeholder="0x..." value={data} onChange={handleChange_data}/>
            <button type="button" id="valider" onClick={bobby}> Valider </button>
          </form>

          <div className='Display'>
            <h2> {address} </h2>
            <p> {number_bob} </p> 
            <div id='bobs'> </div>
            <Confetti opacity={op} />
          </div>

        </div>

        <div className='Bobtail'>
          <h2 id="part"> {Avantages} Bob'tail </h2>
          <h3 id="bobtail"></h3>
          <button type="button" id="planning" onClick={reveal}> Révéler </button>
          <h3 className={fade_inout} id="fade">          </h3>
        </div>
        
        <div className='Soirees'>
          <h2 id="part"> {Avantages} Avantages à chaque Soirée Spéciale </h2>
          <button type="button" id="planning" onClick={appear}> Planning </button>
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

        <hr/>

        <div id='scroll'></div>

        <hr/>
        
        <div className='Own'>
          <h2 id="part2"> Pas encore mon Bob ?</h2> 
          <div className='stack'>
            <button type="button" id="aper" onClick={apercu}> Aperçu </button>     
            <a href="https://opensea.io/fr/Le-Bon-Melange?tab=created" target="_blank">
              <button type="button" id="aper"> Je veux mon Bob !</button>     
            </a>
            <img src={random_bob1} className='bob_top'/>       
            <img src={random_bob2} className='bob_bottom'/>
          </div>
        </div>

      </div>

      <Modal visible={visible} width="40%" height="20%" effect="fadeInUp" onClickAway={closeModal}>
        <div className="modal"> 
          <div className='align_head'>
            <h3>{title}</h3>
            <img src={img_head} height="120px"/>
          </div>
          <div className='align'>
            <p>{alert_msg}</p>
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
