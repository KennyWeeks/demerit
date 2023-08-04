<script lang="ts">
    import  jsPDF  from "jspdf"; 
    import html2canvas from "html2canvas";
    export let previewText : string;
    //Open-close menu options
    let mlMenu : string = "ml-[40%]";
    export let button : boolean = false;
    export let page : HTMLElement | null;

    export let windowWidth : number = 100000;
    export let state : number = 1;
    export let previewOpen : boolean = false;
    export let mobileOptions : boolean = false;

    console.log(mobileOptions);

    const preview = () => {
        if(windowWidth >= 856) {
            if(state == 0) {
                state = 1;
                previewText = "preview";
            } else {
                state = 0;
                previewText = "edit";
            }
        } else {
            console.log("---------[");
            console.log(previewOpen);
            console.log(previewText);
            console.log("---------[");
            if(!previewOpen) {
                previewOpen = true;
                button = false;
                previewText = "edit";
                console.log(previewText);
                console.log(mobileOptions);
                console.log("------");
            } else {
                previewOpen = false;
                button = false;
                previewText = "preview";
            }
        }
        
    }

    const pdf = ()=>{
        console.log(page);
        let html : HTMLElement = page as HTMLElement;
        html2canvas(html).then((canvas)=>{
            document.body.appendChild(canvas);
        });
    }

</script>

    <div class="float-right clear-left inline-block {mobileOptions ? "" : "menu:hidden"}">
        {#each ["preview", "pdf", "print"] as button, i}
        <button  on:click={()=>{eval(button + "()")}} class="px-4 {i == 0 && !mobileOptions ? 'mr-1' : ""} {i == 3 && !mobileOptions ? "ml-1" : ""} {i != 0 && i != 3 && !mobileOptions ? 'mx-1' : ""} {mobileOptions ? "w-[100%] mb-[5px]" : ""} py-1 rounded-3xl {mobileOptions ? "block text-blue-1000 bg-blue-900" : "text-blue-900 hover:bg-blue-900 hover:text-blue-1000 "}">
            {#if i == 0}
                {previewText}
            {:else}
                {button}
            {/if}
        </button>
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

