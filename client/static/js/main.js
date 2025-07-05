import { Dom } from "./vanilla/dom.js";

export class Menu{
    constructor(){
        this.bindEvents();
        this.activeTab = Dom.query(".tab.active");
        this.activeButton = Dom.query(".tabButton.active");
    }
    bindEvents(){
        Dom.query("#tab-buttons button").each((button)=>{
            button.on("click", this.activateTab.bind(this));
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