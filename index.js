
const addBtn=document.getElementsByClassName("add-item")
const textArea=document.getElementsByClassName("text-area")
const items=document.getElementsByClassName("items")
const containerBox=document.getElementsByClassName("container-box")
const card=document.getElementsByClassName("card")
const cardArea=document.getElementsByClassName("card-area")


content={
    "0":-1,
    "1":-1,
    "2":-1
}

for(let i=0;i<addBtn.length;i++){
    addBtn[i].addEventListener("click",()=>{
        if(textArea[i].value.trim().length!=0){
            addCard(i)        
        }
    })
}

const addCard=(box_no)=>{
    content[box_no]+=1
    
    const cardnode=`
        <div class="card" id="card-${content[box_no]}" draggable="true" >
            ${textArea[box_no].value}
        </div>
        <div class="drop-space"></div>
    `
    cardArea[box_no].innerHTML+=cardnode
    textArea[box_no].value=""
}

