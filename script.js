
const moleholes= document.querySelectorAll('.mole-hole');
const viewPortDiv= document.querySelector('.viewport-div');
const moleHoleWidth= moleholes[0].clientWidth;
const moleHoleHeight= moleholes[0].clientHeight;

function populateMoleHoles(){
    //randomly calculate positions within the viewport
    //check if intersecting
    //if not, populate them with mole-holes
    document.addEventListener('DOMContentLoaded',()=>{
        let positions= [];
        let moleholeNum=1;
    
        positionMoleHole(moleholes, positions);
    });
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
        do{
            moleHoleX= Math.random() * (viewPortDiv.clientWidth-moleHoleWidth);
            moleHoleY= Math.random() * (viewPortDiv.clientHeight-moleHoleHeight);
        }while(isIntersecting(moleHoleX,moleHoleY,moleHoleWidth,moleHoleHeight,positions))
        molehole.style.left= `${moleHoleX}px`
        molehole.style.top= `${moleHoleY}px`
        positions.push({X:moleHoleX, Y:moleHoleY});
    });
}

//---------------------------------------------------------------------------------
populateMoleHoles();
    
