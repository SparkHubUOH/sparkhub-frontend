import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService } from '../../services/translation/translation';
import { TranslateModule } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
import { Header } from "../../layout/header/header";

@Component({
  selector: 'app-log-in',
  imports: [CommonModule, TranslateModule, RouterLink, Header],
  templateUrl: './log-in.html',
  styleUrl: './log-in.css',
})
export class LogIn {
  currentLang = 'en';

  constructor(private translate: TranslateService) {
    this.translate.setDefaultLang('en');
    this.translate.use('en');
  }

  toggleLanguage() {
    this.currentLang = this.currentLang === 'en' ? 'ar' : 'en';
    this.translate.use(this.currentLang);

    document.documentElement.dir =
      this.currentLang === 'ar' ? 'rtl' : 'ltr';
  }
}
