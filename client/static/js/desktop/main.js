import { Dom } from "./vanilla/ui/dom.js";

export class Main{
    constructor(){
        this.bindEvents();
        this.activeTab = Dom.query(".tab.active");
        this.activeButton = Dom.query(".tabButton.active");
        this.fragezeichen = Dom.query('#fragezeichen');
    }
    bindEvents(){
        Dom.query("#tab-buttons button").each((button)=>{
            button.on("click", this.activateTab.bind(this));
        });
        Dom.query("#spaterButton").on('click',() => {
            this.activeTab.removeClass("active");
            this.fragezeichen.addClass("blink");
        });
        Dom.query("#jetztButton").on('click', () => {
            const btn = Dom.query(".tabButton")[1];

            this.activateTab({target: btn});
        });
        Dom.query("#nichtButton").on('click', () => {
            this.fragezeichen.remove();
        });
        Dom.query('#fragezeichen').on('click', () => {
            const btn = Dom.query(".tabButton")[0];
            this.fragezeichen.removeClass("blink");

            this.activateTab({target: btn});
        });
        Dom.query(".weiter").on('click', () => {
            const btn = this.activeButton.next();

            this.activateTab({target: btn});
        });
        Dom.query('#verwerfen').on('click', () => {
            this.activeButton.removeClass('active');
            this.activeTab.removeClass('active');
            this.fragezeichen.remove();
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