
const viewPortDiv= document.querySelector('.viewport-div');
const holesMax=20;
const numPositionAttemptsLimit=1000;
let positions= [];
let moleHoles;
let moleStatus='hungry';

function disperseMoleHoles(){
    //randomly calculate positions within the viewport
    //check if intersecting
    //if not, populate them with mole-holes
    
        for(let i= 1; i<=holesMax-1;i++){
            const moleHole= document.createElement('div');
            moleHole.classList.add('mole-hole');
            moleHole.id=`mole-hole-${i}`;
            moleHole.style.backgroundImage= `url('./img/soil-${i%4}.png')`;
            viewPortDiv.appendChild(moleHole);
        }
        moleholes= document.querySelectorAll('.mole-hole');
        positionMoleHole(moleholes, positions);
    
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
}

function showMoles(){
    moleHoles= document.querySelectorAll('.mole-hole');
    const moleIndex= Math.floor(Math.random()*moleholes.length)
    const moleHole= moleholes[moleIndex];
    if(!moleHole.querySelector('img')){
        const moleImg= document.createElement('img');
        moleImg.src='./img/mole-hungry.png';
        moleHole.appendChild(moleImg);
        console.log('show mole image elapsed');
        waitTimeMole(1800, moleImg);
    }
}

function showMolesLoop(){
    let timeThen= Date.now()
    let delta= 0;
    function wait(){
        
        if(Date.now()>timeThen){
            showMoles();
            timeThen= Date.now()+400-delta
            delta= Math.floor(Math.random()*100)
            console.log('show mole loop elapsed',Date.now()-timeThen);
        }
        requestAnimationFrame(wait)
    }
    requestAnimationFrame(wait);
}

function waitTimeMole(time,moleImg){
    setTimeout(()=>{
        moleImg.remove();
    },time);
}



//---------------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    disperseMoleHoles();
    showMolesLoop();
});


