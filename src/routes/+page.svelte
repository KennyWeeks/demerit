<script lang="ts">
    import {onMount} from "svelte";
    import Modal from "$lib/modal.svelte";
    import "../app.css";
    import  jsPDF  from "jspdf"; 
    let wordCount : number = 0;
    const doc : any = new jsPDF();

    //This is used for binding the window width
    let windowWidth : number = 100000;

    //Associative array
    let defaultText : {[key: string]: string} = {};
    defaultText["#"] = "(#)";
    defaultText["time"] = "(time)";
    defaultText["a/an"] = "(a/an infraction)";
    defaultText["who"] = "(Who assigned you the demerit, if Capt. Spell out Captain)";
    defaultText["elipsis"] = "...";
    defaultText["name"] = "your name here";
    defaultText["date"] = "date of demerit";
    defaultText["hr"] = "1234"

    //Open close menu
    let mlMenu : string = "ml-[40%]";
    let button : boolean = false;

    //THis will return the pdf
    const pdf = () => {
        doc.text("Hello World!", 10, 10);
        doc.save("test.pdf");
    }

    let previewOpen : boolean = false;

    const blurCheck = (e : any) => {
        let target = e as HTMLElement;
        //console.log(e.target.getAttribute("data-name"));
        if(e.target.innerText.length == 0) {
            console.log("Can't leave this empty");
            e.target.innerHTML = defaultText[e.target.getAttribute("data-name")];
        }
    }

    const clearText = (e : any) => {
        let target = e as HTMLElement;
        e.target.innerHTML = "";
    }

    const typeCheck = (e : any) => {
        let target = e as HTMLElement;
        let example : string[] = e.target.innerText.split(/\s+/);
        example = example.filter(word => word != '');
        wordCount = example.length;
    }

    let cont : boolean = true;
    let contSymbol : string = "rounded-sm border border-black px-[5px] outline-0"
    let state : number = 0;

    const preview = () => {
        if(windowWidth >= 856) {
            if(state == 0) {
                cont = false;
                contSymbol = "";
                state = 1;
            } else {
                cont = true;
                contSymbol = "rounded-sm border border-black px-[5px] outline-0";
                state = 0;
            }
        } else {
            if(!previewOpen) {
                previewOpen = true;
            } else {
                previewOpen = false;
            }
        }
        
    }

</script>

<svelte:window bind:innerWidth={windowWidth}/>

