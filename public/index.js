
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

let json=null

let index=null

let id=null

let from,to=null

async function main(){
    var data;
    await deleteData();
    document.body.write(data);
}
  
main();

// drag and drop functionality=>
for(let col=0;col<cardArea.length;col++){
    cardArea[col].addEventListener('dragstart',e=>{
        dragItem=e.target
        from=columnTitle[col].innerHTML
        const index1=Array.prototype.indexOf.call(e.target.parentNode.children, e.target)
        console.log(index1)


        cardId=getCardId(json[0][from],index)
        console.log(cardId)
        //console.log(json[0][from])
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
            index=Array.prototype.indexOf.call(e.target.parentNode.parentNode.children, e.target.parentNode)
            //console.log(e.target.parentNode.parentNode.children)
            //console.log(e.target.parentNode)
            to=columnTitle[col].innerHTML
            id='id'
            //console.log(json[0][from])
            data={
                id:id,
                from:from,
                to:to,
                cardId:cardId,
                index:index
            }
            console.log(data)
            moveData(data).then(result=>console.log(result))
        }
    })
}

function insertAfter(newNode, existingNode) {
    existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
}

const getCardId=(array,index)=>{
    console.log(array)
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

const addDeleteCardEventListener=async (box_no,description,newly)=>{
    for(let i=0;i<cardArea[box_no].children.length;i++){
        if(cardArea[box_no].children[i].firstElementChild.firstElementChild===null) continue
        cardArea[box_no].children[i].firstElementChild.firstElementChild.addEventListener('dblclick',e=>{
            //storing the index of the current card being deleted
            const index=Array.prototype.indexOf.call(e.target.parentNode.parentNode.parentNode.children, e.target.parentNode.parentNode)
           
            arrays=json[0][columnTitle[box_no].innerHTML] 
            data={
                id:'id',
                title:columnTitle[box_no].innerHTML,
                cardId:arrays[index-1].cardId,
                description:arrays[index-1].description
            }
            console.log(data)
            let json1=null
            //console.log(json[0])
            await deleteData(data).then(res=>json1=res)
            console.log(json1)
            e.target.parentNode.parentNode.remove()
        })
    }
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
    .then(getData(true))
    console.log(json[0s])
    textArea[box_no].value=""

    addDeleteCardEventListener(box_no,description,true)
}

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



const getData = async (newly)=>{
    const response = await fetch('/get_data')
    json=await response.json()
    
    if(newly===false)
        renderData(json)
    return json
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
    let result=await response.json()
    json=await getData(true)
    return json
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