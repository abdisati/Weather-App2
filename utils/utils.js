export function hide(el){
    el.classList.add("hidden");
}

export function show(el){
    el.classList.remove("hidden");
}

export function setText(el,text){
    el.textContent=text;
}