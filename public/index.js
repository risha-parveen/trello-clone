
const addBtn=document.getElementsByClassName("add-item")
const textArea=document.getElementsByClassName("text-area")
const items=document.getElementsByClassName("items")
const containerBox=document.getElementsByClassName("container-box")
const card=document.getElementsByClassName("card")
const cardArea=document.getElementsByClassName("card-area")
const deleteCardBtn=document.getElementsByClassName("delete-card")
const columnTitle=document.getElementsByClassName("column-title")

//
const loginContainer=document.getElementById('login-container')
const boardContainer=document.getElementById('board-container')
const signInButton=document.getElementById('sign-in-button')
const signUpButton=document.getElementById('sign-up-button')
const createNewAccountButton=document.getElementById('create-new-account')
const confirmfield=document.getElementById('confirm-field')
const usernamefield=document.getElementById('username-field')
const passwordfield=document.getElementById('password-field')
const messagelabel=document.getElementById('message-label')
const back=document.getElementById('back')


let title,id,description,cardId,json,data,dragItem,from,to,index,index1,newId=null

let token=null

const cardIdArray={
    'To Do':[],
    'Doing':[],
    'Done':[]
}

const generateNewId=(title)=>{
    
    let array=cardIdArray[title]
    let number=0
    for(let i in array){
        if(array[i]===number){
            number+=1
        }           
    }
    return number   
}

for(let col=0;col<cardArea.length;col++){
    cardArea[col].addEventListener('dragstart',e=>{
        dragItem=e.target
        from=columnTitle[col].innerHTML
        index1=Array.prototype.indexOf.call(e.target.parentNode.children, e.target)
        index1-=1
        cardId=cardIdArray[from][index1]
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
    })

    cardArea[col].addEventListener('dragover',e=>{
        e.preventDefault()
    })

    cardArea[col].addEventListener('dragenter',e=>{
        e.preventDefault()
    })

    cardArea[col].addEventListener('drop',async e=>{
        if(e.target.className==="card-drop"){
            to=columnTitle[col].innerHTML
            newId=generateNewId(to)
            index=Array.prototype.indexOf.call(e.target.parentNode.parentNode.children, e.target.parentNode)
                  
            data={
                from:from,
                to:to,
                cardId:cardId,
                index:index,
                newId:newId
            }
            
            const response=await moveData(data,token)
            if(response.success==true){
                insertAfter(dragItem,e.target.parentNode)
                cardIdArray[from].splice(index1,1)
                cardIdArray[to].splice(index,0,newId)
            }
            else if(response.success==false){
                dragItem.style.visibility="visible"
            }
        }
    })
}

function insertAfter(newNode, existingNode) {
    existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
}


for(let box_no=0; box_no<addBtn.length; box_no++){
    addBtn[box_no].addEventListener("click",()=>{
        if(textArea[box_no].value.trim().length!=0){
            description=textArea[box_no].value.replace(/[\r\n]+/g," ")
            addCard(box_no,description,true)        
        }
    })
}

const addDeleteCardEventListener=(box_no,description)=>{
    for(let i=0;i<cardArea[box_no].children.length;i++){
        if(cardArea[box_no].children[i].firstElementChild.firstElementChild===null) continue
        cardArea[box_no].children[i].firstElementChild.firstElementChild.addEventListener('dblclick',async e=>{
            let index=Array.prototype.indexOf.call(e.target.parentNode.parentNode.parentNode.children, e.target.parentNode.parentNode)
            index-=1
            title=e.target.parentNode.parentNode.parentNode.parentNode.parentNode.firstElementChild.innerHTML
            cardId=cardIdArray[title][index]
            description=e.target.parentNode.innerText.split(/\n/)[0]
            
            data={
                title:title,
                cardId:cardId,
                description:description
            }

            const response=await deleteData(data,token)
            if(response.success===true){
                e.target.parentNode.parentNode.remove()
                cardIdArray[title].splice(index,1)
            }
        })

        
    }
}
console.log(token)
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
        cardId=generateNewId(title)
        

        data={
            title:title,
            cardId:cardId,
            description:description
        }

        const response=await saveData(data,token)

        if(response.success==true){
            cardArea[box_no].innerHTML+=cardnode
            textArea[box_no].value=""
            cardIdArray[title].push(cardId)
            addDeleteCardEventListener(box_no,description,false)
        }
        else if(response.success==false){
            return
        }
    }
    else{
        cardArea[box_no].innerHTML+=cardnode
        textArea[box_no].value=""
        addDeleteCardEventListener(box_no,description)
    }  
}

