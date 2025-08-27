import { Component } from '@angular/core';
import { HighlightsComponent } from '../../components/highlights/highlights.component';

@Component({
  selector: 'app-home',
  imports: [
    HighlightsComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
