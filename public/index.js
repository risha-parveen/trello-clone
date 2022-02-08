
const addBtn=document.getElementsByClassName("add-item")
const textArea=document.getElementsByClassName("text-area")
const items=document.getElementsByClassName("items")
const containerBox=document.getElementsByClassName("container-box")
const card=document.getElementsByClassName("card")
const cardArea=document.getElementsByClassName("card-area")
const deleteCardBtn=document.getElementsByClassName("delete-card")
const columnTitle=document.getElementsByClassName("column-title")

let title,id,description,cardId,json,data=null

const cardIdArray={
    'To Do':[],
    'Doing':[],
    'Done':[]
}

const generateNewId=(title)=>{
    
    let array=cardIdArray[title]
    let number=0
    console.log(array)
    for(let i in array){
        console.log(array[i])
        if(array[i]===number){
            number+=1
            console.log(i)
        }           
    }
    console.log(number)
    return number   
}

for(let box_no=0; box_no<addBtn.length; box_no++){
    addBtn[box_no].addEventListener("click",()=>{
        if(textArea[box_no].value.trim().length!=0){
            description=textArea[box_no].value.replace(/[\r\n]+/g," ")
            addCard(box_no,description,true)        
        }
    })
}

const addDeleteCardEventListener=(box_no,description,newly)=>{
    for(let i=0;i<cardArea[box_no].children.length;i++){
        if(cardArea[box_no].children[i].firstElementChild.firstElementChild===null) continue
        cardArea[box_no].children[i].firstElementChild.firstElementChild.addEventListener('dblclick',async e=>{
            let index=Array.prototype.indexOf.call(e.target.parentNode.parentNode.parentNode.children, e.target.parentNode.parentNode)
            index-=1
            title=columnTitle[box_no].innerHTML
            cardId=cardIdArray[title][index]
            description=e.target.parentNode.innerText.split(/\n/)[0]
            
            data={
                id:'id',
                title:title,
                cardId:cardId,
                description:description
            }
            console.log(data)
            const response=await deleteData(data)
            if(response.success===true){
                e.target.parentNode.parentNode.remove()
                cardIdArray[title].splice(index,1)
                console.log(cardIdArray)
            }
        })

        
    }
}

const addCard=async (box_no,description,newly)=>{
    const cardnode=`
        <div class="card-combo" draggable="true">
            <div class="card">${description}<button class="delete-card">x</button>
            </div>
            <div class="card-drop"></div>
        </div>
    `
    if(newly){
        title=columnTitle[box_no].innerHTML
        console.log(cardIdArray)
        cardId=generateNewId(title)
        console.log(cardId)
        id='id'
        console.log(description)
        data={
            id:id,
            title:title,
            cardId:cardId,
            description:description
        }
        const response=await saveData(data)
        console.log(response)
        if(response.success==true){
            cardArea[box_no].innerHTML+=cardnode
            textArea[box_no].value=""
            cardIdArray[title].push(cardId)
            addDeleteCardEventListener(box_no,description,false)
        }
        if(response.success==false){
            return
        }
    }
    else{
        cardArea[box_no].innerHTML+=cardnode
        textArea[box_no].value=""
        addDeleteCardEventListener(box_no,description,false)
    }  
}

const deleteData= async (contents)=>{
    try{
        const response=await fetch('/delete',{
            method:'POST',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json'
            },
            body:JSON.stringify(contents)
        })
        let result=await response.json()
        return result  
    }
    catch(e){
        console.log(e)
    }
}

const saveData= async (contents)=>{
    try{
       const response=await fetch('/save',{
            method:'POST',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json'
            },
            body:JSON.stringify(contents)
        })
        const result=await response.json()
        return result 
    }
    catch(e){
        console.log(e)
    }
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
            addCard(box_no,description,false)
            cardIdArray[title].push(cardId)
            console.log(cardIdArray)
        }
    }
}

const getData=async ()=>{
    try{
        const response=await fetch('/get_data')
        json=await response.json()

        renderData(json)
    }catch(e){
        console.log(e)
    }
    
}

window.onload=getData()