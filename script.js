


document.addEventListener('DOMContentLoaded',()=>{
//randomly calculate positions within the viewport
//check if intersecting
//if not, populate them with mole-holes

    const moleholes= document.querySelectorAll('.mole-hole');
    const viewPortDiv= document.querySelector('.viewport-div');
    const moleHoleWidth= moleholes[0].clientWidth;
    const moleHoleHeight= moleholes[0].clientHeight;
    

    let positions= [];

    function isIntersecting(X,Y){
        for(let position of positions){
            if(
                (X<position.X+moleHoleWidth) && (X+moleHoleWidth>position.X) &&
                (Y<position.Y+moleHoleWidth) && (Y+moleHoleWidth>position.Y)){
                    return true;
                }
        }
        return false;
    }

2
    moleholes.forEach(molehole=>{
        let moleHoleX,moleHoleY;
        do{
            moleHoleX= Math.random() * (viewPortDiv.clientWidth-moleHoleWidth);
            moleHoleY= Math.random() * (viewPortDiv.clientHeight-moleHoleHeight);
        }while(isIntersecting(moleHoleX,moleHoleY))

        molehole.style.left= `${moleHoleX}px`
        molehole.style.top= `${moleHoleY}px`
        positions.push({X:moleHoleX, Y:moleHoleY});
});
});

