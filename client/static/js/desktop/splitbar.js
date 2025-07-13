import { Dom } from "./vanilla/ui/dom.js";

export class SplitBar{
    constructor(container){
        this.container = container;
        this.dragging = null;

        this.addParts();

        this.changePartWidth();

        this.bindDragingEvent();
    }
    reload(){
        this.addParts();
        this.changePartWidth();
        this.bindDragingEvent();
    }
    addParts(){
        this.container.clear();

        const inputs = this.container.prev().find('input:checked');

        inputs.forEach((inp) => {
            let parts = this.container.find('.part');
            if(parts.length > 0){
                this.addDragHandle();
            }
            Dom.render("#part-template", this.container, {
                text: inp.closest('label').text()
            });
        });

        if(inputs.length > 1){
            let width = Math.round((100 / inputs.length) * 10) / 10;
            this.container.find('.part').each((part) => {
                part.find('.procent').html(`${width}%`);
            });
            this.changeDragHandlePosition();
        }

        this.colorfulParts();
    }
    colorfulParts(){
        let i = 1;
        this.container.find('.part').forEach((part) => {
            if(!part.className.includes(`part-${i}`))
                part.addClass(`part-${i}`);
            i++;
        });
    }
    addDragHandle(){
        this.container.insertAdjacentHTML("beforeend", Dom.query("#drag-template").innerHTML);
    }
    changePartWidth(){
        let partWidth = 100 / this.container.find('.part').length;
        this.container.find('.part').forEach((part) => {
            part.css('width', `${partWidth}%`);
        });
    }
    changeDragHandlePosition(){
        this.container.find('.drag-handle').forEach((handle) => {
            const container = handle.parentElement;
            const leftPart = handle.previousElementSibling;
            const parts = Array.from(container.find('.part'));

            this.offset = 0;

            for (const part of parts) {
                if (part === leftPart) break;
                this.offset += part.offsetWidth;
            }

            const leftPartWidth = leftPart.offsetWidth;
            const handleWidth = handle.offsetWidth;

            const handleLeft = this.offset + leftPartWidth - (handleWidth / 2);

            handle.style.left = `${handleLeft}px`;
        });
    }
    bindDragingEvent(){
        this.container.find('.drag-handle').forEach(handle => {
            handle.on('mousedown', this.mousedown.bind(this));
        });
        this.container.on('mouseup', this.mouseup.bind(this));
        this.container.on('mousemove', this.mousemove.bind(this));
    }
    mousedown(e) {
        this.dragging = e.target;
        this.procentContainer = this.dragging.find('div');
        document.body.style.cursor = "ew-resize";
        e.preventDefault();
    }
    mouseup(){
        this.dragging = null;
        this.procentContainer = null;
        document.body.style.cursor = "";
    }
    mousemove(e){
        if (!this.dragging) return;

        const rect = this.container.getBoundingClientRect();
        const totalWidth = rect.width;
        const mouseX = e.clientX - rect.left;

        const parts = this.findAdjacentParts(this.dragging);
        const procent1 = parts[0].find('.procent');
        const procent2 = parts[1].find('.procent');

        let offset = 0;
        let node = parts[0].previousElementSibling;
        while (node) {
            if (node.classList.contains('part')) {
                offset += node.offsetWidth;
            }
            node = node.previousElementSibling;
        }

        const offsetPercent = (offset / totalWidth) * 100;

        const partsTotal = parseFloat(parts[0].style.width) + parseFloat(parts[1].style.width);

        let rawPercent = (mouseX / totalWidth) * 100;
        let newLeftPercent = Math.max(0, Math.min(partsTotal, rawPercent - offsetPercent));

        let part1Width = newLeftPercent;
        let part2Width = (partsTotal - newLeftPercent);
        parts[0].style.width = part1Width + "%";
        parts[1].style.width = part2Width + "%";

        procent1.text((Math.round(part1Width * 10) / 10) + "%");
        procent2.text((Math.round(part2Width * 10) / 10) + "%");

        this.dragging.style.left = (offsetPercent + newLeftPercent - ((this.dragging.offsetWidth / (totalWidth / 100)) / 2)) + "%";
    }
    findAdjacentParts(handle) {
        let prev = handle.previousElementSibling;
        while (prev && !prev.classList.contains('part')) {
            prev = prev.previousElementSibling;
        }

        let next = handle.nextElementSibling;
        while (next && !next.classList.contains('part')) {
            next = next.nextElementSibling;
        }

        return [prev, next];
    }
    destroy() {
		this.container.find('.drag-handle').forEach(handle => {
            handle.removeEventListener('mousedown', this.mousedown);
        });
        this.container.removeEventListener('mouseup', this.mouseup);
        this.container.removeEventListener('mousemove', this.mousemove);
        this.container.clear();
	}
}

export class Notice{
    constructor(){
        Dom.query('.notice a').on('click',(e) => {
            e.target.closest('.notice').hide();
        });
    }
}