import { Dom } from "./vanilla/ui/dom.js";
import { SplitBar } from "./splitbar.js";
import { Notice } from "./splitbar.js";

export class Main{
    constructor(){
        this.bindEvents();
        this.activeTab = Dom.query(".tab.active");
        this.activeButton = Dom.query(".tabButton.active");
        this.fragezeichen = Dom.query('#fragezeichen');

        this.splitBars = new Map();

        Dom.query(".question.checkboxes").each((quest) => {
            this.initBar(quest, quest.next());
        });

        new Notice();

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
            window.scrollTo(0, 0);

            this.splitBars.values().forEach(bar => {
                bar.changeDragHandlePosition();
            });
        });
        Dom.query(".zuruck").on('click', () => {
            const btn = this.activeButton.prev();

            this.activateTab({target: btn});
            window.scrollTo(0, 0);

            this.splitBars.values().forEach(bar => {
                bar.changeDragHandlePosition();
            });
        });
        Dom.query('#verwerfen').on('click', () => {
            this.activeButton.removeClass('active');
            this.activeTab.removeClass('active');
            this.fragezeichen.remove();
        });
        Dom.query('.question.checkboxes input').on('change', this.loadCheckboxes.bind(this));

        Dom.query('.emoji').on('click', this.activateEmoji.bind(this));
    }
    activateEmoji(e){
        if(this.activeEmoji)
            this.activeEmoji.removeClass('active');

        this.activeEmoji = e.target;

        this.activeEmoji.addClass('active');
    }
    loadCheckboxes(e) {
        const inp = e.target;
        const question = inp.closest(".question");
        const bar = question.next();

        if(!inp.checked && this.splitBars.has(bar) && question.find('input:checked').length <= 1){
            this.splitBars.get(bar).destroy()?.();
            this.splitBars.delete(bar);
            bar.hide();

            return;
        }

        this.initBar(question, bar);
    }
    initBar(question, bar){
        if(question.find('input:checked').length > 1){
            if(this.splitBars.get(bar))
                this.splitBars.get(bar).reload();
            else{
                bar.show('flex');
                this.splitBars.set(bar, new SplitBar(bar));
            }

            question.parent().find('.notice').show();
        }
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