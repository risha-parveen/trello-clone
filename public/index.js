
const addBtn=document.getElementsByClassName("add-item")
const textArea=document.getElementsByClassName("text-area")
const items=document.getElementsByClassName("items")
const containerBox=document.getElementsByClassName("container-box")
const card=document.getElementsByClassName("card")
const cardArea=document.getElementsByClassName("card-area")
const deleteCardBtn=document.getElementsByClassName("delete-card")
const columnTitle=document.getElementsByClassName("column-title")

const model={
    'To Do':[],
    'Doing':[],
    'Done':[]
}

let title,description=null 

let content=null

let dragItem=null

let startColumn,endColumn,startIndex,endIndex=null

for(let col=0;col<cardArea.length;col++){
    cardArea[col].addEventListener('dragstart',e=>{
        dragItem=e.target
        setTimeout(()=>{
            e.target.display="none"
        },0)
        startColumn=col
        startIndex=e.target.id
    })

    cardArea[col].addEventListener('drag',e=>{
        setTimeout(()=>{
            e.target.style.display="none"
        },0)
    })

    cardArea[col].addEventListener('dragend',e=>{
        setTimeout(()=>{
            e.target.style.display="block"
        },0)
        dragItem=null
    })

    cardArea[col].addEventListener('dragover',e=>{
        e.preventDefault()
    })

    cardArea[col].addEventListener('dragenter',e=>{
        e.preventDefault()
    })

    cardArea[col].addEventListener('drop',e=>{
        e.currentTarget.append(dragItem)
        endColumn=col
        updateCardOnDrag()
    })
}

const updateCardOnDrag=()=>{
    if(startColumn!=endColumn){
        updateBox()
    }
}

const updateBox=()=>{
    box[startColumn]-=1
    box[endColumn]+=1
}

for(let i=0;i<addBtn.length;i++){
    addBtn[i].addEventListener("click",()=>{
        if(textArea[i].value.trim().length!=0){
            addCard(i)        
        }
    })
}

const box={
    "0":-1,
    "1":-1,
    "2":-1
}

const addCard=(box_no)=>{
    box[box_no]+=1
    const cardnode=`
        <div class="card" id="${box[box_no]}" draggable="true" >
            ${textArea[box_no].value}
            <button class="delete-card">x</button>
        </div>
    `
    cardArea[box_no].innerHTML+=cardnode

    title=columnTitle[box_no].innerHTML
    description=textArea[box_no].value

    let idValue=box[box_no]
    model[title].push({idValue,description})
    
    postData(model)

    textArea[box_no].value=""

    for(let i=0;i<cardArea[box_no].children.length;i++){
        cardArea[box_no].children[i].lastElementChild.addEventListener("dblclick",e=>{
            e.target.parentNode.remove()
            box[box_no]-=1
        })
    }
    console.log(box)
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





