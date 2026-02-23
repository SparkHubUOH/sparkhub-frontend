import { Component, Inject } from '@angular/core';
import { TranslateService } from '../../services/translation/translation';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  imports: [TranslateModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header  {
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

