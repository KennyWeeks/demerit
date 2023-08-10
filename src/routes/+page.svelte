<script lang="ts">
    import {onMount} from "svelte";
    import  jsPDF  from "jspdf"; 
    import "../app.css"; //Import tailwindcss meta data to be used here
    import Modal from "$lib/modal.svelte"; //This will open the different modals (menu, save pdf, and date modals)
    import Slip from "$lib/slip.svelte"; //This will hold the content to the page
    import Menu from "$lib/menu.svelte"; //This will actually be the menu modal (it will actually generate the content)
    import { base } from "$app/paths"; 
    import {createPDF} from "$lib/createPDF.js";
    
    /*-----
    VARIABLES STAYING ON THIS PAGE OR BEING PUSHED TO EVER PAGE
    -----*/
    let width : number = 11;
    let lightIcon : string = "dark.png";

    //This is used for binding the window width
    let windowWidth : number = 100000;

    //Save modal info
    let savePDFModal : boolean = false;
    let saveClick : boolean = false;

    //This will trigger the light and dark mode
    let lightModeTrigger : string = "right-[2.5px]";

    //This is part of the menu
    let button : boolean = false;

    /*-----
    VARIABLES GOING TO SLIP MODAL
    -----*/

    //THis will create some default values for the output strings
    //Bound to variable on slip.svelte
    let outputText : {[key:string] : string} = {};
    let temp : {[key:string]: string} = {"#": "(#)", "time": "(time)", "a/an": "(a/an infraction)", "who": "(Who assigned you the demerit, if Capt. Spell out Captain)", "elipsis": "...", "name": "your name here", "date": "date of demerit", "hr": "1234"}
    for(let k in temp) {
        outputText[k] = temp[k];
    }

    //These will be some values I will bind to the page, mostly to display the date modal
    let dateModal : boolean; //Bound to dateModal on slip.svelte (this will be triggered when click on either data contendible area)
    let dateValue : string = "date of demerit"; //THis is the default data value
    let timeStuff : boolean; //Bound to timeStuff on slip.svelte (This will trigger the time input, where users can imput the time)
    let timeValue : string; //pushed to timeValue on slip.svelte (This will hold the total time)
    let totalTime : string; //THis is the total time after it has been editted.
    
    //These variables will be used for the date, and will combine the time and date together.
    let timeDate : string = "";
    let on : string = "";
    let finalTime : string; //This is bound to modals, and the slip page

    //This will change the color of the dividing line
    let color : string = "black";
    
    //This will set the state of the preview from the menu
    let state : number = 1;

    //This is for the page for light and dark mode restrictions
    let contSymbol : string = "paper:border-white rounded-sm border border-black px-[5px] outline-0";
    let lightDark = "bg-white text-black-200";

    /*-----
    VARIABLES GOING TO MENU MODAL
    -----*/
    let fileName : string = "Demerit_Slip"; //This will also be pushed tothe menu modal
    let addDate : boolean = false; //This is the flag to add the date to the fileName
    let fileDate : string = ""; //This is the string to save the date to
    let previewText : string = "preview"; //This will be changed in the menu, it will either be edit or preview, depending on what the user has clicked.

    //These are bound to the two pages, and will be used to push content to each page and to the menu later
    let bigPage : HTMLElement | null = null;
    let smallPage : HTMLElement | null = null;

    //This will be open the preview
    let previewOpen : boolean = false;


    //Reactive Styling
    $: {
        if(windowWidth >= 500) {
            lightDark = "bg-white text-black-200";
            color = "black";
            lightModeTrigger = "right-[2.5px]";
            contSymbol = `paper:border-white rounded-sm border border-black px-[5px] outline-0`;
            button = false;
            previewOpen = false;
            previewText = "preview";
        };
        if(timeDate != "") {
            on = " on ";
        };
        totalTime = timeValue + on + timeDate;
    }


</script>

<!--Binding inner width here, created some reactive variables-->
<svelte:window bind:innerWidth={windowWidth}/>

