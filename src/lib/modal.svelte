<script lang="ts">
    import { onDestroy, onMount } from "svelte";
    import "../app.css";
    const previousFocused = typeof document !== 'undefined' && document.activeElement;

    onMount(()=>{
        console.log(previousFocused);
    });

    if(previousFocused) {
        onDestroy(()=>{
            console.log(previousFocused);
            let pf = previousFocused as HTMLElement;
            pf.focus();
        });
    }
</script>

<div class="w-auto h-auto inline-block bg-blue-1000 fixed top-[70px] p-2 right-4 text-white z-50 text-center rounded-md shadow-in ">
    <slot></slot>
</div>
