import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateService } from '../../services/translation/translation';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing',
  imports: [TranslateModule, RouterLink, CommonModule],
  templateUrl: './landing.html',
  styleUrl: './landing.css',
})
export class Landing {

  currentLang = 'en';
  languageSelected: string;

  constructor(private translate: TranslateService) {
    const initialLang = localStorage.getItem('lang') || 'en';
    this.languageSelected = initialLang;
  }

  ngOnInit() {
    this.currentLang = this.translate.currentLang;

    this.translate.onLangChange.subscribe(event => {
      this.currentLang = event.lang;
    });
  }
}