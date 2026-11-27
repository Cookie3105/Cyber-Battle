"use strict";
const $ = s => document.querySelector(s);
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const rand = n => Math.floor(Math.random()*n);
const shuffle = a => [...a].sort(()=>Math.random()-.5);
const RED = [
 {id:"phishing",name:"Phishing",desc:"Tentativo di sottrarre credenziali tramite un messaggio fraudolento.",damage:20,node:"staff",effect:"Minaccia al fattore umano"},
 {id:"scan",name:"Scansione servizi",desc:"Ricognizione dei servizi esposti e delle possibili superfici vulnerabili.",damage:10,node:"web",effect:"Ricognizione perimetrale"},
 {id:"password",name:"Credenziali compromesse",desc:"Utilizzo di credenziali deboli o già esposte per tentare un accesso.",damage:25,node:"web",effect:"Accesso non autorizzato"},
 {id:"lateral",name:"Movimento laterale",desc:"Tentativo di raggiungere altri sistemi dopo un primo accesso.",damage:30,node:"net",effect:"Espansione nella rete interna"},
 {id:"exfil",name:"Esfiltrazione dati",desc:"Tentativo simulato di sottrarre informazioni riservate.",damage:40,node:"data",effect:"Minaccia agli asset critici"}
];
const BLUE = [
 {id:"mfa",name:"Autenticazione MFA",desc:"Aggiunge un secondo fattore e riduce il rischio da credenziali rubate.",blocks:{phishing:1,password:1,lateral:.25},effect:"Blocca phishing e credenziali"},
 {id:"firewall",name:"Firewall & filtering",desc:"Filtra il traffico e limita le comunicazioni non autorizzate.",blocks:{scan:1,lateral:.5,exfil:.5,password:.25},effect:"Controllo del traffico"},
 {id:"siem",name:"Monitoraggio SIEM",desc:"Correla i log e segnala comportamenti anomali per consentire una risposta tempestiva.",blocks:{phishing:.5,scan:.5,password:.5,lateral:.5,exfil:.5},effect:"Rilevamento e risposta"},
 {id:"patch",name:"Patch management",desc:"Corregge vulnerabilità note e riduce le possibilità di compromissione.",blocks:{scan:.5,password:.25,lateral:.25},heal:5,effect:"Riduce esposizione · +5% integrità"},
 {id:"isolation",name:"Isolamento server",desc:"Isola un sistema sospetto per contenere la propagazione e l'uscita dei dati.",blocks:{lateral:1,exfil:1,phishing:.25},effect:"Contenimento e segmentazione"}
];
const EVENTS = {
 2:{name:"Nessuna anomalia",desc:"Il monitoraggio non rileva eventi aggiuntivi.",effect:"Nessuna variazione",type:"neutral"},
 3:{name:"Attività fuori orario",desc:"Un alert arriva durante una fascia di presidio ridotto.",effect:"Integrità −10% · prossimo timer Blue: 20s",type:"bad",run:g=>{g.integrity-=10;g.nextTimer=20}},
 4:{name:"Nessuna anomalia",desc:"La rete rimane stabile durante questo intervallo.",effect:"Nessuna variazione",type:"neutral"},
 5:{name:"Errore umano",desc:"Un dipendente interagisce con un contenuto sospetto.",effect:"Integrità −10%",type:"bad",run:g=>g.integrity-=10},
 6:{name:"Nessuna anomalia",desc:"Nessun evento aggiuntivo viene registrato.",effect:"Nessuna variazione",type:"neutral"},
 7:{name:"Nessuna anomalia",desc:"Nessun evento aggiuntivo viene registrato.",effect:"Nessuna variazione",type:"neutral"},
 8:{name:"Allarme SOC",desc:"Il Security Operations Center individua un comportamento anomalo.",effect:"Integrità +5% · catena d'attacco interrotta",type:"good",run:g=>{g.integrity+=5;g.chain=false}},
 9:{name:"Nessuna anomalia",desc:"Nessun evento aggiuntivo viene registrato.",effect:"Nessuna variazione",type:"neutral"},
 10:{name:"Manutenzione urgente",desc:"Un intervento di manutenzione limita temporaneamente le risorse operative.",effect:"Integrità +10% · Blue scarta una carta",type:"good",run:g=>{g.integrity+=10;if(g.hands.blue.length)g.hands.blue.splice(rand(g.hands.blue.length),1)}},
 11:{name:"Nessuna anomalia",desc:"Nessun evento aggiuntivo viene registrato.",effect:"Nessuna variazione",type:"neutral"},
 12:{name:"Backup verificato",desc:"Una copia di backup integra consente un recupero controllato.",effect:"Integrità +15%",type:"good",run:g=>g.integrity+=15}
};
let game=null, timerInterval=null, pendingChoice=null, busy=false;
function showScreen(id){document.querySelectorAll(".screen").forEach(s=>s.classList.toggle("active",s.id===id));window.scrollTo({top:0,behavior:"smooth"})}
function log(message,type=""){const li=document.createElement("li");li.textContent=`T${game.turn} / ${message}`;if(type)li.className=type+"-log";$("#log").prepend(li);$("#logCount").textContent=String($("#log").children.length).padStart(2,"0")}
function cardButton(card,team,enabled,onPick){
 const b=document.createElement("button");b.type="button";b.className="game-card "+(team==="red"?"red-card":"blue-card");b.disabled=!enabled;
 const h=document.createElement("h4");h.textContent=card.name;
 const p=document.createElement("p");p.textContent=card.desc;
 const e=document.createElement("p");e.className="effect";e.textContent=team==="red"?card.effect:"Contromisura: "+card.effect;
 const v=document.createElement("div");v.className="card-value";v.textContent=team==="red"?`Impatto potenziale: ${card.damage}%`:`${card.heal?`Recupero +${card.heal}%`:"Difesa specifica"}`;
 b.append(h,p,e,v);if(enabled)b.addEventListener("click",()=>onPick(card));return b;
}
function renderHand(){
 const hand=$("#hand");hand.replaceChildren();const team=game.player;
 $("#handTitle").textContent=team==="red"?"Scegli la carta attacco":"Scegli la contromisura";
 $("#handCount").textContent=`${game.hands[team].length} CARTE DISPONIBILI`;
 game.hands[team].forEach(c=>hand.append(cardButton(c,team,game.phase==="player-choice",chooseCard)));
 if(!game.hands[team].length){const p=document.createElement("p");p.className="notice";p.textContent="Nessuna carta disponibile in mano.";hand.append(p)}
}
function draw(team){if(game.decks[team].length)game.hands[team].push(game.decks[team].pop())}
function setIntegrity(){
 game.integrity=Math.max(0,Math.min(100,Math.round(game.integrity)));
 $("#integrityValue").textContent=game.integrity+"%";$("#integrityBar").style.width=game.integrity+"%";
 $("#integrityBar").classList.toggle("danger",game.integrity<60);
 $("#redScore").textContent=game.stats.red.damage+"%";$("#blueScore").textContent=game.stats.blue.prevented+"%";
}
function setPhase(name,copy){$("#phaseName").textContent=name;$("#phaseCopy").textContent=copy}
function renderCardSlot(id,card,team,emptyText){
 const slot=$(id);slot.classList.remove("empty");slot.replaceChildren();
 const title=document.createElement("div");title.className="slot-title";title.textContent=id==="#attackSlot"?"01 / Attack vector":id==="#defenseSlot"?"02 / Countermeasure":"03 / Random event";slot.append(title);
 if(!card){const t=document.createElement("div");t.textContent=emptyText;slot.append(t);return}
 const c=document.createElement("div");c.className="played-card "+(team==="blue"?"def":"");
 const h=document.createElement("div");h.className="pc-head";h.textContent=card.name;
 const d=document.createElement("div");d.className="pc-body";d.textContent=card.desc||"Evento di scenario";
 const f=document.createElement("div");f.className="pc-foot";f.textContent=card.effect||"";
 c.append(h,d,f);slot.append(c);
}
function updateNodes(){
 ["staff","web","net","data"].forEach(n=>{const el=$("#node-"+n);el.classList.remove("compromised","protected")});
 if(game.lastNode){const el=$("#node-"+game.lastNode);el.classList.add(game.lastDamage>0?"compromised":"protected")}
}
function pips(){ $("#roundBadge").textContent=`ROUND ${String(game.turn).padStart(2,"0")} / 05`; }
function chooseCard(card){
 if(!pendingChoice)return;const resolve=pendingChoice;pendingChoice=null;game.phase="resolving";renderHand();resolve(card);
}
function askPlayer(team,seconds=30){
 return new Promise(resolve=>{
  game.phase="player-choice";pendingChoice=resolve;renderHand();
  if(team==="blue"){
   $("#passBtn").classList.remove("hidden");let left=seconds;$("#timerValue").textContent=left+"s";
   timerInterval=setInterval(()=>{left--;$("#timerValue").textContent=left+"s";if(left<=0){clearInterval(timerInterval);timerInterval=null;if(pendingChoice)chooseCard(null)}},1000);
  }else{$("#passBtn").classList.add("hidden");$("#timerValue").textContent="—"}
 });
}
function stopTimer(){if(timerInterval){clearInterval(timerInterval);timerInterval=null}$("#passBtn").classList.add("hidden")}
function aiAttack(){
 const hand=game.hands.red;return [...hand].sort((a,b)=>b.damage-a.damage)[0]||null;
}
function aiDefense(attack){
 const hand=game.hands.blue;if(!hand.length)return null;
 const score=c=>(c.blocks[attack.id]||0)*100+(c.heal||0);
 return [...hand].sort((a,b)=>score(b)-score(a))[0];
}
function resolveRound(attack,defense){
 const chainBonus=game.chain?5:0,base=attack.damage+chainBonus,block=defense?(defense.blocks[attack.id]||0):0;
 const damage=Math.round(base*(1-block));
 game.integrity-=damage;
 if(defense?.heal)game.integrity+=defense.heal;
 game.chain=block<.5;
 game.stats.red.cards++;game.stats.red.damage+=damage;if(block<.5)game.stats.red.success++;
 if(defense){game.stats.blue.cards++;game.stats.blue.prevented+=base-damage;if(block===1)game.stats.blue.fullBlocks++;if(defense.heal)game.stats.blue.healing+=defense.heal}
 else game.stats.blue.passes++;
 game.lastNode=attack.node;game.lastDamage=damage;setIntegrity();updateNodes();
 return {base,block,damage,chainBonus};
}
async function rollEvent(){
 setPhase("Lancio dei dadi","La somma dei due dadi determina l'evento di scenario di questo turno.");
 $("#continueBtn").classList.add("hidden");
 for(let i=0;i<8;i++){const a=1+rand(6),b=1+rand(6);$("#dieOne").textContent=a;$("#dieTwo").textContent=b;await sleep(65)}
 const a=1+rand(6),b=1+rand(6),sum=a+b,event=EVENTS[sum];$("#dieOne").textContent=a;$("#dieTwo").textContent=b;$("#diceResult").textContent=`= ${sum} / ${event.name}`;
 renderCardSlot("#eventSlot",event,"event");const before=game.integrity;if(event.run)event.run(game);setIntegrity();renderHand();
 if(event.type!=="neutral")game.stats.events++;
 if(game.integrity!==before)log(`${event.name}: ${event.effect}`,event.type==="bad"?"red":"blue");
 else log(`Evento: ${event.name} — ${event.effect}`,"event");
 if(event.type==="good"&&sum===8)game.chain=false;
 await sleep(500);
}
async function playTurn(){
 if(busy)return;busy=true;game.turn++;pips();draw("red");draw("blue");renderHand();
 ["#attackSlot","#defenseSlot","#eventSlot"].forEach((id,i)=>{const slot=$(id);slot.classList.add("empty");slot.innerHTML=`<div><div class="slot-title">${i+1} / ${["Attack vector","Countermeasure","Random event"][i]}</div>${["In attesa dell'attacco","In attesa della difesa","Evento di fine turno"][i]}</div>`});
 $("#dieOne").textContent=$("#dieTwo").textContent="–";$("#diceResult").textContent="Dadi in attesa";
 setPhase(game.player==="red"?"Red Team / attacco":"Red Team / AI",game.player==="red"?"Seleziona una carta attacco dalla tua mano.":"L'avversario sta selezionando una carta attacco.");
 const attack=game.player==="red"?await askPlayer("red"):await (async()=>{await sleep(700);return aiAttack()})();
 stopTimer();if(!attack){log("Nessun attacco disponibile.");busy=false;finish();return}
 game.hands.red.splice(game.hands.red.indexOf(attack),1);
 renderCardSlot("#attackSlot",attack,"red");log(`Red Team: ${attack.name}${game.chain?" · bonus catena +5%":""}`,"red");
 setPhase("Blue Team / risposta","Il Blue Team deve scegliere una contromisura coerente con la minaccia.");
 let defense=null,elapsed=0;
 if(game.player==="blue"){
  const start=Date.now();defense=await askPlayer("blue",game.nextTimer);elapsed=Math.min(game.nextTimer,(Date.now()-start)/1000);stopTimer();
 }else{await sleep(850);defense=aiDefense(attack);elapsed=5+rand(10)}
 game.stats.blue.times.push(elapsed);
 if(defense){game.hands.blue.splice(game.hands.blue.indexOf(defense),1);renderCardSlot("#defenseSlot",defense,"blue");}
 else renderCardSlot("#defenseSlot",null,"blue","Nessuna difesa / tempo scaduto");
 const result=resolveRound(attack,defense);
 log(defense?`Blue Team: ${defense.name} · blocco ${Math.round(result.block*100)}%`:"Blue Team: nessuna contromisura", "blue");
 log(result.damage?`Impatto: integrità −${result.damage}%`:"Attacco neutralizzato","red");
 if(defense?.heal)log(`Ripristino: integrità +${defense.heal}%`,"blue");
 $("#board").animate?.([{transform:"translateX(-3px)"},{transform:"translateX(3px)"},{transform:"translateX(0)"}],{duration:220});
 if(game.integrity<=0){busy=false;finish();return}
 await sleep(400);await rollEvent();
 if(game.integrity<=0||game.turn>=5){busy=false;finish();return}
 game.nextTimer=30;$("#continueBtn").classList.remove("hidden");setPhase("Turno completato","Controlla il riepilogo e avvia il turno successivo.");busy=false;
}
function startGame(role){
 stopTimer();game={player:role,turn:0,integrity:100,chain:false,nextTimer:30,phase:"ready",hands:{red:[],blue:[]},decks:{red:shuffle([...RED,...RED].map(c=>({...c}))),blue:shuffle([...BLUE,...BLUE].map(c=>({...c})))},stats:{red:{cards:0,damage:0,success:0},blue:{cards:0,prevented:0,fullBlocks:0,passes:0,healing:0,times:[],},events:0},lastNode:null,lastDamage:0};
 for(let i=0;i<4;i++){draw("red");draw("blue")}
 $("#log").replaceChildren();$("#logCount").textContent="00";$("#hand").replaceChildren();$("#redScore").textContent="0%";$("#blueScore").textContent="0%";
 setIntegrity();updateNodes();$("#timerValue").textContent="30s";showScreen("game");
 log(`Simulazione avviata. Tu giochi come ${role==="red"?"Red Team":"Blue Team"}.`,"event");
 setPhase("Missione avviata","Round 1 di 5. Seleziona una carta per iniziare.");
 playTurn();
}
function finish(){
 stopTimer();busy=false;const redWin=game.integrity<60;const winner=redWin?"RED TEAM":"BLUE TEAM";
 $("#resultTitle").textContent=winner+" WINS";
 $("#resultText").textContent=`Integrità finale: ${game.integrity}%. ${game.player===(redWin?"red":"blue")?"Hai vinto":"Hai perso"} la simulazione.`;
 $("#resultHero").style.background=redWin?"var(--pink)":"var(--lime)";
 $("#statRedCards").textContent=game.stats.red.cards;$("#statBlueCards").textContent=game.stats.blue.cards+` (${game.stats.blue.passes} turni senza difesa)`;
 $("#statSuccess").textContent=game.stats.red.success;$("#statBlocks").textContent=game.stats.blue.fullBlocks;
 $("#statDamage").textContent=game.stats.red.damage+"%";$("#statPrevented").textContent=game.stats.blue.prevented+"%";
 $("#statHealing").textContent=game.stats.blue.healing+"%";
 const avg=game.stats.blue.times.length?game.stats.blue.times.reduce((a,b)=>a+b,0)/game.stats.blue.times.length:0;
 $("#statTime").textContent=game.stats.blue.times.length?avg.toFixed(1)+" s":"—";
 $("#statEvents").textContent=game.stats.events+" eventi con effetto su "+game.turn+" turni";
 const grade=game.integrity>=85?"Difesa esemplare":game.integrity>=60?"Difesa efficace":game.integrity>=30?"Compromissione parziale":"Violazione grave";
 $("#gradeText").textContent=`Valutazione: ${grade}. Nota: il danno evitato misura la differenza tra impatto potenziale e impatto effettivo; il recupero dell'integrità è riportato separatamente.`;
 showScreen("result");
}
document.querySelectorAll("[data-role]").forEach(b=>b.addEventListener("click",()=>startGame(b.dataset.role)));
$("#startBtn").addEventListener("click",()=>document.querySelector(".role-grid").scrollIntoView({behavior:"smooth"}));
$("#topStart").addEventListener("click",()=>{showScreen("home");document.querySelector(".role-grid").scrollIntoView({behavior:"smooth"})});
$("#passBtn").addEventListener("click",()=>chooseCard(null));
$("#continueBtn").addEventListener("click",()=>{if(!busy)playTurn()});
$("#replayBtn").addEventListener("click",()=>{showScreen("home");document.querySelector(".role-grid").scrollIntoView({behavior:"smooth"})});
$("#homeBtn").addEventListener("click",()=>showScreen("home"));
