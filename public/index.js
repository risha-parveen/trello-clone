
const addBtn=document.getElementsByClassName("add-item")
const textArea=document.getElementsByClassName("text-area")
const items=document.getElementsByClassName("items")
const containerBox=document.getElementsByClassName("container-box")
const card=document.getElementsByClassName("card")
const cardArea=document.getElementsByClassName("card-area")
const deleteCardBtn=document.getElementsByClassName("delete-card")
const columnTitle=document.getElementsByClassName("column-title")

const model={
    to_do:[],
    doing:[],
    done:[]
}

let title=""
let description=""

let content=null

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

function Drop(e){
    this.append(dragItem)
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
        <div class="card" draggable="true" >${textArea[box_no].value}<button class="delete-card">x</button></div>
    `
    cardArea[box_no].innerHTML+=cardnode

    title=columnTitle[box_no].innerHTML
    description=textArea[box_no].value
    let str=title
    console.log(model[str])
    //postData(model)

    textArea[box_no].value=""

    for(let i=0;i<cardArea[box_no].children.length;i++){
        cardArea[box_no].children[i].lastElementChild.addEventListener("dblclick",e=>{
            e.target.parentNode.remove()
        })
    }
}

//fetch post
async function postData(content){
    const options={
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify(content)
    }

    const response= await fetch('/',options)
    const json=await response.json()
    console.log(json)
}

const myCar = {
    make: 'Ford',
    model: 'Mustang',
    year: 1969
  };

let propertyName = 'make';
myCar[propertyName] = 'Ford';

propertyName = 'model';
myCar[propertyName] = 'Mustang';

console.log(myCar[propertyName])




