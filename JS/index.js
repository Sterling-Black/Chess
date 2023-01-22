let v = 9;
let ascii = 65;//The value of a in ascii
let box = document.querySelectorAll(".box");
let peice = document.querySelectorAll(".peice");

let dot = "<div class='dot'>·</div>";
let Cdot = "<div class='Cdot'>·</div>"

let select;
let selectID;

let turn = "white";
let castel = true;



function play(file) {
    let audioTrack = new Audio(file);
    audioTrack.preload = 'auto';
    console.log("audio file " + file + "length:" + audioTrack.duration + "  sec.");
    audioTrack.onloadeddata = function () {
        console.log("audio: " + file + " has successfully loaded."); 
    }; 
    audioTrack.play();
}

function Box(id){
    this.inID;
    this.empty ;
    this.doted = false;
    this.opColor ;
    this.value ;
    this.ready = false;
    this.id = id;
    this.click = ()=>{

        if(this.doted||(this.ready&&!this.empty)){


            let id = selectID;//id of selected peice
            let selPei = peices[id];
            changePos(this);

            if(turn == "white")
            turn = "black";
            else
            turn = "white";

            if(castel){
                let [h,v] = selPei.pos;
                let rpos, i, j, rock, Nrpos, rBox, nrBox;
                j=v;

                
                console.log("castel");
                i=String.fromCharCode(h.charCodeAt()-2);
                rpos=i+j;
                Nrpos=String.fromCharCode(h.charCodeAt()+1)+j;
                rBox = boxs[rpos];
                nrBox = boxs[Nrpos];
                if(!rBox.empty){
                    rock=peices[rBox.inID];
                    select=rock.html;
                    selectID=rock.id;
                    if(rock.type=="rock"&&rock.color==selPei.color){
                        changePos(nrBox);
                    }
                }


                i = String.fromCharCode(h.charCodeAt()+1);
                rpos=i+j;
                Nrpos=String.fromCharCode(h.charCodeAt()-1)+j;
                rBox = boxs[rpos];
                nrBox = boxs[Nrpos];
                if(!rBox.empty){
                    rock=peices[rBox.inID];
                    select=rock.html;
                    selectID=rock.id;
                    if(rock.type=="rock"&&rock.color==selPei.color){
                        changePos(nrBox);
                    }
                }
                castel = false;
                play("Sound/castel.mp3")
            }else{
                play("Sound/move.mp3");
            }
            document.querySelectorAll(".box").forEach(elem=>{
                let id1 = elem.id;
                if(boxs[id1].empty == false){
                    elem.innerHTML = boxs[id1].value; 
                }else{
                    elem.innerHTML= "";
                    boxs[id1].opColor = "";  
                    boxs[id1].doted = false;
                }
                boxs[id1].ready = false; 
            });
            document.querySelectorAll(".peice").forEach(elem=>{
                elem.addEventListener("click",()=>{
                    let id1 = elem.id;
                    peices[id1].click();
                })
            });
        }
    }
}

function Peice(id, type, html){
    this.firstMove = true;
    this.selectedPeice = false;
    this.pos ; 
    this.color ;
    this.id = id;
    this.type = type;
    this.html = html;
    this.danger = false;
    this.click = ()=>{

        if(this.color == turn){

            
            

            castel = false;
            refresh();
            if(!this.danger){
                document.querySelectorAll(".peice").forEach(elem=>{
                    peices[elem.id].danger = false;
                });
    
                select = this.html;//selected peice
                selectID = this.id;//id os selected peice
                switch(this.type){
                    case "pawn":
                        $("#"+this.id).css("border","3px solid green");
                        movePawn(this);
                    break;
                    case "rock":
                        $("#"+this.id).css("border","3px solid green");
                        moveRock(this);
                    break;
                    case "bishop":
                        $("#"+this.id).css("border","3px solid green");
                        moveBishop(this);
                    break;
                    case "knight":
                        $("#"+this.id).css("border","3px solid green");
                        moveKnight(this);
    
                    break;
                    case "queen":
                        $("#"+this.id).css("border","3px solid green");
                        moveQueen(this);
                    break;
                    case "king":
                        $("#"+this.id).css("border","3px solid green");
                        moveKing(this);
                    break;
                    default:
    
                    break;
                }
            }
    
            document.querySelectorAll(".peice").forEach(elem=>{
                elem.addEventListener("click",()=>{
                    peices[elem.id].click();
                })
            });
        }

    }
}


