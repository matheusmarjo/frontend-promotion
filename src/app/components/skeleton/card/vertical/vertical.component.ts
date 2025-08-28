import { Component } from '@angular/core';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';

@Component({
  selector: 'app-skeleton-vertical',
  imports: [
    NzSkeletonModule
  ],
  templateUrl: './vertical.component.html',
  styleUrl: './vertical.component.scss'
})
export class SkeletonCardVerticalComponent {

}
