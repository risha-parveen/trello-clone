
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
        if(e.target.className==="card-drop"){
            insertAfter(dragItem,e.target.parentNode)
        }
    })
}

function insertAfter(newNode, existingNode) {
    existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
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

const addCard=async (box_no,description)=>{
    const cardnode=`
        <div class="card-combo" draggable="true">
            <div class="card">
                ${description}
                <button class="delete-card">x</button>
            </div>
            <div class="card-drop"></div>
        </div>
    `
    cardArea[box_no].innerHTML+=cardnode
    await saveData({id:'id',title:columnTitle[box_no].innerHTML,cardId:1,description:description})
    .then(getData(true)
    .then(result=>console.log(result))
    )

    textArea[box_no].value=""

    addDeleteCardEventListener(box_no,description,true)
}

const addDeleteCardEventListener=(box_no,description,newly)=>{
    for(let i=0;i<cardArea[box_no].children.length;i++){
        if(cardArea[box_no].children[i].firstElementChild.firstElementChild===null) continue
        cardArea[box_no].children[i].firstElementChild.firstElementChild.addEventListener('dblclick',e=>{
            //storing the index of the current card being deleted
            const index=Array.prototype.indexOf.call(e.target.parentNode.parentNode.parentNode.children, e.target.parentNode.parentNode)
           
            cardId=json[0][columnTitle[box_no].innerHTML] 
            data={
                id:'id',
                title:columnTitle[box_no].innerHTML,
                cardId:cardId[index-1].cardId,
                description:cardId[index-1].description
            }
            deleteData(data)
            e.target.parentNode.parentNode.remove()
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

            const cardnode=`
                <div class="card-combo" draggable="true">
                    <div class="card">
                        ${description}
                        <button class="delete-card">x</button>
                    </div>
                    <div class="card-drop"></div>
                </div>
            `
            cardArea[box_no].innerHTML+=cardnode
            addDeleteCardEventListener(box_no,description,false)
        }
    }
}

let json=null

const getData = async (newly)=>{
    const response = await fetch('/get_data')
    json=await response.json()
    if(newly===false)
        renderData(json)
}

const saveData= async (contents)=>{
    const response=await fetch('/save',{
        method:'POST',
        headers:{
            'Accept':'application/json',
            'Content-Type':'application/json'
        },
        body:JSON.stringify(contents)
    })
    const result=await response.json()
    console.log(result)
}

const deleteData= async (contents)=>{
    const response=await fetch('/delete',{
        method:'POST',
        headers:{
            'Accept':'application/json',
            'Content-Type':'application/json'
        },
        body:JSON.stringify(contents)
    })
    const result=await response.json()
    console.log(result)
}

const moveData= async (contents)=>{
    const response=await fetch('/move',{
        method:'POST',
        headers:{
            'Accept':'application/json',
            'Content-Type':'application/json'
        },
        body:JSON.stringify(contents)
    })
    const result=await response.json()
    console.log(result)
}

window.onload=getData(false)