const boxs = [];
const peices = [];

box.forEach((elem, index)=>{

    let empty = false;
    let pei = elem.firstChild;
    let opColor = "";
    let value = "";
    let peiID  = "";

    if(pei != null){
        opColor = pei.classList[2];
        value = pei.outerHTML;
        peiID = pei.id;
    }else{
        pei = "";
    }
    
    

    if((index)%8==0){
        v--;// next row
        ascii = 65// value of A in ascii    
    }
    if(elem.innerHTML == ""){//if box is empty(no image in it)
        empty = true;
    }
    
    let h = String.fromCharCode(ascii);// Convert Ascii value into string

    elem.id = h+v;
    
    let pos = elem.id;
    
    boxs[pos] = new Box(pos);// create objects for each box 

    boxs[pos].opColor = opColor;
    boxs[pos].empty = empty;
    boxs[pos].value = value;
    boxs[pos].inID = peiID;

    elem.addEventListener("click",()=>{
        boxs[pos].click();
    });

    ascii++;
});

peice.forEach((pei)=>{
    // console.log(pei);
    let [,type,color] = pei.classList;
    let id = pei.id;
    let html = pei.outerHTML;
    let pos = pei.parentElement.id;

    // console.log(pos);

    peices[id] = new Peice(id, type, html);

    peices[id].color = color;
    peices[id].pos = pos;
    pei.addEventListener("click",()=>{
        box.forEach((elem)=>{
            elem.innerHTML = boxs[elem.id].value;
        });
        peices[id].click();
    });
    // pei.onclick = peices[id].click();
});

function refresh(){
    document.querySelectorAll(".box").forEach((elem)=>{
        let id = elem.id;
        let box1 = boxs[id];
        if(box1.empty==false){
            elem.innerHTML = box1.value;
        }else{
            elem.innerHTML= "";
            box1.opColor = "";  
            box1.doted = false;
            box1.ready = false; 
        }
    });
}

function empty(that){
    that.empty = true;
    that.doted = false;
    that.opColor = "";
    that.value = "";
    that.ready = false;
    that.inID = "";
}

function movePawn(that){

    let [h,v]=that.pos;
    v = parseInt(v);
    let leftH= String.fromCharCode(h.charCodeAt()-1);
    let rightH= String.fromCharCode(h.charCodeAt()+1);
    let n = 2, i;
    let color = that.color;

    if(!that.firstMove){n=1}
    if(color=="white"){
        let pos, r1=true;
        for(i=v+1;i<=v+n&&i<9;i++){//forward movement
            pos=leftH+i;
            // console.log(pos);
            if(leftH>='A' && boxs[pos].empty==false && boxs[pos].opColor=="black" && r1){

                let pID=boxs[pos].inID;
                peices[pID].danger = true;
                boxs[pos].ready = true;
                $("#"+pID).css("border","solid 1px yellow");

            }
            pos = rightH+i;
            if(rightH<='H'  && boxs[pos].empty==false && boxs[pos].opColor=="black" && r1){

                let pID=boxs[pos].inID;
                peices[pID].danger = true;
                boxs[pos].ready = true;
                $("#"+pID).css("border","solid 1px yellow");

            }
            if(boxs[h+i].empty == true){
                boxs[h+i].doted = true;
                $("#"+h+i).html(dot);
            }else{ i=v+n+1; }

            r1 = false;
        }
    }else if(color=="black"){
        let pos, r1=true;
        for(i=v-1;i>=v-n&&i>0;i--){//backward movement
            pos = leftH+i;

            if(leftH>='A' && boxs[pos].empty==false && boxs[pos].opColor=="white" && r1){

                let pID=boxs[pos].inID;
                peices[pID].danger = true;
                boxs[pos].ready = true;
                $("#"+pID).css("border","solid 1px yellow");

            }
            pos = rightH+i;

            if(rightH<='H' && boxs[pos].empty==false && boxs[pos].opColor=="white" && r1){

                let pID=boxs[pos].inID;
                peices[pID].danger = true;
                boxs[pos].ready = true;
                $("#"+pID).css("border","solid 1px yellow");

            }

            if(boxs[h+i].empty == true){
                boxs[h+i].doted = true;
                $("#"+h+i).html(dot);
            }else{  i=v-n-1; }

            r1 = false;
        }
    }
}

