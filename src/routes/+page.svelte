<script lang="ts">
    import "../app.css";
    import  jsPDF  from "jspdf"; 
    let wordCount : number = 0;
    const doc : any = new jsPDF();
    const pdf = () => {
        doc.text("Hello World!", 10, 10);
        doc.save("test.pdf");
    }
    const blurCheck = (e : any) => {
        let target = e as HTMLElement;
        if(e.target.innerText.length == 0) {
            console.log("Can't leave this empty");
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
    let contSymbol : string = "rounded-sm border border-black px-[5px]"
    let state : number = 0;

    const preview = () => {
        if(state == 0) {
            cont = false;
            contSymbol = "";
            state = 1;
        } else {
            cont = true;
            contSymbol = "rounded-sm border border-black px-[5px]";
            state = 0;
        }
        
    }
</script>

<div class="bg-blue-1000 py-2.5 px-[40px] inline-block fixed overflow-hidden rounded-3xl top-4 left-4 shadow-in z-10">
    <h3>Document Title</h3>
</div>

<div class="h-auto w-auto bg-blue-1000 py-1.5 px-2.5 inline-block overflow-hidden rounded-3xl fixed right-4 top-4 shadow-in z-10">

    <div class="float-right clear-left inline-block">
        {#each ["preview", "margins", "pdf", "print"] as button, i}
        <button on:click={()=>{eval(button + "()")}} class="px-4 {i == 0 ? 'mr-1' : ""} {i == 3 ? "ml-1" : ""} {i != 0 && i != 3 ? 'mx-1' : ""} py-1 rounded-3xl hover:bg-blue-900">{button}</button>
        {/each}
    </div>

</div>

<div class="h-[auto] w-[auto] overflow-x-hidden">
    <div class="w-[856px] h-[1096px] flex items-center justify-center mx-auto my-[100px]">
        <div class="w-[816px] h-[1056px] bg-white absolute text-">

            <div class="w-100 h-auto py-[10px] mx-[96px] mb-4 mt-[5em] border-b-2 border-black flex flex-row justify-content no-wrap">

                <div class="text-lg grow-[2]"><span class="font-bold">Name:</span> <span contenteditable={cont}>your name here</span></div>

                <div class="text-lg grow-[1]"><span class="font-bold">Date:</span> <span contenteditable={cont}>date of demerit</span></div>

                <div class="text-lg grow-[1]"><span class="font-bold">Hr #:</span> <span contenteditable={cont}></span></div>

            </div>

            <h3 class="ml-[96px] text-lg font-bold uppercase mb-1.5">Infraction: </h3>

            <p class="mx-[96px]">I earned <span class={contSymbol} contenteditable={cont}>(#)</span> demerit points at approximately <span class={contSymbol} contenteditable={cont}>(time)</span> for <span on:blur={(e)=>{blurCheck(e);}} class={contSymbol} contenteditable={cont}>a/an (infraction)</span>. <span class={contSymbol} contenteditable={cont}>(Who assigned you the demerit, if Capt. Spell out Captain)</span> assigned me this demerit report because <span class={contSymbol} contenteditable={cont} on:focus={(e)=>{clearText(e)}} on:keydown={(e)=>{typeCheck(e)}}>...</span> <span>{wordCount} / 100 </span></p>

            <table class="w-margin h-[125px] absolute bottom-[96px] left-[96px] border-collapse">
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