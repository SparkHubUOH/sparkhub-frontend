import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RouterLink } from "@angular/router";
import { Sidebar } from "../../sidebar/sidebar";

@Component({
  selector: 'app-clubs',
  standalone: true,
  imports: [CommonModule, TranslateModule, RouterLink, Sidebar],
  templateUrl: './clubs.html',
  styleUrl: './clubs.css',
})
export class Clubs {
  currentLang = 'en';

  clubs = [
    {
      avatar: 'AI',
      titleKey: 'CLUBS_PAGE.CARDS.01.TITLE',
      descriptionKey: 'CLUBS_PAGE.CARDS.01.DESCRIPTION',
    },
    {
      avatar: 'PG',
      titleKey: 'CLUBS_PAGE.CARDS.02.TITLE',
      descriptionKey: 'CLUBS_PAGE.CARDS.02.DESCRIPTION',
    },
    {
      avatar: 'CS',
      titleKey: 'CLUBS_PAGE.CARDS.03.TITLE',
      descriptionKey: 'CLUBS_PAGE.CARDS.03.DESCRIPTION',
    },
    {
      avatar: 'FL',
      titleKey: 'CLUBS_PAGE.CARDS.04.TITLE',
      descriptionKey: 'CLUBS_PAGE.CARDS.04.DESCRIPTION',
    },
  ];

  constructor(private translate: TranslateService) {}

  ngOnInit() {
    this.currentLang = this.translate.currentLang;

    this.translate.onLangChange.subscribe((event) => {
      this.currentLang = event.lang;
    });
  }
}
