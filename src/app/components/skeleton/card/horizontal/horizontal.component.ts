import { Component } from '@angular/core';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzFlexDirective, NzFlexModule } from "ng-zorro-antd/flex";
@Component({
  selector: 'app-skeleton-horizontal',
  imports: [
    NzSkeletonModule,
    NzFlexDirective,
    NzFlexModule
],
  templateUrl: './horizontal.component.html',
  styleUrl: './horizontal.component.scss'
})
export class SkeletonCardHorizontalComponent {

}
