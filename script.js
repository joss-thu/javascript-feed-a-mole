
const viewPortDiv= document.querySelector('.viewport-div');
const holesMax=20;
const numPositionAttemptsLimit=1000;
let positions= [];
let moleHoles;
let moles=[];

mole_img_hungry= './img/mole-hungry.png';
mole_img_sad= './img/mole-sad.png';
mole_img_fed= './img/mole-fed.png';
mole_img_leaving= './img/mole-leaving.png';
cursor_bird= './img/cursor.png';
cursor_bird_worm= './img/cursor-worm.png';

MOLE_MIN_INTERVAL= 2000
MOLE_MAX_INTERVAL= 10000

MOLE_HUNGRY_INTERVAL= 1500
MOLE_SAD_INTERVAL= 300
MOLE_FED_INTERVAL= 500
MOLE_LEAVE_INTERVAL= 300

const getInterval= ()=>MOLE_MIN_INTERVAL+Math.floor(Math.random()*MOLE_MAX_INTERVAL)
const getHungryInterval= ()=>MOLE_HUNGRY_INTERVAL
const getSadInterval= ()=>MOLE_SAD_INTERVAL
const getFedInterval= ()=>MOLE_FED_INTERVAL
const getLeaveInterval= ()=>MOLE_LEAVE_INTERVAL


function disperseMoleHoles(){
        for(let i= 1; i<=holesMax-1;i++){
            const moleHole= document.createElement('div');
            moleHole.classList.add('mole-hole');
            moleHole.id=`mole-hole-${i}`;
            moleHole.style.backgroundImage= `url('./img/soil-${i%4}.png')`;
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
            
        }else{
            moleHole.remove();
        }  
    });
    moleHoles= document.querySelectorAll('.mole-hole');
}

function getMoles(){
    moleHoles= document.querySelectorAll('.mole-hole');
    for(moleHole of moleHoles){
        moles.push({
            status:'gone',
            holeId: moleHole.id,
            startTime: Date.now()
        })
    }
}

function moleLifeCycle(mole){
    let img;
    switch(mole.status){
        case 'gone':
            if(document.getElementById(mole.holeId).querySelector('img')){
                hideMole(mole);
            }
            mole.status= 'hungry';
            return getInterval();
        case 'hungry':
            if(!document.getElementById(mole.holeId).querySelector('img')){
                img= mole_img_hungry
                showMole(mole,img);
                mole.status= 'sad';
            return getHungryInterval();
            }
            break;

        case 'sad':
            hideMole(mole);
            img= mole_img_sad;
            showMole(mole,img);
            mole.status= 'leaving';
            return getSadInterval();
        case 'leaving':
            hideMole(mole);
            img= mole_img_leaving
            showMole(mole,img);
            mole.status= 'gone';
            return getLeaveInterval();
    }
}

function showMole(mole,img){
        const moleImg= document.createElement('img');
        moleImg.src=img;
        document.getElementById(mole.holeId).appendChild(moleImg);
}

function hideMole(mole){
    document.getElementById(mole.holeId).querySelector('img').remove();
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

});
   
nextFrame(moles);




