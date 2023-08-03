<script lang="ts">
    import {onMount} from "svelte";
    import "../app.css";
    import Modal from "$lib/modal.svelte";
    import Slip from "$lib/slip.svelte";
    import  jsPDF  from "jspdf"; 
    
    //THis will create some default values for the output strings
    let outputText : {[key:string] : string} = {};
    let temp : {[key:string]: string} = {"#": "(#)", "time": "(time)", "a/an": "(a/an infraction)", "who": "(Who assigned you the demerit, if Capt. Spell out Captain)", "elipsis": "...", "name": "your name here", "date": "date of demerit", "hr": "1234"}
    for(let k in temp) {
        outputText[k] = temp[k];
    }


    const doc : any = new jsPDF();

    let previewText : string = "preview";

    //These will be some values I will bind to the page, mostly to display the date modal
    let dateModal : boolean;
    let dateValue : string;
    let timeStuff : boolean;
    let timeValue : string;
    let totalTime : string; //THis is the total time after it has been editted.

    //These variables will be used for the date    
    
    let timeDate : string = "";
    let on : string = "";

    //This is used for binding the window width
    let windowWidth : number = 100000;

    //Open-close menu options
    let mlMenu : string = "ml-[40%]";
    let button : boolean = false;

    //Save modal info
    let openModal : boolean = false;
    let pdfName : string = "Demerit Slip";


    //THis will return the pdf
    const pdf = () => {
        //So this will make a modal pop up, and that's what I want to work with
        if(openModal) {
            openModal = false;
        } else {
            openModal = true;
        }
    }

    let previewOpen : boolean = false;

    //This will change the color of the dividing line
    let color : string = "black";
    
    //This will set the state of the preview from the menu
    let state : number = 1;
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
            if(!previewOpen) {
                previewOpen = true;
                button = false;
                previewText = "edit";
            } else {
                previewOpen = false;
                button = false;
                previewText = "preview";
            }
        }
        
    }

    //This will trigger the light and dark mode
    let lightModeTrigger : string = "right-[2.5px]";

    //This is for the page for light and dark mode restrictions
    let contSymbol : string = "rounded-sm border border-black px-[5px] outline-0";
    let lightDark = "bg-white text-black-200";
    let finalTime : string;
    

    //Reactive Styling
    $: {
        if(windowWidth >= 500) {
            lightDark = "bg-white text-black-200";
            color = "black";
            lightModeTrigger = "right-[2.5px]";
            contSymbol = `rounded-sm border border-black px-[5px] outline-0`;
            button = false;
            previewOpen = false;
        };
        if(timeDate != "") {
            on = " on ";
        };
        totalTime = timeValue + on + timeDate;
    }

</script>

<!--Binding inner width here, created some reactive variables-->
<svelte:window bind:innerWidth={windowWidth}/>

