var canvas = document.getElementById("myCanvas")
var ctx = canvas.getContext("2d")

alert("W - вверх S - вниз")

var score = 0 //счёт
var s=0 //буфер
var s1=0//буфер 2
var s2=0//буфер 3
var tx=5 //положение пластины x
var ty=5 //положение пластины y
var tdy=0 //скорость пластины
var shx=16 //положение шара x
var shy=Math.random()*(canvas.height-10) //положение шара y
var shdx=3.5 //скорость шара x
var shdy=(Math.random()-0.5)*8 //скорость шара y
var colorid = ["#ff0000","#d84b20","#EC9210","#ffd800","#CBE900","#96fa00","#4BBD00","#008000","#219580","#42aaff","#0000ff","#2600C1","#4b0082","#9D41B8","#ee82ee","#F74177"] //радуга 
var colorch = 0 //цикл радуги
var textlosesize = canvas.width/8 + "px Tahoma" //шрифт
var bricksx=[]
var bricksy=[]
var colbricks = 4
var colost=colbricks
var life = 3
var spead = 9
var timer

function generatebricks(){
    for (var i = 0; i<colbricks;i++){
        s=1
        while(s!=0){
            s=0
            s1=(Math.random()*20).toFixed()
            s2=(Math.random()*7).toFixed()
            for (var j=0;j<i;j++){
                if(s1==bricksx[j] && s2==bricksy[j]){
                    s=s+1
                }
            }
        }
        bricksx[i]=s1
        bricksy[i]=s2
    }
}

function keybordup(){
    if((event.which==83 && tdy==5)||(event.which==87 && tdy==-5)){
        tdy=0
    }
}
function keyborddown(){
    if(event.which==87){
        tdy=-5
    }
    else if(event.which==83){
        tdy=5
    } 
}

function draw(){
//очистка
    ctx.clearRect(0,0, canvas.width, canvas.height)
//шар
    ctx.beginPath()
    ctx.arc (shx,shy,7,0,Math.PI*2);
    ctx.fillStyle = colorid[colorch]
    ctx.fill()
    ctx.closePath()
//пластина
    ctx.beginPath()
    ctx.fillStyle = "black"
    ctx.fillRect (tx,ty,10,100);
    ctx.closePath()
//кирпичи
    for (var i=0;i<colbricks;i++){
        ctx.fillRect (canvas.width-bricksx[i]*7-10,canvas.height*bricksy[i]/8,6,canvas.height/8.1);
    }

    if (life<=0){
        ctx.font = textlosesize
        ctx.fillText("you lose", canvas.width/3.5, canvas.height/2.5);
        ctx.fillText("score:"+score, canvas.width/3.5, canvas.height/1.6);
        
    }
//жизни
    for (var i=1;i<=life;i++){
        ctx.beginPath()
        ctx.arc (10.5*i+12,10,5,0,Math.PI*2);
        ctx.fillStyle = colorid[(colorch+i)%colorid.length]
        ctx.fill()
        ctx.closePath()
    }
   
}
//смэрц
function lose(){
    shx=20
    shy=Math.random()*(canvas.height-10)
    shdy=(Math.random()-0.5)*7
    shdx=3
    score = 0
    colbricks = 4
    colost=colbricks
    life=3
    generatebricks()
}
//победа
function win(){
    colbricks=colbricks*2
    colost=colbricks
    generatebricks()
}
function run(){
//движение
    shx=shx+shdx
    shy=shy+shdy
    ty=ty+tdy
    if(tx<0){
        tx=0
    }
//контроль выхода пластины за границу
    if(ty<0){
        ty=0
    }
    if(ty>canvas.height-100){
        ty=canvas.height-100
    }
//отскок справа
    if (shx>canvas.width){
        shdx=-shdx
        colorch=colorch+1
//отскок сверху и снизу
    }
    if (shy+7>canvas.height || shy<0){
        shdy=-shdy
        colorch=colorch+1
    }
//отскок от пластины
    if (shx<16 && shx>16+1.4*shdx && shy>ty-2 && shy<ty+102){
        shdx=-shdx
        shdy=shdy+(tdy/10)
        shdy=shdy+(Math.random()-0.5)/2
        colorch=colorch+1
    }
//отскок от кирпичей
    for (var i=0;i<colbricks;i++){
        if(shx>canvas.width-bricksx[i]*7-10 && shx<canvas.width-bricksx[i]*7-3 && shy > canvas.height*bricksy[i]/8 && shy < canvas.height*bricksy[i]/8+canvas.height/8.1){
            score++
            colorch=colorch+1
            shdx=-shdx
            bricksx[i]=canvas.width
            bricksy[i]=canvas.height
            colost--
        }
    }
//левый край=смэрц
    if (shx<4 && shdx != 0){
        if (shx<7){
            shdx=-shdx
            colorch=colorch+1
        }
        life--
        if(life<=0){
            shdx=0
            shdy=0
            setTimeout(lose,1000)
        }
//радуга
    }
    if (colorch >= colorid.length){
            colorch = 0
    }
//победа
    if(colost<=0){
        win()
    }
    shdy=shdy
    draw()
}

generatebricks()
timer = setInterval(run,spead)

document.addEventListener('keydown',keyborddown)
document.addEventListener('keyup',keybordup)
