import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

    hide = true;
    constructor() { }

    ngOnInit(): void {
    }

    toggleSidebar($event: MouseEvent): void {
        this.hide = !this.hide;
        document.getElementsByTagName('app-sidebar')[0].classList.toggle('closed');
        if($event.target instanceof Element) {
            $event.target.classList.toggle('closed');
        }
        console.log(document.getElementsByTagName('app-sidebar')[0]);
    }

}