function moveRock(that){
    let [h,v]=that.pos;
    v = parseInt(v);
    let leftH= String.fromCharCode(h.charCodeAt()-1);
    let rightH= String.fromCharCode(h.charCodeAt()+1);
    let topV = v+1;
    let bottomV = v-1;
    let i, j;
    let pos;
    let color = that.color

    i=leftH;
    pos = i+v;
    while(i>'@'&&i<'I'&&boxs[pos].empty){//left direction
        boxs[pos].doted = true;
        $("#"+pos).html(dot);
        i = String.fromCharCode(i.charCodeAt()-1);
        pos = i+v;
    }if(i>'@'&&i<'I' && !boxs[pos].empty && boxs[pos].opColor!=color){
        danger(pos);
    }

    i=rightH;    
    pos = i+v;
    while(i>'@'&&i<'I'&&boxs[pos].empty){//right direction
        boxs[pos].doted = true;
        $("#"+pos).html(dot);
        i = String.fromCharCode(i.charCodeAt()+1);
        pos = i+v;
    }if(i>'@'&&i<'I'&& !boxs[pos].empty && boxs[pos].opColor!=color){
        danger(pos);
    }

    j=bottomV;    
    pos = h+j;
    while(j>0&&j<9&&boxs[pos].empty){//upward direction
        boxs[pos].doted = true;
        $("#"+pos).html(dot);
        j--;
        pos = h+j;
    }if(j>0&&j<9&& !boxs[pos].empty && boxs[pos].opColor!=color){
        danger(pos);
    }

    j=topV;    
    pos = h+j;
    while(j>0&&j<9&&boxs[pos].empty){//downward direction
        boxs[pos].doted = true;
        $("#"+pos).html(dot);
        j++; 
        pos = h+j;
    }if(j>0&&j<9&& !boxs[pos].empty  && boxs[pos].opColor!=color){
        danger(pos);
    }

}

function moveBishop(that){
    let [h,v]=that.pos;
    v = parseInt(v);
    let leftH= String.fromCharCode(h.charCodeAt()-1);
    let rightH= String.fromCharCode(h.charCodeAt()+1);
    let topV = v+1;
    let bottomV = v-1;
    let i, j;
    let pos;
    let color = that.color;


    i=leftH;
    j=topV;
    pos = i+j;
    while((i>'@'&&i<'I'&&j>0&&j<9) && boxs[pos].empty){//left-top direction
        boxs[pos].doted = true;
        $("#"+pos).html(dot);
        i = String.fromCharCode(i.charCodeAt()-1);
        j++;
        pos = i+j;
    }if((i>'@'&&i<'I' &&j>0&&j<9) && !boxs[pos].empty && boxs[pos].opColor!=color){
        danger(pos);
    }


    i=rightH;
    j=topV;
    pos = i+j;
    while((i>'@'&&i<'I'&&j>0&&j<9) && boxs[pos].empty){//right-top direction
        boxs[pos].doted = true;
        $("#"+pos).html(dot);
        i = String.fromCharCode(i.charCodeAt()+1);
        j++;
        pos = i+j;
    }if((i>'@'&&i<'I' &&j>0&&j<9) && !boxs[pos].empty && boxs[pos].opColor!=color){
        danger(pos);
    }


    i=rightH;
    j=bottomV;
    pos = i+j;
    while((i>'@'&&i<'I'&&j>0&&j<9) && boxs[pos].empty){//right-bottom direction
        boxs[pos].doted = true;
        $("#"+pos).html(dot);
        i = String.fromCharCode(i.charCodeAt()+1);
        j--;
        pos = i+j;
    }if((i>'@'&&i<'I' &&j>0&&j<9) && !boxs[pos].empty && boxs[pos].opColor!=color){
        danger(pos);
    }


    i=leftH;
    j=bottomV;
    pos = i+j;
    while((i>'@'&&i<'I'&&j>0&&j<9) && boxs[pos].empty){//left-bottom direction
        boxs[pos].doted = true;
        $("#"+pos).html(dot);
        i = String.fromCharCode(i.charCodeAt()-1);
        j--;
        pos = i+j;
    }if((i>'@'&&i<'I' &&j>0&&j<9) && !boxs[pos].empty && boxs[pos].opColor!=color){
        danger(pos);
    }
}

