import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

import { MatIcon } from '@angular/material/icon';
import {
  RouterModule,
} from '@angular/router';


@Component({
  selector: 'app-side-menu',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIcon,
    RouterModule,
  ],
  templateUrl: './side-menu.component.html',
  styleUrl: './side-menu.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideMenuComponent {
  @Input({ required: true }) icon!: string;
  @Input({ required: true }) title!: string;
  @Input({ required: true }) descriptions!: string;
  @Input({ required: true }) path!: string;
  @Input() subRoutes!: any[];

  showSubMenu = false;

  onMouseEnter() {
    this.showSubMenu = true;
  }

  onMouseLeave() {
    this.showSubMenu = false;
  }

}
