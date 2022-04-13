
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
const mainboardContainer=document.getElementById('main-board-container')
const signInButton=document.getElementById('sign-in-button')
const signUpButton=document.getElementById('sign-up-button')
const createNewAccountButton=document.getElementById('create-new-account')
const confirmfield=document.getElementById('confirm-field')
const usernamefield=document.getElementById('username-field')
const passwordfield=document.getElementById('password-field')
const messagelabel=document.getElementById('message-label')
const back=document.getElementById('back')
const logout=document.getElementById('logout')
const usernameTag=document.getElementById('username-tag')
const listDeleteButton=document.getElementsByClassName('list-delete')

let title,id,description,cardId,json,data,dragItem,from,to,index,index1,newId=null

let token=null

const cardIdArray={
    'To Do':[],
    'Doing':[],
    'Done':[]
}

const openAllTextAreasIfEmpty=()=>{
    let index=0
    for(let i in cardIdArray){
        if(cardIdArray[i].length===0){
            textArea[index].style.height="100px"
            addBtn[index].style.visibility="visible"
            listDeleteButton[index].style.visibility="visible"
            textArea[index].style.backgroundColor="white"
        }
        index+=1
    }
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
        e.target.style.backgroundColor=""
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
        textArea[box_no].focus()
        if(textArea[box_no].value.trim().length!=0){
            description=textArea[box_no].value.replace(/[\r\n]+/g," ")
            addCard(box_no,description,true)        
        }
    })
    textArea[box_no].addEventListener("keypress",e=>{
        if(e.key==='Enter'){
            if(textArea[box_no].value.trim().length!=0){
                description=textArea[box_no].value.replace(/[\r\n]+/g," ")
                addCard(box_no,description,true)        
            }
        }
    })
    textArea[box_no].addEventListener('click',e=>{
        textArea[box_no].style.height="100px"
        addBtn[box_no].style.visibility="visible"
        listDeleteButton[box_no].style.visibility="visible"
        textArea[box_no].style.backgroundColor="white"
        textArea[box_no].style.cursor="auto"
    })
    listDeleteButton[box_no].addEventListener('click',e=>{
        listDeleteButton[box_no].style.visibility="hidden"
        textArea[box_no].style.height="39px"
        addBtn[box_no].style.visibility="hidden"
        textArea[box_no].value=""
        textArea[box_no].style.backgroundColor="rgb(202, 199, 199)"
    })
}

const addDeleteCardEventListener=(box_no,description)=>{
    for(let i=0;i<cardArea[box_no].children.length;i++){
        if(cardArea[box_no].children[i].firstElementChild.firstElementChild===null) continue
        cardArea[box_no].children[i].firstElementChild.firstElementChild.addEventListener('click',async e=>{
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
    usernameTag.innerHTML=data.username
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
    let index=0
    for(let i in cardIdArray){
        if(cardIdArray[i].length===0){
            textArea[index].style.height="100px"
            addBtn[index].style.visibility="visible"
            listDeleteButton[index].style.visibility="visible"
            textArea[index].style.backgroundColor="white"
            textArea[index].style.cursor="auto"
        }
        index+=1
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

const showMessage=(message)=>{
    messagelabel.innerHTML=message
    setTimeout(() => {
        messagelabel.innerHTML=" "
    }, 3000);
}

const deleteAllCards=()=>{
    for(let i=0;i<cardArea.length;i++){
        while(cardArea[i].children.length!==1) {
            cardArea[i].removeChild(cardArea[i].lastElementChild)
        }
    }
}

logout.addEventListener('click',()=>{
    localStorage.clear()
    textArea.value=""
    refreshFields()
    deleteAllCards()
    mainboardContainer.style.display="none"
    loginContainer.style.display=""
})

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
            showMessage("fields cannot be empty")
            return
        }

        const signInResponse=await signIn(data)

        if(signInResponse.success===true){
            await getData(signInResponse.token)
            token=signInResponse.token
            usernameTag.innerHTML=data.username
            localStorage.setItem("token",token)
            mainboardContainer.style.display=""
            loginContainer.style.display="none"                   
        }
        else{
            showMessage(signInResponse.message)
            return
        }
    }catch(err){
        console.log(err)
    }           
})


createNewAccountButton.addEventListener('click',()=>{
    refreshFields()
    messagelabel.innerHTML=""
    confirmfield.style.display=""
    signInButton.style.display="none"
    signUpButton.style.display=""
    createNewAccountButton.style.display="none"
    back.innerHTML="go to login"
})

back.addEventListener('click',()=>{
    refreshFields()
    back.innerHTML=""
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
            showMessage("Fields cannot be empty") 
            return
        }
        if(confirm!==password){
            showMessage( "Confirm password")
            return
        }
        const signUpResponse=await signUp(data)
        if(signUpResponse.success===true){
            refreshFields()
            confirmfield.style.display="none"
            signUpButton.style.display="none"
            signInButton.style.display=""
            createNewAccountButton.style.display="" 
            back.innerHTML=""  
        }
        else{
            showMessage(signUpResponse.message)
            return
        }
    }catch(err){
        console.log(err)
    }                
})

usernamefield.addEventListener('keypress',e=>{
    if(e.key==='Enter'){
        e.preventDefault()
        passwordfield.focus()
    }
})

passwordfield.addEventListener('keypress',e=>{
    if(e.key==='Enter'){
        if(confirmfield.style.display==="none"){
            e.preventDefault()
            signInButton.click()
            usernamefield.focus()
        }
        else{
            confirmfield.focus()
        }
    }
})

confirmfield.addEventListener('keypress',e=>{
    if(e.key==='Enter'){
        e.preventDefault()
        signUpButton.click()
        usernamefield.focus()
    }
})

const refreshFields=()=>{
    usernamefield.value=""
    passwordfield.value=""
    confirmfield.value=""
}

const checkLocalStorage=async ()=>{
    token=localStorage.getItem("token")
    if(!token){   
        loginContainer.style.display=""
    }
    if(token){
        mainboardContainer.style.display=""
        const result=await getData(token)
        if(result.success===false){
            mainboardContainer.style.display="none"
            loginContainer.style.display=""
            return
        }
        mainboardContainer.style.display=""
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

const begin=()=>{
    refreshFields()
    textArea.value=""
    loginContainer.style.display="none"
    mainboardContainer.style.display="none" 
    checkLocalStorage()
}

window.onload=begin()