function moveKnight(that){
    let [h,v]=that.pos;
    v = parseInt(v);
    let leftH= String.fromCharCode(h.charCodeAt()-2);
    let rightH= String.fromCharCode(h.charCodeAt()+2);
    let topV = v+2;
    let bottomV = v-2;
    let i, j, k=0, ver, hor;
    let pos;
    let color = that.color;

    i=leftH;
    for(k=-1;k<2;k+=2){//left {top and bottom}
        j = v+k;
        pos = i+j;
        // console.log(pos);
        if((i>'@'&&i<'I'&&j>0&&j<9) && boxs[pos].empty){
            boxs[pos].doted = true;
            $("#"+pos).html(dot);
        }else if((i>'@'&&i<'I' &&j>0&&j<9) && !boxs[pos].empty && boxs[pos].opColor!=color){
            danger(pos);
        }
    }

    i=rightH;
    for(k=-1;k<2;k+=2){//right {top and bottom}
        j = v+k;
        pos = i+j;
        // console.log(pos);
        if((i>'@'&&i<'I'&&j>0&&j<9) && boxs[pos].empty){
            boxs[pos].doted = true;
            $("#"+pos).html(dot);
        }else if((i>'@'&&i<'I' &&j>0&&j<9) && !boxs[pos].empty && boxs[pos].opColor!=color){
            danger(pos);
        }
    }

    j=topV;
    for(k=-1;k<2;k+=2){//top {left and right}
        i =  String.fromCharCode(h.charCodeAt()+k);
        pos = i+j;
        // console.log(pos);
        if((i>'@'&&i<'I'&&j>0&&j<9) && boxs[pos].empty){
            boxs[pos].doted = true;
            $("#"+pos).html(dot);
        }else if((i>'@'&&i<'I' &&j>0&&j<9) && !boxs[pos].empty && boxs[pos].opColor!=color){
            danger(pos);
        }
    }

    j=bottomV;
    for(k=-1;k<2;k+=2){//bottom {left and right}
        i =  String.fromCharCode(h.charCodeAt()+k);
        pos = i+j;
        // console.log(pos);
        if((i>'@'&&i<'I'&&j>0&&j<9) && boxs[pos].empty){
            boxs[pos].doted = true;
            $("#"+pos).html(dot);
        }else if((i>'@'&&i<'I' &&j>0&&j<9) && !boxs[pos].empty && boxs[pos].opColor!=color){
            danger(pos);
        }
    }
}

    


function moveQueen(that){//NB: the queen has the moves of both the bishop and the rocks
    moveRock(that);
    moveBishop(that);
}

