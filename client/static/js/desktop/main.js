import { Dom } from "./vanilla/ui/dom.js";

export class Main{
    constructor(){
        this.bindEvents();
        this.activeTab = Dom.query(".tab.active");
        this.activeButton = Dom.query(".tabButton.active");
    }
    bindEvents(){
        Dom.query("#tab-buttons button").each((button)=>{
            button.on("click", this.activateTab.bind(this));
        });
        Dom.query("#spaterButton").on('click',() => {
            this.activeTab.removeClass("active");
            Dom.query('#fragezeichen').addClass("blink");
        });
        Dom.query("#jetztButton").on('click', () => {
            this.activeTab.removeClass("active");
            this.activeTab.next().addClass("active");
        });
        Dom.query("#nichtButton").on('click', () => {
            Dom.query('#fragezeichen').remove();
        });
    }
    activateTab(e){
        const btn = e.target.closest("button");
        if(!btn) return;
        
        const tabKey = btn.get('data-tab');
        if(!tabKey) return;

        const newTab = Dom.query(`.tab[data-tab=${tabKey}]`);
        if(!newTab) return;

        this.activeTab.removeClass("active");
        this.activeButton.removeClass("active");

        newTab.addClass("active");
        btn.addClass("active");

        this.activeTab = newTab;
        this.activeButton = btn;
    }
}