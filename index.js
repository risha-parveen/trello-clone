
const addBtn=document.getElementsByClassName("add-item")
const textArea=document.getElementsByClassName("text-area")
const items=document.getElementsByClassName("items")
const containerBox=document.getElementsByClassName("container-box")


for(let i=0;i<addBtn.length;i++){
    addBtn[i].addEventListener("click",()=>{
        if(textArea[i].value.trim().length!=0){
            addCard(i)        }
    })
}

const addCard=(box_no)=>{
    const card=`
        <div class="card">
            ${textArea[box_no].value}
        </div>
    `
    items[box_no].insertAdjacentHTML("beforebegin",card)
    textArea[box_no].value=""
}