<!--This will only be visible when the screen is smaller, it is the preview for the content-->
{#if previewOpen && windowWidth < 856}
<div class="absolute w-[100vw] h-[100vh] top-0 left-0 z-10 overflow-y-scroll bg-gray-100">
    <Slip 
    mobileDisplay={windowWidth < 856}
    cont={false} 
    contSymbol={""}
    outputText={outputText}
    timeValue={finalTime}
    dateValue={dateValue}
    editorVisible={false}
    bind:page={smallPage}
    bind:windowWidth={windowWidth}/>
</div>
{/if}

<!--This is the floating menu that will be available in the mobile form of the SVGSwitchElement-->
<div>
    {#if button}
    <Modal>
        <Menu 
        page={smallPage}
        mobileOptions={true}
        fileName={fileName}
        bind:previewOpen={previewOpen} 
        bind:button={button} 
        bind:windowWidth={windowWidth} 
        bind:previewText={previewText}
        bind:saveModal={savePDFModal}
        bind:saveClicked={saveClick}/>
        <!--This will flip between light and dark mode for the mobile platform-->
        <div class="rounded-3xl bg-blue-900 text-white">
            <div role="menuitem" tabindex="-2" on:click={()=>{
                //This will set all the preset variables to either be light or dark.
                if(lightModeTrigger == "right-[2.5px]") {
                    lightModeTrigger = "left-[2.5px]";
                    lightDark = "bg-black-200 text-white";
                    contSymbol = `paper:border-white rounded-sm border border-white px-[5px] outline-0`;
                    color = "white";
                    lightIcon = "light.png";
                    width = 20;
                } else {
                    lightModeTrigger = "right-[2.5px]";
                    lightDark = "bg-white text-black";
                    contSymbol = `paper:border-whtie rounded-sm border border-black px-[5px] outline-0`;
                    color = "black";
                    lightIcon = "dark.png"
                    width = 11;
                }
            }} on:keydown={()=>{}} class="rounded-3xl bg-blue-900 w-[60px] h-[30px] float-right overflow-hidden relative">
                <div class="w-[25px] h-[25px] bg-blue-1000 rounded-3xl absolute top-[2.5px] {lightModeTrigger}">
                    <!--Light and Dark Icon-->
                    <img src="{base}/{lightIcon}" class="mx-[auto] mt-[3px]" width="{width}" alt="light-dark-icon"/>
                </div>
            </div>
        </div>
    </Modal>
    {/if}
</div>

{#if dateModal}
    <div class="absolute w-[100vw] h-[100vh] bg-black-100 z-40 flex jusity-content items-center">

        <Modal classData="inline-block mx-auto overflow-visible" bind:finalTime={finalTime} bind:date={dateValue} bind:time={totalTime}>
            <div class="p-[20px] bg-blue-1000 rounded-md relative">

                <div class="p-[7.5px] rounded-3xl bg-white absolute top-[-35px] right-0" role="button" tabindex="-3" on:keypress={()=>{}} on:click={()=>{
                    dateModal = false;
                }}>
                    <img src="{base}/close.png" width="15" alt="close-icon"/>
                </div>

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

{#if savePDFModal}
<div class="absolute w-[100vw] h-[100vh] bg-black-100 z-50 flex jusity-content items-center">
    <Modal classData="mx-auto overflow-visible">
        <div class="p-[20px] bg-blue-1000 rounded-md relative">
            <div class="p-[7.5px] rounded-3xl bg-white absolute top-[-35px] right-0" role="button" tabindex="-3" on:keypress={()=>{}} on:click={()=>{
                savePDFModal = !savePDFModal; //Boolean toggle
            }}>
                <img src="{base}/close.png" width="15" alt="close-icon"/>    
            </div>
            <label for="save_file" class="font-bold">File Name</label><br>
            <input class="mb-[10px] mt-[5px] border-2 border-blue-900 outline-none pl-[3px]" type="text" name="save_file" bind:value={fileName} on:blur={(e)=>{
                if(fileName.length == 0) {
                    fileName = "Demerit_Slip"
                }
            }}/> <label for="save_file">{fileDate}</label><br>
            <label for="date_check" class="font-bold">Would you like to add today's date to the file name</label>
            <input type="checkbox" name="date_check" class="border-2 border-blue-900" on:change={()=>{
                addDate = !addDate;
                if(addDate) {
                    let d = new Date();
                    fileDate += "_" + d.getMonth() + "." + d.getDate() + "." + d.getFullYear();
                } else {
                    fileDate = "";
                }
            }}/><br>
            <button on:mouseup={()=>{
                console.log(smallPage);
                fileName += fileDate;
                //THis will be the canvas rendering context
                const canvas = document.createElement("canvas");
                canvas.width = 816;
                canvas.height = 1056;
                canvas.setAttribute("style", "background-color:#ffffff; margin:auto; outline:none;");

                //This is the context, which is where everything is rendered
                const ctx = canvas.getContext("2d");

                let doc = new jsPDF('p', 'px', [816, 1056]);

                createPDF(canvas, ctx, smallPage, doc);

            }} class="bg-blue-900 text-blue-1000 px-[10px] py-[5px] rounded-md mt-[10px]">Save as PDF</button>
        </div>
    </Modal>
</div>
{/if}


<div class="bg-blue-1000 py-2.5 px-[40px] inline-block fixed overflow-hidden rounded-3xl top-4 left-4 shadow-in z-10">
    <h3 class="text-blue-900">Demerit Slip</h3>


    <div class="h-auto w-auto bg-blue-1000 py-1.5 px-2.5 menu:p-0 inline-block overflow-hidden rounded-3xl fixed right-4 top-4 shadow-in z-100">
        <Menu 
        page={bigPage}
        fileName={fileName}
        bind:windowWidth={windowWidth} 
        bind:button={button}
        bind:state={state}
        bind:previewOpen={previewOpen}
        bind:previewText={previewText}
        bind:saveModal={savePDFModal}
        bind:saveClicked={saveClick}/>
    </div>

</div>

<div class="h-[100%] w-auto overflow-x-hidden flex justify-center paper:bg-white">

    <!--This is the main content area, which is where you will write the content to the page-->
    <Slip
    cont={state == 0 ? false : true} 
    contSymbol={state == 0 ? "" : contSymbol} 
    lightDark={lightDark}
    editorVisible={windowWidth <= 856 ? true : false}
    timeValue={finalTime}
    dateValue={dateValue}
    bind:page={bigPage} 
    bind:dateModal={dateModal} 
    bind:timeStuff={timeStuff} 
    bind:outputText={outputText}
    bind:windowWidth={windowWidth}
    />
    
</div>

<!--This will be the save modal-->


<style></style> 