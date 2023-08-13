<script lang="ts">
    import jsPDF  from "jspdf"; 
    import Modal from "./modal.svelte";
    export let previewText : string;
    //Open-close menu options
    let mlMenu : string = "ml-[40%]";
    export let button : boolean = false;
    export let page : HTMLElement | null;

    export let windowWidth : number = 100000;
    export let state : number = 1;
    export let previewOpen : boolean = false;
    export let mobileOptions : boolean = false;
    export let saveModal : boolean = false;
    export let saveClicked : boolean;
    export let fileName : string = ""; //This will be the name of the file

    import {createPDF} from  "./createPDF.js";

    let clientWidth : any = [];

    //THis is the preview function
    const preview = () => {
        if(windowWidth >= 856) {
            //In this case, it will only change the page so that the contendible content is not longer editable
            if(state == 0) {
                state = 1;
                previewText = "preview";
            } else {
                state = 0;
                previewText = "edit";
            }
        } else {
            //THis will actually open the other page, the one that looks like the final document.
            if(!previewOpen) {
                previewOpen = true;
                previewText = "edit";
                button = false;
            } else {
                previewOpen = false;
                previewText = "preview";
                button = false;
            }
        }
        
    }

    const pdf = ()=>{
        //Set-up the document here
        saveModal = !saveModal;
    }

    const print = () => {
        //THis will be the canvas rendering context
        const canvas = document.createElement("canvas");
        canvas.width = 816;
        canvas.height = 1056;
        canvas.setAttribute("style", "background-color:#ffffff; margin:auto; outline:none;");

        //This is the context, which is where everything is rendered
        const ctx = canvas.getContext("2d");
        createPDF(canvas, ctx, page, null);
    }

    let displayType : string = "block";

    $: {
        //So this one is the 
        if(!button) {
            mlMenu = "ml-[40%]";
        }
        if(windowWidth > 500) {
            displayType = "inline-block";
        } else {
            displayType = "block";
        }
    }
</script>

<div class="float-right clear-left inline-block {mobileOptions ? "" : "menu:hidden"}">
    {#each ["preview", "pdf", "print"] as button, i}
    <button  on:click={()=>{
        if(i == 0) {
            preview();
        } else if(i == 1) {
            pdf();
        } else {
            print();
        }
    }
    } class="px-4 {(i == 1 && windowWidth <= 856 && !previewOpen) ? "hidden": displayType} {(i == 2 && windowWidth <= 856 && !previewOpen) ? "hidden": "block"} {i == 0 && !mobileOptions ? 'mr-1' : ""} {i == 3 && !mobileOptions ? "ml-1" : ""} {i != 0 && i != 3 && !mobileOptions ? 'mx-1' : ""} {mobileOptions ? "w-[100%] mb-[5px]" : ""} py-1 rounded-3xl {mobileOptions ? "block text-blue-1000 bg-blue-900" : "text-blue-900 hover:bg-blue-900 hover:text-blue-1000 "}">
        {#if i == 0}
            {previewText}
        {:else}
            {button}
        {/if}
    </button>
    {/each}
    {#each clientWidth as cl}
    <p>{cl.clientWidth}</p>
    {/each}
</div>
{#if !mobileOptions}
<!--This is the mobile menu for hte site-->
<div role="menu" tabindex="0" on:keydown={()=>{}} class="hidden menu:block menu:w-[42px] menu:h-[42px] overflow-y-hidden" on:click={()=>{
    if(!button) {
        mlMenu = "ml-[20%]"; 
        button = true;
    } else {
        mlMenu = "ml-[40%]";
        button = false;
    }
}}>
    <!--Menu Tabs-->
    <div class="w-[60%] h-[6px] bg-blue-900 rounded-xl ml-[20%] mt-[12px]"></div>
    <div class="w-[40%] h-[6px] bg-blue-900 rounded-xl {mlMenu} mt-[5px]"></div>
</div>
{/if}


