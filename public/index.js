
const addBtn=document.getElementsByClassName("add-item")
const textArea=document.getElementsByClassName("text-area")
const items=document.getElementsByClassName("items")
const containerBox=document.getElementsByClassName("container-box")
const card=document.getElementsByClassName("card")
const cardArea=document.getElementsByClassName("card-area")
const deleteCardBtn=document.getElementsByClassName("delete-card")
const columnTitle=document.getElementsByClassName("column-title")

let title,description=null 

let content=null

let dragItem=null

let startColumn,endColumn=null

// drag and drop functionality=>
for(let col=0;col<cardArea.length;col++){
    cardArea[col].addEventListener('dragstart',e=>{
        dragItem=e.target
        setTimeout(()=>{
            e.target.display="none"
        },0)
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
    })
}

// added event listener for the button

for(let box_no=0; box_no<addBtn.length; box_no++){
    addBtn[box_no].addEventListener("click",()=>{
        if(textArea[box_no].value.trim().length!=0){
            description=textArea[box_no].value
            addCard(box_no,description)        
        }
    })
}

const addCard=(box_no,description)=>{
    const cardnode=`
        <div class="card" draggable="true" >
            ${description}
            <button class="delete-card">x</button>
        </div>
    `
    cardArea[box_no].innerHTML+=cardnode

    textArea[box_no].value=""

    addDeleteCardEventListener(box_no)
}

const addDeleteCardEventListener=box_no=>{
    for(let i=0;i<cardArea[box_no].children.length;i++){
        cardArea[box_no].children[i].lastElementChild.addEventListener("dblclick",e=>{
            e.target.parentNode.remove()
        })
    }
}

let id=null

const renderData=(json)=>{
    let data=json[0]
    for(let i in data){
        switch(i){
            case "id":
                id="id"
                break
            case "To Do":
                title="To Do"
                box_no=0
                break
            case "Doing":
                title="Doing"
                box_no=1
                break
            case "Done":
                title="Done"
                box_no=2
                break
            default:
                continue
        }
        for(let j in data[title]){
            description=data[title][j].description
            cardId=data[title][j].cardId
            addCard(box_no,description)
        }
    }
}

const getData = async ()=>{
    const response = await fetch('/get_data')
    const json=await response.json()
    console.log(json)
    if(json.length===0) return
    renderData(json)
}

window.onload=getData