{#if previewOpen && windowWidth < 856}
<div class="absolute w-[100vw] h-[100vh] top-0 left-0 z-40 overflow-y-scroll bg-gray-100">
    <Slip mobileDisplay={windowWidth < 856 ? true : false} cont={false} contSymbol={""} outputText={outputText} timeValue={finalTime} windowWidth={windowWidth}/>
</div>
{/if}

<!--This is the floating menu that will be available in the mobile form of the SVGSwitchElement-->
<div>
    {#if button}
    <Modal>
        {#each ["preview", "pdf", "print"] as button, i}
        <button on:click={()=>{eval(button + "()")}} class="paper:mx-0 py-1 rounded-3xl bg-blue-900 text-white block paper:w-[90px] mb-[5px] text-center">
            {#if i == 0}
                {previewText}
            {:else}
                {button}
            {/if}
            </button>
        {/each}

        <!--This will flip between light and dark mode for the mobile platform-->
        <div class="rounded-3xl bg-blue-900 text-white">
            <div role="menuitem" tabindex="-2" on:click={()=>{
                if(lightModeTrigger == "right-[2.5px]") {
                    lightModeTrigger = "left-[2.5px]";
                    lightDark = "bg-black-200 text-white";
                    contSymbol = `rounded-sm border border-white px-[5px] outline-0`;
                    color = "white";
                } else {
                    lightModeTrigger = "right-[2.5px]";
                    lightDark = "bg-white text-black";
                    contSymbol = `rounded-sm border border-black px-[5px] outline-0`;
                    color = "black";
                }
            }} on:keydown={()=>{}} class="rounded-3xl bg-blue-900 w-[60px] h-[30px] float-right overflow-hidden relative">
                <div class="w-[25px] h-[25px] bg-blue-1000 rounded-3xl absolute top-[2.5px] {lightModeTrigger}"></div>
            </div>
        </div>
    </Modal>
    {/if}
</div>

{#if dateModal}
    <div class="absolute w-[100vw] h-[100vh] bg-black-100 z-40 flex jusity-content items-center">

        <Modal classData="inline-block mx-auto overflow-visible" bind:finalTime={finalTime} date={dateValue} bind:time={totalTime}>
            <div class="p-[20px] bg-blue-1000 rounded-md relative">

                <div class="p-[15px] rounded-3xl bg-white absolute top-[-17.5px] right-[-17.5px]" role="button" tabindex="-3" on:keypress={()=>{}} on:click={()=>{
                    dateModal = false;
                }}></div>

                <!--This will be some html formatting so that the date can be selected from a predefined set of data-->

                {#if timeStuff}
                    <label for="time">Pick a time</label>
                    <input id="time" bind:value={timeValue} type="time"/>

                    <p class="font-bold">on</p>
 
                    <label for="tdate">Pick a date: </label>
                    <input id="tdate" bind:value={timeDate} type="date"/>
                {:else}
                    <label for="date">Pick a date: </label>
                    <input id="date" bind:value={dateValue} type="date"/>
                {/if}

            </div>
        </Modal>

    </div>
{/if}

{#if openModal}
    <div class="absolute w-[100vw] h-[100vh] bg-black-100 z-40 flex jusity-content items-center">
        <Modal classData="inline-block mx-auto overflow-visible">
            <div class="p-[20px] bg-blue-1000 rounded-md relative">
                <div class="p-[15px] rounded-3xl bg-white absolute top-[-17.5px] right-[-17.5px]" role="button" tabindex="-3" on:keypress={()=>{}} on:click={()=>{
                    openModal = false;
                }}></div>
                
                <!--This is the view box, like the final preview-->
                <div class="w-[80vw] h-[25em] bg-white shadow">

                </div>

                <hr class="my-[10px] bg-blue-900 h-[2px]">

                <!--This will be the main body of the save, where the user will define the name, and ultimately save the content-->
                <div>

                    <label class="text-blue-900" for="save-name">Save file name under - </label>
                    <br>
                    <input class="border-2 border-blue-900 mt-[5px] pl-[5px]" type="text" name="save-name" placeholder="{pdfName}" bind:value={pdfName} on:focus={()=>{pdfName = ""}}/>
                    <br>
                    <button class="bg-blue-900 text-blue-1000 py-[5px] px-[15px] rounded-3xl mt-[10px]">save</button>

                </div>

            </div>
        </Modal>
    </div>
{/if}

<div class="bg-blue-1000 py-2.5 px-[40px] inline-block fixed overflow-hidden rounded-3xl top-4 left-4 shadow-in z-10">
    <h3 class="text-blue-900">Demerit Slip</h3>
</div>

<div class="h-auto w-auto bg-blue-1000 py-1.5 px-2.5 menu:p-0 inline-block overflow-hidden rounded-3xl fixed right-4 top-4 shadow-in z-50">

    <div class="float-right clear-left inline-block menu:hidden">
        {#each ["preview", "pdf", "print"] as button, i}
        <button  on:click={()=>{eval(button + "()")}} class="px-4 {i == 0 ? 'mr-1' : ""} {i == 3 ? "ml-1" : ""} {i != 0 && i != 3 ? 'mx-1' : ""} py-1 rounded-3xl text-blue-900 hover:bg-blue-900 hover:text-blue-1000">
            {#if i == 0}
                {previewText}
            {:else}
                {button}
            {/if}
        </button>
        {/each}
    </div>

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


</div>

<div class="h-[100vh] w-auto overflow-x-hidden flex items-center justify-center">

    <!--This is the main content area, which is where you will write the content to the page-->
    <Slip cont={state == 0 ? false : true} contSymbol={state == 0 ? "" : contSymbol} lightDark={lightDark} bind:dateModal={dateModal} bind:timeStuff={timeStuff} bind:timeValue={timeValue} bind:dateValue={dateValue} bind:outputText={outputText}/>
    
</div>

<style></style> 