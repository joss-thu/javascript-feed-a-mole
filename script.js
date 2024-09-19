
const viewPortDiv= document.querySelector('.viewport-div');
const holesMax=20;
const numPositionAttemptsLimit=1000;
let positions= [];
var moleholes;


function populateMoleHoles(){
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

function positionMoleHole(moleholes,positions){
    moleholes.forEach(molehole=>{
        let moleHoleX,moleHoleY;
        let numPositionAttempts=0;

        const moleHoleWidth= molehole.clientWidth;
        const moleHoleHeight= molehole.clientHeight;
        do{
            moleHoleX= Math.random() * (viewPortDiv.clientWidth-moleHoleWidth);
            moleHoleY= Math.random() * (viewPortDiv.clientHeight-moleHoleHeight);
            numPositionAttempts++;
           
        }while((isIntersecting(moleHoleX,moleHoleY,moleHoleWidth,moleHoleHeight,positions)) &&(numPositionAttempts<=numPositionAttemptsLimit) )
        if(numPositionAttempts<=numPositionAttemptsLimit){
            molehole.style.left= `${moleHoleX}px`
            molehole.style.top= `${moleHoleY}px`
            positions.push({X:moleHoleX, Y:moleHoleY});
            
        }else{
            molehole.remove();
        }


    });
}

function showMoles(){
    for(const moleHole of moleholes){
        const moleImg= document.createElement('img');
        moleImg.src='./img/mole-hungry.png';
        moleHole.appendChild(moleImg);
        wait(2000, moleImg);
    }
}

function wait(time,moleImg){
    const startTime= Date.now();

    function checkTime(){
        const currentTime= Date.now()
        if(currentTime-startTime>=time){

            moleImg.remove();
            console.log('elapsed');

            return;
        }
        requestAnimationFrame(checkTime);
    }
    requestAnimationFrame(checkTime);
}

//---------------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    populateMoleHoles();
    showMoles();
});