function moveKing(that){
    let [h,v]=that.pos;
    v = parseInt(v);
    let leftH= String.fromCharCode(h.charCodeAt()-1);
    let rightH= String.fromCharCode(h.charCodeAt()+1);
    let topV = v+1;
    let bottomV = v-1
    let i, j, k=0, ver, hor;
    let pos;
    let color = that.color;

    i=leftH;
    for(k=-1;k<2;k++){//left {top and bottom}
        j = v+k;
        pos = i+j;
        // console.log(pos);
        if((i>'@'&&i<'I'&&j>0&&j<9) && boxs[pos].empty){
            boxs[pos].doted = true;
            $("#"+pos).html(dot);
        }else if((i>'@'&&i<'I' &&j>0&&j<9) && !boxs[pos].empty && boxs[pos].opColor!=color){
            danger(pos);
        }
    }

    i=rightH;
    for(k=-1;k<2;k++){//right {top and bottom}
        j = v+k;
        pos = i+j;
        // console.log(pos);
        if((i>'@'&&i<'I'&&j>0&&j<9) && boxs[pos].empty){
            boxs[pos].doted = true;
            $("#"+pos).html(dot);
        }else if((i>'@'&&i<'I' &&j>0&&j<9) && !boxs[pos].empty && boxs[pos].opColor!=color){
            danger(pos);
        }
    }

    j=topV;
    for(k=-1;k<2;k++){//top {left and right}
        i =  String.fromCharCode(h.charCodeAt()+k);
        pos = i+j;
        // console.log(pos);
        if((i>'@'&&i<'I'&&j>0&&j<9) && boxs[pos].empty){
            boxs[pos].doted = true;
            $("#"+pos).html(dot);
        }else if((i>'@'&&i<'I' &&j>0&&j<9) && !boxs[pos].empty && boxs[pos].opColor!=color){
            danger(pos);
        }
    }

    j=bottomV;
    for(k=-1;k<2;k++){//bottom {left and right}
        i =  String.fromCharCode(h.charCodeAt()+k);
        pos = i+j;
        // console.log(pos);
        if((i>'@'&&i<'I'&&j>0&&j<9) && boxs[pos].empty){
            boxs[pos].doted = true;
            $("#"+pos).html(dot);
        }else if((i>'@'&&i<'I' &&j>0&&j<9) && !boxs[pos].empty && boxs[pos].opColor!=color){
            danger(pos);
        }
    }

    j=v;
    if(that.firstMove){
        i=String.fromCharCode(h.charCodeAt()+2);//castle position
        let pos = i+j;
        let rpos = String.fromCharCode(h.charCodeAt()+3)+j;
        let rock = peices[boxs[rpos].inID];
        if((i>'@'&&i<'I'&&j>0&&j<9) && boxs[pos].empty && !boxs[rpos].empty && boxs[rpos].opColor == color && rock.type=="rock"  && rock.firstMove){
            boxs[pos].doted = true;
            $("#"+pos).html(Cdot);
            castel = true;
        }
        i=String.fromCharCode(h.charCodeAt()-2);
        pos = i+j;
        rpos = String.fromCharCode(h.charCodeAt()-4)+j;
        rock = peices[boxs[rpos].inID];
        if((i>'@'&&i<'I'&&j>0&&j<9) && boxs[pos].empty && !boxs[rpos].empty && boxs[rpos].opColor == color && rock.type=="rock"  && rock.firstMove){
            boxs[pos].doted = true;
            $("#"+pos).html(Cdot);
            castel = true;
        }
    }
}


function danger(pos){
    let pID=boxs[pos].inID;
    if(peices[pID].type=="king"){
        console.log("checkMate");
        peices[pID].danger = true;
        boxs[pos].ready = true;
        $("#"+pID).css("border","solid 3px red");
        play("Sound/checkmate.mp3");
        play("Sound/1.mp3");
    }else{
    peices[pID].danger = true;
    boxs[pos].ready = true;
    $("#"+pID).css("border","solid 3px yellow");
    }
}

function changePos(that){
    let id = selectID;//id of selected peice
    let selPei = peices[id];
    let oldPos = selPei.pos;
    let boxEmp = boxs[oldPos];
    
    empty(boxEmp);

    console.log(id+" moved from "+oldPos+" to "+that.id);
    
    selPei.id = id;//changing the values of the selected peice
    selPei.pos = that.id;
    selPei.firstMove=false;
    
    
    that.value = select;//changing the values of the new box
    that.opColor = selPei.color;
    that.empty = false;
    that.ready = false;
    that.doted = false;
    that.inID = id;
    
    select = "";
    selectID = "";

    // play();

    



}