{#if previewOpen && windowWidth < 856}
<div class="absolute w-[100vw] h-[100vh] top-0 left-0 z-50 overflow-y-scroll bg-gray-100">
    <div style="{windowWidth < 856 ? "transform:scale(" + (windowWidth / 856) + ");" : "margin:auto;"}" class="w-[856px] h-[1096px] flex items-center jusitfy-content mt-15">
        <div class="w-[816px] h-[1056px] bg-white mx-auto"></div>
    </div>
</div>
{/if}

<div>
    {#if button}
    <Modal>
        {#each ["preview", "pdf", "print"] as button, i}
        <button on:click={()=>{eval(button + "()")}} class="paper:mx-0 py-1 rounded-3xl bg-blue-900 text-white block paper:w-[90px] paper:{i == 2 ? "mb-0" : "mb-[5px]"} text-center">{button}</button>
        {/each}
    </Modal>
    {/if}
</div>

<div class="bg-blue-1000 py-2.5 px-[40px] inline-block fixed overflow-hidden rounded-3xl top-4 left-4 shadow-in z-10">
    <h3>Demerit Slip</h3>
</div>

<div class="h-auto w-auto bg-blue-1000 py-1.5 px-2.5 menu:p-0 inline-block overflow-hidden rounded-3xl fixed right-4 top-4 shadow-in z-10">

    <div class="float-right clear-left inline-block menu:hidden">
        {#each ["preview", "pdf", "print"] as button, i}
        <button on:click={()=>{eval(button + "()")}} class="px-4 {i == 0 ? 'mr-1' : ""} {i == 3 ? "ml-1" : ""} {i != 0 && i != 3 ? 'mx-1' : ""} py-1 rounded-3xl hover:bg-blue-900 hover:text-white">{button}</button>
        {/each}
    </div>

    <div class="hidden menu:block menu:w-[42px] menu:h-[42px] overflow-y-hidden"on:click={()=>{
        if(!button) {
            mlMenu = "ml-[20%]"; 
            button = true;
        } else {
            mlMenu = "ml-[40%]";
            button = false;
        }
    }}>
        <div class="w-[60%] h-[6px] bg-black rounded-xl ml-[20%] mt-[12px]"></div>
        <div class="w-[40%] h-[6px] bg-black rounded-xl {mlMenu} mt-[5px]"></div>
    </div>


</div>

<div class="h-[100vh] w-auto overflow-x-hidden flex items-center justify-center">

    <div class="w-[856px] h-[1096px] mt-[500px] paper:mt-[0px] paper:h-auto flex items-center justify-center relative">
        <div  class="w-[816px] h-[1056px] paper:w-[100vw] paper:h-[100vh] bg-white">

            <div class="w-100 paper:w-auto paper:ml-[10%] paper:inline-block h-auto py-[10px] mx-[96px] paper:mx-auto mb-4 mt-[5em] border-b-2 border-black flex flex-row justify-content no-wrap">

                {#each [["text-lg grow-[2]", "Name: ", "your name here", "name"], 
                ["text-lg grow-[1]", "Date: ", "date of demerit", "date"],
                ["text-lg grow-[1]", "Hr #: ", "1234", "hr"]] as data, i}

                    <div class={data[0]}><span class="font-bold">{data[1]}</span> <span on:focus={(e)=>{clearText(e)}} on:blur={(e)=>{blurCheck(e);}} data-name={data[3]} class="{contSymbol}" contenteditable={cont}>{data[2]}</span></div>

                {/each}
            </div>

            <h3 class="ml-[96px] paper:ml-[10%] text-lg font-bold uppercase mb-1.5">Infraction: </h3>

            <p class="mx-[96px] paper:w-[80%] paper:mx-auto">I earned 
                <span data-name="#" on:focus={(e)=>{clearText(e)}} on:blur={(e)=>{blurCheck(e);}} class={contSymbol} contenteditable={cont}>(#)</span> 
                demerit points at approximately 
                <span data-name="time" on:focus={(e)=>{clearText(e)}} on:blur={(e)=>{blurCheck(e);}} class={contSymbol} contenteditable={cont}>(time)</span> 
                for <span data-name="a/an" on:focus={(e)=>{clearText(e)}} on:blur={(e)=>{blurCheck(e);}} class={contSymbol} contenteditable={cont}>a/an (infraction)</span>. 
                <span data-name="who" class={contSymbol} on:focus={(e)=>{clearText(e)}} on:blur={(e)=>{blurCheck(e);}} contenteditable={cont}>(Who assigned you the demerit, if Capt. Spell out Captain)</span> 
                assigned me this demerit report because 
                <span data-name="elipsis" class={contSymbol} contenteditable={cont} on:focus={(e)=>{clearText(e)}} on:blur={(e)=>{blurCheck(e);}} on:keydown={(e)=>{typeCheck(e)}}>...</span> 
                <span>{#if cont} {wordCount} / 100 {/if}</span>
            </p>

            <table class="w-margin h-[125px] absolute bottom-[96px] ml-[96px] border-collapse paper:hidden">
                <colgroup>
                    <col span="1" style="width: 2%;">
                    <col span="1" style="width: 50%;">
                    <col span="1" style="width: 24%;">
                    <col span="1" style="width: 24%;">
                 </colgroup>
                 {#each Array(2) as _}
                 <tr>
                    {#each Array(4) as _}
                        <td class="border border-black"></td>
                    {/each}
                 </tr>
                 {/each}
        
        </div>

    </div>
</div>
<style></style> 