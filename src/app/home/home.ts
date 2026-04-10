import { Component } from '@angular/core';
import { Header } from "../layout/header/header";
import { Landing } from "../pages/landing/landing";

@Component({
  selector: 'app-home',
  imports: [Header, Landing],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

}