const moveData= async (contents,token)=>{
    const response=await fetch('/move',{
        method:'POST',
        headers:{
            'Accept':'application/json',
            'Content-Type':'application/json',
            'Authorization':'Bearer '+token
        },
        body:JSON.stringify(contents)
    })
    const result=await response.json()
    return result
}

const deleteData= async (contents,token)=>{
    try{
        const response=await fetch('/delete',{
            method:'POST',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json',
                'Authorization':'Bearer '+token
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

const saveData= async (contents,token)=>{
    try{
       const response=await fetch('/save',{
            method:'POST',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json',
                'Authorization':'Bearer '+token
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
        }
    }
}

const getData=async (token)=>{
    
    try{
        const response=await fetch('/get_data',{
            method:'GET',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json',
                'Authorization':'Bearer '+token
            }
        })
        json=await response.json()
        renderData(json)
        return json
    }catch(e){
        console.log(e)
    }
    
}

signInButton.addEventListener('click',async ()=>{
    messagelabel.innerHTML=""
    const username=usernamefield.value.trim()
    const password=passwordfield.value.trim()
    const data={
        "username":username,
        "password":password
    }
    try{
        if(username.length===0 || password.length===0){
            messagelabel.innerHTML="Fields cannot be empty"
            setTimeout(() => {
                messagelabel.innerHTML=" "
            }, 3000);
            
            return
        }

        const signInResponse=await signIn(data)

        if(signInResponse.success===true){
            await getData(signInResponse.token)
            token=signInResponse.token
            localStorage.setItem("token",token)
            boardContainer.style.display=""
            loginContainer.style.display="none"                   
        }
        else{
            messagelabel.innerHTML=signInResponse.message
            setTimeout(() => {
                messagelabel.innerHTML=" "
            }, 3000);
            return
        }
    }catch(err){
        console.log(err)
    }           
})


createNewAccountButton.addEventListener('click',()=>{
    messagelabel.innerHTML=""
    confirmfield.style.display=""
    usernamefield.value=""
    passwordfield.value=""
    signInButton.style.display="none"
    signUpButton.style.display=""
    createNewAccountButton.style.display="none"
    back.innerHTML="go to login"
})

back.addEventListener('click',()=>{
    back.innerHTML=""
    usernamefield.value=""
    passwordfield.value=""
    confirmfield.value=""
    confirmfield.style.display="none"
    signUpButton.style.display="none"
    signInButton.style.display=""
    createNewAccountButton.style.display=""
})

signUpButton.addEventListener('click',async ()=>{
    messagelabel.innerHTML=""
    const username=usernamefield.value.trim()
    const password=passwordfield.value.trim()
    const confirm=confirmfield.value.trim()
    const data={
        "username":username,
        "password":password
    }
    try{
        if([username,password,confirm].some(x=>x.length===0) ){
            messagelabel.innerHTML="Fields cannot be empty"
            setTimeout(() => {
                messagelabel.innerHTML=" "
            }, 3000);
            return
        }
        if(confirm!==password){
            messagelabel.innerHTML="Confirm password"
            setTimeout(() => {
                messagelabel.innerHTML=" "
            }, 3000);
            return
        }
        const signUpResponse=await signUp(data)
        if(signUpResponse.success===true){
            usernamefield.value=""
            passwordfield.value=""
            confirmfield.value=""
            confirmfield.style.display="none"
            signUpButton.style.display="none"
            signInButton.style.display=""
            createNewAccountButton.style.display="" 
            back.innerHTML=""  
        }
        else{
            messagelabel.innerHTML=signUpResponse.message
            setTimeout(() => {
                messagelabel.innerHTML=" "
            }, 3000);
            return
        }
    }catch(err){
        console.log(err)
    }                
})


const checkLocalStorage=async ()=>{
    token=localStorage.getItem("token")
    console.log(token)
    
    if(!token){
        boardContainer.style.display="none"
    }
    if(token){
        const result=await getData(token)
        if(result.success===false){
            boardContainer.style.display="none"
            loginContainer.style.display=""
            return
        }
        boardContainer.style.display=""
        loginContainer.style.display="none"
    }
}

const signUp=async (contents)=>{
    try{
        const response=await fetch('/sign_up',{
            method:'POST',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json',
            },
            body:JSON.stringify(contents)
        })
        const result=await response.json()
        return result
    }
    catch(err){
        console.log(err)
    }
}

const signIn=async(contents)=>{
    try{
        const response=await fetch('/sign_in',{
            method:'POST',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json',
            },
            body:JSON.stringify(contents)
        })
        const result=await response.json()
        return result
    }
    catch(err){
        console.log(err)
    }
}

window.onload=checkLocalStorage()