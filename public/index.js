
const addBtn=document.getElementsByClassName("add-item")
const textArea=document.getElementsByClassName("text-area")
const items=document.getElementsByClassName("items")
const containerBox=document.getElementsByClassName("container-box")
const card=document.getElementsByClassName("card")
const cardArea=document.getElementsByClassName("card-area")
const deleteCardBtn=document.getElementsByClassName("delete-card")
const cardCombo=document.getElementsByClassName("card-combo")

let dragItem=null

for(let i=0;i<cardArea.length;i++){
    cardArea[i].addEventListener('dragstart',dragStart,false)
    cardArea[i].addEventListener('drag',drag,false)
    cardArea[i].addEventListener('dragend',dragEnd,false)
    cardArea[i].addEventListener('dragover',dragOver,false)
    cardArea[i].addEventListener('dragenter',dragEnter,false)
    cardArea[i].addEventListener('drop',Drop,false)
}

function dragStart(e){
    dragItem=e.target
    setTimeout(()=>{
        e.target.display="none"
    },0)
    console.log(dragItem)
}

function drag(e){
    setTimeout(()=>{
        e.target.style.display="none"
    },0)
}

function dragEnd(e){
    setTimeout(()=>{
        e.target.style.display="block"
    },0)
    dragItem=null
}

function insertAfter(newNode, existingNode) {
    existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
}

function Drop(e){
    if(e.target.className==="card-drop"){
        insertAfter(dragItem,e.target.parentNode)
    }
}

function dragOver(e){
    e.preventDefault()
}

function dragEnter(e){
    e.preventDefault()
}

for(let i=0;i<addBtn.length;i++){
    addBtn[i].addEventListener("click",()=>{
        if(textArea[i].value.trim().length!=0){
            addCard(i)        
        }
    })
}



const addCard=(box_no)=>{
    const cardnode=`
        <div class="card-combo" draggable="true">
            <div class="card">
                ${textArea[box_no].value}
                <button class="delete-card">x</button>
            </div>
            <div class="card-drop"></div>
        </div>
    `
    cardArea[box_no].innerHTML+=cardnode
    textArea[box_no].value=""

    /*for(let i=0;i<cardArea[box_no].children.length;i++){
        cardArea[box_no].children[i].lastElementChild.addEventListener("dblclick",e=>{
            e.target.parentNode.remove()
        })
    }*/
}