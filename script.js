const viewPortDiv= document.querySelector('.viewport-div');
const score_worm_container= document.querySelector('.worm-container');
const score_text= document.querySelector('.score-text');

const holesMax=20;
const numPositionAttemptsLimit=1000;
const SCOREMAX= 50;
const KING_PROBABILITY=0.8

let positions= [];
let moleHoles;
let moles=[];

let score=25;
const states= ['hungry','sad','fed','leaving','king_hungry','king_sad','king_fed','king_leaving']

const image_urls={
    mole_img_hungry: './img/mole-hungry.png',
    mole_img_sad: './img/mole-sad.png',
    mole_img_fed: './img/mole-fed.png',
    mole_img_leaving: './img/mole-leaving.png',
    mole_img_king_hungry: './img/king-mole-hungry.png',
    mole_img_king_sad: './img/king-mole-sad.png',
    mole_img_king_fed: './img/king-mole-fed.png',
    mole_img_king_leaving: './img/king-mole-leaving.png',
    cursor_bird: './img/cursor.png',
    cursor_bird_worm:'./img/cursor-worm.png',
}

MOLE_MIN_INTERVAL= 2000
MOLE_MAX_INTERVAL= 10000

MOLE_HUNGRY_INTERVAL= Math.floor(Math.random()*4000)+500//1500
MOLE_SAD_INTERVAL= 500//500
MOLE_FED_INTERVAL= 200
MOLE_LEAVE_INTERVAL= 200

const getInterval= ()=>MOLE_MIN_INTERVAL+Math.floor(Math.random()*MOLE_MAX_INTERVAL)
const getHungryInterval= ()=>MOLE_HUNGRY_INTERVAL
const getSadInterval= ()=>MOLE_SAD_INTERVAL
const getFedInterval= ()=>MOLE_FED_INTERVAL
const getLeaveInterval= ()=>MOLE_LEAVE_INTERVAL


function disperseMoleHoles(){
        for(let i= 0; i<=holesMax;i++){
            const moleHole= document.createElement('div');
            moleHole.classList.add('mole-hole');
            moleHole.id=`mole-hole-${i}`;
            moleHole.style.backgroundImage= `url('./img/soil-${Math.floor(Math.random()*4)}.png')`;
            viewPortDiv.appendChild(moleHole);
        }
        moleHoles= document.querySelectorAll('.mole-hole');
        positionMoleHole(moleHoles, positions);
}

function isIntersecting(X,Y,width,height,positions){
    for(let position of positions){
        if(
            (X<position.X+width) && (X+width>position.X) &&
            (Y<position.Y+height) && (Y+height>position.Y)){
                return true;
            }
    }
    return false;
}

function positionMoleHole(moleHoles,positions){
    moleHoles.forEach(moleHole=>{
        let moleHoleX,moleHoleY;
        let numPositionAttempts=0;
        const moleHoleWidth= moleHole.clientWidth;
        const moleHoleHeight= moleHole.clientHeight;
        do{
            moleHoleX= Math.random() * (viewPortDiv.clientWidth-moleHoleWidth);
            moleHoleY= Math.random() * (viewPortDiv.clientHeight-moleHoleHeight);
            numPositionAttempts++;
           
        }while((isIntersecting(moleHoleX,moleHoleY,moleHoleWidth,moleHoleHeight,positions)) &&(numPositionAttempts<=numPositionAttemptsLimit) )
        if(numPositionAttempts<=numPositionAttemptsLimit){
            moleHole.style.left= `${moleHoleX}px`
            moleHole.style.top= `${moleHoleY}px`
            positions.push({X:moleHoleX, Y:moleHoleY});

            addMoleImages(moleHole);  
        }else{
            moleHole.remove();
        }  
    });
    moleHoles= document.querySelectorAll('.mole-hole');
}

function addMoleImages(moleHole){
    for(let i=0; i<states.length;i++){
        let img_url= image_urls[`mole_img_${states[i]}`]
        const img= document.createElement('img'); 
        img.src= img_url;
        img.id= states[i];
        img.classList.add('hide');
        moleHole.appendChild(img);
    }
}

function getMoles(){
    moleHoles= document.querySelectorAll('.mole-hole');
    for(moleHole of moleHoles){
        moles.push({
            status:'init',
            holeId: moleHole.id,
            startTime: Date.now(),
            king:true,
        })
    }
}

function hungryMoleEventListener(selector,mole){
    const hungryMole= document.querySelector(selector);
    if(hungryMole){
        hungryMole.addEventListener('mousedown',()=>{
                mole.status= 'fed';
            });     
            return 0;
    }
}

function moleLifeCycle(mole){
    switch(mole.status){
        case 'init':
            redrawMole(mole)
            mole.status= 'hungry';
            return 10;
        case 'gone':
            if(Math.random()>KING_PROBABILITY){
                mole.king=true
            }
            redrawMole(mole)
            mole.status= 'hungry';
            return getInterval();
        case 'hungry':
            hungryMoleEventListener(`#${mole.holeId} img#hungry`,mole);
            hungryMoleEventListener(`#${mole.holeId} img#king_hungry`,mole);
            redrawMole(mole)
            mole.status= 'sad';
            return getHungryInterval(); 
        case 'sad':
            score= score > 0 ? --score : score;
            updateScoreWorm(score);
            redrawMole(mole)
            mole.status= 'leaving';
            return getSadInterval();
        case 'fed':
            if(mole.king){
                score+=4
            }else{
                score+=2;
            }
            updateScoreWorm(score);
            if(score>=SCOREMAX){
                const winscrn= document.querySelector('.winscreen')
                winscrn.style.display='block';
            }
            redrawMole(mole)
            mole.status= 'leaving';
            return getFedInterval();
        case 'leaving':
            redrawMole(mole)
            mole.king=false;
            mole.status= 'gone';
            return getLeaveInterval();
    }
}

function redrawMole(mole){
    let imgs= document.getElementById(mole.holeId).querySelectorAll('img')
    imgs.forEach(img=>{
        img.classList.toggle('hide', true);
        img.classList.toggle('show', false);
        })
    //if (mole.status==='init'){mole.status='fed'}
    if(mole.king){
        mole.status= `king_${mole.status}`
    }
    const img= document.getElementById(mole.holeId).querySelector(`#${mole.status}`);
    if(img){
        if(mole.status==='hungry' || mole.status==='king_hungry'){
            img.classList.toggle('mole-out', true);
        }
        if(mole.status==='leaving'|| mole.status==='king_leaving'){
            img.classList.toggle('mole-in', true);
        }
        img.classList.toggle('hide', false);
        img.classList.toggle('show', true);
    }
}

function updateScoreWorm(score){
    score_worm_container.style.width= `${(score/SCOREMAX)*100}%`;
    score_text.textContent= 'Score: '+ score.toString().padStart(2,'0');
}

function nextFrame(moles){
    function wait(){
        for(mole of moles){
            let currentTime= Date.now()
            if(currentTime>mole.startTime){
               mole.startTime = Date.now()+moleLifeCycle(mole);
            }
        }
        requestAnimationFrame(wait)
    }
     requestAnimationFrame(wait)
}
//---------------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    disperseMoleHoles();
    getMoles();
    nextFrame(moles);
});
