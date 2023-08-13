<script lang="ts">
    import {onMount} from "svelte";
    import  jsPDF  from "jspdf"; 
    import "../app.css"; //Import tailwindcss meta data to be used here
    import Modal from "$lib/modal.svelte"; //This will open the different modals (menu, save pdf, and date modals)
    import Slip from "$lib/slip.svelte"; //This will hold the content to the page
    import Menu from "$lib/menu.svelte"; //This will actually be the menu modal (it will actually generate the content)
    import { base } from "$app/paths"; 
    import {createPDF, lightDarkFunc, blackContBorder, whiteContBorder} from "$lib/createPDF.js";
    
    /*-----
    VARIABLES STAYING ON THIS PAGE OR BEING PUSHED TO EVER PAGE
    -----*/
    let alertModal : boolean = true;

    //This is used for binding the window width
    let windowWidth : number = 100000;

    //Save modal info
    let savePDFModal : boolean = false;
    let saveClick : boolean = false;

    //This will trigger the light and dark mode
    let lightModeTrigger : string = "right-[2.5px]";

    /*<option value="#yyyy/mm/dd">Year / Month (#) / Day</option>
                        <option value="#yyyy.mm.dd">Year . Month (#) . Day</option>
                        <option value="#yyyy-mm-dd">Year - Month (#) - Day</option>
                        <option value="#mm dd, year">Month (#) Day, Year</option>
                        <option value="yyyy/mm/dd">Year / Month / Day</option>
                        <option value="yyyy.mm.dd">Year . Month . Day</option>
                        <option value="yyyy-mm-dd">Year - Month - Day</option>
                        <option value="mm dd, year*/

    let dateString : string[] = ["Year / Month (#) / Day", "Year. Month (#) . Day", "Year - Month (#) - Day", "Month (#) Day, Year", "Year / Month / Day", "Year . Month . Day", "Year - Month - Day", "Month Day, Year"]
    let dateFormatList : string[] = ["#yyyy/mm/dd", "#yyyy.mm.dd", "#yyyy-mm-dd", "#mm dd, yyyy", "yyyy/mm/dd", "yyyy.mm.dd", "yyyy-mm-dd", "mm dd, yyyy"]
    let dateFormatDate = "#yyyy/mm/dd";
    let dateFormatTime = "#yyyy/mm/dd";

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
    let timeValue : string = "(time)"; //pushed to timeValue on slip.svelte (This will hold the total time)
    let totalTime : string; //THis is the total time after it has been editted.
    
    //These variables will be used for the date, and will combine the time and date together.
    let timeDate : string = "";
    let on : string = "";
    let finalTime : string = "(time)"; //This is bound to modals, and the slip page

    //This will change the color of the dividing line
    let color : string = "black";
    
    //This will set the state of the preview from the menu
    let state : number = 1;

    //This is for the page for light and dark mode restrictions
    let contSymbol : string = blackContBorder;
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

    //This is part of the menu
    let button : boolean = false;


    //Reactive Styling
    $: {
        if(windowWidth >= 500) {
            lightDark = "bg-white text-black-200";
            color = "black";
            lightModeTrigger = "right-[2.5px]";
            contSymbol = blackContBorder;
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

<!--These are some alerts that will pop up telling the users what is going on-->
{#if alertModal}
    <Modal classData="w-[100vw] h-[100vh] absolute z-50 bg-black-100">
        <div class="bg-blue-900 p-[20px] rounded-3xl absolute z-50 top-[70px] left-4">
            <p class="text-blue-1000 text-lg w-[150px]"><u>ALERT:</u> Click on the boxes with a border around them to edit the document</p>
        </div>
        {#if windowWidth <= 856}
            <div class="bg-blue-900 p-[20px] rounded-3xl absolute z-50 top-[260px] left-4">
                <p class="text-blue-1000 text-lg w-[150px]"><u>ALERT:</u> For screens less than the width of a paper, you need to click 'preview' to print or save as a pdf</p>
            </div>
        {/if}
        <div class="p-[15px] bg-blue-900 overflow-hidden absolute top-[70px] left-[210px] z-50 rounded-3xl" on:click={()=>{alertModal = !alertModal;}} on:keypress={()=>{}}>
            <img src="{base}/light_close.png" width="15" alt="close icon"/>
        </div>
    </Modal>
{/if}

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
        {#if !previewOpen}
            <div class="rounded-3xl bg-blue-900 text-white">
                <div 
                role="menuitem" 
                tabindex="-2" 
                on:click={()=>{
                    //This will return and unpack all the variables
                    [lightModeTrigger, lightDark, contSymbol, color] = lightDarkFunc(lightModeTrigger, lightDark, contSymbol, color);
                }} 
                on:keydown={()=>{}} 
                class="rounded-3xl bg-blue-900 w-[60px] h-[30px] float-right overflow-hidden relative">
                    <!--This is the light icon-->
                    <div class="w-[25px] h-[25px] bg-blue-1000 rounded-3xl absolute top-[2.5px] {lightModeTrigger}">
                        <!--Light and Dark Icon-->
                        <img src="{base}/sun.png" class="mx-[auto] mt-[2.5px]" width="20" alt="light-dark-icon"/>
                    </div>
                </div>
            </div>
        {/if}

    </Modal>
    {/if}
</div>

{#if dateModal}
    <div class="absolute w-[100vw] h-[100vh] bg-black-100 z-40 flex jusity-content items-center">

        <Modal classData="inline-block mx-auto overflow-visible" bind:finalTime={finalTime} bind:date={dateValue} bind:time={totalTime} formatDate={dateFormatDate} formatDateTime={dateFormatTime}>
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
                    <input id="tdate" bind:value={timeDate} type="date" class="mb-[5px]"/><br>

                    <p>----------------</p>

                    <label for="format" class="mt-[5px] w-[200px]">Pick a date format (If the Month has the # <br> after, that means the numeric month)</label><br>
                    <select name="format" bind:value={dateFormatTime}>
                        {#each dateFormatList as dfl, i}
                            <option value="{dfl}">{dateString[i]}</option>
                        {/each}
                    </select>
                {:else}
                    <label for="date">Pick a date: </label>
                    <input id="date" bind:value={dateValue} type="date" class="mb-[5px]"/><br>

                    <p>----------------</p>

                    <label for="format" class="mt-[5px] w-[200px]">Pick a date format (If the Month has the # <br> after, that means the numeric month)</label><br>
                    <select name="format" bind:value={dateFormatDate}>
                        {#each dateFormatList as dfl, i}
                            <option value="{dfl}">{dateString[i]}</option>
                        {/each}
                    </select>
                {/if}

            </div>
        </Modal>

    </div>
{/if}

{#if savePDFModal}
<div class="absolute w-[100vw] h-[100vh] bg-black-100 z-50 flex jusity-content items-center">
    <Modal classData="mx-auto overflow-visible">
        <div class="p-[20px] bg-blue-1000 rounded-md relative">
            <!--This will open and close the element-->
            <div class="p-[7.5px] rounded-3xl bg-white absolute top-[-35px] right-0" role="button" tabindex="-3" on:keypress={()=>{}} on:click={()=>{
                savePDFModal = !savePDFModal; //Boolean toggle
            }}>
                <img src="{base}/close.png" width="15" alt="close-icon"/>    
            </div>

            <!--This will allow the users to write the file name as they please-->
            <label for="save_file" class="font-bold">File Name</label><br>
            <input class="mb-[10px] mt-[5px] border-2 border-blue-900 outline-none pl-[3px]" type="text" name="save_file" bind:value={fileName} on:blur={(e)=>{
                if(fileName.length == 0) {
                    fileName = "Demerit_Slip"
                }
            }}/> 
            <!--This will just be the date string that will displayed if the user clicks yes.-->
            <label for="save_file">{fileDate}</label><br>

            <!--This will add the data to the end of the file name as an option-->
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

            <!--This will be the button that actually triggers the document to be saved-->
            <button on:mouseup={()=>{
                //Don't want to keep adding the date to the end of the file.
                if(fileName.indexOf(fileDate) == -1) {
                    fileName += fileDate;
                }
                
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

<!--------------------------------->
<!--This is the main content area, this is what will be seen on the main size of the site-->
<!--------------------------------->
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

<div class="h-[100%] w-auto overflow-x-hidden flex justify-center {color === 'white' ? 'paper:bg-black-200' : 'paper:bg-white'}">

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
<!--------------------------------->
<!--------------------------------->
<!--------------------------------->

<!--This will be the save modal-->


<style></style> 